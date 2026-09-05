package com.devflow.controller;

import com.devflow.entity.Quotation;
import com.devflow.entity.Enums;
import com.devflow.repository.QuotationRepository;
import com.devflow.service.AuditService;
import com.devflow.service.QuotationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Customer Portal Controller — SEPARATE from internal workspace.
 * Accessed via /api/portal/{token} — no JWT required (portal token auth)
 */
@RestController
@RequestMapping("/api/portal")
@RequiredArgsConstructor
public class PortalController {

    private final QuotationRepository quotationRepository;
    private final AuditService auditService;
    private final QuotationService quotationService;

    /**
     * GET /api/portal/{token} — get quotation by portal token (public endpoint)
     */
    @GetMapping("/{token}")
    public ResponseEntity<?> getQuotation(@PathVariable String token) {
        return quotationRepository.findByPortalToken(token)
                .map(q -> ResponseEntity.ok(Map.of(
                        "id", q.getId(),
                        "customerEmail", q.getCustomer() != null ? q.getCustomer().getEmail() : "",
                        "status", q.getStatus(),
                        "lines", q.getLines() != null ? q.getLines() : java.util.List.of(),
                        "orderTotal", q.getLines() != null
                                ? q.getLines().stream().mapToDouble(line -> line.getLineTotal() != null ? line.getLineTotal() : 0.0).sum()
                                : 0.0,
                        "blendedRiskScore", q.getBlendedRiskScore() != null ? q.getBlendedRiskScore() : 0.0,
                        "portalToken", q.getPortalToken()
                )))
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * POST /api/portal/{token}/negotiate — customer submits counter-proposal
     * Body: { counterDiscountPct, comment }
     */
    @PostMapping("/{token}/negotiate")
    public ResponseEntity<?> negotiate(
            @PathVariable String token,
            @RequestBody NegotiateRequest request) {

        Quotation q = quotationRepository.findByPortalToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid portal token"));

        q.setStatus(Enums.QuotationStatus.UNDER_NEGOTIATION);
        q.setUpdatedAt(LocalDateTime.now());

        // Apply counter discount to all lines
        if (request.counterDiscountPct() != null && q.getLines() != null) {
            q.getLines().forEach(line -> {
                line.setDiscountPct(request.counterDiscountPct());
                line.setLineTotal(line.getUnitPrice() * line.getQty() * (1 - request.counterDiscountPct()));
            });
        }
        q.setBlendedRiskScore(quotationService.calculateRiskScore(q));
        quotationRepository.save(q);

        auditService.record("QUOTATION", q.getId(), "CUSTOMER_NEGOTIATED", AuditService.CUSTOMER_PORTAL, String.format(
                "Counter discount: %.1f%%. Comment: %s",
                request.counterDiscountPct() != null ? request.counterDiscountPct() * 100 : 0,
                request.comment() != null ? request.comment() : ""
        ));

        return ResponseEntity.ok(Map.of(
                "message", "Negotiation request submitted",
                "status", q.getStatus(),
                "blendedRiskScore", q.getBlendedRiskScore(),
                "requiresApproval", q.getBlendedRiskScore() != null && q.getBlendedRiskScore() > 0
        ));
    }

    /**
     * POST /api/portal/{token}/confirm — customer confirms the quotation
     */
    @PostMapping("/{token}/confirm")
    public ResponseEntity<?> confirm(@PathVariable String token) {
        Quotation q = quotationRepository.findByPortalToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid portal token"));

        double score = quotationService.calculateRiskScore(q);
        q.setBlendedRiskScore(score);

        if (score > 0.08) {
            q.setStatus(Enums.QuotationStatus.PENDING_L2); // Re-enters approval!
        } else if (score > 0) {
            q.setStatus(Enums.QuotationStatus.PENDING_L1); // Re-enters approval!
        } else {
            q.setStatus(Enums.QuotationStatus.CONFIRMED);
        }
        q.setUpdatedAt(LocalDateTime.now());
        quotationRepository.save(q);

        auditService.record("QUOTATION", q.getId(), "CUSTOMER_CONFIRMED", AuditService.CUSTOMER_PORTAL,
                "Final status: " + q.getStatus());

        return ResponseEntity.ok(Map.of(
                "message", score > 0 ? "Terms exceed thresholds — re-entering approval flow" : "Quotation confirmed!",
                "status", q.getStatus(),
                "requiresApproval", score > 0
        ));
    }

    public record NegotiateRequest(Double counterDiscountPct, String comment) {}
}

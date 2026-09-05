package com.devflow.controller;

import com.devflow.entity.Quotation;
import com.devflow.repository.QuotationRepository;
import com.devflow.repository.AuditLogRepository;
import com.devflow.entity.AuditLog;
import com.devflow.entity.Enums;
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
    private final AuditLogRepository auditLogRepository;

    /**
     * GET /api/portal/{token} — get quotation by portal token (public endpoint)
     */
    @GetMapping("/{token}")
    public ResponseEntity<?> getQuotation(@PathVariable String token) {
        return quotationRepository.findByPortalToken(token)
                .map(q -> ResponseEntity.ok(Map.of(
                        "id", q.getId(),
                        "status", q.getStatus(),
                        "lines", q.getLines() != null ? q.getLines() : java.util.List.of(),
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
        quotationRepository.save(q);

        // Audit log — customer negotiation action
        AuditLog log = new AuditLog();
        log.setEntityType("QUOTATION");
        log.setEntityId(q.getId().toString());
        log.setAction("CUSTOMER_NEGOTIATED");
        log.setPerformedBy("CUSTOMER_PORTAL");
        log.setMetadata(String.format(
                "Counter discount: %.1f%%. Comment: %s",
                request.counterDiscountPct() != null ? request.counterDiscountPct() * 100 : 0,
                request.comment() != null ? request.comment() : ""
        ));
        log.setTimestamp(LocalDateTime.now());
        auditLogRepository.save(log);

        return ResponseEntity.ok(Map.of(
                "message", "Negotiation request submitted",
                "status", q.getStatus()
        ));
    }

    /**
     * POST /api/portal/{token}/confirm — customer confirms the quotation
     */
    @PostMapping("/{token}/confirm")
    public ResponseEntity<?> confirm(@PathVariable String token) {
        Quotation q = quotationRepository.findByPortalToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid portal token"));

        // Check if terms require re-approval
        double score = 0.0;
        if (q.getBlendedRiskScore() != null) score = q.getBlendedRiskScore();

        if (score > 0.08) {
            q.setStatus(Enums.QuotationStatus.PENDING_L2); // Re-enters approval!
        } else if (score > 0) {
            q.setStatus(Enums.QuotationStatus.PENDING_L1); // Re-enters approval!
        } else {
            q.setStatus(Enums.QuotationStatus.CONFIRMED);
        }
        q.setUpdatedAt(LocalDateTime.now());
        quotationRepository.save(q);

        AuditLog log = new AuditLog();
        log.setEntityType("QUOTATION");
        log.setEntityId(q.getId().toString());
        log.setAction("CUSTOMER_CONFIRMED");
        log.setPerformedBy("CUSTOMER_PORTAL");
        log.setMetadata("Final status: " + q.getStatus());
        log.setTimestamp(LocalDateTime.now());
        auditLogRepository.save(log);

        return ResponseEntity.ok(Map.of(
                "message", score > 0 ? "Terms exceed thresholds — re-entering approval flow" : "Quotation confirmed!",
                "status", q.getStatus(),
                "requiresApproval", score > 0
        ));
    }

    public record NegotiateRequest(Double counterDiscountPct, String comment) {}
}

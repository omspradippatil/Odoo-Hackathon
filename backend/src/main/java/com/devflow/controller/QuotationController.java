package com.devflow.controller;

import com.devflow.entity.Enums;
import com.devflow.entity.Quotation;
import com.devflow.entity.QuotationLine;
import com.devflow.repository.QuotationRepository;
import com.devflow.repository.UserRepository;
import com.devflow.repository.ProductRepository;
import com.devflow.service.QuotationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/quotations")
@RequiredArgsConstructor
public class QuotationController {

    private final QuotationService quotationService;
    private final QuotationRepository quotationRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    /**
     * GET /api/quotations — list all quotations for current user
     */
    @GetMapping
    public ResponseEntity<List<Quotation>> getAll(Authentication auth) {
        List<Quotation> quotations;
        if (auth != null && auth.getName() != null) {
            String email = auth.getName();
            var user = userRepository.findByEmail(email).orElse(null);
            if (user != null && user.getRole() != Enums.Role.ADMIN && user.getRole() != Enums.Role.SALES_MANAGER && user.getRole() != Enums.Role.FINANCE) {
                quotations = quotationRepository.findBySalesRep(user);
            } else {
                quotations = quotationRepository.findAll();
            }
        } else {
            quotations = quotationRepository.findAll();
        }
        quotations.forEach(q -> q.setLines(null));
        return ResponseEntity.ok(quotations);
    }

    /**
     * GET /api/quotations/{id} — get single quotation with lines
     */
    @GetMapping("/{id}")
    public ResponseEntity<Quotation> getById(@PathVariable Long id) {
        return quotationRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * POST /api/quotations — create quotation
     */
    @PostMapping
    public ResponseEntity<Quotation> create(@RequestBody QuotationRequest request, Authentication auth) {
        String email = (auth != null && auth.getName() != null) ? auth.getName() : "rep@devflow.com";
        var rep = userRepository.findByEmail(email).orElseGet(() -> userRepository.findByEmail("rep@devflow.com").orElseThrow());
        var customer = userRepository.findById(request.customerId()).orElseThrow();

        Quotation q = new Quotation();
        q.setSalesRep(rep);
        q.setCustomer(customer);
        q.setStatus(Enums.QuotationStatus.DRAFT);
        q.setCreatedAt(LocalDateTime.now());
        q.setUpdatedAt(LocalDateTime.now());
        q.setPortalToken(UUID.randomUUID().toString());

        if (request.lines() != null) {
            List<QuotationLine> lines = request.lines().stream().map(lr -> {
                var product = productRepository.findById(lr.productId()).orElseThrow();
                QuotationLine line = new QuotationLine();
                line.setProduct(product);
                line.setQty(lr.qty());
                line.setUnitPrice(lr.unitPrice() != null ? lr.unitPrice() : product.getBasePrice());
                line.setDiscountPct(lr.discountPct() != null ? lr.discountPct() : 0.0);
                line.setLineTotal(line.getUnitPrice() * line.getQty() * (1 - line.getDiscountPct()));
                line.setIsRecurring(product.getIsRecurring());
                line.setQuotation(q);
                return line;
            }).toList();
            q.setLines(lines);
        }

        Quotation saved = quotationService.createQuotation(q);
        return ResponseEntity.ok(saved);
    }

    /**
     * GET /api/quotations/{id}/risk-score — compute risk score for a quotation
     */
    @GetMapping("/{id}/risk-score")
    public ResponseEntity<Map<String, Object>> getRiskScore(@PathVariable Long id) {
        return quotationRepository.findById(id).map(q -> {
            double score = quotationService.calculateRiskScore(q);
            String level = score <= 0 ? "NONE" : score <= 0.08 ? "L1" : "L1_L2";
            java.util.HashMap<String, Object> result = new java.util.HashMap<>();
            result.put("score", score);
            result.put("approvalLevel", level);
            result.put("requiresApproval", score > 0);
            return ResponseEntity.ok((Map<String, Object>) result);
        }).orElse(ResponseEntity.notFound().build());
    }

    /**
     * PUT /api/quotations/{id}/send-to-customer — generate portal link
     */
    @PutMapping("/{id}/send-to-customer")
    public ResponseEntity<Map<String, String>> sendToCustomer(@PathVariable Long id) {
        return quotationRepository.findById(id).map(q -> {
            q.setStatus(Enums.QuotationStatus.SENT_TO_CUSTOMER);
            q.setUpdatedAt(LocalDateTime.now());
            if (q.getPortalToken() == null) q.setPortalToken(UUID.randomUUID().toString());
            quotationRepository.save(q);
            String portalUrl = "http://localhost:3000/portal/" + q.getPortalToken();
            return ResponseEntity.ok(Map.of("portalUrl", portalUrl, "token", q.getPortalToken()));
        }).orElse(ResponseEntity.notFound().build());
    }

    /**
     * PUT /api/quotations/{id}/confirm — customer confirms via portal
     */
    @PutMapping("/{id}/confirm")
    public ResponseEntity<Quotation> confirm(@PathVariable Long id) {
        return quotationRepository.findById(id).map(q -> {
            // Re-check if negotiated terms require approval
            double score = quotationService.calculateRiskScore(q);
            if (score > 0.08) {
                q.setStatus(Enums.QuotationStatus.PENDING_L2);
            } else if (score > 0) {
                q.setStatus(Enums.QuotationStatus.PENDING_L1);
            } else {
                q.setStatus(Enums.QuotationStatus.CONFIRMED);
            }
            q.setUpdatedAt(LocalDateTime.now());
            q.setLines(null); // avoid serialization loop
            return ResponseEntity.ok(quotationRepository.save(q));
        }).orElse(ResponseEntity.notFound().build());
    }

    // DTO records for request body
    public record QuotationRequest(Long customerId, List<LineRequest> lines) {}
    public record LineRequest(Long productId, Integer qty, Double unitPrice, Double discountPct) {}
}

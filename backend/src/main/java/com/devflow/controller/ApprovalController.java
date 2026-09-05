package com.devflow.controller;

import com.devflow.entity.Enums;
import com.devflow.entity.Quotation;
import com.devflow.repository.QuotationRepository;
import com.devflow.repository.UserRepository;
import com.devflow.repository.AuditLogRepository;
import com.devflow.entity.AuditLog;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/approvals")
@RequiredArgsConstructor
public class ApprovalController {

    private final QuotationRepository quotationRepository;
    private final UserRepository userRepository;
    private final AuditLogRepository auditLogRepository;

    /**
     * GET /api/approvals/pending — list all quotations pending approval
     */
    @GetMapping("/pending")
    public ResponseEntity<?> getPending() {
        var pendingL1 = quotationRepository.findByStatus(Enums.QuotationStatus.PENDING_L1);
        var pendingL2 = quotationRepository.findByStatus(Enums.QuotationStatus.PENDING_L2);
        // Remove lines to avoid serialization issues
        pendingL1.forEach(q -> q.setLines(null));
        pendingL2.forEach(q -> q.setLines(null));
        return ResponseEntity.ok(Map.of("pendingL1", pendingL1, "pendingL2", pendingL2));
    }

    /**
     * POST /api/approvals/{quotationId}/approve — approve a quotation
     */
    @PostMapping("/{quotationId}/approve")
    public ResponseEntity<Quotation> approve(
            @PathVariable Long quotationId,
            @RequestBody ApprovalRequest request,
            Authentication auth) {

        Quotation q = quotationRepository.findById(quotationId)
                .orElseThrow(() -> new RuntimeException("Quotation not found"));

        var reviewer = userRepository.findByEmail(auth.getName()).orElseThrow();

        // Determine next state
        if (q.getStatus() == Enums.QuotationStatus.PENDING_L1) {
            if (q.getBlendedRiskScore() != null && q.getBlendedRiskScore() > 0.08) {
                q.setStatus(Enums.QuotationStatus.PENDING_L2); // Send to L2
            } else {
                q.setStatus(Enums.QuotationStatus.APPROVED);
            }
        } else if (q.getStatus() == Enums.QuotationStatus.PENDING_L2) {
            q.setStatus(Enums.QuotationStatus.APPROVED);
        }
        q.setUpdatedAt(LocalDateTime.now());
        quotationRepository.save(q);

        // Audit log
        AuditLog log = new AuditLog();
        log.setEntityType("QUOTATION");
        log.setEntityId(quotationId.toString());
        log.setAction("APPROVED");
        log.setPerformedBy(reviewer.getEmail());
        log.setMetadata(request.reason() != null ? "Reason: " + request.reason() : "Approved");
        log.setTimestamp(LocalDateTime.now());
        auditLogRepository.save(log);

        q.setLines(null);
        return ResponseEntity.ok(q);
    }

    /**
     * POST /api/approvals/{quotationId}/reject — reject a quotation
     */
    @PostMapping("/{quotationId}/reject")
    public ResponseEntity<Quotation> reject(
            @PathVariable Long quotationId,
            @RequestBody ApprovalRequest request,
            Authentication auth) {

        Quotation q = quotationRepository.findById(quotationId)
                .orElseThrow(() -> new RuntimeException("Quotation not found"));

        var reviewer = userRepository.findByEmail(auth.getName()).orElseThrow();

        q.setStatus(Enums.QuotationStatus.REJECTED);
        q.setUpdatedAt(LocalDateTime.now());
        quotationRepository.save(q);

        AuditLog log = new AuditLog();
        log.setEntityType("QUOTATION");
        log.setEntityId(quotationId.toString());
        log.setAction("REJECTED");
        log.setPerformedBy(reviewer.getEmail());
        log.setMetadata(request.reason() != null ? "Reason: " + request.reason() : "Rejected");
        log.setTimestamp(LocalDateTime.now());
        auditLogRepository.save(log);

        q.setLines(null);
        return ResponseEntity.ok(q);
    }

    /**
     * POST /api/approvals/{quotationId}/return — return for revision
     */
    @PostMapping("/{quotationId}/return")
    public ResponseEntity<Quotation> returnForRevision(
            @PathVariable Long quotationId,
            @RequestBody ApprovalRequest request,
            Authentication auth) {

        Quotation q = quotationRepository.findById(quotationId).orElseThrow();
        q.setStatus(Enums.QuotationStatus.DRAFT);
        q.setUpdatedAt(LocalDateTime.now());
        quotationRepository.save(q);

        var reviewer = userRepository.findByEmail(auth.getName()).orElseThrow();
        AuditLog log = new AuditLog();
        log.setEntityType("QUOTATION");
        log.setEntityId(quotationId.toString());
        log.setAction("RETURNED_FOR_REVISION");
        log.setPerformedBy(reviewer.getEmail());
        log.setMetadata(request.reason());
        log.setTimestamp(LocalDateTime.now());
        auditLogRepository.save(log);

        q.setLines(null);
        return ResponseEntity.ok(q);
    }

    public record ApprovalRequest(String reason) {}
}

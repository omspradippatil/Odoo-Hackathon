package com.devflow.controller;

import com.devflow.entity.Enums;
import com.devflow.entity.Quotation;
import com.devflow.service.ApprovalService;
import com.devflow.service.AuditService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/approvals")
@RequiredArgsConstructor
public class ApprovalController {

    private final ApprovalService approvalService;
    private final AuditService auditService;

    @GetMapping("/pending")
    @PreAuthorize("hasAnyRole('SALES_MANAGER','FINANCE','ADMIN')")
    public ResponseEntity<Map<String, List<Quotation>>> pending() {
        var l1 = approvalService.pending(Enums.QuotationStatus.PENDING_L1);
        var l2 = approvalService.pending(Enums.QuotationStatus.PENDING_L2);
        return ResponseEntity.ok(Map.of("pendingL1", l1, "pendingL2", l2));
    }

    @PostMapping("/{quotationId}/approve")
    @PreAuthorize("hasAnyRole('SALES_MANAGER','FINANCE','ADMIN')")
    public ResponseEntity<Quotation> approve(
            @PathVariable Long quotationId,
            @RequestBody(required = false) ApprovalRequest request,
            Authentication auth) {
        boolean isFinance = hasRole(auth, "ROLE_FINANCE") || hasRole(auth, "ROLE_ADMIN");
        return ResponseEntity.ok(approvalService.approve(
                quotationId, reasonOf(request), auth.getName(), isFinance));
    }

    @PostMapping("/{quotationId}/reject")
    @PreAuthorize("hasAnyRole('SALES_MANAGER','FINANCE','ADMIN')")
    public ResponseEntity<Quotation> reject(
            @PathVariable Long quotationId,
            @RequestBody(required = false) ApprovalRequest request,
            Authentication auth) {
        return ResponseEntity.ok(approvalService.reject(quotationId, reasonOf(request), auth.getName()));
    }

    @PostMapping("/{quotationId}/return")
    @PreAuthorize("hasAnyRole('SALES_MANAGER','FINANCE','ADMIN')")
    public ResponseEntity<Quotation> returnForRevision(
            @PathVariable Long quotationId,
            @RequestBody(required = false) ApprovalRequest request,
            Authentication auth) {
        return ResponseEntity.ok(approvalService.returnForRevision(quotationId, reasonOf(request), auth.getName()));
    }

    /** Full immutable audit trail for one quotation. */
    @GetMapping("/{quotationId}/trail")
    public ResponseEntity<?> trail(@PathVariable Long quotationId) {
        return ResponseEntity.ok(auditService.trailFor("QUOTATION", quotationId));
    }

    private static String reasonOf(ApprovalRequest request) {
        return request != null ? request.reason() : null;
    }

    private static boolean hasRole(Authentication auth, String role) {
        return auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals(role));
    }

    public record ApprovalRequest(String reason) {}
}

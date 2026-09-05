package com.devflow.service;

import com.devflow.entity.Enums;
import com.devflow.entity.Quotation;
import com.devflow.exception.ResourceNotFoundException;
import com.devflow.repository.QuotationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Approval routing driven by the blended discount risk score.
 *
 *   score <= 0     auto-approved, never reaches a human
 *   0 < score <= 0.08   L1 (Sales Manager) sign-off
 *   score > 0.08        L1 then L2 (Finance) sign-off
 *
 * L1 approving a high-risk quote escalates it to L2 rather than approving outright.
 */
@Service
@RequiredArgsConstructor
public class ApprovalService {

    public static final double L2_THRESHOLD = 0.08;

    private final QuotationRepository quotationRepository;
    private final AuditService auditService;

    public List<Quotation> pending(Enums.QuotationStatus status) {
        return quotationRepository.findByStatus(status);
    }

    @Transactional
    public Quotation approve(Long quotationId, String reason, String actor, boolean actorIsFinance) {
        Quotation q = require(quotationId);
        Enums.QuotationStatus from = q.getStatus();

        if (from != Enums.QuotationStatus.PENDING_L1 && from != Enums.QuotationStatus.PENDING_L2) {
            throw new IllegalStateException("Quotation is " + from + " and is not awaiting approval");
        }

        String action;
        if (from == Enums.QuotationStatus.PENDING_L1) {
            boolean needsFinance = q.getBlendedRiskScore() != null && q.getBlendedRiskScore() > L2_THRESHOLD;
            if (needsFinance) {
                q.setStatus(Enums.QuotationStatus.PENDING_L2);
                action = "L1_APPROVED_ESCALATED_TO_L2";
            } else {
                q.setStatus(Enums.QuotationStatus.APPROVED);
                action = "L1_APPROVED";
            }
        } else {
            // PENDING_L2 is Finance's call.
            if (!actorIsFinance) {
                throw new org.springframework.security.access.AccessDeniedException(
                        "This quotation needs Finance (L2) sign-off");
            }
            q.setStatus(Enums.QuotationStatus.APPROVED);
            action = "L2_APPROVED";
        }

        q.setUpdatedAt(LocalDateTime.now());
        quotationRepository.save(q);
        auditService.record("QUOTATION", quotationId, action, actor,
                String.format("%s -> %s. Risk %.4f. %s", from, q.getStatus(),
                        q.getBlendedRiskScore() != null ? q.getBlendedRiskScore() : 0.0,
                        reason != null ? reason : ""));
        return q;
    }

    @Transactional
    public Quotation reject(Long quotationId, String reason, String actor) {
        Quotation q = require(quotationId);
        Enums.QuotationStatus from = q.getStatus();
        q.setStatus(Enums.QuotationStatus.REJECTED);
        q.setUpdatedAt(LocalDateTime.now());
        quotationRepository.save(q);
        auditService.record("QUOTATION", quotationId, "REJECTED", actor,
                String.format("%s -> REJECTED. %s", from, reason != null ? reason : "No reason given"));
        return q;
    }

    @Transactional
    public Quotation returnForRevision(Long quotationId, String reason, String actor) {
        Quotation q = require(quotationId);
        Enums.QuotationStatus from = q.getStatus();
        q.setStatus(Enums.QuotationStatus.DRAFT);
        q.setUpdatedAt(LocalDateTime.now());
        quotationRepository.save(q);
        auditService.record("QUOTATION", quotationId, "RETURNED_FOR_REVISION", actor,
                String.format("%s -> DRAFT. %s", from, reason != null ? reason : ""));
        return q;
    }

    private Quotation require(Long id) {
        return quotationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Quotation " + id + " not found"));
    }
}

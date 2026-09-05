package com.devflow.controller;

import com.devflow.dto.DashboardStats;
import com.devflow.entity.Enums;
import com.devflow.entity.Quotation;
import com.devflow.repository.PaymentRepository;
import com.devflow.repository.QuotationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final QuotationRepository quotationRepository;
    private final PaymentRepository paymentRepository;

    /**
     * GET /api/dashboard/stats — summary stats
     */
    @GetMapping("/stats")
    public ResponseEntity<DashboardStats> getStats() {
        long total = quotationRepository.count();
        long pendingL1 = quotationRepository.countByStatus(Enums.QuotationStatus.PENDING_L1);
        long pendingL2 = quotationRepository.countByStatus(Enums.QuotationStatus.PENDING_L2);
        long pendingApprovals = pendingL1 + pendingL2;
        double revenue = paymentRepository.findAll().stream()
                .filter(p -> p.getStatus() == Enums.PaymentStatus.RELEASED)
                .mapToDouble(p -> p.getAmount() != null ? p.getAmount() : 0.0)
                .sum();
        return ResponseEntity.ok(new DashboardStats(total, pendingApprovals, revenue));
    }

    /**
     * GET /api/dashboard/stalled — quotations stalled for > 7 days
     */
    @GetMapping("/stalled")
    public ResponseEntity<List<Quotation>> getStalled(
            @RequestParam(defaultValue = "7") int days) {
        LocalDateTime cutoff = LocalDateTime.now().minusDays(days);
        List<Quotation> stalled = quotationRepository.findStalled(cutoff);
        stalled.forEach(q -> q.setLines(null));
        return ResponseEntity.ok(stalled);
    }

    /**
     * GET /api/dashboard/anomalies — discount anomalies
     */
    @GetMapping("/anomalies")
    public ResponseEntity<List<Map<String, Object>>> getAnomalies() {
        // Quotations with blended risk score > 0.05 (suspicious)
        List<Map<String, Object>> anomalies = quotationRepository.findAll().stream()
                .filter(q -> q.getBlendedRiskScore() != null && q.getBlendedRiskScore() > 0.05)
                .map(q -> Map.<String, Object>of(
                        "quotationId", q.getId(),
                        "riskScore", q.getBlendedRiskScore(),
                        "status", q.getStatus(),
                        "rep", q.getSalesRep() != null ? q.getSalesRep().getEmail() : "unknown",
                        "createdAt", q.getCreatedAt()
                ))
                .toList();
        return ResponseEntity.ok(anomalies);
    }

    /**
     * GET /api/dashboard/pipeline — all quotations with status
     */
    @GetMapping("/pipeline")
    public ResponseEntity<Map<String, List<Quotation>>> getPipeline() {
        var all = quotationRepository.findAll();
        all.forEach(q -> q.setLines(null));

        Map<String, List<Quotation>> pipeline = Map.of(
                "DRAFT", all.stream().filter(q -> q.getStatus() == Enums.QuotationStatus.DRAFT).toList(),
                "PENDING", all.stream().filter(q -> q.getStatus() == Enums.QuotationStatus.PENDING_L1 ||
                        q.getStatus() == Enums.QuotationStatus.PENDING_L2).toList(),
                "APPROVED", all.stream().filter(q -> q.getStatus() == Enums.QuotationStatus.APPROVED).toList(),
                "CONFIRMED", all.stream().filter(q -> q.getStatus() == Enums.QuotationStatus.CONFIRMED).toList(),
                "REJECTED", all.stream().filter(q -> q.getStatus() == Enums.QuotationStatus.REJECTED).toList()
        );
        return ResponseEntity.ok(pipeline);
    }
}

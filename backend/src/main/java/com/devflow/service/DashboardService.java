package com.devflow.service;

import com.devflow.entity.Enums;
import com.devflow.entity.Payment;
import com.devflow.entity.Quotation;
import com.devflow.entity.QuotationLine;
import com.devflow.repository.PaymentRepository;
import com.devflow.repository.QuotationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Deal-health analytics. Read-only: never mutates the entities it reads, and returns
 * flat maps so nothing lazy is touched during serialisation.
 */
@Service
@RequiredArgsConstructor
public class DashboardService {

    /** A quote is "stalled" once it sits untouched this long in a non-terminal state. */
    private static final int STALLED_DAYS = 7;

    /** Flag a quote whose average discount exceeds the rep's own historical average by this factor. */
    private static final double ANOMALY_FACTOR = 1.5;

    private final QuotationRepository quotationRepository;
    private final PaymentRepository paymentRepository;

    public Map<String, Object> stats() {
        List<Quotation> all = quotationRepository.findAll();
        List<Payment> payments = paymentRepository.findAll();

        long pendingApprovals = all.stream().filter(q ->
                q.getStatus() == Enums.QuotationStatus.PENDING_L1
                        || q.getStatus() == Enums.QuotationStatus.PENDING_L2).count();

        double releasedRevenue = payments.stream()
                .filter(p -> p.getStatus() == Enums.PaymentStatus.RELEASED)
                .mapToDouble(p -> p.getAmount() != null ? p.getAmount() : 0.0).sum();

        double heldInEscrow = payments.stream()
                .filter(p -> p.getStatus() == Enums.PaymentStatus.HELD)
                .mapToDouble(p -> p.getAmount() != null ? p.getAmount() : 0.0).sum();

        double platformRevenue = payments.stream()
                .filter(p -> p.getStatus() == Enums.PaymentStatus.RELEASED)
                .mapToDouble(p -> p.getPlatformFee() != null ? p.getPlatformFee() : 0.0).sum();

        double pipelineValue = all.stream()
                .filter(q -> q.getStatus() != Enums.QuotationStatus.REJECTED)
                .mapToDouble(this::orderTotal).sum();

        long won = all.stream().filter(q -> q.getStatus() == Enums.QuotationStatus.CONFIRMED).count();
        long decided = all.stream().filter(q -> q.getStatus() == Enums.QuotationStatus.CONFIRMED
                || q.getStatus() == Enums.QuotationStatus.REJECTED).count();

        Map<String, Object> out = new LinkedHashMap<>();
        out.put("totalQuotations", all.size());
        out.put("pendingApprovals", pendingApprovals);
        out.put("stalledCount", stalled().size());
        out.put("anomalyCount", anomalies().size());
        out.put("pipelineValue", round2(pipelineValue));
        out.put("releasedRevenue", round2(releasedRevenue));
        out.put("heldInEscrow", round2(heldInEscrow));
        out.put("platformRevenue", round2(platformRevenue));
        out.put("winRate", decided == 0 ? 0.0 : round2((double) won / decided * 100));
        return out;
    }

    /** Quotations sitting untouched in a non-terminal state. */
    public List<Map<String, Object>> stalled() {
        LocalDateTime cutoff = LocalDateTime.now().minusDays(STALLED_DAYS);
        List<Map<String, Object>> out = new ArrayList<>();
        for (Quotation q : quotationRepository.findAll()) {
            if (q.getStatus() == Enums.QuotationStatus.CONFIRMED
                    || q.getStatus() == Enums.QuotationStatus.REJECTED) continue;
            LocalDateTime touched = q.getUpdatedAt() != null ? q.getUpdatedAt() : q.getCreatedAt();
            if (touched == null || touched.isAfter(cutoff)) continue;

            Map<String, Object> row = new LinkedHashMap<>();
            row.put("quotationId", q.getId());
            row.put("status", q.getStatus());
            row.put("customer", displayName(q.getCustomer()));
            row.put("rep", displayName(q.getSalesRep()));
            row.put("value", round2(orderTotal(q)));
            row.put("daysInactive", Duration.between(touched, LocalDateTime.now()).toDays());
            row.put("lastActivityAt", touched);
            out.add(row);
        }
        out.sort(Comparator.comparing(m -> -((Number) m.get("daysInactive")).longValue()));
        return out;
    }

    /**
     * Discount anomalies: a quote whose average discount runs well above what the same rep
     * usually gives. Compared against the rep's own baseline rather than a flat threshold,
     * so a rep who always sells at 12% doesn't trip the alarm on every deal.
     */
    public List<Map<String, Object>> anomalies() {
        List<Quotation> all = quotationRepository.findAll();

        Map<Long, List<Double>> discountsByRep = new LinkedHashMap<>();
        for (Quotation q : all) {
            if (q.getSalesRep() == null) continue;
            discountsByRep.computeIfAbsent(q.getSalesRep().getId(), k -> new ArrayList<>())
                    .add(avgDiscount(q));
        }

        List<Map<String, Object>> out = new ArrayList<>();
        for (Quotation q : all) {
            double quoteAvg = avgDiscount(q);
            if (quoteAvg <= 0) continue;

            Double repBaseline = q.getSalesRep() == null ? null
                    : discountsByRep.getOrDefault(q.getSalesRep().getId(), List.of())
                        .stream().mapToDouble(Double::doubleValue).average().orElse(0.0);

            boolean aboveOwnBaseline = repBaseline != null && repBaseline > 0
                    && quoteAvg > repBaseline * ANOMALY_FACTOR;
            boolean highRisk = q.getBlendedRiskScore() != null
                    && q.getBlendedRiskScore() > ApprovalService.L2_THRESHOLD;

            if (!aboveOwnBaseline && !highRisk) continue;

            Map<String, Object> row = new LinkedHashMap<>();
            row.put("quotationId", q.getId());
            row.put("status", q.getStatus());
            row.put("rep", displayName(q.getSalesRep()));
            row.put("customer", displayName(q.getCustomer()));
            row.put("riskScore", q.getBlendedRiskScore() != null ? round4(q.getBlendedRiskScore()) : 0.0);
            row.put("avgDiscountPct", round4(quoteAvg));
            row.put("repBaselinePct", repBaseline != null ? round4(repBaseline) : 0.0);
            row.put("value", round2(orderTotal(q)));
            row.put("reason", aboveOwnBaseline
                    ? String.format("Discount %.1f%% is %.1fx this rep's usual %.1f%%",
                        quoteAvg * 100, repBaseline == 0 ? 0 : quoteAvg / repBaseline, repBaseline * 100)
                    : "Blended risk score above the Finance threshold");
            row.put("severity", highRisk && aboveOwnBaseline ? "HIGH" : "MEDIUM");
            out.add(row);
        }
        out.sort(Comparator.comparing(m -> -((Number) m.get("riskScore")).doubleValue()));
        return out;
    }

    /** Quotations bucketed by pipeline stage, for the Kanban board. */
    public Map<String, List<Map<String, Object>>> pipeline() {
        Map<String, List<Map<String, Object>>> board = new LinkedHashMap<>();
        for (String stage : List.of("DRAFT", "PENDING", "APPROVED", "SENT", "CONFIRMED", "REJECTED")) {
            board.put(stage, new ArrayList<>());
        }
        for (Quotation q : quotationRepository.findAll()) {
            board.get(stageOf(q.getStatus())).add(card(q));
        }
        return board;
    }

    private String stageOf(Enums.QuotationStatus status) {
        if (status == null) return "DRAFT";
        return switch (status) {
            case DRAFT -> "DRAFT";
            case PENDING_L1, PENDING_L2 -> "PENDING";
            case APPROVED -> "APPROVED";
            case SENT_TO_CUSTOMER, UNDER_NEGOTIATION -> "SENT";
            case CONFIRMED -> "CONFIRMED";
            case REJECTED -> "REJECTED";
        };
    }

    private Map<String, Object> card(Quotation q) {
        Map<String, Object> row = new LinkedHashMap<>();
        row.put("id", q.getId());
        row.put("status", q.getStatus());
        row.put("customer", displayName(q.getCustomer()));
        row.put("rep", displayName(q.getSalesRep()));
        row.put("value", round2(orderTotal(q)));
        row.put("riskScore", q.getBlendedRiskScore() != null ? round4(q.getBlendedRiskScore()) : 0.0);
        row.put("lineCount", q.getLines() != null ? q.getLines().size() : 0);
        row.put("createdAt", q.getCreatedAt());
        row.put("updatedAt", q.getUpdatedAt());
        return row;
    }

    private double orderTotal(Quotation q) {
        if (q.getLines() == null) return 0.0;
        return q.getLines().stream()
                .mapToDouble(l -> l.getLineTotal() != null ? l.getLineTotal() : 0.0).sum();
    }

    private double avgDiscount(Quotation q) {
        if (q.getLines() == null || q.getLines().isEmpty()) return 0.0;
        return q.getLines().stream()
                .mapToDouble(l -> l.getDiscountPct() != null ? l.getDiscountPct() : 0.0)
                .average().orElse(0.0);
    }

    private String displayName(com.devflow.entity.User u) {
        if (u == null) return "—";
        if (u.getDisplayName() != null && !u.getDisplayName().isBlank()) return u.getDisplayName();
        return u.getEmail();
    }

    private static double round2(double v) { return Math.round(v * 100.0) / 100.0; }
    private static double round4(double v) { return Math.round(v * 10000.0) / 10000.0; }
}

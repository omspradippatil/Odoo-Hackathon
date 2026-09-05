package com.devflow.dto;

import java.time.LocalDate;
import java.util.List;

public record SalesReport(String filterDescription, Summary summary, List<Row> rows) {

    public record Summary(
            long count,
            double totalValue,
            double averageDiscountPct,
            double winRate,
            List<StatusBucket> byStatus) {}

    public record StatusBucket(String status, long count, double value) {}

    public record Row(
            Long quotationId,
            LocalDate date,
            String customer,
            String salesRep,
            String status,
            double value,
            double riskScore,
            double averageDiscountPct) {}
}

package com.devflow.dto;

import java.util.List;

public record RevenueReport(
        String filterDescription,
        double grossRevenue,
        double platformFeeRevenue,
        double sellerPayouts,
        double heldInEscrow,
        double refundedAmount,
        long paymentCount,
        List<StatusBucket> byStatus,
        List<MonthPoint> monthly) {

    public record StatusBucket(String status, long count, double amount) {}

    public record MonthPoint(
            String month,
            double gross,
            double platformFee,
            double payouts,
            double held,
            long transactions) {}
}

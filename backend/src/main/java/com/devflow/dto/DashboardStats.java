package com.devflow.dto;
import lombok.Data;
import lombok.AllArgsConstructor;

@Data @AllArgsConstructor
public class DashboardStats {
    private long totalQuotations;
    private long pendingApprovals;
    private double totalRevenue;
}

package com.devflow.dto;

import com.devflow.entity.Enums;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SellerLeaderboardDto {
    private Long sellerId;
    private String displayName;
    private String companyName;
    private String email;
    private Enums.Tier tier;
    private Double avgStars;
    private Integer totalTransactions;
    private Integer reviewCount;
    private String aiSummary;
}

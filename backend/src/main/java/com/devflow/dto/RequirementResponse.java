package com.devflow.dto;

import com.devflow.entity.Enums;

import java.time.LocalDateTime;

public record RequirementResponse(
        Long id,
        String title,
        String description,
        Integer qty,
        Double estimatedBudget,
        Long categoryId,
        String categoryName,
        LocalDateTime deadline,
        Enums.RequirementStatus status,
        boolean bidsRevealed,
        LocalDateTime createdAt,
        Buyer buyer,
        boolean owner,
        long bidCount,
        Double medianBid,
        /** One competitor's actual number — populated only for the buyer who posted this. */
        Double lowestBid) {

    /** The buying organisation is never anonymous, but its login email still stays server-side. */
    public record Buyer(Long id, String displayName, String companyName, String city) {
    }
}

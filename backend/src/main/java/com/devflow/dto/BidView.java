package com.devflow.dto;

import com.devflow.entity.Enums;

import java.time.LocalDateTime;

/**
 * The only shape a bid ever leaves the server in. When the bid is still anonymous
 * {@code vendor} is null — the real identity is absent from the payload rather than
 * merely hidden by the client.
 */
public record BidView(
        Long id,
        Long requirementId,
        String aliasLabel,
        /** What the caller should render: the alias while anonymous, the real name once revealed. */
        String displayLabel,
        VendorIdentity vendor,
        Double amount,
        LocalDateTime deliveryEta,
        String notes,
        Enums.BidStatus status,
        boolean anonymous,
        boolean mine,
        LocalDateTime createdAt) {

    public record VendorIdentity(
            Long id,
            String displayName,
            String companyName,
            String email,
            Enums.Tier tier,
            Double trustScore) {
    }
}

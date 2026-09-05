package com.devflow.dto;

import java.time.LocalDateTime;

public record BidRequest(
        Long requirementId,
        Double amount,
        LocalDateTime deliveryEta,
        String notes,
        /** Opt out to let the buyer (never rivals) see who you are before the reveal. Defaults to true. */
        Boolean isAnonymous) {
}

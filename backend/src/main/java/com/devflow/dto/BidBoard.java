package com.devflow.dto;

import com.devflow.entity.Enums;

import java.util.List;

/**
 * Bids for one requirement as a given caller is allowed to see them.
 * A rival vendor gets only their own bid in {@code bids} — the market signal is
 * what they get instead of the competition.
 */
public record BidBoard(
        Long requirementId,
        Enums.RequirementStatus requirementStatus,
        boolean identitiesRevealed,
        boolean owner,
        MarketStats market,
        List<BidView> bids) {
}

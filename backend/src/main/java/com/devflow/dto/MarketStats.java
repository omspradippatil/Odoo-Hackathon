package com.devflow.dto;

/**
 * Aggregate price signal for one requirement. Safe to hand to any authenticated user:
 * every figure is derived from the whole bid pool, so no single competitor's number
 * can be attributed to a competitor.
 */
public record MarketStats(
        Long requirementId,
        long bidCount,
        Double median,
        Double lowest,
        Double highest,
        Double estimatedBudget) {
}

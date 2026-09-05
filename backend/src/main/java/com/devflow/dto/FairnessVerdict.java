package com.devflow.dto;

/**
 * How one price compares with the standing market on a requirement.
 * {@code deltaPct} is negative when the bid undercuts the median.
 */
public record FairnessVerdict(
        Verdict verdict,
        Double amount,
        Double median,
        Double estimatedBudget,
        Double deltaPct,
        int comparedBids,
        String message) {

    public enum Verdict { BELOW_MARKET, COMPETITIVE, ABOVE_MARKET, INSUFFICIENT_DATA }
}

package com.devflow.dto;

public record BidSubmissionResponse(BidView bid, FairnessVerdict fairness) {
}

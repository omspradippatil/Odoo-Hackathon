package com.devflow.dto;

import java.time.LocalDateTime;

public record RequirementRequest(
        String title,
        String description,
        Integer qty,
        Double estimatedBudget,
        Long categoryId,
        LocalDateTime deadline) {
}

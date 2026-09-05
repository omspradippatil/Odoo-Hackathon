package com.devflow.dto;

import com.devflow.entity.Enums;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @AllArgsConstructor @NoArgsConstructor
public class AuthResponse {
    private String token;
    private Long id;
    private String email;
    private String displayName;
    private Enums.Role role;
    private Enums.Mode mode;
    private Enums.Tier tier;
    private Double trustScore;
    private Integer totalTransactions;
}

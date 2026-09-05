package com.devflow.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;

    @JsonIgnore  // NEVER expose password hash in API responses
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    private Enums.Role role;

    @Enumerated(EnumType.STRING)
    private Enums.Mode mode;

    @Enumerated(EnumType.STRING)
    private Enums.Tier tier;

    private Double trustScore;
    private Integer totalTransactions;
    private LocalDateTime createdAt;
}

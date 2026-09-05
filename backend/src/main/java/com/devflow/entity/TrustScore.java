package com.devflow.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class TrustScore {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @OneToOne private User user;
    @Enumerated(EnumType.STRING) private Enums.Tier tier;
    private Double avgStars;
    private Integer totalTransactions;
    private String aiSummary;
    private LocalDateTime updatedAt;
}

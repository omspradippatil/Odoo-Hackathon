package com.devflow.entity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "approval_chains")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class ApprovalChain {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Double discountMin;
    private Double discountMax;
    private Boolean requiresL1;
    private Boolean requiresL2;
}

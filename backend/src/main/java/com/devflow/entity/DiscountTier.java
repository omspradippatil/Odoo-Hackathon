package com.devflow.entity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "discount_tiers")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class DiscountTier {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Enumerated(EnumType.STRING) private Enums.Tier customerTier;
    private Double maxDiscountPct;
}

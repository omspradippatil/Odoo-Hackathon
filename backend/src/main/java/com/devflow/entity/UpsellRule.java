package com.devflow.entity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "upsell_rules")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class UpsellRule {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne private Product product;
    @ManyToOne private Product suggestedProduct;
    private Double marginThreshold;
    private Boolean isPromoted;
}

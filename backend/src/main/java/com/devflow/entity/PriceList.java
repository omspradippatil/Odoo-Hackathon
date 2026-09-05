package com.devflow.entity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "price_lists")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class PriceList {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Enumerated(EnumType.STRING) private Enums.Tier customerTier;
    @ManyToOne private Product product;
    private Double price;
    private String currency;
}

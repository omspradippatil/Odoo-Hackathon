package com.devflow.entity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Product {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    @ManyToOne private Category category;
    private Double basePrice;
    private String unit;
    private Double taxRate;
    private String description;
    private Boolean isRecurring;
}

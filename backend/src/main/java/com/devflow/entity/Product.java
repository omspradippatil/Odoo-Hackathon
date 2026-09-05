package com.devflow.entity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "products")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Product {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    @ManyToOne private Category category;
    private Double basePrice; // Selling / Offer price
    private Double actualPrice; // Original MRP / List price
    private String unit;
    private Double taxRate;
    private String description;
    private Boolean isRecurring;
    @ManyToOne private User seller;
    private String imageUrl;
}

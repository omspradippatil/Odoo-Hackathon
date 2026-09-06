package com.devflow.backend.product;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String category;

    private String brand;

    private Double basePrice;
    private Double originalPrice;
    private Double sellingPrice;

    private Boolean active;

    // Added fields for local seller product viewing
    @Column(columnDefinition = "TEXT")
    private String imageUrl;
    
    @Column(columnDefinition = "TEXT")
    private String description;

    private String sellerId;
    private String sellerName;
    private String city;
    private Integer stock;
    private Integer trustScore;
    private String verificationStatus;
}

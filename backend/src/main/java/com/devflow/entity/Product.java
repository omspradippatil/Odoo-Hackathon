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
    private Double basePrice;
    private String unit;
    private Double taxRate;
    private String description;
    private Boolean isRecurring;
    @ManyToOne private User seller;
    private String imageUrl;

}

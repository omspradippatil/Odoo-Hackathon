package com.devflow.entity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "stock")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Stock {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne private Warehouse warehouse;
    @ManyToOne private Product product;
    private Integer qtyAvailable;
}

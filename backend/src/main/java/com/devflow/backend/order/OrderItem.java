package com.devflow.backend.order;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "order_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String productId;
    private String sellerId;
    private String sellerName;
    private String name;
    private String image;
    private Integer quantity;
    private Double unitPrice;
}

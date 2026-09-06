package com.devflow.backend.cart;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cart_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItem {
    @Id
    private String id;
    private String productId;
    private String sellerId;
    private String sellerName;
    private String name;
    private String image;
    private Integer quantity;
    private Double unitPrice;
    private Integer availableQuantity;
}

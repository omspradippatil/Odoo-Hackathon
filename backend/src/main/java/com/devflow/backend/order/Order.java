package com.devflow.backend.order;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "local_orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {
    @Id
    private String id;
    private String buyerId;
    private Double subtotal;
    private Double platformFee;
    private Double total;
    private String paymentStatus;
    private String fulfilmentStatus;
    private String createdAt;
    private String title;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "order_id")
    private List<OrderItem> items;
}

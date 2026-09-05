package com.devflow.entity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Fulfillment {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne private Quotation quotation;
    @ManyToOne private Warehouse warehouse;
    @ManyToOne private Product product;
    private Integer qty;
    @Enumerated(EnumType.STRING) private Enums.FulfillmentStatus status;
}

package com.devflow.entity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "fulfillments")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Fulfillment {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne private Quotation quotation;
    @ManyToOne private Warehouse warehouse;
    @ManyToOne private Product product;
    private Integer qty;
    @Enumerated(EnumType.STRING) private Enums.FulfillmentStatus status;

    /** True when a human overrode the auto-split allocation. */
    private Boolean manualOverride;
    private Integer backorderQty;
}

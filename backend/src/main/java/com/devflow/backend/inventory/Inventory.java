package com.devflow.backend.inventory;

import com.devflow.backend.product.Product;
import com.devflow.backend.warehouse.Warehouse;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
    name = "inventory",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"warehouse_id", "product_id"})
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "warehouse_id", nullable = false)
    private Warehouse warehouse;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    private Integer physicalStock;

    private Integer reservedStock;

    private Integer availableStock;

    private Double sellingPrice;
}
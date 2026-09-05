package com.devflow.entity;
import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "quotation_lines")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class QuotationLine {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne @JsonIgnore private Quotation quotation;
    @ManyToOne private Product product;
    private Integer qty;
    private Double unitPrice;
    private Double discountPct;
    private Double lineTotal;
    private Boolean isRecurring;
    @ManyToOne private SubscriptionPlan subscriptionPlan;
}

package com.devflow.entity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "subscription_plans")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class SubscriptionPlan {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    @Enumerated(EnumType.STRING) private Enums.BillingCycle billingCycle;
    @Enumerated(EnumType.STRING) private Enums.ProrationType prorationType;
}

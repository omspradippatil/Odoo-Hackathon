package com.devflow.backend.deal;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "deals")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Deal {
    @Id
    private String id;
    private String title;
    private String category;
    private Double targetBudget;
    private Double bestQuote;
    private String stage; // SOURCING, COMPARING, NEGOTIATING, APPROVED, FULFILLED
    private Integer vendorCount;
    private Integer quoteCount;
    private String topVendor;
    private LocalDate createdAt;
    private String deliveryCity;
    private Boolean anonymousBiddingEnabled;
}

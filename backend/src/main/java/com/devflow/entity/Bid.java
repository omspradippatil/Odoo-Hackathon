package com.devflow.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "bids")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Bid {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne private Requirement requirement;
    @ManyToOne private User vendor;
    private Double amount;
    private LocalDateTime deliveryEta;
    @Column(length = 1000) private String notes;
    private Boolean isAnonymous;
    @Enumerated(EnumType.STRING) private Enums.BidStatus status;

    /** Stable per-requirement pseudonym ("Vendor A") shown while bidding is anonymous. */
    private String aliasLabel;
    private LocalDateTime createdAt;
}

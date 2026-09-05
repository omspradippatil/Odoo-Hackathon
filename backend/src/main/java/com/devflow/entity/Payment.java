package com.devflow.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Payment {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne private Quotation quotation;
    @ManyToOne private User buyer;
    @ManyToOne private User seller;
    private Double amount;
    private Double platformFee;
    @Enumerated(EnumType.STRING) private Enums.PaymentStatus status;

    /** When escrow becomes eligible for auto-release if delivery is never confirmed. */
    private LocalDateTime escrowReleaseAt;

    private String upiRef;
    private LocalDateTime createdAt;
    private LocalDateTime releasedAt;
    private String disputeReason;
}

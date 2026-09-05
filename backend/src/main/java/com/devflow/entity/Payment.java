package com.devflow.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
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
    private LocalDateTime escrowReleaseAt;
}

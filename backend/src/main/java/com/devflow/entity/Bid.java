package com.devflow.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Bid {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne private Requirement requirement;
    @ManyToOne private User vendor;
    private Double amount;
    private LocalDateTime deliveryEta;
    private String notes;
    private Boolean isAnonymous;
    @Enumerated(EnumType.STRING) private Enums.BidStatus status;
}

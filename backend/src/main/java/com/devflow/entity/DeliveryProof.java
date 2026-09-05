package com.devflow.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class DeliveryProof {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne private Payment payment;
    @ManyToOne private User uploadedBy;
    private String imageUrl;
    private LocalDateTime timestamp;
}

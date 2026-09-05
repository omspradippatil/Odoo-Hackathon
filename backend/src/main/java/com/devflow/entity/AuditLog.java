package com.devflow.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String entityType;    // "QUOTATION", "PAYMENT", "BID", etc.
    private String entityId;      // String for flexibility (could be Long or UUID)
    private String action;        // "APPROVED", "REJECTED", "CUSTOMER_CONFIRMED", etc.
    private String performedBy;   // Email or "SYSTEM" or "CUSTOMER_PORTAL"
    private String metadata;      // JSON or plain text reason/notes
    private LocalDateTime timestamp;
}

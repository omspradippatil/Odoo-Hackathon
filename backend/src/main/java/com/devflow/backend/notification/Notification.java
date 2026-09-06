package com.devflow.backend.notification;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {
    @Id
    private String id;
    private String title;
    private String message;
    private String type; // approval, payment, fulfilment, billing, negotiation, system
    private String timestamp;
    private Boolean isRead;
    private String targetUrl;
    private String badgeText;
}

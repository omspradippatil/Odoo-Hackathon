package com.devflow.backend.quotation;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "quotations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Quotation {
    @Id
    private String id;
    private String approvalState; // DRAFT, PENDING_APPROVAL, APPROVED, REJECTED, etc.
}

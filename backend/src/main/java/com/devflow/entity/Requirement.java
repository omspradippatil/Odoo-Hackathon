package com.devflow.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "requirements")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Requirement {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne private User organization;
    private String title;
    @Column(length = 2000) private String description;
    private LocalDateTime deadline;
    @Enumerated(EnumType.STRING) private Enums.RequirementStatus status;

    private Integer qty;
    private Double estimatedBudget;
    @ManyToOne private Category category;
    private LocalDateTime createdAt;

    /** Bidder identities stay hidden until the buyer closes the requirement and awards it. */
    private Boolean bidsRevealed;
}

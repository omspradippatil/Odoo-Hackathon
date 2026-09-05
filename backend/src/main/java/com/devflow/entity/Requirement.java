package com.devflow.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Requirement {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne private User organization;
    private String title;
    private String description;
    private LocalDateTime deadline;
    @Enumerated(EnumType.STRING) private Enums.RequirementStatus status;
}

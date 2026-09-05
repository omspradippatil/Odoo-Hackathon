package com.devflow.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Rating {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long orderId;
    @ManyToOne private User rater;
    @ManyToOne private User ratee;
    private Integer stars;
    private String reviewText;
    private String imageUrl;
    private LocalDateTime createdAt;
}

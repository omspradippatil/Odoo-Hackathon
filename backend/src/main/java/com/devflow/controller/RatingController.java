package com.devflow.controller;
import com.devflow.entity.Rating;
import com.devflow.service.RatingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ratings")
@RequiredArgsConstructor
public class RatingController {
    private final RatingService ratingService;
    
    @PostMapping
    public ResponseEntity<Rating> submitRating(@RequestBody Rating rating) {
        return ResponseEntity.ok(ratingService.submitRating(rating));
    }
}

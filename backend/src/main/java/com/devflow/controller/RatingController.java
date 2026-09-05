package com.devflow.controller;

import com.devflow.dto.SellerLeaderboardDto;
import com.devflow.entity.Rating;
import com.devflow.service.RatingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ratings")
@RequiredArgsConstructor
public class RatingController {

    private final RatingService ratingService;

    /**
     * POST /api/ratings
     * Buyer submits a star review + optional text for a seller.
     * Automatically recomputes seller tier after saving.
     */
    @PostMapping
    public ResponseEntity<Rating> submitRating(@RequestBody Rating rating) {
        return ResponseEntity.ok(ratingService.submitRating(rating));
    }

    /**
     * GET /api/ratings/leaderboard
     * Returns all sellers sorted by avg trust score (highest first),
     * with their current tier badge (GOLD / SILVER / BRONZE).
     */
    @GetMapping("/leaderboard")
    public ResponseEntity<List<SellerLeaderboardDto>> getLeaderboard() {
        return ResponseEntity.ok(ratingService.getSellerLeaderboard());
    }

    /**
     * GET /api/ratings/seller/{sellerId}
     * Returns all reviews received by a specific seller, newest first.
     */
    @GetMapping("/seller/{sellerId}")
    public ResponseEntity<List<Rating>> getSellerRatings(@PathVariable Long sellerId) {
        return ResponseEntity.ok(ratingService.getRatingsForSeller(sellerId));
    }

    /**
     * GET /api/ratings/seller/{sellerId}/score
     * Returns the computed TrustScore snapshot for a seller
     * (tier, avgStars, totalTransactions, reviewCount, aiSummary).
     */
    @GetMapping("/seller/{sellerId}/score")
    public ResponseEntity<SellerLeaderboardDto> getSellerScore(@PathVariable Long sellerId) {
        return ResponseEntity.ok(ratingService.getSellerScore(sellerId));
    }
}

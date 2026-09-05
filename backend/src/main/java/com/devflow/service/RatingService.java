package com.devflow.service;

import com.devflow.dto.SellerLeaderboardDto;
import com.devflow.entity.Enums;
import com.devflow.entity.Rating;
import com.devflow.entity.TrustScore;
import com.devflow.entity.User;
import com.devflow.repository.RatingRepository;
import com.devflow.repository.TrustScoreRepository;
import com.devflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RatingService {

    private final RatingRepository ratingRepository;
    private final TrustScoreRepository trustScoreRepository;
    private final UserRepository userRepository;

    // ─────────────────────────────────────────────────────────────
    // Submit a new buyer review and immediately recompute the tier
    // ─────────────────────────────────────────────────────────────
    public Rating submitRating(Rating rating) {
        rating.setCreatedAt(LocalDateTime.now());
        Rating saved = ratingRepository.save(rating);
        updateTrustScore(rating.getRatee());
        return saved;
    }

    // ─────────────────────────────────────────────────────────────
    // Leaderboard: all sellers sorted by trust score descending
    // ─────────────────────────────────────────────────────────────
    public List<SellerLeaderboardDto> getSellerLeaderboard() {
        List<User> sellers = userRepository.findByRole(Enums.Role.SELLER);
        return sellers.stream()
                .sorted(Comparator.comparingDouble(
                        (User u) -> u.getTrustScore() != null ? u.getTrustScore() : 0.0)
                        .reversed())
                .map(seller -> {
                    List<Rating> reviews = ratingRepository.findByRatee(seller);
                    Optional<TrustScore> ts = trustScoreRepository.findByUser(seller);
                    return SellerLeaderboardDto.builder()
                            .sellerId(seller.getId())
                            .displayName(seller.getDisplayName())
                            .companyName(seller.getCompanyName())
                            .email(seller.getEmail())
                            .tier(seller.getTier() != null ? seller.getTier() : Enums.Tier.BRONZE)
                            .avgStars(seller.getTrustScore() != null ? seller.getTrustScore() : 0.0)
                            .totalTransactions(seller.getTotalTransactions() != null ? seller.getTotalTransactions() : 0)
                            .reviewCount(reviews.size())
                            .aiSummary(ts.map(TrustScore::getAiSummary).orElse(null))
                            .build();
                })
                .collect(Collectors.toList());
    }

    // ─────────────────────────────────────────────────────────────
    // Paginated reviews for a specific seller (newest first)
    // ─────────────────────────────────────────────────────────────
    public List<Rating> getRatingsForSeller(Long sellerId) {
        User seller = userRepository.findById(sellerId)
                .orElseThrow(() -> new RuntimeException("Seller not found: " + sellerId));
        return ratingRepository.findByRateeOrderByCreatedAtDesc(seller);
    }

    // ─────────────────────────────────────────────────────────────
    // Trust score snapshot for a single seller
    // ─────────────────────────────────────────────────────────────
    public SellerLeaderboardDto getSellerScore(Long sellerId) {
        User seller = userRepository.findById(sellerId)
                .orElseThrow(() -> new RuntimeException("Seller not found: " + sellerId));
        List<Rating> reviews = ratingRepository.findByRatee(seller);
        Optional<TrustScore> ts = trustScoreRepository.findByUser(seller);
        return SellerLeaderboardDto.builder()
                .sellerId(seller.getId())
                .displayName(seller.getDisplayName())
                .companyName(seller.getCompanyName())
                .email(seller.getEmail())
                .tier(seller.getTier() != null ? seller.getTier() : Enums.Tier.BRONZE)
                .avgStars(seller.getTrustScore() != null ? seller.getTrustScore() : 0.0)
                .totalTransactions(seller.getTotalTransactions() != null ? seller.getTotalTransactions() : 0)
                .reviewCount(reviews.size())
                .aiSummary(ts.map(TrustScore::getAiSummary).orElse(null))
                .build();
    }

    // ─────────────────────────────────────────────────────────────
    // Internal: recompute and persist tier + TrustScore after a review
    // ─────────────────────────────────────────────────────────────
    private void updateTrustScore(User ratee) {
        if (ratee == null) return;

        List<Rating> ratings = ratingRepository.findByRatee(ratee);
        double avg = ratings.stream().mapToInt(Rating::getStars).average().orElse(0.0);
        int totalTx = ratee.getTotalTransactions() != null ? ratee.getTotalTransactions() : 0;

        // Tier classification
        Enums.Tier newTier;
        if (avg >= 4.5 && totalTx >= 20) {
            newTier = Enums.Tier.GOLD;
        } else if (avg >= 3.8 && totalTx >= 10) {
            newTier = Enums.Tier.SILVER;
        } else {
            newTier = Enums.Tier.BRONZE;
        }

        // Persist tier and score on User
        ratee.setTier(newTier);
        ratee.setTrustScore(avg);
        userRepository.save(ratee);

        // Generate a human-readable AI summary for the trust score snapshot
        String aiSummary = buildSummary(ratee.getDisplayName(), avg, ratings.size(), newTier);

        // Upsert TrustScore record
        TrustScore ts = trustScoreRepository.findByUser(ratee).orElse(
                TrustScore.builder().user(ratee).build()
        );
        ts.setTier(newTier);
        ts.setAvgStars(avg);
        ts.setTotalTransactions(totalTx);
        ts.setAiSummary(aiSummary);
        ts.setUpdatedAt(LocalDateTime.now());
        trustScoreRepository.save(ts);
    }

    private String buildSummary(String name, double avg, int reviewCount, Enums.Tier tier) {
        String tierLabel = switch (tier) {
            case GOLD -> "Gold";
            case SILVER -> "Silver";
            default -> "Bronze";
        };
        String sentiment;
        if (avg >= 4.5) sentiment = "Excellent reputation with consistently outstanding buyer feedback.";
        else if (avg >= 4.0) sentiment = "Strong performer with mostly positive buyer experiences.";
        else if (avg >= 3.5) sentiment = "Solid track record with room for improvement.";
        else sentiment = "Below average feedback — improvement needed.";

        return String.format("%s is a %s-tier seller (avg %.1f★ from %d review%s). %s",
                name != null ? name : "This seller", tierLabel, avg, reviewCount,
                reviewCount == 1 ? "" : "s", sentiment);
    }
}

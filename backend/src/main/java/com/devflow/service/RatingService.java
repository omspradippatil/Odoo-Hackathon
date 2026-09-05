package com.devflow.service;
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
import java.util.List;

@Service
@RequiredArgsConstructor
public class RatingService {
    private final RatingRepository ratingRepository;
    private final TrustScoreRepository trustScoreRepository;
    private final UserRepository userRepository;
    
    public Rating submitRating(Rating rating) {
        rating.setCreatedAt(LocalDateTime.now());
        Rating saved = ratingRepository.save(rating);
        updateTrustScore(rating.getRatee());
        return saved;
    }
    
    private void updateTrustScore(User ratee) {
        List<Rating> ratings = ratingRepository.findByRatee(ratee);
        double avg = ratings.stream().mapToInt(Rating::getStars).average().orElse(0.0);
        int totalTx = ratee.getTotalTransactions() != null ? ratee.getTotalTransactions() : 0;
        
        Enums.Tier newTier = Enums.Tier.BRONZE;
        if(avg >= 4.5 && totalTx >= 20) {
            newTier = Enums.Tier.GOLD;
        } else if(avg >= 3.8 && totalTx >= 10) {
            newTier = Enums.Tier.SILVER;
        }
        
        ratee.setTier(newTier);
        ratee.setTrustScore(avg);
        userRepository.save(ratee);
        
        // update TrustScore entity
        // omitting details for brevity
    }
}

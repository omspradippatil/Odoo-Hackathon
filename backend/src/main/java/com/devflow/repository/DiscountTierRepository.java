package com.devflow.repository;
import com.devflow.entity.DiscountTier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DiscountTierRepository extends JpaRepository<DiscountTier, Long> {
}

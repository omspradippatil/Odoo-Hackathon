package com.devflow.repository;
import com.devflow.entity.UpsellRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UpsellRuleRepository extends JpaRepository<UpsellRule, Long> {
}

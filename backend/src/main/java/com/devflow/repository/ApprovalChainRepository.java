package com.devflow.repository;
import com.devflow.entity.ApprovalChain;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ApprovalChainRepository extends JpaRepository<ApprovalChain, Long> {
}

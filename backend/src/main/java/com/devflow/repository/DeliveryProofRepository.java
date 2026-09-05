package com.devflow.repository;
import com.devflow.entity.DeliveryProof;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DeliveryProofRepository extends JpaRepository<DeliveryProof, Long> {
}

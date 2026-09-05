package com.devflow.repository;
import com.devflow.entity.DeliveryProof;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DeliveryProofRepository extends JpaRepository<DeliveryProof, Long> {
    List<DeliveryProof> findByPaymentId(Long paymentId);
}

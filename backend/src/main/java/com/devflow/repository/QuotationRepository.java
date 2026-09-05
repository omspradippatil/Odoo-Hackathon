package com.devflow.repository;

import com.devflow.entity.Quotation;
import com.devflow.entity.Enums;
import com.devflow.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface QuotationRepository extends JpaRepository<Quotation, Long> {

    List<Quotation> findBySalesRep(User salesRep);

    List<Quotation> findByStatus(Enums.QuotationStatus status);

    List<Quotation> findByCustomer(User customer);

    // Stalled quotations — no update in last N days
    @Query("SELECT q FROM Quotation q WHERE q.updatedAt < :cutoff AND q.status NOT IN ('CONFIRMED', 'REJECTED')")
    List<Quotation> findStalled(LocalDateTime cutoff);

    // Pending approvals count
    long countByStatus(Enums.QuotationStatus status);

    // Find by portal token (for customer portal)
    java.util.Optional<Quotation> findByPortalToken(String portalToken);
}

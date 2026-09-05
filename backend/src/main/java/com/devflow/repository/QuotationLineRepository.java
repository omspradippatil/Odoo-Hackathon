package com.devflow.repository;
import com.devflow.entity.QuotationLine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QuotationLineRepository extends JpaRepository<QuotationLine, Long> {
}

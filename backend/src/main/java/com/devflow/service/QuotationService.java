package com.devflow.service;
import com.devflow.entity.Enums;
import com.devflow.entity.Quotation;
import com.devflow.entity.QuotationLine;
import com.devflow.repository.QuotationRepository;
import com.devflow.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class QuotationService {
    private final QuotationRepository quotationRepository;
    private final CategoryRepository categoryRepository;

    public Quotation createQuotation(Quotation quotation) {
        quotation.setCreatedAt(LocalDateTime.now());
        quotation.setUpdatedAt(LocalDateTime.now());
        if(quotation.getLines() != null) {
            for(QuotationLine line : quotation.getLines()) {
                line.setQuotation(quotation);
            }
        }
        quotation.setBlendedRiskScore(calculateRiskScore(quotation));
        
        if (quotation.getBlendedRiskScore() > 0.08) {
            quotation.setStatus(Enums.QuotationStatus.PENDING_L2);
        } else if (quotation.getBlendedRiskScore() > 0) {
            quotation.setStatus(Enums.QuotationStatus.PENDING_L1);
        } else {
            quotation.setStatus(Enums.QuotationStatus.APPROVED);
        }
        
        return quotationRepository.save(quotation);
    }
    
    public Double calculateRiskScore(Quotation quotation) {
        if(quotation.getLines() == null || quotation.getLines().isEmpty()) return 0.0;
        
        double orderTotal = 0.0;
        for(QuotationLine line : quotation.getLines()) {
            orderTotal += line.getLineTotal();
        }
        
        if(orderTotal == 0.0) return 0.0;
        
        double score = 0.0;
        for(QuotationLine line : quotation.getLines()) {
            double allowed = line.getProduct().getCategory() != null ? line.getProduct().getCategory().getMaxDiscountPct() : 0.0;
            double lineWeight = line.getLineTotal() / orderTotal;
            score += ((line.getDiscountPct() - allowed) * lineWeight);
        }
        return score;
    }
}

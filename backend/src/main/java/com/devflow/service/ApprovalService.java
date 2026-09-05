package com.devflow.service;
import com.devflow.entity.Enums;
import com.devflow.entity.Quotation;
import com.devflow.repository.QuotationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ApprovalService {
    private final QuotationRepository quotationRepository;
    
    public Quotation approve(Long quotationId, boolean isL2) {
        Quotation q = quotationRepository.findById(quotationId).orElseThrow(() -> new RuntimeException("Not found"));
        if(isL2 && q.getStatus() == Enums.QuotationStatus.PENDING_L2) {
            q.setStatus(Enums.QuotationStatus.APPROVED);
        } else if(!isL2 && q.getStatus() == Enums.QuotationStatus.PENDING_L1) {
            q.setStatus(Enums.QuotationStatus.APPROVED);
        } else if (!isL2 && q.getStatus() == Enums.QuotationStatus.PENDING_L2) {
             // L1 approves but still needs L2? (simplifying to just pending_L2 if score > 0.08)
        }
        q.setUpdatedAt(LocalDateTime.now());
        return quotationRepository.save(q);
    }
}

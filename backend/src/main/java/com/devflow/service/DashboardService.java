package com.devflow.service;
import com.devflow.dto.DashboardStats;
import com.devflow.repository.QuotationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardService {
    private final QuotationRepository quotationRepository;
    
    public DashboardStats getStats() {
        return new DashboardStats(quotationRepository.count(), 0, 0.0);
    }
}

package com.devflow.service;
import com.devflow.entity.Product;
import com.devflow.entity.Stock;
import com.devflow.repository.StockRepository;
import com.devflow.repository.ProductRepository;
import com.devflow.dto.SplitResult;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Service
@RequiredArgsConstructor
public class WarehouseService {
    private final StockRepository stockRepository;
    private final ProductRepository productRepository;
    
    public SplitResult autoSplit(Long productId, int requestedQty) {
        Product p = productRepository.findById(productId).orElseThrow();
        List<Stock> stocks = stockRepository.findByProductOrderByWarehouseShippingWeightDescQtyAvailableDesc(p);
        
        Map<Long, Integer> allocations = new HashMap<>();
        int remaining = requestedQty;
        
        for(Stock s : stocks) {
            if(remaining <= 0) break;
            if(s.getQtyAvailable() > 0) {
                int take = Math.min(remaining, s.getQtyAvailable());
                allocations.put(s.getWarehouse().getId(), take);
                remaining -= take;
            }
        }
        
        return new SplitResult(allocations, remaining);
    }
}

package com.devflow.service;
import com.devflow.entity.Enums;
import com.devflow.entity.Bid;
import com.devflow.repository.BidRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BidService {
    private final BidRepository bidRepository;
    
    public Bid submitBid(Bid bid) {
        bid.setStatus(Enums.BidStatus.SUBMITTED);
        return bidRepository.save(bid);
    }
}

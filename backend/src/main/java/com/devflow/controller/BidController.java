package com.devflow.controller;
import com.devflow.entity.Bid;
import com.devflow.service.BidService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bids")
@RequiredArgsConstructor
public class BidController {
    private final BidService bidService;
    
    @PostMapping
    public ResponseEntity<Bid> submitBid(@RequestBody Bid bid) {
        return ResponseEntity.ok(bidService.submitBid(bid));
    }
}

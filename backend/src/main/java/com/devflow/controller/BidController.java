package com.devflow.controller;
import com.devflow.entity.Bid;
import com.devflow.entity.Enums;
import com.devflow.dto.BidRequest;
import com.devflow.repository.RequirementRepository;
import com.devflow.repository.UserRepository;
import com.devflow.service.BidService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/bids")
@RequiredArgsConstructor
public class BidController {
    private final BidService bidService;
    private final RequirementRepository requirementRepository;
    private final UserRepository userRepository;
    
    @PostMapping
    public ResponseEntity<Bid> submitBid(@RequestBody BidRequest request, Authentication auth) {
        String email = auth != null && auth.getName() != null ? auth.getName() : "vendor@devflow.com";
        var vendor = userRepository.findByEmail(email).orElse(null);
        var req = requirementRepository.findById(request.requirementId()).orElseThrow();
        
        Bid bid = new Bid();
        bid.setRequirement(req);
        bid.setVendor(vendor);
        bid.setAmount(request.amount());
        if (request.deliveryEta() != null) {
            bid.setDeliveryEta(request.deliveryEta());
        } else {
            bid.setDeliveryEta(LocalDateTime.now().plusWeeks(2));
        }
        bid.setNotes(request.notes());
        bid.setIsAnonymous(request.isAnonymous() != null ? request.isAnonymous() : true);
        bid.setStatus(Enums.BidStatus.SUBMITTED);
        bid.setCreatedAt(LocalDateTime.now());
        
        return ResponseEntity.ok(bidService.submitBid(bid));
    }
}

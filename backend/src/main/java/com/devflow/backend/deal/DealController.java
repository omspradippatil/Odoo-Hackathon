package com.devflow.backend.deal;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/deals")
@CrossOrigin(origins = "*")
public class DealController {
    
    private final DealRepository dealRepository;

    public DealController(DealRepository dealRepository) {
        this.dealRepository = dealRepository;
    }

    @GetMapping
    public List<Deal> getAllDeals() {
        return dealRepository.findAll();
    }

    @GetMapping("/{id}")
    public Deal getDeal(@PathVariable String id) {
        return dealRepository.findById(id).orElse(null);
    }

    @PostMapping
    public Deal createDeal(@RequestBody Deal deal) {
        return dealRepository.save(deal);
    }

    @PutMapping("/{id}")
    public Deal updateDeal(@PathVariable String id, @RequestBody Deal deal) {
        deal.setId(id);
        return dealRepository.save(deal);
    }
}

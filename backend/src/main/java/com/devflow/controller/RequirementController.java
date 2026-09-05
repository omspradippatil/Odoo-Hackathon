package com.devflow.controller;

import com.devflow.entity.Requirement;
import com.devflow.repository.RequirementRepository;
import com.devflow.repository.BidRepository;
import com.devflow.dto.RequirementResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/requirements")
@RequiredArgsConstructor
public class RequirementController {

    private final RequirementRepository requirementRepository;
    private final BidRepository bidRepository;

    @GetMapping
    public ResponseEntity<List<RequirementResponse>> getActiveRequirements() {
        List<Requirement> reqs = requirementRepository.findAll();
        List<RequirementResponse> res = reqs.stream().map(r -> {
            long bidCount = bidRepository.countByRequirementId(r.getId());
            RequirementResponse.Buyer buyer = null;
            if (r.getOrganization() != null) {
                String orgName = "Anonymous Org #" + r.getOrganization().getId();
                buyer = new RequirementResponse.Buyer(r.getOrganization().getId(), orgName, orgName, "Hidden");
            }
            return new RequirementResponse(
                    r.getId(),
                    r.getTitle(),
                    r.getDescription(),
                    r.getQty(),
                    r.getEstimatedBudget(),
                    r.getCategory() != null ? r.getCategory().getId() : null,
                    r.getCategory() != null ? r.getCategory().getName() : "General",
                    r.getDeadline(),
                    r.getStatus(),
                    r.getBidsRevealed(),
                    r.getCreatedAt(),
                    buyer,
                    false, // owner
                    bidCount,
                    null, // median
                    null  // lowest
            );
        }).collect(Collectors.toList());
        
        return ResponseEntity.ok(res);
    }
}

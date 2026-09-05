package com.devflow.dto;

import java.util.List;

public record RequirementDetailResponse(
        RequirementResponse requirement,
        MarketStats market,
        List<BidView> bids) {
}

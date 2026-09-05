package com.devflow.dto;
import lombok.Data;
import lombok.AllArgsConstructor;
import java.util.List;
import java.util.Map;

@Data @AllArgsConstructor
public class SplitResult {
    private Map<Long, Integer> allocations; // warehouseId -> qty
    private int backorderQty;
}

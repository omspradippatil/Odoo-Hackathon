package com.devflow.controller;
import com.devflow.dto.SplitResult;
import com.devflow.service.WarehouseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/warehouse")
@RequiredArgsConstructor
public class WarehouseController {
    private final WarehouseService warehouseService;
    
    @GetMapping("/split")
    public ResponseEntity<SplitResult> autoSplit(@RequestParam Long productId, @RequestParam int qty) {
        return ResponseEntity.ok(warehouseService.autoSplit(productId, qty));
    }
}

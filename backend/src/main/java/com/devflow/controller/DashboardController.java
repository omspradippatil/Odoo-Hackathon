package com.devflow.controller;

import com.devflow.service.AuditService;
import com.devflow.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;
    private final AuditService auditService;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> stats() {
        return ResponseEntity.ok(dashboardService.stats());
    }

    @GetMapping("/stalled")
    public ResponseEntity<List<Map<String, Object>>> stalled() {
        return ResponseEntity.ok(dashboardService.stalled());
    }

    @GetMapping("/anomalies")
    public ResponseEntity<List<Map<String, Object>>> anomalies() {
        return ResponseEntity.ok(dashboardService.anomalies());
    }

    @GetMapping("/pipeline")
    public ResponseEntity<Map<String, List<Map<String, Object>>>> pipeline() {
        return ResponseEntity.ok(dashboardService.pipeline());
    }

    /** Recent activity across every entity — the audit feed. */
    @GetMapping("/activity")
    public ResponseEntity<?> activity() {
        return ResponseEntity.ok(auditService.recent());
    }
}

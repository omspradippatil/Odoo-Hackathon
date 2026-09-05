package com.devflow.service;

import com.devflow.entity.AuditLog;
import com.devflow.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Single write path for the immutable audit trail, so every approval, rejection,
 * edit and escrow movement is recorded the same way.
 */
@Service
@RequiredArgsConstructor
public class AuditService {

    public static final String SYSTEM = "SYSTEM";
    public static final String CUSTOMER_PORTAL = "CUSTOMER_PORTAL";

    private final AuditLogRepository auditLogRepository;

    public void record(String entityType, Object entityId, String action, String performedBy, String metadata) {
        AuditLog entry = new AuditLog();
        entry.setEntityType(entityType);
        entry.setEntityId(entityId != null ? entityId.toString() : null);
        entry.setAction(action);
        entry.setPerformedBy(performedBy != null ? performedBy : SYSTEM);
        entry.setMetadata(metadata);
        entry.setTimestamp(LocalDateTime.now());
        auditLogRepository.save(entry);
    }

    public List<AuditLog> trailFor(String entityType, Object entityId) {
        return auditLogRepository.findByEntityTypeAndEntityIdOrderByTimestampDesc(
                entityType, entityId != null ? entityId.toString() : null);
    }

    public List<AuditLog> recent() {
        return auditLogRepository.findTop100ByOrderByTimestampDesc();
    }
}

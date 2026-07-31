package com.medislot.audit.service;

import com.medislot.audit.entity.AuditLog;
import com.medislot.audit.repository.AuditLogRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class AuditLogService {

    private static final Logger log = LoggerFactory.getLogger(AuditLogService.class);
    private final AuditLogRepository auditLogRepository;

    public AuditLogService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void record(UUID actorUserId, String actorRole, String action, String entityType, UUID entityId, String result, String metadataJson) {
        try {
            AuditLog entry = new AuditLog();
            entry.setActorUserId(actorUserId);
            entry.setActorRole(actorRole != null ? actorRole : "ANONYMOUS");
            entry.setAction(action);
            entry.setEntityType(entityType);
            entry.setEntityId(entityId);
            entry.setResult(result);
            entry.setRequestId(UUID.randomUUID().toString().substring(0, 8));
            if (metadataJson != null && !metadataJson.isBlank()) {
                entry.setMetadata(metadataJson);
            }
            auditLogRepository.save(entry);
        } catch (Exception e) {
            log.error("Failed to record audit log action: {}", action, e);
        }
    }

    @Transactional(readOnly = true)
    public Page<AuditLog> getAuditLogs(Pageable pageable) {
        return auditLogRepository.findAllByOrderByCreatedAtDesc(pageable);
    }
}

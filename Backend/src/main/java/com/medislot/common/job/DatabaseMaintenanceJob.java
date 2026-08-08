package com.medislot.common.job;

import com.medislot.assistant.repository.AiProviderUsageLogRepository;
import com.medislot.auth.repository.RefreshTokenRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

/**
 * Automated Database Maintenance & Garbage Collection Scheduled Job.
 *
 * Executes every night at 2:00 AM (off-peak hours).
 * Purges expired revoked JWT tokens and stale AI logs older than 30 days
 * to keep database indexes lightweight and ultra-fast.
 *
 * NOTE: Does NOT modify or touch any medical, patient, doctor, or appointment records.
 */
@Component
public class DatabaseMaintenanceJob {

    private static final Logger log = LoggerFactory.getLogger(DatabaseMaintenanceJob.class);

    private final RefreshTokenRepository refreshTokenRepository;
    private final AiProviderUsageLogRepository usageLogRepository;

    public DatabaseMaintenanceJob(
            RefreshTokenRepository refreshTokenRepository,
            AiProviderUsageLogRepository usageLogRepository
    ) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.usageLogRepository = usageLogRepository;
    }

    /**
     * Nightly maintenance job scheduled at 2:00 AM every day.
     */
    @Scheduled(cron = "0 0 2 * * ?")
    @Transactional
    public void executeNightlyDatabaseMaintenance() {
        log.info("Starting automated nightly database maintenance & cleanup job...");
        Instant now = Instant.now();

        // 1. Purge expired JWT refresh tokens
        try {
            refreshTokenRepository.deleteByExpiresAtBefore(now);
            log.info("Successfully purged expired JWT tokens before {}", now);
        } catch (Exception e) {
            log.error("Failed to purge expired JWT tokens", e);
        }

        // 2. Purge temporary AI logs older than 30 days
        try {
            Instant thirtyDaysAgo = now.minus(30, ChronoUnit.DAYS);
            int purgedLogs = usageLogRepository.deleteByCreatedAtBefore(thirtyDaysAgo);
            log.info("Successfully purged {} temporary AI usage logs created before {}", purgedLogs, thirtyDaysAgo);
        } catch (Exception e) {
            log.error("Failed to purge stale AI usage logs", e);
        }

        log.info("Automated nightly database maintenance job completed successfully.");
    }
}

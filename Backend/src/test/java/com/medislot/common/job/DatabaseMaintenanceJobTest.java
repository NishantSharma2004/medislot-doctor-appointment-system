package com.medislot.common.job;

import com.medislot.assistant.repository.AiProviderUsageLogRepository;
import com.medislot.auth.repository.RefreshTokenRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.Instant;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class DatabaseMaintenanceJobTest {

    @Mock
    private RefreshTokenRepository refreshTokenRepository;

    @Mock
    private AiProviderUsageLogRepository usageLogRepository;

    private DatabaseMaintenanceJob maintenanceJob;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        maintenanceJob = new DatabaseMaintenanceJob(refreshTokenRepository, usageLogRepository);
    }

    @Test
    void executeNightlyDatabaseMaintenance_shouldPurgeExpiredTokensAndStaleLogs() {
        when(usageLogRepository.deleteByCreatedAtBefore(any(Instant.class))).thenReturn(5);

        maintenanceJob.executeNightlyDatabaseMaintenance();

        verify(refreshTokenRepository, times(1)).deleteByExpiresAtBefore(any(Instant.class));
        verify(usageLogRepository, times(1)).deleteByCreatedAtBefore(any(Instant.class));
    }
}

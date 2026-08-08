package com.medislot.auth.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class BruteForceProtectionServiceTest {

    private BruteForceProtectionService protectionService;

    @BeforeEach
    void setUp() {
        protectionService = new BruteForceProtectionService();
    }

    @Test
    void isBlocked_shouldReturnFalseForNewIpAndEmail() {
        assertFalse(protectionService.isBlocked("192.168.1.1", "user@example.com"));
    }

    @Test
    void recordFailedAttempt_shouldBlockAfter5Attempts() {
        String ip = "192.168.1.50";
        String email = "hacker@example.com";

        for (int i = 0; i < 4; i++) {
            protectionService.recordFailedAttempt(ip, email);
            assertFalse(protectionService.isBlocked(ip, email));
        }

        // 5th attempt triggers lockout
        protectionService.recordFailedAttempt(ip, email);
        assertTrue(protectionService.isBlocked(ip, email));
        assertTrue(protectionService.getRemainingBlockMinutes(ip, email) >= 1);
    }

    @Test
    void resetFailedAttempts_shouldClearLockoutOnSuccess() {
        String ip = "192.168.1.50";
        String email = "patient@example.com";

        for (int i = 0; i < 5; i++) {
            protectionService.recordFailedAttempt(ip, email);
        }
        assertTrue(protectionService.isBlocked(ip, email));

        protectionService.resetFailedAttempts(ip, email);
        assertFalse(protectionService.isBlocked(ip, email));
    }
}

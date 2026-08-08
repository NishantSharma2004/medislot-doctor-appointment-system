package com.medislot.auth.service;

import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Enterprise Brute-Force IP & Account Protection Engine.
 *
 * Tracks failed authentication attempts per IP address and email account.
 * Automatically locks access for 15 minutes after 5 consecutive failed login attempts
 * to defend against password guessing and credential stuffing attacks.
 */
@Service
public class BruteForceProtectionService {

    public static final int MAX_FAILED_ATTEMPTS = 5;
    public static final long BLOCK_DURATION_MS = 15 * 60 * 1000L; // 15 minutes

    private static class AttemptTracker {
        int count;
        long lastAttemptTime;
        long blockedUntil;

        AttemptTracker(long now) {
            this.count = 1;
            this.lastAttemptTime = now;
            this.blockedUntil = 0;
        }
    }

    private final Map<String, AttemptTracker> ipTrackers = new ConcurrentHashMap<>();
    private final Map<String, AttemptTracker> emailTrackers = new ConcurrentHashMap<>();

    /**
     * Records a failed login attempt for the given IP address and email.
     */
    public void recordFailedAttempt(String ipAddress, String email) {
        long now = System.currentTimeMillis();
        if (ipAddress != null && !ipAddress.isBlank()) {
            updateTracker(ipTrackers, ipAddress.trim(), now);
        }
        if (email != null && !email.isBlank()) {
            updateTracker(emailTrackers, email.trim().toLowerCase(), now);
        }
    }

    /**
     * Resets failed login attempts upon a successful authentication.
     */
    public void resetFailedAttempts(String ipAddress, String email) {
        if (ipAddress != null) ipTrackers.remove(ipAddress.trim());
        if (email != null) emailTrackers.remove(email.trim().toLowerCase());
    }

    /**
     * Checks whether an IP address or email account is currently locked out.
     */
    public boolean isBlocked(String ipAddress, String email) {
        long now = System.currentTimeMillis();
        if (ipAddress != null && isTrackerBlocked(ipTrackers.get(ipAddress.trim()), now)) {
            return true;
        }
        if (email != null && isTrackerBlocked(emailTrackers.get(email.trim().toLowerCase()), now)) {
            return true;
        }
        return false;
    }

    /**
     * Returns remaining lockout time in minutes (or 0 if not blocked).
     */
    public long getRemainingBlockMinutes(String ipAddress, String email) {
        long now = System.currentTimeMillis();
        long maxRemainingMs = 0;

        if (ipAddress != null) {
            AttemptTracker tracker = ipTrackers.get(ipAddress.trim());
            if (tracker != null && now < tracker.blockedUntil) {
                maxRemainingMs = Math.max(maxRemainingMs, tracker.blockedUntil - now);
            }
        }
        if (email != null) {
            AttemptTracker tracker = emailTrackers.get(email.trim().toLowerCase());
            if (tracker != null && now < tracker.blockedUntil) {
                maxRemainingMs = Math.max(maxRemainingMs, tracker.blockedUntil - now);
            }
        }

        return Math.max(1, (maxRemainingMs + 59999) / 60000);
    }

    private void updateTracker(Map<String, AttemptTracker> trackers, String key, long now) {
        trackers.compute(key, (k, tracker) -> {
            if (tracker == null) {
                return new AttemptTracker(now);
            }
            // Reset if previous window expired
            if (now - tracker.lastAttemptTime > BLOCK_DURATION_MS) {
                tracker.count = 1;
                tracker.lastAttemptTime = now;
                tracker.blockedUntil = 0;
            } else {
                tracker.count++;
                tracker.lastAttemptTime = now;
                if (tracker.count >= MAX_FAILED_ATTEMPTS) {
                    tracker.blockedUntil = now + BLOCK_DURATION_MS;
                }
            }
            return tracker;
        });
    }

    private boolean isTrackerBlocked(AttemptTracker tracker, long now) {
        if (tracker == null) return false;
        if (now < tracker.blockedUntil) return true;
        // Expire block if duration passed
        if (tracker.blockedUntil > 0 && now >= tracker.blockedUntil) {
            tracker.count = 0;
            tracker.blockedUntil = 0;
        }
        return false;
    }
}

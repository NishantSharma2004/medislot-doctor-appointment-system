package com.medislot.auth.service;

import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Enterprise Token Revocation & Blacklist Engine.
 *
 * Implements JWT token revocation upon logout. Ensures logged-out tokens
 * can never be reused even if intercepted before expiration.
 */
@Service
public class TokenBlacklistService {

    private final Map<String, Long> blacklistedTokens = new ConcurrentHashMap<>();

    /**
     * Revokes and blacklists a JWT token until its expiration timestamp.
     */
    public void blacklistToken(String token, long expiryTimeMs) {
        if (token != null && !token.isBlank()) {
            blacklistedTokens.put(token, expiryTimeMs);
            cleanupExpiredTokens();
        }
    }

    /**
     * Checks whether a JWT token has been revoked / blacklisted.
     */
    public boolean isBlacklisted(String token) {
        if (token == null || token.isBlank()) return false;
        Long expiry = blacklistedTokens.get(token);
        if (expiry == null) return false;

        // If expired naturally, remove from blacklist map
        if (System.currentTimeMillis() > expiry) {
            blacklistedTokens.remove(token);
            return false;
        }

        return true;
    }

    private void cleanupExpiredTokens() {
        long now = System.currentTimeMillis();
        blacklistedTokens.entrySet().removeIf(entry -> now > entry.getValue());
    }
}

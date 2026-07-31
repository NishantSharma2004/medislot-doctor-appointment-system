package com.medislot.auth;

import com.medislot.auth.service.JwtService;
import com.medislot.common.enums.Role;
import com.medislot.user.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {

    private JwtService jwtService;
    private User testUser;
    private UUID userId;

    @BeforeEach
    void setUp() {
        // Use secret string
        String secret = "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970";
        jwtService = new JwtService(secret, 3600000L, 86400000L); // 1hr access, 24hr refresh

        userId = UUID.randomUUID();
        testUser = new User(userId, "patient@example.com", "hashedpass", "John Doe", "+1234567890", Role.PATIENT);
    }

    @Test
    @DisplayName("Generate access token and verify subject, claims, and role mapping")
    void generateAccessToken_ShouldIncludeCorrectClaimsAndRole() {
        String token = jwtService.generateAccessToken(testUser);

        assertNotNull(token);
        assertTrue(jwtService.validateToken(token));
        assertEquals(userId, jwtService.extractUserId(token));
        assertEquals("patient@example.com", jwtService.extractEmail(token));
        assertEquals(Role.PATIENT, jwtService.extractRole(token));
    }

    @Test
    @DisplayName("Validate malformed token returns false without crashing")
    void validateToken_InvalidToken_ShouldReturnFalse() {
        assertFalse(jwtService.validateToken("invalid.jwt.token"));
        assertFalse(jwtService.validateToken(""));
    }

    @Test
    @DisplayName("Generate and hash refresh token with SHA-256")
    void hashToken_ShouldProduceConsistentHexHash() {
        String rawToken = jwtService.generateRawRefreshToken();
        assertNotNull(rawToken);

        String hash1 = jwtService.hashToken(rawToken);
        String hash2 = jwtService.hashToken(rawToken);

        assertNotNull(hash1);
        assertEquals(64, hash1.length()); // SHA-256 hex string length is 64 chars
        assertEquals(hash1, hash2);
    }
}

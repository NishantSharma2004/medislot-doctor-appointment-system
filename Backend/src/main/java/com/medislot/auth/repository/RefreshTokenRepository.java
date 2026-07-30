package com.medislot.auth.repository;

import com.medislot.auth.entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, UUID> {

    @Query("""
            SELECT rt FROM RefreshToken rt
            WHERE rt.tokenHash = :tokenHash
              AND rt.revokedAt IS NULL
              AND rt.expiresAt > :now
            """)
    Optional<RefreshToken> findActiveByTokenHash(
            @Param("tokenHash") String tokenHash,
            @Param("now") Instant now);

    @Modifying
    @Query("UPDATE RefreshToken rt SET rt.revokedAt = :revokedAt WHERE rt.user.id = :userId AND rt.revokedAt IS NULL")
    int revokeAllByUserId(@Param("userId") UUID userId, @Param("revokedAt") Instant revokedAt);

    void deleteByExpiresAtBefore(Instant cutoff);
}

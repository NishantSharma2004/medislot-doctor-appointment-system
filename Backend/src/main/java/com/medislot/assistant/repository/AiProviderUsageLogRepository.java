package com.medislot.assistant.repository;

import com.medislot.assistant.entity.AiProviderUsageLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.UUID;

public interface AiProviderUsageLogRepository extends JpaRepository<AiProviderUsageLog, UUID> {

    @Query("""
            SELECT COUNT(l) FROM AiProviderUsageLog l
            WHERE l.user.id = :userId
              AND l.createdAt >= :since
            """)
    long countByUserIdSince(@Param("userId") UUID userId, @Param("since") Instant since);
}

package com.medislot.ratelimit;

import com.medislot.common.exception.RateLimitExceededException;
import com.medislot.common.ratelimit.InMemoryBucketStore;
import com.medislot.common.ratelimit.RateLimitProperties;
import com.medislot.common.ratelimit.RateLimitService;
import io.github.bucket4j.ConsumptionProbe;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class RateLimitServiceTest {

    private RateLimitService rateLimitService;
    private InMemoryBucketStore bucketStore;

    @BeforeEach
    void setUp() {
        RateLimitProperties properties = new RateLimitProperties();
        properties.setEnabled(true);

        RateLimitProperties.PolicyConfig testPolicy = new RateLimitProperties.PolicyConfig();
        testPolicy.setCapacity(2);
        testPolicy.setRefillTokens(2);
        testPolicy.setRefillDuration("1m");

        properties.setPolicies(Map.of("test-policy", testPolicy));

        bucketStore = new InMemoryBucketStore();
        rateLimitService = new RateLimitService(properties, bucketStore);
    }

    @Test
    @DisplayName("Requests under capacity succeed and return probe")
    void consume_UnderLimit_Succeeds() {
        ConsumptionProbe probe1 = rateLimitService.consume("test-policy", "ip:127.0.0.1");
        assertNotNull(probe1);
        assertEquals(1, probe1.getRemainingTokens());

        ConsumptionProbe probe2 = rateLimitService.consume("test-policy", "ip:127.0.0.1");
        assertNotNull(probe2);
        assertEquals(0, probe2.getRemainingTokens());
    }

    @Test
    @DisplayName("Exceeding capacity throws RateLimitExceededException with Retry-After metadata")
    void consume_ExceedsLimit_ThrowsRateLimitExceededException() {
        rateLimitService.consume("test-policy", "user:123");
        rateLimitService.consume("test-policy", "user:123");

        RateLimitExceededException ex = assertThrows(
                RateLimitExceededException.class,
                () -> rateLimitService.consume("test-policy", "user:123")
        );

        assertTrue(ex.getRetryAfterSeconds() > 0);
        assertEquals(2, ex.getLimit());
        assertEquals(0, ex.getRemaining());
    }

    @Test
    @DisplayName("Different client keys receive separate rate limit buckets")
    void consume_DifferentKeys_IsolatedBuckets() {
        // Consumer A consumes 2 tokens
        rateLimitService.consume("test-policy", "user:A");
        rateLimitService.consume("test-policy", "user:A");
        assertThrows(RateLimitExceededException.class, () -> rateLimitService.consume("test-policy", "user:A"));

        // Consumer B still has full capacity
        ConsumptionProbe probeB = rateLimitService.consume("test-policy", "user:B");
        assertNotNull(probeB);
        assertEquals(1, probeB.getRemainingTokens());
    }

    @Test
    @DisplayName("Bucket store clears without residual leak")
    void bucketStore_Clear_EmptiesCache() {
        rateLimitService.consume("test-policy", "user:1");
        rateLimitService.consume("test-policy", "user:2");
        assertEquals(2, bucketStore.size());

        bucketStore.clear();
        assertEquals(0, bucketStore.size());
    }
}

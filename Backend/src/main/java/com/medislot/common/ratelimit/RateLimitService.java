package com.medislot.common.ratelimit;

import com.medislot.common.exception.RateLimitExceededException;
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.ConsumptionProbe;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
public class RateLimitService {

    private final RateLimitProperties properties;
    private final BucketStore bucketStore;

    public RateLimitService(RateLimitProperties properties, BucketStore bucketStore) {
        this.properties = properties;
        this.bucketStore = bucketStore;
    }

    public ConsumptionProbe consume(String policyName, String clientKey) {
        if (!properties.isEnabled()) {
            return null;
        }

        RateLimitProperties.PolicyConfig config = properties.getPolicies().get(policyName);
        if (config == null) {
            config = new RateLimitProperties.PolicyConfig(); // Fallback defaults
        }

        final int capacity = config.getCapacity();
        final int refillTokens = config.getRefillTokens();
        final Duration refillDuration = parseDuration(config.getRefillDuration());

        String bucketKey = policyName + ":" + clientKey;
        Bucket bucket = bucketStore.getBucket(bucketKey, () -> {
            Bandwidth limit = Bandwidth.builder()
                    .capacity(capacity)
                    .refillGreedy(refillTokens, refillDuration)
                    .build();
            return Bucket.builder().addLimit(limit).build();
        });

        ConsumptionProbe probe = bucket.tryConsumeAndReturnRemaining(1);
        if (!probe.isConsumed()) {
            long retryAfterSeconds = (probe.getNanosToWaitForRefill() / 1_000_000_000L) + 1;
            throw new RateLimitExceededException(retryAfterSeconds, capacity, 0);
        }

        return probe;
    }

    public int getPolicyCapacity(String policyName) {
        RateLimitProperties.PolicyConfig config = properties.getPolicies().get(policyName);
        return config != null ? config.getCapacity() : 30;
    }

    private Duration parseDuration(String durationStr) {
        if (durationStr == null || durationStr.isBlank()) {
            return Duration.ofMinutes(1);
        }
        String s = durationStr.trim().toLowerCase();
        if (s.endsWith("m")) {
            long mins = Long.parseLong(s.substring(0, s.length() - 1));
            return Duration.ofMinutes(mins);
        } else if (s.endsWith("s")) {
            long secs = Long.parseLong(s.substring(0, s.length() - 1));
            return Duration.ofSeconds(secs);
        } else if (s.endsWith("h")) {
            long hours = Long.parseLong(s.substring(0, s.length() - 1));
            return Duration.ofHours(hours);
        }
        return Duration.ofMinutes(1);
    }
}

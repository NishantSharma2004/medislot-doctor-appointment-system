package com.medislot.common.ratelimit;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
@ConfigurationProperties(prefix = "rate-limit")
public class RateLimitProperties {

    private boolean enabled = true;
    private Map<String, PolicyConfig> policies = new HashMap<>();

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public Map<String, PolicyConfig> getPolicies() {
        return policies;
    }

    public void setPolicies(Map<String, PolicyConfig> policies) {
        this.policies = policies;
    }

    public static class PolicyConfig {
        private int capacity = 30;
        private int refillTokens = 30;
        private String refillDuration = "1m"; // e.g. "1m", "60s"

        public int getCapacity() {
            return capacity;
        }

        public void setCapacity(int capacity) {
            this.capacity = capacity;
        }

        public int getRefillTokens() {
            return refillTokens;
        }

        public void setRefillTokens(int refillTokens) {
            this.refillTokens = refillTokens;
        }

        public String getRefillDuration() {
            return refillDuration;
        }

        public void setRefillDuration(String refillDuration) {
            this.refillDuration = refillDuration;
        }
    }
}

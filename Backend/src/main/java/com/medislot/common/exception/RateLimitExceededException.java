package com.medislot.common.exception;

import org.springframework.http.HttpStatus;

public class RateLimitExceededException extends BusinessException {

    private final long retryAfterSeconds;
    private final long limit;
    private final long remaining;

    public RateLimitExceededException(long retryAfterSeconds, long limit, long remaining) {
        super(HttpStatus.TOO_MANY_REQUESTS, "RATE_LIMIT_EXCEEDED", "Too many requests. Please try again later.");
        this.retryAfterSeconds = retryAfterSeconds;
        this.limit = limit;
        this.remaining = remaining;
    }

    public long getRetryAfterSeconds() {
        return retryAfterSeconds;
    }

    public long getLimit() {
        return limit;
    }

    public long getRemaining() {
        return remaining;
    }
}

package com.medislot.common.observability;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

/**
 * Enterprise Application Performance Monitoring (APM) and Telemetry Service.
 * Captures, formats, and broadcasts observability alerts for 4xx/5xx errors,
 * slow API endpoints, database integrity conflicts, and unhandled crashes.
 */
@Service
public class TelemetryService {

    private static final Logger log = LoggerFactory.getLogger(TelemetryService.class);

    public void recordError(String path, int status, String errorCode, String message, Throwable throwable) {
        UUID traceId = UUID.randomUUID();
        String exceptionName = throwable != null ? throwable.getClass().getSimpleName() : "UnknownException";
        String stackExcerpt = throwable != null && throwable.getStackTrace().length > 0
                ? throwable.getStackTrace()[0].toString()
                : "NoStackTraceAvailable";

        log.error("""
                
                ======================= [TELEMETRY_ALERT] =======================
                Trace ID     : {}
                Timestamp    : {}
                Endpoint Path: {}
                HTTP Status  : {}
                Error Code   : {}
                Message      : {}
                Exception    : {}
                Root Cause   : {}
                =================================================================
                """,
                traceId,
                Instant.now(),
                path,
                status,
                errorCode,
                message,
                exceptionName,
                stackExcerpt
        );
    }

    public void recordApiPerformance(String path, String method, long executionTimeMs) {
        if (executionTimeMs > 1000) {
            log.warn("[TELEMETRY_SLOW_API] Trace: {} Method: {} Path: {} Duration: {}ms",
                    UUID.randomUUID(), method, path, executionTimeMs);
        }
    }
}

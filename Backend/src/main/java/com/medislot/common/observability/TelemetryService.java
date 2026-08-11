package com.medislot.common.observability;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.time.Instant;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

/**
 * Enterprise Application Performance Monitoring (APM) and Telemetry Service.
 * Captures, formats, and broadcasts observability alerts for 4xx/5xx errors,
 * slow API endpoints, database integrity conflicts, and unhandled crashes.
 * Automatically exports OTLP log records to HyperDX as 'medislot-backend' service
 * when HYPERDX_API_KEY environment variable is configured on Render / Production.
 */
@Service
public class TelemetryService {

    private static final Logger log = LoggerFactory.getLogger(TelemetryService.class);
    private static final String HYPERDX_LOG_ENDPOINT = "https://in-otel.hyperdx.io/v1/logs";

    private final String hyperDxApiKey;
    private final HttpClient httpClient;

    public TelemetryService() {
        String key = System.getenv("HYPERDX_API_KEY");
        this.hyperDxApiKey = (key != null && !key.isBlank()) ? key.trim() : null;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(3))
                .build();
    }

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

        sendToHyperDX("ERROR", String.format("[%s] %s - %s (%s)", errorCode, path, message, exceptionName), path, status);
    }

    public void recordApiPerformance(String path, String method, long executionTimeMs) {
        if (executionTimeMs > 1000) {
            log.warn("[TELEMETRY_SLOW_API] Trace: {} Method: {} Path: {} Duration: {}ms",
                    UUID.randomUUID(), method, path, executionTimeMs);
            sendToHyperDX("WARN", String.format("[SLOW_API] %s %s took %dms", method, path, executionTimeMs), path, 200);
        }
    }

    private void sendToHyperDX(String severity, String logBody, String path, int status) {
        if (hyperDxApiKey == null || hyperDxApiKey.isBlank()) {
            return;
        }

        try {
            long nowEpochNanos = System.currentTimeMillis() * 1_000_000L;
            String sanitizedBody = logBody != null ? logBody.replace("\"", "\\\"").replace("\n", " ") : "";
            String sanitizedPath = path != null ? path.replace("\"", "\\\"") : "";

            String jsonPayload = String.format("""
                {
                  "resourceLogs": [{
                    "resource": {
                      "attributes": [
                        { "key": "service.name", "value": { "stringValue": "medislot-backend" } },
                        { "key": "deployment.environment", "value": { "stringValue": "production" } }
                      ]
                    },
                    "scopeLogs": [{
                      "logRecords": [{
                        "timeUnixNano": "%d",
                        "severityText": "%s",
                        "body": { "stringValue": "%s" },
                        "attributes": [
                          { "key": "http.status_code", "value": { "intValue": %d } },
                          { "key": "http.target", "value": { "stringValue": "%s" } }
                        ]
                      }]
                    }]
                  }]
                }
                """, nowEpochNanos, severity, sanitizedBody, status, sanitizedPath);

            HttpRequest httpRequest = HttpRequest.newBuilder()
                    .uri(URI.create(HYPERDX_LOG_ENDPOINT))
                    .header("Content-Type", "application/json")
                    .header("authorization", hyperDxApiKey)
                    .timeout(Duration.ofSeconds(3))
                    .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                    .build();

            httpClient.sendAsync(httpRequest, HttpResponse.BodyHandlers.discarding())
                    .exceptionally(ex -> null);
        } catch (Exception e) {
            log.debug("HyperDX OTLP log stream error: {}", e.getMessage());
        }
    }
}

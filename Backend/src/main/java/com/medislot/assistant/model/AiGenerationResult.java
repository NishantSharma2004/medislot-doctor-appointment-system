package com.medislot.assistant.model;

import com.medislot.common.enums.AiProvider;

/**
 * Common internal response model returned by AI providers.
 */
public record AiGenerationResult(
        AiProvider provider,
        String model,
        String content,
        int statusCode,
        long latencyMs,
        Integer inputTokens,
        Integer outputTokens,
        boolean success,
        String errorCategory,
        String errorMessage
) {
    public static AiGenerationResult success(AiProvider provider, String model, String content, int statusCode, long latencyMs, Integer inputTokens, Integer outputTokens) {
        return new AiGenerationResult(provider, model, content, statusCode, latencyMs, inputTokens, outputTokens, true, null, null);
    }

    public static AiGenerationResult failure(AiProvider provider, String model, int statusCode, long latencyMs, String errorCategory, String errorMessage) {
        return new AiGenerationResult(provider, model, null, statusCode, latencyMs, null, null, false, errorCategory, errorMessage);
    }
}

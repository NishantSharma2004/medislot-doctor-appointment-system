package com.medislot.assistant.model;

/**
 * Common internal request model passed to AI providers.
 */
public record AiGenerationRequest(
        String systemPrompt,
        String userPrompt,
        double temperature,
        int maxTokens
) {
}

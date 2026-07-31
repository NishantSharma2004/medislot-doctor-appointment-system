package com.medislot.assistant.provider;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.medislot.assistant.model.AiGenerationRequest;
import com.medislot.assistant.model.AiGenerationResult;
import com.medislot.common.enums.AiProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

@Service
public class GeminiAiProvider implements AiProviderService {

    private static final Logger log = LoggerFactory.getLogger(GeminiAiProvider.class);

    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    @Value("${gemini.api-key:}")
    private String apiKey;

    @Value("${gemini.base-url:https://generativelanguage.googleapis.com/v1beta}")
    private String baseUrl;

    @Value("${gemini.model:gemini-1.5-flash}")
    private String model;

    public GeminiAiProvider(ObjectMapper objectMapper, RestClient.Builder restClientBuilder) {
        this.objectMapper = objectMapper;
        this.restClient = restClientBuilder.build();
    }

    @Override
    public AiProvider getProvider() {
        return AiProvider.GEMINI;
    }

    @Override
    public String getModelName() {
        return model;
    }

    @Override
    public boolean isAvailable() {
        return apiKey != null && !apiKey.isBlank();
    }

    @Override
    public AiGenerationResult generate(AiGenerationRequest request) {
        long startTime = System.currentTimeMillis();

        if (!isAvailable()) {
            return AiGenerationResult.failure(
                    AiProvider.GEMINI, model, 401, 0, "MISSING_API_KEY", "Gemini API key is not configured"
            );
        }

        try {
            Map<String, Object> payload = Map.of(
                    "systemInstruction", Map.of(
                            "parts", List.of(Map.of("text", request.systemPrompt()))
                    ),
                    "contents", List.of(
                            Map.of("parts", List.of(Map.of("text", request.userPrompt())))
                    ),
                    "generationConfig", Map.of(
                            "temperature", request.temperature(),
                            "maxOutputTokens", request.maxTokens()
                    )
            );

            String url = baseUrl + "/models/" + model + ":generateContent?key=" + apiKey;

            String responseBody = restClient.post()
                    .uri(url)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(payload)
                    .retrieve()
                    .body(String.class);

            long latency = System.currentTimeMillis() - startTime;

            if (responseBody == null || responseBody.isBlank()) {
                return AiGenerationResult.failure(
                        AiProvider.GEMINI, model, 500, latency, "EMPTY_RESPONSE", "Received empty response from Gemini"
                );
            }

            JsonNode root = objectMapper.readTree(responseBody);
            JsonNode candidates = root.path("candidates");
            if (!candidates.isArray() || candidates.isEmpty()) {
                return AiGenerationResult.failure(
                        AiProvider.GEMINI, model, 500, latency, "MALFORMED_RESPONSE", "Gemini response missing candidates"
                );
            }

            JsonNode parts = candidates.get(0).path("content").path("parts");
            if (!parts.isArray() || parts.isEmpty()) {
                return AiGenerationResult.failure(
                        AiProvider.GEMINI, model, 500, latency, "MALFORMED_RESPONSE", "Gemini response missing content parts"
                );
            }

            String content = parts.get(0).path("text").asText();
            Integer inputTokens = root.path("usageMetadata").path("promptTokenCount").isNumber() ? root.path("usageMetadata").path("promptTokenCount").asInt() : null;
            Integer outputTokens = root.path("usageMetadata").path("candidatesTokenCount").isNumber() ? root.path("usageMetadata").path("candidatesTokenCount").asInt() : null;

            return AiGenerationResult.success(
                    AiProvider.GEMINI, model, content, 200, latency, inputTokens, outputTokens
            );

        } catch (Exception ex) {
            long latency = System.currentTimeMillis() - startTime;
            String safeMsg = ex.getMessage() != null ? ex.getMessage().replaceAll("key=[A-Za-z0-9_-]+", "key=[REDACTED]") : "Unknown Gemini error";
            log.warn("Gemini provider call failed after {} ms: {}", latency, safeMsg);
            return AiGenerationResult.failure(
                    AiProvider.GEMINI, model, 500, latency, "PROVIDER_ERROR", safeMsg
            );
        }
    }
}

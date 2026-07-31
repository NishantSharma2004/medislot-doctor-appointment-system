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
public class GroqAiProvider implements AiProviderService {

    private static final Logger log = LoggerFactory.getLogger(GroqAiProvider.class);

    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    @Value("${groq.api-key:}")
    private String apiKey;

    @Value("${groq.base-url:https://api.groq.com/openai/v1}")
    private String baseUrl;

    @Value("${groq.model:llama-3.3-70b-versatile}")
    private String model;

    public GroqAiProvider(ObjectMapper objectMapper, RestClient.Builder restClientBuilder) {
        this.objectMapper = objectMapper;
        this.restClient = restClientBuilder.build();
    }

    @Override
    public AiProvider getProvider() {
        return AiProvider.GROQ;
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
                    AiProvider.GROQ, model, 401, 0, "MISSING_API_KEY", "Groq API key is not configured"
            );
        }

        try {
            Map<String, Object> payload = Map.of(
                    "model", model,
                    "messages", List.of(
                            Map.of("role", "system", "content", request.systemPrompt()),
                            Map.of("role", "user", "content", request.userPrompt())
                    ),
                    "temperature", request.temperature(),
                    "max_tokens", request.maxTokens()
            );

            String responseBody = restClient.post()
                    .uri(baseUrl + "/chat/completions")
                    .header("Authorization", "Bearer " + apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(payload)
                    .retrieve()
                    .body(String.class);

            long latency = System.currentTimeMillis() - startTime;

            if (responseBody == null || responseBody.isBlank()) {
                return AiGenerationResult.failure(
                        AiProvider.GROQ, model, 500, latency, "EMPTY_RESPONSE", "Received empty response from Groq"
                );
            }

            JsonNode root = objectMapper.readTree(responseBody);
            JsonNode choices = root.path("choices");
            if (!choices.isArray() || choices.isEmpty()) {
                return AiGenerationResult.failure(
                        AiProvider.GROQ, model, 500, latency, "MALFORMED_RESPONSE", "Groq response missing choices"
                );
            }

            String content = choices.get(0).path("message").path("content").asText();
            Integer inputTokens = root.path("usage").path("prompt_tokens").isNumber() ? root.path("usage").path("prompt_tokens").asInt() : null;
            Integer outputTokens = root.path("usage").path("completion_tokens").isNumber() ? root.path("usage").path("completion_tokens").asInt() : null;

            return AiGenerationResult.success(
                    AiProvider.GROQ, model, content, 200, latency, inputTokens, outputTokens
            );

        } catch (Exception ex) {
            long latency = System.currentTimeMillis() - startTime;
            String errorMsg = ex.getMessage() != null ? ex.getMessage() : "Unknown Groq error";
            log.warn("Groq provider call failed after {} ms: {}", latency, errorMsg.replaceAll("gsk_[A-Za-z0-9_-]+", "[REDACTED]"));
            return AiGenerationResult.failure(
                    AiProvider.GROQ, model, 500, latency, "PROVIDER_ERROR", errorMsg
            );
        }
    }
}

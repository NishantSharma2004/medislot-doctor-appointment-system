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

import java.util.ArrayList;
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

    @Value("${groq.model:openai/gpt-oss-20b}")
    private String model;

    private static final List<String> CANDIDATE_MODELS = List.of(
            "openai/gpt-oss-20b",
            "openai/gpt-oss-120b",
            "qwen/qwen3.8-27b",
            "gemma2-9b-it",
            "deepseek-r1-distill-llama-70b",
            "llama-3.3-70b-versatile",
            "llama-3.1-8b-instant"
    );

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

        // 1. Try currently configured model
        AiGenerationResult result = executeModelCall(this.model, request, startTime);
        if (result.success()) {
            return result;
        }

        // 2. If failure was due to model decommissioned (400) or not found (404), discover live models & try candidates
        String err = result.errorMessage() != null ? result.errorMessage().toLowerCase() : "";
        boolean isModelIssue = result.statusCode() == 404
                || err.contains("model_not_found")
                || err.contains("model_decommissioned")
                || err.contains("decommissioned")
                || err.contains("deprecated")
                || (result.statusCode() == 400 && err.contains("model"));

        if (isModelIssue) {
            log.warn("Groq model [{}] failed with model error (status {}, message: {}). Discovering live active models...",
                    this.model, result.statusCode(), result.errorMessage());

            List<String> liveModels = discoverLiveModels();
            List<String> modelsToTry = new ArrayList<>(liveModels);
            for (String candidate : CANDIDATE_MODELS) {
                if (!modelsToTry.contains(candidate)) {
                    modelsToTry.add(candidate);
                }
            }

            for (String candidate : modelsToTry) {
                if (candidate.equalsIgnoreCase(this.model)) continue;
                log.info("Trying Groq alternative candidate model [{}]...", candidate);
                AiGenerationResult candidateResult = executeModelCall(candidate, request, startTime);
                if (candidateResult.success()) {
                    log.info("Groq candidate model [{}] succeeded! Switching active model from [{}] to [{}].",
                            candidate, this.model, candidate);
                    this.model = candidate;
                    return candidateResult;
                }
            }
        }

        return result;
    }

    private synchronized List<String> discoverLiveModels() {
        if (!isAvailable()) return List.of();
        try {
            String modelsUrl = baseUrl.endsWith("/") ? baseUrl + "models" : baseUrl + "/models";
            String responseBody = restClient.get()
                    .uri(modelsUrl)
                    .header("Authorization", "Bearer " + apiKey)
                    .retrieve()
                    .body(String.class);

            if (responseBody == null || responseBody.isBlank()) return List.of();

            JsonNode root = objectMapper.readTree(responseBody);
            JsonNode dataArray = root.path("data");
            if (!dataArray.isArray()) return List.of();

            List<String> discovered = new ArrayList<>();
            for (JsonNode item : dataArray) {
                String id = item.path("id").asText();
                if (id != null && !id.isBlank()) {
                    String lower = id.toLowerCase();
                    // Exclude non-text/chat models
                    if (!lower.contains("whisper") && !lower.contains("guard") && !lower.contains("embed")
                            && !lower.contains("orpheus") && !lower.contains("tts") && !lower.contains("audio")) {
                        discovered.add(id);
                    }
                }
            }
            log.info("Discovered {} live Groq chat models: {}", discovered.size(), discovered);
            return discovered;
        } catch (Exception e) {
            log.warn("Could not query Groq /models endpoint: {}", e.getMessage());
            return List.of();
        }
    }

    private AiGenerationResult executeModelCall(String targetModel, AiGenerationRequest request, long startTime) {
        try {
            Map<String, Object> payload = Map.of(
                    "model", targetModel,
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
                        AiProvider.GROQ, targetModel, 500, latency, "EMPTY_RESPONSE", "Received empty response from Groq"
                );
            }

            JsonNode root = objectMapper.readTree(responseBody);
            JsonNode choices = root.path("choices");
            if (!choices.isArray() || choices.isEmpty()) {
                return AiGenerationResult.failure(
                        AiProvider.GROQ, targetModel, 500, latency, "MALFORMED_RESPONSE", "Groq response missing choices"
                );
            }

            String content = choices.get(0).path("message").path("content").asText();
            Integer inputTokens = root.path("usage").path("prompt_tokens").isNumber() ? root.path("usage").path("prompt_tokens").asInt() : null;
            Integer outputTokens = root.path("usage").path("completion_tokens").isNumber() ? root.path("usage").path("completion_tokens").asInt() : null;

            return AiGenerationResult.success(
                    AiProvider.GROQ, targetModel, content, 200, latency, inputTokens, outputTokens
            );

        } catch (org.springframework.web.client.RestClientResponseException rex) {
            long latency = System.currentTimeMillis() - startTime;
            String errorMsg = rex.getResponseBodyAsString() != null && !rex.getResponseBodyAsString().isBlank()
                    ? rex.getResponseBodyAsString()
                    : rex.getMessage();
            int statusCode = rex.getStatusCode().value();
            log.warn("Groq call to [{}] failed with HTTP {}: {}", targetModel, statusCode, errorMsg.replaceAll("gsk_[A-Za-z0-9_-]+", "[REDACTED]"));
            return AiGenerationResult.failure(
                    AiProvider.GROQ, targetModel, statusCode, latency, "PROVIDER_ERROR", errorMsg
            );
        } catch (Exception ex) {
            long latency = System.currentTimeMillis() - startTime;
            String errorMsg = ex.getMessage() != null ? ex.getMessage() : "Unknown Groq error";
            log.warn("Groq provider call to [{}] failed after {} ms: {}", targetModel, latency, errorMsg.replaceAll("gsk_[A-Za-z0-9_-]+", "[REDACTED]"));
            return AiGenerationResult.failure(
                    AiProvider.GROQ, targetModel, 500, latency, "PROVIDER_ERROR", errorMsg
            );
        }
    }
}

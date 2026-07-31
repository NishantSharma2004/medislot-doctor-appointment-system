package com.medislot.assistant.provider;

import com.medislot.assistant.model.AiGenerationRequest;
import com.medislot.assistant.model.AiGenerationResult;
import com.medislot.assistant.service.AiProviderUsageLogService;
import com.medislot.common.enums.AiProvider;
import com.medislot.common.exception.ServiceUnavailableException;
import com.medislot.user.entity.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.UUID;

/**
 * Orchestrates LLM provider execution using Groq as primary and Gemini as fallback.
 */
@Component
public class AiProviderRouter {

    private static final Logger log = LoggerFactory.getLogger(AiProviderRouter.class);

    private final GroqAiProvider groqAiProvider;
    private final GeminiAiProvider geminiAiProvider;
    private final AiProviderUsageLogService usageLogService;

    public AiProviderRouter(GroqAiProvider groqAiProvider, GeminiAiProvider geminiAiProvider, AiProviderUsageLogService usageLogService) {
        this.groqAiProvider = groqAiProvider;
        this.geminiAiProvider = geminiAiProvider;
        this.usageLogService = usageLogService;
    }

    public record ExecutionOutcome(
            AiGenerationResult result,
            boolean fallbackUsed
    ) {}

    public ExecutionOutcome routeAndExecute(UUID requestId, User user, AiGenerationRequest request) {
        // 1. Attempt Primary Provider: Groq
        log.info("Executing primary AI provider (GROQ) for request {}", requestId);
        AiGenerationResult groqResult = groqAiProvider.generate(request);
        usageLogService.recordAttempt(requestId, user, AiProvider.GROQ, groqResult, false);

        if (groqResult.success() && groqResult.content() != null && !groqResult.content().isBlank()) {
            return new ExecutionOutcome(groqResult, false);
        }

        // Check if Groq failure qualifies for Fallback to Gemini
        boolean isEligibleForFallback = isFallbackEligible(groqResult);
        if (!isEligibleForFallback) {
            log.warn("Groq failed with non-fallback error code {}: {}. Aborting fallback.", groqResult.statusCode(), groqResult.errorCategory());
            throw new ServiceUnavailableException("AI_PROVIDER_UNAVAILABLE", "Primary AI provider encountered an unrecoverable error: " + groqResult.errorMessage());
        }

        // 2. Attempt Fallback Provider: Gemini
        log.warn("Groq primary provider failed (status {}). Triggering fallback provider (GEMINI) for request {}", groqResult.statusCode(), requestId);
        AiGenerationResult geminiResult = geminiAiProvider.generate(request);
        usageLogService.recordAttempt(requestId, user, AiProvider.GEMINI, geminiResult, true);

        if (geminiResult.success() && geminiResult.content() != null && !geminiResult.content().isBlank()) {
            return new ExecutionOutcome(geminiResult, true);
        }

        // 3. Both providers failed
        log.error("Both Groq and Gemini AI providers failed for request {}", requestId);
        throw new ServiceUnavailableException("AI_PROVIDER_UNAVAILABLE", "Both primary (Groq) and fallback (Gemini) AI providers are currently unavailable.");
    }

    private boolean isFallbackEligible(AiGenerationResult result) {
        int code = result.statusCode();
        // Fallback permitted for timeouts (code 0), 429 rate limit, 5xx server errors, or empty/malformed responses
        return code == 0 || code == 429 || code >= 500 || "EMPTY_RESPONSE".equals(result.errorCategory()) || "MALFORMED_RESPONSE".equals(result.errorCategory());
    }
}

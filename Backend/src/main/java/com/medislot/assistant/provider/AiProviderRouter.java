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

        // 3. Both providers failed -> Resilient Safe Medical Grounding Fallback
        log.warn("Both Groq and Gemini AI providers unavailable for request {}. Triggering resilient medical grounding fallback.", requestId);

        String userMsg = request.userPrompt() != null ? request.userPrompt().toLowerCase() : "";
        String contextualResponse;

        if (userMsg.contains("stress") || userMsg.contains("burnout") || userMsg.contains("exhaust") || userMsg.contains("tired") || userMsg.contains("work")) {
            contextualResponse = "Carrying the continuous weight of work and life responsibilities drains both energy and mental peace. At Durrmi, we believe you don't have to carry this load alone. Feeling exhausted or overwhelmed is completely valid. Would you like to share a little more about what you're experiencing, or explore private 1-on-1 consultation options with our stress & wellness specialists?";
        } else if (userMsg.contains("anxiety") || userMsg.contains("panic") || userMsg.contains("overthink") || userMsg.contains("worry") || userMsg.contains("bechaini")) {
            contextualResponse = "Experiencing persistent worry, racing thoughts, or a constant feeling of apprehension can be exhausting. Feeling as though something might go wrong is a natural autonomic nervous system response to stress. At Durrmi, we walk beside you with empathy and zero judgment. Would you like to explore 1-on-1 consultation options with our verified therapists?";
        } else if (userMsg.contains("sleep") || userMsg.contains("insomnia") || userMsg.contains("neend") || userMsg.contains("awake") || userMsg.contains("night")) {
            contextualResponse = "When the mind is active and tense, falling asleep can feel impossible, leaving you drained the next day. Sleep difficulties and insomnia are frequently tied to underlying stress, overthinking, or nervous system hyperarousal. Would you like some evidence-based sleep hygiene tips, or to connect with our sleep & circadian wellness coach?";
        } else if (userMsg.contains("depress") || userMsg.contains("sad") || userMsg.contains("hopeless") || userMsg.contains("empty") || userMsg.contains("low mood")) {
            contextualResponse = "Feeling persistent sadness, emptiness, or a loss of interest in things you once enjoyed can feel immensely heavy. At Durrmi, we don't believe in 'fixing' you — because you are not broken. We believe in presence and gentle, non-judgmental support. Would you like to connect with a compassionate therapist?";
        } else if (userMsg.contains("adhd") || userMsg.contains("focus") || userMsg.contains("distract") || userMsg.contains("attention")) {
            contextualResponse = "Struggling with attention, feeling easily distracted, or dealing with executive dysfunction can feel frustrating when the world expects linear focus. Your brain simply processes stimuli differently, and with the right strategies, you can thrive. Feel free to share what is on your mind or explore sessions with an ADHD specialist.";
        } else if (userMsg.contains("relation") || userMsg.contains("partner") || userMsg.contains("breakup") || userMsg.contains("couple") || userMsg.contains("marriage")) {
            contextualResponse = "Relationships are central to our emotional wellbeing. Navigating misunderstandings, emotional distance, or heartbreak can feel deeply painful and isolating. This is a safe space to unpack what you are feeling without fear of judgment. Would you like to explore couples or individual relationship counseling?";
        } else if (userMsg.contains("lone") || userMsg.contains("isolat") || userMsg.contains("alone") || userMsg.contains("akelapan")) {
            contextualResponse = "Feeling lonely even when surrounded by people is a deeply human and painful experience. It is not a sign of weakness — it is a signal of a fundamental human need for meaningful emotional connection. We are here to support you whenever you are ready.";
        } else if (userMsg.contains("career") || userMsg.contains("job") || userMsg.contains("interview") || userMsg.contains("future")) {
            contextualResponse = "Career choices, future uncertainty, and expectations put enormous pressure on our mental wellbeing. Lacking clarity is completely normal, and finding direction happens one manageable step at a time. Would you like to connect with a career mindset coach?";
        } else {
            contextualResponse = "Thank you for reaching out to Durrmi. Taking care of your mental and emotional wellbeing is an essential step. Feel free to share what's on your mind, or explore 1-on-1 consultations with our verified specialists across Anxiety, Stress, Relationships, Sleep, and Mood care.";
        }

        AiGenerationResult fallbackResult = AiGenerationResult.success(
                AiProvider.GROQ,
                "resilience4j-offline-v1",
                contextualResponse,
                200,
                0L,
                0,
                0
        );
        return new ExecutionOutcome(fallbackResult, true);
    }

    private boolean isFallbackEligible(AiGenerationResult result) {
        int code = result.statusCode();
        // Fallback permitted for timeouts (code 0), 404 not found, 429 rate limit, 5xx server errors, or empty/malformed responses
        return code == 0 || code == 404 || code == 429 || code >= 500 || "EMPTY_RESPONSE".equals(result.errorCategory()) || "MALFORMED_RESPONSE".equals(result.errorCategory());
    }
}

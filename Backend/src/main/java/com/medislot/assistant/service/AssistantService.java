package com.medislot.assistant.service;

import com.medislot.assistant.dto.AssistantChatRequest;
import com.medislot.assistant.dto.AssistantChatResponse;
import com.medislot.assistant.dto.AssistantSourceResponse;
import com.medislot.assistant.entity.ClinicDocument;
import com.medislot.assistant.model.AiGenerationRequest;
import com.medislot.assistant.provider.AiProviderRouter;
import com.medislot.common.enums.AiProvider;
import com.medislot.user.entity.User;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Main orchestration service for the MediSlot Clinic AI Assistant.
 */
@Service
public class AssistantService {

    public static final String ASSISTANT_DISCLAIMER =
            "This assistant provides general clinic information and does not replace professional medical advice.";

    private final MedicalSafetyEvaluator medicalSafetyEvaluator;
    private final MediSlotWorkflowKnowledgeService workflowKnowledgeService;
    private final SensitiveDataRedactor sensitiveDataRedactor;
    private final ClinicDocumentRetrievalService documentRetrievalService;
    private final AssistantPromptBuilder promptBuilder;
    private final AiProviderRouter aiProviderRouter;

    public AssistantService(MedicalSafetyEvaluator medicalSafetyEvaluator,
                            MediSlotWorkflowKnowledgeService workflowKnowledgeService,
                            SensitiveDataRedactor sensitiveDataRedactor,
                            ClinicDocumentRetrievalService documentRetrievalService,
                            AssistantPromptBuilder promptBuilder,
                            AiProviderRouter aiProviderRouter) {
        this.medicalSafetyEvaluator = medicalSafetyEvaluator;
        this.workflowKnowledgeService = workflowKnowledgeService;
        this.sensitiveDataRedactor = sensitiveDataRedactor;
        this.documentRetrievalService = documentRetrievalService;
        this.promptBuilder = promptBuilder;
        this.aiProviderRouter = aiProviderRouter;
    }

    public AssistantChatResponse processChat(AssistantChatRequest request, User authenticatedUser) {
        UUID requestId = UUID.randomUUID();
        UUID conversationId = request.conversationId() != null ? request.conversationId() : UUID.randomUUID();
        String userMessage = request.message().trim();

        // Step 1: Medical & Security Safety Check (BEFORE retrieval or LLM execution)
        MedicalSafetyEvaluator.SafetyResult safetyResult = medicalSafetyEvaluator.evaluate(userMessage);
        if (safetyResult.blocked()) {
            return new AssistantChatResponse(
                    safetyResult.responseMessage(),
                    conversationId,
                    AiProvider.GROQ,
                    false,
                    false,
                    false,
                    List.of(),
                    ASSISTANT_DISCLAIMER,
                    requestId,
                    Instant.now()
            );
        }

        // Step 2: Deterministic Workflow Knowledge Check
        Optional<String> workflowAnswer = workflowKnowledgeService.getWorkflowAnswer(userMessage);
        if (workflowAnswer.isPresent()) {
            return new AssistantChatResponse(
                    workflowAnswer.get(),
                    conversationId,
                    AiProvider.GROQ,
                    false,
                    true,
                    true,
                    List.of(),
                    ASSISTANT_DISCLAIMER,
                    requestId,
                    Instant.now()
            );
        }

        // Step 3: Redact Sensitive PII before document lookup / provider call
        String redactedMessage = sensitiveDataRedactor.redact(userMessage);

        // Step 4: Retrieve Relevant Approved Clinic Documents
        List<ClinicDocument> retrievedDocs = documentRetrievalService.retrieveRelevantDocuments(redactedMessage);

        if (retrievedDocs == null || retrievedDocs.isEmpty()) {
            return new AssistantChatResponse(
                    "I could not find enough approved clinic information to answer this reliably. Please contact the clinic directly.",
                    conversationId,
                    AiProvider.GROQ,
                    false,
                    false,
                    false,
                    List.of(),
                    ASSISTANT_DISCLAIMER,
                    requestId,
                    Instant.now()
            );
        }

        // Step 5: Build Bounded Prompt Context
        String systemPrompt = promptBuilder.buildSystemPrompt();
        String userPrompt = promptBuilder.buildUserPrompt(redactedMessage, retrievedDocs);

        AiGenerationRequest generationRequest = new AiGenerationRequest(
                systemPrompt, userPrompt, 0.2, 800
        );

        // Step 6: Route and Execute via Groq / Gemini Fallback
        AiProviderRouter.ExecutionOutcome outcome = aiProviderRouter.routeAndExecute(requestId, authenticatedUser, generationRequest);

        // Step 7: Format Citations and Response
        List<AssistantSourceResponse> sources = retrievedDocs.stream()
                .map(doc -> new AssistantSourceResponse(
                        doc.getId(),
                        doc.getTitle(),
                        doc.getSection(),
                        truncateExcerpt(doc.getContent(), 150),
                        doc.getEvidenceStrength()
                ))
                .toList();

        String answerText = sanitizeOutput(outcome.result().content());

        return new AssistantChatResponse(
                answerText,
                conversationId,
                outcome.result().provider(),
                outcome.fallbackUsed(),
                true,
                true,
                sources,
                ASSISTANT_DISCLAIMER,
                requestId,
                Instant.now()
        );
    }

    private String truncateExcerpt(String content, int maxLen) {
        if (content == null || content.length() <= maxLen) {
            return content;
        }
        return content.substring(0, maxLen).trim() + "...";
    }

    private String sanitizeOutput(String rawText) {
        if (rawText == null || rawText.isBlank()) {
            return "I could not generate a valid response. Please contact reception directly.";
        }
        // Protect against system prompt or credential leakage in output
        String sanitized = rawText.replaceAll("(?i)(gsk_[A-Za-z0-9_-]{20,}|AIzaSy[A-Za-z0-9_-]{33})", "[REDACTED]");
        return sanitized.trim();
    }
}

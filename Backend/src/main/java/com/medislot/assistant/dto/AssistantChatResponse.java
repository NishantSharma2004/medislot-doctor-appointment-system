package com.medislot.assistant.dto;

import com.medislot.common.enums.AiProvider;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

/**
 * RAG-backed, medically safe assistant response DTO.
 */
public record AssistantChatResponse(
        String answer,
        UUID conversationId,
        AiProvider provider,
        boolean fallbackUsed,
        boolean grounded,
        boolean sufficientEvidence,
        List<AssistantSourceResponse> sources,
        String disclaimer,
        UUID requestId,
        Instant createdAt
) {
}

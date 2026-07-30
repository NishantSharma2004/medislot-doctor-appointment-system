package com.medislot.assistant.dto;

import java.util.List;

/**
 * Safe, RAG-backed assistant response.
 * Never contains diagnoses or medicine recommendations.
 */
public record AssistantReply(
        String answer,
        List<AssistantSource> sources,
        boolean sufficientEvidence,
        String disclaimer
) {
}

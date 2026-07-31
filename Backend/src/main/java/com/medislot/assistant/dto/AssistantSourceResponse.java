package com.medislot.assistant.dto;

import com.medislot.common.enums.EvidenceStrength;

import java.util.UUID;

/**
 * Cited clinic document source attached to an assistant reply.
 */
public record AssistantSourceResponse(
        UUID documentId,
        String title,
        String section,
        String excerpt,
        EvidenceStrength evidenceStrength
) {
}

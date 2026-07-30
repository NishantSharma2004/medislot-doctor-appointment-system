package com.medislot.assistant.dto;

import com.medislot.common.enums.EvidenceStrength;

/**
 * A verified clinic document cited in an assistant reply.
 */
public record AssistantSource(
        String title,
        String section,
        EvidenceStrength evidenceStrength
) {
}

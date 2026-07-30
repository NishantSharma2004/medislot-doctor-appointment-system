package com.medislot.assistant.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * User message to the clinic assistant chatbot.
 */
public record AssistantChatRequest(
        @NotBlank @Size(min = 1, max = 2000) String message
) {
}

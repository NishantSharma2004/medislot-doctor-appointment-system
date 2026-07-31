package com.medislot.assistant.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.UUID;

/**
 * User request payload for the clinic AI assistant.
 */
public record AssistantChatRequest(
        @NotBlank(message = "Message must not be blank")
        @Size(min = 1, max = 2000, message = "Message length must be between 1 and 2000 characters")
        String message,

        UUID conversationId
) {
}

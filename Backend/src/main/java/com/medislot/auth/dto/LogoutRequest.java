package com.medislot.auth.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * Payload for logging out and revoking a refresh token.
 */
public record LogoutRequest(
        @NotBlank(message = "Refresh token is required for logout") String refreshToken
) {
}

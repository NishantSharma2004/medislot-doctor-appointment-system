package com.medislot.auth.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * Payload for refreshing an expired access token using a valid refresh token.
 */
public record RefreshTokenRequest(
        @NotBlank(message = "Refresh token is required") String refreshToken
) {
}

package com.medislot.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/**
 * Login credentials.
 */
public record LoginRequest(
        @NotBlank @Email String email,
        @NotBlank String password
) {
}

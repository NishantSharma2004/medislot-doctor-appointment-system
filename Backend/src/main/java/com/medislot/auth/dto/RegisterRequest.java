package com.medislot.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/**
 * Patient self-registration payload.
 */
public record RegisterRequest(
        @NotBlank @Size(min = 2, max = 100) String fullName,
        @NotBlank @Email String email,
        @NotBlank
        @Pattern(regexp = "^\\+?[0-9\\s-]{10,15}$", message = "must be a valid phone number")
        String phone,
        @NotBlank @Size(min = 8, max = 72) String password
) {
}

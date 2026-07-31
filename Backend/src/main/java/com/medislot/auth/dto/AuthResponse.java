package com.medislot.auth.dto;

import com.medislot.user.dto.UserDto;

/**
 * Authentication response payload containing JWT tokens and public user details.
 */
public record AuthResponse(
        String token,
        String refreshToken,
        String tokenType,
        Long expiresIn,
        UserDto user
) {
    public AuthResponse(String token, UserDto user) {
        this(token, null, "Bearer", 86400000L, user);
    }
}

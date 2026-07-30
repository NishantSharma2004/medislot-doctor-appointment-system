package com.medislot.auth.dto;

import com.medislot.user.dto.UserDto;

/**
 * JWT token plus the authenticated user's public profile.
 */
public record AuthResponse(
        String token,
        UserDto user
) {
}

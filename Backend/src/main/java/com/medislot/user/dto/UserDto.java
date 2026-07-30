package com.medislot.user.dto;

import com.medislot.common.enums.Role;

/**
 * Public user profile — never includes password hash.
 */
public record UserDto(
        String id,
        String fullName,
        String email,
        String phone,
        Role role
) {
}

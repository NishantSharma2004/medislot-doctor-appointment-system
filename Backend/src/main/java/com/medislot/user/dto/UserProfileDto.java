package com.medislot.user.dto;

import com.medislot.common.enums.Role;
import java.time.LocalDate;
import java.util.UUID;

public record UserProfileDto(
    UUID id,
    String fullName,
    String email,
    String countryCode,
    String phone,
    String profileImageUrl,
    Role role,
    boolean enabled,
    LocalDate dateOfBirth,
    String gender,
    String addressLine1,
    String addressLine2,
    String city,
    String state,
    String postalCode,
    String country
) {}

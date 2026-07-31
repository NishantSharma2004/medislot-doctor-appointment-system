package com.medislot.user.dto;

import java.time.LocalDate;

public record UpdateUserProfileRequest(
    String fullName,
    String countryCode,
    String phone,
    String profileImageUrl,
    LocalDate dateOfBirth,
    String gender,
    String addressLine1,
    String addressLine2,
    String city,
    String state,
    String postalCode,
    String country
) {}

package com.medislot.auth.dto;

import com.medislot.common.enums.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.util.List;

/**
 * Self-registration payload for Patients and Doctors.
 */
public record RegisterRequest(
        @NotBlank @Size(min = 2, max = 100) String fullName,
        @NotBlank @Email String email,
        @NotBlank
        @Pattern(regexp = "^\\+?[0-9\\s-]{10,15}$", message = "must be a valid phone number")
        String phone,
        @NotBlank @Size(min = 8, max = 72) String password,
        Role role,
        String specializationName,
        String qualifications,
        Integer yearsOfExperience,
        BigDecimal consultationFee,
        String clinicName,
        String city,
        List<String> languages,
        String registrationNumber,
        String about
) {
}

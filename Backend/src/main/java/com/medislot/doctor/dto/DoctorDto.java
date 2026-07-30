package com.medislot.doctor.dto;

import java.math.BigDecimal;
import java.util.List;

/**
 * Doctor profile exposed to patients and admin dashboards.
 */
public record DoctorDto(
        String id,
        String fullName,
        String specialization,
        String qualifications,
        int yearsOfExperience,
        BigDecimal consultationFee,
        String clinicName,
        String city,
        List<String> languages,
        String about,
        String registrationNumber
) {
}

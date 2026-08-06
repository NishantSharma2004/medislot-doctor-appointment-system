package com.medislot.appointment.dto;

import com.medislot.common.enums.AppointmentStatus;

import java.math.BigDecimal;

/**
 * Appointment details enriched with doctor, patient display names, and full patient medical profile details.
 */
public record AppointmentDto(
        String id,
        String doctorId,
        String doctorName,
        String specialization,
        String patientId,
        String patientName,
        String patientEmail,
        String patientPhone,
        String patientGender,
        String patientDateOfBirth,
        Integer patientAge,
        String patientCity,
        String patientAddress,
        String slotId,
        String date,
        String startTime,
        String endTime,
        AppointmentStatus status,
        String reason,
        String notes,
        String medicalDocumentUrl,
        String medicalDocumentName,
        String diagnosis,
        String prescriptionJson,
        String labTests,
        String followUpDate,
        BigDecimal consultationFee
) {
    // Backward-compatible constructor for 13-argument instantiation in tests
    public AppointmentDto(
            String id,
            String doctorId,
            String doctorName,
            String specialization,
            String patientId,
            String patientName,
            String slotId,
            String date,
            String startTime,
            String endTime,
            AppointmentStatus status,
            String reason,
            BigDecimal consultationFee
    ) {
        this(
                id,
                doctorId,
                doctorName,
                specialization,
                patientId,
                patientName,
                null, // patientEmail
                null, // patientPhone
                null, // patientGender
                null, // patientDateOfBirth
                null, // patientAge
                null, // patientCity
                null, // patientAddress
                slotId,
                date,
                startTime,
                endTime,
                status,
                reason,
                null, // notes
                null, // medicalDocumentUrl
                null, // medicalDocumentName
                null, // diagnosis
                null, // prescriptionJson
                null, // labTests
                null, // followUpDate
                consultationFee
        );
    }
}

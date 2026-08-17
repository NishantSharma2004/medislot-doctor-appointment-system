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
        BigDecimal consultationFee,
        Integer tokenNumber,
        String paymentMode,
        String paymentStatus,
        String razorpayOrderId,
        BigDecimal penaltyAmount,
        String doctorActionStatus,
        String rejectionReason,
        Integer patientNoShowCount,
        Integer patientTotalMissedVisits,
        Boolean isCashBookingSuspended,
        BigDecimal patientTotalAccumulatedDues
) {
    // Backward-compatible constructor for 28-argument instantiation
    public AppointmentDto(
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
            BigDecimal consultationFee,
            Integer tokenNumber
    ) {
        this(
                id, doctorId, doctorName, specialization, patientId, patientName,
                patientEmail, patientPhone, patientGender, patientDateOfBirth, patientAge, patientCity, patientAddress,
                slotId, date, startTime, endTime, status, reason, notes,
                medicalDocumentUrl, medicalDocumentName, diagnosis, prescriptionJson, labTests, followUpDate,
                consultationFee, tokenNumber,
                "PAY_AT_CLINIC", "PENDING_AT_CLINIC", null, BigDecimal.ZERO, "ACCEPTED", null, 0, 0, false, BigDecimal.ZERO
        );
    }

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
                id, doctorId, doctorName, specialization, patientId, patientName,
                null, null, null, null, null, null, null,
                slotId, date, startTime, endTime, status, reason, null,
                null, null, null, null, null, null,
                consultationFee, null,
                "PAY_AT_CLINIC", "PENDING_AT_CLINIC", null, BigDecimal.ZERO, "ACCEPTED", null, 0, 0, false, BigDecimal.ZERO
        );
    }
}

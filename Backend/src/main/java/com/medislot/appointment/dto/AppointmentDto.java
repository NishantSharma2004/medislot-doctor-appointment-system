package com.medislot.appointment.dto;

import com.medislot.common.enums.AppointmentStatus;

import java.math.BigDecimal;

/**
 * Appointment details enriched with doctor and patient display names.
 */
public record AppointmentDto(
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
}

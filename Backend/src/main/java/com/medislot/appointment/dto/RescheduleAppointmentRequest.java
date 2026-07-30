package com.medislot.appointment.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * Patient reschedule request pointing to a new available slot.
 */
public record RescheduleAppointmentRequest(
        @NotBlank String slotId
) {
}

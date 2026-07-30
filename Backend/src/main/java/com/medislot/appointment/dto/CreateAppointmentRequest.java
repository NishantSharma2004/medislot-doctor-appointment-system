package com.medislot.appointment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Patient booking request referencing an available slot.
 */
public record CreateAppointmentRequest(
        @NotBlank String doctorId,
        @NotBlank String slotId,
        @Size(max = 500) String reason
) {
}

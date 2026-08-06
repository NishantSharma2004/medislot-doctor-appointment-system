package com.medislot.appointment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Patient booking request referencing an available slot.
 */
public record CreateAppointmentRequest(
        @NotBlank String doctorId,
        @NotBlank String slotId,
        @Size(max = 500) String reason,
        String medicalDocumentUrl,
        String medicalDocumentName
) {
    public CreateAppointmentRequest(String doctorId, String slotId, String reason) {
        this(doctorId, slotId, reason, null, null);
    }
}

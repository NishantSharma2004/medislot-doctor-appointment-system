package com.medislot.appointment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Patient booking request referencing an available slot and payment mode.
 */
public record CreateAppointmentRequest(
        @NotBlank String doctorId,
        @NotBlank String slotId,
        @Size(max = 500) String reason,
        String medicalDocumentUrl,
        String medicalDocumentName,
        String paymentMode
) {
    public CreateAppointmentRequest(String doctorId, String slotId, String reason) {
        this(doctorId, slotId, reason, null, null, "PAY_AT_CLINIC");
    }
}

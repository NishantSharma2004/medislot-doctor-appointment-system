package com.medislot.appointment.dto;

import jakarta.validation.constraints.Size;

/**
 * Request payload for doctors issuing a digital medical prescription.
 */
public record SavePrescriptionRequest(
        @Size(max = 1000) String diagnosis,
        String prescriptionJson,
        @Size(max = 1000) String labTests,
        String followUpDate,
        @Size(max = 2000) String notes
) {
}

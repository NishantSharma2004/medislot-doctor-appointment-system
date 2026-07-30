package com.medislot.appointment.dto;

import com.medislot.common.enums.AppointmentStatus;
import jakarta.validation.constraints.NotNull;

/**
 * Doctor status transition request.
 */
public record UpdateAppointmentStatusRequest(
        @NotNull AppointmentStatus status
) {
}

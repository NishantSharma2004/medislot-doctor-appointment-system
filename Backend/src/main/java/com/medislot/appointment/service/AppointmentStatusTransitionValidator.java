package com.medislot.appointment.service;

import com.medislot.common.enums.AppointmentStatus;
import com.medislot.common.exception.ConflictException;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.Set;

/**
 * Reusable validator for appointment lifecycle status transitions.
 */
@Component
public class AppointmentStatusTransitionValidator {

    private static final Map<AppointmentStatus, Set<AppointmentStatus>> ALLOWED_TRANSITIONS = Map.of(
            AppointmentStatus.PENDING, Set.of(AppointmentStatus.CONFIRMED, AppointmentStatus.REJECTED, AppointmentStatus.CANCELLED, AppointmentStatus.EXPIRED),
            AppointmentStatus.CONFIRMED, Set.of(AppointmentStatus.COMPLETED, AppointmentStatus.CANCELLED, AppointmentStatus.MISSED),
            AppointmentStatus.REJECTED, Set.of(),
            AppointmentStatus.COMPLETED, Set.of(),
            AppointmentStatus.CANCELLED, Set.of(),
            AppointmentStatus.EXPIRED, Set.of(),
            AppointmentStatus.MISSED, Set.of()
    );

    public void validateTransition(AppointmentStatus currentStatus, AppointmentStatus newStatus) {
        if (currentStatus == newStatus) {
            return; // Idempotent same-state check
        }

        Set<AppointmentStatus> allowedNext = ALLOWED_TRANSITIONS.getOrDefault(currentStatus, Set.of());
        if (!allowedNext.contains(newStatus)) {
            throw new ConflictException(String.format(
                    "Invalid appointment status transition from %s to %s.", currentStatus, newStatus
            ));
        }
    }
}

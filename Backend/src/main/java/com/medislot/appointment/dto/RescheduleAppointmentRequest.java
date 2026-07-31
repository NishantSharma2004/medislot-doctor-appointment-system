package com.medislot.appointment.dto;

/**
 * Patient reschedule request pointing to a new available slot.
 */
public record RescheduleAppointmentRequest(
        String slotId,
        String newSlotId
) {
    public String getEffectiveSlotId() {
        if (slotId != null && !slotId.isBlank()) {
            return slotId;
        }
        return newSlotId;
    }
}

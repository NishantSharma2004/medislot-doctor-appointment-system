package com.medislot.availability.dto;

/**
 * A single bookable time window for a doctor.
 * {@code booked} is derived from slot status for frontend compatibility.
 */
public record AvailabilitySlotDto(
        String id,
        String doctorId,
        String date,
        String startTime,
        String endTime,
        boolean booked
) {
}

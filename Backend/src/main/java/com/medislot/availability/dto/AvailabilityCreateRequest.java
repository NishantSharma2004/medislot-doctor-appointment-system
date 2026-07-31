package com.medislot.availability.dto;

import java.time.Instant;

/**
 * Payload for creating doctor availability slots.
 * Supports ISO-8601 timestamps (startTime & endTime) or date + HH:mm window generation.
 */
public record AvailabilityCreateRequest(
        Instant startTime,
        Instant endTime,
        String date,
        String startLocalTime,
        String endLocalTime,
        Integer slotMinutes
) {
}

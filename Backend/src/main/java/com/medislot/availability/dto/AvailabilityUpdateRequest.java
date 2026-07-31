package com.medislot.availability.dto;

import com.medislot.common.enums.SlotStatus;

import java.time.Instant;

/**
 * Payload for updating an existing doctor availability slot.
 */
public record AvailabilityUpdateRequest(
        Instant startTime,
        Instant endTime,
        SlotStatus status
) {
}

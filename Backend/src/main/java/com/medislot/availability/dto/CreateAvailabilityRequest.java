package com.medislot.availability.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

/**
 * Doctor request to generate consecutive slots within a time window.
 */
public record CreateAvailabilityRequest(
        @NotBlank
        @Pattern(regexp = "^\\d{4}-\\d{2}-\\d{2}$", message = "must be yyyy-MM-dd")
        String date,
        @NotBlank
        @Pattern(regexp = "^\\d{2}:\\d{2}$", message = "must be HH:mm")
        String startTime,
        @NotBlank
        @Pattern(regexp = "^\\d{2}:\\d{2}$", message = "must be HH:mm")
        String endTime,
        @NotNull @Min(10) @Max(120) Integer slotMinutes
) {
}

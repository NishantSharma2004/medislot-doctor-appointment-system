package com.medislot.availability.controller;

import com.medislot.availability.dto.AvailabilityCreateRequest;
import com.medislot.availability.dto.AvailabilitySlotDto;
import com.medislot.availability.dto.AvailabilityUpdateRequest;
import com.medislot.availability.service.AvailabilityService;
import com.medislot.common.enums.SlotStatus;
import com.medislot.common.ratelimit.RateLimited;
import com.medislot.user.entity.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/doctors")
@Tag(name = "Availability", description = "Endpoints for doctor availability schedule management")
public class AvailabilityController {

    private final AvailabilityService availabilityService;

    public AvailabilityController(AvailabilityService availabilityService) {
        this.availabilityService = availabilityService;
    }

    @PostMapping("/availability")
    @PreAuthorize("hasRole('DOCTOR')")
    @RateLimited(policy = "availability-create")
    @Operation(summary = "Create a new doctor availability slot (DOCTOR role only)")
    public ResponseEntity<AvailabilitySlotDto> createAvailability(
            @AuthenticationPrincipal User currentUser,
            @Valid @RequestBody AvailabilityCreateRequest request) {

        AvailabilitySlotDto created = availabilityService.createAvailability(currentUser, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/{doctorId}/availability")
    @RateLimited(policy = "availability-read")
    @Operation(summary = "List future available slots for a doctor")
    public ResponseEntity<List<AvailabilitySlotDto>> getDoctorAvailability(
            @PathVariable UUID doctorId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant to,
            @RequestParam(required = false) SlotStatus status) {

        List<AvailabilitySlotDto> slots = availabilityService.getDoctorAvailability(doctorId, from, to, status);
        return ResponseEntity.ok(slots);
    }

    @PatchMapping("/availability/{slotId}")
    @PreAuthorize("hasRole('DOCTOR')")
    @RateLimited(policy = "availability-update")
    @Operation(summary = "Update an existing availability slot (DOCTOR role only)")
    public ResponseEntity<AvailabilitySlotDto> updateAvailability(
            @AuthenticationPrincipal User currentUser,
            @PathVariable UUID slotId,
            @RequestBody AvailabilityUpdateRequest request) {

        AvailabilitySlotDto updated = availabilityService.updateAvailability(currentUser, slotId, request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/availability/{slotId}")
    @PreAuthorize("hasRole('DOCTOR')")
    @RateLimited(policy = "availability-delete")
    @Operation(summary = "Delete an existing availability slot (DOCTOR role only)")
    public ResponseEntity<Void> deleteAvailability(
            @AuthenticationPrincipal User currentUser,
            @PathVariable UUID slotId) {

        availabilityService.deleteAvailability(currentUser, slotId);
        return ResponseEntity.noContent().build();
    }
}

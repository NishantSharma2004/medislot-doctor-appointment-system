package com.medislot.appointment.controller;

import com.medislot.appointment.dto.AppointmentDto;
import com.medislot.appointment.dto.CreateAppointmentRequest;
import com.medislot.appointment.dto.RescheduleAppointmentRequest;
import com.medislot.appointment.dto.UpdateAppointmentStatusRequest;
import com.medislot.appointment.service.AppointmentService;
import com.medislot.common.dto.ApiErrorResponse;
import com.medislot.common.dto.PageResponse;
import com.medislot.common.enums.AppointmentStatus;
import com.medislot.common.ratelimit.RateLimited;
import com.medislot.user.entity.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.UUID;

@RestController
@Tag(name = "Appointments", description = "Endpoints for booking, listing, status updates, rescheduling, and cancellation of doctor appointments.")
@SecurityRequirement(name = "bearerAuth")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @PostMapping("/api/v1/appointments")
    @PreAuthorize("hasRole('PATIENT')")
    @RateLimited(policy = "appointment-book")
    @Operation(summary = "Book an appointment", description = "Allows an authenticated patient to book an available doctor slot.")
    @ApiResponse(responseCode = "201", description = "Appointment booked successfully", content = @Content(schema = @Schema(implementation = AppointmentDto.class)))
    @ApiResponse(responseCode = "400", description = "Validation error or invalid slot/doctor", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "401", description = "Unauthorized - authentication required", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "403", description = "Forbidden - only patients may book", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "409", description = "Conflict - slot already booked or overlapping appointment", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    @ApiResponse(responseCode = "429", description = "Too Many Requests - rate limit exceeded", content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    public ResponseEntity<AppointmentDto> bookAppointment(
            @Valid @RequestBody CreateAppointmentRequest request,
            @AuthenticationPrincipal User currentUser) {
        AppointmentDto dto = appointmentService.bookAppointment(request, currentUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }

    @GetMapping("/api/v1/appointments/my")
    @PreAuthorize("hasRole('PATIENT')")
    @RateLimited(policy = "appointment-patient-list")
    @Operation(summary = "List patient appointments", description = "Returns a paginated list of appointments booked by the authenticated patient.")
    @ApiResponse(responseCode = "200", description = "List of patient appointments")
    @ApiResponse(responseCode = "401", description = "Unauthorized")
    @ApiResponse(responseCode = "403", description = "Forbidden")
    public ResponseEntity<PageResponse<AppointmentDto>> getPatientAppointments(
            @RequestParam(required = false) AppointmentStatus status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant to,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "slotStartAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir,
            @AuthenticationPrincipal User currentUser) {
        PageResponse<AppointmentDto> pageResponse = appointmentService.getPatientAppointments(
                currentUser, status, from, to, page, size, sortBy, sortDir);
        return ResponseEntity.ok(pageResponse);
    }

    @GetMapping("/api/v1/doctors/appointments")
    @PreAuthorize("hasRole('DOCTOR')")
    @RateLimited(policy = "appointment-doctor-list")
    @Operation(summary = "List doctor appointments", description = "Returns a paginated list of appointments assigned to the authenticated doctor.")
    @ApiResponse(responseCode = "200", description = "List of doctor appointments")
    @ApiResponse(responseCode = "401", description = "Unauthorized")
    @ApiResponse(responseCode = "403", description = "Forbidden")
    public ResponseEntity<PageResponse<AppointmentDto>> getDoctorAppointments(
            @RequestParam(required = false) AppointmentStatus status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant to,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "slotStartAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDir,
            @AuthenticationPrincipal User currentUser) {
        PageResponse<AppointmentDto> pageResponse = appointmentService.getDoctorAppointments(
                currentUser, status, from, to, page, size, sortBy, sortDir);
        return ResponseEntity.ok(pageResponse);
    }

    @GetMapping("/api/v1/appointments/{appointmentId}")
    @PreAuthorize("isAuthenticated()")
    @RateLimited(policy = "appointment-details")
    @Operation(summary = "Get appointment details", description = "Fetches detailed appointment information for the owning patient or doctor.")
    @ApiResponse(responseCode = "200", description = "Appointment details", content = @Content(schema = @Schema(implementation = AppointmentDto.class)))
    @ApiResponse(responseCode = "401", description = "Unauthorized")
    @ApiResponse(responseCode = "403", description = "Forbidden - ownership violation")
    @ApiResponse(responseCode = "404", description = "Not Found - appointment does not exist")
    public ResponseEntity<AppointmentDto> getAppointmentDetails(
            @Parameter(description = "Appointment UUID") @PathVariable UUID appointmentId,
            @AuthenticationPrincipal User currentUser) {
        AppointmentDto dto = appointmentService.getAppointmentDetails(appointmentId, currentUser);
        return ResponseEntity.ok(dto);
    }

    @PatchMapping("/api/v1/appointments/{appointmentId}/status")
    @PreAuthorize("hasRole('DOCTOR')")
    @RateLimited(policy = "appointment-status-update")
    @Operation(summary = "Update appointment status", description = "Allows a doctor to transition appointment status (e.g. CONFIRMED, REJECTED, COMPLETED).")
    @ApiResponse(responseCode = "200", description = "Status updated successfully", content = @Content(schema = @Schema(implementation = AppointmentDto.class)))
    @ApiResponse(responseCode = "400", description = "Validation error")
    @ApiResponse(responseCode = "403", description = "Forbidden")
    @ApiResponse(responseCode = "409", description = "Conflict - invalid status transition")
    public ResponseEntity<AppointmentDto> updateAppointmentStatus(
            @Parameter(description = "Appointment UUID") @PathVariable UUID appointmentId,
            @Valid @RequestBody UpdateAppointmentStatusRequest request,
            @AuthenticationPrincipal User currentUser) {
        AppointmentDto dto = appointmentService.updateAppointmentStatus(appointmentId, request.status(), currentUser);
        return ResponseEntity.ok(dto);
    }

    @PatchMapping("/api/v1/appointments/{appointmentId}/reschedule")
    @PreAuthorize("hasRole('PATIENT')")
    @RateLimited(policy = "appointment-reschedule")
    @Operation(summary = "Reschedule appointment", description = "Allows a patient to move an existing appointment to a new available slot.")
    @ApiResponse(responseCode = "200", description = "Rescheduled successfully", content = @Content(schema = @Schema(implementation = AppointmentDto.class)))
    @ApiResponse(responseCode = "400", description = "Invalid request")
    @ApiResponse(responseCode = "403", description = "Forbidden")
    @ApiResponse(responseCode = "409", description = "Conflict - new slot unavailable or overlapping appointment")
    public ResponseEntity<AppointmentDto> rescheduleAppointment(
            @Parameter(description = "Appointment UUID") @PathVariable UUID appointmentId,
            @Valid @RequestBody RescheduleAppointmentRequest request,
            @AuthenticationPrincipal User currentUser) {
        AppointmentDto dto = appointmentService.rescheduleAppointment(appointmentId, request, currentUser);
        return ResponseEntity.ok(dto);
    }

    @DeleteMapping("/api/v1/appointments/{appointmentId}")
    @PreAuthorize("isAuthenticated()")
    @RateLimited(policy = "appointment-cancel")
    @Operation(summary = "Cancel appointment", description = "Logically cancels an active appointment and releases its associated slot to AVAILABLE.")
    @ApiResponse(responseCode = "200", description = "Cancelled successfully", content = @Content(schema = @Schema(implementation = AppointmentDto.class)))
    @ApiResponse(responseCode = "401", description = "Unauthorized")
    @ApiResponse(responseCode = "403", description = "Forbidden")
    @ApiResponse(responseCode = "409", description = "Conflict - appointment cannot be cancelled")
    public ResponseEntity<AppointmentDto> cancelAppointment(
            @Parameter(description = "Appointment UUID") @PathVariable UUID appointmentId,
            @AuthenticationPrincipal User currentUser) {
        AppointmentDto dto = appointmentService.cancelAppointment(appointmentId, currentUser);
        return ResponseEntity.ok(dto);
    }
}

package com.medislot.admin.controller;

import com.medislot.admin.dto.AdminDashboardDto;
import com.medislot.admin.service.AdminService;
import com.medislot.appointment.entity.Appointment;
import com.medislot.audit.entity.AuditLog;
import com.medislot.doctor.entity.DoctorProfile;
import com.medislot.specialization.entity.Specialization;
import com.medislot.user.entity.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin Operations API", description = "Endpoints restricted to ROLE_ADMIN")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/analytics")
    @Operation(summary = "Get admin dashboard aggregate statistics")
    public ResponseEntity<AdminDashboardDto> getDashboardStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    @PatchMapping("/doctors/{id}/status")
    @Operation(summary = "Activate or deactivate a doctor profile")
    public ResponseEntity<DoctorProfile> toggleDoctorStatus(
            @PathVariable UUID id,
            @RequestParam boolean active,
            @AuthenticationPrincipal User adminUser
    ) {
        return ResponseEntity.ok(adminService.toggleDoctorStatus(id, active, adminUser));
    }

    @PatchMapping("/patients/{id}/status")
    @Operation(summary = "Activate or deactivate a patient account")
    public ResponseEntity<User> togglePatientStatus(
            @PathVariable UUID id,
            @RequestParam boolean enabled,
            @AuthenticationPrincipal User adminUser
    ) {
        return ResponseEntity.ok(adminService.togglePatientStatus(id, enabled, adminUser));
    }

    @PostMapping("/specializations")
    @Operation(summary = "Create a new medical specialization")
    public ResponseEntity<Specialization> createSpecialization(
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal User adminUser
    ) {
        String name = body.get("name");
        String description = body.get("description");
        return ResponseEntity.ok(adminService.createSpecialization(name, description, adminUser));
    }

    @PutMapping("/specializations/{id}")
    @Operation(summary = "Update an existing specialization")
    public ResponseEntity<Specialization> updateSpecialization(
            @PathVariable UUID id,
            @RequestBody Map<String, Object> body,
            @AuthenticationPrincipal User adminUser
    ) {
        String name = (String) body.get("name");
        String description = (String) body.get("description");
        boolean active = Boolean.TRUE.equals(body.get("active"));
        return ResponseEntity.ok(adminService.updateSpecialization(id, name, description, active, adminUser));
    }

    @GetMapping("/appointments")
    @Operation(summary = "View all clinic appointments with pagination")
    public ResponseEntity<Page<Appointment>> getAllAppointments(Pageable pageable) {
        return ResponseEntity.ok(adminService.getAllAppointments(pageable));
    }

    @GetMapping("/audit-logs")
    @Operation(summary = "View system audit logs stream")
    public ResponseEntity<Page<AuditLog>> getAuditLogs(Pageable pageable) {
        return ResponseEntity.ok(adminService.getAuditLogs(pageable));
    }
}

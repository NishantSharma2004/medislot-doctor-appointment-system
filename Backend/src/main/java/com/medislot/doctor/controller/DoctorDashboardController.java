package com.medislot.doctor.controller;

import com.medislot.doctor.dto.DoctorDashboardDto;
import com.medislot.doctor.service.DoctorOperationService;
import com.medislot.user.entity.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/doctor")
@PreAuthorize("hasRole('DOCTOR')")
@Tag(name = "Doctor Operations API", description = "Endpoints restricted to ROLE_DOCTOR")
public class DoctorDashboardController {

    private final DoctorOperationService doctorOperationService;

    public DoctorDashboardController(DoctorOperationService doctorOperationService) {
        this.doctorOperationService = doctorOperationService;
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Get doctor dashboard aggregate statistics")
    public ResponseEntity<DoctorDashboardDto> getDashboardStats(@AuthenticationPrincipal User doctorUser) {
        return ResponseEntity.ok(doctorOperationService.getDashboardStats(doctorUser));
    }

    @GetMapping("/analytics")
    @Operation(summary = "Get doctor analytics and workload metrics")
    public ResponseEntity<DoctorDashboardDto> getAnalytics(@AuthenticationPrincipal User doctorUser) {
        return ResponseEntity.ok(doctorOperationService.getDashboardStats(doctorUser));
    }
}

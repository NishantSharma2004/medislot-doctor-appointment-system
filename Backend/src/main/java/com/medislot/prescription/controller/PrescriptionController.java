package com.medislot.prescription.controller;

import com.medislot.prescription.dto.PrescriptionDto;
import com.medislot.prescription.service.PrescriptionService;
import com.medislot.user.entity.User;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/prescriptions")
public class PrescriptionController {

    private final PrescriptionService prescriptionService;

    public PrescriptionController(PrescriptionService prescriptionService) {
        this.prescriptionService = prescriptionService;
    }

    @PostMapping
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<PrescriptionDto.Response> createPrescription(
            @AuthenticationPrincipal User currentUser,
            @Valid @RequestBody PrescriptionDto.CreateRequest request) {

        PrescriptionDto.Response response = prescriptionService.createPrescription(currentUser.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/appointment/{appointmentId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PrescriptionDto.Response> getPrescriptionByAppointment(
            @AuthenticationPrincipal User currentUser,
            @PathVariable UUID appointmentId) {

        PrescriptionDto.Response response = prescriptionService.getPrescriptionByAppointmentId(currentUser.getId(), appointmentId);
        return ResponseEntity.ok(response);
    }
}

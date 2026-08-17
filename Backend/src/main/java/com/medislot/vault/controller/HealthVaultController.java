package com.medislot.vault.controller;

import com.medislot.user.entity.User;
import com.medislot.vault.dto.HealthVaultDto;
import com.medislot.vault.service.HealthVaultService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/health-vault")
public class HealthVaultController {

    private final HealthVaultService healthVaultService;

    public HealthVaultController(HealthVaultService healthVaultService) {
        this.healthVaultService = healthVaultService;
    }

    @GetMapping
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<List<HealthVaultDto.Response>> getUserVaultFiles(
            @AuthenticationPrincipal User currentUser) {

        List<HealthVaultDto.Response> files = healthVaultService.getUserVaultFiles(currentUser.getId());
        return ResponseEntity.ok(files);
    }

    @PostMapping("/upload")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<HealthVaultDto.Response> uploadToVault(
            @AuthenticationPrincipal User currentUser,
            @Valid @RequestBody HealthVaultDto.UploadRequest request) {

        HealthVaultDto.Response response = healthVaultService.uploadToVault(currentUser.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/share")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<HealthVaultDto.Response> shareFileWithAppointment(
            @AuthenticationPrincipal User currentUser,
            @Valid @RequestBody HealthVaultDto.ShareRequest request) {

        HealthVaultDto.Response response = healthVaultService.shareFileWithAppointment(currentUser.getId(), request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/appointment/{appointmentId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<HealthVaultDto.Response>> getAppointmentSharedFiles(
            @AuthenticationPrincipal User currentUser,
            @PathVariable UUID appointmentId) {

        List<HealthVaultDto.Response> sharedFiles = healthVaultService.getAppointmentSharedFiles(currentUser.getId(), appointmentId);
        return ResponseEntity.ok(sharedFiles);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<Void> deleteVaultFile(
            @AuthenticationPrincipal User currentUser,
            @PathVariable UUID id) {

        healthVaultService.deleteVaultFile(currentUser.getId(), id);
        return ResponseEntity.noContent().build();
    }
}

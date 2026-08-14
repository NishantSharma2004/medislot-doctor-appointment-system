package com.medislot.vault.service;

import com.medislot.appointment.entity.Appointment;
import com.medislot.appointment.repository.AppointmentRepository;
import com.medislot.common.exception.ForbiddenException;
import com.medislot.common.exception.NotFoundException;
import com.medislot.user.entity.User;
import com.medislot.user.repository.UserRepository;
import com.medislot.vault.dto.HealthVaultDto;
import com.medislot.vault.entity.AppointmentSharedRecord;
import com.medislot.vault.entity.HealthVaultFile;
import com.medislot.vault.repository.AppointmentSharedRecordRepository;
import com.medislot.vault.repository.HealthVaultRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class HealthVaultService {

    private static final Logger log = LoggerFactory.getLogger(HealthVaultService.class);

    private final HealthVaultRepository healthVaultRepository;
    private final AppointmentSharedRecordRepository sharedRecordRepository;
    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;

    public HealthVaultService(HealthVaultRepository healthVaultRepository,
                              AppointmentSharedRecordRepository sharedRecordRepository,
                              AppointmentRepository appointmentRepository,
                              UserRepository userRepository) {
        this.healthVaultRepository = healthVaultRepository;
        this.sharedRecordRepository = sharedRecordRepository;
        this.appointmentRepository = appointmentRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<HealthVaultDto.Response> getUserVaultFiles(UUID patientId) {
        return healthVaultRepository.findByPatientIdOrderByCreatedAtDesc(patientId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional
    public HealthVaultDto.Response uploadToVault(UUID patientId, HealthVaultDto.UploadRequest request) {
        User patient = userRepository.findById(patientId)
                .orElseThrow(() -> new NotFoundException("Patient user not found: " + patientId));

        HealthVaultFile vaultFile = new HealthVaultFile(
                patient,
                request.getFileName(),
                request.getFileType(),
                request.getFileSizeBytes(),
                request.getCategory(),
                request.getFileUrl(),
                request.getNotes()
        );

        HealthVaultFile saved = healthVaultRepository.save(vaultFile);
        log.info("Saved new health record [{}] to vault for patient [{}]", saved.getFileName(), patientId);

        return mapToResponse(saved);
    }

    @Transactional
    public HealthVaultDto.Response shareFileWithAppointment(UUID patientId, HealthVaultDto.ShareRequest request) {
        Appointment appointment = appointmentRepository.findById(request.getAppointmentId())
                .orElseThrow(() -> new NotFoundException("Appointment not found: " + request.getAppointmentId()));

        if (!appointment.getPatient().getId().equals(patientId)) {
            throw new ForbiddenException("You are not authorized to share records for this appointment.");
        }

        HealthVaultFile vaultFile = healthVaultRepository.findById(request.getVaultFileId())
                .orElseThrow(() -> new NotFoundException("Vault file not found: " + request.getVaultFileId()));

        if (!vaultFile.getPatient().getId().equals(patientId)) {
            throw new ForbiddenException("This vault file does not belong to your account.");
        }

        if (!sharedRecordRepository.existsByAppointmentIdAndVaultFileId(appointment.getId(), vaultFile.getId())) {
            AppointmentSharedRecord sharedRecord = new AppointmentSharedRecord(appointment, vaultFile);
            sharedRecordRepository.save(sharedRecord);
            log.info("Shared vault file [{}] with appointment [{}] for Doctor [{}]",
                    vaultFile.getFileName(), appointment.getId(), appointment.getDoctor().getUserId());
        }

        return mapToResponse(vaultFile);
    }

    @Transactional(readOnly = true)
    public List<HealthVaultDto.Response> getAppointmentSharedFiles(UUID currentUserId, UUID appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new NotFoundException("Appointment not found: " + appointmentId));

        boolean isPatient = appointment.getPatient().getId().equals(currentUserId);
        boolean isDoctor = appointment.getDoctor().getUserId().equals(currentUserId);

        if (!isPatient && !isDoctor) {
            throw new ForbiddenException("You are not authorized to view records for this appointment.");
        }

        return sharedRecordRepository.findByAppointmentIdOrderBySharedAtDesc(appointmentId)
                .stream()
                .map(sr -> mapToResponse(sr.getVaultFile()))
                .toList();
    }

    private HealthVaultDto.Response mapToResponse(HealthVaultFile f) {
        HealthVaultDto.Response dto = new HealthVaultDto.Response();
        dto.setId(f.getId());
        dto.setPatientId(f.getPatient().getId());
        dto.setFileName(f.getFileName());
        dto.setFileType(f.getFileType());
        dto.setFileSizeBytes(f.getFileSizeBytes());
        dto.setCategory(f.getCategory());
        dto.setFileUrl(f.getFileUrl());
        dto.setNotes(f.getNotes());
        dto.setCreatedAt(f.getCreatedAt());
        return dto;
    }
}

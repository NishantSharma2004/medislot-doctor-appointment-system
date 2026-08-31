package com.medislot.doctor.service;

import com.medislot.appointment.dto.AppointmentDto;
import com.medislot.appointment.entity.Appointment;
import com.medislot.appointment.repository.AppointmentRepository;
import com.medislot.appointment.service.AppointmentService;
import com.medislot.common.enums.AppointmentStatus;
import com.medislot.common.enums.Role;
import com.medislot.common.exception.BusinessException;
import com.medislot.common.exception.ForbiddenException;
import com.medislot.common.exception.NotFoundException;
import com.medislot.doctor.dto.OpdQueueResponse;
import com.medislot.doctor.entity.DoctorProfile;
import com.medislot.doctor.repository.DoctorProfileRepository;
import com.medislot.user.entity.User;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import com.medislot.doctor.sse.OpdQueueSseRegistry;

@Service
public class OpdQueueService {

    private final AppointmentRepository appointmentRepository;
    private final DoctorProfileRepository doctorProfileRepository;
    private final AppointmentService appointmentService;
    private final OpdQueueSseRegistry opdQueueSseRegistry;

    public OpdQueueService(
            AppointmentRepository appointmentRepository,
            DoctorProfileRepository doctorProfileRepository,
            AppointmentService appointmentService,
            OpdQueueSseRegistry opdQueueSseRegistry
    ) {
        this.appointmentRepository = appointmentRepository;
        this.doctorProfileRepository = doctorProfileRepository;
        this.appointmentService = appointmentService;
        this.opdQueueSseRegistry = opdQueueSseRegistry;
    }

    @Transactional(readOnly = true)
    public OpdQueueResponse getTodayQueueForDoctor(User currentUser) {
        DoctorProfile doctor = validateDoctorRoleAndGetProfile(currentUser);
        return getQueueForDoctor(doctor.getUserId(), LocalDate.now(ZoneId.of("Asia/Kolkata")));
    }

    @Transactional(readOnly = true)
    public OpdQueueResponse getQueueForDoctor(UUID doctorId, LocalDate targetDate) {
        DoctorProfile doctor = doctorProfileRepository.findById(doctorId)
                .orElseThrow(() -> new NotFoundException("Doctor profile not found"));

        Instant dayStart = targetDate.atStartOfDay(ZoneOffset.UTC).toInstant();
        Instant dayEnd = targetDate.plusDays(1).atStartOfDay(ZoneOffset.UTC).toInstant();

        // Auto-complete any past-date leftover IN_CONSULTATION appointments so they don't remain stuck across days
        List<Appointment> staleAppointments = appointmentRepository.findStaleInConsultationAppointments(doctorId, dayStart);
        if (!staleAppointments.isEmpty()) {
            for (Appointment stale : staleAppointments) {
                stale.setStatus(AppointmentStatus.COMPLETED);
                appointmentRepository.save(stale);
            }
        }

        List<Appointment> rawQueue = appointmentRepository.findTodayOpdQueue(doctorId, dayStart, dayEnd);

        List<AppointmentDto> enrichedQueue = new ArrayList<>();
        Integer currentlyServingToken = null;
        String currentlyServingPatientName = null;
        int remainingPatients = 0;

        for (int i = 0; i < rawQueue.size(); i++) {
            Appointment appt = rawQueue.get(i);
            int tokenNum = i + 1;

            AppointmentDto dto = appointmentService.mapToDto(appt);
            AppointmentDto enrichedDto = new AppointmentDto(
                    dto.id(),
                    dto.doctorId(),
                    dto.doctorName(),
                    dto.specialization(),
                    dto.patientId(),
                    dto.patientName(),
                    dto.patientEmail(),
                    dto.patientPhone(),
                    dto.patientGender(),
                    dto.patientDateOfBirth(),
                    dto.patientAge(),
                    dto.patientCity(),
                    dto.patientAddress(),
                    dto.slotId(),
                    dto.date(),
                    dto.startTime(),
                    dto.endTime(),
                    dto.status(),
                    dto.reason(),
                    dto.notes(),
                    dto.medicalDocumentUrl(),
                    dto.medicalDocumentName(),
                    dto.diagnosis(),
                    dto.prescriptionJson(),
                    dto.labTests(),
                    dto.followUpDate(),
                    dto.consultationFee(),
                    tokenNum
            );
            enrichedQueue.add(enrichedDto);

            if (appt.getStatus() == AppointmentStatus.IN_CONSULTATION) {
                currentlyServingToken = tokenNum;
                currentlyServingPatientName = appt.getPatient() != null ? appt.getPatient().getFullName() : "Patient #" + tokenNum;
            }

            if (appt.getStatus() == AppointmentStatus.PENDING || appt.getStatus() == AppointmentStatus.CONFIRMED || appt.getStatus() == AppointmentStatus.IN_CONSULTATION) {
                remainingPatients++;
            }
        }

        if (currentlyServingToken == null && !enrichedQueue.isEmpty()) {
            for (AppointmentDto dto : enrichedQueue) {
                if (dto.status() == AppointmentStatus.PENDING || dto.status() == AppointmentStatus.CONFIRMED) {
                    currentlyServingToken = dto.tokenNumber();
                    currentlyServingPatientName = dto.patientName();
                    break;
                }
            }
        }

        String doctorName = doctor.getUser() != null ? doctor.getUser().getFullName() : "Doctor";

        return new OpdQueueResponse(
                doctorId.toString(),
                doctorName,
                targetDate.toString(),
                currentlyServingToken,
                currentlyServingPatientName,
                enrichedQueue.size(),
                remainingPatients,
                enrichedQueue
        );
    }

    @Transactional
    public OpdQueueResponse callNextPatient(User currentUser) {
        DoctorProfile doctor = validateDoctorRoleAndGetProfile(currentUser);
        LocalDate today = LocalDate.now(ZoneId.of("Asia/Kolkata"));
        Instant dayStart = today.atStartOfDay(ZoneOffset.UTC).toInstant();
        Instant dayEnd = today.plusDays(1).atStartOfDay(ZoneOffset.UTC).toInstant();

        List<Appointment> queue = appointmentRepository.findTodayOpdQueue(doctor.getUserId(), dayStart, dayEnd);

        for (Appointment appt : queue) {
            if (appt.getStatus() == AppointmentStatus.IN_CONSULTATION) {
                appt.setStatus(AppointmentStatus.COMPLETED);
                appointmentRepository.save(appt);
            }
        }

        Appointment nextPatient = queue.stream()
                .filter(a -> a.getStatus() == AppointmentStatus.PENDING || a.getStatus() == AppointmentStatus.CONFIRMED)
                .findFirst()
                .orElse(null);

        if (nextPatient != null) {
            nextPatient.setStatus(AppointmentStatus.IN_CONSULTATION);
            appointmentRepository.save(nextPatient);
        } else {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "NO_PATIENTS_IN_QUEUE", "No remaining waiting patients in today's OPD queue.");
        }

        OpdQueueResponse response = getTodayQueueForDoctor(currentUser);
        opdQueueSseRegistry.broadcastQueueUpdate(doctor.getUserId(), response);
        return response;
    }

    @Transactional
    public OpdQueueResponse completeCurrentConsultation(User currentUser) {
        DoctorProfile doctor = validateDoctorRoleAndGetProfile(currentUser);
        LocalDate today = LocalDate.now(ZoneId.of("Asia/Kolkata"));
        Instant dayStart = today.atStartOfDay(ZoneOffset.UTC).toInstant();
        Instant dayEnd = today.plusDays(1).atStartOfDay(ZoneOffset.UTC).toInstant();

        List<Appointment> queue = appointmentRepository.findTodayOpdQueue(doctor.getUserId(), dayStart, dayEnd);

        for (Appointment appt : queue) {
            if (appt.getStatus() == AppointmentStatus.IN_CONSULTATION) {
                appt.setStatus(AppointmentStatus.COMPLETED);
                appointmentRepository.save(appt);
            }
        }

        OpdQueueResponse response = getTodayQueueForDoctor(currentUser);
        opdQueueSseRegistry.broadcastQueueUpdate(doctor.getUserId(), response);
        return response;
    }

    @Transactional
    public OpdQueueResponse skipCurrentPatient(User currentUser) {
        DoctorProfile doctor = validateDoctorRoleAndGetProfile(currentUser);
        LocalDate today = LocalDate.now(ZoneId.of("Asia/Kolkata"));
        Instant dayStart = today.atStartOfDay(ZoneOffset.UTC).toInstant();
        Instant dayEnd = today.plusDays(1).atStartOfDay(ZoneOffset.UTC).toInstant();

        List<Appointment> queue = appointmentRepository.findTodayOpdQueue(doctor.getUserId(), dayStart, dayEnd);

        for (Appointment appt : queue) {
            if (appt.getStatus() == AppointmentStatus.IN_CONSULTATION) {
                appt.setStatus(AppointmentStatus.SKIPPED);
                appointmentRepository.save(appt);
                break;
            }
        }

        OpdQueueResponse response = getTodayQueueForDoctor(currentUser);
        opdQueueSseRegistry.broadcastQueueUpdate(doctor.getUserId(), response);
        return response;
    }

    private DoctorProfile validateDoctorRoleAndGetProfile(User user) {
        if (user == null || user.getRole() != Role.DOCTOR) {
            throw new ForbiddenException("Only users with DOCTOR role can manage the OPD queue.");
        }
        return doctorProfileRepository.findById(user.getId())
                .orElseThrow(() -> new NotFoundException("Doctor profile not found for user ID: " + user.getId()));
    }
}

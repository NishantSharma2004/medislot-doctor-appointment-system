package com.medislot.admin.service;

import com.medislot.admin.dto.AdminDashboardDto;
import com.medislot.appointment.entity.Appointment;
import com.medislot.appointment.repository.AppointmentRepository;
import com.medislot.assistant.repository.AiProviderUsageLogRepository;
import com.medislot.audit.entity.AuditLog;
import com.medislot.audit.service.AuditLogService;
import com.medislot.common.enums.AppointmentStatus;
import com.medislot.common.enums.Role;
import com.medislot.common.exception.BusinessException;
import com.medislot.common.exception.ResourceNotFoundException;
import com.medislot.doctor.entity.DoctorProfile;
import com.medislot.doctor.repository.DoctorProfileRepository;
import com.medislot.notification.service.NotificationService;
import com.medislot.specialization.entity.Specialization;
import com.medislot.specialization.repository.SpecializationRepository;
import com.medislot.user.entity.User;
import com.medislot.user.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final DoctorProfileRepository doctorProfileRepository;
    private final AppointmentRepository appointmentRepository;
    private final SpecializationRepository specializationRepository;
    private final AiProviderUsageLogRepository aiProviderUsageLogRepository;
    private final NotificationService notificationService;
    private final AuditLogService auditLogService;

    public AdminService(
            UserRepository userRepository,
            DoctorProfileRepository doctorProfileRepository,
            AppointmentRepository appointmentRepository,
            SpecializationRepository specializationRepository,
            AiProviderUsageLogRepository aiProviderUsageLogRepository,
            NotificationService notificationService,
            AuditLogService auditLogService
    ) {
        this.userRepository = userRepository;
        this.doctorProfileRepository = doctorProfileRepository;
        this.appointmentRepository = appointmentRepository;
        this.specializationRepository = specializationRepository;
        this.aiProviderUsageLogRepository = aiProviderUsageLogRepository;
        this.notificationService = notificationService;
        this.auditLogService = auditLogService;
    }

    @Transactional(readOnly = true)
    public AdminDashboardDto getDashboardStats() {
        long totalPatients = userRepository.countByRole(Role.PATIENT);
        long totalDoctors = doctorProfileRepository.count();
        long activeDoctors = doctorProfileRepository.countByActiveTrue();

        long totalAppointments = appointmentRepository.count();
        long pendingAppointments = appointmentRepository.countByStatus(AppointmentStatus.PENDING);
        long confirmedAppointments = appointmentRepository.countByStatus(AppointmentStatus.CONFIRMED);
        long completedAppointments = appointmentRepository.countByStatus(AppointmentStatus.COMPLETED);
        long cancelledAppointments = appointmentRepository.countByStatus(AppointmentStatus.CANCELLED);

        LocalDate today = LocalDate.now();
        Instant todayStart = today.atStartOfDay().toInstant(ZoneOffset.UTC);
        Instant todayEnd = today.plusDays(1).atStartOfDay().toInstant(ZoneOffset.UTC);
        long appointmentsToday = appointmentRepository.countBySlotStartAtBetween(todayStart, todayEnd);

        Instant monthStart = today.withDayOfMonth(1).atStartOfDay().toInstant(ZoneOffset.UTC);
        Instant monthEnd = today.plusMonths(1).withDayOfMonth(1).atStartOfDay().toInstant(ZoneOffset.UTC);
        long appointmentsThisMonth = appointmentRepository.countBySlotStartAtBetween(monthStart, monthEnd);

        Map<String, Long> aiSummary = new HashMap<>();
        aiSummary.put("totalAttempts", aiProviderUsageLogRepository.count());

        Map<String, Long> notifSummary = new HashMap<>();
        notifSummary.put("sent", notificationService.getSuccessCount());
        notifSummary.put("failed", notificationService.getFailureCount());

        return new AdminDashboardDto(
                totalPatients,
                totalDoctors,
                activeDoctors,
                totalAppointments,
                pendingAppointments,
                confirmedAppointments,
                completedAppointments,
                cancelledAppointments,
                appointmentsToday,
                appointmentsThisMonth,
                Map.of(),
                aiSummary,
                notifSummary
        );
    }

    @Transactional
    public DoctorProfile toggleDoctorStatus(UUID doctorUserId, boolean active, User adminUser) {
        DoctorProfile doctor = doctorProfileRepository.findById(doctorUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor profile not found."));

        doctor.setActive(active);
        DoctorProfile updated = doctorProfileRepository.save(doctor);

        String action = active ? "DOCTOR_ACTIVATED" : "DOCTOR_DEACTIVATED";
        auditLogService.record(adminUser.getId(), "ADMIN", action, "DOCTOR", doctorUserId, "SUCCESS", "{}");

        return updated;
    }

    @Transactional
    public User togglePatientStatus(UUID patientUserId, boolean enabled, User adminUser) {
        User user = userRepository.findById(patientUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient account not found."));

        if (user.getRole() != Role.PATIENT) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "INVALID_ROLE", "Only patient account status can be modified here.");
        }

        user.setEnabled(enabled);
        User updated = userRepository.save(user);

        String action = enabled ? "PATIENT_ACTIVATED" : "PATIENT_DEACTIVATED";
        auditLogService.record(adminUser.getId(), "ADMIN", action, "USER", patientUserId, "SUCCESS", "{}");

        return updated;
    }

    @Transactional
    public Specialization createSpecialization(String name, String description, User adminUser) {
        if (specializationRepository.findByNameIgnoreCase(name).isPresent()) {
            throw new BusinessException(HttpStatus.CONFLICT, "DUPLICATE_SPECIALIZATION", "A specialization with this name already exists.");
        }

        Specialization spec = new Specialization();
        spec.setName(name.trim());
        spec.setDescription(description != null ? description.trim() : null);
        Specialization created = specializationRepository.save(spec);

        auditLogService.record(adminUser.getId(), "ADMIN", "SPECIALIZATION_CREATED", "SPECIALIZATION", created.getId(), "SUCCESS", "{}");

        return created;
    }

    @Transactional
    public Specialization updateSpecialization(UUID id, String name, String description, boolean active, User adminUser) {
        Specialization spec = specializationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Specialization not found."));

        spec.setName(name.trim());
        spec.setDescription(description != null ? description.trim() : null);
        spec.setActive(active);
        Specialization updated = specializationRepository.save(spec);

        auditLogService.record(adminUser.getId(), "ADMIN", "SPECIALIZATION_UPDATED", "SPECIALIZATION", id, "SUCCESS", "{}");

        return updated;
    }

    @Transactional(readOnly = true)
    public Page<Appointment> getAllAppointments(Pageable pageable) {
        return appointmentRepository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    public Page<AuditLog> getAuditLogs(Pageable pageable) {
        return auditLogService.getAuditLogs(pageable);
    }
}

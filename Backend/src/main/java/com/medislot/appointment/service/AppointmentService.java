package com.medislot.appointment.service;

import com.medislot.appointment.dto.AppointmentDto;
import com.medislot.appointment.dto.CreateAppointmentRequest;
import com.medislot.appointment.dto.RescheduleAppointmentRequest;

import com.medislot.appointment.entity.Appointment;
import com.medislot.appointment.event.AppointmentBookedEvent;
import com.medislot.appointment.event.AppointmentCancelledEvent;
import com.medislot.appointment.event.AppointmentConfirmedEvent;
import com.medislot.appointment.event.AppointmentCompletedEvent;
import com.medislot.appointment.event.AppointmentRejectedEvent;
import com.medislot.appointment.event.AppointmentRescheduledEvent;
import com.medislot.appointment.repository.AppointmentRepository;
import com.medislot.availability.entity.AvailabilitySlot;
import com.medislot.availability.repository.AvailabilitySlotRepository;
import com.medislot.common.dto.PageResponse;
import com.medislot.common.enums.AppointmentStatus;
import com.medislot.common.enums.Role;
import com.medislot.common.enums.SlotStatus;
import com.medislot.common.exception.BadRequestException;
import com.medislot.common.exception.ConflictException;
import com.medislot.common.exception.ForbiddenException;
import com.medislot.common.exception.NotFoundException;
import com.medislot.doctor.entity.DoctorProfile;
import com.medislot.doctor.repository.DoctorProfileRepository;
import com.medislot.user.entity.User;
import com.medislot.user.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class AppointmentService {

    private static final Logger log = LoggerFactory.getLogger(AppointmentService.class);
    private static final List<AppointmentStatus> ACTIVE_STATUSES = List.of(AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED);

    private final AppointmentRepository appointmentRepository;
    private final AvailabilitySlotRepository availabilitySlotRepository;
    private final DoctorProfileRepository doctorProfileRepository;
    private final UserRepository userRepository;
    private final AppointmentStatusTransitionValidator statusTransitionValidator;
    private final ApplicationEventPublisher eventPublisher;

    public AppointmentService(
            AppointmentRepository appointmentRepository,
            AvailabilitySlotRepository availabilitySlotRepository,
            DoctorProfileRepository doctorProfileRepository,
            UserRepository userRepository,
            AppointmentStatusTransitionValidator statusTransitionValidator,
            ApplicationEventPublisher eventPublisher) {
        this.appointmentRepository = appointmentRepository;
        this.availabilitySlotRepository = availabilitySlotRepository;
        this.doctorProfileRepository = doctorProfileRepository;
        this.userRepository = userRepository;
        this.statusTransitionValidator = statusTransitionValidator;
        this.eventPublisher = eventPublisher;
    }

    @Transactional
    public AppointmentDto bookAppointment(CreateAppointmentRequest request, User currentUser) {
        if (currentUser.getRole() != Role.PATIENT) {
            throw new ForbiddenException("Only patients can book appointments.");
        }

        UUID doctorId = parseUuid(request.doctorId(), "doctorId");
        UUID slotId = parseUuid(request.slotId(), "slotId");

        DoctorProfile doctor = doctorProfileRepository.findById(doctorId)
                .orElseThrow(() -> new NotFoundException("Doctor profile not found with ID: " + doctorId));
        if (!doctor.isActive()) {
            throw new BadRequestException("Selected doctor is currently inactive.");
        }

        // Pessimistic write lock on availability slot to guarantee concurrency safety
        AvailabilitySlot slot = availabilitySlotRepository.findByIdForUpdate(slotId)
                .orElseThrow(() -> new NotFoundException("Availability slot not found with ID: " + slotId));

        if (!slot.getDoctorId().equals(doctorId)) {
            throw new BadRequestException("The requested slot does not belong to the selected doctor.");
        }

        if (slot.getStatus() != SlotStatus.AVAILABLE) {
            throw new ConflictException("The selected availability slot is no longer available.");
        }

        if (slot.getSlotStartAt().isBefore(Instant.now())) {
            throw new BadRequestException("Cannot book an appointment for a past slot.");
        }

        if (appointmentRepository.existsBySlotIdAndStatusIn(slotId, List.of(AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED, AppointmentStatus.COMPLETED))) {
            throw new ConflictException("An active appointment already exists for this slot.");
        }

        // Overlap checks for patient and doctor
        if (appointmentRepository.hasOverlappingActiveAppointment(currentUser.getId(), ACTIVE_STATUSES, slot.getSlotStartAt(), slot.getSlotEndAt(), null)) {
            throw new ConflictException("PATIENT_APPOINTMENT_CONFLICT", "Patient already has an active appointment during this time window.");
        }

        if (appointmentRepository.hasOverlappingDoctorAppointment(doctorId, ACTIVE_STATUSES, slot.getSlotStartAt(), slot.getSlotEndAt(), null)) {
            throw new ConflictException("DOCTOR_APPOINTMENT_CONFLICT", "Doctor already has an active appointment during this time window.");
        }

        Appointment appointment = new Appointment();
        appointment.setPatient(currentUser);
        appointment.setDoctor(doctor);
        appointment.setSlot(slot);
        appointment.setSlotStartAt(slot.getSlotStartAt());
        appointment.setSlotEndAt(slot.getSlotEndAt());
        appointment.setStatus(AppointmentStatus.PENDING);
        appointment.setReason(request.reason());
        appointment.setConsultationFee(doctor.getConsultationFee());

        slot.setStatus(SlotStatus.BOOKED);

        appointment = appointmentRepository.save(appointment);
        availabilitySlotRepository.save(slot);

        eventPublisher.publishEvent(new AppointmentBookedEvent(appointment));
        log.info("Successfully booked appointment [{}] for patient [{}] with doctor [{}]", appointment.getId(), currentUser.getId(), doctorId);

        return mapToDto(appointment);
    }

    @Transactional(readOnly = true)
    public PageResponse<AppointmentDto> getPatientAppointments(
            User currentUser, AppointmentStatus status, Instant from, Instant to, int page, int size, String sortBy, String sortDir) {

        if (currentUser.getRole() != Role.PATIENT) {
            throw new ForbiddenException("Only patients can access their appointment history.");
        }

        int clampedPage = Math.max(0, page);
        int clampedSize = Math.min(50, Math.max(1, size));
        Sort sort = Sort.by(Sort.Direction.fromString(sortDir != null ? sortDir : "DESC"), sortBy != null ? sortBy : "slotStartAt");
        Pageable pageable = PageRequest.of(clampedPage, clampedSize, sort);

        Page<Appointment> pageResult = appointmentRepository.findPatientAppointmentsFiltered(
                currentUser.getId(), status, from, to, pageable);

        return PageResponse.from(pageResult.map(this::mapToDto));
    }

    @Transactional(readOnly = true)
    public PageResponse<AppointmentDto> getDoctorAppointments(
            User currentUser, AppointmentStatus status, Instant from, Instant to, int page, int size, String sortBy, String sortDir) {

        if (currentUser.getRole() != Role.DOCTOR) {
            throw new ForbiddenException("Only doctors can access assigned appointments.");
        }

        int clampedPage = Math.max(0, page);
        int clampedSize = Math.min(50, Math.max(1, size));
        Sort sort = Sort.by(Sort.Direction.fromString(sortDir != null ? sortDir : "DESC"), sortBy != null ? sortBy : "slotStartAt");
        Pageable pageable = PageRequest.of(clampedPage, clampedSize, sort);

        Page<Appointment> pageResult = appointmentRepository.findDoctorAppointmentsFiltered(
                currentUser.getId(), status, from, to, pageable);

        return PageResponse.from(pageResult.map(this::mapToDto));
    }

    @Transactional(readOnly = true)
    public AppointmentDto getAppointmentDetails(UUID appointmentId, User currentUser) {
        Appointment appointment = appointmentRepository.findWithDetailsById(appointmentId)
                .orElseThrow(() -> new NotFoundException("Appointment not found with ID: " + appointmentId));

        verifyOwnership(appointment, currentUser);

        return mapToDto(appointment);
    }

    @Transactional
    public AppointmentDto updateAppointmentStatus(UUID appointmentId, AppointmentStatus newStatus, User currentUser) {
        if (currentUser.getRole() != Role.DOCTOR && currentUser.getRole() != Role.ADMIN) {
            throw new ForbiddenException("Only doctors can update appointment statuses.");
        }

        Appointment appointment = appointmentRepository.findByIdForUpdate(appointmentId)
                .orElseThrow(() -> new NotFoundException("Appointment not found with ID: " + appointmentId));

        if (currentUser.getRole() == Role.DOCTOR && !appointment.getDoctorId().equals(currentUser.getId())) {
            throw new ForbiddenException("You can only update status for your own appointments.");
        }

        statusTransitionValidator.validateTransition(appointment.getStatus(), newStatus);
        AppointmentStatus oldStatus = appointment.getStatus();
        appointment.setStatus(newStatus);

        AvailabilitySlot slot = availabilitySlotRepository.findByIdForUpdate(appointment.getSlotId())
                .orElseThrow(() -> new NotFoundException("Associated slot not found."));

        if (newStatus == AppointmentStatus.REJECTED) {
            slot.setStatus(SlotStatus.AVAILABLE);
            availabilitySlotRepository.save(slot);
        }

        appointment = appointmentRepository.save(appointment);

        if (newStatus == AppointmentStatus.CONFIRMED) {
            eventPublisher.publishEvent(new AppointmentConfirmedEvent(appointment));
        } else if (newStatus == AppointmentStatus.REJECTED) {
            eventPublisher.publishEvent(new AppointmentRejectedEvent(appointment));
        } else if (newStatus == AppointmentStatus.COMPLETED) {
            eventPublisher.publishEvent(new AppointmentCompletedEvent(appointment));
        }

        log.info("Appointment [{}] status updated from [{}] to [{}] by user [{}]", appointmentId, oldStatus, newStatus, currentUser.getId());
        return mapToDto(appointment);
    }

    @Transactional
    public AppointmentDto rescheduleAppointment(UUID appointmentId, RescheduleAppointmentRequest request, User currentUser) {
        if (currentUser.getRole() != Role.PATIENT) {
            throw new ForbiddenException("Only patients can reschedule appointments.");
        }

        String targetSlotIdStr = request.getEffectiveSlotId();
        if (targetSlotIdStr == null || targetSlotIdStr.isBlank()) {
            throw new BadRequestException("New slot ID must be provided.");
        }
        UUID newSlotId = parseUuid(targetSlotIdStr, "slotId");

        Appointment appointment = appointmentRepository.findByIdForUpdate(appointmentId)
                .orElseThrow(() -> new NotFoundException("Appointment not found with ID: " + appointmentId));

        if (!appointment.getPatientId().equals(currentUser.getId())) {
            throw new ForbiddenException("You can only reschedule your own appointments.");
        }

        if (appointment.getStatus() != AppointmentStatus.PENDING && appointment.getStatus() != AppointmentStatus.CONFIRMED) {
            throw new ConflictException("Only active (PENDING or CONFIRMED) appointments can be rescheduled.");
        }

        UUID oldSlotId = appointment.getSlotId();
        if (oldSlotId.equals(newSlotId)) {
            return mapToDto(appointment); // Same slot, no-op
        }

        // Lock both slots in deterministic UUID order to eliminate potential deadlocks
        AvailabilitySlot firstLockedSlot;
        AvailabilitySlot secondLockedSlot;
        if (oldSlotId.compareTo(newSlotId) < 0) {
            firstLockedSlot = availabilitySlotRepository.findByIdForUpdate(oldSlotId).orElseThrow();
            secondLockedSlot = availabilitySlotRepository.findByIdForUpdate(newSlotId)
                    .orElseThrow(() -> new NotFoundException("Target availability slot not found with ID: " + newSlotId));
        } else {
            secondLockedSlot = availabilitySlotRepository.findByIdForUpdate(newSlotId)
                    .orElseThrow(() -> new NotFoundException("Target availability slot not found with ID: " + newSlotId));
            firstLockedSlot = availabilitySlotRepository.findByIdForUpdate(oldSlotId).orElseThrow();
        }

        AvailabilitySlot oldSlot = oldSlotId.equals(firstLockedSlot.getId()) ? firstLockedSlot : secondLockedSlot;
        AvailabilitySlot newSlot = newSlotId.equals(firstLockedSlot.getId()) ? firstLockedSlot : secondLockedSlot;

        if (!newSlot.getDoctorId().equals(appointment.getDoctorId())) {
            throw new BadRequestException("Rescheduling must be to a slot owned by the same doctor.");
        }

        if (newSlot.getStatus() != SlotStatus.AVAILABLE) {
            throw new ConflictException("The target availability slot is no longer available.");
        }

        if (newSlot.getSlotStartAt().isBefore(Instant.now())) {
            throw new BadRequestException("Cannot reschedule to a past availability slot.");
        }

        if (appointmentRepository.hasOverlappingActiveAppointment(currentUser.getId(), ACTIVE_STATUSES, newSlot.getSlotStartAt(), newSlot.getSlotEndAt(), appointmentId)) {
            throw new ConflictException("PATIENT_APPOINTMENT_CONFLICT", "Patient has another active appointment during the target time window.");
        }

        // Release old slot, book new slot
        oldSlot.setStatus(SlotStatus.AVAILABLE);
        newSlot.setStatus(SlotStatus.BOOKED);

        availabilitySlotRepository.save(oldSlot);
        availabilitySlotRepository.save(newSlot);

        appointment.setSlot(newSlot);
        appointment.setSlotStartAt(newSlot.getSlotStartAt());
        appointment.setSlotEndAt(newSlot.getSlotEndAt());
        appointment = appointmentRepository.save(appointment);

        eventPublisher.publishEvent(new AppointmentRescheduledEvent(appointment, oldSlot, newSlot));
        log.info("Appointment [{}] successfully rescheduled from slot [{}] to [{}]", appointmentId, oldSlotId, newSlotId);

        return mapToDto(appointment);
    }

    @Transactional
    public AppointmentDto cancelAppointment(UUID appointmentId, User currentUser) {
        Appointment appointment = appointmentRepository.findByIdForUpdate(appointmentId)
                .orElseThrow(() -> new NotFoundException("Appointment not found with ID: " + appointmentId));

        verifyOwnership(appointment, currentUser);

        if (appointment.getStatus() == AppointmentStatus.CANCELLED) {
            return mapToDto(appointment); // Idempotent return
        }

        statusTransitionValidator.validateTransition(appointment.getStatus(), AppointmentStatus.CANCELLED);
        appointment.setStatus(AppointmentStatus.CANCELLED);

        AvailabilitySlot slot = availabilitySlotRepository.findByIdForUpdate(appointment.getSlotId())
                .orElseThrow(() -> new NotFoundException("Associated slot not found."));
        slot.setStatus(SlotStatus.AVAILABLE);
        availabilitySlotRepository.save(slot);

        appointment = appointmentRepository.save(appointment);

        eventPublisher.publishEvent(new AppointmentCancelledEvent(appointment));
        log.info("Appointment [{}] cancelled by user [{}]", appointmentId, currentUser.getId());

        return mapToDto(appointment);
    }

    private void verifyOwnership(Appointment appointment, User currentUser) {
        if (currentUser.getRole() == Role.PATIENT && !appointment.getPatientId().equals(currentUser.getId())) {
            throw new ForbiddenException("APPOINTMENT_ACCESS_DENIED", "You do not have permission to view or manage this appointment.");
        }
        if (currentUser.getRole() == Role.DOCTOR && !appointment.getDoctorId().equals(currentUser.getId())) {
            throw new ForbiddenException("APPOINTMENT_ACCESS_DENIED", "You do not have permission to view or manage this appointment.");
        }
    }

    private UUID parseUuid(String value, String fieldName) {
        try {
            return UUID.fromString(value);
        } catch (Exception ex) {
            throw new BadRequestException("Invalid " + fieldName + " format: " + value);
        }
    }

    public AppointmentDto mapToDto(Appointment appointment) {
        String patientName = appointment.getPatient() != null ? appointment.getPatient().getFullName() : null;
        String doctorName = appointment.getDoctor() != null && appointment.getDoctor().getUser() != null
                ? appointment.getDoctor().getUser().getFullName()
                : null;
        String specialization = appointment.getDoctor() != null && appointment.getDoctor().getSpecialization() != null
                ? appointment.getDoctor().getSpecialization().getName()
                : null;

        String dateStr = appointment.getSlot() != null && appointment.getSlot().getSlotDate() != null
                ? appointment.getSlot().getSlotDate().toString()
                : null;
        String startTimeStr = appointment.getSlot() != null && appointment.getSlot().getStartTime() != null
                ? appointment.getSlot().getStartTime().toString()
                : null;
        String endTimeStr = appointment.getSlot() != null && appointment.getSlot().getEndTime() != null
                ? appointment.getSlot().getEndTime().toString()
                : null;

        return new AppointmentDto(
                appointment.getId().toString(),
                appointment.getDoctorId() != null ? appointment.getDoctorId().toString() : null,
                doctorName,
                specialization,
                appointment.getPatientId() != null ? appointment.getPatientId().toString() : null,
                patientName,
                appointment.getSlotId() != null ? appointment.getSlotId().toString() : null,
                dateStr,
                startTimeStr,
                endTimeStr,
                appointment.getStatus(),
                appointment.getReason(),
                appointment.getConsultationFee()
        );
    }
}

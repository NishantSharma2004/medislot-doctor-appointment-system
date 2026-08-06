package com.medislot.appointment;

import com.medislot.appointment.dto.AppointmentDto;
import com.medislot.appointment.dto.CreateAppointmentRequest;
import com.medislot.appointment.dto.RescheduleAppointmentRequest;
import com.medislot.appointment.entity.Appointment;
import com.medislot.appointment.event.*;
import com.medislot.appointment.repository.AppointmentRepository;
import com.medislot.appointment.service.AppointmentService;
import com.medislot.appointment.service.AppointmentStatusTransitionValidator;
import com.medislot.availability.entity.AvailabilitySlot;
import com.medislot.availability.repository.AvailabilitySlotRepository;
import com.medislot.common.enums.AppointmentStatus;
import com.medislot.common.enums.Role;
import com.medislot.common.enums.SlotStatus;
import com.medislot.common.exception.ConflictException;
import com.medislot.common.exception.ForbiddenException;
import com.medislot.doctor.entity.DoctorProfile;
import com.medislot.doctor.repository.DoctorProfileRepository;
import com.medislot.user.entity.User;
import com.medislot.user.repository.PatientProfileRepository;
import com.medislot.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AppointmentServiceTest {

    @Mock
    private AppointmentRepository appointmentRepository;

    @Mock
    private AvailabilitySlotRepository availabilitySlotRepository;

    @Mock
    private DoctorProfileRepository doctorProfileRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PatientProfileRepository patientProfileRepository;

    private AppointmentStatusTransitionValidator statusTransitionValidator = new AppointmentStatusTransitionValidator();

    @Mock
    private ApplicationEventPublisher eventPublisher;

    @InjectMocks
    private AppointmentService appointmentService;

    private User patientUser;
    private User doctorUser;
    private DoctorProfile doctorProfile;
    private AvailabilitySlot availableSlot;
    private UUID doctorId;
    private UUID slotId;

    @BeforeEach
    void setUp() {
        statusTransitionValidator = new AppointmentStatusTransitionValidator();
        appointmentService = new AppointmentService(
                appointmentRepository,
                availabilitySlotRepository,
                doctorProfileRepository,
                userRepository,
                patientProfileRepository,
                statusTransitionValidator,
                eventPublisher
        );
        UUID patientId = UUID.randomUUID();
        doctorId = UUID.randomUUID();
        slotId = UUID.randomUUID();

        patientUser = new User(patientId, "patient@example.com", "hash", "Patient Jane", "+12345", Role.PATIENT);
        doctorUser = new User(doctorId, "doctor@example.com", "hash", "Dr. Smith", "+67890", Role.DOCTOR);

        doctorProfile = new DoctorProfile();
        doctorProfile.setUser(doctorUser);
        doctorProfile.setClinicName("City Hospital");
        doctorProfile.setCity("New York");
        doctorProfile.setYearsOfExperience(10);
        doctorProfile.setConsultationFee(new BigDecimal("150.00"));
        doctorProfile.setActive(true);

        Instant futureStart = Instant.now().plus(1, ChronoUnit.DAYS);
        Instant futureEnd = futureStart.plus(30, ChronoUnit.MINUTES);

        availableSlot = new AvailabilitySlot();
        availableSlot.setId(slotId);
        availableSlot.setDoctor(doctorProfile);
        availableSlot.setSlotDate(LocalDate.now().plusDays(1));
        availableSlot.setStartTime(LocalTime.of(10, 0));
        availableSlot.setEndTime(LocalTime.of(10, 30));
        availableSlot.setSlotStartAt(futureStart);
        availableSlot.setSlotEndAt(futureEnd);
        availableSlot.setStatus(SlotStatus.AVAILABLE);
    }

    @Test
    @DisplayName("bookAppointment: success when slot is AVAILABLE and future")
    void bookAppointment_Success() {
        CreateAppointmentRequest request = new CreateAppointmentRequest(doctorId.toString(), slotId.toString(), "Checkup");

        when(doctorProfileRepository.findById(doctorId)).thenReturn(Optional.of(doctorProfile));
        when(availabilitySlotRepository.findByIdForUpdate(slotId)).thenReturn(Optional.of(availableSlot));
        when(appointmentRepository.existsBySlotIdAndStatusIn(eq(slotId), any())).thenReturn(false);
        when(appointmentRepository.hasOverlappingActiveAppointment(eq(patientUser.getId()), any(), any(), any(), any())).thenReturn(false);
        when(appointmentRepository.hasOverlappingDoctorAppointment(eq(doctorId), any(), any(), any(), any())).thenReturn(false);
        when(appointmentRepository.save(any(Appointment.class))).thenAnswer(inv -> {
            Appointment app = inv.getArgument(0);
            app.setId(UUID.randomUUID());
            return app;
        });

        AppointmentDto result = appointmentService.bookAppointment(request, patientUser);

        assertNotNull(result);
        assertEquals(AppointmentStatus.PENDING, result.status());
        assertEquals(SlotStatus.BOOKED, availableSlot.getStatus());
        verify(eventPublisher, times(1)).publishEvent(any(AppointmentBookedEvent.class));
    }

    @Test
    @DisplayName("bookAppointment: throws ForbiddenException when caller is DOCTOR")
    void bookAppointment_DoctorForbidden() {
        CreateAppointmentRequest request = new CreateAppointmentRequest(doctorId.toString(), slotId.toString(), "Checkup");
        assertThrows(ForbiddenException.class, () -> appointmentService.bookAppointment(request, doctorUser));
    }

    @Test
    @DisplayName("bookAppointment: throws ConflictException when slot is already BOOKED")
    void bookAppointment_SlotAlreadyBooked() {
        availableSlot.setStatus(SlotStatus.BOOKED);
        CreateAppointmentRequest request = new CreateAppointmentRequest(doctorId.toString(), slotId.toString(), "Checkup");

        when(doctorProfileRepository.findById(doctorId)).thenReturn(Optional.of(doctorProfile));
        when(availabilitySlotRepository.findByIdForUpdate(slotId)).thenReturn(Optional.of(availableSlot));

        assertThrows(ConflictException.class, () -> appointmentService.bookAppointment(request, patientUser));
    }

    @Test
    @DisplayName("bookAppointment: throws ConflictException on patient overlapping appointment")
    void bookAppointment_PatientOverlap() {
        CreateAppointmentRequest request = new CreateAppointmentRequest(doctorId.toString(), slotId.toString(), "Checkup");

        when(doctorProfileRepository.findById(doctorId)).thenReturn(Optional.of(doctorProfile));
        when(availabilitySlotRepository.findByIdForUpdate(slotId)).thenReturn(Optional.of(availableSlot));
        when(appointmentRepository.existsBySlotIdAndStatusIn(eq(slotId), any())).thenReturn(false);
        when(appointmentRepository.hasOverlappingActiveAppointment(eq(patientUser.getId()), any(), any(), any(), any())).thenReturn(true);

        ConflictException ex = assertThrows(ConflictException.class, () -> appointmentService.bookAppointment(request, patientUser));
        assertEquals("PATIENT_APPOINTMENT_CONFLICT", ex.getCode());
    }

    @Test
    @DisplayName("updateAppointmentStatus: PENDING to CONFIRMED succeeds")
    void updateStatus_PendingToConfirmed() {
        UUID appointmentId = UUID.randomUUID();
        Appointment appointment = new Appointment();
        appointment.setId(appointmentId);
        appointment.setPatient(patientUser);
        appointment.setDoctor(doctorProfile);
        appointment.setSlot(availableSlot);
        appointment.setStatus(AppointmentStatus.PENDING);
        appointment.setConsultationFee(new BigDecimal("150.00"));

        when(appointmentRepository.findByIdForUpdate(appointmentId)).thenReturn(Optional.of(appointment));
        when(availabilitySlotRepository.findByIdForUpdate(availableSlot.getId())).thenReturn(Optional.of(availableSlot));
        when(appointmentRepository.save(any(Appointment.class))).thenReturn(appointment);

        AppointmentDto result = appointmentService.updateAppointmentStatus(appointmentId, AppointmentStatus.CONFIRMED, doctorUser);

        assertEquals(AppointmentStatus.CONFIRMED, result.status());
        verify(eventPublisher, times(1)).publishEvent(any(AppointmentConfirmedEvent.class));
    }

    @Test
    @DisplayName("updateAppointmentStatus: PENDING to COMPLETED throws ConflictException")
    void updateStatus_InvalidTransition() {
        UUID appointmentId = UUID.randomUUID();
        Appointment appointment = new Appointment();
        appointment.setId(appointmentId);
        appointment.setPatient(patientUser);
        appointment.setDoctor(doctorProfile);
        appointment.setSlot(availableSlot);
        appointment.setStatus(AppointmentStatus.PENDING);

        when(appointmentRepository.findByIdForUpdate(appointmentId)).thenReturn(Optional.of(appointment));

        assertThrows(ConflictException.class, () -> appointmentService.updateAppointmentStatus(appointmentId, AppointmentStatus.COMPLETED, doctorUser));
    }

    @Test
    @DisplayName("cancelAppointment: releases slot to AVAILABLE and sets status to CANCELLED")
    void cancelAppointment_Success() {
        UUID appointmentId = UUID.randomUUID();
        Appointment appointment = new Appointment();
        appointment.setId(appointmentId);
        appointment.setPatient(patientUser);
        appointment.setDoctor(doctorProfile);
        appointment.setSlot(availableSlot);
        appointment.setStatus(AppointmentStatus.CONFIRMED);
        availableSlot.setStatus(SlotStatus.BOOKED);

        when(appointmentRepository.findByIdForUpdate(appointmentId)).thenReturn(Optional.of(appointment));
        when(availabilitySlotRepository.findByIdForUpdate(availableSlot.getId())).thenReturn(Optional.of(availableSlot));
        when(appointmentRepository.save(any(Appointment.class))).thenReturn(appointment);

        AppointmentDto result = appointmentService.cancelAppointment(appointmentId, patientUser);

        assertEquals(AppointmentStatus.CANCELLED, result.status());
        assertEquals(SlotStatus.AVAILABLE, availableSlot.getStatus());
        verify(eventPublisher, times(1)).publishEvent(any(AppointmentCancelledEvent.class));
    }

    @Test
    @DisplayName("rescheduleAppointment: releases old slot and books new slot")
    void rescheduleAppointment_Success() {
        UUID appointmentId = UUID.randomUUID();
        UUID newSlotId = UUID.randomUUID();

        Instant newStart = Instant.now().plus(2, ChronoUnit.DAYS);
        Instant newEnd = newStart.plus(30, ChronoUnit.MINUTES);
        
        AvailabilitySlot newSlot = new AvailabilitySlot();
        newSlot.setId(newSlotId);
        newSlot.setDoctor(doctorProfile);
        newSlot.setSlotDate(LocalDate.now().plusDays(2));
        newSlot.setStartTime(LocalTime.of(11, 0));
        newSlot.setEndTime(LocalTime.of(11, 30));
        newSlot.setSlotStartAt(newStart);
        newSlot.setSlotEndAt(newEnd);
        newSlot.setStatus(SlotStatus.AVAILABLE);

        Appointment appointment = new Appointment();
        appointment.setId(appointmentId);
        appointment.setPatient(patientUser);
        appointment.setDoctor(doctorProfile);
        appointment.setSlot(availableSlot);
        appointment.setSlotStartAt(availableSlot.getSlotStartAt());
        appointment.setSlotEndAt(availableSlot.getSlotEndAt());
        appointment.setStatus(AppointmentStatus.PENDING);

        availableSlot.setStatus(SlotStatus.BOOKED);

        when(appointmentRepository.findByIdForUpdate(appointmentId)).thenReturn(Optional.of(appointment));
        when(availabilitySlotRepository.findByIdForUpdate(availableSlot.getId())).thenReturn(Optional.of(availableSlot));
        when(availabilitySlotRepository.findByIdForUpdate(newSlotId)).thenReturn(Optional.of(newSlot));
        when(appointmentRepository.hasOverlappingActiveAppointment(eq(patientUser.getId()), any(), any(), any(), eq(appointmentId))).thenReturn(false);
        when(appointmentRepository.save(any(Appointment.class))).thenReturn(appointment);

        RescheduleAppointmentRequest request = new RescheduleAppointmentRequest(newSlotId.toString(), null);
        AppointmentDto result = appointmentService.rescheduleAppointment(appointmentId, request, patientUser);

        assertNotNull(result);
        assertEquals(SlotStatus.AVAILABLE, availableSlot.getStatus());
        assertEquals(SlotStatus.BOOKED, newSlot.getStatus());
        verify(eventPublisher, times(1)).publishEvent(any(AppointmentRescheduledEvent.class));
    }
}

package com.medislot.availability;

import com.medislot.appointment.repository.AppointmentRepository;
import com.medislot.availability.dto.AvailabilityCreateRequest;
import com.medislot.availability.dto.AvailabilitySlotDto;
import com.medislot.availability.dto.AvailabilityUpdateRequest;
import com.medislot.availability.entity.AvailabilitySlot;
import com.medislot.availability.repository.AvailabilitySlotRepository;
import com.medislot.availability.service.AvailabilityService;
import com.medislot.common.enums.Role;
import com.medislot.common.enums.SlotStatus;
import com.medislot.common.exception.BusinessException;
import com.medislot.common.exception.ConflictException;
import com.medislot.common.exception.ForbiddenException;
import com.medislot.doctor.entity.DoctorProfile;
import com.medislot.doctor.repository.DoctorProfileRepository;
import com.medislot.user.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AvailabilityServiceTest {

    @Mock
    private AvailabilitySlotRepository slotRepository;

    @Mock
    private DoctorProfileRepository doctorProfileRepository;

    @Mock
    private AppointmentRepository appointmentRepository;

    @InjectMocks
    private AvailabilityService availabilityService;

    private User doctorUser;
    private User patientUser;
    private DoctorProfile doctorProfile;
    private UUID doctorId;
    private UUID slotId;

    @BeforeEach
    void setUp() {
        doctorId = UUID.randomUUID();
        slotId = UUID.randomUUID();

        doctorUser = new User(doctorId, "doctor@example.com", "hash", "Dr. Smith", "+1234567890", Role.DOCTOR);
        patientUser = new User(UUID.randomUUID(), "patient@example.com", "hash", "Jane Patient", "+0987654321", Role.PATIENT);

        doctorProfile = new DoctorProfile();
        doctorProfile.setUser(doctorUser);
    }

    @Test
    @DisplayName("Doctor creates valid availability slot successfully")
    void createAvailability_Success() {
        Instant startAt = Instant.now().plus(1, ChronoUnit.DAYS);
        Instant endAt = startAt.plus(30, ChronoUnit.MINUTES);
        AvailabilityCreateRequest request = new AvailabilityCreateRequest(startAt, endAt, null, null, null, null);

        when(doctorProfileRepository.findById(doctorId)).thenReturn(Optional.of(doctorProfile));
        when(slotRepository.existsOverlappingSlot(eq(doctorId), eq(startAt), eq(endAt), any())).thenReturn(false);
        when(slotRepository.save(any(AvailabilitySlot.class))).thenAnswer(invocation -> {
            AvailabilitySlot s = invocation.getArgument(0);
            s.setId(slotId);
            return s;
        });

        AvailabilitySlotDto result = availabilityService.createAvailability(doctorUser, request);

        assertNotNull(result);
        assertEquals(slotId.toString(), result.id());
        assertEquals(doctorId.toString(), result.doctorId());
        assertFalse(result.booked());
    }

    @Test
    @DisplayName("Patient attempting to create availability throws 403 Forbidden")
    void createAvailability_PatientUser_ThrowsForbidden() {
        Instant startAt = Instant.now().plus(1, ChronoUnit.DAYS);
        Instant endAt = startAt.plus(30, ChronoUnit.MINUTES);
        AvailabilityCreateRequest request = new AvailabilityCreateRequest(startAt, endAt, null, null, null, null);

        assertThrows(ForbiddenException.class, () -> availabilityService.createAvailability(patientUser, request));
    }

    @Test
    @DisplayName("Past start time rejected with 400 Bad Request")
    void createAvailability_PastTime_ThrowsBusinessException() {
        Instant pastStart = Instant.now().minus(1, ChronoUnit.HOURS);
        Instant pastEnd = pastStart.plus(30, ChronoUnit.MINUTES);
        AvailabilityCreateRequest request = new AvailabilityCreateRequest(pastStart, pastEnd, null, null, null, null);

        when(doctorProfileRepository.findById(doctorId)).thenReturn(Optional.of(doctorProfile));

        assertThrows(BusinessException.class, () -> availabilityService.createAvailability(doctorUser, request));
    }

    @Test
    @DisplayName("startTime >= endTime rejected with 400 Bad Request")
    void createAvailability_InvalidRange_ThrowsBusinessException() {
        Instant startAt = Instant.now().plus(1, ChronoUnit.DAYS);
        Instant endAt = startAt.minus(30, ChronoUnit.MINUTES); // End before start
        AvailabilityCreateRequest request = new AvailabilityCreateRequest(startAt, endAt, null, null, null, null);

        when(doctorProfileRepository.findById(doctorId)).thenReturn(Optional.of(doctorProfile));

        assertThrows(BusinessException.class, () -> availabilityService.createAvailability(doctorUser, request));
    }

    @Test
    @DisplayName("Overlapping slot returns 409 Conflict")
    void createAvailability_OverlappingSlot_ThrowsConflictException() {
        Instant startAt = Instant.now().plus(1, ChronoUnit.DAYS);
        Instant endAt = startAt.plus(30, ChronoUnit.MINUTES);
        AvailabilityCreateRequest request = new AvailabilityCreateRequest(startAt, endAt, null, null, null, null);

        when(doctorProfileRepository.findById(doctorId)).thenReturn(Optional.of(doctorProfile));
        when(slotRepository.existsOverlappingSlot(eq(doctorId), eq(startAt), eq(endAt), any())).thenReturn(true);

        assertThrows(ConflictException.class, () -> availabilityService.createAvailability(doctorUser, request));
    }

    @Test
    @DisplayName("Updating another doctor's slot throws 403 Forbidden")
    void updateAvailability_OtherDoctorSlot_ThrowsForbidden() {
        UUID otherDoctorId = UUID.randomUUID();
        User otherDoctorUser = new User(otherDoctorId, "other@example.com", "hash", "Dr. Other", "+111", Role.DOCTOR);
        DoctorProfile otherProfile = new DoctorProfile();
        otherProfile.setUser(otherDoctorUser);

        AvailabilitySlot slot = new AvailabilitySlot();
        slot.setId(slotId);
        slot.setDoctor(doctorProfile); // belongs to doctorId, not otherDoctorId

        when(doctorProfileRepository.findById(otherDoctorId)).thenReturn(Optional.of(otherProfile));
        when(slotRepository.findByIdForUpdate(slotId)).thenReturn(Optional.of(slot));

        AvailabilityUpdateRequest request = new AvailabilityUpdateRequest(null, null, SlotStatus.BLOCKED);

        assertThrows(ForbiddenException.class, () -> availabilityService.updateAvailability(otherDoctorUser, slotId, request));
    }

    @Test
    @DisplayName("Booked slot modification throws 409 Conflict")
    void updateAvailability_BookedSlot_ThrowsConflictException() {
        AvailabilitySlot slot = new AvailabilitySlot();
        slot.setId(slotId);
        slot.setDoctor(doctorProfile);

        when(doctorProfileRepository.findById(doctorId)).thenReturn(Optional.of(doctorProfile));
        when(slotRepository.findByIdForUpdate(slotId)).thenReturn(Optional.of(slot));
        when(appointmentRepository.existsBySlotIdAndStatusIn(eq(slotId), any())).thenReturn(true);

        AvailabilityUpdateRequest request = new AvailabilityUpdateRequest(null, null, SlotStatus.BLOCKED);

        assertThrows(ConflictException.class, () -> availabilityService.updateAvailability(doctorUser, slotId, request));
    }

    @Test
    @DisplayName("Valid slot update succeeds")
    void updateAvailability_Success() {
        Instant startAt = Instant.now().plus(2, ChronoUnit.DAYS);
        Instant endAt = startAt.plus(30, ChronoUnit.MINUTES);

        AvailabilitySlot slot = new AvailabilitySlot();
        slot.setId(slotId);
        slot.setDoctor(doctorProfile);
        slot.setSlotStartAt(startAt);
        slot.setSlotEndAt(endAt);
        slot.setStatus(SlotStatus.AVAILABLE);

        when(doctorProfileRepository.findById(doctorId)).thenReturn(Optional.of(doctorProfile));
        when(slotRepository.findByIdForUpdate(slotId)).thenReturn(Optional.of(slot));
        when(appointmentRepository.existsBySlotIdAndStatusIn(eq(slotId), any())).thenReturn(false);
        when(slotRepository.save(any(AvailabilitySlot.class))).thenReturn(slot);

        AvailabilityUpdateRequest request = new AvailabilityUpdateRequest(null, null, SlotStatus.BLOCKED);

        AvailabilitySlotDto updated = availabilityService.updateAvailability(doctorUser, slotId, request);

        assertNotNull(updated);
        verify(slotRepository).save(slot);
    }

    @Test
    @DisplayName("Deleting booked slot throws 409 Conflict")
    void deleteAvailability_BookedSlot_ThrowsConflictException() {
        AvailabilitySlot slot = new AvailabilitySlot();
        slot.setId(slotId);
        slot.setDoctor(doctorProfile);

        when(doctorProfileRepository.findById(doctorId)).thenReturn(Optional.of(doctorProfile));
        when(slotRepository.findById(slotId)).thenReturn(Optional.of(slot));
        when(appointmentRepository.existsBySlotIdAndStatusIn(eq(slotId), any())).thenReturn(true);

        assertThrows(ConflictException.class, () -> availabilityService.deleteAvailability(doctorUser, slotId));
    }

    @Test
    @DisplayName("Valid slot deletion succeeds")
    void deleteAvailability_Success() {
        AvailabilitySlot slot = new AvailabilitySlot();
        slot.setId(slotId);
        slot.setDoctor(doctorProfile);

        when(doctorProfileRepository.findById(doctorId)).thenReturn(Optional.of(doctorProfile));
        when(slotRepository.findById(slotId)).thenReturn(Optional.of(slot));
        when(appointmentRepository.existsBySlotIdAndStatusIn(eq(slotId), any())).thenReturn(false);

        availabilityService.deleteAvailability(doctorUser, slotId);

        verify(slotRepository).delete(slot);
    }
}

package com.medislot.availability.service;

import com.medislot.appointment.repository.AppointmentRepository;
import com.medislot.availability.dto.AvailabilityCreateRequest;
import com.medislot.availability.dto.AvailabilitySlotDto;
import com.medislot.availability.dto.AvailabilityUpdateRequest;
import com.medislot.availability.entity.AvailabilitySlot;
import com.medislot.availability.repository.AvailabilitySlotRepository;
import com.medislot.common.enums.AppointmentStatus;
import com.medislot.common.enums.Role;
import com.medislot.common.enums.SlotStatus;
import com.medislot.common.exception.BusinessException;
import com.medislot.common.exception.ConflictException;
import com.medislot.common.exception.ForbiddenException;
import com.medislot.common.exception.NotFoundException;
import com.medislot.doctor.entity.DoctorProfile;
import com.medislot.doctor.repository.DoctorProfileRepository;
import com.medislot.user.entity.User;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class AvailabilityService {

    private final AvailabilitySlotRepository slotRepository;
    private final DoctorProfileRepository doctorProfileRepository;
    private final AppointmentRepository appointmentRepository;

    public AvailabilityService(
            AvailabilitySlotRepository slotRepository,
            DoctorProfileRepository doctorProfileRepository,
            AppointmentRepository appointmentRepository) {
        this.slotRepository = slotRepository;
        this.doctorProfileRepository = doctorProfileRepository;
        this.appointmentRepository = appointmentRepository;
    }

    @Transactional
    public AvailabilitySlotDto createAvailability(User currentUser, AvailabilityCreateRequest request) {
        DoctorProfile doctor = validateDoctorRoleAndGetProfile(currentUser);

        Instant startAt;
        Instant endAt;

        if (request.startTime() != null && request.endTime() != null) {
            startAt = request.startTime();
            endAt = request.endTime();
        } else if (request.date() != null && request.startLocalTime() != null && request.endLocalTime() != null) {
            LocalDate date = LocalDate.parse(request.date());
            LocalTime startLT = LocalTime.parse(request.startLocalTime());
            LocalTime endLT = LocalTime.parse(request.endLocalTime());
            startAt = date.atTime(startLT).toInstant(ZoneOffset.UTC);
            endAt = date.atTime(endLT).toInstant(ZoneOffset.UTC);
        } else {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "INVALID_REQUEST", "Either (startTime, endTime) or (date, startLocalTime, endLocalTime) must be provided.");
        }

        validateTimeRange(startAt, endAt);

        int durationMinutes = (request.slotMinutes() != null && request.slotMinutes() > 0)
                ? request.slotMinutes()
                : 30;

        long totalMinutes = java.time.Duration.between(startAt, endAt).toMinutes();

        // If time window is larger than slotMinutes, auto-chunk into discrete slots
        if (totalMinutes > durationMinutes) {
            List<AvailabilitySlot> createdSlots = new ArrayList<>();
            Instant chunkStart = startAt;

            while (chunkStart.plus(java.time.Duration.ofMinutes(durationMinutes)).isBefore(endAt)
                    || chunkStart.plus(java.time.Duration.ofMinutes(durationMinutes)).equals(endAt)) {

                Instant chunkEnd = chunkStart.plus(java.time.Duration.ofMinutes(durationMinutes));

                if (!slotRepository.existsOverlappingSlot(doctor.getUserId(), chunkStart, chunkEnd, null)) {
                    AvailabilitySlot slot = buildSlot(doctor, chunkStart, chunkEnd, SlotStatus.AVAILABLE);
                    createdSlots.add(slotRepository.save(slot));
                }

                chunkStart = chunkEnd;
            }

            if (createdSlots.isEmpty()) {
                throw new ConflictException("All generated slot intervals overlap with existing availability slots.");
            }

            return mapToDto(createdSlots.get(0));
        }

        if (slotRepository.existsOverlappingSlot(doctor.getUserId(), startAt, endAt, null)) {
            throw new ConflictException("The specified time range overlaps with an existing availability slot.");
        }

        AvailabilitySlot slot = buildSlot(doctor, startAt, endAt, SlotStatus.AVAILABLE);
        AvailabilitySlot saved = slotRepository.save(slot);
        return mapToDto(saved);
    }

    @Transactional(readOnly = true)
    public List<AvailabilitySlotDto> getDoctorAvailability(
            UUID doctorId,
            Instant from,
            Instant to,
            SlotStatus status) {

        if (!doctorProfileRepository.existsById(doctorId)) {
            throw new NotFoundException("Doctor not found with ID: " + doctorId);
        }

        Instant fromInstant = from != null ? from : Instant.now().minus(java.time.Duration.ofHours(24));
        SlotStatus targetStatus = status != null ? status : SlotStatus.AVAILABLE;

        List<AvailabilitySlot> slots = slotRepository.findSlotsFiltered(doctorId, targetStatus, fromInstant, to);
        return slots.stream().map(this::mapToDto).toList();
    }

    @Transactional
    public AvailabilitySlotDto updateAvailability(
            User currentUser,
            UUID slotId,
            AvailabilityUpdateRequest request) {

        DoctorProfile doctor = validateDoctorRoleAndGetProfile(currentUser);

        AvailabilitySlot slot = slotRepository.findByIdForUpdate(slotId)
                .orElseThrow(() -> new NotFoundException("Availability slot not found with ID: " + slotId));

        if (!slot.getDoctorId().equals(doctor.getUserId())) {
            throw new ForbiddenException("You do not have permission to modify another doctor's availability slot.");
        }

        boolean hasActiveAppointment = appointmentRepository.existsBySlotIdAndStatusIn(
                slotId,
                List.of(AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED, AppointmentStatus.COMPLETED)
        );
        if (hasActiveAppointment) {
            throw new ConflictException("Cannot update an availability slot that is linked to an active or completed appointment.");
        }

        Instant newStartAt = request.startTime() != null ? request.startTime() : slot.getSlotStartAt();
        Instant newEndAt = request.endTime() != null ? request.endTime() : slot.getSlotEndAt();

        if (request.startTime() != null || request.endTime() != null) {
            validateTimeRange(newStartAt, newEndAt);
            if (slotRepository.existsOverlappingSlot(doctor.getUserId(), newStartAt, newEndAt, slotId)) {
                throw new ConflictException("The updated time range overlaps with another availability slot.");
            }
        }

        slot.setSlotStartAt(newStartAt);
        slot.setSlotEndAt(newEndAt);
        slot.setSlotDate(newStartAt.atZone(ZoneOffset.UTC).toLocalDate());
        slot.setStartTime(newStartAt.atZone(ZoneOffset.UTC).toLocalTime());
        slot.setEndTime(newEndAt.atZone(ZoneOffset.UTC).toLocalTime());

        if (request.status() != null) {
            slot.setStatus(request.status());
        }

        AvailabilitySlot updated = slotRepository.save(slot);
        return mapToDto(updated);
    }

    @Transactional
    public void deleteAvailability(User currentUser, UUID slotId) {
        DoctorProfile doctor = validateDoctorRoleAndGetProfile(currentUser);

        AvailabilitySlot slot = slotRepository.findById(slotId)
                .orElseThrow(() -> new NotFoundException("Availability slot not found with ID: " + slotId));

        if (!slot.getDoctorId().equals(doctor.getUserId())) {
            throw new ForbiddenException("You do not have permission to delete another doctor's availability slot.");
        }

        boolean hasActiveAppointment = appointmentRepository.existsBySlotIdAndStatusIn(
                slotId,
                List.of(AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED, AppointmentStatus.COMPLETED)
        );
        if (hasActiveAppointment) {
            throw new ConflictException("Cannot delete an availability slot that is linked to an active or completed appointment.");
        }

        slotRepository.delete(slot);
    }

    private DoctorProfile validateDoctorRoleAndGetProfile(User user) {
        if (user == null || user.getRole() != Role.DOCTOR) {
            throw new ForbiddenException("Only users with DOCTOR role can manage availability.");
        }
        return doctorProfileRepository.findById(user.getId())
                .orElseThrow(() -> new NotFoundException("Doctor profile not found for user ID: " + user.getId()));
    }

    private void validateTimeRange(Instant startAt, Instant endAt) {
        if (startAt == null || endAt == null) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "INVALID_TIME_RANGE", "Start time and end time must be provided.");
        }
        if (!startAt.isBefore(endAt)) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "INVALID_TIME_RANGE", "Slot start time must be strictly before end time.");
        }
        if (startAt.isBefore(Instant.now())) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "INVALID_TIME_RANGE", "Slot start time cannot be in the past.");
        }
    }

    private AvailabilitySlot buildSlot(DoctorProfile doctor, Instant startAt, Instant endAt, SlotStatus status) {
        AvailabilitySlot slot = new AvailabilitySlot();
        slot.setDoctor(doctor);
        slot.setSlotStartAt(startAt);
        slot.setSlotEndAt(endAt);
        slot.setSlotDate(startAt.atZone(ZoneOffset.UTC).toLocalDate());
        slot.setStartTime(startAt.atZone(ZoneOffset.UTC).toLocalTime());
        slot.setEndTime(endAt.atZone(ZoneOffset.UTC).toLocalTime());
        slot.setStatus(status);
        return slot;
    }

    public AvailabilitySlotDto mapToDto(AvailabilitySlot slot) {
        String dateStr = slot.getSlotDate() != null ? slot.getSlotDate().toString() :
                (slot.getSlotStartAt() != null ? slot.getSlotStartAt().atZone(ZoneOffset.UTC).toLocalDate().toString() : "");
        String startStr = slot.getStartTime() != null ? slot.getStartTime().format(DateTimeFormatter.ofPattern("HH:mm")) :
                (slot.getSlotStartAt() != null ? slot.getSlotStartAt().atZone(ZoneOffset.UTC).toLocalTime().format(DateTimeFormatter.ofPattern("HH:mm")) : "");
        String endStr = slot.getEndTime() != null ? slot.getEndTime().format(DateTimeFormatter.ofPattern("HH:mm")) :
                (slot.getSlotEndAt() != null ? slot.getSlotEndAt().atZone(ZoneOffset.UTC).toLocalTime().format(DateTimeFormatter.ofPattern("HH:mm")) : "");

        boolean isBooked = slot.getStatus() == SlotStatus.BOOKED;

        return new AvailabilitySlotDto(
                slot.getId().toString(),
                slot.getDoctorId() != null ? slot.getDoctorId().toString() : null,
                dateStr,
                startStr,
                endStr,
                isBooked
        );
    }
}

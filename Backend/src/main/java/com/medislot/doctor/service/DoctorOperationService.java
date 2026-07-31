package com.medislot.doctor.service;

import com.medislot.appointment.repository.AppointmentRepository;
import com.medislot.availability.repository.AvailabilitySlotRepository;
import com.medislot.common.enums.AppointmentStatus;
import com.medislot.common.enums.SlotStatus;
import com.medislot.doctor.dto.DoctorDashboardDto;
import com.medislot.user.entity.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;

@Service
public class DoctorOperationService {

    private final AppointmentRepository appointmentRepository;
    private final AvailabilitySlotRepository availabilitySlotRepository;

    public DoctorOperationService(
            AppointmentRepository appointmentRepository,
            AvailabilitySlotRepository availabilitySlotRepository
    ) {
        this.appointmentRepository = appointmentRepository;
        this.availabilitySlotRepository = availabilitySlotRepository;
    }

    @Transactional(readOnly = true)
    public DoctorDashboardDto getDashboardStats(User doctorUser) {
        LocalDate today = LocalDate.now();
        Instant todayStart = today.atStartOfDay().toInstant(ZoneOffset.UTC);
        Instant todayEnd = today.plusDays(1).atStartOfDay().toInstant(ZoneOffset.UTC);

        long todayCount = appointmentRepository.countByDoctorUserIdAndSlotStartAtBetween(doctorUser.getId(), todayStart, todayEnd);
        long upcomingCount = appointmentRepository.countByDoctorUserIdAndSlotStartAtAfter(doctorUser.getId(), todayEnd);
        long pendingCount = appointmentRepository.countByDoctorUserIdAndStatus(doctorUser.getId(), AppointmentStatus.PENDING);
        long completedCount = appointmentRepository.countByDoctorUserIdAndStatus(doctorUser.getId(), AppointmentStatus.COMPLETED);
        long cancelledCount = appointmentRepository.countByDoctorUserIdAndStatus(doctorUser.getId(), AppointmentStatus.CANCELLED);

        long totalSlots = availabilitySlotRepository.countByDoctorUserId(doctorUser.getId());
        long bookedSlots = availabilitySlotRepository.countByDoctorUserIdAndStatus(doctorUser.getId(), SlotStatus.BOOKED);

        return new DoctorDashboardDto(
                todayCount,
                upcomingCount,
                pendingCount,
                completedCount,
                cancelledCount,
                totalSlots,
                bookedSlots
        );
    }
}

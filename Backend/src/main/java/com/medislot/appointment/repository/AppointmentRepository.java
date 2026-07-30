package com.medislot.appointment.repository;

import com.medislot.appointment.entity.Appointment;
import com.medislot.common.enums.AppointmentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.Collection;
import java.util.UUID;

public interface AppointmentRepository extends JpaRepository<Appointment, UUID> {

    Page<Appointment> findByPatientIdOrderBySlotStartAtDesc(UUID patientId, Pageable pageable);

    Page<Appointment> findByPatientIdAndStatusOrderBySlotStartAtDesc(
            UUID patientId, AppointmentStatus status, Pageable pageable);

    Page<Appointment> findByDoctorUserIdOrderBySlotStartAtDesc(UUID doctorId, Pageable pageable);

    Page<Appointment> findByDoctorUserIdAndStatusOrderBySlotStartAtDesc(
            UUID doctorId, AppointmentStatus status, Pageable pageable);

    Page<Appointment> findAllByOrderBySlotStartAtDesc(Pageable pageable);

    @Query("""
            SELECT CASE WHEN COUNT(a) > 0 THEN TRUE ELSE FALSE END
            FROM Appointment a
            WHERE a.patient.id = :patientId
              AND a.status IN :activeStatuses
              AND a.slotStartAt < :slotEndAt
              AND a.slotEndAt > :slotStartAt
              AND (:excludeAppointmentId IS NULL OR a.id <> :excludeAppointmentId)
            """)
    boolean hasOverlappingActiveAppointment(
            @Param("patientId") UUID patientId,
            @Param("activeStatuses") Collection<AppointmentStatus> activeStatuses,
            @Param("slotStartAt") Instant slotStartAt,
            @Param("slotEndAt") Instant slotEndAt,
            @Param("excludeAppointmentId") UUID excludeAppointmentId);

    boolean existsBySlotIdAndStatusIn(UUID slotId, Collection<AppointmentStatus> statuses);
}

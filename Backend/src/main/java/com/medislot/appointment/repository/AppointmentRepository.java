package com.medislot.appointment.repository;

import com.medislot.appointment.entity.Appointment;
import com.medislot.common.enums.AppointmentStatus;
import jakarta.persistence.LockModeType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Collection;
import java.util.Optional;
import java.util.UUID;

public interface AppointmentRepository extends JpaRepository<Appointment, UUID> {

    @Query("""
            SELECT a FROM Appointment a
            JOIN FETCH a.patient p
            JOIN FETCH a.doctor d
            JOIN FETCH d.user du
            JOIN FETCH d.specialization s
            JOIN FETCH a.slot sl
            WHERE a.id = :id
            """)
    Optional<Appointment> findWithDetailsById(@Param("id") UUID id);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT a FROM Appointment a WHERE a.id = :id")
    Optional<Appointment> findByIdForUpdate(@Param("id") UUID id);

    @Query(value = """
            SELECT a FROM Appointment a
            JOIN FETCH a.patient p
            JOIN FETCH a.doctor d
            JOIN FETCH d.user du
            JOIN FETCH d.specialization s
            JOIN FETCH a.slot sl
            WHERE a.patient.id = :patientId
              AND (CAST(:status AS string) IS NULL OR a.status = :status)
              AND (CAST(:from AS instant) IS NULL OR a.slotStartAt >= :from)
              AND (CAST(:to AS instant) IS NULL OR a.slotEndAt <= :to)
            """,
            countQuery = """
            SELECT COUNT(a) FROM Appointment a
            WHERE a.patient.id = :patientId
              AND (CAST(:status AS string) IS NULL OR a.status = :status)
              AND (CAST(:from AS instant) IS NULL OR a.slotStartAt >= :from)
              AND (CAST(:to AS instant) IS NULL OR a.slotEndAt <= :to)
            """)
    Page<Appointment> findPatientAppointmentsFiltered(
            @Param("patientId") UUID patientId,
            @Param("status") AppointmentStatus status,
            @Param("from") Instant from,
            @Param("to") Instant to,
            Pageable pageable
    );

    @Query(value = """
            SELECT a FROM Appointment a
            JOIN FETCH a.patient p
            JOIN FETCH a.doctor d
            JOIN FETCH d.user du
            JOIN FETCH d.specialization s
            JOIN FETCH a.slot sl
            WHERE a.doctor.userId = :doctorId
              AND (CAST(:status AS string) IS NULL OR a.status = :status)
              AND (CAST(:from AS instant) IS NULL OR a.slotStartAt >= :from)
              AND (CAST(:to AS instant) IS NULL OR a.slotEndAt <= :to)
            """,
            countQuery = """
            SELECT COUNT(a) FROM Appointment a
            WHERE a.doctor.userId = :doctorId
              AND (CAST(:status AS string) IS NULL OR a.status = :status)
              AND (CAST(:from AS instant) IS NULL OR a.slotStartAt >= :from)
              AND (CAST(:to AS instant) IS NULL OR a.slotEndAt <= :to)
            """)
    Page<Appointment> findDoctorAppointmentsFiltered(
            @Param("doctorId") UUID doctorId,
            @Param("status") AppointmentStatus status,
            @Param("from") Instant from,
            @Param("to") Instant to,
            Pageable pageable
    );

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
            @Param("excludeAppointmentId") UUID excludeAppointmentId
    );

    @Query("""
            SELECT CASE WHEN COUNT(a) > 0 THEN TRUE ELSE FALSE END
            FROM Appointment a
            WHERE a.doctor.userId = :doctorId
              AND a.status IN :activeStatuses
              AND a.slotStartAt < :slotEndAt
              AND a.slotEndAt > :slotStartAt
              AND (:excludeAppointmentId IS NULL OR a.id <> :excludeAppointmentId)
            """)
    boolean hasOverlappingDoctorAppointment(
            @Param("doctorId") UUID doctorId,
            @Param("activeStatuses") Collection<AppointmentStatus> activeStatuses,
            @Param("slotStartAt") Instant slotStartAt,
            @Param("slotEndAt") Instant slotEndAt,
            @Param("excludeAppointmentId") UUID excludeAppointmentId
    );

    @Query("SELECT CASE WHEN COUNT(a) > 0 THEN TRUE ELSE FALSE END FROM Appointment a WHERE a.slot.id = :slotId AND a.status IN :statuses")
    boolean existsBySlotIdAndStatusIn(@Param("slotId") UUID slotId, @Param("statuses") Collection<AppointmentStatus> statuses);

    @Query("""
            SELECT CASE WHEN COUNT(a) > 0 THEN TRUE ELSE FALSE END
            FROM Appointment a
            WHERE a.patient.id = :patientId
              AND a.doctor.userId = :doctorId
              AND a.status IN :statuses
              AND (
                a.slot.slotDate > CURRENT_DATE
                OR (a.slot.slotDate = CURRENT_DATE AND a.slot.endTime > CURRENT_TIME)
              )
            """)
    boolean existsByPatientIdAndDoctorUserIdAndStatusIn(
            @Param("patientId") UUID patientId,
            @Param("doctorId") UUID doctorId,
            @Param("statuses") Collection<AppointmentStatus> statuses,
            @Param("now") Instant now
    );

    @Modifying
    @Transactional
    @Query("""
            UPDATE Appointment a
            SET a.status = com.medislot.common.enums.AppointmentStatus.EXPIRED
            WHERE a.status = com.medislot.common.enums.AppointmentStatus.PENDING
              AND (
                a.slot.slotDate < CURRENT_DATE
                OR (a.slot.slotDate = CURRENT_DATE AND a.slot.endTime <= CURRENT_TIME)
              )
            """)
    int autoExpirePastPendingAppointments();

    long countByStatus(AppointmentStatus status);

    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.slotStartAt >= :fromInstant AND a.slotStartAt < :toInstant")
    long countBySlotStartAtBetween(@Param("fromInstant") Instant fromInstant, @Param("toInstant") Instant toInstant);

    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.doctor.userId = :doctorId AND a.slotStartAt >= :fromInstant AND a.slotStartAt < :toInstant")
    long countByDoctorUserIdAndSlotStartAtBetween(@Param("doctorId") UUID doctorId, @Param("fromInstant") Instant fromInstant, @Param("toInstant") Instant toInstant);

    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.doctor.userId = :doctorId AND a.slotStartAt >= :fromInstant")
    long countByDoctorUserIdAndSlotStartAtAfter(@Param("doctorId") UUID doctorId, @Param("fromInstant") Instant fromInstant);

    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.doctor.userId = :doctorId AND a.status = :status")
    long countByDoctorUserIdAndStatus(@Param("doctorId") UUID doctorId, @Param("status") AppointmentStatus status);
}

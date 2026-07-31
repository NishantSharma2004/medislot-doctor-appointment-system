package com.medislot.availability.repository;

import com.medislot.availability.entity.AvailabilitySlot;
import com.medislot.common.enums.SlotStatus;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AvailabilitySlotRepository extends JpaRepository<AvailabilitySlot, UUID> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT s FROM AvailabilitySlot s WHERE s.id = :id")
    Optional<AvailabilitySlot> findByIdForUpdate(@Param("id") UUID id);

    @Query("""
            SELECT s FROM AvailabilitySlot s
            WHERE s.doctor.userId = :doctorId
              AND (:status IS NULL OR s.status = :status)
              AND (CAST(:fromInstant AS instant) IS NULL OR s.slotStartAt >= :fromInstant)
              AND (CAST(:toInstant AS instant) IS NULL OR s.slotStartAt <= :toInstant)
            ORDER BY s.slotStartAt ASC
            """)
    List<AvailabilitySlot> findSlotsFiltered(
            @Param("doctorId") UUID doctorId,
            @Param("status") SlotStatus status,
            @Param("fromInstant") Instant fromInstant,
            @Param("toInstant") Instant toInstant);

    @Query("""
            SELECT CASE WHEN COUNT(s) > 0 THEN TRUE ELSE FALSE END
            FROM AvailabilitySlot s
            WHERE s.doctor.userId = :doctorId
              AND s.status <> 'CANCELLED'
              AND (:excludeSlotId IS NULL OR s.id <> :excludeSlotId)
              AND (s.slotStartAt < :endAt AND s.slotEndAt > :startAt)
            """)
    boolean existsOverlappingSlot(
            @Param("doctorId") UUID doctorId,
            @Param("startAt") Instant startAt,
            @Param("endAt") Instant endAt,
            @Param("excludeSlotId") UUID excludeSlotId);

    List<AvailabilitySlot> findByDoctorUserIdAndSlotDateOrderByStartTimeAsc(UUID doctorId, java.time.LocalDate slotDate);

    boolean existsByDoctorUserIdAndSlotDateAndStartTime(UUID doctorId, java.time.LocalDate slotDate, java.time.LocalTime startTime);

    long countByDoctorUserId(UUID doctorId);

    long countByDoctorUserIdAndStatus(UUID doctorId, SlotStatus status);
}

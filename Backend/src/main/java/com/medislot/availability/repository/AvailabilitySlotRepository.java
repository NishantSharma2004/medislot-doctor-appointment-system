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
              AND s.status = :status
              AND s.slotStartAt >= :fromInstant
            ORDER BY s.slotStartAt ASC
            """)
    List<AvailabilitySlot> findAvailableSlots(
            @Param("doctorId") UUID doctorId,
            @Param("status") SlotStatus status,
            @Param("fromInstant") Instant fromInstant);

    List<AvailabilitySlot> findByDoctorUserIdAndSlotDateOrderByStartTimeAsc(UUID doctorId, java.time.LocalDate slotDate);

    boolean existsByDoctorUserIdAndSlotDateAndStartTime(UUID doctorId, java.time.LocalDate slotDate, java.time.LocalTime startTime);
}

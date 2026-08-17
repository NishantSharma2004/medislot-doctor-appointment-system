package com.medislot.vault.repository;

import com.medislot.vault.entity.AppointmentSharedRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AppointmentSharedRecordRepository extends JpaRepository<AppointmentSharedRecord, UUID> {
    List<AppointmentSharedRecord> findByAppointmentIdOrderBySharedAtDesc(UUID appointmentId);
    boolean existsByAppointmentIdAndVaultFileId(UUID appointmentId, UUID vaultFileId);
    Optional<AppointmentSharedRecord> findByAppointmentIdAndVaultFileId(UUID appointmentId, UUID vaultFileId);
    void deleteByVaultFileId(UUID vaultFileId);
}

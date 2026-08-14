package com.medislot.vault.repository;

import com.medislot.vault.entity.HealthVaultFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface HealthVaultRepository extends JpaRepository<HealthVaultFile, UUID> {
    List<HealthVaultFile> findByPatientIdOrderByCreatedAtDesc(UUID patientId);
}

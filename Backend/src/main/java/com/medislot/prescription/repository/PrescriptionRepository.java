package com.medislot.prescription.repository;

import com.medislot.prescription.entity.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, UUID> {
    Optional<Prescription> findByAppointmentId(UUID appointmentId);
    List<Prescription> findByPatientIdOrderByCreatedAtDesc(UUID patientId);
    boolean existsByAppointmentId(UUID appointmentId);
}

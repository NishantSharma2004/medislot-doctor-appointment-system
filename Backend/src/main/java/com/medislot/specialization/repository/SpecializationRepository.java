package com.medislot.specialization.repository;

import com.medislot.specialization.entity.Specialization;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SpecializationRepository extends JpaRepository<Specialization, UUID> {

    List<Specialization> findByActiveTrueOrderByNameAsc();

    Optional<Specialization> findByNameIgnoreCase(String name);
}

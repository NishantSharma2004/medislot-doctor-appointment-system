package com.medislot.doctor.repository;

import com.medislot.doctor.entity.DoctorProfile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface DoctorProfileRepository extends JpaRepository<DoctorProfile, UUID> {

    @Query("""
            SELECT d FROM DoctorProfile d
            JOIN FETCH d.user u
            JOIN FETCH d.specialization s
            WHERE d.active = TRUE
              AND (:city IS NULL OR d.city = :city)
              AND (:specializationName IS NULL OR LOWER(s.name) = LOWER(:specializationName))
              AND (:maxFee IS NULL OR d.consultationFee <= :maxFee)
              AND (
                    :query IS NULL
                    OR LOWER(u.fullName) LIKE LOWER(CONCAT('%', CAST(:query AS string), '%'))
                    OR LOWER(s.name) LIKE LOWER(CONCAT('%', CAST(:query AS string), '%'))
                    OR LOWER(d.clinicName) LIKE LOWER(CONCAT('%', CAST(:query AS string), '%'))
                  )
            """)
    Page<DoctorProfile> searchDoctors(
            @Param("query") String query,
            @Param("specializationName") String specializationName,
            @Param("city") String city,
            @Param("maxFee") BigDecimal maxFee,
            Pageable pageable);

    @Query("""
            SELECT d FROM DoctorProfile d
            JOIN FETCH d.user u
            JOIN FETCH d.specialization s
            WHERE d.userId = :doctorId
            """)
    Optional<DoctorProfile> findByIdWithDetails(@Param("doctorId") UUID doctorId);

    @Query("""
            SELECT DISTINCT d.city FROM DoctorProfile d
            WHERE d.active = TRUE
            ORDER BY d.city ASC
            """)
    List<String> findDistinctActiveCities();

    Page<DoctorProfile> findByActiveTrue(Pageable pageable);

    List<DoctorProfile> findBySpecializationIdAndActiveTrue(UUID specializationId);

    List<DoctorProfile> findByCityIgnoreCaseAndActiveTrue(String city);

    boolean existsByRegistrationNumberIgnoreCase(String registrationNumber);
}

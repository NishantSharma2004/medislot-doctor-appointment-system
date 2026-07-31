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

    @Query(value = """
            SELECT d FROM DoctorProfile d
            JOIN FETCH d.user u
            JOIN FETCH d.specialization s
            WHERE d.active = TRUE
              AND (CAST(:city AS string) IS NULL OR LOWER(d.city) = LOWER(CAST(:city AS string)))
              AND (:specializationId IS NULL OR s.id = :specializationId)
              AND (CAST(:specializationName AS string) IS NULL OR LOWER(s.name) = LOWER(CAST(:specializationName AS string)))
              AND (:maxFee IS NULL OR d.consultationFee <= :maxFee)
              AND (:minExperience IS NULL OR d.yearsOfExperience >= :minExperience)
              AND (
                    CAST(:search AS string) IS NULL OR CAST(:search AS string) = ''
                    OR LOWER(u.fullName) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%'))
                    OR LOWER(s.name) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%'))
                    OR LOWER(d.clinicName) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%'))
                  )
            """,
            countQuery = """
            SELECT COUNT(d) FROM DoctorProfile d
            JOIN d.user u
            JOIN d.specialization s
            WHERE d.active = TRUE
              AND (CAST(:city AS string) IS NULL OR LOWER(d.city) = LOWER(CAST(:city AS string)))
              AND (:specializationId IS NULL OR s.id = :specializationId)
              AND (CAST(:specializationName AS string) IS NULL OR LOWER(s.name) = LOWER(CAST(:specializationName AS string)))
              AND (:maxFee IS NULL OR d.consultationFee <= :maxFee)
              AND (:minExperience IS NULL OR d.yearsOfExperience >= :minExperience)
              AND (
                    CAST(:search AS string) IS NULL OR CAST(:search AS string) = ''
                    OR LOWER(u.fullName) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%'))
                    OR LOWER(s.name) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%'))
                    OR LOWER(d.clinicName) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%'))
                  )
            """)
    Page<DoctorProfile> searchActiveDoctors(
            @Param("search") String search,
            @Param("city") String city,
            @Param("specializationId") UUID specializationId,
            @Param("specializationName") String specializationName,
            @Param("maxFee") BigDecimal maxFee,
            @Param("minExperience") Integer minExperience,
            Pageable pageable);

    @Query("""
            SELECT d FROM DoctorProfile d
            JOIN FETCH d.user u
            JOIN FETCH d.specialization s
            WHERE d.userId = :doctorId AND d.active = TRUE
            """)
    Optional<DoctorProfile> findActiveDoctorByIdWithDetails(@Param("doctorId") UUID doctorId);

    @Query("""
            SELECT DISTINCT d.city FROM DoctorProfile d
            WHERE d.active = TRUE
            ORDER BY d.city ASC
            """)
    List<String> findDistinctActiveCities();

    boolean existsByRegistrationNumberIgnoreCase(String registrationNumber);

    long countByActiveTrue();
}

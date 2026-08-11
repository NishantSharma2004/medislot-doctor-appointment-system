package com.medislot.doctor.service;

import com.medislot.common.config.CacheConfig;
import com.medislot.common.dto.PageResponse;
import com.medislot.common.exception.NotFoundException;
import com.medislot.doctor.dto.DoctorDto;
import com.medislot.doctor.entity.DoctorProfile;
import com.medislot.doctor.repository.DoctorProfileRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

@Service
public class DoctorService {

    private final DoctorProfileRepository doctorProfileRepository;

    public DoctorService(DoctorProfileRepository doctorProfileRepository) {
        this.doctorProfileRepository = doctorProfileRepository;
    }

    @Cacheable(value = CacheConfig.CACHE_DOCTORS_SEARCH, key = "{#search, #city, #specializationId, #specializationName, #maxFee, #minExperience, #page, #size, #sortBy, #sortDirection}")
    @Transactional(readOnly = true)
    public PageResponse<DoctorDto> searchDoctors(
            String search,
            String city,
            UUID specializationId,
            String specializationName,
            BigDecimal maxFee,
            Integer minExperience,
            int page,
            int size,
            String sortBy,
            String sortDirection) {

        int clampedSize = Math.min(Math.max(1, size), 50);
        int clampedPage = Math.max(0, page);

        Sort.Direction direction = "desc".equalsIgnoreCase(sortDirection) ? Sort.Direction.DESC : Sort.Direction.ASC;
        String safeSortProperty = sanitizeSortProperty(sortBy);
        Pageable pageable = PageRequest.of(clampedPage, clampedSize, Sort.by(direction, safeSortProperty));

        Page<DoctorProfile> doctorPage = doctorProfileRepository.searchActiveDoctors(
                search,
                city,
                specializationId,
                specializationName,
                maxFee,
                minExperience,
                pageable
        );

        Page<DoctorDto> dtoPage = doctorPage.map(this::mapToDto);
        return PageResponse.from(dtoPage);
    }

    @Cacheable(value = CacheConfig.CACHE_DOCTOR_DETAILS, key = "#doctorId")
    @Transactional(readOnly = true)
    public DoctorDto getDoctorDetails(UUID doctorId) {
        DoctorProfile doctor = doctorProfileRepository.findActiveDoctorByIdWithDetails(doctorId)
                .orElseThrow(() -> new NotFoundException("Doctor profile not found or inactive with ID: " + doctorId));
        return mapToDto(doctor);
    }

    @Transactional(readOnly = true)
    public java.util.List<String> getDistinctCities() {
        return doctorProfileRepository.findDistinctActiveCities();
    }

    @CacheEvict(value = {CacheConfig.CACHE_DOCTORS_SEARCH, CacheConfig.CACHE_DOCTOR_DETAILS}, allEntries = true)
    public void clearDoctorCache() {
        // Cache invalidated upon doctor profile updates
    }

    public DoctorDto mapToDto(DoctorProfile profile) {
        return new DoctorDto(
                profile.getUserId().toString(),
                profile.getUser() != null ? profile.getUser().getFullName() : null,
                profile.getSpecialization() != null ? profile.getSpecialization().getName() : null,
                profile.getQualifications(),
                profile.getYearsOfExperience(),
                profile.getConsultationFee(),
                profile.getClinicName(),
                profile.getCity(),
                profile.getLanguages(),
                profile.getAbout(),
                profile.getRegistrationNumber()
        );
    }

    private String sanitizeSortProperty(String sortBy) {
        if (sortBy == null || sortBy.isBlank()) {
            return "yearsOfExperience";
        }
        return switch (sortBy.trim().toLowerCase()) {
            case "name", "fullname" -> "user.fullName";
            case "fee", "consultationfee" -> "consultationFee";
            case "experience", "yearsofexperience" -> "yearsOfExperience";
            case "city" -> "city";
            default -> "yearsOfExperience";
        };
    }
}

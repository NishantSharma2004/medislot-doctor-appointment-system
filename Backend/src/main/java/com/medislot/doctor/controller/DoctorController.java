package com.medislot.doctor.controller;

import com.medislot.common.dto.PageResponse;
import com.medislot.common.ratelimit.RateLimited;
import com.medislot.doctor.dto.DoctorDto;
import com.medislot.doctor.service.DoctorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/doctors")
@Tag(name = "Doctors", description = "Public endpoints for doctor search, filtering, and doctor details")
public class DoctorController {

    private final DoctorService doctorService;

    public DoctorController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    @GetMapping
    @RateLimited(policy = "doctor-search")
    @Operation(summary = "Search and filter active doctors with pagination")
    public ResponseEntity<PageResponse<DoctorDto>> searchDoctors(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) UUID specializationId,
            @RequestParam(required = false) String specializationName,
            @RequestParam(required = false) String specialization,
            @RequestParam(required = false) BigDecimal maxFee,
            @RequestParam(required = false) Integer minExperience,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "yearsOfExperience") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        String effectiveSearch = (search != null && !search.isBlank()) ? search : query;
        String effectiveSpecializationName = (specializationName != null && !specializationName.isBlank()) ? specializationName : specialization;

        PageResponse<DoctorDto> response = doctorService.searchDoctors(
                effectiveSearch,
                city,
                specializationId,
                effectiveSpecializationName,
                maxFee,
                minExperience,
                page,
                size,
                sortBy,
                sortDir
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{doctorId}")
    @RateLimited(policy = "doctor-details")
    @Operation(summary = "Get detailed profile of an active doctor by ID")
    public ResponseEntity<DoctorDto> getDoctorById(@PathVariable UUID doctorId) {
        DoctorDto doctor = doctorService.getDoctorDetails(doctorId);
        return ResponseEntity.ok(doctor);
    }
}

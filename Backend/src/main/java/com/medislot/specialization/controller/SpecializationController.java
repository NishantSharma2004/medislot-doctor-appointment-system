package com.medislot.specialization.controller;

import com.medislot.common.ratelimit.RateLimited;
import com.medislot.specialization.dto.SpecializationDto;
import com.medislot.specialization.service.SpecializationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/specializations")
@Tag(name = "Specializations", description = "Public endpoints for medical specializations reference data")
public class SpecializationController {

    private final SpecializationService specializationService;

    public SpecializationController(SpecializationService specializationService) {
        this.specializationService = specializationService;
    }

    @GetMapping
    @RateLimited(policy = "specializations")
    @Operation(summary = "List all active medical specializations sorted alphabetically")
    public ResponseEntity<List<SpecializationDto>> getActiveSpecializations() {
        List<SpecializationDto> specializations = specializationService.getActiveSpecializations();
        return ResponseEntity.ok(specializations);
    }
}

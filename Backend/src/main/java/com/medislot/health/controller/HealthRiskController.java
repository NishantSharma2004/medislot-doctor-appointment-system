package com.medislot.health.controller;

import com.medislot.health.dto.HealthRiskDto;
import com.medislot.health.service.HealthRiskPredictionService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/health-risk")
public class HealthRiskController {

    private final HealthRiskPredictionService healthRiskPredictionService;

    public HealthRiskController(HealthRiskPredictionService healthRiskPredictionService) {
        this.healthRiskPredictionService = healthRiskPredictionService;
    }

    @PostMapping("/analyze")
    public ResponseEntity<HealthRiskDto.Response> analyzeHealthRisk(
            @Valid @RequestBody HealthRiskDto.Request request
    ) {
        HealthRiskDto.Response response = healthRiskPredictionService.analyzeHealthRisk(request);
        return ResponseEntity.ok(response);
    }
}

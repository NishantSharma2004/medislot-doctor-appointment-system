package com.medislot.health.service;

import com.medislot.health.dto.HealthRiskDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class HealthRiskPredictionServiceTest {

    private HealthRiskPredictionService service;

    @BeforeEach
    void setUp() {
        service = new HealthRiskPredictionService();
    }

    @Test
    @DisplayName("Should predict LOW risk for healthy vitals")
    void testHealthyVitalsLowRisk() {
        HealthRiskDto.Request request = new HealthRiskDto.Request(
                85, 115, 115, 75, 72, 30, 22.0, List.of(), "None"
        );

        HealthRiskDto.Response response = service.analyzeHealthRisk(request);

        assertNotNull(response);
        assertEquals("LOW", response.getRiskCategory());
        assertEquals("GREEN", response.getRiskColor());
        assertTrue(response.getOverallRiskScore() < 35);
        assertEquals("NORMAL", response.getDiabetesRisk().getStatus());
        assertEquals("NORMAL", response.getCardiologyRisk().getStatus());
        assertTrue(response.getModelConfidence() > 90.0);
    }

    @Test
    @DisplayName("Should predict HIGH risk for elevated blood sugar and Stage 2 hypertension")
    void testElevatedVitalsHighRisk() {
        HealthRiskDto.Request request = new HealthRiskDto.Request(
                145, 210, 155, 95, 88, 55, 31.5, List.of("Prednisone Steroid"), "Dizziness"
        );

        HealthRiskDto.Response response = service.analyzeHealthRisk(request);

        assertNotNull(response);
        assertTrue(response.getOverallRiskScore() >= 60);
        assertEquals("HIGH", response.getDiabetesRisk().getStatus());
        assertEquals("HIGH", response.getCardiologyRisk().getStatus());
        assertFalse(response.getMedicationWarnings().isEmpty());
        assertNotNull(response.getRecommendedDoctor());
    }
}

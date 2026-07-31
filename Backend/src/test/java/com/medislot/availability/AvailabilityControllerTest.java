package com.medislot.availability;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.medislot.auth.security.CustomAccessDeniedHandler;
import com.medislot.auth.security.JwtAuthenticationEntryPoint;
import com.medislot.auth.security.JwtAuthenticationFilter;
import com.medislot.auth.security.SecurityConfig;
import com.medislot.auth.service.JwtService;
import com.medislot.availability.controller.AvailabilityController;
import com.medislot.availability.dto.AvailabilityCreateRequest;
import com.medislot.availability.dto.AvailabilitySlotDto;
import com.medislot.availability.service.AvailabilityService;
import com.medislot.common.config.CorsConfig;
import com.medislot.common.exception.GlobalExceptionHandler;
import com.medislot.common.ratelimit.InMemoryBucketStore;
import com.medislot.common.ratelimit.RateLimitInterceptor;
import com.medislot.common.ratelimit.RateLimitProperties;
import com.medislot.common.ratelimit.RateLimitService;
import com.medislot.common.ratelimit.RateLimitWebConfig;
import com.medislot.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = AvailabilityController.class)
@Import({
        SecurityConfig.class,
        CorsConfig.class,
        JwtAuthenticationFilter.class,
        JwtAuthenticationEntryPoint.class,
        CustomAccessDeniedHandler.class,
        GlobalExceptionHandler.class,
        RateLimitProperties.class,
        InMemoryBucketStore.class,
        RateLimitService.class,
        RateLimitInterceptor.class,
        RateLimitWebConfig.class
})
class AvailabilityControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private AvailabilityService availabilityService;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private UserRepository userRepository;

    private UUID doctorId;
    private UUID slotId;

    @BeforeEach
    void setUp() {
        doctorId = UUID.randomUUID();
        slotId = UUID.randomUUID();
    }

    @Test
    @DisplayName("GET /api/v1/doctors/{doctorId}/availability returns 200 OK without authentication")
    void getDoctorAvailability_PublicAccess_Returns200() throws Exception {
        AvailabilitySlotDto slotDto = new AvailabilitySlotDto(
                slotId.toString(),
                doctorId.toString(),
                "2026-08-04",
                "10:00",
                "10:30",
                false
        );

        when(availabilityService.getDoctorAvailability(eq(doctorId), any(), any(), any()))
                .thenReturn(List.of(slotDto));

        mockMvc.perform(get("/api/v1/doctors/" + doctorId + "/availability"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(slotId.toString()))
                .andExpect(jsonPath("$[0].doctorId").value(doctorId.toString()));
    }

    @Test
    @DisplayName("POST /api/v1/doctors/availability returns 201 Created for authenticated DOCTOR")
    void createAvailability_DoctorRole_Returns201() throws Exception {
        Instant startAt = Instant.now().plus(1, ChronoUnit.DAYS);
        Instant endAt = startAt.plus(30, ChronoUnit.MINUTES);
        AvailabilityCreateRequest request = new AvailabilityCreateRequest(startAt, endAt, null, null, null, null);

        AvailabilitySlotDto created = new AvailabilitySlotDto(
                slotId.toString(),
                doctorId.toString(),
                "2026-08-04",
                "10:00",
                "10:30",
                false
        );

        when(availabilityService.createAvailability(any(), any())).thenReturn(created);

        mockMvc.perform(post("/api/v1/doctors/availability")
                        .with(user("doctor@example.com").roles("DOCTOR"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(slotId.toString()));
    }

    @Test
    @DisplayName("POST /api/v1/doctors/availability returns 403 Forbidden for PATIENT role")
    void createAvailability_PatientRole_Returns403() throws Exception {
        Instant startAt = Instant.now().plus(1, ChronoUnit.DAYS);
        Instant endAt = startAt.plus(30, ChronoUnit.MINUTES);
        AvailabilityCreateRequest request = new AvailabilityCreateRequest(startAt, endAt, null, null, null, null);

        mockMvc.perform(post("/api/v1/doctors/availability")
                        .with(user("patient@example.com").roles("PATIENT"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.code").value("FORBIDDEN"));
    }

    @Test
    @DisplayName("DELETE /api/v1/doctors/availability/{slotId} returns 204 No Content for DOCTOR")
    void deleteAvailability_DoctorRole_Returns204() throws Exception {
        mockMvc.perform(delete("/api/v1/doctors/availability/" + slotId)
                        .with(user("doctor@example.com").roles("DOCTOR")))
                .andExpect(status().isNoContent());
    }
}

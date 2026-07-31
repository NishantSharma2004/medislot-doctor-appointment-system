package com.medislot.doctor;

import com.medislot.auth.security.CustomAccessDeniedHandler;
import com.medislot.auth.security.JwtAuthenticationEntryPoint;
import com.medislot.auth.security.JwtAuthenticationFilter;
import com.medislot.auth.security.SecurityConfig;
import com.medislot.auth.service.JwtService;
import com.medislot.common.config.CorsConfig;
import com.medislot.common.dto.PageResponse;
import com.medislot.common.exception.GlobalExceptionHandler;
import com.medislot.common.exception.NotFoundException;
import com.medislot.common.ratelimit.InMemoryBucketStore;
import com.medislot.common.ratelimit.RateLimitInterceptor;
import com.medislot.common.ratelimit.RateLimitProperties;
import com.medislot.common.ratelimit.RateLimitService;
import com.medislot.common.ratelimit.RateLimitWebConfig;
import com.medislot.doctor.controller.DoctorController;
import com.medislot.doctor.dto.DoctorDto;
import com.medislot.doctor.service.DoctorService;
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

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.eq;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = DoctorController.class)
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
class DoctorControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private DoctorService doctorService;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private UserRepository userRepository;

    private DoctorDto doctorDto;
    private UUID doctorId;

    @BeforeEach
    void setUp() {
        doctorId = UUID.randomUUID();
        doctorDto = new DoctorDto(
                doctorId.toString(),
                "Dr. Sarah Jenkins",
                "Cardiology",
                "MD, FACC",
                12,
                new BigDecimal("150.00"),
                "Heart Care Clinic",
                "New York",
                List.of("English", "Spanish"),
                "Board certified cardiologist.",
                "REG123456"
        );
    }

    @Test
    @DisplayName("GET /api/v1/doctors search returns paginated doctors list")
    void searchDoctors_Success_ReturnsPaginatedList() throws Exception {
        PageResponse<DoctorDto> pageResponse = new PageResponse<>(
                List.of(doctorDto),
                0,
                10,
                1L,
                1,
                true,
                true
        );

        when(doctorService.searchDoctors(any(), any(), any(), any(), any(), any(), anyInt(), anyInt(), any(), any()))
                .thenReturn(pageResponse);

        mockMvc.perform(get("/api/v1/doctors")
                        .param("search", "Sarah")
                        .param("city", "New York")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].fullName").value("Dr. Sarah Jenkins"))
                .andExpect(jsonPath("$.content[0].specialization").value("Cardiology"))
                .andExpect(jsonPath("$.totalElements").value(1));
    }

    @Test
    @DisplayName("GET /api/v1/doctors/{doctorId} returns 200 OK with safe public profile")
    void getDoctorById_Success_ReturnsPublicDoctorProfile() throws Exception {
        when(doctorService.getDoctorDetails(doctorId)).thenReturn(doctorDto);

        mockMvc.perform(get("/api/v1/doctors/" + doctorId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(doctorId.toString()))
                .andExpect(jsonPath("$.fullName").value("Dr. Sarah Jenkins"))
                .andExpect(jsonPath("$.registrationNumber").value("REG123456"))
                .andExpect(jsonPath("$.passwordHash").doesNotExist());
    }

    @Test
    @DisplayName("GET /api/v1/doctors/{doctorId} returns 404 Not Found for missing/inactive doctor")
    void getDoctorById_NotFound_Returns404() throws Exception {
        UUID unknownId = UUID.randomUUID();
        when(doctorService.getDoctorDetails(unknownId))
                .thenThrow(new NotFoundException("Doctor profile not found with ID: " + unknownId));

        mockMvc.perform(get("/api/v1/doctors/" + unknownId))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code").value("NOT_FOUND"));
    }
}

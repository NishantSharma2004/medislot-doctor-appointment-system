package com.medislot.specialization;

import com.medislot.auth.security.CustomAccessDeniedHandler;
import com.medislot.auth.security.JwtAuthenticationEntryPoint;
import com.medislot.auth.security.JwtAuthenticationFilter;
import com.medislot.auth.security.SecurityConfig;
import com.medislot.auth.service.JwtService;
import com.medislot.common.config.CorsConfig;
import com.medislot.common.exception.GlobalExceptionHandler;
import com.medislot.common.ratelimit.InMemoryBucketStore;
import com.medislot.common.ratelimit.RateLimitInterceptor;
import com.medislot.common.ratelimit.RateLimitProperties;
import com.medislot.common.ratelimit.RateLimitService;
import com.medislot.common.ratelimit.RateLimitWebConfig;
import com.medislot.specialization.controller.SpecializationController;
import com.medislot.specialization.dto.SpecializationDto;
import com.medislot.specialization.service.SpecializationService;
import com.medislot.user.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.UUID;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = SpecializationController.class)
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
class SpecializationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private SpecializationService specializationService;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private UserRepository userRepository;

    @Test
    @DisplayName("GET /api/v1/specializations returns 200 OK without JWT and includes rate limit headers")
    void getSpecializations_PublicAccess_Returns200() throws Exception {
        UUID id1 = UUID.randomUUID();
        UUID id2 = UUID.randomUUID();
        List<SpecializationDto> mockList = List.of(
                new SpecializationDto(id1.toString(), "Cardiology"),
                new SpecializationDto(id2.toString(), "Dermatology")
        );

        when(specializationService.getActiveSpecializations()).thenReturn(mockList);

        mockMvc.perform(get("/api/v1/specializations")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(header().exists("X-RateLimit-Limit"))
                .andExpect(header().exists("X-RateLimit-Remaining"))
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].name").value("Cardiology"))
                .andExpect(jsonPath("$[1].name").value("Dermatology"));
    }
}

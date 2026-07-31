package com.medislot.appointment;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.medislot.appointment.controller.AppointmentController;
import com.medislot.appointment.dto.AppointmentDto;
import com.medislot.appointment.dto.CreateAppointmentRequest;
import com.medislot.appointment.dto.RescheduleAppointmentRequest;
import com.medislot.appointment.dto.UpdateAppointmentStatusRequest;
import com.medislot.appointment.service.AppointmentService;
import com.medislot.auth.security.CustomAccessDeniedHandler;
import com.medislot.auth.security.JwtAuthenticationEntryPoint;
import com.medislot.auth.security.JwtAuthenticationFilter;
import com.medislot.auth.security.SecurityConfig;
import com.medislot.auth.service.JwtService;
import com.medislot.common.config.CorsConfig;
import com.medislot.common.dto.PageResponse;
import com.medislot.common.enums.AppointmentStatus;
import com.medislot.common.enums.Role;
import com.medislot.common.exception.ConflictException;
import com.medislot.common.exception.GlobalExceptionHandler;
import com.medislot.common.ratelimit.InMemoryBucketStore;
import com.medislot.common.ratelimit.RateLimitInterceptor;
import com.medislot.common.ratelimit.RateLimitProperties;
import com.medislot.common.ratelimit.RateLimitService;
import com.medislot.common.ratelimit.RateLimitWebConfig;
import com.medislot.user.entity.User;
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
import java.util.Optional;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = AppointmentController.class)
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
class AppointmentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private AppointmentService appointmentService;

    @MockitoBean
    private JwtService jwtService;

    @MockitoBean
    private UserRepository userRepository;

    @Autowired
    private InMemoryBucketStore bucketStore;

    private UUID appointmentId;
    private UUID doctorId;
    private UUID slotId;
    private UUID patientId;
    private AppointmentDto sampleAppointmentDto;
    private User patientUser;
    private User doctorUser;

    @BeforeEach
    void setUp() {
        bucketStore.clear();
        appointmentId = UUID.randomUUID();
        doctorId = UUID.randomUUID();
        slotId = UUID.randomUUID();
        patientId = UUID.randomUUID();

        patientUser = new User(patientId, "patient@example.com", "hash", "Patient Jane", "+12345", Role.PATIENT);
        doctorUser = new User(doctorId, "doctor@example.com", "hash", "Dr. Smith", "+67890", Role.DOCTOR);

        sampleAppointmentDto = new AppointmentDto(
                appointmentId.toString(),
                doctorId.toString(),
                "Dr. Smith",
                "Cardiology",
                patientId.toString(),
                "Patient Jane",
                slotId.toString(),
                "2026-08-01",
                "10:00",
                "10:30",
                AppointmentStatus.PENDING,
                "Routine checkup",
                new BigDecimal("150.00")
        );

        when(userRepository.findByEmailIgnoreCase("patient@example.com")).thenReturn(Optional.of(patientUser));
        when(userRepository.findByEmailIgnoreCase("doctor@example.com")).thenReturn(Optional.of(doctorUser));
    }

    @Test
    @DisplayName("POST /api/v1/appointments: PATIENT role receives 201 Created and rate limit headers")
    void bookAppointment_PatientSuccess() throws Exception {
        CreateAppointmentRequest request = new CreateAppointmentRequest(doctorId.toString(), slotId.toString(), "Routine checkup");
        when(appointmentService.bookAppointment(any(), any())).thenReturn(sampleAppointmentDto);

        mockMvc.perform(post("/api/v1/appointments")
                        .with(user("patient@example.com").roles("PATIENT"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(header().exists("X-RateLimit-Remaining"))
                .andExpect(jsonPath("$.id").value(appointmentId.toString()))
                .andExpect(jsonPath("$.status").value("PENDING"));
    }

    @Test
    @DisplayName("POST /api/v1/appointments: DOCTOR role receives 403 Forbidden")
    void bookAppointment_DoctorForbidden() throws Exception {
        CreateAppointmentRequest request = new CreateAppointmentRequest(doctorId.toString(), slotId.toString(), "Routine checkup");

        mockMvc.perform(post("/api/v1/appointments")
                        .with(user("doctor@example.com").roles("DOCTOR"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.code").value("FORBIDDEN"));
    }

    @Test
    @DisplayName("GET /api/v1/appointments/my: PATIENT role receives 200 OK")
    void getPatientAppointments_Success() throws Exception {
        PageResponse<AppointmentDto> pageResponse = new PageResponse<>(List.of(sampleAppointmentDto), 0, 10, 1L, 1, true, true);
        when(appointmentService.getPatientAppointments(any(), any(), any(), any(), eq(0), eq(10), any(), any()))
                .thenReturn(pageResponse);

        mockMvc.perform(get("/api/v1/appointments/my")
                        .with(user("patient@example.com").roles("PATIENT")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].id").value(appointmentId.toString()))
                .andExpect(jsonPath("$.totalElements").value(1));
    }

    @Test
    @DisplayName("GET /api/v1/doctors/appointments: DOCTOR role receives 200 OK")
    void getDoctorAppointments_Success() throws Exception {
        PageResponse<AppointmentDto> pageResponse = new PageResponse<>(List.of(sampleAppointmentDto), 0, 10, 1L, 1, true, true);
        when(appointmentService.getDoctorAppointments(any(), any(), any(), any(), eq(0), eq(10), any(), any()))
                .thenReturn(pageResponse);

        mockMvc.perform(get("/api/v1/doctors/appointments")
                        .with(user("doctor@example.com").roles("DOCTOR")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].id").value(appointmentId.toString()));
    }

    @Test
    @DisplayName("GET /api/v1/appointments/{id}: Authenticated user receives 200 OK")
    void getAppointmentDetails_Success() throws Exception {
        when(appointmentService.getAppointmentDetails(eq(appointmentId), any())).thenReturn(sampleAppointmentDto);

        mockMvc.perform(get("/api/v1/appointments/" + appointmentId)
                        .with(user("patient@example.com").roles("PATIENT")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(appointmentId.toString()));
    }

    @Test
    @DisplayName("PATCH /api/v1/appointments/{id}/status: DOCTOR updates status to CONFIRMED")
    void updateStatus_DoctorSuccess() throws Exception {
        AppointmentDto confirmedDto = new AppointmentDto(
                appointmentId.toString(), doctorId.toString(), "Dr. Smith", "Cardiology", patientId.toString(),
                "Patient Jane", slotId.toString(), "2026-08-01", "10:00", "10:30", AppointmentStatus.CONFIRMED,
                "Routine checkup", new BigDecimal("150.00")
        );

        UpdateAppointmentStatusRequest request = new UpdateAppointmentStatusRequest(AppointmentStatus.CONFIRMED);
        when(appointmentService.updateAppointmentStatus(eq(appointmentId), eq(AppointmentStatus.CONFIRMED), any()))
                .thenReturn(confirmedDto);

        mockMvc.perform(patch("/api/v1/appointments/" + appointmentId + "/status")
                        .with(user("doctor@example.com").roles("DOCTOR"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("CONFIRMED"));
    }

    @Test
    @DisplayName("PATCH /api/v1/appointments/{id}/reschedule: PATIENT reschedules to new slot")
    void rescheduleAppointment_Success() throws Exception {
        UUID newSlotId = UUID.randomUUID();
        RescheduleAppointmentRequest request = new RescheduleAppointmentRequest(newSlotId.toString(), null);

        AppointmentDto rescheduledDto = new AppointmentDto(
                appointmentId.toString(), doctorId.toString(), "Dr. Smith", "Cardiology", patientId.toString(),
                "Patient Jane", newSlotId.toString(), "2026-08-02", "11:00", "11:30", AppointmentStatus.PENDING,
                "Routine checkup", new BigDecimal("150.00")
        );

        when(appointmentService.rescheduleAppointment(eq(appointmentId), any(), any())).thenReturn(rescheduledDto);

        mockMvc.perform(patch("/api/v1/appointments/" + appointmentId + "/reschedule")
                        .with(user("patient@example.com").roles("PATIENT"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.slotId").value(newSlotId.toString()));
    }

    @Test
    @DisplayName("DELETE /api/v1/appointments/{id}: Cancels appointment and returns 200 OK")
    void cancelAppointment_Success() throws Exception {
        AppointmentDto cancelledDto = new AppointmentDto(
                appointmentId.toString(), doctorId.toString(), "Dr. Smith", "Cardiology", patientId.toString(),
                "Patient Jane", slotId.toString(), "2026-08-01", "10:00", "10:30", AppointmentStatus.CANCELLED,
                "Routine checkup", new BigDecimal("150.00")
        );

        when(appointmentService.cancelAppointment(eq(appointmentId), any())).thenReturn(cancelledDto);

        mockMvc.perform(delete("/api/v1/appointments/" + appointmentId)
                        .with(user("patient@example.com").roles("PATIENT")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("CANCELLED"));
    }

    @Test
    @DisplayName("POST /api/v1/appointments: Exceeding 5 requests/min triggers 429 Too Many Requests")
    void bookAppointment_RateLimitExceeded() throws Exception {
        CreateAppointmentRequest request = new CreateAppointmentRequest(doctorId.toString(), slotId.toString(), "Routine checkup");
        when(appointmentService.bookAppointment(any(), any())).thenReturn(sampleAppointmentDto);

        // Send 5 valid requests
        for (int i = 0; i < 5; i++) {
            mockMvc.perform(post("/api/v1/appointments")
                            .with(user("patient@example.com").roles("PATIENT"))
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isCreated());
        }

        // 6th request should hit rate limit (5 req/min policy)
        mockMvc.perform(post("/api/v1/appointments")
                        .with(user("patient@example.com").roles("PATIENT"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isTooManyRequests())
                .andExpect(header().exists("Retry-After"))
                .andExpect(header().exists("X-RateLimit-Remaining"))
                .andExpect(jsonPath("$.code").value("RATE_LIMIT_EXCEEDED"));
    }
}

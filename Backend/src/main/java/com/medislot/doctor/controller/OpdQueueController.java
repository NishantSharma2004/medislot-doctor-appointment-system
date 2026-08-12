package com.medislot.doctor.controller;

import com.medislot.doctor.dto.OpdQueueResponse;
import com.medislot.doctor.service.OpdQueueService;
import com.medislot.user.entity.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/doctors/queue")
public class OpdQueueController {

    private final OpdQueueService opdQueueService;
    private final com.medislot.doctor.sse.OpdQueueSseRegistry opdQueueSseRegistry;

    public OpdQueueController(
            OpdQueueService opdQueueService,
            com.medislot.doctor.sse.OpdQueueSseRegistry opdQueueSseRegistry
    ) {
        this.opdQueueService = opdQueueService;
        this.opdQueueSseRegistry = opdQueueSseRegistry;
    }

    @GetMapping(value = "/{doctorId}/subscribe", produces = org.springframework.http.MediaType.TEXT_EVENT_STREAM_VALUE)
    public org.springframework.web.servlet.mvc.method.annotation.SseEmitter subscribeToQueue(@PathVariable UUID doctorId) {
        return opdQueueSseRegistry.subscribe(doctorId);
    }

    @GetMapping("/today")
    public ResponseEntity<OpdQueueResponse> getTodayQueue(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(opdQueueService.getTodayQueueForDoctor(currentUser));
    }

    @GetMapping("/{doctorId}")
    public ResponseEntity<OpdQueueResponse> getPublicQueueForDoctor(@PathVariable UUID doctorId) {
        return ResponseEntity.ok(opdQueueService.getQueueForDoctor(doctorId, java.time.LocalDate.now(java.time.ZoneId.of("Asia/Kolkata"))));
    }

    @PostMapping("/next")
    public ResponseEntity<OpdQueueResponse> callNextPatient(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(opdQueueService.callNextPatient(currentUser));
    }

    @PostMapping("/complete")
    public ResponseEntity<OpdQueueResponse> completeCurrentConsultation(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(opdQueueService.completeCurrentConsultation(currentUser));
    }

    @PostMapping("/skip")
    public ResponseEntity<OpdQueueResponse> skipCurrentPatient(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(opdQueueService.skipCurrentPatient(currentUser));
    }
}

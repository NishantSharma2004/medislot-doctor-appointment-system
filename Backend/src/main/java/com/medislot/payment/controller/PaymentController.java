package com.medislot.payment.controller;

import com.medislot.payment.dto.PaymentDto;
import com.medislot.payment.service.PaymentService;
import com.medislot.user.entity.User;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/create-order")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<PaymentDto.CreateOrderResponse> createRazorpayOrder(
            @AuthenticationPrincipal User currentUser,
            @Valid @RequestBody PaymentDto.CreateOrderRequest request) {

        PaymentDto.CreateOrderResponse response = paymentService.createRazorpayOrder(UUID.fromString(request.appointmentId()), currentUser);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify")
    @PreAuthorize("hasRole('PATIENT')")
    public ResponseEntity<PaymentDto.VerifyPaymentResponse> verifyPaymentSignature(
            @AuthenticationPrincipal User currentUser,
            @Valid @RequestBody PaymentDto.VerifyPaymentRequest request) {

        PaymentDto.VerifyPaymentResponse response = paymentService.verifyPaymentSignature(request, currentUser);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/doctor-respond/{appointmentId}")
    @PreAuthorize("hasAnyRole('DOCTOR', 'ADMIN')")
    public ResponseEntity<PaymentDto.VerifyPaymentResponse> doctorRespondToBooking(
            @AuthenticationPrincipal User currentUser,
            @PathVariable UUID appointmentId,
            @Valid @RequestBody PaymentDto.DoctorDecisionRequest request) {

        PaymentDto.VerifyPaymentResponse response = paymentService.doctorRespondToBooking(appointmentId, request.accept(), request.reason(), currentUser);
        return ResponseEntity.ok(response);
    }
}

package com.medislot.payment.dto;

import java.math.BigDecimal;

public class PaymentDto {

    public record CreateOrderRequest(
            String appointmentId
    ) {}

    public record CreateOrderResponse(
            String orderId,
            String appointmentId,
            BigDecimal amount,
            String currency,
            String keyId
    ) {}

    public record VerifyPaymentRequest(
            String appointmentId,
            String razorpayOrderId,
            String razorpayPaymentId,
            String razorpaySignature
    ) {}

    public record VerifyPaymentResponse(
            boolean success,
            String message,
            String appointmentId,
            String paymentStatus
    ) {}

    public record DoctorDecisionRequest(
            boolean accept,
            String reason
    ) {}
}

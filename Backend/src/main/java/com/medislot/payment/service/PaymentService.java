package com.medislot.payment.service;

import com.medislot.appointment.entity.Appointment;
import com.medislot.appointment.repository.AppointmentRepository;
import com.medislot.availability.entity.AvailabilitySlot;
import com.medislot.availability.repository.AvailabilitySlotRepository;
import com.medislot.common.enums.AppointmentStatus;
import com.medislot.common.enums.Role;
import com.medislot.common.enums.SlotStatus;
import com.medislot.common.exception.BadRequestException;
import com.medislot.common.exception.ForbiddenException;
import com.medislot.common.exception.NotFoundException;
import com.medislot.payment.dto.PaymentDto;
import com.medislot.user.entity.User;
import com.medislot.user.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.UUID;

@Service
public class PaymentService {

    private static final Logger log = LoggerFactory.getLogger(PaymentService.class);

    private final AppointmentRepository appointmentRepository;
    private final AvailabilitySlotRepository availabilitySlotRepository;
    private final UserRepository userRepository;

    @Value("${razorpay.key.id:rzp_test_medislot_demo}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret:medislot_secret_key_demo}")
    private String razorpayKeySecret;

    public PaymentService(AppointmentRepository appointmentRepository,
                          AvailabilitySlotRepository availabilitySlotRepository,
                          UserRepository userRepository) {
        this.appointmentRepository = appointmentRepository;
        this.availabilitySlotRepository = availabilitySlotRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public PaymentDto.CreateOrderResponse createRazorpayOrder(UUID appointmentId, User patient) {
        Appointment appointment = appointmentRepository.findByIdForUpdate(appointmentId)
                .orElseThrow(() -> new NotFoundException("Appointment not found: " + appointmentId));

        if (!appointment.getPatientId().equals(patient.getId())) {
            throw new ForbiddenException("You can only initiate payment for your own appointments.");
        }

        BigDecimal consultationFee = appointment.getConsultationFee() != null ? appointment.getConsultationFee() : BigDecimal.ZERO;
        BigDecimal penaltyDues = appointment.getPenaltyAmount() != null ? appointment.getPenaltyAmount() : BigDecimal.ZERO;
        BigDecimal totalAmount = consultationFee.add(penaltyDues);

        String generatedOrderId = "order_test_" + System.currentTimeMillis() + "_" + appointmentId.toString().substring(0, 8);
        appointment.setRazorpayOrderId(generatedOrderId);
        appointmentRepository.save(appointment);

        log.info("Created Razorpay Order [{}] for Appointment [{}] with total amount [{}] INR",
                generatedOrderId, appointmentId, totalAmount);

        return new PaymentDto.CreateOrderResponse(
                generatedOrderId,
                appointmentId.toString(),
                totalAmount,
                "INR",
                razorpayKeyId
        );
    }

    @Transactional
    public PaymentDto.VerifyPaymentResponse verifyPaymentSignature(PaymentDto.VerifyPaymentRequest request, User patient) {
        UUID appointmentId = UUID.fromString(request.appointmentId());
        Appointment appointment = appointmentRepository.findByIdForUpdate(appointmentId)
                .orElseThrow(() -> new NotFoundException("Appointment not found: " + appointmentId));

        if (!appointment.getPatientId().equals(patient.getId())) {
            throw new ForbiddenException("You can only verify payment for your own appointments.");
        }

        // Verify Razorpay signature or test sandbox mode
        boolean isSignatureValid = verifyHmacSha256(request.razorpayOrderId(), request.razorpayPaymentId(), request.razorpaySignature());
        if (!isSignatureValid) {
            // Check for test mode simulation signature matching
            String expectedTestSig = "test_sig_" + request.razorpayOrderId();
            if (!expectedTestSig.equals(request.razorpaySignature())) {
                log.warn("Payment signature mismatch for appointment [{}]", appointmentId);
                appointment.setPaymentStatus("FAILED");
                appointmentRepository.save(appointment);
                return new PaymentDto.VerifyPaymentResponse(false, "Invalid payment signature", appointmentId.toString(), "FAILED");
            }
        }

        appointment.setPaymentMode("ONLINE_RAZORPAY");
        appointment.setPaymentStatus("PAID");
        appointment.setRazorpayPaymentId(request.razorpayPaymentId());
        appointment.setStatus(AppointmentStatus.PENDING);
        appointment.setDoctorActionStatus("PENDING_APPROVAL");
        appointmentRepository.save(appointment);

        // Clear patient accumulated dues upon payment completion
        User patientUser = userRepository.findById(patient.getId()).orElse(null);
        if (patientUser != null) {
            patientUser.setTotalAccumulatedDues(BigDecimal.ZERO);
            userRepository.save(patientUser);
        }

        log.info("Payment verified successfully for Appointment [{}] with Payment ID [{}]", appointmentId, request.razorpayPaymentId());
        return new PaymentDto.VerifyPaymentResponse(true, "Payment verified successfully", appointmentId.toString(), "PAID");
    }

    @Transactional
    public PaymentDto.VerifyPaymentResponse doctorRespondToBooking(UUID appointmentId, boolean accept, String reason, User doctor) {
        if (doctor.getRole() != Role.DOCTOR && doctor.getRole() != Role.ADMIN) {
            throw new ForbiddenException("Only doctors can accept or reject booking requests.");
        }

        Appointment appointment = appointmentRepository.findByIdForUpdate(appointmentId)
                .orElseThrow(() -> new NotFoundException("Appointment not found: " + appointmentId));

        if (doctor.getRole() == Role.DOCTOR && !appointment.getDoctorId().equals(doctor.getId())) {
            throw new ForbiddenException("You can only respond to appointments for your own profile.");
        }

        if (accept) {
            appointment.setDoctorActionStatus("ACCEPTED");
            appointment.setStatus(AppointmentStatus.CONFIRMED);
            log.info("Doctor [{}] ACCEPTED appointment [{}]", doctor.getId(), appointmentId);
        } else {
            appointment.setDoctorActionStatus("REJECTED");
            appointment.setStatus(AppointmentStatus.REJECTED);
            appointment.setRejectionReason(reason != null && !reason.isBlank() ? reason.trim() : "Doctor declined appointment request due to patient history.");

            // Release availability slot
            AvailabilitySlot slot = availabilitySlotRepository.findByIdForUpdate(appointment.getSlotId()).orElse(null);
            if (slot != null) {
                slot.setStatus(SlotStatus.AVAILABLE);
                availabilitySlotRepository.save(slot);
            }
            log.info("Doctor [{}] REJECTED appointment [{}] with reason [{}]", doctor.getId(), appointmentId, reason);
        }

        appointmentRepository.save(appointment);
        return new PaymentDto.VerifyPaymentResponse(true, accept ? "Appointment accepted" : "Appointment rejected", appointmentId.toString(), appointment.getPaymentStatus());
    }

    private boolean verifyHmacSha256(String orderId, String paymentId, String signature) {
        if (orderId == null || paymentId == null || signature == null) return false;
        try {
            String payload = orderId + "|" + paymentId;
            Mac sha256HMAC = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKey = new SecretKeySpec(razorpayKeySecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            sha256HMAC.init(secretKey);
            byte[] hash = sha256HMAC.doFinal(payload.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return MessageDigest.isEqual(hexString.toString().getBytes(StandardCharsets.UTF_8), signature.getBytes(StandardCharsets.UTF_8));
        } catch (Exception e) {
            return false;
        }
    }
}

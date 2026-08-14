package com.medislot.prescription.service;

import com.medislot.appointment.entity.Appointment;
import com.medislot.appointment.repository.AppointmentRepository;
import com.medislot.common.enums.AppointmentStatus;
import com.medislot.common.exception.ConflictException;
import com.medislot.common.exception.ForbiddenException;
import com.medislot.common.exception.NotFoundException;
import com.medislot.doctor.entity.DoctorProfile;
import com.medislot.doctor.repository.DoctorProfileRepository;
import com.medislot.notification.service.NotificationService;
import com.medislot.prescription.dto.PrescriptionDto;
import com.medislot.prescription.entity.Prescription;
import com.medislot.prescription.entity.PrescriptionMedicine;
import com.medislot.prescription.repository.PrescriptionRepository;
import com.medislot.user.entity.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Random;
import java.util.UUID;

@Service
public class PrescriptionService {

    private static final Logger log = LoggerFactory.getLogger(PrescriptionService.class);

    private final PrescriptionRepository prescriptionRepository;
    private final AppointmentRepository appointmentRepository;
    private final DoctorProfileRepository doctorProfileRepository;
    private final NotificationService notificationService;

    public PrescriptionService(PrescriptionRepository prescriptionRepository,
                               AppointmentRepository appointmentRepository,
                               DoctorProfileRepository doctorProfileRepository,
                               NotificationService notificationService) {
        this.prescriptionRepository = prescriptionRepository;
        this.appointmentRepository = appointmentRepository;
        this.doctorProfileRepository = doctorProfileRepository;
        this.notificationService = notificationService;
    }

    @Transactional
    public PrescriptionDto.Response createPrescription(UUID doctorUserId, PrescriptionDto.CreateRequest request) {
        DoctorProfile doctor = doctorProfileRepository.findById(doctorUserId)
                .orElseThrow(() -> new NotFoundException("Doctor profile not found for user ID: " + doctorUserId));

        Appointment appointment = appointmentRepository.findById(request.getAppointmentId())
                .orElseThrow(() -> new NotFoundException("Appointment not found with ID: " + request.getAppointmentId()));

        if (!appointment.getDoctor().getUserId().equals(doctor.getUserId())) {
            throw new ForbiddenException("You are not authorized to issue a prescription for this appointment.");
        }

        if (prescriptionRepository.existsByAppointmentId(appointment.getId())) {
            throw new ConflictException("A digital prescription has already been issued for this appointment.");
        }

        String datePrefix = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String rxNumber = String.format("RX-%s-%04d", datePrefix, new Random().nextInt(10000));

        Prescription prescription = new Prescription();
        prescription.setAppointment(appointment);
        prescription.setDoctor(doctor);
        prescription.setPatient(appointment.getPatient());
        prescription.setRxNumber(rxNumber);
        prescription.setDiagnosis(request.getDiagnosis());
        prescription.setSymptoms(request.getSymptoms());
        prescription.setLabTestsRecommended(request.getLabTestsRecommended());
        prescription.setClinicalAdvice(request.getClinicalAdvice());
        prescription.setFollowUpDate(request.getFollowUpDate());

        if (request.getMedicines() != null && !request.getMedicines().isEmpty()) {
            for (PrescriptionDto.MedicineItem item : request.getMedicines()) {
                if (item.getMedicineName() != null && !item.getMedicineName().isBlank()) {
                    PrescriptionMedicine medicine = new PrescriptionMedicine(
                            item.getMedicineName().trim(),
                            item.getDosage(),
                            item.getFrequency(),
                            item.getTiming(),
                            item.getDurationDays()
                    );
                    prescription.addMedicine(medicine);
                }
            }
        }

        // Auto transition appointment to COMPLETED upon issuing prescription
        appointment.setStatus(AppointmentStatus.COMPLETED);
        appointmentRepository.save(appointment);

        Prescription saved = prescriptionRepository.save(prescription);
        log.info("Digital E-Prescription [{}] issued successfully by Doctor [{}] for Appointment [{}]",
                rxNumber, doctor.getUser() != null ? doctor.getUser().getFullName() : "Doctor", appointment.getId());

        // Send notification email to patient
        try {
            notificationService.sendEmailNotification(
                    appointment.getPatient().getId(),
                    appointment.getId(),
                    appointment.getPatient().getEmail(),
                    "E_PRESCRIPTION_ISSUED",
                    "Digital E-Prescription Issued 📄",
                    String.format("Dr. %s has issued your Digital E-Prescription (%s). Log in to view & print your Rx PDF.",
                            doctor.getUser() != null ? doctor.getUser().getFullName() : "Doctor", rxNumber)
            );
        } catch (Exception e) {
            log.warn("Could not dispatch notification for prescription [{}]: {}", rxNumber, e.getMessage());
        }

        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public PrescriptionDto.Response getPrescriptionByAppointmentId(UUID currentUserId, UUID appointmentId) {
        Prescription prescription = prescriptionRepository.findByAppointmentId(appointmentId)
                .orElseThrow(() -> new NotFoundException("No prescription found for appointment ID: " + appointmentId));

        Appointment appointment = prescription.getAppointment();

        boolean isPatient = appointment.getPatient().getId().equals(currentUserId);
        boolean isDoctor = appointment.getDoctor().getUser().getId().equals(currentUserId);

        if (!isPatient && !isDoctor) {
            throw new ForbiddenException("You are not authorized to view this prescription.");
        }

        return mapToResponse(prescription);
    }

    private PrescriptionDto.Response mapToResponse(Prescription p) {
        PrescriptionDto.Response dto = new PrescriptionDto.Response();
        dto.setId(p.getId());
        dto.setRxNumber(p.getRxNumber());
        dto.setAppointmentId(p.getAppointment().getId());

        DoctorProfile doctor = p.getDoctor();
        User doctorUser = doctor.getUser();
        dto.setDoctorId(doctor.getUserId());
        dto.setDoctorName(doctorUser != null ? doctorUser.getFullName() : "Doctor");
        dto.setDoctorRegistrationNumber(doctor.getRegistrationNumber() != null ? doctor.getRegistrationNumber() : "REG-MED-101");
        dto.setDoctorSpecialization(doctor.getSpecialization() != null ? doctor.getSpecialization().getName() : "General Practice");
        dto.setClinicName(doctor.getClinicName() != null ? doctor.getClinicName() : "MediSlot Clinic");

        User patient = p.getPatient();
        dto.setPatientId(patient.getId());
        dto.setPatientName(patient.getFullName());

        dto.setDiagnosis(p.getDiagnosis());
        dto.setSymptoms(p.getSymptoms());
        dto.setLabTestsRecommended(p.getLabTestsRecommended());
        dto.setClinicalAdvice(p.getClinicalAdvice());
        dto.setFollowUpDate(p.getFollowUpDate());
        dto.setCreatedAt(p.getCreatedAt());

        List<PrescriptionDto.MedicineItem> medicineItems = p.getMedicines().stream()
                .map(m -> new PrescriptionDto.MedicineItem(
                        m.getMedicineName(),
                        m.getDosage(),
                        m.getFrequency(),
                        m.getTiming(),
                        m.getDurationDays()
                ))
                .toList();
        dto.setMedicines(medicineItems);

        return dto;
    }
}

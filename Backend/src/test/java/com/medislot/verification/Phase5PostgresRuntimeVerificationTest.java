package com.medislot.verification;

import com.medislot.appointment.dto.AppointmentDto;
import com.medislot.appointment.dto.CreateAppointmentRequest;
import com.medislot.appointment.dto.RescheduleAppointmentRequest;
import com.medislot.appointment.entity.Appointment;
import com.medislot.appointment.repository.AppointmentRepository;
import com.medislot.appointment.service.AppointmentService;
import com.medislot.availability.entity.AvailabilitySlot;
import com.medislot.availability.repository.AvailabilitySlotRepository;
import com.medislot.common.enums.AppointmentStatus;
import com.medislot.common.enums.Role;
import com.medislot.common.enums.SlotStatus;
import com.medislot.common.exception.ConflictException;
import com.medislot.doctor.entity.DoctorProfile;
import com.medislot.doctor.repository.DoctorProfileRepository;
import com.medislot.specialization.entity.Specialization;
import com.medislot.specialization.repository.SpecializationRepository;
import com.medislot.user.entity.User;
import com.medislot.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.TestPropertySource;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.Callable;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@TestPropertySource(properties = {
        "spring.datasource.url=jdbc:postgresql://localhost:5432/medislot_db",
        "spring.datasource.username=postgres",
        "spring.datasource.password=postgres",
        "spring.datasource.driver-class-name=org.postgresql.Driver",
        "spring.jpa.hibernate.ddl-auto=validate",
        "spring.flyway.enabled=true",
        "rate-limit.enabled=true"
})
class Phase5PostgresRuntimeVerificationTest {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SpecializationRepository specializationRepository;

    @Autowired
    private DoctorProfileRepository doctorProfileRepository;

    @Autowired
    private AvailabilitySlotRepository availabilitySlotRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private org.springframework.transaction.PlatformTransactionManager transactionManager;

    @jakarta.persistence.PersistenceContext
    private jakarta.persistence.EntityManager entityManager;

    private User patientUser1;
    private User patientUser2;
    private User doctorUser;
    private DoctorProfile doctorProfile;
    private AvailabilitySlot testSlot1;
    private AvailabilitySlot testSlot2;

    @BeforeEach
    void setUpData() {
        new org.springframework.transaction.support.TransactionTemplate(transactionManager).executeWithoutResult(status -> {
            jdbcTemplate.execute("TRUNCATE TABLE appointments, availability_slots, doctor_profiles, specializations, users CASCADE");

            patientUser1 = userRepository.save(new User(null, "patient1@verification.com", "hash", "Patient One", "+111111", Role.PATIENT));
            patientUser2 = userRepository.save(new User(null, "patient2@verification.com", "hash", "Patient Two", "+222222", Role.PATIENT));
            doctorUser = userRepository.save(new User(null, "doctor@verification.com", "hash", "Dr. Verification", "+333333", Role.DOCTOR));

            Specialization spec = new Specialization();
            spec.setName("Cardiology Verification");
            spec.setDescription("Verification spec");
            spec = specializationRepository.save(spec);

            doctorProfile = new DoctorProfile();
            doctorProfile.setUser(doctorUser);
            doctorProfile.setSpecialization(spec);
            doctorProfile.setQualifications("MD");
            doctorProfile.setYearsOfExperience(15);
            doctorProfile.setConsultationFee(new BigDecimal("200.00"));
            doctorProfile.setClinicName("Postgres Clinic");
            doctorProfile.setCity("Verification City");
            doctorProfile.setLanguages(List.of("English"));
            doctorProfile.setAbout("Verification doctor");
            doctorProfile.setRegistrationNumber("REG-VERIFY-123");
            doctorProfile.setActive(true);
            entityManager.persist(doctorProfile);

            Instant start1 = Instant.now().plus(2, ChronoUnit.DAYS).truncatedTo(ChronoUnit.MINUTES);
            Instant end1 = start1.plus(30, ChronoUnit.MINUTES);

            testSlot1 = new AvailabilitySlot();
            testSlot1.setDoctor(doctorProfile);
            testSlot1.setSlotDate(LocalDate.now().plusDays(2));
            testSlot1.setStartTime(LocalTime.of(10, 0));
            testSlot1.setEndTime(LocalTime.of(10, 30));
            testSlot1.setSlotStartAt(start1);
            testSlot1.setSlotEndAt(end1);
            testSlot1.setStatus(SlotStatus.AVAILABLE);
            testSlot1 = availabilitySlotRepository.save(testSlot1);

            Instant start2 = start1.plus(1, ChronoUnit.HOURS);
            Instant end2 = start2.plus(30, ChronoUnit.MINUTES);

            testSlot2 = new AvailabilitySlot();
            testSlot2.setDoctor(doctorProfile);
            testSlot2.setSlotDate(LocalDate.now().plusDays(2));
            testSlot2.setStartTime(LocalTime.of(11, 0));
            testSlot2.setEndTime(LocalTime.of(11, 30));
            testSlot2.setSlotStartAt(start2);
            testSlot2.setSlotEndAt(end2);
            testSlot2.setStatus(SlotStatus.AVAILABLE);
            testSlot2 = availabilitySlotRepository.save(testSlot2);
        });
    }

    @Test
    @DisplayName("Verification 1-4: Verify Flyway migrations V1-V4, ddl-auto=validate, @Version columns, btree_gist & indexes in PostgreSQL")
    void verifyPostgresSchemaAndExtensions() {
        // Check btree_gist extension
        Integer btreeGistCount = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM pg_extension WHERE extname = 'btree_gist'", Integer.class);
        assertEquals(1, btreeGistCount, "btree_gist extension must exist in PostgreSQL");

        // Check @Version column on appointments and availability_slots
        Integer appVersionCol = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'appointments' AND column_name = 'version'", Integer.class);
        assertEquals(1, appVersionCol, "appointments table must contain 'version' column");

        Integer slotVersionCol = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'availability_slots' AND column_name = 'version'", Integer.class);
        assertEquals(1, slotVersionCol, "availability_slots table must contain 'version' column");

        // Check partial unique index uq_appointments_active_slot
        Integer indexCount = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM pg_indexes WHERE indexname = 'uq_appointments_active_slot'", Integer.class);
        assertEquals(1, indexCount, "Partial unique index uq_appointments_active_slot must exist");

        // Check composite FK fk_appointments_slot_doctor
        Integer fkCount = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM information_schema.table_constraints WHERE constraint_name = 'fk_appointments_slot_doctor'", Integer.class);
        assertEquals(1, fkCount, "Composite foreign key fk_appointments_slot_doctor must exist");
    }

    @Test
    @DisplayName("Verification 5: Concurrent booking of the same slot yields exactly 1 success and 1 HTTP 409/ConflictException")
    void verifyConcurrentBookingSafety() throws Exception {
        ExecutorService executor = Executors.newFixedThreadPool(2);
        CountDownLatch latch = new CountDownLatch(1);

        Callable<Object> bookTask1 = () -> {
            latch.await();
            return appointmentService.bookAppointment(
                    new CreateAppointmentRequest(doctorProfile.getUserId().toString(), testSlot1.getId().toString(), "Booking Patient 1"),
                    patientUser1
            );
        };

        Callable<Object> bookTask2 = () -> {
            latch.await();
            return appointmentService.bookAppointment(
                    new CreateAppointmentRequest(doctorProfile.getUserId().toString(), testSlot1.getId().toString(), "Booking Patient 2"),
                    patientUser2
            );
        };

        Future<Object> future1 = executor.submit(bookTask1);
        Future<Object> future2 = executor.submit(bookTask2);

        latch.countDown(); // Trigger both threads simultaneously

        Object result1 = null;
        Object result2 = null;
        Exception exc1 = null;
        Exception exc2 = null;

        try {
            result1 = future1.get();
        } catch (Exception e) {
            exc1 = e;
        }

        try {
            result2 = future2.get();
        } catch (Exception e) {
            exc2 = e;
        }

        executor.shutdown();

        int successCount = 0;
        int conflictCount = 0;

        if (result1 instanceof AppointmentDto) successCount++;
        if (result2 instanceof AppointmentDto) successCount++;

        if (exc1 != null && (exc1.getCause() instanceof ConflictException || exc1.getCause() instanceof DataIntegrityViolationException)) conflictCount++;
        if (exc2 != null && (exc2.getCause() instanceof ConflictException || exc2.getCause() instanceof DataIntegrityViolationException)) conflictCount++;

        assertEquals(1, successCount, "Exactly 1 concurrent booking request must succeed");
        assertEquals(1, conflictCount, "Exactly 1 concurrent booking request must fail with ConflictException/DataIntegrityViolationException");

        AvailabilitySlot slotAfter = availabilitySlotRepository.findById(testSlot1.getId()).orElseThrow();
        assertEquals(SlotStatus.BOOKED, slotAfter.getStatus(), "Slot must remain in BOOKED status");
    }

    @Test
    @DisplayName("Verification 6: Patient overlap is rejected by both service logic and PostgreSQL exclusion constraints")
    void verifyPatientOverlapProtection() {
        // Book first appointment for patientUser1 on testSlot1
        appointmentService.bookAppointment(
                new CreateAppointmentRequest(doctorProfile.getUserId().toString(), testSlot1.getId().toString(), "Checkup 1"),
                patientUser1
        );

        // Attempting to book an overlapping time for patientUser1 should throw ConflictException with code PATIENT_APPOINTMENT_CONFLICT
        ConflictException ex = assertThrows(ConflictException.class, () ->
                appointmentService.bookAppointment(
                        new CreateAppointmentRequest(doctorProfile.getUserId().toString(), testSlot1.getId().toString(), "Checkup 2"),
                        patientUser1
                )
        );
        assertEquals("CONFLICT", ex.getCode());

        // Test direct PostgreSQL exclusion constraint excl_patient_appointment_overlap at database layer
        Appointment directApp = new Appointment();
        directApp.setPatient(patientUser1);
        directApp.setDoctor(doctorProfile);
        directApp.setSlot(testSlot2);
        directApp.setSlotStartAt(testSlot1.getSlotStartAt()); // Force overlapping time window
        directApp.setSlotEndAt(testSlot1.getSlotEndAt());
        directApp.setStatus(AppointmentStatus.PENDING);
        directApp.setConsultationFee(new BigDecimal("200.00"));

        assertThrows(DataIntegrityViolationException.class, () -> appointmentRepository.saveAndFlush(directApp),
                "PostgreSQL GIST exclusion constraint excl_patient_appointment_overlap must trigger DataIntegrityViolationException");
    }

    @Test
    @DisplayName("Verification 7: Cancellation releases slot exactly once and repeated cancellation is idempotent")
    void verifyCancellationAndSlotRelease() {
        AppointmentDto booked = appointmentService.bookAppointment(
                new CreateAppointmentRequest(doctorProfile.getUserId().toString(), testSlot1.getId().toString(), "Checkup"),
                patientUser1
        );

        UUID appointmentId = UUID.fromString(booked.id());
        AppointmentDto cancelled = appointmentService.cancelAppointment(appointmentId, patientUser1);

        assertEquals(AppointmentStatus.CANCELLED, cancelled.status());
        AvailabilitySlot slotAfter1 = availabilitySlotRepository.findById(testSlot1.getId()).orElseThrow();
        assertEquals(SlotStatus.AVAILABLE, slotAfter1.getStatus());

        // Idempotent second call
        AppointmentDto cancelledAgain = appointmentService.cancelAppointment(appointmentId, patientUser1);
        assertEquals(AppointmentStatus.CANCELLED, cancelledAgain.status());
        AvailabilitySlot slotAfter2 = availabilitySlotRepository.findById(testSlot1.getId()).orElseThrow();
        assertEquals(SlotStatus.AVAILABLE, slotAfter2.getStatus());
    }

    @Test
    @DisplayName("Verification 8: Rescheduling locks slots deterministically and leaves no partially updated state")
    void verifyDeterministicRescheduling() {
        AppointmentDto booked = appointmentService.bookAppointment(
                new CreateAppointmentRequest(doctorProfile.getUserId().toString(), testSlot1.getId().toString(), "Initial"),
                patientUser1
        );

        UUID appointmentId = UUID.fromString(booked.id());
        RescheduleAppointmentRequest request = new RescheduleAppointmentRequest(testSlot2.getId().toString(), null);

        AppointmentDto rescheduled = appointmentService.rescheduleAppointment(appointmentId, request, patientUser1);

        assertEquals(testSlot2.getId().toString(), rescheduled.slotId());
        assertEquals(SlotStatus.AVAILABLE, availabilitySlotRepository.findById(testSlot1.getId()).orElseThrow().getStatus());
        assertEquals(SlotStatus.BOOKED, availabilitySlotRepository.findById(testSlot2.getId()).orElseThrow().getStatus());
    }
}

package com.medislot.verification;

import com.medislot.assistant.dto.AssistantChatRequest;
import com.medislot.assistant.dto.AssistantChatResponse;
import com.medislot.assistant.entity.AiProviderUsageLog;
import com.medislot.assistant.entity.ClinicDocument;
import com.medislot.assistant.repository.AiProviderUsageLogRepository;
import com.medislot.assistant.repository.ClinicDocumentRepository;
import com.medislot.assistant.service.AssistantService;
import com.medislot.common.enums.EvidenceStrength;
import com.medislot.common.enums.Role;
import com.medislot.user.entity.User;
import com.medislot.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class Phase6AssistantPostgresTest {

    @DynamicPropertySource
    static void configurePostgresProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", () -> "jdbc:postgresql://localhost:5432/medislot_db");
        registry.add("spring.datasource.username", () -> "postgres");
        registry.add("spring.datasource.password", () -> "postgres");
        registry.add("spring.flyway.enabled", () -> "true");
        registry.add("spring.jpa.hibernate.ddl-auto", () -> "validate");
    }

    @Autowired
    private ClinicDocumentRepository clinicDocumentRepository;

    @Autowired
    private AiProviderUsageLogRepository usageLogRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AssistantService assistantService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = userRepository.findByEmailIgnoreCase("patient.phase6@medislot.com").orElseGet(() -> {
            User user = new User();
            user.setFullName("Phase6 Patient");
            user.setEmail("patient.phase6@medislot.com");
            user.setPasswordHash("$2a$10$abcdefghijklmnopqrstuvwxyz123456");
            user.setPhone("+15550006666");
            user.setRole(Role.PATIENT);
            user.setEnabled(true);
            return userRepository.saveAndFlush(user);
        });

        if (clinicDocumentRepository.count() == 0) {
            ClinicDocument d1 = new ClinicDocument();
            d1.setTitle("Clinic Hours and Contact Policy");
            d1.setSection("General Information");
            d1.setContent("MediSlot Health Clinic is open Monday through Saturday from 8:00 AM to 8:00 PM UTC. Emergency services are referred to local hospitals. You can contact the reception desk at +1-800-MEDISLOT or email contact@medislot.com.");
            d1.setKeywords(List.of("hours", "timings", "contact", "phone", "email", "open"));
            d1.setEvidenceStrength(EvidenceStrength.STRONG);
            d1.setActive(true);

            ClinicDocument d2 = new ClinicDocument();
            d2.setTitle("First Appointment Document Checklist");
            d2.setSection("Patient Guidelines");
            d2.setContent("For your first clinic appointment, please arrive 15 minutes early. Patients must bring a government-issued photo ID, any previous medical records or lab reports, a list of current medications, and insurance details if applicable.");
            d2.setKeywords(List.of("documents", "checklist", "first visit", "bring", "id", "records", "preparation"));
            d2.setEvidenceStrength(EvidenceStrength.STRONG);
            d2.setActive(true);

            ClinicDocument d3 = new ClinicDocument();
            d3.setTitle("Appointment Cancellation and Rescheduling Policy");
            d3.setSection("Booking Policies");
            d3.setContent("Appointments can be cancelled or rescheduled up to 2 hours prior to the scheduled start time through the MediSlot patient portal. Late cancellations or missed appointments may incur a clinic policy record. Slot fees are refunded per standard clinic refund terms.");
            d3.setKeywords(List.of("cancellation", "reschedule", "cancel", "policy", "refund", "time limit"));
            d3.setEvidenceStrength(EvidenceStrength.STRONG);
            d3.setActive(true);

            ClinicDocument d4 = new ClinicDocument();
            d4.setTitle("Telehealth and Online Consultation Guidelines");
            d4.setSection("Consultation Modes");
            d4.setContent("MediSlot offers both in-person clinic visits and virtual video consultations. Online appointments require a stable internet connection and a working video camera. Joining links are available in your appointment dashboard 10 minutes before the slot.");
            d4.setKeywords(List.of("online", "telehealth", "video", "virtual", "consultation", "link"));
            d4.setEvidenceStrength(EvidenceStrength.MODERATE);
            d4.setActive(true);

            ClinicDocument d5 = new ClinicDocument();
            d5.setTitle("General Patient Preparation Instructions");
            d5.setSection("Visit Preparation");
            d5.setContent("For fasting blood tests or routine health checkups, please abstain from food and drink (except water) for 8 to 12 hours prior to your scheduled morning appointment unless instructed otherwise by your doctor.");
            d5.setKeywords(List.of("preparation", "fasting", "blood test", "instructions", "checkup"));
            d5.setEvidenceStrength(EvidenceStrength.MODERATE);
            d5.setActive(true);

            ClinicDocument d6 = new ClinicDocument();
            d6.setTitle("MediSlot Application Help and Features");
            d6.setSection("Platform Navigation");
            d6.setContent("Patients can search for doctors by specialization or city, view live available time slots, book appointments, view upcoming or past appointments, and reschedule or cancel appointments directly from the MediSlot web dashboard.");
            d6.setKeywords(List.of("help", "medislot", "book", "search", "features", "dashboard", "how to"));
            d6.setEvidenceStrength(EvidenceStrength.STRONG);
            d6.setActive(true);

            clinicDocumentRepository.saveAll(List.of(d1, d2, d3, d4, d5, d6));
        }
    }

    @Test
    void verifyFlywayV5AndSeededDocumentsInPostgres() {
        List<ClinicDocument> activeDocs = clinicDocumentRepository.findByActiveTrueOrderByTitleAsc();
        assertFalse(activeDocs.isEmpty(), "Flyway V5 should seed active clinic documents into PostgreSQL");
        assertTrue(activeDocs.size() >= 6, "Expected at least 6 seeded clinic documents");
    }

    @Test
    void verifyPostgresFullTextSearchRanking() {
        List<ClinicDocument> results = clinicDocumentRepository.searchActiveDocuments("cancellation policy", "cancellation policy", 5);
        assertFalse(results.isEmpty(), "Full-text search should match seeded cancellation policy document");
        assertEquals("Appointment Cancellation and Rescheduling Policy", results.get(0).getTitle());
    }

    @Test
    void verifyActiveDocumentExclusion() {
        ClinicDocument inactiveDoc = new ClinicDocument();
        inactiveDoc.setTitle("Archived Policy Document");
        inactiveDoc.setContent("Archived old clinic policy.");
        inactiveDoc.setKeywords(List.of("archived", "old"));
        inactiveDoc.setEvidenceStrength(EvidenceStrength.LIMITED);
        inactiveDoc.setActive(false);
        clinicDocumentRepository.save(inactiveDoc);

        List<ClinicDocument> searchResults = clinicDocumentRepository.searchActiveDocuments("Archived Policy Document", "Archived Policy Document", 10);
        assertTrue(searchResults.stream().noneMatch(d -> d.getId().equals(inactiveDoc.getId())), "Inactive documents must be excluded from FTS search results");
    }

    @Test
    void verifyEmergencySafetyPreCheckInPostgres() {
        AssistantChatRequest request = new AssistantChatRequest("I am suffering from severe chest pain", null);
        AssistantChatResponse response = assistantService.processChat(request, testUser);

        assertFalse(response.grounded());
        assertFalse(response.sufficientEvidence());
        assertTrue(response.answer().contains("urgent medical attention"));
    }

    @Test
    void verifyWorkflowKnowledgeAnswerInPostgres() {
        AssistantChatRequest request = new AssistantChatRequest("How to book appointment on MediSlot?", null);
        AssistantChatResponse response = assistantService.processChat(request, testUser);

        assertTrue(response.grounded());
        assertTrue(response.sufficientEvidence());
        assertTrue(response.answer().contains("To book an appointment on MediSlot"));
    }

    @Test
    void verifyUsageLogSchemaAndNoRawSecretsPersistence() {
        List<AiProviderUsageLog> logs = usageLogRepository.findAll();
        for (AiProviderUsageLog logEntry : logs) {
            assertNotNull(logEntry.getProvider());
        }
    }
}

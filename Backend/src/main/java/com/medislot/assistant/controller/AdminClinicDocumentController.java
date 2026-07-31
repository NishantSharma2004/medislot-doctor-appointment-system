package com.medislot.assistant.controller;

import com.medislot.assistant.entity.ClinicDocument;
import com.medislot.assistant.repository.ClinicDocumentRepository;
import com.medislot.audit.service.AuditLogService;
import com.medislot.common.enums.EvidenceStrength;
import com.medislot.common.exception.BusinessException;
import com.medislot.common.exception.ResourceNotFoundException;
import com.medislot.common.ratelimit.RateLimited;
import com.medislot.user.entity.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/admin/clinic-documents")
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin Clinic Document Management API", description = "Document administration for the AI Assistant RAG pipeline")
public class AdminClinicDocumentController {

    private final ClinicDocumentRepository documentRepository;
    private final AuditLogService auditLogService;

    public AdminClinicDocumentController(ClinicDocumentRepository documentRepository, AuditLogService auditLogService) {
        this.documentRepository = documentRepository;
        this.auditLogService = auditLogService;
    }

    @GetMapping
    @Operation(summary = "List all clinic documents")
    public ResponseEntity<List<ClinicDocument>> listDocuments() {
        return ResponseEntity.ok(documentRepository.findAll());
    }

    @PostMapping
    @RateLimited(policy = "document-upload")
    @Operation(summary = "Upload and register a new clinic document (TXT/PDF/DOCX)")
    public ResponseEntity<ClinicDocument> uploadDocument(
            @RequestParam("title") String title,
            @RequestParam(value = "category", defaultValue = "GENERAL") String category,
            @RequestParam(value = "evidenceStrength", defaultValue = "STRONG") String evidenceStrength,
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal User adminUser
    ) {
        if (file == null || file.isEmpty()) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "INVALID_FILE", "Document file is required.");
        }

        if (file.getSize() > 10 * 1024 * 1024) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "FILE_TOO_LARGE", "Document file size must not exceed 10MB.");
        }

        String content;
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8))) {
            content = reader.lines().collect(Collectors.joining("\n"));
        } catch (Exception e) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "READ_FAILED", "Failed to read document content.");
        }

        if (content.isBlank()) {
            throw new BusinessException(HttpStatus.BAD_REQUEST, "EMPTY_CONTENT", "Document content cannot be empty.");
        }

        ClinicDocument doc = new ClinicDocument();
        doc.setTitle(title.trim());
        doc.setCategory(category.trim());
        doc.setSection("General Policy");
        doc.setContent(content.trim());
        doc.setSourceFilename(file.getOriginalFilename());
        doc.setMimeType(file.getContentType());
        doc.setUploadedBy(adminUser.getId());
        doc.setActive(true);
        doc.setEvidenceStrength(EvidenceStrength.valueOf(evidenceStrength.toUpperCase()));
        doc.setKeywords(List.of(title.toLowerCase().split("\\s+")));

        ClinicDocument saved = documentRepository.save(doc);

        auditLogService.record(adminUser.getId(), "ADMIN", "CLINIC_DOCUMENT_UPLOADED", "CLINIC_DOCUMENT", saved.getId(), "SUCCESS", "{}");

        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Activate or deactivate a clinic document")
    public ResponseEntity<ClinicDocument> toggleDocumentStatus(
            @PathVariable UUID id,
            @RequestParam boolean active,
            @AuthenticationPrincipal User adminUser
    ) {
        ClinicDocument doc = documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Clinic document not found."));

        doc.setActive(active);
        ClinicDocument updated = documentRepository.save(doc);

        String action = active ? "CLINIC_DOCUMENT_ACTIVATED" : "CLINIC_DOCUMENT_DEACTIVATED";
        auditLogService.record(adminUser.getId(), "ADMIN", action, "CLINIC_DOCUMENT", id, "SUCCESS", "{}");

        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a clinic document")
    public ResponseEntity<Void> deleteDocument(@PathVariable UUID id, @AuthenticationPrincipal User adminUser) {
        ClinicDocument doc = documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Clinic document not found."));

        documentRepository.delete(doc);
        auditLogService.record(adminUser.getId(), "ADMIN", "CLINIC_DOCUMENT_DELETED", "CLINIC_DOCUMENT", id, "SUCCESS", "{}");

        return ResponseEntity.noContent().build();
    }
}

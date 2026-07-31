package com.medislot.assistant.service;

import com.medislot.assistant.entity.ClinicDocument;
import com.medislot.assistant.repository.ClinicDocumentRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service to search and retrieve active clinic documents using PostgreSQL Full-Text Search.
 */
@Service
public class ClinicDocumentRetrievalService {

    private final ClinicDocumentRepository clinicDocumentRepository;

    @Value("${ai.retrieval.limit:5}")
    private int maxRetrievalLimit = 5;

    public ClinicDocumentRetrievalService(ClinicDocumentRepository clinicDocumentRepository) {
        this.clinicDocumentRepository = clinicDocumentRepository;
    }

    public List<ClinicDocument> retrieveRelevantDocuments(String query) {
        if (query == null || query.isBlank()) {
            return List.of();
        }

        // Escape SQL LIKE wildcards for keyword fallback
        String escapedQuery = query.replace("%", "\\%").replace("_", "\\_");

        List<ClinicDocument> results = clinicDocumentRepository.searchActiveDocuments(query, escapedQuery, maxRetrievalLimit);

        // Fallback to active documents list if query search returns empty
        if (results.isEmpty()) {
            List<ClinicDocument> activeDocs = clinicDocumentRepository.findByActiveTrueOrderByTitleAsc();
            if (!activeDocs.isEmpty()) {
                return activeDocs.stream().limit(maxRetrievalLimit).toList();
            }
        }

        return results;
    }
}

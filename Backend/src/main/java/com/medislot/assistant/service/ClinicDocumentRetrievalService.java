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

    @Value("${ai.grounding.retrieval-limit:8}")
    private int maxRetrievalLimit = 8;

    public ClinicDocumentRetrievalService(ClinicDocumentRepository clinicDocumentRepository) {
        this.clinicDocumentRepository = clinicDocumentRepository;
    }

    public List<ClinicDocument> retrieveRelevantDocuments(String query) {
        if (query == null || query.isBlank()) {
            return List.of();
        }

        java.util.LinkedHashMap<java.util.UUID, ClinicDocument> docMap = new java.util.LinkedHashMap<>();

        // Escape SQL LIKE wildcards
        String escapedQuery = query.replace("%", "\\%").replace("_", "\\_");

        // 1. Full-text search
        List<ClinicDocument> ftsResults = clinicDocumentRepository.searchActiveDocuments(query, escapedQuery, maxRetrievalLimit);
        for (ClinicDocument doc : ftsResults) {
            docMap.put(doc.getId(), doc);
        }

        // 2. Tokenize words for keyword matching (English, Hindi transliteration)
        String[] tokens = query.toLowerCase().replaceAll("[^a-z0-9\\s]", " ").split("\\s+");
        List<String> keywords = java.util.Arrays.stream(tokens)
                .filter(t -> t.length() >= 3)
                .toList();

        if (!keywords.isEmpty()) {
            List<ClinicDocument> keywordMatches = clinicDocumentRepository.findByKeywords(keywords.toArray(new String[0]));
            for (ClinicDocument doc : keywordMatches) {
                if (docMap.size() >= maxRetrievalLimit) break;
                docMap.putIfAbsent(doc.getId(), doc);
            }
        }

        // 3. Fallback: If no specific search matches found, retrieve top active specialization & policy documents
        if (docMap.isEmpty()) {
            List<ClinicDocument> activeDocs = clinicDocumentRepository.findByActiveTrueOrderByTitleAsc();
            for (ClinicDocument doc : activeDocs) {
                if (docMap.size() >= maxRetrievalLimit) break;
                docMap.put(doc.getId(), doc);
            }
        }

        return new java.util.ArrayList<>(docMap.values());
    }
}

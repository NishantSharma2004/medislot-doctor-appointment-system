package com.medislot.assistant.service;

import com.medislot.assistant.entity.ClinicDocument;
import com.medislot.assistant.repository.ClinicDocumentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class ClinicDocumentRetrievalServiceTest {

    @Mock
    private ClinicDocumentRepository repository;

    @InjectMocks
    private ClinicDocumentRetrievalService retrievalService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void retrieveRelevantDocuments_shouldReturnEmptyForNullOrBlankQuery() {
        assertTrue(retrievalService.retrieveRelevantDocuments(null).isEmpty());
        assertTrue(retrievalService.retrieveRelevantDocuments("  ").isEmpty());
    }

    @Test
    void retrieveRelevantDocuments_shouldReturnSearchResultsWhenMatchesFound() {
        ClinicDocument doc = new ClinicDocument();
        doc.setTitle("Clinic Hours");
        doc.setActive(true);

        when(repository.searchActiveDocuments(eq("hours"), eq("hours"), anyInt()))
                .thenReturn(List.of(doc));

        List<ClinicDocument> results = retrievalService.retrieveRelevantDocuments("hours");
        assertEquals(1, results.size());
        assertEquals("Clinic Hours", results.get(0).getTitle());
    }

    @Test
    void retrieveRelevantDocuments_shouldFallbackToActiveDocsWhenNoSearchMatch() {
        ClinicDocument activeDoc = new ClinicDocument();
        activeDoc.setTitle("General Checklist");
        activeDoc.setActive(true);

        when(repository.searchActiveDocuments(anyString(), anyString(), anyInt()))
                .thenReturn(List.of());
        when(repository.findByActiveTrueOrderByTitleAsc())
                .thenReturn(List.of(activeDoc));

        List<ClinicDocument> results = retrievalService.retrieveRelevantDocuments("randomquery");
        assertEquals(1, results.size());
        assertEquals("General Checklist", results.get(0).getTitle());
    }
}

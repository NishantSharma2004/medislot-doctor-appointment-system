package com.medislot.assistant.repository;

import com.medislot.assistant.entity.ClinicDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface ClinicDocumentRepository extends JpaRepository<ClinicDocument, UUID> {

    List<ClinicDocument> findByActiveTrueOrderByTitleAsc();

    /**
     * PostgreSQL Full-Text Search query with ts_rank ordering and ILIKE keyword fallback.
     * Searches only active documents.
     */
    @Query(value = """
            SELECT d.*,
                   ts_rank(d.fts_document_vector, websearch_to_tsquery('english', :query)) AS rank
            FROM clinic_documents d
            WHERE d.active = TRUE
              AND (
                d.fts_document_vector @@ websearch_to_tsquery('english', :query)
                OR LOWER(d.title) LIKE LOWER(CONCAT('%', :escapedQuery, '%'))
                OR LOWER(d.content) LIKE LOWER(CONCAT('%', :escapedQuery, '%'))
              )
            ORDER BY rank DESC, d.title ASC
            LIMIT :limit
            """, nativeQuery = true)
    List<ClinicDocument> searchActiveDocuments(
            @Param("query") String query,
            @Param("escapedQuery") String escapedQuery,
            @Param("limit") int limit
    );

    /**
     * Fallback search by JSONB keywords.
     */
    @Query(value = """
            SELECT * FROM clinic_documents d
            WHERE d.active = TRUE
              AND EXISTS (
                    SELECT 1
                    FROM jsonb_array_elements_text(d.keywords) AS kw(value)
                    WHERE LOWER(kw.value) = ANY (:keywords)
                  )
            ORDER BY d.title ASC
            """, nativeQuery = true)
    List<ClinicDocument> findByKeywords(@Param("keywords") String[] keywords);
}

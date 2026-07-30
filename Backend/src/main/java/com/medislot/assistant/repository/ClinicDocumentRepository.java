package com.medislot.assistant.repository;

import com.medislot.assistant.entity.ClinicDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface ClinicDocumentRepository extends JpaRepository<ClinicDocument, UUID> {

    List<ClinicDocument> findByActiveTrueOrderByTitleAsc();

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

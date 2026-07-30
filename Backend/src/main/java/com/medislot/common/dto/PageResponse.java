package com.medislot.common.dto;

import java.util.List;

/**
 * Stable pagination envelope returned by list endpoints.
 * Mirrors {@code PageResponse<T>} in the React frontend.
 */
public record PageResponse<T>(
        List<T> content,
        int page,
        int size,
        long totalElements,
        int totalPages
) {
}

package com.medislot.common.exception;

import com.medislot.common.dto.ApiErrorResponse;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

import com.medislot.common.observability.TelemetryService;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);
    private final TelemetryService telemetryService = new TelemetryService();

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ApiErrorResponse> handleBusinessException(BusinessException ex, HttpServletRequest request) {
        log.warn("Business exception [{}]: {}", ex.getCode(), ex.getMessage());
        telemetryService.recordError(request.getRequestURI(), ex.getStatus().value(), ex.getCode(), ex.getMessage(), ex);
        ApiErrorResponse body = new ApiErrorResponse(
                Instant.now(),
                ex.getStatus().value(),
                ex.getCode(),
                ex.getMessage(),
                request.getRequestURI(),
                null
        );
        return ResponseEntity.status(ex.getStatus()).body(body);
    }

    @ExceptionHandler(RateLimitExceededException.class)
    public ResponseEntity<ApiErrorResponse> handleRateLimitExceeded(RateLimitExceededException ex, HttpServletRequest request) {
        log.warn("Rate limit exceeded on path [{}]: retry after {}s", request.getRequestURI(), ex.getRetryAfterSeconds());
        ApiErrorResponse body = new ApiErrorResponse(
                Instant.now(),
                HttpStatus.TOO_MANY_REQUESTS.value(),
                ex.getCode(),
                ex.getMessage(),
                request.getRequestURI(),
                null
        );
        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                .header("Retry-After", String.valueOf(ex.getRetryAfterSeconds()))
                .header("X-RateLimit-Limit", String.valueOf(ex.getLimit()))
                .header("X-RateLimit-Remaining", String.valueOf(ex.getRemaining()))
                .header("X-RateLimit-Reset", String.valueOf(ex.getRetryAfterSeconds()))
                .body(body);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleValidationException(MethodArgumentNotValidException ex, HttpServletRequest request) {
        Map<String, String> fieldErrors = new HashMap<>();
        for (FieldError fieldError : ex.getBindingResult().getFieldErrors()) {
            fieldErrors.put(fieldError.getField(), fieldError.getDefaultMessage());
        }

        ApiErrorResponse body = new ApiErrorResponse(
                Instant.now(),
                HttpStatus.BAD_REQUEST.value(),
                "VALIDATION_ERROR",
                "Please check the highlighted fields.",
                request.getRequestURI(),
                fieldErrors
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiErrorResponse> handleHttpMessageNotReadable(HttpMessageNotReadableException ex, HttpServletRequest request) {
        ApiErrorResponse body = new ApiErrorResponse(
                Instant.now(),
                HttpStatus.BAD_REQUEST.value(),
                "MALFORMED_JSON",
                "Malformed JSON request body.",
                request.getRequestURI(),
                null
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiErrorResponse> handleBadCredentials(BadCredentialsException ex, HttpServletRequest request) {
        ApiErrorResponse body = new ApiErrorResponse(
                Instant.now(),
                HttpStatus.UNAUTHORIZED.value(),
                "INVALID_CREDENTIALS",
                "Invalid email or password.",
                request.getRequestURI(),
                null
        );
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(body);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiErrorResponse> handleDataIntegrityViolation(DataIntegrityViolationException ex, HttpServletRequest request) {
        log.warn("Data integrity violation on path [{}]: {}", request.getRequestURI(), ex.getMostSpecificCause().getMessage());
        String path = request.getRequestURI();
        if (path != null && path.contains("/auth/register")) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(new ApiErrorResponse(
                    Instant.now(),
                    HttpStatus.CONFLICT.value(),
                    "USER_ALREADY_EXISTS",
                    "An account with this email address, phone number, or medical registration number already exists. Please try signing in or use unique details.",
                    path,
                    null
            ));
        }
        if (path != null && path.contains("/users/me")) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiErrorResponse(
                    Instant.now(),
                    HttpStatus.BAD_REQUEST.value(),
                    "INVALID_PROFILE_DATA",
                    "Profile details contain invalid or conflicting data.",
                    path,
                    null
            ));
        }
        if (path != null && path.contains("/doctors/availability")) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(new ApiErrorResponse(
                    Instant.now(),
                    HttpStatus.CONFLICT.value(),
                    "SLOT_OVERLAP_CONFLICT",
                    "Availability slots already exist or overlap in this time window.",
                    path,
                    null
            ));
        }
        ApiErrorResponse body = new ApiErrorResponse(
                Instant.now(),
                HttpStatus.CONFLICT.value(),
                "DATA_INTEGRITY_VIOLATION",
                "Data integrity conflict occurred. Please verify input data.",
                path,
                null
        );
        return ResponseEntity.status(HttpStatus.CONFLICT).body(body);
    }

    @ExceptionHandler(ObjectOptimisticLockingFailureException.class)
    public ResponseEntity<ApiErrorResponse> handleOptimisticLockingFailure(ObjectOptimisticLockingFailureException ex, HttpServletRequest request) {
        log.warn("Optimistic locking conflict on path [{}]: {}", request.getRequestURI(), ex.getMessage());
        String path = request.getRequestURI();
        String message = path != null && path.contains("/auth/register")
                ? "Account registration is processing or already exists. Please try signing in."
                : "The requested resource was updated by another concurrent request. Please try again.";
        ApiErrorResponse body = new ApiErrorResponse(
                Instant.now(),
                HttpStatus.CONFLICT.value(),
                "CONCURRENCY_CONFLICT",
                message,
                path,
                null
        );
        return ResponseEntity.status(HttpStatus.CONFLICT).body(body);
    }

    @ExceptionHandler(ExpiredJwtException.class)
    public ResponseEntity<ApiErrorResponse> handleExpiredJwt(ExpiredJwtException ex, HttpServletRequest request) {
        ApiErrorResponse body = new ApiErrorResponse(
                Instant.now(),
                HttpStatus.UNAUTHORIZED.value(),
                "EXPIRED_TOKEN",
                "JWT access token has expired.",
                request.getRequestURI(),
                null
        );
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(body);
    }

    @ExceptionHandler(JwtException.class)
    public ResponseEntity<ApiErrorResponse> handleJwtException(JwtException ex, HttpServletRequest request) {
        ApiErrorResponse body = new ApiErrorResponse(
                Instant.now(),
                HttpStatus.UNAUTHORIZED.value(),
                "INVALID_TOKEN",
                "JWT token is invalid or malformed.",
                request.getRequestURI(),
                null
        );
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(body);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiErrorResponse> handleAccessDenied(AccessDeniedException ex, HttpServletRequest request) {
        ApiErrorResponse body = new ApiErrorResponse(
                Instant.now(),
                HttpStatus.FORBIDDEN.value(),
                "FORBIDDEN",
                "Access denied.",
                request.getRequestURI(),
                null
        );
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(body);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ApiErrorResponse> handleAuthenticationException(AuthenticationException ex, HttpServletRequest request) {
        ApiErrorResponse body = new ApiErrorResponse(
                Instant.now(),
                HttpStatus.UNAUTHORIZED.value(),
                "UNAUTHORIZED",
                ex.getMessage() != null ? ex.getMessage() : "Authentication required.",
                request.getRequestURI(),
                null
        );
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(body);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleUncaughtException(Exception ex, HttpServletRequest request) {
        log.error("Unhandled internal exception on path [{}]: ", request.getRequestURI(), ex);
        ApiErrorResponse body = new ApiErrorResponse(
                Instant.now(),
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "SERVER_ERROR",
                "An unexpected internal error occurred.",
                request.getRequestURI(),
                null
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
    }
}

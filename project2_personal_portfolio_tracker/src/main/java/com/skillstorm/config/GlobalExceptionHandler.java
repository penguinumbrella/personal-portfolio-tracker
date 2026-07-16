package com.skillstorm.config;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import jakarta.validation.ConstraintViolationException;

/** Centralizes translation of exceptions thrown anywhere in the request pipeline into JSON error responses. */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    /**
     * Handles exceptions thrown deliberately by the service layer due to bad input, usually
     * a 404 (not found) or 409 (conflict).
     *
     * @param e the exception carrying the intended HTTP status and reason
     * @return a body containing that status and reason
     */
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, Object>> handleErrorResponse(ResponseStatusException e) {

        HashMap<String, Object> errorObject = new HashMap<String, Object>();

        errorObject.put("status", e.getStatusCode().value());
        errorObject.put("reason", e.getReason());

        return ResponseEntity.status(e.getStatusCode()).body(errorObject);
    }

    /**
     * Handles Spring's {@code @Valid} bean-validation failures on request bodies.
     *
     * @param e the exception carrying the field errors that failed validation
     * @return a 400 body listing each invalid field and its validation message
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationError(MethodArgumentNotValidException e) {

        Map<String, String> errors = new HashMap<>();

        e.getBindingResult().getFieldErrors().forEach(
                error -> {
                    errors.put(error.getField(), error.getDefaultMessage());
                });

        Map<String, Object> response = new HashMap<>();
        response.put("status", 400);
        response.put("reason", "Invalid input data provided.");
        response.put("errors", errors);

        return ResponseEntity.status(400).body(response);
    }

    /**
     * Handles Jakarta Bean Validation constraint violations (e.g. from validating method arguments directly).
     *
     * @param e the exception carrying the constraint violations
     * @return a 400 body listing each invalid property and its validation message
     */
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<Map<String, Object>> handleValidationError(ConstraintViolationException e) {

        Map<String, String> errors = new HashMap<>();

        e.getConstraintViolations().forEach(
                error -> {
                    errors.put(error.getPropertyPath().toString(), error.getMessage());
                });
        Map<String, Object> response = new HashMap<>();
        response.put("status", 400);
        response.put("reason", "Validation Errors");
        response.put("errors", errors);

        return ResponseEntity.status(400).body(response);
    }

    /**
     * Handles malformed JSON or invalid enum/field values in the request body.
     *
     * @param e the exception thrown while deserializing the request body
     * @return a 400 body with a generic malformed-request reason
     */
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, Object>> handleMessageNotReadable(HttpMessageNotReadableException e) {
        Map<String, Object> response = new HashMap<>();
        response.put("status", HttpStatus.BAD_REQUEST.value());
        response.put("reason", "Malformed request body or invalid field value.");

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    /**
     * Handles DB-level unique constraint violations that slip past service-layer duplicate checks.
     *
     * @param e the exception thrown by the persistence layer
     * @return a 409 body with a generic duplicate-record reason
     */
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, Object>> handleDataIntegrityViolation(DataIntegrityViolationException e) {
        log.warn("Data integrity violation", e);

        Map<String, Object> response = new HashMap<>();
        response.put("status", HttpStatus.CONFLICT.value());
        response.put("reason", "A record with this value already exists.");

        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
    }

    /**
     * Catch-all handler for any exception not covered above.
     *
     * @param e the unhandled exception
     * @return a generic 500 response
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleGeneralException(Exception e) {
        log.error("Unhandled exception", e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Uh oh! Unknown error");
    }

}

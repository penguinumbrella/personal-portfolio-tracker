package com.skillstorm.config;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import jakarta.validation.ConstraintViolationException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    // anytime exception is thrown due to bad input, usually
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, Object>> handleErrorResponse(ResponseStatusException e) {

        HashMap<String, Object> errorObject = new HashMap<String, Object>();

        errorObject.put("status", e.getStatusCode().value());
        errorObject.put("reason", e.getReason());

        return ResponseEntity.status(e.getStatusCode()).body(errorObject);
    }

    // spring framework validation exceptions
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

    // jakarta constraint validation exceptions
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

    // DB-level unique constraint violations that slip past service-layer duplicate checks
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, Object>> handleDataIntegrityViolation(DataIntegrityViolationException e) {
        log.warn("Data integrity violation", e);

        Map<String, Object> response = new HashMap<>();
        response.put("status", HttpStatus.CONFLICT.value());
        response.put("reason", "A record with this value already exists.");

        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
    }

    // generic handler for any other exception
    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleGeneralException(Exception e) {
        log.error("Unhandled exception", e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Uh oh! Unknown error");
    }

}

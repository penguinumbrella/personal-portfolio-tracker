package com.skillstorm.config;

import java.util.List;
import java.util.Map;
import java.util.Set;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.server.ResponseStatusException;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Path;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@DisplayName("GlobalExceptionHandler")
class GlobalExceptionHandlerTest {

    private final GlobalExceptionHandler handler = new GlobalExceptionHandler();

    @Nested
    @DisplayName("handleErrorResponse()")
    class handleErrorResponse {

        @Test
        @DisplayName("maps a ResponseStatusException to its status and reason")
        void mapsStatusAndReason() {
            ResponseStatusException ex = new ResponseStatusException(HttpStatus.NOT_FOUND, "not found");

            ResponseEntity<Map<String, Object>> result = handler.handleErrorResponse(ex);

            assertEquals(HttpStatus.NOT_FOUND, result.getStatusCode());
            assertEquals(404, result.getBody().get("status"));
            assertEquals("not found", result.getBody().get("reason"));
        }
    }

    @Nested
    @DisplayName("handleValidationError(MethodArgumentNotValidException)")
    class handleMethodArgumentNotValidException {

        @Test
        @DisplayName("maps field errors to a 400 response")
        void mapsFieldErrorsTo400() {
            MethodArgumentNotValidException ex = mock(MethodArgumentNotValidException.class);
            BindingResult bindingResult = mock(BindingResult.class);
            when(ex.getBindingResult()).thenReturn(bindingResult);
            when(bindingResult.getFieldErrors()).thenReturn(
                    List.of(new FieldError("dto", "username", "must not be blank")));

            ResponseEntity<Map<String, Object>> result = handler.handleValidationError(ex);

            assertEquals(400, result.getStatusCode().value());
            assertEquals(400, result.getBody().get("status"));
            assertEquals("Invalid input data provided.", result.getBody().get("reason"));
            @SuppressWarnings("unchecked")
            Map<String, String> errors = (Map<String, String>) result.getBody().get("errors");
            assertEquals("must not be blank", errors.get("username"));
        }
    }

    @Nested
    @DisplayName("handleValidationError(ConstraintViolationException)")
    class handleConstraintViolationException {

        @Test
        @DisplayName("maps constraint violations to a 400 response")
        void mapsConstraintViolationsTo400() {
            Path propertyPath = mock(Path.class);
            when(propertyPath.toString()).thenReturn("email");

            ConstraintViolation<?> violation = mock(ConstraintViolation.class);
            when(violation.getPropertyPath()).thenReturn(propertyPath);
            when(violation.getMessage()).thenReturn("must be a valid email");

            ConstraintViolationException ex = new ConstraintViolationException(Set.of(violation));

            ResponseEntity<Map<String, Object>> result = handler.handleValidationError(ex);

            assertEquals(400, result.getStatusCode().value());
            assertEquals(400, result.getBody().get("status"));
            assertEquals("Validation Errors", result.getBody().get("reason"));
            @SuppressWarnings("unchecked")
            Map<String, String> errors = (Map<String, String>) result.getBody().get("errors");
            assertEquals("must be a valid email", errors.get("email"));
        }
    }

    @Nested
    @DisplayName("handleGeneralException()")
    class handleGeneralException {

        @Test
        @DisplayName("maps any other exception to a 500 response")
        void mapsToInternalServerError() {
            ResponseEntity<String> result = handler.handleGeneralException(new RuntimeException("boom"));

            assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, result.getStatusCode());
            assertEquals("Uh oh! Unknown error", result.getBody());
        }
    }
}

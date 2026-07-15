package com.skillstorm.config;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.web.servlet.config.annotation.CorsRegistration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@DisplayName("WebConfig")
class WebConfigTest {

    @Test
    @DisplayName("addCorsMappings() registers the allowed origins, methods, and credentials for /v1/**")
    void addCorsMappingsConfiguresExpectedCors() {
        CorsRegistry registry = mock(CorsRegistry.class);
        CorsRegistration registration = mock(CorsRegistration.class);

        when(registry.addMapping("/v1/**")).thenReturn(registration);
        when(registration.allowedOrigins(any(String[].class))).thenReturn(registration);
        when(registration.allowedMethods(any(String[].class))).thenReturn(registration);
        when(registration.allowCredentials(true)).thenReturn(registration);

        new WebConfig().addCorsMappings(registry);

        verify(registry).addMapping("/v1/**");
        verify(registration).allowedOrigins(
                "https://d13to6rck5cj2.cloudfront.net",
                "https://d1jcki4jtvzqdz.cloudfront.net",
                "http://127.0.0.1:5500",
                "http://localhost:4200");
        verify(registration).allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS");
        verify(registration).allowCredentials(true);
    }
}

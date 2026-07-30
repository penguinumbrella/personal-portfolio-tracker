package com.skillstorm.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/** Centralizes CORS so allowed origins live in one place instead of a @CrossOrigin on every controller. */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    private static final String[] ALLOWED_ORIGINS = {
            "https://d13to6rck5cj2.cloudfront.net",
            "https://d1jcki4jtvzqdz.cloudfront.net", // only one needed for production
            "http://127.0.0.1:5500",
            "http://localhost:4200"
    };

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/v1/**")
                .allowedOrigins(ALLOWED_ORIGINS)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowCredentials(true);
    }
}

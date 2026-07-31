package com.skillstorm.Controllers;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Mock "cache" responses used when the portfolio-service circuit breaker opens.
 * Gateway routes forward here via {@code fallbackUri: forward:/fallback/portfolio}.
 */
@RestController
public class FallbackController {

    /**
     * Returns a stand-in cached payload when portfolio-service is unavailable or the
     * circuit breaker is open.
     *
     * @return a mock cache response with HTTP 200 so the client still gets a body
     */
    @RequestMapping("/fallback/portfolio")
    public ResponseEntity<Map<String, Object>> portfolioFallback() {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("message", "CircuitBreaker popped, returning cached results");
        body.put("cached", true);
        body.put("data", List.of());
        return ResponseEntity.status(HttpStatus.OK).body(body);
    }
}

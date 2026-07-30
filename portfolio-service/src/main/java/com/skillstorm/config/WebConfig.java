package com.skillstorm.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Portfolio-service is only reached through the API gateway, so CORS belongs on the
 * gateway — not here. Leaving this empty avoids duplicate Access-Control-* headers
 * that browsers reject when both layers add them.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {
}

package com.skillstorm.config;

import static org.springframework.cloud.gateway.server.mvc.filter.AfterFilterFunctions.dedupeResponseHeader;
import static org.springframework.cloud.gateway.server.mvc.filter.BeforeFilterFunctions.uri;
import static org.springframework.cloud.gateway.server.mvc.filter.CircuitBreakerFilterFunctions.circuitBreaker;
import static org.springframework.cloud.gateway.server.mvc.handler.GatewayRouterFunctions.route;
import static org.springframework.cloud.gateway.server.mvc.handler.HandlerFunctions.http;
import static org.springframework.web.servlet.function.RequestPredicates.path;

import java.net.URI;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.function.RouterFunction;
import org.springframework.web.servlet.function.ServerResponse;

/**
 * Portfolio proxy routes with a Resilience4j circuit breaker. Defined in Java because Gateway
 * MVC YAML binding does not reliably set the circuit breaker id
 * ({@code IllegalArgumentException: A CircuitBreaker must have an id}).
 */
@Configuration
public class GatewayRouteConfig {

    private static final URI PORTFOLIO_SERVICE = URI.create("http://localhost:8082");
    private static final URI PORTFOLIO_FALLBACK = URI.create("forward:/fallback/portfolio");
    private static final String PORTFOLIO_CB = "portfolioCircuitBreaker";
    private static final String DEDUPE_CORS_HEADERS =
            "Access-Control-Allow-Credentials Access-Control-Allow-Origin Access-Control-Allow-Methods Access-Control-Allow-Headers Access-Control-Expose-Headers";

    @Bean
    RouterFunction<ServerResponse> portfolioInvestmentsRoute() {
        return portfolioRoute("portfolio-investments", "/v1/investments/**");
    }

    @Bean
    RouterFunction<ServerResponse> portfolioSecuritiesRoute() {
        return portfolioRoute("portfolio-securities", "/v1/securities/**");
    }

    @Bean
    RouterFunction<ServerResponse> portfolioHoldingsRoute() {
        return portfolioRoute("portfolio-holdings", "/v1/holdings/**");
    }

    private RouterFunction<ServerResponse> portfolioRoute(String routeId, String pathPattern) {
        return route(routeId)
                .route(path(pathPattern), http())
                .before(uri(PORTFOLIO_SERVICE))
                .filter(circuitBreaker(PORTFOLIO_CB, PORTFOLIO_FALLBACK))
                .after(dedupeResponseHeader(DEDUPE_CORS_HEADERS))
                .build();
    }
}

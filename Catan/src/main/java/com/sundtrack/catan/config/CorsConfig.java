package com.sundtrack.catan.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

/**
 * CORS configuration — active in the "dev" profile only.
 *
 * In production nginx proxies both /api/* and /ws/* to this service,
 * so everything shares one origin and no CORS headers are needed.
 *
 * In dev the Vite dev server (port 5173) proxies requests to Spring
 * on localhost:8080. The Vite proxy handles /api/* and /ws/* for you,
 * so browser-level CORS is also avoided in normal dev use.
 *
 * This bean exists as a fallback for direct backend access
 * (e.g. Postman, curl, or integration tests hitting port 8080 directly).
 *
 * FILE LOCATION:
 *   src/main/java/com/example/myapp/config/CorsConfig.java
 */
//@Configuration
//@Profile("dev")
//public class CorsConfig {
//
//    @Bean
//    public CorsFilter corsFilter() {
//        CorsConfiguration config = new CorsConfiguration();
//
//        // Vite dev server origin
//        config.addAllowedOrigin("http://localhost:5173");
//
//        config.addAllowedMethod("*");
//        config.addAllowedHeader("*");
//
//        // Required for cookies / Authorization headers,
//        // and also for the WebSocket upgrade handshake
//        config.setAllowCredentials(true);
//
//        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//        source.registerCorsConfiguration("/api/**", config);
//        source.registerCorsConfiguration("/ws/**", config);  // WebSocket handshake endpoint
//
//        return new CorsFilter(source);
//    }
//}
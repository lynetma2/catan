package com.sundtrack.catan.config; // <-- Change this to match your package structure

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                // Allow your local frontend development servers
                .allowedOrigins(
                        "http://localhost:5173", // Vite default
                        "http://localhost:3000", // React default
                        "http://localhost:8080"  // In case you test backend directly
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*");
    }
}
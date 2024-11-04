// src/main/java/com/yourcompany/yourapp/config/WebConfig.java
package com.itsag3t1.crm.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        
        // Set the specific origin of your React app
        config.addAllowedOrigin("http://localhost:3000");
        config.setAllowCredentials(true);
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        
        // Make sure OPTIONS preflight requests work
        config.addAllowedMethod("OPTIONS");
        
        // Add exposed headers if you're using them
        config.addExposedHeader("Authorization");
        
        source.registerCorsConfiguration("/api/**", config);
        return new CorsFilter(source);
    }
}
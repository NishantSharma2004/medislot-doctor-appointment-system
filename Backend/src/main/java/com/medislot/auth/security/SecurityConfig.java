package com.medislot.auth.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    private final CustomAccessDeniedHandler customAccessDeniedHandler;
    private final CorsConfigurationSource corsConfigurationSource;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter,
            JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint,
            CustomAccessDeniedHandler customAccessDeniedHandler,
            CorsConfigurationSource corsConfigurationSource) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.jwtAuthenticationEntryPoint = jwtAuthenticationEntryPoint;
        this.customAccessDeniedHandler = customAccessDeniedHandler;
        this.corsConfigurationSource = corsConfigurationSource;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint(jwtAuthenticationEntryPoint)
                        .accessDeniedHandler(customAccessDeniedHandler)
                )
                .authorizeHttpRequests(auth -> auth
                        // Public Authentication
                        .requestMatchers(
                                "/api/v1/auth/register",
                                "/api/v1/auth/login",
                                "/api/v1/auth/refresh",
                                "/api/v1/auth/forgot-password",
                                "/api/v1/auth/reset-password"
                        ).permitAll()
                        
                        // Authenticated Password & User Profile APIs
                        .requestMatchers("/api/v1/auth/change-password").authenticated()
                        .requestMatchers("/api/v1/users/me/**").authenticated()

                        // Public Phase 4 Read APIs
                        .requestMatchers(HttpMethod.GET, "/api/v1/specializations/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/doctors").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/doctors/*").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/doctors/*/availability").permitAll()
                        
                        // Doctor Availability & Dashboard APIs
                        .requestMatchers(HttpMethod.POST, "/api/v1/doctors/availability").hasRole("DOCTOR")
                        .requestMatchers(HttpMethod.PATCH, "/api/v1/doctors/availability/*").hasRole("DOCTOR")
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/doctors/availability/*").hasRole("DOCTOR")
                        .requestMatchers("/api/v1/doctor/**").hasRole("DOCTOR")

                        // Phase 5 Appointment Security Rules
                        .requestMatchers(HttpMethod.POST, "/api/v1/appointments").hasRole("PATIENT")
                        .requestMatchers(HttpMethod.GET, "/api/v1/appointments/my").hasRole("PATIENT")
                        .requestMatchers(HttpMethod.GET, "/api/v1/doctors/appointments").hasRole("DOCTOR")
                        .requestMatchers(HttpMethod.PATCH, "/api/v1/appointments/*/status").hasRole("DOCTOR")
                        .requestMatchers(HttpMethod.POST, "/api/v1/appointments/*/prescription").hasAnyRole("DOCTOR", "ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/api/v1/appointments/*/reschedule").hasRole("PATIENT")
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/appointments/*").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/v1/appointments/*").authenticated()

                        // Phase 6 Assistant Security Rules
                        .requestMatchers(HttpMethod.POST, "/api/v1/assistant/chat").permitAll()
                        
                        // Public Swagger & Actuator
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/swagger-ui.html").permitAll()
                        .requestMatchers("/actuator/health", "/actuator/info").permitAll()
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        
                        // Admin routes
                        .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
                        
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
}

package com.medislot.auth.service;

import com.medislot.auth.dto.AuthResponse;
import com.medislot.auth.dto.LoginRequest;
import com.medislot.auth.dto.LogoutRequest;
import com.medislot.auth.dto.RefreshTokenRequest;
import com.medislot.auth.dto.RegisterRequest;
import com.medislot.auth.entity.RefreshToken;
import com.medislot.auth.repository.RefreshTokenRepository;
import com.medislot.common.enums.Role;
import com.medislot.common.exception.ConflictException;
import com.medislot.common.exception.UnauthorizedException;
import com.medislot.user.dto.UserDto;
import com.medislot.user.entity.PatientProfile;
import com.medislot.user.entity.User;
import com.medislot.user.repository.PatientProfileRepository;
import com.medislot.user.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PatientProfileRepository patientProfileRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(
            UserRepository userRepository,
            PatientProfileRepository patientProfileRepository,
            RefreshTokenRepository refreshTokenRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.patientProfileRepository = patientProfileRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    @Transactional
    public AuthResponse registerPatient(RegisterRequest request) {
        String normalizedEmail = request.email().trim().toLowerCase();

        if (userRepository.existsByEmailIgnoreCase(normalizedEmail)) {
            throw new ConflictException("An account with this email address already exists.");
        }

        String passwordHash = passwordEncoder.encode(request.password());
        User user = new User(
                null,
                normalizedEmail,
                passwordHash,
                request.fullName().trim(),
                request.phone() != null ? request.phone().trim() : null,
                Role.PATIENT
        );

        User savedUser = userRepository.save(user);
        PatientProfile patientProfile = new PatientProfile(savedUser);
        patientProfileRepository.save(patientProfile);

        return createAuthResponse(savedUser);
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        String normalizedEmail = request.email().trim().toLowerCase();

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(normalizedEmail, request.password())
        );

        User user = userRepository.findByEmailIgnoreCase(normalizedEmail)
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password."));

        if (!user.isEnabled()) {
            throw new UnauthorizedException("User account is disabled.");
        }

        refreshTokenRepository.revokeAllByUserId(user.getId(), Instant.now());
        return createAuthResponse(user);
    }

    @Transactional
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        String hash = jwtService.hashToken(request.refreshToken());
        RefreshToken existingToken = refreshTokenRepository.findActiveByTokenHash(hash, Instant.now())
                .orElseThrow(() -> new UnauthorizedException("Invalid or expired refresh token."));

        User user = existingToken.getUser();
        if (!user.isEnabled()) {
            throw new UnauthorizedException("User account is disabled.");
        }

        existingToken.setRevokedAt(Instant.now());
        refreshTokenRepository.save(existingToken);

        return createAuthResponse(user);
    }

    @Transactional
    public void logout(LogoutRequest request) {
        if (request.refreshToken() != null && !request.refreshToken().isBlank()) {
            String hash = jwtService.hashToken(request.refreshToken());
            refreshTokenRepository.findActiveByTokenHash(hash, Instant.now())
                    .ifPresent(token -> {
                        token.setRevokedAt(Instant.now());
                        refreshTokenRepository.save(token);
                    });
        }
    }

    public UserDto getCurrentUser(User authenticatedUser) {
        return mapToUserDto(authenticatedUser);
    }

    private AuthResponse createAuthResponse(User user) {
        String accessToken = jwtService.generateAccessToken(user);
        String rawRefreshToken = jwtService.generateRawRefreshToken();
        String refreshTokenHash = jwtService.hashToken(rawRefreshToken);

        RefreshToken refreshTokenEntity = new RefreshToken();
        refreshTokenEntity.setUser(user);
        refreshTokenEntity.setTokenHash(refreshTokenHash);
        refreshTokenEntity.setExpiresAt(Instant.now().plusMillis(jwtService.getRefreshExpirationMs()));
        refreshTokenEntity.setCreatedAt(Instant.now());

        refreshTokenRepository.save(refreshTokenEntity);

        return new AuthResponse(
                accessToken,
                rawRefreshToken,
                "Bearer",
                jwtService.getAccessExpirationMs(),
                mapToUserDto(user)
        );
    }

    public UserDto mapToUserDto(User user) {
        return new UserDto(
                user.getId().toString(),
                user.getFullName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole()
        );
    }
}

package com.medislot.auth.service;

import com.medislot.auth.dto.AuthResponse;
import com.medislot.auth.dto.LoginRequest;
import com.medislot.auth.dto.LogoutRequest;
import com.medislot.auth.dto.RefreshTokenRequest;
import com.medislot.auth.dto.RegisterRequest;
import com.medislot.auth.entity.RefreshToken;
import com.medislot.auth.repository.RefreshTokenRepository;
import com.medislot.common.enums.Role;
import com.medislot.common.exception.BusinessException;
import com.medislot.common.exception.ConflictException;
import com.medislot.common.exception.UnauthorizedException;
import org.springframework.http.HttpStatus;
import com.medislot.user.dto.UserDto;
import com.medislot.user.entity.PatientProfile;
import com.medislot.user.entity.User;
import com.medislot.user.repository.PatientProfileRepository;
import com.medislot.user.repository.UserRepository;
import com.medislot.doctor.entity.DoctorProfile;
import com.medislot.doctor.repository.DoctorProfileRepository;
import com.medislot.specialization.entity.Specialization;
import com.medislot.specialization.repository.SpecializationRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PatientProfileRepository patientProfileRepository;
    private final DoctorProfileRepository doctorProfileRepository;
    private final SpecializationRepository specializationRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final TokenBlacklistService tokenBlacklistService;
    private final BruteForceProtectionService bruteForceProtectionService;
    private final AuthenticationManager authenticationManager;

    public AuthService(
            UserRepository userRepository,
            PatientProfileRepository patientProfileRepository,
            DoctorProfileRepository doctorProfileRepository,
            SpecializationRepository specializationRepository,
            RefreshTokenRepository refreshTokenRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            TokenBlacklistService tokenBlacklistService,
            BruteForceProtectionService bruteForceProtectionService,
            AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.patientProfileRepository = patientProfileRepository;
        this.doctorProfileRepository = doctorProfileRepository;
        this.specializationRepository = specializationRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.tokenBlacklistService = tokenBlacklistService;
        this.bruteForceProtectionService = bruteForceProtectionService;
        this.authenticationManager = authenticationManager;
    }

    @Transactional
    public AuthResponse registerPatient(RegisterRequest request) {
        String normalizedEmail = request.email().trim().toLowerCase();

        if (userRepository.existsByEmailIgnoreCase(normalizedEmail)) {
            throw new ConflictException("An account with email '" + normalizedEmail + "' already exists. Please try signing in.");
        }

        if (request.phone() != null && !request.phone().isBlank() && userRepository.existsByPhone(request.phone().trim())) {
            throw new ConflictException("An account with phone number '" + request.phone().trim() + "' already exists. Please try signing in or use a different phone number.");
        }

        Role role = request.role() != null ? request.role() : Role.PATIENT;
        if (role == Role.ADMIN) {
            role = Role.PATIENT;
        }

        String passwordHash = passwordEncoder.encode(request.password());
        User user = new User(
                null,
                normalizedEmail,
                passwordHash,
                request.fullName().trim(),
                request.phone() != null ? request.phone().trim() : null,
                role
        );

        User savedUser = userRepository.save(user);

        if (role == Role.DOCTOR) {
            DoctorProfile doctorProfile = new DoctorProfile();
            doctorProfile.setUser(savedUser);

            String specName = request.specializationName() != null && !request.specializationName().isBlank()
                    ? request.specializationName().trim()
                    : "General Medicine";

            Specialization spec = specializationRepository.findByNameIgnoreCase(specName)
                    .orElseGet(() -> {
                        Specialization newSpec = new Specialization(null, specName, "Medical Specialization");
                        return specializationRepository.save(newSpec);
                    });

            doctorProfile.setSpecialization(spec);
            doctorProfile.setQualifications(request.qualifications() != null && !request.qualifications().isBlank() ? request.qualifications().trim() : "MBBS");
            doctorProfile.setYearsOfExperience(request.yearsOfExperience() != null ? request.yearsOfExperience() : 5);
            doctorProfile.setConsultationFee(request.consultationFee() != null ? request.consultationFee() : new BigDecimal("500"));
            doctorProfile.setClinicName(request.clinicName() != null && !request.clinicName().isBlank() ? request.clinicName().trim() : "MediSlot Clinic");
            doctorProfile.setCity(request.city() != null && !request.city().isBlank() ? request.city().trim() : "Delhi");
            doctorProfile.setLanguages(request.languages() != null && !request.languages().isEmpty() ? request.languages() : List.of("English", "Hindi"));
            doctorProfile.setAbout(request.about() != null && !request.about().isBlank() ? request.about().trim() : "Specialist Doctor registered on MediSlot.");

            String regNum = request.registrationNumber() != null && !request.registrationNumber().isBlank()
                    ? request.registrationNumber().trim()
                    : "REG-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();

            if (doctorProfileRepository.existsByRegistrationNumberIgnoreCase(regNum)) {
                throw new BusinessException(HttpStatus.CONFLICT, "DUPLICATE_REGISTRATION", "Medical Registration Number '" + regNum + "' is already registered with another doctor account.");
            }

            doctorProfile.setRegistrationNumber(regNum);
            doctorProfile.setActive(true);

            doctorProfileRepository.save(doctorProfile);
        } else {
            PatientProfile patientProfile = new PatientProfile(savedUser);
            patientProfileRepository.save(patientProfile);
        }

        return createAuthResponse(savedUser);
    }

    public AuthResponse login(LoginRequest request) {
        return login(request, null);
    }

    @Transactional
    public AuthResponse login(LoginRequest request, String clientIp) {
        String normalizedEmail = request.email().trim().toLowerCase();

        if (bruteForceProtectionService != null && bruteForceProtectionService.isBlocked(clientIp, normalizedEmail)) {
            long remainingMins = bruteForceProtectionService.getRemainingBlockMinutes(clientIp, normalizedEmail);
            throw new BusinessException(
                    HttpStatus.TOO_MANY_REQUESTS,
                    "ACCOUNT_LOCKED",
                    "Too many failed login attempts. Account/IP is temporarily locked for security. Please try again in " + remainingMins + " minutes."
            );
        }

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(normalizedEmail, request.password())
            );
        } catch (Exception e) {
            if (bruteForceProtectionService != null) {
                bruteForceProtectionService.recordFailedAttempt(clientIp, normalizedEmail);
            }
            throw e;
        }

        User user = userRepository.findByEmailIgnoreCase(normalizedEmail)
                .orElseThrow(() -> {
                    if (bruteForceProtectionService != null) {
                        bruteForceProtectionService.recordFailedAttempt(clientIp, normalizedEmail);
                    }
                    return new UnauthorizedException("Invalid email or password.");
                });

        if (!user.isEnabled()) {
            throw new UnauthorizedException("User account is disabled.");
        }

        if (bruteForceProtectionService != null) {
            bruteForceProtectionService.resetFailedAttempts(clientIp, normalizedEmail);
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
        logout(request, null);
    }

    @Transactional
    public void logout(LogoutRequest request, String accessToken) {
        if (request != null && request.refreshToken() != null && !request.refreshToken().isBlank()) {
            String hash = jwtService.hashToken(request.refreshToken());
            refreshTokenRepository.findActiveByTokenHash(hash, Instant.now())
                    .ifPresent(token -> {
                        token.setRevokedAt(Instant.now());
                        refreshTokenRepository.save(token);
                    });
        }
        if (accessToken != null && !accessToken.isBlank()) {
            tokenBlacklistService.blacklistToken(accessToken, System.currentTimeMillis() + jwtService.getAccessExpirationMs());
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

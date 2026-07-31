package com.medislot.user.controller;

import com.medislot.common.ratelimit.RateLimited;
import com.medislot.user.dto.UpdateUserProfileRequest;
import com.medislot.user.dto.UserProfileDto;
import com.medislot.user.entity.User;
import com.medislot.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/users/me")
@Tag(name = "User Profile API", description = "User profile management and avatar endpoints")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    @Operation(summary = "Get current user profile details")
    public ResponseEntity<UserProfileDto> getMyProfile(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(userService.getProfile(currentUser));
    }

    @PatchMapping
    @RateLimited(policy = "profile-update")
    @Operation(summary = "Update current user profile")
    public ResponseEntity<UserProfileDto> updateMyProfile(
            @AuthenticationPrincipal User currentUser,
            @Valid @RequestBody UpdateUserProfileRequest request
    ) {
        return ResponseEntity.ok(userService.updateProfile(currentUser, request));
    }

    @PostMapping("/avatar")
    @RateLimited(policy = "profile-update")
    @Operation(summary = "Upload profile avatar image")
    public ResponseEntity<UserProfileDto> uploadAvatar(
            @AuthenticationPrincipal User currentUser,
            @RequestParam("file") MultipartFile file
    ) {
        return ResponseEntity.ok(userService.uploadAvatar(currentUser, file));
    }

    @DeleteMapping("/avatar")
    @Operation(summary = "Delete profile avatar image")
    public ResponseEntity<UserProfileDto> deleteAvatar(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(userService.deleteAvatar(currentUser));
    }
}

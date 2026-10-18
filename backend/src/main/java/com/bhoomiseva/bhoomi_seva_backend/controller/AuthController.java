package com.bhoomiseva.bhoomi_seva_backend.controller;

import com.bhoomiseva.bhoomi_seva_backend.dto.AuthResponse;
import com.bhoomiseva.bhoomi_seva_backend.dto.LoginRequest;
import com.bhoomiseva.bhoomi_seva_backend.dto.RegisterRequest;
import com.bhoomiseva.bhoomi_seva_backend.repository.UserRepository;
import com.bhoomiseva.bhoomi_seva_backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    // Logged-in user ki hi userId hai ya nahi
    private boolean isOwner(Authentication auth, Long userId) {
        if (auth == null || userId == null) return false;
        return userRepository.findByEmail(auth.getName())
                .map(u -> userId.equals(u.getUserId()))
                .orElse(false);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            AuthResponse response = authService.register(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> body, Authentication auth) {
        try {
            Long userId = Long.valueOf(body.get("userId"));
            if (!isOwner(auth, userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("message", "You can change only your own password"));
            }
            authService.changePassword(
                userId,
                body.get("oldPassword"),
                body.get("newPassword")
            );
            return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/update-profile")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, Object> body, Authentication auth) {
        try {
            Long userId = Long.valueOf(body.get("userId").toString());
            if (!isOwner(auth, userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("message", "You can update only your own profile"));
            }
            var user = authService.updateProfile(
                userId,
                (String) body.get("fullName"),
                (String) body.get("mobile"),
                (String) body.get("email")
            );
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/test")
    public ResponseEntity<Map<String, String>> test() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Auth API is working!");
        return ResponseEntity.ok(response);
    }
}

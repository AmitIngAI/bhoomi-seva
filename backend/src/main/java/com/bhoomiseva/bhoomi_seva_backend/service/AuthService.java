package com.bhoomiseva.bhoomi_seva_backend.service;

import com.bhoomiseva.bhoomi_seva_backend.dto.AuthResponse;
import com.bhoomiseva.bhoomi_seva_backend.dto.LoginRequest;
import com.bhoomiseva.bhoomi_seva_backend.dto.RegisterRequest;
import com.bhoomiseva.bhoomi_seva_backend.entity.User;
import com.bhoomiseva.bhoomi_seva_backend.repository.UserRepository;
import com.bhoomiseva.bhoomi_seva_backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }
        if (userRepository.existsByMobile(request.getMobile())) {
            throw new RuntimeException("Mobile number already registered");
        }

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setMobile(request.getMobile());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(User.Role.CITIZEN);
        user.setStatus(User.Status.ACTIVE); // ✅ Default active

        User savedUser = userRepository.save(user);

        String token = jwtUtil.generateToken(
                savedUser.getEmail(),
                savedUser.getRole().name(),
                savedUser.getUserId()
        );

        return new AuthResponse(
                token, savedUser.getUserId(), savedUser.getFullName(),
                savedUser.getEmail(), savedUser.getMobile(),
                savedUser.getRole().name(), "Registration successful",
                savedUser.getCreatedAt()
        );
    }

    public AuthResponse login(LoginRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getIdentifier());
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByMobile(request.getIdentifier());
        }

        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found. Please register first.");
        }

        User user = userOpt.get();

        // ✅ NEW - Check if blocked
        if (user.getStatus() == User.Status.BLOCKED) {
            throw new RuntimeException(
                "🚫 Your account has been blocked by admin. Please contact support at 1800-123-4567."
            );
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        String requestedRole = request.getRole().toUpperCase();
        if (!user.getRole().name().equals(requestedRole)) {
            throw new RuntimeException(
                "You are registered as " + user.getRole().name() +
                ". Please select the correct role."
            );
        }

        String token = jwtUtil.generateToken(
                user.getEmail(),
                user.getRole().name(),
                user.getUserId()
        );

        return new AuthResponse(
                token, user.getUserId(), user.getFullName(),
                user.getEmail(), user.getMobile(),
                user.getRole().name(), "Login successful",
                user.getCreatedAt()
        );
    }

    public void changePassword(Long userId, String oldPassword, String newPassword) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        if (newPassword.length() < 6) {
            throw new RuntimeException("New password must be at least 6 characters");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    public User updateProfile(Long userId, String fullName, String mobile, String email) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

        if (email != null && !email.equals(user.getEmail())) {
            if (userRepository.existsByEmail(email)) {
                throw new RuntimeException("Email already in use");
            }
            user.setEmail(email);
        }

        if (mobile != null && !mobile.equals(user.getMobile())) {
            if (userRepository.existsByMobile(mobile)) {
                throw new RuntimeException("Mobile number already in use");
            }
            user.setMobile(mobile);
        }

        if (fullName != null && !fullName.isEmpty()) {
            user.setFullName(fullName);
        }

        return userRepository.save(user);
    }
}
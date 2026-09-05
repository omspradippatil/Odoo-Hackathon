package com.devflow.controller;

import com.devflow.dto.AuthRequest;
import com.devflow.dto.AuthResponse;
import com.devflow.entity.Enums;
import com.devflow.entity.User;
import com.devflow.repository.UserRepository;
import com.devflow.security.JwtUtil;
import com.devflow.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest request) {
        if (userRepository.findByEmail(request.email()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email already registered"));
        }
        User user = new User();
        user.setEmail(request.email());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setRole(request.role() != null ? request.role() : Enums.Role.SALES_REP);
        user.setMode(request.mode() != null ? request.mode() : Enums.Mode.LOCAL);
        user.setTier(Enums.Tier.BRONZE);
        user.setTrustScore(0.0);
        user.setTotalTransactions(0);
        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail());
        return ResponseEntity.ok(Map.of(
                "token", token,
                "email", user.getEmail(),
                "role", user.getRole(),
                "mode", user.getMode()
        ));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(org.springframework.security.core.Authentication auth) {
        var user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        java.util.HashMap<String, Object> result = new java.util.HashMap<>();
        result.put("id", user.getId());
        result.put("email", user.getEmail());
        result.put("role", user.getRole());
        result.put("mode", user.getMode());
        result.put("tier", user.getTier());
        result.put("trustScore", user.getTrustScore());
        result.put("totalTransactions", user.getTotalTransactions());
        return ResponseEntity.ok(result);
    }

    public record SignupRequest(String email, String password, Enums.Role role, Enums.Mode mode) {}
}

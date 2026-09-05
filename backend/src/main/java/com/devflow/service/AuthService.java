package com.devflow.service;

import com.devflow.dto.AuthRequest;
import com.devflow.dto.AuthResponse;
import com.devflow.entity.User;
import com.devflow.exception.ResourceNotFoundException;
import com.devflow.repository.UserRepository;
import com.devflow.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public AuthResponse login(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return toResponse(user, jwtUtil.generateToken(user.getEmail()));
    }

    public AuthResponse toResponse(User user, String token) {
        return new AuthResponse(
                token,
                user.getId(),
                user.getEmail(),
                user.getDisplayName(),
                user.getRole(),
                user.getMode(),
                user.getTier(),
                user.getTrustScore(),
                user.getTotalTransactions()
        );
    }
}

package com.devflow.controller;

import com.devflow.dto.AuthRequest;
import com.devflow.dto.AuthResponse;
import com.devflow.entity.Enums;
import com.devflow.entity.User;
import com.devflow.exception.ResourceNotFoundException;
import com.devflow.repository.UserRepository;
import com.devflow.security.JwtUtil;
import com.devflow.service.AuthService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Set;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    /**
     * Roles a visitor may self-assign at signup. Internal staff roles (ADMIN, SALES_REP,
     * SALES_MANAGER, FINANCE) are deliberately excluded — otherwise anyone could register
     * themselves as an approver and sign off their own discounts.
     */
    private static final Set<Enums.Role> SELF_SIGNUP_ROLES =
            Set.of(Enums.Role.CUSTOMER, Enums.Role.BUYER, Enums.Role.SELLER, Enums.Role.VENDOR);

    private final AuthService authService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@Valid @RequestBody SignupRequest request) {
        if (userRepository.findByEmail(request.email()).isPresent()) {
            throw new IllegalArgumentException("Email already registered");
        }

        Enums.Role requested = request.role() != null ? request.role() : Enums.Role.BUYER;
        if (!SELF_SIGNUP_ROLES.contains(requested)) {
            throw new IllegalArgumentException(
                    "Role " + requested + " cannot be self-assigned. Staff accounts are created by an administrator.");
        }

        User user = new User();
        user.setEmail(request.email());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setDisplayName(request.displayName() != null ? request.displayName() : request.email().split("@")[0]);
        user.setCompanyName(request.companyName());
        user.setPhone(request.phone());
        user.setCity(request.city());
        user.setRole(requested);
        user.setMode(request.mode() != null ? request.mode()
                : (requested == Enums.Role.CUSTOMER || requested == Enums.Role.VENDOR)
                    ? Enums.Mode.PROFESSIONAL : Enums.Mode.LOCAL);
        user.setTier(Enums.Tier.BRONZE);
        user.setTrustScore(0.0);
        user.setTotalTransactions(0);
        user.setCreatedAt(LocalDateTime.now());
        userRepository.save(user);

        return ResponseEntity.ok(authService.toResponse(user, jwtUtil.generateToken(user.getEmail())));
    }

    /** Staff accounts can only be minted by an existing admin. */
    @PostMapping("/staff")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AuthResponse> createStaff(@Valid @RequestBody SignupRequest request) {
        if (userRepository.findByEmail(request.email()).isPresent()) {
            throw new IllegalArgumentException("Email already registered");
        }
        User user = new User();
        user.setEmail(request.email());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setDisplayName(request.displayName() != null ? request.displayName() : request.email().split("@")[0]);
        user.setRole(request.role() != null ? request.role() : Enums.Role.SALES_REP);
        user.setMode(Enums.Mode.PROFESSIONAL);
        user.setTier(Enums.Tier.BRONZE);
        user.setTrustScore(0.0);
        user.setTotalTransactions(0);
        user.setCreatedAt(LocalDateTime.now());
        userRepository.save(user);
        return ResponseEntity.ok(authService.toResponse(user, jwtUtil.generateToken(user.getEmail())));
    }

    @GetMapping("/me")
    public ResponseEntity<AuthResponse> me(Authentication auth) {
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return ResponseEntity.ok(authService.toResponse(user, null));
    }

    public record SignupRequest(
            @Email(message = "A valid email is required") @NotBlank String email,
            @NotBlank @Size(min = 6, message = "Password must be at least 6 characters") String password,
            String displayName,
            String companyName,
            String phone,
            String city,
            Enums.Role role,
            Enums.Mode mode) {}
}

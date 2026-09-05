package com.devflow.controller;

import com.devflow.entity.Enums;
import com.devflow.entity.Payment;
import com.devflow.entity.Quotation;
import com.devflow.entity.AuditLog;
import com.devflow.repository.PaymentRepository;
import com.devflow.repository.QuotationRepository;
import com.devflow.repository.UserRepository;
import com.devflow.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentRepository paymentRepository;
    private final QuotationRepository quotationRepository;
    private final UserRepository userRepository;
    private final AuditLogRepository auditLogRepository;

    /**
     * POST /api/payments/initiate — initiate mock UPI payment
     * Body: { quotationId, buyerId, sellerId, amount }
     */
    @PostMapping("/initiate")
    public ResponseEntity<?> initiatePayment(@RequestBody PaymentInitiateRequest request, Authentication auth) {
        Payment payment = new Payment();

        if (request.quotationId() != null) {
            Quotation q = quotationRepository.findById(request.quotationId()).orElseThrow();
            payment.setQuotation(q);
        }
        if (request.buyerId() != null) {
            payment.setBuyer(userRepository.findById(request.buyerId()).orElseThrow());
        }
        if (request.sellerId() != null) {
            payment.setSeller(userRepository.findById(request.sellerId()).orElseThrow());
        }
        payment.setAmount(request.amount());
        payment.setStatus(Enums.PaymentStatus.HELD);
        payment.setEscrowReleaseAt(LocalDateTime.now().plusHours(48)); // auto-release after 48h

        Payment saved = paymentRepository.save(payment);

        // Mock UPI URL (demo)
        String mockUpiUrl = String.format(
                "upi://pay?pa=devflow@ybl&pn=DevFlow&am=%.2f&tr=%s&tn=DEVFLOWOrder%d",
                request.amount(), UUID.randomUUID().toString().substring(0, 8), saved.getId()
        );

        return ResponseEntity.ok(Map.of(
                "paymentId", saved.getId(),
                "amount", saved.getAmount(),
                "status", saved.getStatus(),
                "mockUpiUrl", mockUpiUrl,
                "escrowNote", "Amount will be held by DEV FLOW until delivery is confirmed"
        ));
    }

    /**
     * POST /api/payments/{id}/confirm — mock UPI pay button clicked — auto-succeeds
     */
    @PostMapping("/{id}/confirm")
    public ResponseEntity<?> confirmPayment(@PathVariable Long id) {
        Payment p = paymentRepository.findById(id).orElseThrow();
        p.setStatus(Enums.PaymentStatus.RELEASED);
        p.setPlatformFee(p.getAmount() * 0.02); // 2% platform fee
        paymentRepository.save(p);

        // Audit log
        AuditLog log = new AuditLog();
        log.setEntityType("PAYMENT");
        log.setEntityId(id.toString());
        log.setAction("CONFIRMED_AND_RELEASED");
        log.setPerformedBy("SYSTEM_MOCK_UPI");
        log.setMetadata(String.format("Amount: %.2f, PlatformFee: %.2f", p.getAmount(), p.getPlatformFee()));
        log.setTimestamp(LocalDateTime.now());
        auditLogRepository.save(log);

        return ResponseEntity.ok(Map.of(
                "paymentId", p.getId(),
                "status", "RELEASED",
                "amountPaid", p.getAmount(),
                "platformFee", p.getPlatformFee(),
                "sellerReceives", p.getAmount() - p.getPlatformFee(),
                "message", "Payment confirmed! ✅ Funds released to seller."
        ));
    }

    /**
     * GET /api/payments/{id} — get payment status
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getPayment(@PathVariable Long id) {
        return paymentRepository.findById(id)
                .map(p -> ResponseEntity.ok(Map.of(
                        "id", p.getId(),
                        "amount", p.getAmount(),
                        "status", p.getStatus(),
                        "platformFee", p.getPlatformFee() != null ? p.getPlatformFee() : 0.0,
                        "escrowReleaseAt", p.getEscrowReleaseAt()
                )))
                .orElse(ResponseEntity.notFound().build());
    }

    public record PaymentInitiateRequest(Long quotationId, Long buyerId, Long sellerId, Double amount) {}
}

package com.devflow.controller;

import com.devflow.entity.Payment;
import com.devflow.repository.PaymentRepository;
import com.devflow.service.FileStorageService;
import com.devflow.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;
    private final PaymentRepository paymentRepository;
    private final FileStorageService fileStorageService;

    /** Creates the payment intent and returns a mock UPI deep link for the modal. */
    @PostMapping("/initiate")
    public ResponseEntity<Map<String, Object>> initiate(@RequestBody InitiateRequest request, Authentication auth) {
        Payment saved = paymentService.initiate(
                request.quotationId(), request.buyerId(), request.sellerId(), request.amount(), actor(auth));

        String upiUrl = String.format("upi://pay?pa=devflow@ybl&pn=DEV%%20FLOW&am=%.2f&tr=%s&cu=INR",
                saved.getAmount(), saved.getUpiRef());

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("paymentId", saved.getId());
        body.put("amount", saved.getAmount());
        body.put("status", saved.getStatus());
        body.put("upiRef", saved.getUpiRef());
        body.put("mockUpiUrl", upiUrl);
        body.put("escrowNote", "DEV FLOW holds this amount until delivery is confirmed");
        return ResponseEntity.ok(body);
    }

    /** Mock UPI success — captures the funds into escrow (does NOT pay the seller). */
    @PostMapping("/{id}/pay")
    public ResponseEntity<Map<String, Object>> pay(@PathVariable Long id, Authentication auth) {
        Payment p = paymentService.captureToEscrow(id, actor(auth));
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("paymentId", p.getId());
        body.put("status", p.getStatus());
        body.put("amountHeld", p.getAmount());
        body.put("escrowReleaseAt", p.getEscrowReleaseAt());
        body.put("message", "Payment successful. Funds are held in escrow until you confirm delivery.");
        return ResponseEntity.ok(body);
    }

    /**
     * Buyer confirms delivery, optionally attaching a proof photo.
     * This is the step that releases escrow to the seller.
     */
    @PostMapping(value = "/{id}/confirm-delivery", consumes = {"multipart/form-data"})
    public ResponseEntity<Map<String, Object>> confirmDeliveryWithProof(
            @PathVariable Long id,
            @RequestPart(value = "proof", required = false) MultipartFile proof,
            @RequestParam(value = "uploadedById", required = false) Long uploadedById,
            Authentication auth) {

        String imageUrl = (proof != null && !proof.isEmpty()) ? fileStorageService.store(proof) : null;
        Payment p = paymentService.confirmDelivery(id, imageUrl, uploadedById, actor(auth));
        return ResponseEntity.ok(releaseBody(p, imageUrl));
    }

    /** JSON variant for clients that have already uploaded, or are confirming without a photo. */
    @PostMapping("/{id}/confirm-delivery")
    public ResponseEntity<Map<String, Object>> confirmDelivery(
            @PathVariable Long id,
            @RequestBody(required = false) ConfirmDeliveryRequest request,
            Authentication auth) {
        String imageUrl = request != null ? request.imageUrl() : null;
        Long uploadedById = request != null ? request.uploadedById() : null;
        Payment p = paymentService.confirmDelivery(id, imageUrl, uploadedById, actor(auth));
        return ResponseEntity.ok(releaseBody(p, imageUrl));
    }

    @PostMapping("/{id}/dispute")
    public ResponseEntity<Map<String, Object>> dispute(
            @PathVariable Long id, @RequestBody DisputeRequest request, Authentication auth) {
        Payment p = paymentService.dispute(id, request.reason(), actor(auth));
        return ResponseEntity.ok(Map.of(
                "paymentId", p.getId(),
                "status", p.getStatus(),
                "message", "Dispute raised. Funds stay in escrow pending review."));
    }

    @PostMapping("/{id}/refund")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> refund(
            @PathVariable Long id, @RequestBody DisputeRequest request, Authentication auth) {
        Payment p = paymentService.refund(id, request.reason(), actor(auth));
        return ResponseEntity.ok(Map.of(
                "paymentId", p.getId(),
                "status", p.getStatus(),
                "message", "Refunded to buyer."));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> get(@PathVariable Long id) {
        Payment p = paymentService.require(id);
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("id", p.getId());
        body.put("amount", p.getAmount());
        body.put("status", p.getStatus());
        body.put("platformFee", p.getPlatformFee() != null ? p.getPlatformFee() : 0.0);
        body.put("sellerPayout", paymentService.sellerPayout(p));
        body.put("upiRef", p.getUpiRef());
        body.put("createdAt", p.getCreatedAt());
        body.put("escrowReleaseAt", p.getEscrowReleaseAt());
        body.put("releasedAt", p.getReleasedAt());
        body.put("buyer", p.getBuyer() != null ? p.getBuyer().getDisplayName() : null);
        body.put("seller", p.getSeller() != null ? p.getSeller().getDisplayName() : null);
        body.put("proofs", paymentService.proofsFor(id).stream().map(dp -> Map.of(
                "imageUrl", dp.getImageUrl() != null ? dp.getImageUrl() : "",
                "timestamp", String.valueOf(dp.getTimestamp()))).toList());
        return ResponseEntity.ok(body);
    }

    @GetMapping
    public ResponseEntity<List<Payment>> list() {
        return ResponseEntity.ok(paymentRepository.findAll());
    }

    private Map<String, Object> releaseBody(Payment p, String imageUrl) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("paymentId", p.getId());
        body.put("status", p.getStatus());
        body.put("amountPaid", p.getAmount());
        body.put("platformFee", p.getPlatformFee());
        body.put("sellerPayout", paymentService.sellerPayout(p));
        body.put("proofImageUrl", imageUrl);
        body.put("message", "Delivery confirmed. Escrow released to seller.");
        return body;
    }

    private String actor(Authentication auth) {
        return auth != null ? auth.getName() : "SYSTEM";
    }

    public record InitiateRequest(Long quotationId, Long buyerId, Long sellerId, Double amount) {}
    public record ConfirmDeliveryRequest(String imageUrl, Long uploadedById) {}
    public record DisputeRequest(String reason) {}
}

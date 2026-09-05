package com.devflow.service;

import com.devflow.entity.DeliveryProof;
import com.devflow.entity.Enums;
import com.devflow.entity.Payment;
import com.devflow.entity.User;
import com.devflow.exception.ResourceNotFoundException;
import com.devflow.repository.DeliveryProofRepository;
import com.devflow.repository.PaymentRepository;
import com.devflow.repository.QuotationRepository;
import com.devflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Escrow state machine for the local marketplace.
 *
 *   PENDING --(mock UPI succeeds)--> HELD --(delivery confirmed)--> RELEASED
 *                                     |
 *                                     +--(buyer raises issue)--> DISPUTED --> RELEASED | REFUNDED
 *
 * Money is only ever moved by an explicit transition; paying and releasing are
 * deliberately two separate steps, which is the whole point of holding escrow.
 */
@Service
@RequiredArgsConstructor
public class PaymentService {

    /** Platform commission taken from the seller's payout on release. */
    public static final double PLATFORM_FEE_RATE = 0.02;

    /** Escrow auto-releases this long after payment if nobody confirms or disputes. */
    private static final int ESCROW_WINDOW_HOURS = 48;

    private final PaymentRepository paymentRepository;
    private final DeliveryProofRepository deliveryProofRepository;
    private final QuotationRepository quotationRepository;
    private final UserRepository userRepository;
    private final AuditService auditService;

    @Transactional
    public Payment initiate(Long quotationId, Long buyerId, Long sellerId, Double amount, String actor) {
        if (amount == null || amount <= 0) {
            throw new IllegalArgumentException("Payment amount must be greater than zero");
        }
        Payment payment = new Payment();
        if (quotationId != null) {
            payment.setQuotation(quotationRepository.findById(quotationId)
                    .orElseThrow(() -> new ResourceNotFoundException("Quotation " + quotationId + " not found")));
        }
        if (buyerId != null) payment.setBuyer(requireUser(buyerId));
        if (sellerId != null) payment.setSeller(requireUser(sellerId));

        payment.setAmount(amount);
        payment.setStatus(Enums.PaymentStatus.PENDING);
        payment.setCreatedAt(LocalDateTime.now());
        payment.setUpiRef("DF" + UUID.randomUUID().toString().replace("-", "").substring(0, 10).toUpperCase());

        Payment saved = paymentRepository.save(payment);
        auditService.record("PAYMENT", saved.getId(), "INITIATED", actor,
                String.format("Amount: %.2f, ref: %s", amount, saved.getUpiRef()));
        return saved;
    }

    /** The mock UPI step: funds are captured and held by the platform, not paid out. */
    @Transactional
    public Payment captureToEscrow(Long paymentId, String actor) {
        Payment payment = require(paymentId);
        if (payment.getStatus() != Enums.PaymentStatus.PENDING) {
            throw new IllegalStateException(
                    "Payment is already " + payment.getStatus() + " and cannot be paid again");
        }
        payment.setStatus(Enums.PaymentStatus.HELD);
        payment.setEscrowReleaseAt(LocalDateTime.now().plusHours(ESCROW_WINDOW_HOURS));
        Payment saved = paymentRepository.save(payment);

        auditService.record("PAYMENT", paymentId, "CAPTURED_TO_ESCROW", actor,
                String.format("%.2f held in escrow until %s", saved.getAmount(), saved.getEscrowReleaseAt()));
        return saved;
    }

    /**
     * Records proof of delivery and, with it, releases the escrow to the seller.
     * Uploading proof is what makes the money move.
     */
    @Transactional
    public Payment confirmDelivery(Long paymentId, String imageUrl, Long uploadedById, String actor) {
        Payment payment = require(paymentId);
        if (payment.getStatus() != Enums.PaymentStatus.HELD) {
            throw new IllegalStateException(
                    "Escrow can only be released from HELD; payment is currently " + payment.getStatus());
        }

        DeliveryProof proof = new DeliveryProof();
        proof.setPayment(payment);
        proof.setImageUrl(imageUrl);
        proof.setTimestamp(LocalDateTime.now());
        if (uploadedById != null) proof.setUploadedBy(requireUser(uploadedById));
        deliveryProofRepository.save(proof);

        auditService.record("PAYMENT", paymentId, "DELIVERY_PROOF_UPLOADED", actor, imageUrl);
        return release(payment, actor, "Delivery confirmed by buyer");
    }

    @Transactional
    public Payment releaseById(Long paymentId, String actor, String reason) {
        Payment payment = require(paymentId);
        if (payment.getStatus() != Enums.PaymentStatus.HELD) {
            throw new IllegalStateException(
                    "Escrow can only be released from HELD; payment is currently " + payment.getStatus());
        }
        return release(payment, actor, reason);
    }

    private Payment release(Payment payment, String actor, String reason) {
        double fee = round2(payment.getAmount() * PLATFORM_FEE_RATE);
        payment.setPlatformFee(fee);
        payment.setStatus(Enums.PaymentStatus.RELEASED);
        payment.setReleasedAt(LocalDateTime.now());
        Payment saved = paymentRepository.save(payment);

        // A completed transaction counts toward the seller's trust record.
        User seller = saved.getSeller();
        if (seller != null) {
            seller.setTotalTransactions(
                    (seller.getTotalTransactions() != null ? seller.getTotalTransactions() : 0) + 1);
            userRepository.save(seller);
        }

        auditService.record("PAYMENT", saved.getId(), "RELEASED_TO_SELLER", actor,
                String.format("%s. Gross %.2f, fee %.2f, payout %.2f",
                        reason, saved.getAmount(), fee, saved.getAmount() - fee));
        return saved;
    }

    @Transactional
    public Payment dispute(Long paymentId, String reason, String actor) {
        Payment payment = require(paymentId);
        if (payment.getStatus() != Enums.PaymentStatus.HELD) {
            throw new IllegalStateException("Only escrow that is still HELD can be disputed");
        }
        payment.setStatus(Enums.PaymentStatus.DISPUTED);
        payment.setDisputeReason(reason);
        Payment saved = paymentRepository.save(payment);
        auditService.record("PAYMENT", paymentId, "DISPUTED", actor, reason);
        return saved;
    }

    @Transactional
    public Payment refund(Long paymentId, String reason, String actor) {
        Payment payment = require(paymentId);
        if (payment.getStatus() != Enums.PaymentStatus.HELD
                && payment.getStatus() != Enums.PaymentStatus.DISPUTED) {
            throw new IllegalStateException("Only held or disputed escrow can be refunded");
        }
        payment.setStatus(Enums.PaymentStatus.REFUNDED);
        payment.setReleasedAt(LocalDateTime.now());
        Payment saved = paymentRepository.save(payment);
        auditService.record("PAYMENT", paymentId, "REFUNDED_TO_BUYER", actor, reason);
        return saved;
    }

    public Payment require(Long paymentId) {
        return paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment " + paymentId + " not found"));
    }

    public List<DeliveryProof> proofsFor(Long paymentId) {
        return deliveryProofRepository.findByPaymentId(paymentId);
    }

    public double sellerPayout(Payment payment) {
        double fee = payment.getPlatformFee() != null ? payment.getPlatformFee() : 0.0;
        return round2((payment.getAmount() != null ? payment.getAmount() : 0.0) - fee);
    }

    private User requireUser(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User " + id + " not found"));
    }

    private static double round2(double value) {
        return Math.round(value * 100.0) / 100.0;
    }
}

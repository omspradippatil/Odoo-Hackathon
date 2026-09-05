package com.devflow.service;
import com.devflow.entity.Enums;
import com.devflow.entity.Payment;
import com.devflow.repository.PaymentRepository;
import com.devflow.dto.PaymentInitiateResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {
    private final PaymentRepository paymentRepository;
    
    public PaymentInitiateResponse initiatePayment(Payment payment) {
        payment.setStatus(Enums.PaymentStatus.HELD);
        Payment saved = paymentRepository.save(payment);
        return new PaymentInitiateResponse(saved.getId(), "upi://pay?pa=devflow@ybl&pn=DevFlow&am=" + payment.getAmount() + "&tr=" + UUID.randomUUID().toString());
    }
    
    public Payment confirmPayment(Long paymentId) {
        Payment p = paymentRepository.findById(paymentId).orElseThrow();
        p.setStatus(Enums.PaymentStatus.RELEASED);
        p.setPlatformFee(p.getAmount() * 0.02);
        // update seller balance omitted for brevity
        return paymentRepository.save(p);
    }
}

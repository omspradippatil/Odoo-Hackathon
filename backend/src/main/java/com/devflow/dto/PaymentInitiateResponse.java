package com.devflow.dto;
import lombok.Data;
import lombok.AllArgsConstructor;

@Data @AllArgsConstructor
public class PaymentInitiateResponse {
    private Long paymentId;
    private String mockUpiUrl;
}

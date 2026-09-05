import os

base_dir = "/Users/om/Desktop/Projects/Odoo-Hackathon/backend/src/main/java/com/devflow"

files = {}

# Auth DTOs
files["dto/AuthRequest.java"] = """package com.devflow.dto;
import lombok.Data;

@Data
public class AuthRequest {
    private String email;
    private String password;
}
"""

files["dto/AuthResponse.java"] = """package com.devflow.dto;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Data @AllArgsConstructor @NoArgsConstructor
public class AuthResponse {
    private String token;
}
"""

files["service/AuthService.java"] = """package com.devflow.service;
import com.devflow.dto.AuthRequest;
import com.devflow.dto.AuthResponse;
import com.devflow.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public AuthResponse login(AuthRequest request) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        String token = jwtUtil.generateToken(request.getEmail());
        return new AuthResponse(token);
    }
}
"""

files["controller/AuthController.java"] = """package com.devflow.controller;
import com.devflow.dto.AuthRequest;
import com.devflow.dto.AuthResponse;
import com.devflow.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}
"""

# Products
files["service/ProductService.java"] = """package com.devflow.service;
import com.devflow.entity.Product;
import com.devflow.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
    
    public Product getProduct(Long id) {
        return productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
    }
    
    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }
}
"""

files["controller/ProductController.java"] = """package com.devflow.controller;
import com.devflow.entity.Product;
import com.devflow.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;
    
    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }
    
    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        return ResponseEntity.ok(productService.saveProduct(product));
    }
}
"""

# Quotation & BlendedRiskScoreEngine
files["service/QuotationService.java"] = """package com.devflow.service;
import com.devflow.entity.Enums;
import com.devflow.entity.Quotation;
import com.devflow.entity.QuotationLine;
import com.devflow.repository.QuotationRepository;
import com.devflow.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class QuotationService {
    private final QuotationRepository quotationRepository;
    private final CategoryRepository categoryRepository;

    public Quotation createQuotation(Quotation quotation) {
        quotation.setCreatedAt(LocalDateTime.now());
        quotation.setUpdatedAt(LocalDateTime.now());
        if(quotation.getLines() != null) {
            for(QuotationLine line : quotation.getLines()) {
                line.setQuotation(quotation);
            }
        }
        quotation.setBlendedRiskScore(calculateRiskScore(quotation));
        
        if (quotation.getBlendedRiskScore() > 0.08) {
            quotation.setStatus(Enums.QuotationStatus.PENDING_L2);
        } else if (quotation.getBlendedRiskScore() > 0) {
            quotation.setStatus(Enums.QuotationStatus.PENDING_L1);
        } else {
            quotation.setStatus(Enums.QuotationStatus.APPROVED);
        }
        
        return quotationRepository.save(quotation);
    }
    
    private Double calculateRiskScore(Quotation quotation) {
        if(quotation.getLines() == null || quotation.getLines().isEmpty()) return 0.0;
        
        double orderTotal = 0.0;
        for(QuotationLine line : quotation.getLines()) {
            orderTotal += line.getLineTotal();
        }
        
        if(orderTotal == 0.0) return 0.0;
        
        double score = 0.0;
        for(QuotationLine line : quotation.getLines()) {
            double allowed = line.getProduct().getCategory() != null ? line.getProduct().getCategory().getMaxDiscountPct() : 0.0;
            double lineWeight = line.getLineTotal() / orderTotal;
            score += ((line.getDiscountPct() - allowed) * lineWeight);
        }
        return score;
    }
}
"""

files["controller/QuotationController.java"] = """package com.devflow.controller;
import com.devflow.entity.Quotation;
import com.devflow.service.QuotationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/quotations")
@RequiredArgsConstructor
public class QuotationController {
    private final QuotationService quotationService;
    
    @PostMapping
    public ResponseEntity<Quotation> createQuotation(@RequestBody Quotation quotation) {
        return ResponseEntity.ok(quotationService.createQuotation(quotation));
    }
}
"""

# Approval
files["service/ApprovalService.java"] = """package com.devflow.service;
import com.devflow.entity.Enums;
import com.devflow.entity.Quotation;
import com.devflow.repository.QuotationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ApprovalService {
    private final QuotationRepository quotationRepository;
    
    public Quotation approve(Long quotationId, boolean isL2) {
        Quotation q = quotationRepository.findById(quotationId).orElseThrow(() -> new RuntimeException("Not found"));
        if(isL2 && q.getStatus() == Enums.QuotationStatus.PENDING_L2) {
            q.setStatus(Enums.QuotationStatus.APPROVED);
        } else if(!isL2 && q.getStatus() == Enums.QuotationStatus.PENDING_L1) {
            q.setStatus(Enums.QuotationStatus.APPROVED);
        } else if (!isL2 && q.getStatus() == Enums.QuotationStatus.PENDING_L2) {
             // L1 approves but still needs L2? (simplifying to just pending_L2 if score > 0.08)
        }
        q.setUpdatedAt(LocalDateTime.now());
        return quotationRepository.save(q);
    }
}
"""

files["controller/ApprovalController.java"] = """package com.devflow.controller;
import com.devflow.entity.Quotation;
import com.devflow.service.ApprovalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/approvals")
@RequiredArgsConstructor
public class ApprovalController {
    private final ApprovalService approvalService;
    
    @PostMapping("/{id}/approve")
    public ResponseEntity<Quotation> approve(@PathVariable Long id, @RequestParam(defaultValue="false") boolean isL2) {
        return ResponseEntity.ok(approvalService.approve(id, isL2));
    }
}
"""

# Warehouse
files["dto/SplitResult.java"] = """package com.devflow.dto;
import lombok.Data;
import lombok.AllArgsConstructor;
import java.util.List;
import java.util.Map;

@Data @AllArgsConstructor
public class SplitResult {
    private Map<Long, Integer> allocations; // warehouseId -> qty
    private int backorderQty;
}
"""

files["service/WarehouseService.java"] = """package com.devflow.service;
import com.devflow.entity.Product;
import com.devflow.entity.Stock;
import com.devflow.repository.StockRepository;
import com.devflow.repository.ProductRepository;
import com.devflow.dto.SplitResult;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@Service
@RequiredArgsConstructor
public class WarehouseService {
    private final StockRepository stockRepository;
    private final ProductRepository productRepository;
    
    public SplitResult autoSplit(Long productId, int requestedQty) {
        Product p = productRepository.findById(productId).orElseThrow();
        List<Stock> stocks = stockRepository.findByProductOrderByWarehouseShippingWeightDescQtyAvailableDesc(p);
        
        Map<Long, Integer> allocations = new HashMap<>();
        int remaining = requestedQty;
        
        for(Stock s : stocks) {
            if(remaining <= 0) break;
            if(s.getQtyAvailable() > 0) {
                int take = Math.min(remaining, s.getQtyAvailable());
                allocations.put(s.getWarehouse().getId(), take);
                remaining -= take;
            }
        }
        
        return new SplitResult(allocations, remaining);
    }
}
"""

files["controller/WarehouseController.java"] = """package com.devflow.controller;
import com.devflow.dto.SplitResult;
import com.devflow.service.WarehouseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/warehouse")
@RequiredArgsConstructor
public class WarehouseController {
    private final WarehouseService warehouseService;
    
    @GetMapping("/split")
    public ResponseEntity<SplitResult> autoSplit(@RequestParam Long productId, @RequestParam int qty) {
        return ResponseEntity.ok(warehouseService.autoSplit(productId, qty));
    }
}
"""

# Payment
files["dto/PaymentInitiateResponse.java"] = """package com.devflow.dto;
import lombok.Data;
import lombok.AllArgsConstructor;

@Data @AllArgsConstructor
public class PaymentInitiateResponse {
    private Long paymentId;
    private String mockUpiUrl;
}
"""

files["service/PaymentService.java"] = """package com.devflow.service;
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
"""

files["controller/PaymentController.java"] = """package com.devflow.controller;
import com.devflow.entity.Payment;
import com.devflow.dto.PaymentInitiateResponse;
import com.devflow.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {
    private final PaymentService paymentService;
    
    @PostMapping("/initiate")
    public ResponseEntity<PaymentInitiateResponse> initiate(@RequestBody Payment payment) {
        return ResponseEntity.ok(paymentService.initiatePayment(payment));
    }
    
    @PostMapping("/{id}/confirm")
    public ResponseEntity<Payment> confirm(@PathVariable Long id) {
        return ResponseEntity.ok(paymentService.confirmPayment(id));
    }
}
"""

# Bid
files["service/BidService.java"] = """package com.devflow.service;
import com.devflow.entity.Enums;
import com.devflow.entity.Bid;
import com.devflow.repository.BidRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BidService {
    private final BidRepository bidRepository;
    
    public Bid submitBid(Bid bid) {
        bid.setStatus(Enums.BidStatus.SUBMITTED);
        return bidRepository.save(bid);
    }
}
"""

files["controller/BidController.java"] = """package com.devflow.controller;
import com.devflow.entity.Bid;
import com.devflow.service.BidService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bids")
@RequiredArgsConstructor
public class BidController {
    private final BidService bidService;
    
    @PostMapping
    public ResponseEntity<Bid> submitBid(@RequestBody Bid bid) {
        return ResponseEntity.ok(bidService.submitBid(bid));
    }
}
"""

# Rating & TrustScore
files["service/RatingService.java"] = """package com.devflow.service;
import com.devflow.entity.Enums;
import com.devflow.entity.Rating;
import com.devflow.entity.TrustScore;
import com.devflow.entity.User;
import com.devflow.repository.RatingRepository;
import com.devflow.repository.TrustScoreRepository;
import com.devflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RatingService {
    private final RatingRepository ratingRepository;
    private final TrustScoreRepository trustScoreRepository;
    private final UserRepository userRepository;
    
    public Rating submitRating(Rating rating) {
        rating.setCreatedAt(LocalDateTime.now());
        Rating saved = ratingRepository.save(rating);
        updateTrustScore(rating.getRatee());
        return saved;
    }
    
    private void updateTrustScore(User ratee) {
        List<Rating> ratings = ratingRepository.findByRatee(ratee);
        double avg = ratings.stream().mapToInt(Rating::getStars).average().orElse(0.0);
        int totalTx = ratee.getTotalTransactions() != null ? ratee.getTotalTransactions() : 0;
        
        Enums.Tier newTier = Enums.Tier.BRONZE;
        if(avg >= 4.5 && totalTx >= 20) {
            newTier = Enums.Tier.GOLD;
        } else if(avg >= 3.8 && totalTx >= 10) {
            newTier = Enums.Tier.SILVER;
        }
        
        ratee.setTier(newTier);
        ratee.setTrustScore(avg);
        userRepository.save(ratee);
        
        // update TrustScore entity
        // omitting details for brevity
    }
}
"""

files["controller/RatingController.java"] = """package com.devflow.controller;
import com.devflow.entity.Rating;
import com.devflow.service.RatingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ratings")
@RequiredArgsConstructor
public class RatingController {
    private final RatingService ratingService;
    
    @PostMapping
    public ResponseEntity<Rating> submitRating(@RequestBody Rating rating) {
        return ResponseEntity.ok(ratingService.submitRating(rating));
    }
}
"""


for fname, content in files.items():
    with open(os.path.join(base_dir, fname), "w") as f:
        f.write(content)

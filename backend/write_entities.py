import os

base_dir = "/Users/om/Desktop/Projects/Odoo-Hackathon/backend/src/main/java/com/devflow"
dirs = ["entity", "repository", "security", "controller", "service", "exception", "dto", "seeder", "config"]

for d in dirs:
    os.makedirs(os.path.join(base_dir, d), exist_ok=True)

files = {}

files["DevFlowApplication.java"] = """package com.devflow;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
@SpringBootApplication
public class DevFlowApplication {
    public static void main(String[] args) {
        SpringApplication.run(DevFlowApplication.class, args);
    }
}
"""

files["entity/Enums.java"] = """package com.devflow.entity;
public class Enums {
    public enum Role { ADMIN, SALES_REP, SALES_MANAGER, FINANCE, CUSTOMER, BUYER, SELLER, VENDOR }
    public enum Mode { LOCAL, PROFESSIONAL }
    public enum Tier { BRONZE, SILVER, GOLD }
    public enum BillingCycle { MONTHLY, QUARTERLY, YEARLY }
    public enum ProrationType { NONE, EXACT_DAYS }
    public enum QuotationStatus { DRAFT, PENDING_L1, PENDING_L2, APPROVED, REJECTED, SENT_TO_CUSTOMER, UNDER_NEGOTIATION, CONFIRMED }
    public enum FulfillmentStatus { PENDING, PARTIAL, COMPLETED }
    public enum PaymentStatus { HELD, RELEASED, DISPUTED }
    public enum BidStatus { SUBMITTED, ACCEPTED, REJECTED }
    public enum RequirementStatus { OPEN, CLOSED }
    public enum AuditAction { CREATED, UPDATED, DELETED }
}
"""

files["entity/User.java"] = """package com.devflow.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String email;
    private String passwordHash;
    @Enumerated(EnumType.STRING) private Enums.Role role;
    @Enumerated(EnumType.STRING) private Enums.Mode mode;
    @Enumerated(EnumType.STRING) private Enums.Tier tier;
    private Double trustScore;
    private Integer totalTransactions;
    private LocalDateTime createdAt;
}
"""

files["entity/Category.java"] = """package com.devflow.entity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Category {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private Double maxDiscountPct;
}
"""

files["entity/Product.java"] = """package com.devflow.entity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Product {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    @ManyToOne private Category category;
    private Double basePrice;
    private String unit;
    private Double taxRate;
    private String description;
    private Boolean isRecurring;
}
"""

files["entity/ProductVariant.java"] = """package com.devflow.entity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class ProductVariant {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne private Product product;
    private String attribute;
    private String value;
    private Double extraPrice;
}
"""

files["entity/PriceList.java"] = """package com.devflow.entity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class PriceList {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Enumerated(EnumType.STRING) private Enums.Tier customerTier;
    @ManyToOne private Product product;
    private Double price;
    private String currency;
}
"""

files["entity/DiscountTier.java"] = """package com.devflow.entity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class DiscountTier {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Enumerated(EnumType.STRING) private Enums.Tier customerTier;
    private Double maxDiscountPct;
}
"""

files["entity/ApprovalChain.java"] = """package com.devflow.entity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class ApprovalChain {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Double discountMin;
    private Double discountMax;
    private Boolean requiresL1;
    private Boolean requiresL2;
}
"""

files["entity/Warehouse.java"] = """package com.devflow.entity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Warehouse {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String location;
    private Double shippingWeight;
}
"""

files["entity/Stock.java"] = """package com.devflow.entity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Stock {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne private Warehouse warehouse;
    @ManyToOne private Product product;
    private Integer qtyAvailable;
}
"""

files["entity/SubscriptionPlan.java"] = """package com.devflow.entity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class SubscriptionPlan {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    @Enumerated(EnumType.STRING) private Enums.BillingCycle billingCycle;
    @Enumerated(EnumType.STRING) private Enums.ProrationType prorationType;
}
"""

files["entity/Quotation.java"] = """package com.devflow.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Quotation {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne private User customer;
    @ManyToOne private User salesRep;
    @Enumerated(EnumType.STRING) private Enums.QuotationStatus status;
    private Double blendedRiskScore;
    private String portalToken;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    @OneToMany(mappedBy = "quotation", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<QuotationLine> lines;
}
"""

files["entity/QuotationLine.java"] = """package com.devflow.entity;
import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class QuotationLine {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne @JsonIgnore private Quotation quotation;
    @ManyToOne private Product product;
    private Integer qty;
    private Double unitPrice;
    private Double discountPct;
    private Double lineTotal;
    private Boolean isRecurring;
    @ManyToOne private SubscriptionPlan subscriptionPlan;
}
"""

files["entity/Fulfillment.java"] = """package com.devflow.entity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Fulfillment {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne private Quotation quotation;
    @ManyToOne private Warehouse warehouse;
    @ManyToOne private Product product;
    private Integer qty;
    @Enumerated(EnumType.STRING) private Enums.FulfillmentStatus status;
}
"""

files["entity/Payment.java"] = """package com.devflow.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Payment {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne private Quotation quotation;
    @ManyToOne private User buyer;
    @ManyToOne private User seller;
    private Double amount;
    private Double platformFee;
    @Enumerated(EnumType.STRING) private Enums.PaymentStatus status;
    private LocalDateTime escrowReleaseAt;
}
"""

files["entity/DeliveryProof.java"] = """package com.devflow.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class DeliveryProof {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne private Payment payment;
    @ManyToOne private User uploadedBy;
    private String imageUrl;
    private LocalDateTime timestamp;
}
"""

files["entity/Requirement.java"] = """package com.devflow.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Requirement {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne private User organization;
    private String title;
    private String description;
    private LocalDateTime deadline;
    @Enumerated(EnumType.STRING) private Enums.RequirementStatus status;
}
"""

files["entity/Bid.java"] = """package com.devflow.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Bid {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne private Requirement requirement;
    @ManyToOne private User vendor;
    private Double amount;
    private LocalDateTime deliveryEta;
    private String notes;
    private Boolean isAnonymous;
    @Enumerated(EnumType.STRING) private Enums.BidStatus status;
}
"""

files["entity/Rating.java"] = """package com.devflow.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Rating {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long orderId;
    @ManyToOne private User rater;
    @ManyToOne private User ratee;
    private Integer stars;
    private String reviewText;
    private String imageUrl;
    private LocalDateTime createdAt;
}
"""

files["entity/TrustScore.java"] = """package com.devflow.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class TrustScore {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @OneToOne private User user;
    @Enumerated(EnumType.STRING) private Enums.Tier tier;
    private Double avgStars;
    private Integer totalTransactions;
    private String aiSummary;
    private LocalDateTime updatedAt;
}
"""

files["entity/AuditLog.java"] = """package com.devflow.entity;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class AuditLog {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String entityType;
    private Long entityId;
    @Enumerated(EnumType.STRING) private Enums.AuditAction action;
    @ManyToOne private User performedBy;
    private String metadata;
    private LocalDateTime timestamp;
}
"""

files["entity/UpsellRule.java"] = """package com.devflow.entity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class UpsellRule {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne private Product product;
    @ManyToOne private Product suggestedProduct;
    private Double marginThreshold;
    private Boolean isPromoted;
}
"""

for fname, content in files.items():
    with open(os.path.join(base_dir, fname), "w") as f:
        f.write(content)

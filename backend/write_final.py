import os

base_dir = "/Users/om/Desktop/Projects/Odoo-Hackathon/backend/src/main/java/com/devflow"

files = {}

# Dashboard
files["dto/DashboardStats.java"] = """package com.devflow.dto;
import lombok.Data;
import lombok.AllArgsConstructor;

@Data @AllArgsConstructor
public class DashboardStats {
    private long totalQuotations;
    private long pendingApprovals;
    private double totalRevenue;
}
"""

files["service/DashboardService.java"] = """package com.devflow.service;
import com.devflow.dto.DashboardStats;
import com.devflow.repository.QuotationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardService {
    private final QuotationRepository quotationRepository;
    
    public DashboardStats getStats() {
        return new DashboardStats(quotationRepository.count(), 0, 0.0);
    }
}
"""

files["controller/DashboardController.java"] = """package com.devflow.controller;
import com.devflow.dto.DashboardStats;
import com.devflow.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {
    private final DashboardService dashboardService;
    
    @GetMapping("/stats")
    public ResponseEntity<DashboardStats> getStats() {
        return ResponseEntity.ok(dashboardService.getStats());
    }
}
"""

# PDF
files["service/PdfService.java"] = """package com.devflow.service;
import com.devflow.entity.Quotation;
import org.springframework.stereotype.Service;

@Service
public class PdfService {
    public byte[] generateGstInvoice(Quotation quotation) {
        // mock implementation
        String content = "GST INVOICE FOR QUOTATION: " + quotation.getId();
        return content.getBytes();
    }
}
"""

# Seeder
files["seeder/DataSeeder.java"] = """package com.devflow.seeder;
import com.devflow.entity.*;
import com.devflow.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final WarehouseRepository warehouseRepository;
    private final StockRepository stockRepository;
    private final DiscountTierRepository discountTierRepository;
    private final ApprovalChainRepository approvalChainRepository;
    private final QuotationRepository quotationRepository;
    private final QuotationLineRepository quotationLineRepository;
    private final SubscriptionPlanRepository subscriptionPlanRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            seedUsers();
            seedCategoriesAndProducts();
            seedWarehousesAndStock();
            seedDiscountTiersAndApprovals();
            seedSubscriptions();
            seedQuotations();
        }
    }

    private void seedUsers() {
        userRepository.saveAll(List.of(
            User.builder().email("admin@devflow.com").passwordHash(passwordEncoder.encode("admin123")).role(Enums.Role.ADMIN).build(),
            User.builder().email("rep@devflow.com").passwordHash(passwordEncoder.encode("rep123")).role(Enums.Role.SALES_REP).build(),
            User.builder().email("manager@devflow.com").passwordHash(passwordEncoder.encode("mgr123")).role(Enums.Role.SALES_MANAGER).build(),
            User.builder().email("finance@devflow.com").passwordHash(passwordEncoder.encode("fin123")).role(Enums.Role.FINANCE).build(),
            User.builder().email("customer@acme.com").passwordHash(passwordEncoder.encode("cust123")).role(Enums.Role.CUSTOMER).build()
        ));
    }

    private void seedCategoriesAndProducts() {
        Category hw = categoryRepository.save(Category.builder().name("Hardware").maxDiscountPct(0.15).build());
        Category svc = categoryRepository.save(Category.builder().name("Services").maxDiscountPct(0.10).build());
        Category sub = categoryRepository.save(Category.builder().name("Subscriptions").maxDiscountPct(0.20).build());

        productRepository.saveAll(List.of(
            Product.builder().name("Dell Laptop").category(hw).basePrice(65000.0).isRecurring(false).build(),
            Product.builder().name("iPhone 15").category(hw).basePrice(79000.0).isRecurring(false).build(),
            Product.builder().name("Setup Service").category(svc).basePrice(5000.0).isRecurring(false).build(),
            Product.builder().name("Cloud Storage Plan").category(sub).basePrice(999.0).isRecurring(true).build(),
            Product.builder().name("Network Switch").category(hw).basePrice(12000.0).isRecurring(false).build()
        ));
    }

    private void seedWarehousesAndStock() {
        Warehouse mumb = warehouseRepository.save(Warehouse.builder().name("Main Warehouse Mumbai").location("Mumbai").shippingWeight(100.0).build());
        Warehouse pune = warehouseRepository.save(Warehouse.builder().name("East Depot Pune").location("Pune").shippingWeight(50.0).build());
        
        List<Product> products = productRepository.findAll();
        Product laptop = products.stream().filter(p -> p.getName().equals("Dell Laptop")).findFirst().orElseThrow();
        Product phone = products.stream().filter(p -> p.getName().equals("iPhone 15")).findFirst().orElseThrow();
        Product switchP = products.stream().filter(p -> p.getName().equals("Network Switch")).findFirst().orElseThrow();

        stockRepository.saveAll(List.of(
            Stock.builder().warehouse(mumb).product(laptop).qtyAvailable(50).build(),
            Stock.builder().warehouse(mumb).product(phone).qtyAvailable(30).build(),
            Stock.builder().warehouse(pune).product(laptop).qtyAvailable(20).build(),
            Stock.builder().warehouse(pune).product(switchP).qtyAvailable(100).build()
        ));
    }

    private void seedDiscountTiersAndApprovals() {
        discountTierRepository.saveAll(List.of(
            DiscountTier.builder().customerTier(Enums.Tier.BRONZE).maxDiscountPct(0.05).build(),
            DiscountTier.builder().customerTier(Enums.Tier.SILVER).maxDiscountPct(0.10).build(),
            DiscountTier.builder().customerTier(Enums.Tier.GOLD).maxDiscountPct(0.15).build()
        ));

        approvalChainRepository.saveAll(List.of(
            ApprovalChain.builder().discountMin(0.10).discountMax(0.20).requiresL1(true).requiresL2(false).build(),
            ApprovalChain.builder().discountMin(0.20).discountMax(1.00).requiresL1(true).requiresL2(true).build()
        ));
    }
    
    private void seedSubscriptions() {
        subscriptionPlanRepository.save(SubscriptionPlan.builder().name("Monthly Cloud Plan").billingCycle(Enums.BillingCycle.MONTHLY).prorationType(Enums.ProrationType.EXACT_DAYS).build());
    }

    private void seedQuotations() {
        User cust = userRepository.findByEmail("customer@acme.com").orElseThrow();
        User rep = userRepository.findByEmail("rep@devflow.com").orElseThrow();
        Product laptop = productRepository.findAll().stream().filter(p -> p.getName().equals("Dell Laptop")).findFirst().orElseThrow();
        
        Quotation q1 = quotationRepository.save(Quotation.builder().customer(cust).salesRep(rep).status(Enums.QuotationStatus.DRAFT).build());
        quotationLineRepository.save(QuotationLine.builder().quotation(q1).product(laptop).qty(2).unitPrice(65000.0).discountPct(0.0).lineTotal(130000.0).build());

        Quotation q2 = quotationRepository.save(Quotation.builder().customer(cust).salesRep(rep).status(Enums.QuotationStatus.PENDING_L1).build());
        quotationLineRepository.save(QuotationLine.builder().quotation(q2).product(laptop).qty(5).unitPrice(65000.0).discountPct(0.15).lineTotal(276250.0).build());
    }
}
"""

for fname, content in files.items():
    with open(os.path.join(base_dir, fname), "w") as f:
        f.write(content)

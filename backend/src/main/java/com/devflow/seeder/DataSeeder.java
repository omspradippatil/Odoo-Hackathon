package com.devflow.seeder;
import com.devflow.entity.*;
import com.devflow.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
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
        boolean freshDatabase = userRepository.count() == 0;
        seedUsers();
        if (freshDatabase) {
            seedCategoriesAndProducts();
            seedWarehousesAndStock();
            seedDiscountTiersAndApprovals();
            seedSubscriptions();
            seedQuotations();
            return;
        }

        if (categoryRepository.count() == 0) seedCategoriesAndProducts();
        if (warehouseRepository.count() == 0) seedWarehousesAndStock();
        if (discountTierRepository.count() == 0) seedDiscountTiersAndApprovals();
        if (subscriptionPlanRepository.count() == 0) seedSubscriptions();
        attachDefaultSellerToProducts();
    }

    private void seedUsers() {
        seedUser("admin@devflow.com", "admin123", "Admin Owner", "DEV FLOW", Enums.Role.ADMIN, Enums.Mode.PROFESSIONAL, Enums.Tier.GOLD, 5.0, 50, "Mumbai");
        seedUser("rep@devflow.com", "rep123", "Sales Rep", "DEV FLOW", Enums.Role.SALES_REP, Enums.Mode.PROFESSIONAL, Enums.Tier.SILVER, 4.2, 14, "Mumbai");
        seedUser("manager@devflow.com", "mgr123", "Sales Manager", "DEV FLOW", Enums.Role.SALES_MANAGER, Enums.Mode.PROFESSIONAL, Enums.Tier.GOLD, 4.8, 35, "Mumbai");
        seedUser("finance@devflow.com", "fin123", "Finance Approver", "DEV FLOW", Enums.Role.FINANCE, Enums.Mode.PROFESSIONAL, Enums.Tier.GOLD, 4.7, 30, "Mumbai");
        seedUser("customer@acme.com", "cust123", "Acme Buyer", "Acme Corporation", Enums.Role.CUSTOMER, Enums.Mode.PROFESSIONAL, Enums.Tier.GOLD, 4.6, 24, "Pune");
        seedUser("buyer@user.com", "buy123", "Local Buyer", null, Enums.Role.BUYER, Enums.Mode.LOCAL, Enums.Tier.BRONZE, 4.0, 3, "Pune");
        seedUser("seller@localshop.com", "sell123", "Raj Electronics", "Raj Electronics Pune", Enums.Role.SELLER, Enums.Mode.LOCAL, Enums.Tier.GOLD, 4.8, 31, "Pune");
        seedUser("vendor@devflow.com", "vendor123", "Anonymous Vendor", "Verified Contractor Co.", Enums.Role.VENDOR, Enums.Mode.PROFESSIONAL, Enums.Tier.SILVER, 4.1, 16, "Nashik");
    }

    private void seedCategoriesAndProducts() {
        Category hw = categoryRepository.save(Category.builder().name("Hardware").maxDiscountPct(0.15).build());
        Category svc = categoryRepository.save(Category.builder().name("Services").maxDiscountPct(0.10).build());
        Category sub = categoryRepository.save(Category.builder().name("Subscriptions").maxDiscountPct(0.20).build());

        productRepository.saveAll(List.of(
            Product.builder().name("Dell Laptop").category(hw).basePrice(65000.0).actualPrice(74999.0).imageUrl("https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&auto=format&fit=crop&q=80").isRecurring(false).build(),
            Product.builder().name("iPhone 15").category(hw).basePrice(79000.0).actualPrice(89900.0).imageUrl("https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&auto=format&fit=crop&q=80").isRecurring(false).build(),
            Product.builder().name("Setup Service").category(svc).basePrice(5000.0).actualPrice(6500.0).imageUrl("https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=500&auto=format&fit=crop&q=80").isRecurring(false).build(),
            Product.builder().name("Cloud Storage Plan").category(sub).basePrice(999.0).actualPrice(1499.0).imageUrl("https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&auto=format&fit=crop&q=80").isRecurring(true).build(),
            Product.builder().name("Network Switch").category(hw).basePrice(12000.0).actualPrice(14500.0).imageUrl("https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=500&auto=format&fit=crop&q=80").isRecurring(false).build()
        ));
        attachDefaultSellerToProducts();
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

    private void seedUser(String email, String password, String displayName, String companyName, Enums.Role role,
                          Enums.Mode mode, Enums.Tier tier, Double trustScore, Integer totalTransactions, String city) {
        userRepository.findByEmail(email).orElseGet(() -> {
            User user = User.builder()
                    .email(email)
                    .passwordHash(passwordEncoder.encode(password))
                    .displayName(displayName)
                    .companyName(companyName)
                    .role(role)
                    .mode(mode)
                    .tier(tier)
                    .trustScore(trustScore)
                    .totalTransactions(totalTransactions)
                    .city(city)
                    .createdAt(LocalDateTime.now())
                    .build();
            return userRepository.save(user);
        });
    }

    private void attachDefaultSellerToProducts() {
        User seller = userRepository.findByEmail("seller@localshop.com").orElse(null);
        if (seller == null) return;

        List<Product> products = productRepository.findAll();
        boolean changed = false;
        for (Product product : products) {
            if (product.getSeller() == null) {
                product.setSeller(seller);
                changed = true;
            }
        }
        if (changed) {
            productRepository.saveAll(products);
        }
    }
}

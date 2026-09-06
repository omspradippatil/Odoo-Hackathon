with open("src/main/java/com/devflow/backend/config/DataSeeder.java", "w") as f:
    f.write("""package com.devflow.backend.config;

import com.devflow.backend.deal.Deal;
import com.devflow.backend.deal.DealRepository;
import com.devflow.backend.notification.Notification;
import com.devflow.backend.notification.NotificationRepository;
import com.devflow.backend.quotation.Quotation;
import com.devflow.backend.quotation.QuotationRepository;
import com.devflow.backend.inventory.Inventory;
import com.devflow.backend.inventory.InventoryRepository;
import com.devflow.backend.product.Product;
import com.devflow.backend.product.ProductRepository;
import com.devflow.backend.vendor.Vendor;
import com.devflow.backend.vendor.VendorRepository;
import com.devflow.backend.warehouse.Warehouse;
import com.devflow.backend.warehouse.WarehouseRepository;
import com.devflow.backend.cart.CartItem;
import com.devflow.backend.cart.CartItemRepository;
import com.devflow.backend.order.Order;
import com.devflow.backend.order.OrderItem;
import com.devflow.backend.order.OrderRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final VendorRepository vendorRepository;
    private final WarehouseRepository warehouseRepository;
    private final ProductRepository productRepository;
    private final InventoryRepository inventoryRepository;
    private final DealRepository dealRepository;
    private final NotificationRepository notificationRepository;
    private final QuotationRepository quotationRepository;
    private final CartItemRepository cartItemRepository;
    private final OrderRepository orderRepository;

    public DataSeeder(VendorRepository vendorRepository,
                      WarehouseRepository warehouseRepository,
                      ProductRepository productRepository,
                      InventoryRepository inventoryRepository,
                      DealRepository dealRepository,
                      NotificationRepository notificationRepository,
                      QuotationRepository quotationRepository,
                      CartItemRepository cartItemRepository,
                      OrderRepository orderRepository) {
        this.vendorRepository = vendorRepository;
        this.warehouseRepository = warehouseRepository;
        this.productRepository = productRepository;
        this.inventoryRepository = inventoryRepository;
        this.dealRepository = dealRepository;
        this.notificationRepository = notificationRepository;
        this.quotationRepository = quotationRepository;
        this.cartItemRepository = cartItemRepository;
        this.orderRepository = orderRepository;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (productRepository.count() >= 2000) {
            log.info("Database already seeded with enough records.");
            return;
        }

        // Cleanup before massive seed
        cartItemRepository.deleteAll();
        orderRepository.deleteAll();
        quotationRepository.deleteAll();
        notificationRepository.deleteAll();
        dealRepository.deleteAll();
        inventoryRepository.deleteAll();
        productRepository.deleteAll();
        warehouseRepository.deleteAll();
        vendorRepository.deleteAll();

        log.info("Seeding uniquely generated data (2000+ per table)...");
        Random rng = new Random(12345);

        // 1. Vendors (2100)
        List<Vendor> vendors = new ArrayList<>();
        String[] vPrefixes = {"Tech", "Electro", "Global", "City", "Mega", "Super", "Quick", "Smart", "Apex", "Prime", "Elite", "Urban", "Metro", "United", "First"};
        String[] vSuffixes = {"Store", "Mart", "Retail", "Wholesale", "Hub", "Depot", "Supplier", "Traders", "Electronics", "Goods", "Solutions", "Distributors", "Emporium"};
        String[] cities = {"Mumbai", "Delhi", "Bengaluru", "Chennai", "Kolkata", "Pune", "Hyderabad", "Ahmedabad", "Jaipur", "Surat", "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane"};
        
        Set<String> usedVendors = new HashSet<>();
        while (vendors.size() < 2100) {
            String vName = vPrefixes[rng.nextInt(vPrefixes.length)] + " " + vSuffixes[rng.nextInt(vSuffixes.length)];
            // Add a suffix to ensure uniqueness
            vName += " " + (1000 + vendors.size());
            
            if (!usedVendors.contains(vName)) {
                usedVendors.add(vName);
                vendors.add(Vendor.builder()
                    .name(vName)
                    .city(cities[rng.nextInt(cities.length)])
                    .state("State")
                    .rating(3.0 + rng.nextDouble() * 2.0)
                    .trustScore(60 + rng.nextInt(40))
                    .trustTier(rng.nextDouble() > 0.7 ? "Gold" : "Silver")
                    .active(true)
                    .build());
            }
        }
        
        // Ensure some big names exist
        vendors.get(0).setName("Amazon India");
        vendors.get(1).setName("Flipkart Retail");
        vendors.get(2).setName("OLX Local");
        
        vendors = vendorRepository.saveAll(vendors);

        // 2. Warehouses (2100)
        List<Warehouse> warehouses = new ArrayList<>();
        String[] wZones = {"North Zone", "South Zone", "East Zone", "West Zone", "Central", "Express", "Main", "Sub-regional"};
        for (int i = 0; i < 2100; i++) {
            Vendor v = vendors.get(i);
            warehouses.add(Warehouse.builder()
                .name(v.getName() + " " + wZones[rng.nextInt(wZones.length)] + " Depot")
                .city(v.getCity())
                .state("State")
                .vendor(v)
                .build());
        }
        warehouses = warehouseRepository.saveAll(warehouses);

        // 3. Products (2100+)
        List<Product> products = new ArrayList<>();
        
        // Laptop Data
        String[] lapBrands = {"Dell", "HP", "Lenovo", "Apple", "Asus", "Acer", "MSI"};
        String[] lapModels = {"XPS", "Spectre", "ThinkPad", "MacBook Pro", "MacBook Air", "ZenBook", "ROG", "Predator", "Pavilion"};
        String[] lapSpecs = {"8GB RAM/256GB SSD", "16GB RAM/512GB SSD", "32GB RAM/1TB SSD", "16GB RAM/1TB SSD"};
        String[] lapProcessors = {"Core i5", "Core i7", "Core i9", "Ryzen 5", "Ryzen 7", "M2", "M3"};
        
        // TV Data
        String[] tvBrands = {"Sony", "Samsung", "LG", "TCL", "Hisense", "Mi", "Vu"};
        String[] tvTypes = {"Bravia", "OLED", "QLED", "Crystal UHD", "NanoCell", "Neo QLED", "Smart LED"};
        String[] tvSizes = {"32-inch", "43-inch", "50-inch", "55-inch", "65-inch", "75-inch", "85-inch"};
        
        // Fan Data
        String[] fanBrands = {"Crompton", "Bajaj", "Havells", "Orient", "Usha", "Atomberg"};
        String[] fanTypes = {"Ceiling Fan", "Pedestal Fan", "Table Fan", "Exhaust Fan", "Wall Fan"};
        String[] fanSpecs = {"1200mm", "1400mm", "High Speed", "BLDC Motor", "Anti-Dust", "Remote Control"};
        
        // Fridge Data
        String[] fridgeBrands = {"Whirlpool", "Samsung", "LG", "Haier", "Godrej", "Bosch"};
        String[] fridgeTypes = {"Single Door", "Double Door", "Side-by-Side", "French Door", "Bottom Mount"};
        String[] fridgeCaps = {"190L", "250L", "350L", "500L", "650L", "180L"};
        
        // Smartphone Data
        String[] phoneBrands = {"Apple", "Samsung", "Google", "OnePlus", "Xiaomi", "Vivo", "Oppo"};
        String[] phoneModels = {"iPhone 15", "Galaxy S24", "Pixel 8", "12 Pro", "Redmi Note 13", "X100", "Reno 11"};
        String[] phoneColors = {"Phantom Black", "Titanium", "Ocean Blue", "Midnight", "Starlight"};
        
        // Images (Categories mapped to distinct image lists)
        String[] lapImages = {
            "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80",
            "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80",
            "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
            "https://images.unsplash.com/photo-1531297172868-9f140bb3418e?w=800&q=80",
            "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&q=80"
        };
        
        String[] tvImages = {
            "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&q=80",
            "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&q=80",
            "https://images.unsplash.com/photo-1601944177325-f8867652837f?w=800&q=80",
            "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=800&q=80"
        };
        
        String[] fanImages = {
            "https://images.unsplash.com/photo-1620023646698-468f7fba0b92?w=800&q=80",
            "https://images.unsplash.com/photo-1616422340576-96b6fb25f0e1?w=800&q=80",
            "https://images.unsplash.com/photo-1585642643501-c30089aebc16?w=800&q=80"
        };
        
        String[] fridgeImages = {
            "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=800&q=80",
            "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=800&q=80",
            "https://images.unsplash.com/photo-1605347071063-47029cb3f707?w=800&q=80"
        };
        
        String[] phoneImages = {
            "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80",
            "https://images.unsplash.com/photo-1598327105666-5b89351cb315?w=800&q=80",
            "https://images.unsplash.com/photo-1533228100845-08145b00de51?w=800&q=80",
            "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80"
        };

        Set<String> usedProducts = new HashSet<>();
        
        // Helper to add products
        for (int i = 0; i < 2100; i++) {
            Vendor v = vendors.get(i % vendors.size());
            String cat = "";
            String brand = "";
            String name = "";
            String image = "";
            double basePrice = 0;
            
            int type = i % 5;
            
            switch (type) {
                case 0: // Laptop
                    cat = "Laptops";
                    brand = lapBrands[rng.nextInt(lapBrands.length)];
                    name = brand + " " + lapModels[rng.nextInt(lapModels.length)] + " " + lapProcessors[rng.nextInt(lapProcessors.length)] + " " + lapSpecs[rng.nextInt(lapSpecs.length)];
                    image = lapImages[rng.nextInt(lapImages.length)];
                    basePrice = 30000 + rng.nextInt(150000);
                    break;
                case 1: // TV
                    cat = "Televisions";
                    brand = tvBrands[rng.nextInt(tvBrands.length)];
                    name = brand + " " + tvSizes[rng.nextInt(tvSizes.length)] + " " + tvTypes[rng.nextInt(tvTypes.length)] + " TV";
                    image = tvImages[rng.nextInt(tvImages.length)];
                    basePrice = 15000 + rng.nextInt(200000);
                    break;
                case 2: // Fan
                    cat = "Fans";
                    brand = fanBrands[rng.nextInt(fanBrands.length)];
                    name = brand + " " + fanTypes[rng.nextInt(fanTypes.length)] + " " + fanSpecs[rng.nextInt(fanSpecs.length)];
                    image = fanImages[rng.nextInt(fanImages.length)];
                    basePrice = 1200 + rng.nextInt(5000);
                    break;
                case 3: // Fridge
                    cat = "Refrigerators";
                    brand = fridgeBrands[rng.nextInt(fridgeBrands.length)];
                    name = brand + " " + fridgeCaps[rng.nextInt(fridgeCaps.length)] + " " + fridgeTypes[rng.nextInt(fridgeTypes.length)] + " Refrigerator";
                    image = fridgeImages[rng.nextInt(fridgeImages.length)];
                    basePrice = 12000 + rng.nextInt(80000);
                    break;
                case 4: // Smartphone
                    cat = "Smartphones";
                    brand = phoneBrands[rng.nextInt(phoneBrands.length)];
                    name = brand + " " + phoneModels[rng.nextInt(phoneModels.length)] + " " + phoneColors[rng.nextInt(phoneColors.length)];
                    image = phoneImages[rng.nextInt(phoneImages.length)];
                    basePrice = 10000 + rng.nextInt(120000);
                    break;
            }
            
            name = name + " [SKU-" + i + "]"; // Guarantee complete uniqueness
            
            products.add(Product.builder()
                .name(name)
                .category(cat)
                .brand(brand)
                .basePrice(basePrice)
                .originalPrice(basePrice * 1.25)
                .sellingPrice(basePrice)
                .active(true)
                .imageUrl(image)
                .sellerName(v.getName())
                .sellerId(String.valueOf(v.getId()))
                .city(v.getCity())
                .trustScore(v.getTrustScore())
                .verificationStatus(v.getTrustScore() > 80 ? "VERIFIED" : "PENDING")
                .stock(5 + rng.nextInt(150))
                .build());
        }
        products = productRepository.saveAll(products);

        // 4. Inventory (2100)
        List<Inventory> inventories = new ArrayList<>();
        for (int i = 0; i < 2100; i++) {
            Warehouse wh = warehouses.get(i);
            Product p = products.get(i);
            inventories.add(Inventory.builder()
                .warehouse(wh)
                .product(p)
                .physicalStock(p.getStock() + 10)
                .reservedStock(10)
                .availableStock(p.getStock())
                .sellingPrice(p.getSellingPrice())
                .build());
        }
        inventoryRepository.saveAll(inventories);

        // 5. Deals (2100)
        List<Deal> deals = new ArrayList<>();
        String[] dealStages = {"SOURCING", "COMPARING", "NEGOTIATING", "APPROVED", "FULFILLED"};
        for (int i = 0; i < 2100; i++) {
            Product p = products.get(i);
            String stage = dealStages[rng.nextInt(dealStages.length)];
            deals.add(new Deal("REQ-" + (2000 + i), 
                "Bulk Procurement of " + p.getName().replaceAll(" \\\\[SKU-.*\\\\]", ""), 
                p.getCategory(), 
                p.getBasePrice() * 50, 
                p.getBasePrice() * 45, 
                stage, 
                3 + rng.nextInt(15), 
                1 + rng.nextInt(5), 
                vendors.get(i).getName(), 
                LocalDate.now().minusDays(rng.nextInt(60)), 
                vendors.get(i).getCity(), 
                false));
        }
        dealRepository.saveAll(deals);

        // 6. Notifications (2100)
        List<Notification> notifs = new ArrayList<>();
        for (int i = 0; i < 2100; i++) {
            notifs.add(new Notification("notif-" + (2000 + i), 
                "Update on " + products.get(i).getCategory(), 
                "Your requirement for " + products.get(i).getName() + " has new quotes.", 
                "deal", 
                rng.nextInt(24) + "h ago", 
                rng.nextBoolean(), 
                "/buyer/deals", 
                "Alert"));
        }
        notificationRepository.saveAll(notifs);

        // 7. Quotations (2100)
        List<Quotation> quotes = new ArrayList<>();
        for (int i = 0; i < 2100; i++) {
            quotes.add(new Quotation("QT-" + (2000 + i), rng.nextBoolean() ? "APPROVED" : "DRAFT"));
        }
        quotationRepository.saveAll(quotes);

        // 8. Orders & OrderItems (1050 orders x 2 items = 2100 items)
        List<Order> orders = new ArrayList<>();
        for (int i = 0; i < 1050; i++) {
            Product p1 = products.get(i * 2);
            Product p2 = products.get(i * 2 + 1);
            
            Order o = Order.builder()
                .id("ORD-" + (3000 + i))
                .buyerId("buyer@local.com")
                .subtotal(p1.getSellingPrice() + p2.getSellingPrice())
                .platformFee((p1.getSellingPrice() + p2.getSellingPrice()) * 0.02)
                .total((p1.getSellingPrice() + p2.getSellingPrice()) * 1.02)
                .paymentStatus("PAID")
                .fulfilmentStatus(rng.nextBoolean() ? "DELIVERED" : "PROCESSING")
                .createdAt(LocalDate.now().minusDays(rng.nextInt(30)).toString())
                .title("Local Order " + i)
                .items(new ArrayList<>())
                .build();

            o.getItems().add(OrderItem.builder()
                .productId(String.valueOf(p1.getId()))
                .sellerId(p1.getSellerId())
                .sellerName(p1.getSellerName())
                .name(p1.getName())
                .image(p1.getImageUrl())
                .quantity(1)
                .unitPrice(p1.getSellingPrice())
                .build());
                
            o.getItems().add(OrderItem.builder()
                .productId(String.valueOf(p2.getId()))
                .sellerId(p2.getSellerId())
                .sellerName(p2.getSellerName())
                .name(p2.getName())
                .image(p2.getImageUrl())
                .quantity(1)
                .unitPrice(p2.getSellingPrice())
                .build());
                
            orders.add(o);
        }
        orderRepository.saveAll(orders);

        // 9. Cart Items (2100)
        List<CartItem> cartItems = new ArrayList<>();
        for (int i = 0; i < 2100; i++) {
            Product p = products.get(i);
            cartItems.add(CartItem.builder()
                .id("CART-" + (2000 + i))
                .productId(String.valueOf(p.getId()))
                .sellerId(p.getSellerId())
                .sellerName(p.getSellerName())
                .name(p.getName())
                .image(p.getImageUrl())
                .quantity(1 + rng.nextInt(3))
                .unitPrice(p.getSellingPrice())
                .availableQuantity(p.getStock())
                .build());
        }
        cartItemRepository.saveAll(cartItems);

        log.info("Finished seeding completely UNIQUE massive dataset with distinct images!");
    }
}
"""
    )

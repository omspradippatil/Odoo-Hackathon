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

        log.info("Seeding massive real-world data (2000+ per table)...");
        Random rng = new Random(42);

        // 1. Vendors (2000)
        List<Vendor> vendors = new ArrayList<>();
        String[] vendorPrefixes = {"Tech", "Electro", "Global", "Amazon", "Flipkart", "OLX", "Smart", "Mega", "Super", "Quick"};
        String[] vendorSuffixes = {"Store", "Mart", "Retail", "Wholesale", "Hub", "Depot", "Supplier", "Traders", "Electronics", "Goods"};
        String[] cities = {"Mumbai", "Delhi", "Bengaluru", "Chennai", "Kolkata", "Pune", "Hyderabad", "Ahmedabad", "Jaipur", "Surat"};
        for (int i = 0; i < 2000; i++) {
            String vName = vendorPrefixes[rng.nextInt(vendorPrefixes.length)] + " " + vendorSuffixes[rng.nextInt(vendorSuffixes.length)] + " " + i;
            String vCity = cities[rng.nextInt(cities.length)];
            vendors.add(Vendor.builder()
                .name(vName)
                .city(vCity)
                .state("State")
                .rating(3.0 + rng.nextDouble() * 2.0)
                .trustScore(50 + rng.nextInt(50))
                .trustTier(rng.nextBoolean() ? "Gold" : "Silver")
                .active(true)
                .build());
        }
        vendors = vendorRepository.saveAll(vendors);

        // 2. Warehouses (2000)
        List<Warehouse> warehouses = new ArrayList<>();
        for (int i = 0; i < 2000; i++) {
            Vendor v = vendors.get(i % vendors.size());
            warehouses.add(Warehouse.builder()
                .name(v.getName() + " WH " + i)
                .city(v.getCity())
                .state("State")
                .vendor(v)
                .build());
        }
        warehouses = warehouseRepository.saveAll(warehouses);

        // 3. Products (2000)
        List<Product> products = new ArrayList<>();
        String[] productCats = {"Laptops", "TVs", "Fans", "Refrigerators", "Smartphones", "Furniture", "Cameras", "Accessories"};
        String[] productBrands = {"Samsung", "Sony", "LG", "Dell", "HP", "Apple", "Bajaj", "Crompton", "Whirlpool", "Bosch"};
        for (int i = 0; i < 2100; i++) {
            String cat = productCats[rng.nextInt(productCats.length)];
            String brand = productBrands[rng.nextInt(productBrands.length)];
            String pName = brand + " " + cat.substring(0, cat.length() - 1) + " Pro Max " + i;
            double base = 1000 + rng.nextInt(50000);
            products.add(Product.builder()
                .name(pName)
                .category(cat)
                .brand(brand)
                .basePrice(base)
                .originalPrice(base * 1.2)
                .sellingPrice(base)
                .active(true)
                .imageUrl("https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80")
                .sellerName(vendors.get(i % vendors.size()).getName())
                .sellerId(vendors.get(i % vendors.size()).getId())
                .city(cities[rng.nextInt(cities.length)])
                .trustScore(90)
                .verificationStatus("VERIFIED")
                .stock(10 + rng.nextInt(100))
                .build());
        }
        products = productRepository.saveAll(products);

        // 4. Inventory (2000)
        List<Inventory> inventories = new ArrayList<>();
        for (int i = 0; i < 2000; i++) {
            Warehouse wh = warehouses.get(i);
            Product p = products.get(i);
            inventories.add(Inventory.builder()
                .warehouse(wh)
                .product(p)
                .physicalStock(100)
                .reservedStock(10)
                .availableStock(90)
                .sellingPrice(p.getSellingPrice())
                .build());
        }
        inventoryRepository.saveAll(inventories);

        // 5. Deals (2000)
        List<Deal> deals = new ArrayList<>();
        for (int i = 0; i < 2000; i++) {
            deals.add(new Deal("REQ-2000-" + i, "Procurement of " + products.get(i).getName(), products.get(i).getCategory(), 500000.0, 450000.0, "COMPARING", rng.nextInt(10)+1, rng.nextInt(5)+1, vendors.get(i).getName(), LocalDate.now(), cities[rng.nextInt(cities.length)], false));
        }
        dealRepository.saveAll(deals);

        // 6. Notifications (2000)
        List<Notification> notifs = new ArrayList<>();
        for (int i = 0; i < 2000; i++) {
            notifs.add(new Notification("notif-2000-" + i, "Update for " + i, "Message " + i, "system", "1h ago", false, "/dashboard", "Info"));
        }
        notificationRepository.saveAll(notifs);

        // 7. Quotations (2000)
        List<Quotation> quotes = new ArrayList<>();
        for (int i = 0; i < 2000; i++) {
            quotes.add(new Quotation("QT-2000-" + i, rng.nextBoolean() ? "APPROVED" : "DRAFT"));
        }
        quotationRepository.saveAll(quotes);

        // 8. Orders & OrderItems (1000 orders x 2 items = 2000 items)
        List<Order> orders = new ArrayList<>();
        for (int i = 0; i < 1100; i++) {
            Order o = Order.builder()
                .id("ORD-2000-" + i)
                .buyerId("buyer@local.com")
                .subtotal(5000.0)
                .platformFee(100.0)
                .total(5100.0)
                .paymentStatus("PAID")
                .fulfilmentStatus("DELIVERED")
                .createdAt(LocalDate.now().toString())
                .title("Local Order " + i)
                .items(new ArrayList<>())
                .build();

            for (int j = 0; j < 2; j++) {
                Product p = products.get((i * 2 + j) % products.size());
                o.getItems().add(OrderItem.builder()
                    .productId(p.getId())
                    .sellerId(p.getSellerId())
                    .sellerName(p.getSellerName())
                    .name(p.getName())
                    .image(p.getImageUrl())
                    .quantity(1)
                    .unitPrice(p.getSellingPrice())
                    .build());
            }
            orders.add(o);
        }
        orderRepository.saveAll(orders);

        // 9. Cart Items (2000)
        List<CartItem> cartItems = new ArrayList<>();
        for (int i = 0; i < 2000; i++) {
            Product p = products.get(i);
            cartItems.add(CartItem.builder()
                .id("CART-" + i)
                .productId(p.getId())
                .sellerId(p.getSellerId())
                .sellerName(p.getSellerName())
                .name(p.getName())
                .image(p.getImageUrl())
                .quantity(1)
                .unitPrice(p.getSellingPrice())
                .availableQuantity(p.getStock())
                .build());
        }
        cartItemRepository.saveAll(cartItems);

        log.info("Finished seeding massive dataset!");
    }
}
""")

package com.devflow.backend.config;

import com.devflow.backend.cart.CartItem;
import com.devflow.backend.cart.CartItemRepository;
import com.devflow.backend.deal.Deal;
import com.devflow.backend.deal.DealRepository;
import com.devflow.backend.inventory.Inventory;
import com.devflow.backend.inventory.InventoryRepository;
import com.devflow.backend.notification.Notification;
import com.devflow.backend.notification.NotificationRepository;
import com.devflow.backend.order.Order;
import com.devflow.backend.order.OrderItem;
import com.devflow.backend.order.OrderRepository;
import com.devflow.backend.product.Product;
import com.devflow.backend.product.ProductRepository;
import com.devflow.backend.quotation.Quotation;
import com.devflow.backend.quotation.QuotationRepository;
import com.devflow.backend.vendor.Vendor;
import com.devflow.backend.vendor.VendorRepository;
import com.devflow.backend.warehouse.Warehouse;
import com.devflow.backend.warehouse.WarehouseRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class DuplicateCleanup implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DuplicateCleanup.class);

    private final VendorRepository vendorRepository;
    private final WarehouseRepository warehouseRepository;
    private final ProductRepository productRepository;
    private final InventoryRepository inventoryRepository;
    private final DealRepository dealRepository;
    private final NotificationRepository notificationRepository;
    private final QuotationRepository quotationRepository;
    private final CartItemRepository cartItemRepository;
    private final OrderRepository orderRepository;

    @Override
    @Transactional
    public void run(String... args) {
        boolean scanOnly = args.length > 0 && args[0].equals("--scan-only");

        log.info("=== DATABASE DUPLICATE ANALYSIS REPORT ===");
        log.info("Mode: {}", scanOnly ? "Scan Only (no deletion)" : "Scan & Clean");

        // 1. Analyze Vendors for duplicates
        analyzeVendors(scanOnly);

        // 2. Analyze Products for duplicates
        analyzeProducts(scanOnly);

        // 3. Analyze Warehouses for duplicates
        analyzeWarehouses(scanOnly);

        // 4. Analyze Deals for duplicates
        analyzeDeals(scanOnly);

        // 5. Analyze Notifications for duplicates
        analyzeNotifications(scanOnly);

        // 6. Analyze Quotations for duplicates
        analyzeQuotations(scanOnly);

        // 7. Analyze Cart Items for duplicates
        analyzeCartItems(scanOnly);

        // 8. Analyze Orders for duplicates
        analyzeOrders(scanOnly);

        // 9. Analyze Inventory for duplicates
        analyzeInventory(scanOnly);

        log.info("=== ANALYSIS COMPLETE ===");
        log.info("To remove duplicates, run without --scan-only flag");
    }

    private void analyzeVendors(boolean scanOnly) {
        log.info("\n--- Vendors Analysis ---");
        List<Vendor> allVendors = vendorRepository.findAll();
        Map<String, List<Vendor>> nameToVendors = allVendors.stream()
            .collect(Collectors.groupingBy(Vendor::getName));

        int duplicateCount = 0;
        for (Map.Entry<String, List<Vendor>> entry : nameToVendors.entrySet()) {
            if (entry.getValue().size() > 1) {
                duplicateCount++;
                log.warn("Duplicate Vendor Name: '{}' ({} occurrences)", entry.getKey(), entry.getValue().size());
                for (Vendor v : entry.getValue()) {
                    log.info("    - ID: {}, City: {}, TrustScore: {}", v.getId(), v.getCity(), v.getTrustScore());
                }

                if (!scanOnly) {
                    // Keep the first vendor (with highest ID) and remove others
                    List<Vendor> duplicates = entry.getValue();
                    Collections.sort(duplicates, Comparator.comparing(Vendor::getId).reversed());
                    List<Vendor> toRemove = duplicates.subList(1, duplicates.size());
                    vendorRepository.deleteAll(toRemove);
                    log.info("    -> Removed {} duplicate(s)", toRemove.size());
                }
            }
        }

        if (duplicateCount == 0) {
            log.info("No duplicate vendors found ({} total vendors)", allVendors.size());
        }
    }

    private void analyzeProducts(boolean scanOnly) {
        log.info("\n--- Products Analysis ---");
        List<Product> allProducts = productRepository.findAll();

        // Check for duplicates by name
        Map<String, List<Product>> nameToProducts = allProducts.stream()
            .collect(Collectors.groupingBy(Product::getName));

        int duplicateCount = 0;
        for (Map.Entry<String, List<Product>> entry : nameToProducts.entrySet()) {
            if (entry.getValue().size() > 1) {
                duplicateCount++;
                log.warn("Duplicate Product Name: '{}' ({} occurrences)", entry.getKey(), entry.getValue().size());
                for (Product p : entry.getValue()) {
                    log.info("    - ID: {}, Brand: {}, Seller: {}, Price: {}",
                        p.getId(), p.getBrand(), p.getSellerName(), p.getSellingPrice());
                }

                if (!scanOnly) {
                    // Keep the product with highest ID and remove others
                    List<Product> duplicates = entry.getValue();
                    Collections.sort(duplicates, Comparator.comparing(Product::getId).reversed());
                    List<Product> toRemove = duplicates.subList(1, duplicates.size());
                    productRepository.deleteAll(toRemove);
                    log.info("    -> Removed {} duplicate(s)", toRemove.size());
                }
            }
        }

        // Also check for products with same name, brand, and seller (likely exact duplicates)
        Map<String, List<Product>> keyToProducts = allProducts.stream()
            .collect(Collectors.groupingBy(p -> p.getName() + "|" + p.getBrand() + "|" + p.getSellerId()));

        int exactDuplicateCount = 0;
        for (Map.Entry<String, List<Product>> entry : keyToProducts.entrySet()) {
            if (entry.getValue().size() > 1) {
                exactDuplicateCount++;
                if (exactDuplicateCount <= 5) { // Limit output
                    log.warn("Exact Product Duplicate: '{}' ({} occurrences)",
                        entry.getKey().split("\\|")[0], entry.getValue().size());
                }
            }
        }

        if (exactDuplicateCount > 0 && exactDuplicateCount > duplicateCount) {
            log.info("Found {} potential exact product duplicates", exactDuplicateCount - duplicateCount);
        }

        log.info("Total products: {}", allProducts.size());
    }

    private void analyzeWarehouses(boolean scanOnly) {
        log.info("\n--- Warehouses Analysis ---");
        List<Warehouse> allWarehouses = warehouseRepository.findAll();

        // Check duplicates by name
        Map<String, List<Warehouse>> nameToWarehouses = allWarehouses.stream()
            .collect(Collectors.groupingBy(Warehouse::getName));

        int duplicateCount = 0;
        for (Map.Entry<String, List<Warehouse>> entry : nameToWarehouses.entrySet()) {
            if (entry.getValue().size() > 1) {
                duplicateCount++;
                log.warn("Duplicate Warehouse: '{}' ({} occurrences)", entry.getKey(), entry.getValue().size());

                if (!scanOnly) {
                    // Keep the warehouse with highest ID and remove others
                    List<Warehouse> duplicates = entry.getValue();
                    Collections.sort(duplicates, Comparator.comparing(Warehouse::getId).reversed());
                    List<Warehouse> toRemove = duplicates.subList(1, duplicates.size());
                    warehouseRepository.deleteAll(toRemove);
                    log.info("    -> Removed {} duplicate(s)", toRemove.size());
                }
            }
        }

        log.info("Total warehouses: {}", allWarehouses.size());
    }

    private void analyzeDeals(boolean scanOnly) {
        log.info("\n--- Deals Analysis ---");
        List<Deal> allDeals = dealRepository.findAll();

        // Deals have String IDs, check for duplicate IDs (shouldn't happen but possible)
        Map<String, List<Deal>> idToDeals = allDeals.stream()
            .collect(Collectors.groupingBy(Deal::getId));

        int duplicateCount = 0;
        for (Map.Entry<String, List<Deal>> entry : idToDeals.entrySet()) {
            if (entry.getValue().size() > 1) {
                duplicateCount++;
                log.error("CRITICAL: Duplicate Deal ID: '{}' ({} occurrences)", entry.getKey(), entry.getValue().size());

                if (!scanOnly) {
                    // Remove all but one
                    List<Deal> duplicates = entry.getValue();
                    List<Deal> toRemove = duplicates.subList(1, duplicates.size());
                    dealRepository.deleteAll(toRemove);
                    log.info("    -> Removed {} duplicate(s)", toRemove.size());
                }
            }
        }

        // Also check for duplicate deal titles
        Map<String, List<Deal>> titleToDeals = allDeals.stream()
            .collect(Collectors.groupingBy(Deal::getTitle));

        int titleDuplicateCount = 0;
        for (Map.Entry<String, List<Deal>> entry : titleToDeals.entrySet()) {
            if (entry.getValue().size() > 1) {
                titleDuplicateCount++;
                if (titleDuplicateCount <= 3) {
                    log.warn("Duplicate Deal Title: '{}' ({} occurrences)", entry.getKey(), entry.getValue().size());
                }
            }
        }

        if (titleDuplicateCount > 3) {
            log.info("... and {} more duplicate deal titles", titleDuplicateCount - 3);
        }

        log.info("Total deals: {}", allDeals.size());
    }

    private void analyzeNotifications(boolean scanOnly) {
        log.info("\n--- Notifications Analysis ---");
        List<Notification> allNotifications = notificationRepository.findAll();

        // Check for duplicate IDs
        Map<String, List<Notification>> idToNotifications = allNotifications.stream()
            .collect(Collectors.groupingBy(Notification::getId));

        int duplicateCount = 0;
        for (Map.Entry<String, List<Notification>> entry : idToNotifications.entrySet()) {
            if (entry.getValue().size() > 1) {
                duplicateCount++;
                log.error("CRITICAL: Duplicate Notification ID: '{}' ({} occurrences)", entry.getKey(), entry.getValue().size());

                if (!scanOnly) {
                    List<Notification> duplicates = entry.getValue();
                    List<Notification> toRemove = duplicates.subList(1, duplicates.size());
                    notificationRepository.deleteAll(toRemove);
                    log.info("    -> Removed {} duplicate(s)", toRemove.size());
                }
            }
        }

        log.info("Total notifications: {}", allNotifications.size());
    }

    private void analyzeQuotations(boolean scanOnly) {
        log.info("\n--- Quotations Analysis ---");
        List<Quotation> allQuotations = quotationRepository.findAll();

        // Check for duplicate IDs
        Map<String, List<Quotation>> idToQuotations = allQuotations.stream()
            .collect(Collectors.groupingBy(Quotation::getId));

        int duplicateCount = 0;
        for (Map.Entry<String, List<Quotation>> entry : idToQuotations.entrySet()) {
            if (entry.getValue().size() > 1) {
                duplicateCount++;
                log.error("CRITICAL: Duplicate Quotation ID: '{}' ({} occurrences)", entry.getKey(), entry.getValue().size());

                if (!scanOnly) {
                    List<Quotation> duplicates = entry.getValue();
                    List<Quotation> toRemove = duplicates.subList(1, duplicates.size());
                    quotationRepository.deleteAll(toRemove);
                    log.info("    -> Removed {} duplicate(s)", toRemove.size());
                }
            }
        }

        log.info("Total quotations: {}", allQuotations.size());
    }

    private void analyzeCartItems(boolean scanOnly) {
        log.info("\n--- Cart Items Analysis ---");
        List<CartItem> allCartItems = cartItemRepository.findAll();

        // Check for duplicate IDs
        Map<String, List<CartItem>> idToCartItems = allCartItems.stream()
            .collect(Collectors.groupingBy(CartItem::getId));

        int duplicateCount = 0;
        for (Map.Entry<String, List<CartItem>> entry : idToCartItems.entrySet()) {
            if (entry.getValue().size() > 1) {
                duplicateCount++;
                log.error("CRITICAL: Duplicate Cart Item ID: '{}' ({} occurrences)", entry.getKey(), entry.getValue().size());

                if (!scanOnly) {
                    List<CartItem> duplicates = entry.getValue();
                    List<CartItem> toRemove = duplicates.subList(1, duplicates.size());
                    cartItemRepository.deleteAll(toRemove);
                    log.info("    -> Removed {} duplicate(s)", toRemove.size());
                }
            }
        }

        log.info("Total cart items: {}", allCartItems.size());
    }

    private void analyzeOrders(boolean scanOnly) {
        log.info("\n--- Orders Analysis ---");
        List<Order> allOrders = orderRepository.findAll();

        // Check for duplicate IDs
        Map<String, List<Order>> idToOrders = allOrders.stream()
            .collect(Collectors.groupingBy(Order::getId));

        int duplicateCount = 0;
        for (Map.Entry<String, List<Order>> entry : idToOrders.entrySet()) {
            if (entry.getValue().size() > 1) {
                duplicateCount++;
                log.error("CRITICAL: Duplicate Order ID: '{}' ({} occurrences)", entry.getKey(), entry.getValue().size());

                if (!scanOnly) {
                    List<Order> duplicates = entry.getValue();
                    List<Order> toRemove = duplicates.subList(1, duplicates.size());
                    orderRepository.deleteAll(toRemove);
                    log.info("    -> Removed {} duplicate(s)", toRemove.size());
                }
            }
        }

        log.info("Total orders: {}", allOrders.size());
    }

    private void analyzeInventory(boolean scanOnly) {
        log.info("\n--- Inventory Analysis ---");
        List<Inventory> allInventory = inventoryRepository.findAll();

        // Inventory has unique constraint on warehouse_id + product_id
        // Check for duplicates based on warehouse + product
        Map<String, List<Inventory>> keyToInventory = allInventory.stream()
            .collect(Collectors.groupingBy(i ->
                i.getWarehouse().getId() + "|" + i.getProduct().getId()));

        int duplicateCount = 0;
        for (Map.Entry<String, List<Inventory>> entry : keyToInventory.entrySet()) {
            if (entry.getValue().size() > 1) {
                duplicateCount++;
                Inventory inv = entry.getValue().get(0);
                log.error("CRITICAL: Duplicate Inventory Entry - Warehouse: {}, Product: {} ({} occurrences)",
                    inv.getWarehouse().getName(), inv.getProduct().getName(), entry.getValue().size());

                if (!scanOnly) {
                    // Keep the one with highest stock
                    List<Inventory> duplicates = entry.getValue();
                    Collections.sort(duplicates, Comparator.comparing(Inventory::getPhysicalStock).reversed());
                    List<Inventory> toRemove = duplicates.subList(1, duplicates.size());
                    inventoryRepository.deleteAll(toRemove);
                    log.info("    -> Removed {} duplicate(s)", toRemove.size());
                }
            }
        }

        log.info("Total inventory entries: {}", allInventory.size());
    }
}
-- DEVFLOW H2 DATABASE DUPLICATE ANALYSIS SCRIPT
-- Connect to H2 console at http://localhost:8080/h2-console
-- JDBC URL: jdbc:h2:file:./devflow_db
-- Username: sa
-- Password: (blank)

-- ==============================================
-- 1. CHECK FOR DUPLICATE VENDORS
-- ==============================================
SELECT 'VENDORS DUPLICATE ANALYSIS' as section;
SELECT 'Duplicate Vendor Names:' as check_type;
SELECT name, COUNT(*) as duplicate_count, MIN(id) as min_id, MAX(id) as max_id
FROM vendors
GROUP BY name
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC;

-- ==============================================
-- 2. CHECK FOR DUPLICATE PRODUCTS
-- ==============================================
SELECT 'PRODUCTS DUPLICATE ANALYSIS' as section;
SELECT 'Duplicate Product Names:' as check_type;
SELECT name, COUNT(*) as duplicate_count, MIN(id) as min_id, MAX(id) as max_id
FROM products
GROUP BY name
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC;

SELECT 'Duplicate Product Key (Name+Brand+Seller):' as check_type;
SELECT name, brand, seller_id, COUNT(*) as duplicate_count
FROM products
GROUP BY name, brand, seller_id
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC
LIMIT 10;

-- ==============================================
-- 3. CHECK FOR DUPLICATE WAREHOUSES
-- ==============================================
SELECT 'WAREHOUSES DUPLICATE ANALYSIS' as section;
SELECT 'Duplicate Warehouse Names:' as check_type;
SELECT name, COUNT(*) as duplicate_count, MIN(id) as min_id, MAX(id) as max_id
FROM warehouses
GROUP BY name
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC;

-- ==============================================
-- 4. CHECK FOR DUPLICATE DEALS
-- ==============================================
SELECT 'DEALS DUPLICATE ANALYSIS' as section;
SELECT 'Duplicate Deal IDs (CRITICAL - should not happen):' as check_type;
SELECT id, COUNT(*) as duplicate_count
FROM deals
GROUP BY id
HAVING COUNT(*) > 1;

SELECT 'Duplicate Deal Titles:' as check_type;
SELECT title, COUNT(*) as duplicate_count
FROM deals
GROUP BY title
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC
LIMIT 10;

-- ==============================================
-- 5. CHECK FOR DUPLICATE NOTIFICATIONS
-- ==============================================
SELECT 'NOTIFICATIONS DUPLICATE ANALYSIS' as section;
SELECT 'Duplicate Notification IDs (CRITICAL):' as check_type;
SELECT id, COUNT(*) as duplicate_count
FROM notifications
GROUP BY id
HAVING COUNT(*) > 1;

SELECT 'Duplicate Notification Titles:' as check_type;
SELECT title, COUNT(*) as duplicate_count
FROM notifications
GROUP BY title
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC
LIMIT 10;

-- ==============================================
-- 6. CHECK FOR DUPLICATE QUOTATIONS
-- ==============================================
SELECT 'QUOTATIONS DUPLICATE ANALYSIS' as section;
SELECT 'Duplicate Quotation IDs (CRITICAL):' as check_type;
SELECT id, COUNT(*) as duplicate_count
FROM quotations
GROUP BY id
HAVING COUNT(*) > 1;

-- ==============================================
-- 7. CHECK FOR DUPLICATE CART ITEMS
-- ==============================================
SELECT 'CART ITEMS DUPLICATE ANALYSIS' as section;
SELECT 'Duplicate Cart Item IDs (CRITICAL):' as check_type;
SELECT id, COUNT(*) as duplicate_count
FROM cart_items
GROUP BY id
HAVING COUNT(*) > 1;

-- ==============================================
-- 8. CHECK FOR DUPLICATE ORDERS
-- ==============================================
SELECT 'ORDERS DUPLICATE ANALYSIS' as section;
SELECT 'Duplicate Order IDs (CRITICAL):' as check_type;
SELECT id, COUNT(*) as duplicate_count
FROM local_orders
GROUP BY id
HAVING COUNT(*) > 1;

-- ==============================================
-- 9. CHECK FOR DUPLICATE INVENTORY ENTRIES
-- ==============================================
SELECT 'INVENTORY DUPLICATE ANALYSIS' as section;
SELECT 'Duplicate Inventory (Warehouse+Product) - violates unique constraint:' as check_type;
SELECT warehouse_id, product_id, COUNT(*) as duplicate_count, MIN(id) as min_id, MAX(id) as max_id
FROM inventory
GROUP BY warehouse_id, product_id
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC;

-- ==============================================
-- 10. SUMMARY REPORT
-- ==============================================
SELECT '=== SUMMARY ===' as summary;

SELECT
    'VENDORS' as table_name,
    COUNT(*) as total_records,
    SUM(CASE WHEN cnt > 1 THEN cnt - 1 ELSE 0 END) as duplicate_entries,
    SUM(CASE WHEN cnt > 1 THEN 1 ELSE 0 END) as duplicate_groups
FROM (
    SELECT name, COUNT(*) as cnt
    FROM vendors
    GROUP BY name
) t
UNION ALL
SELECT
    'PRODUCTS' as table_name,
    COUNT(*) as total_records,
    SUM(CASE WHEN cnt > 1 THEN cnt - 1 ELSE 0 END) as duplicate_entries,
    SUM(CASE WHEN cnt > 1 THEN 1 ELSE 0 END) as duplicate_groups
FROM (
    SELECT name, COUNT(*) as cnt
    FROM products
    GROUP BY name
) t
UNION ALL
SELECT
    'WAREHOUSES' as table_name,
    COUNT(*) as total_records,
    SUM(CASE WHEN cnt > 1 THEN cnt - 1 ELSE 0 END) as duplicate_entries,
    SUM(CASE WHEN cnt > 1 THEN 1 ELSE 0 END) as duplicate_groups
FROM (
    SELECT name, COUNT(*) as cnt
    FROM warehouses
    GROUP BY name
) t
UNION ALL
SELECT
    'DEALS' as table_name,
    COUNT(*) as total_records,
    SUM(CASE WHEN cnt > 1 THEN cnt - 1 ELSE 0 END) as duplicate_entries,
    SUM(CASE WHEN cnt > 1 THEN 1 ELSE 0 END) as duplicate_groups
FROM (
    SELECT title, COUNT(*) as cnt
    FROM deals
    GROUP BY title
) t
UNION ALL
SELECT
    'NOTIFICATIONS' as table_name,
    COUNT(*) as total_records,
    SUM(CASE WHEN cnt > 1 THEN cnt - 1 ELSE 0 END) as duplicate_entries,
    SUM(CASE WHEN cnt > 1 THEN 1 ELSE 0 END) as duplicate_groups
FROM (
    SELECT title, COUNT(*) as cnt
    FROM notifications
    GROUP BY title
) t;

-- ==============================================
-- 11. CLEANUP QUERIES (UNCOMMENT TO RUN)
-- ==============================================
/*
-- Delete duplicate vendors (keep the highest ID)
DELETE FROM vendors
WHERE id IN (
    SELECT id FROM (
        SELECT id, ROW_NUMBER() OVER (PARTITION BY name ORDER BY id DESC) as rn
        FROM vendors
    ) t
    WHERE t.rn > 1
);

-- Delete duplicate products (keep the highest ID)
DELETE FROM products
WHERE id IN (
    SELECT id FROM (
        SELECT id, ROW_NUMBER() OVER (PARTITION BY name ORDER BY id DESC) as rn
        FROM products
    ) t
    WHERE t.rn > 1
);

-- Delete duplicate warehouses (keep the highest ID)
DELETE FROM warehouses
WHERE id IN (
    SELECT id FROM (
        SELECT id, ROW_NUMBER() OVER (PARTITION BY name ORDER BY id DESC) as rn
        FROM warehouses
    ) t
    WHERE t.rn > 1
);

-- Delete duplicate deals (CRITICAL - keep first occurrence)
DELETE FROM deals
WHERE id IN (
    SELECT id FROM (
        SELECT id, ROW_NUMBER() OVER (PARTITION BY id ORDER BY id) as rn
        FROM deals
    ) t
    WHERE t.rn > 1
);

-- Delete duplicate notifications (CRITICAL - keep first occurrence)
DELETE FROM notifications
WHERE id IN (
    SELECT id FROM (
        SELECT id, ROW_NUMBER() OVER (PARTITION BY id ORDER BY id) as rn
        FROM notifications
    ) t
    WHERE t.rn > 1
);

-- Delete duplicate quotations (CRITICAL - keep first occurrence)
DELETE FROM quotations
WHERE id IN (
    SELECT id FROM (
        SELECT id, ROW_NUMBER() OVER (PARTITION BY id ORDER BY id) as rn
        FROM quotations
    ) t
    WHERE t.rn > 1
);

-- Delete duplicate cart items (CRITICAL - keep first occurrence)
DELETE FROM cart_items
WHERE id IN (
    SELECT id FROM (
        SELECT id, ROW_NUMBER() OVER (PARTITION BY id ORDER BY id) as rn
        FROM cart_items
    ) t
    WHERE t.rn > 1
);

-- Delete duplicate orders (CRITICAL - keep first occurrence)
DELETE FROM local_orders
WHERE id IN (
    SELECT id FROM (
        SELECT id, ROW_NUMBER() OVER (PARTITION BY id ORDER BY id) as rn
        FROM local_orders
    ) t
    WHERE t.rn > 1
);

-- Delete duplicate inventory entries (keep highest ID)
DELETE FROM inventory
WHERE id IN (
    SELECT id FROM (
        SELECT id, ROW_NUMBER() OVER (PARTITION BY warehouse_id, product_id ORDER BY id DESC) as rn
        FROM inventory
    ) t
    WHERE t.rn > 1
);
*/

-- ==============================================
-- 12. VERIFICATION AFTER CLEANUP
-- ==============================================
SELECT '=== VERIFICATION QUERIES ===' as verification;

-- Check for any remaining duplicates
SELECT 'Remaining Vendor Duplicates:' as check_type;
SELECT COUNT(*) as remaining FROM (
    SELECT name, COUNT(*) as cnt FROM vendors GROUP BY name HAVING COUNT(*) > 1
) t;

SELECT 'Remaining Product Duplicates:' as check_type;
SELECT COUNT(*) as remaining FROM (
    SELECT name, COUNT(*) as cnt FROM products GROUP BY name HAVING COUNT(*) > 1
) t;

SELECT 'Remaining Deal ID Duplicates:' as check_type;
SELECT COUNT(*) as remaining FROM (
    SELECT id, COUNT(*) as cnt FROM deals GROUP BY id HAVING COUNT(*) > 1
) t;
-- DEV FLOW — PostgreSQL Schema
-- Run this after the Spring Boot app creates tables (ddl-auto=update)
-- This adds indexes, RLS policies, and seed verification

-- ============================================================
-- EXTENSIONS
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- for fuzzy search on products

-- ============================================================
-- INDEXES (performance)
-- ============================================================

-- Users
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Products
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_name_trgm ON products USING gin(name gin_trgm_ops);

-- Quotations
CREATE INDEX IF NOT EXISTS idx_quotations_customer ON quotations(customer_id);
CREATE INDEX IF NOT EXISTS idx_quotations_sales_rep ON quotations(sales_rep_id);
CREATE INDEX IF NOT EXISTS idx_quotations_status ON quotations(status);
CREATE INDEX IF NOT EXISTS idx_quotations_created ON quotations(created_at);

-- QuotationLines
CREATE INDEX IF NOT EXISTS idx_quotation_lines_quotation ON quotation_lines(quotation_id);

-- Stock
CREATE INDEX IF NOT EXISTS idx_stock_warehouse_product ON stock(warehouse_id, product_id);

-- Payments
CREATE INDEX IF NOT EXISTS idx_payments_quotation ON payments(quotation_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

-- Ratings
CREATE INDEX IF NOT EXISTS idx_ratings_ratee ON ratings(ratee_id);

-- Audit Log
CREATE INDEX IF NOT EXISTS idx_audit_log_entity ON audit_log(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_timestamp ON audit_log(timestamp);

-- Bids
CREATE INDEX IF NOT EXISTS idx_bids_requirement ON bids(requirement_id);
CREATE INDEX IF NOT EXISTS idx_bids_vendor ON bids(vendor_id);

-- ============================================================
-- VIEWS (for reporting)
-- ============================================================

-- Stalled quotations (no update in last 7 days)
CREATE OR REPLACE VIEW v_stalled_quotations AS
SELECT q.id, q.status, q.created_at, q.updated_at,
       u.email AS customer_email,
       r.email AS rep_email,
       EXTRACT(EPOCH FROM (NOW() - q.updated_at))/86400 AS days_inactive
FROM quotations q
JOIN users u ON q.customer_id = u.id
JOIN users r ON q.sales_rep_id = r.id
WHERE q.status IN ('DRAFT','PENDING_L1','PENDING_L2','SENT_TO_CUSTOMER','UNDER_NEGOTIATION')
  AND q.updated_at < NOW() - INTERVAL '7 days';

-- Discount anomaly view (rep's discount vs their historical average)
CREATE OR REPLACE VIEW v_discount_anomalies AS
SELECT 
    ql.quotation_id,
    q.sales_rep_id,
    u.email AS rep_email,
    AVG(ql.discount_pct) AS avg_discount_this_quote,
    (SELECT AVG(ql2.discount_pct) 
     FROM quotation_lines ql2 
     JOIN quotations q2 ON ql2.quotation_id = q2.id 
     WHERE q2.sales_rep_id = q.sales_rep_id 
       AND q2.created_at < q.created_at) AS rep_historical_avg
FROM quotation_lines ql
JOIN quotations q ON ql.quotation_id = q.id
JOIN users u ON q.sales_rep_id = u.id
GROUP BY ql.quotation_id, q.sales_rep_id, u.email, q.created_at
HAVING AVG(ql.discount_pct) > (
    SELECT AVG(ql3.discount_pct) * 1.5
    FROM quotation_lines ql3 
    JOIN quotations q3 ON ql3.quotation_id = q3.id 
    WHERE q3.sales_rep_id = q.sales_rep_id
);

-- Revenue summary
CREATE OR REPLACE VIEW v_revenue_summary AS
SELECT 
    DATE_TRUNC('month', p.created_at) AS month,
    COUNT(*) AS total_payments,
    SUM(p.amount) AS gross_revenue,
    SUM(p.platform_fee) AS platform_revenue,
    SUM(p.amount - p.platform_fee) AS seller_payouts
FROM payments p
WHERE p.status = 'RELEASED'
GROUP BY DATE_TRUNC('month', p.created_at)
ORDER BY month DESC;

-- ============================================================
-- HELPFUL VERIFICATION QUERIES
-- ============================================================
-- Check seed data: SELECT role, COUNT(*) FROM users GROUP BY role;
-- Check stock: SELECT w.name, p.name, s.qty_available FROM stock s JOIN warehouses w ON s.warehouse_id=w.id JOIN products p ON s.product_id=p.id;
-- Check quotations: SELECT id, status, blended_risk_score FROM quotations;

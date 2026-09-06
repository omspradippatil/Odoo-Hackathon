-- DEV FLOW Database Initialization
-- MySQL Credentials (Local Environment)
-- Username: root
-- Password: OM@om123

-- This file is a placeholder for future database schema definitions.
-- Currently, DEV FLOW uses PostgreSQL in the final architecture plan,
-- but as requested, these are the local MySQL credentials for reference.

CREATE DATABASE IF NOT EXISTS dev_flow;
USE dev_flow;

-- Example User Table (Future Reference)
-- CREATE TABLE users (
--   id VARCHAR(255) PRIMARY KEY,
--   email VARCHAR(255) UNIQUE NOT NULL,
--   password_hash VARCHAR(255) NOT NULL,
--   full_name VARCHAR(255) NOT NULL,
--   role ENUM('BUYER', 'SELLER', 'SALES_REP', 'SALES_MANAGER', 'FINANCE_OPERATIONS', 'ADMIN') NOT NULL,
--   organization VARCHAR(255),
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

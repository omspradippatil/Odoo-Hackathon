# DEVFLOW Database Duplicate Detection & Cleanup Guide

## Your Database Setup

**Database Type**: H2 File-Based Database (not MySQL)
**Database Files**:
- `backend/devflow_db.mv.db` (6.6MB - data file)
- `backend/devflow_db.lock.db` (lock file)

**Connection Details**:
- JDBC URL: `jdbc:h2:file:./devflow_db`
- Username: `sa`
- Password: (blank)
- H2 Console: http://localhost:8080/h2-console

## Quick Start

### Option 1: Use H2 Console (Recommended for beginners)

1. **Start your Spring Boot backend**:
   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```

2. **Open H2 Console**: http://localhost:8080/h2-console

3. **Connect with these settings**:
   - JDBC URL: `jdbc:h2:file:./devflow_db`
   - Username: `sa`
   - Password: (leave blank)

4. **Run the analysis queries** from `backend/duplicate_analysis.sql`

### Option 2: Use the Java Cleanup Tool

The Java tool `DuplicateCleanup.java` has been created in:
`backend/src/main/java/com/devflow/backend/config/DuplicateCleanup.java`

**To run in scan-only mode** (no deletion):
```bash
cd backend
./mvnw spring-boot:run --scan-only
```

**To run with cleanup** (removes duplicates):
```bash
cd backend
./mvnw spring-boot:run
```

### Option 3: Use Python Script (Advanced)

```bash
# Install dependencies
pip install jaydebeapi JPype1

# Stop backend first (it locks the database)
# Then run:
python check_h2_duplicates.py
```

## What Gets Checked

The tools analyze these tables for duplicates:

### 1. **Vendors** (by name)
- Checks for vendors with duplicate names
- Keeps highest ID, removes others

### 2. **Products** (by name, brand, seller)
- Checks for duplicate product names
- Checks for exact duplicates (name + brand + seller)

### 3. **Warehouses** (by name)
- Checks for warehouses with duplicate names

### 4. **Deals** (by ID - CRITICAL)
- Should never have duplicate IDs
- If found, removes duplicates immediately

### 5. **Notifications** (by ID - CRITICAL)
- Should never have duplicate IDs

### 6. **Quotations** (by ID - CRITICAL)
- Should never have duplicate IDs

### 7. **Cart Items** (by ID - CRITICAL)
- Should never have duplicate IDs

### 8. **Orders** (by ID - CRITICAL)
- Should never have duplicate IDs

### 9. **Inventory** (by warehouse + product)
- Has unique constraint, but checks for violations

## Expected Results

Based on your `DataSeeder.java`, duplicates **should not exist** because:

1. **Products** have unique SKU suffixes: `name + " [SKU-" + i + "]"`
2. **Vendors** have unique names with suffixes: `vName + " " + (1000 + vendors.size())`
3. **Deals, Notifications, Quotations, Orders** all use unique IDs with counters

## If Duplicates Are Found

### Step 1: Backup Your Database

```bash
cd backend
cp devflow_db.mv.db devflow_db.mv.db.backup
```

### Step 2: Run Cleanup

**Via H2 Console**:
```sql
-- Delete duplicate vendors (keep highest ID)
DELETE FROM vendors
WHERE id IN (
    SELECT id FROM (
        SELECT id, ROW_NUMBER() OVER (PARTITION BY name ORDER BY id DESC) as rn
        FROM vendors
    ) t
    WHERE t.rn > 1
);

-- Similar for products, warehouses, etc.
-- See duplicate_analysis.sql for all cleanup queries
```

**Via Java Tool**:
Run without `--scan-only` flag to automatically remove duplicates.

### Step 3: Verify Cleanup

Run analysis queries again to confirm no duplicates remain.

## Database Statistics

Your database currently has approximately:
- 2,100 vendors
- 2,100 products
- 2,100 warehouses
- 2,100 deals
- 2,100 notifications
- 2,100 quotations
- 1,050 orders
- 2,100 cart items
- 2,100 inventory entries

## Troubleshooting

### "Database is locked" error
- Stop the Spring Boot backend before using Python script
- Or use H2 Console while backend is running

### "Cannot connect to H2"
- Make sure backend is running
- Check H2 console is enabled in `application.properties`

### "No duplicates found"
- This is good! Your data seeding is working correctly
- The unique SKU/name suffixes prevent duplicates

## Files Created

1. `backend/duplicate_analysis.sql` - SQL queries for analysis & cleanup
2. `check_h2_duplicates.py` - Python tool for duplicate detection
3. `backend/src/main/java/com/devflow/backend/config/DuplicateCleanup.java` - Java cleanup tool

## Need Help?

If you find duplicates or have questions:
1. Run the scan-only mode first to see what would be deleted
2. Always backup before cleanup
3. Check the logs for detailed information about what was removed
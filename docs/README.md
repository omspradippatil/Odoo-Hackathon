# Documentation

This folder contains all project documentation and reference materials.

## Structure

```
docs/
├── README.md                    # This file
├── DUPLICATE_CLEANUP_GUIDE.md   # Database duplicate detection & cleanup guide
├── database/
│   ├── database.sql             # Database schema reference
│   ├── duplicate_analysis.sql   # SQL queries for duplicate detection/cleanup
│   └── database-duplicate-dashboard.html  # Interactive duplicate analysis dashboard
```

## Quick Links

- [Duplicate Cleanup Guide](./DUPLICATE_CLEANUP_GUIDE.md) - Complete guide for finding/removing duplicates
- [Duplicate Analysis SQL](./database/duplicate_analysis.sql) - Run these queries in H2 Console
- [Duplicate Dashboard](./database/database-duplicate-dashboard.html) - Visual dashboard (open in browser)
- [Database Schema](./database/database.sql) - Reference schema

## How to Use

### 1. Check for Duplicates (via H2 Console)
1. Start backend: `cd backend && ./mvnw spring-boot:run`
2. Open: http://localhost:8080/h2-console
3. Connect: `jdbc:h2:file:./devflow_db`, user: `sa`, password: (blank)
4. Run queries from `duplicate_analysis.sql`

### 2. Check for Duplicates (via Java Tool)
```bash
cd backend
./mvnw spring-boot:run --scan-only   # Check only
./mvnw spring-boot:run               # Check and clean
```

### 3. Check for Duplicates (via Python)
```bash
pip install jaydebeapi JPype1
python ../scripts/check_h2_duplicates.py
```

### 4. Backup Before Cleanup
```bash
cp backend/devflow_db.mv.db backend/devflow_db.mv.db.backup
```
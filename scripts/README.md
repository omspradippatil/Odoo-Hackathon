# Scripts

Development and maintenance scripts for the project.

## Contents

- `check_h2_duplicates.py` - Python utility to scan H2 database for duplicates

## Usage

### Python Duplicate Checker

```bash
# Install dependencies
pip install jaydebeapi JPype1

# Run the checker (ensure backend is STOPPED first)
python check_h2_duplicates.py
```

This script will:
1. Connect to the H2 database file
2. Scan all tables for duplicate records
3. Report findings with details
4. Provide cleanup instructions

## Prerequisites

- Python 3.8+
- H2 database JAR (auto-downloaded on first run)
- Spring Boot backend **must be stopped** (it locks the database file)
#!/usr/bin/env python3
"""
DEVFLOW H2 Database Duplicate Checker
This script helps identify duplicate records in your H2 database.
"""

import subprocess
import os
import sys
import tempfile
import time

def check_prerequisites():
    """Check if required tools are available."""
    try:
        import jaydebeapi
        print("✓ jaydebeapi available")
    except ImportError:
        print("✗ jaydebeapi not installed. Installing dependencies...")
        try:
            subprocess.check_call([sys.executable, "-m", "pip", "install", "jaydebeapi", "JPype1"])
            print("✓ Dependencies installed")
        except Exception as e:
            print(f"✗ Failed to install dependencies: {e}")
            print("\nPlease install dependencies manually:")
            print("  pip install jaydebeapi JPype1")
            return False

    # Check if H2 driver JAR exists
    h2_jar_path = os.path.expanduser("~/.m2/repository/com/h2database/h2/2.1.214/h2-2.1.214.jar")
    if not os.path.exists(h2_jar_path):
        print(f"✗ H2 driver not found at {h2_jar_path}")
        print("Downloading H2 driver...")
        try:
            # Create directory
            os.makedirs(os.path.dirname(h2_jar_path), exist_ok=True)

            # Download H2 driver
            import urllib.request
            url = "https://repo1.maven.org/maven2/com/h2database/h2/2.1.214/h2-2.1.214.jar"
            print(f"Downloading {url}...")
            urllib.request.urlretrieve(url, h2_jar_path)
            print(f"✓ H2 driver downloaded to {h2_jar_path}")
        except Exception as e:
            print(f"✗ Failed to download H2 driver: {e}")
            print("\nPlease download H2 driver manually:")
            print("  wget https://repo1.maven.org/maven2/com/h2database/h2/2.1.214/h2-2.1.214.jar")
            print(f"  mkdir -p ~/.m2/repository/com/h2database/h2/2.1.214/")
            print(f"  mv h2-2.1.214.jar ~/.m2/repository/com/h2database/h2/2.1.214/")
            return False

    print("✓ H2 driver found")
    return True

def create_h2_connection():
    """Create connection to H2 database."""
    import jaydebeapi

    # Database path
    db_path = os.path.join(os.getcwd(), "backend/devflow_db")

    # JDBC URL
    jdbc_url = f"jdbc:h2:file:{db_path}"

    # H2 driver JAR path
    h2_jar_path = os.path.expanduser("~/.m2/repository/com/h2database/h2/2.1.214/h2-2.1.214.jar")

    try:
        # Connect to H2 database
        conn = jaydebeapi.connect("org.h2.Driver",
                                 jdbc_url,
                                 ["sa", ""],
                                 h2_jar_path)
        print(f"✓ Connected to H2 database at {db_path}")
        return conn
    except Exception as e:
        print(f"✗ Failed to connect to H2 database: {e}")
        print("\nMake sure:")
        print("  1. The Spring Boot backend is NOT running (it locks the database)")
        print("  2. The database file exists: backend/devflow_db.mv.db")
        return None

def run_sql_analysis(conn):
    """Run duplicate analysis queries."""
    cursor = conn.cursor()

    print("\n" + "="*60)
    print("DATABASE DUPLICATE ANALYSIS REPORT")
    print("="*60)

    # Queries to analyze duplicates
    queries = [
        # 1. Vendors
        ("VENDORS - Duplicate Names", """
            SELECT name, COUNT(*) as count, MIN(id) as min_id, MAX(id) as max_id
            FROM vendors
            GROUP BY name
            HAVING COUNT(*) > 1
            ORDER BY count DESC
        """),

        # 2. Products
        ("PRODUCTS - Duplicate Names", """
            SELECT name, COUNT(*) as count, MIN(id) as min_id, MAX(id) as max_id
            FROM products
            GROUP BY name
            HAVING COUNT(*) > 1
            ORDER BY count DESC
            LIMIT 20
        """),

        # 3. Deals
        ("DEALS - Duplicate IDs (CRITICAL)", """
            SELECT id, COUNT(*) as count
            FROM deals
            GROUP BY id
            HAVING COUNT(*) > 1
        """),

        ("DEALS - Duplicate Titles", """
            SELECT title, COUNT(*) as count
            FROM deals
            GROUP BY title
            HAVING COUNT(*) > 1
            ORDER BY count DESC
            LIMIT 10
        """),

        # 4. Notifications
        ("NOTIFICATIONS - Duplicate IDs (CRITICAL)", """
            SELECT id, COUNT(*) as count
            FROM notifications
            GROUP BY id
            HAVING COUNT(*) > 1
        """),

        # 5. Quotations
        ("QUOTATIONS - Duplicate IDs (CRITICAL)", """
            SELECT id, COUNT(*) as count
            FROM quotations
            GROUP BY id
            HAVING COUNT(*) > 1
        """),

        # 6. Cart Items
        ("CART ITEMS - Duplicate IDs (CRITICAL)", """
            SELECT id, COUNT(*) as count
            FROM cart_items
            GROUP BY id
            HAVING COUNT(*) > 1
        """),

        # 7. Orders
        ("ORDERS - Duplicate IDs (CRITICAL)", """
            SELECT id, COUNT(*) as count
            FROM local_orders
            GROUP BY id
            HAVING COUNT(*) > 1
        """),

        # 8. Inventory
        ("INVENTORY - Duplicate Warehouse+Product (violates unique constraint)", """
            SELECT warehouse_id, product_id, COUNT(*) as count, MIN(id) as min_id, MAX(id) as max_id
            FROM inventory
            GROUP BY warehouse_id, product_id
            HAVING COUNT(*) > 1
            ORDER BY count DESC
        """),
    ]

    total_duplicates = 0

    for title, query in queries:
        try:
            cursor.execute(query)
            results = cursor.fetchall()

            if results:
                print(f"\n⚠️  {title}:")
                print("-" * 40)
                for row in results:
                    print(f"  {row}")
                total_duplicates += len(results)
            else:
                print(f"\n✓ {title}: No duplicates found")

        except Exception as e:
            print(f"\n✗ {title}: Error - {e}")

    # Summary
    print("\n" + "="*60)
    print("SUMMARY")
    print("="*60)

    if total_duplicates > 0:
        print(f"⚠️  Found {total_duplicates} duplicate group(s) across all tables")
        print("\nRecommended actions:")
        print("  1. Backup your database first:")
        print("     cp backend/devflow_db.mv.db backend/devflow_db.mv.db.backup")
        print("  2. Review the duplicate_analysis.sql file for cleanup queries")
        print("  3. Run cleanup queries manually via H2 Console")
    else:
        print("✅ No duplicate groups found!")

    cursor.close()

def generate_cleanup_guide():
    """Generate a cleanup guide."""
    print("\n" + "="*60)
    print("HOW TO CLEAN UP DUPLICATES")
    print("="*60)

    print("""
1. ACCESS H2 CONSOLE:
   - Start your Spring Boot backend
   - Open browser to http://localhost:8080/h2-console
   - JDBC URL: jdbc:h2:file:./devflow_db
   - Username: sa
   - Password: (leave blank)

2. BACKUP FIRST:
   Run in H2 Console:
     BACKUP TO 'backup.zip';

3. RUN CLEANUP QUERIES:
   Open duplicate_analysis.sql in backend/ folder
   Uncomment the DELETE queries (lines starting with -- Delete)
   Run them one by one in H2 Console

4. ALTERNATIVE - USE PYTHON CLEANUP:
   Run: python cleanup_h2_duplicates.py

5. VERIFY:
   Re-run this script to verify duplicates are gone

IMPORTANT: Always backup before deleting data!
    """)

def main():
    print("DEVFLOW H2 Database Duplicate Checker")
    print("="*60)

    # Check prerequisites
    if not check_prerequisites():
        print("\nCannot proceed without prerequisites.")
        return 1

    # Check if backend is running
    try:
        response = subprocess.check_output(["curl", "-s", "http://localhost:8080/actuator/health"],
                                          stderr=subprocess.DEVNULL, text=True)
        if "UP" in response:
            print("\n⚠️  WARNING: Backend is running and may lock the database")
            print("   Stop the backend before running this tool:")
            print("   Ctrl+C in backend terminal or: kill $(lsof -ti:8080)")
            print("\nContinue anyway? (y/N): ", end="")
            choice = input().strip().lower()
            if choice != 'y':
                print("Exiting...")
                return 0
    except:
        print("✓ Backend is not running - good")

    # Connect to H2
    conn = create_h2_connection()
    if not conn:
        return 1

    try:
        # Run analysis
        run_sql_analysis(conn)

        # Generate cleanup guide
        generate_cleanup_guide()

    finally:
        conn.close()
        print("\n✓ Connection closed")

    return 0

if __name__ == "__main__":
    sys.exit(main())
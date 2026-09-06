#!/bin/bash
sleep 5

echo "1. Upload product with image..."
curl -s -X POST http://localhost:8080/api/products \
     -H "Content-Type: application/json" \
     -d '{
           "name": "SQL Test Product",
           "imageUrl": "https://example.com/sql-image.png",
           "sellerName": "SQL Vendor"
         }' > /dev/null

echo "2. Querying database via raw SQL..."
curl -s http://localhost:8080/api/sql-test | jq .

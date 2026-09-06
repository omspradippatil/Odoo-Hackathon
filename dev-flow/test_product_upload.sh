#!/bin/bash

# Give the server a moment to finish starting
sleep 5

echo "1. Seller uploads a new product with an image..."
curl -X POST http://localhost:8080/api/products \
     -H "Content-Type: application/json" \
     -d '{
           "name": "Industrial Diesel Generator 10kVA",
           "category": "Power Generation",
           "brand": "Caterpillar",
           "basePrice": 120000.0,
           "imageUrl": "https://images.unsplash.com/photo-1581092335397-9583eb92d232?auto=format&fit=crop&q=80&w=800",
           "description": "Heavy-duty diesel generator for industrial backup power.",
           "sellerName": "Global Power Tech",
           "sellerId": "VND-GPT-445",
           "city": "Mumbai",
           "stock": 5,
           "trustScore": 98,
           "verificationStatus": "VERIFIED"
         }'

echo "\n\n2. Local user fetches available products..."
curl -s http://localhost:8080/api/products | grep -o "Industrial Diesel Generator 10kVA"
echo "\nCheck if the image URL is present in the database response:"
curl -s http://localhost:8080/api/products | grep -o "https://images.unsplash.com/photo-1581092335397-9583eb92d232?auto=format&fit=crop&q=80&w=800"


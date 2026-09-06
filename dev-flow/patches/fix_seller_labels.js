const fs = require('fs');

let content = fs.readFileSync('src/app/seller/products/new/page.tsx', 'utf8');

content = content.replace(
  'Original Price (₹)',
  'MRP (Original Price ₹)'
);

content = content.replace(
  'Selling Price (₹)',
  'Discounted Selling Price (₹)'
);

fs.writeFileSync('src/app/seller/products/new/page.tsx', content);

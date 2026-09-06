const fs = require('fs');

let content = fs.readFileSync('../backend/src/main/java/com/devflow/backend/product/Product.java', 'utf8');

// Add originalPrice and sellingPrice
content = content.replace(
  'private Double basePrice;',
  'private Double basePrice;\n    private Double originalPrice;\n    private Double sellingPrice;'
);

fs.writeFileSync('../backend/src/main/java/com/devflow/backend/product/Product.java', content);

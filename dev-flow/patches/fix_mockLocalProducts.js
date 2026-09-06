const fs = require('fs');

let content = fs.readFileSync('src/lib/mockLocalProducts.ts', 'utf8');

content = content.replace(
  'price: number;',
  'price: number;\n  originalPrice?: number;\n  sellingPrice?: number;'
);

fs.writeFileSync('src/lib/mockLocalProducts.ts', content);

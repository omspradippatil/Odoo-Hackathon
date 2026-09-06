const fs = require('fs');

let content = fs.readFileSync('src/lib/mockLocalProducts.ts', 'utf8');

content = content.replace(
  'sellingPrice?: number;',
  'sellingPrice?: number;\n  distanceKm?: number;'
);

fs.writeFileSync('src/lib/mockLocalProducts.ts', content);

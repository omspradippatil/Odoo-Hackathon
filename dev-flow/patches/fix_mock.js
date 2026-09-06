const fs = require('fs');
let content = fs.readFileSync('src/lib/mockLocalProducts.ts', 'utf8');
content = content.replace(/\\\$/g, '$');
content = content.replace(/\\`/g, '\`');
fs.writeFileSync('src/lib/mockLocalProducts.ts', content);

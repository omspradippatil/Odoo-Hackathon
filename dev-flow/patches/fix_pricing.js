const fs = require('fs');
let content = fs.readFileSync('src/lib/pricingConfig.ts', 'utf8');
content = content.replace(/\\\$/g, '$');
content = content.replace(/\\`/g, '`');
fs.writeFileSync('src/lib/pricingConfig.ts', content);

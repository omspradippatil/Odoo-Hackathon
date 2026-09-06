const fs = require('fs');

let content = fs.readFileSync('src/types/auth.ts', 'utf8');

content = content.replace(
  'FINANCE_OPERATIONS = \'FINANCE_OPERATIONS\',',
  'FINANCE_OPERATIONS = \'FINANCE_OPERATIONS\',\n  CUSTOMER = \'CUSTOMER\','
);

fs.writeFileSync('src/types/auth.ts', content);

const fs = require('fs');
let content = fs.readFileSync('src/components/layout/WorkspaceLayout.tsx', 'utf8');

content = content.replace(
  '[UserRole.ADMIN]: []',
  '[UserRole.ADMIN]: [],\n  [UserRole.CUSTOMER]: [\n    { label: "Home", href: "/customer", icon: Home },\n    { label: "My Quotes", href: "/customer/quotes", icon: FileText },\n    { label: "My Deals", href: "/customer/deals", icon: Briefcase }\n  ]'
);

content = content.replace(
  '[UserRole.ADMIN]: "ADMIN",',
  '[UserRole.ADMIN]: "ADMIN",\n  [UserRole.CUSTOMER]: "CUSTOMER",'
);

content = content.replace(
  'const ROLE_LABELS = {\n  [UserRole.BUYER]: "Buyer",\n  [UserRole.SELLER]: "Seller",\n  [UserRole.SALES_REP]: "Sales Rep",\n  [UserRole.SALES_MANAGER]: "Sales Manager",\n  [UserRole.FINANCE_OPERATIONS]: "Operations",\n  [UserRole.ADMIN]: "Administrator"\n};',
  'const ROLE_LABELS = {\n  [UserRole.BUYER]: "Buyer",\n  [UserRole.SELLER]: "Seller",\n  [UserRole.SALES_REP]: "Sales Rep",\n  [UserRole.SALES_MANAGER]: "Sales Manager",\n  [UserRole.FINANCE_OPERATIONS]: "Operations",\n  [UserRole.ADMIN]: "Administrator",\n  [UserRole.CUSTOMER]: "Customer"\n};'
);

fs.writeFileSync('src/components/layout/WorkspaceLayout.tsx', content);

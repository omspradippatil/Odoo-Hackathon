const fs = require('fs');
let content = fs.readFileSync('src/components/layout/WorkspaceLayout.tsx', 'utf8');

content = content.replace(
  '[UserRole.ADMIN]: "Admin"\n};',
  '[UserRole.ADMIN]: "Admin",\n  [UserRole.CUSTOMER]: "Customer Portal"\n};'
);

fs.writeFileSync('src/components/layout/WorkspaceLayout.tsx', content);

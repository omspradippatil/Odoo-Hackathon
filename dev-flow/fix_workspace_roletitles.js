const fs = require('fs');
let content = fs.readFileSync('src/components/layout/WorkspaceLayout.tsx', 'utf8');

content = content.replace(
  '[UserRole.ADMIN]: "Admin Console"',
  '[UserRole.ADMIN]: "Admin Console",\n  [UserRole.CUSTOMER]: "Customer Portal"'
);

fs.writeFileSync('src/components/layout/WorkspaceLayout.tsx', content);

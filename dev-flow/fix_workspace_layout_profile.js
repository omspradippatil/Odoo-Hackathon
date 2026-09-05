const fs = require('fs');
let content = fs.readFileSync('src/components/layout/WorkspaceLayout.tsx', 'utf8');

// Find the profile name span and add truncate
content = content.replace(/<span className="text-sm font-bold text-navy">/g, '<span className="text-sm font-bold text-navy truncate max-w-[120px]">');

fs.writeFileSync('src/components/layout/WorkspaceLayout.tsx', content);

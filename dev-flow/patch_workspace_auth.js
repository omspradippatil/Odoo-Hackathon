const fs = require('fs');
let content = fs.readFileSync('src/components/layout/WorkspaceLayout.tsx', 'utf8');

if (!content.includes('import { AuthGate }')) {
  content = content.replace(
    'import { Navbar } from "@/components/sections/Navbar";',
    'import { Navbar } from "@/components/sections/Navbar";\nimport { AuthGate } from "@/components/ui/AuthGate";'
  );
}

const signatureOld = 'export function WorkspaceLayout({ children, role }: { children: React.ReactNode, role: UserRole }) {';
const signatureNew = 'export function WorkspaceLayout({ children, role, requireAuth = false }: { children: React.ReactNode, role: UserRole, requireAuth?: boolean }) {';
content = content.replace(signatureOld, signatureNew);

const renderOld = `if (isGuest) {\n    return (\n      <div className="min-h-screen bg-warm text-navy selection:bg-coral/20 flex flex-col relative">\n        <Navbar />\n        <FlowPathBackground />\n        <main className="flex-1 pt-24 px-4 md:px-8 max-w-7xl mx-auto w-full relative z-10">\n          {children}\n        </main>\n      </div>\n    );\n  }`;
const renderNew = `if (isGuest) {\n    return (\n      <div className="min-h-screen bg-warm text-navy selection:bg-coral/20 flex flex-col relative">\n        <Navbar />\n        <FlowPathBackground />\n        <main className="flex-1 pt-24 px-4 md:px-8 max-w-7xl mx-auto w-full relative z-10">\n          {requireAuth ? <AuthGate /> : children}\n        </main>\n      </div>\n    );\n  }`;
content = content.replace(renderOld, renderNew);

fs.writeFileSync('src/components/layout/WorkspaceLayout.tsx', content);

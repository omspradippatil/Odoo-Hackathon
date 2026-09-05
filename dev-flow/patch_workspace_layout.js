const fs = require('fs');
let content = fs.readFileSync('src/components/layout/WorkspaceLayout.tsx', 'utf8');

if (!content.includes('import { Navbar }')) {
  content = content.replace(
    'import { FlowPathBackground } from "@/components/ui/dashboard/FlowPathBackground";',
    'import { FlowPathBackground } from "@/components/ui/dashboard/FlowPathBackground";\nimport { Navbar } from "@/components/sections/Navbar";'
  );
}

if (!content.includes('const [isGuest, setIsGuest]')) {
  content = content.replace(
    'const [mobileMenuOpen, setMobileMenuOpen] = useState(false);',
    'const [mobileMenuOpen, setMobileMenuOpen] = useState(false);\n  const [isGuest, setIsGuest] = useState(false);\n  const [isLoaded, setIsLoaded] = useState(false);\n\n  React.useEffect(() => {\n    const user = sessionStorage.getItem("devflow_user");\n    setIsGuest(!user);\n    setIsLoaded(true);\n  }, []);'
  );
}

const renderReturnPattern = /return \([\s\S]*?<div className="min-h-screen/m;
const newRenderReturn = `if (!isLoaded) return null; // Hydration guard\n\n  if (isGuest) {\n    return (\n      <div className="min-h-screen bg-warm text-navy selection:bg-coral/20 flex flex-col relative">\n        <Navbar />\n        <FlowPathBackground />\n        <main className="flex-1 pt-24 px-4 md:px-8 max-w-7xl mx-auto w-full relative z-10">\n          {children}\n        </main>\n      </div>\n    );\n  }\n\n  return (\n    <div className="min-h-screen`;
content = content.replace(renderReturnPattern, newRenderReturn);

fs.writeFileSync('src/components/layout/WorkspaceLayout.tsx', content);

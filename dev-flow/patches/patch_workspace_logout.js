const fs = require('fs');
let content = fs.readFileSync('src/components/layout/WorkspaceLayout.tsx', 'utf8');

if (!content.includes('import { useRouter }')) {
  content = content.replace(
    'import { usePathname } from "next/navigation";',
    'import { usePathname, useRouter } from "next/navigation";'
  );
}

if (!content.includes('import { authService }')) {
  content = content.replace(
    'import { AuthGate } from "@/components/ui/AuthGate";',
    'import { AuthGate } from "@/components/ui/AuthGate";\nimport { authService } from "@/lib/authService";'
  );
}

if (!content.includes('const handleLogout = async () =>')) {
  content = content.replace(
    'const [isLoaded, setIsLoaded] = useState(false);',
    'const [isLoaded, setIsLoaded] = useState(false);\n  const [dropdownOpen, setDropdownOpen] = useState(false);\n  const router = useRouter();\n\n  const handleLogout = async () => {\n    await authService.logout();\n    router.push("/");\n  };'
  );
}

const profileBlockOld = `<div className="p-6 border-t border-white/5 bg-white/5 m-4 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-white/10 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-coral flex items-center justify-center text-white font-bold shadow-lg shadow-coral/20">U</div>
            <div>
              <div className="text-sm font-bold text-white">Demo User</div>
              <div className="text-xs font-medium text-white/50">Settings</div>
            </div>
          </div>
          <Settings className="w-4 h-4 text-white/40" />
        </div>`;

const profileBlockNew = `<div className="relative m-4">
          <button 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full p-4 border-t border-white/5 bg-white/5 rounded-2xl flex items-center justify-between hover:bg-white/10 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-coral flex items-center justify-center text-white font-bold shadow-lg shadow-coral/20">U</div>
              <div className="text-left">
                <div className="text-sm font-bold text-white">Demo User</div>
                <div className="text-xs font-medium text-white/50">Settings</div>
              </div>
            </div>
            <Settings className="w-4 h-4 text-white/40" />
          </button>
          
          <AnimatePresence>
            {dropdownOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-full left-0 w-full mb-2 bg-white rounded-xl shadow-xl overflow-hidden z-[100]"
              >
                <Link href="/buyer/profile" className="block w-full text-left px-4 py-3 text-sm font-bold text-navy hover:bg-navy/5">Profile Settings</Link>
                <button onClick={handleLogout} className="block w-full text-left px-4 py-3 text-sm font-bold text-coral hover:bg-coral/5 border-t border-navy/5">Logout</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>`;
content = content.replace(profileBlockOld, profileBlockNew);

fs.writeFileSync('src/components/layout/WorkspaceLayout.tsx', content);

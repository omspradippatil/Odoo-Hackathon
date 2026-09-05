const fs = require('fs');
let content = fs.readFileSync('src/components/layout/WorkspaceLayout.tsx', 'utf8');

const mobileProfileOld = `<div className="w-8 h-8 rounded-full bg-coral flex items-center justify-center text-white font-bold text-xs">U</div>`;
const mobileProfileNew = `<div className="relative">
            <button onClick={() => setDropdownOpen(!dropdownOpen)} className="w-8 h-8 rounded-full bg-coral flex items-center justify-center text-white font-bold text-xs">U</button>
            <AnimatePresence>
              {dropdownOpen && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl overflow-hidden z-[100] border border-navy/5"
                >
                  <Link href="/buyer/profile" className="block w-full text-left px-4 py-3 text-sm font-bold text-navy hover:bg-navy/5">Profile Settings</Link>
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-3 text-sm font-bold text-coral hover:bg-coral/5 border-t border-navy/5">Logout</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>`;
content = content.replace(mobileProfileOld, mobileProfileNew);

fs.writeFileSync('src/components/layout/WorkspaceLayout.tsx', content);

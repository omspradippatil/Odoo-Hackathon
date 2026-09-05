const fs = require('fs');
let content = fs.readFileSync('src/components/sections/Navbar.tsx', 'utf8');

// Add auth state
if (!content.includes('const [user, setUser]')) {
  content = content.replace(
    'const [mobileMenuOpen, setMobileMenuOpen] = useState(false);',
    'const [mobileMenuOpen, setMobileMenuOpen] = useState(false);\n  const [user, setUser] = useState<any>(null);'
  );
  content = content.replace(
    'useEffect(() => {\n    const handleScroll',
    'useEffect(() => {\n    if (typeof window !== "undefined") {\n      const stored = sessionStorage.getItem("devflow_user");\n      if (stored) setUser(JSON.parse(stored));\n    }\n    const handleScroll'
  );
}

// Update Desktop CTA
const desktopCtaPattern = /<div className="hidden md:flex items-center gap-4">[\s\S]*?<\/div>/m;
const desktopReplacement = `<div className="hidden md:flex items-center gap-4">
            {!user ? (
              <>
                <Link href="/login" className="text-sm font-medium text-navy hover:opacity-70 transition-opacity">
                  Sign In
                </Link>
                <PrimaryButton href="/login?returnTo=/buyer/requirements/new" className="py-2 px-5 text-sm" showArrow>
                  Start a Deal
                </PrimaryButton>
              </>
            ) : (
              <PrimaryButton href="/buyer" className="py-2 px-5 text-sm" showArrow>
                Go to Workspace
              </PrimaryButton>
            )}
          </div>`;
content = content.replace(desktopCtaPattern, desktopReplacement);

// Update Mobile CTA
const mobileCtaPattern = /<div className="flex flex-col gap-4 mt-auto border-t border-navy\/10 pt-8">[\s\S]*?<\/div>/m;
const mobileReplacement = `<div className="flex flex-col gap-4 mt-auto border-t border-navy/10 pt-8">
              {!user ? (
                <>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="text-center font-bold text-navy py-3">
                    Sign In
                  </Link>
                  <PrimaryButton href="/login?returnTo=/buyer/requirements/new" onClick={() => setMobileMenuOpen(false)} showArrow className="w-full">
                    Start a Deal
                  </PrimaryButton>
                </>
              ) : (
                <PrimaryButton href="/buyer" onClick={() => setMobileMenuOpen(false)} showArrow className="w-full">
                  Go to Workspace
                </PrimaryButton>
              )}
            </div>`;
content = content.replace(mobileCtaPattern, mobileReplacement);

fs.writeFileSync('src/components/sections/Navbar.tsx', content);

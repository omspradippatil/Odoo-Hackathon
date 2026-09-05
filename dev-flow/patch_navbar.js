const fs = require('fs');
let content = fs.readFileSync('src/components/sections/Navbar.tsx', 'utf8');

// Add Local Sellers to Navbar
content = content.replace(
  '<Link href="#how-it-works" className="hover:text-navy transition-colors">How It Works</Link>',
  '<Link href="/explore" className="hover:text-navy transition-colors">Explore</Link>\n            <Link href="#how-it-works" className="hover:text-navy transition-colors">How It Works</Link>\n            <Link href="/buyer/local" className="hover:text-navy transition-colors">Local Sellers</Link>'
);

// Add Local Sellers to mobile menu
content = content.replace(
  '<Link href="#how-it-works" onClick={() => setMobileMenuOpen(false)}>How It Works</Link>',
  '<Link href="/explore" onClick={() => setMobileMenuOpen(false)}>Explore</Link>\n              <Link href="#how-it-works" onClick={() => setMobileMenuOpen(false)}>How It Works</Link>\n              <Link href="/buyer/local" onClick={() => setMobileMenuOpen(false)}>Local Sellers</Link>'
);

// Update Start a Deal button in Desktop
content = content.replace(
  '<PrimaryButton href="/signup" className="py-2 px-5 text-sm" showArrow>',
  '<PrimaryButton href="/login?returnTo=/buyer/requirements/new" className="py-2 px-5 text-sm" showArrow>'
);

// Update Start a Deal button in Mobile
content = content.replace(
  '<PrimaryButton href="/signup" onClick={() => setMobileMenuOpen(false)} showArrow className="w-full">',
  '<PrimaryButton href="/login?returnTo=/buyer/requirements/new" onClick={() => setMobileMenuOpen(false)} showArrow className="w-full">'
);

fs.writeFileSync('src/components/sections/Navbar.tsx', content);

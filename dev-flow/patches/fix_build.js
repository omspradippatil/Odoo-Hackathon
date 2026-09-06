const fs = require('fs');

let loginContent = fs.readFileSync('src/app/login/page.tsx', 'utf8');
loginContent = loginContent.replace('const user = await authService.login(email, password);', 'const authRes = await authService.login(email, password);');
loginContent = loginContent.replace('switch(user?.role)', 'switch(authRes?.user?.role)');
fs.writeFileSync('src/app/login/page.tsx', loginContent);

let trustContent = fs.readFileSync('src/app/vendors/[vendorId]/trust/page.tsx', 'utf8');
// Did I place `const router = useRouter();` outside the component? Let's check where it got injected.
// Let's just remove the existing `const router = useRouter();` and manually inject it at the very top of `VendorTrustProfile`
trustContent = trustContent.replace('const resolvedParams = use(params);\n  const router = useRouter();', 'const resolvedParams = use(params);');

if (!trustContent.includes('const router = useRouter();')) {
  trustContent = trustContent.replace(
    'export default function VendorTrustProfile({ params }: { params: Promise<{ vendorId: string }> }) {',
    'export default function VendorTrustProfile({ params }: { params: Promise<{ vendorId: string }> }) {\n  const router = useRouter();'
  );
}
fs.writeFileSync('src/app/vendors/[vendorId]/trust/page.tsx', trustContent);

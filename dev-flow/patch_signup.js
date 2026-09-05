const fs = require('fs');
let content = fs.readFileSync('src/app/signup/page.tsx', 'utf8');

content = content.replace(
  '<Input placeholder="John Doe" value={formData.fullName} onChange={e => handleChange("fullName", e.target.value)} />',
  '<Input placeholder="John Doe" value={formData.fullName} onChange={e => handleChange("fullName", e.target.value)} autoComplete="name" />'
);

content = content.replace(
  '<Input type="email" placeholder="name@company.com" value={formData.email} onChange={e => handleChange("email", e.target.value)} />',
  '<Input type="email" placeholder="name@company.com" value={formData.email} onChange={e => handleChange("email", e.target.value)} autoComplete="email" />'
);

content = content.replace(
  '<Input type="tel" placeholder="+1 (555) 000-0000" value={formData.phone} onChange={e => handleChange("phone", e.target.value)} />',
  '<Input type="tel" placeholder="+1 (555) 000-0000" value={formData.phone} onChange={e => handleChange("phone", e.target.value)} autoComplete="tel" />'
);

content = content.replace(
  '<Input placeholder="Acme Corp" value={formData.company} onChange={e => handleChange("company", e.target.value)} />',
  '<Input placeholder="Acme Corp" value={formData.company} onChange={e => handleChange("company", e.target.value)} autoComplete="organization" />'
);

content = content.replace(
  '<Input type={showPassword ? "text" : "password"} value={formData.password} onChange={e => handleChange("password", e.target.value)} className="pr-12" />',
  '<Input type={showPassword ? "text" : "password"} value={formData.password} onChange={e => handleChange("password", e.target.value)} className="pr-12" autoComplete="new-password" />'
);

content = content.replace(
  '<Input type={showConfirm ? "text" : "password"} value={formData.confirmPassword} onChange={e => handleChange("confirmPassword", e.target.value)} className="pr-12" />',
  '<Input type={showConfirm ? "text" : "password"} value={formData.confirmPassword} onChange={e => handleChange("confirmPassword", e.target.value)} className="pr-12" autoComplete="new-password" />'
);

// We should also handle returnTo in signup page
if (!content.includes('import { useRouter, useSearchParams } from "next/navigation";')) {
  content = content.replace(
    'import { useRouter } from "next/navigation";',
    'import { useRouter, useSearchParams } from "next/navigation";'
  );
}

if (!content.includes('const searchParams = useSearchParams();')) {
  content = content.replace(
    'const router = useRouter();',
    'const router = useRouter();\n  const searchParams = useSearchParams();\n  const returnTo = searchParams.get("returnTo");'
  );
}

// Redirect using returnTo
const oldHandleSubmit = `await authService.signup(formData);\n      router.push("/onboarding");`;
const newHandleSubmit = `const res = await authService.signup(formData);\n      if (returnTo && returnTo.startsWith("/")) {\n        router.push(returnTo);\n      } else {\n        router.push("/onboarding");\n      }`;
content = content.replace(oldHandleSubmit, newHandleSubmit);

fs.writeFileSync('src/app/signup/page.tsx', content);

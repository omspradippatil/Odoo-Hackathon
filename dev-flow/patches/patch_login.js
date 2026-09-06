const fs = require('fs');

let content = fs.readFileSync('src/app/login/page.tsx', 'utf8');

// Add useSearchParams hook
if (!content.includes('useSearchParams')) {
  content = content.replace('import { useRouter } from "next/navigation";', 'import { useRouter, useSearchParams } from "next/navigation";');
}

// Extract search params inside component
if (!content.includes('const searchParams = useSearchParams();')) {
  content = content.replace('const router = useRouter();', 'const router = useRouter();\n  const searchParams = useSearchParams();\n  const returnTo = searchParams.get("returnTo");');
}

// Update handleLogin success path
const oldHandleLoginSuccess = `await authService.login(email, password);\n      router.push("/onboarding");`;
const newHandleLoginSuccess = `const user = await authService.login(email, password);\n      if (returnTo && returnTo.startsWith("/")) {\n        router.push(returnTo);\n      } else {\n        // Role-based redirect\n        switch(user?.role) {\n          case "BUYER": router.push("/buyer"); break;\n          case "SELLER": router.push("/seller"); break;\n          case "SALES_REP": router.push("/sales"); break;\n          case "SALES_MANAGER": router.push("/approvals"); break;\n          case "FINANCE_OPERATIONS": router.push("/operations"); break;\n          case "ADMIN": router.push("/admin"); break;\n          default: router.push("/buyer");\n        }\n      }`;
content = content.replace(oldHandleLoginSuccess, newHandleLoginSuccess);

// Update Demo buttons to respect returnTo
const updateDemoButton = (role, defaultRoute) => {
  const pattern = new RegExp(`onClick=\\{\\(\\) => router\\.push\\('${defaultRoute}'\\)\\}`);
  const replacement = `onClick={() => {\n                if (returnTo && returnTo.startsWith("/")) router.push(returnTo);\n                else router.push('${defaultRoute}');\n              }}`;
  content = content.replace(pattern, replacement);
}
updateDemoButton('/buyer', '/buyer');
updateDemoButton('/approvals', '/approvals');
updateDemoButton('/operations', '/operations');
updateDemoButton('/admin', '/admin');

fs.writeFileSync('src/app/login/page.tsx', content);

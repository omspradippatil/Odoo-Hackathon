const fs = require('fs');
let content = fs.readFileSync('src/app/vendors/[vendorId]/trust/page.tsx', 'utf8');

// Inject useRouter
if (!content.includes('import { useRouter } from "next/navigation";')) {
  content = content.replace(
    'import { usePathname } from "next/navigation";',
    'import { usePathname, useRouter } from "next/navigation";'
  );
  // Just in case it wasn't there
  if (!content.includes('import { useRouter } from "next/navigation";')) {
    content = content.replace(
      'import React, { useState, use } from "react";',
      'import React, { useState, use } from "react";\nimport { useRouter } from "next/navigation";'
    );
  }
}

if (!content.includes('const router = useRouter();')) {
  content = content.replace(
    'const resolvedParams = use(params);',
    'const resolvedParams = use(params);\n  const router = useRouter();'
  );
}

// Add onClick to Request Quote buttons
content = content.replace(
  '<button className="px-5 py-3 rounded-xl font-bold text-white bg-cobalt shadow-lg shadow-cobalt/20 hover:bg-cobalt/90 transition-colors text-sm flex-1 sm:flex-none">Request Quote</button>',
  '<button onClick={() => router.push("/login?returnTo=/buyer/requirements/new")} className="px-5 py-3 rounded-xl font-bold text-white bg-cobalt shadow-lg shadow-cobalt/20 hover:bg-cobalt/90 transition-colors text-sm flex-1 sm:flex-none">Request Quote</button>'
);

content = content.replace(
  '<button className="w-full py-4 rounded-xl bg-cobalt text-white font-bold shadow-lg flex items-center justify-center gap-2">',
  '<button onClick={() => router.push("/login?returnTo=/buyer/requirements/new")} className="w-full py-4 rounded-xl bg-cobalt text-white font-bold shadow-lg flex items-center justify-center gap-2">'
);

// Also check "Start a Deal" if it's there
content = content.replace(
  '<button className="px-5 py-3 rounded-xl font-bold text-navy bg-white border border-navy/10 shadow-sm hover:bg-navy/5 transition-colors text-sm w-full sm:w-auto">Start a Deal</button>',
  '<button onClick={() => router.push("/login?returnTo=/buyer/requirements/new")} className="px-5 py-3 rounded-xl font-bold text-navy bg-white border border-navy/10 shadow-sm hover:bg-navy/5 transition-colors text-sm w-full sm:w-auto">Start a Deal</button>'
);

// The prompt also states: "Internal margin, approval rules, risk signals and private deal data must NOT appear."
// Let's see if those exist in the trust page and hide them if guest.
if (!content.includes('const [isGuest, setIsGuest]')) {
  content = content.replace(
    'const [isBronzeMode, setIsBronzeMode] = useState(false);',
    'const [isBronzeMode, setIsBronzeMode] = useState(false);\n  const [isGuest, setIsGuest] = useState(false);\n  React.useEffect(() => {\n    setIsGuest(!sessionStorage.getItem("devflow_user"));\n  }, []);'
  );
}

fs.writeFileSync('src/app/vendors/[vendorId]/trust/page.tsx', content);

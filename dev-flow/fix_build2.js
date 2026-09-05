const fs = require('fs');
let content = fs.readFileSync('src/app/vendors/[vendorId]/trust/page.tsx', 'utf8');

if (!content.includes('import { useRouter } from "next/navigation";')) {
  content = content.replace(
    'import React, { useState, useEffect } from "react";',
    'import React, { useState, useEffect } from "react";\nimport { useRouter } from "next/navigation";'
  );
}

if (!content.includes('const router = useRouter();')) {
  content = content.replace(
    'export default function VendorTrustPage({ params }: { params: Promise<{ vendorId: string }> }) {',
    'export default function VendorTrustPage({ params }: { params: Promise<{ vendorId: string }> }) {\n  const router = useRouter();'
  );
}

fs.writeFileSync('src/app/vendors/[vendorId]/trust/page.tsx', content);

const fs = require('fs');

function wrapSuspense(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (!content.includes('import { Suspense }')) {
    content = content.replace(
      'import React, { useState',
      'import React, { useState, Suspense'
    );
    if (!content.includes('import React, { useState, Suspense')) {
        content = content.replace(
            'import React, { useState',
            'import React, { useState, Suspense'
        );
        // Maybe it's `import React, { useState } from "react";`
    }
  }

  // Rename default export to internal component, then export a wrapped version
  content = content.replace(
    'export default function LoginPage() {',
    'function LoginContent() {'
  );
  content = content.replace(
    'export default function SignupPage() {',
    'function SignupContent() {'
  );

  content += `\n\nexport default function Page() {\n  return (\n    <Suspense fallback={<div className="min-h-screen bg-warm flex items-center justify-center">Loading...</div>}>\n      <${filePath.includes('login') ? 'LoginContent' : 'SignupContent'} />\n    </Suspense>\n  );\n}\n`;

  fs.writeFileSync(filePath, content);
}

wrapSuspense('src/app/login/page.tsx');
wrapSuspense('src/app/signup/page.tsx');

const fs = require('fs');

let content = fs.readFileSync('src/app/operations/billing/[dealId]/page.tsx', 'utf8');

content = content.replace(
  'import React from "react";',
  'import React, { useState } from "react";'
);

fs.writeFileSync('src/app/operations/billing/[dealId]/page.tsx', content);

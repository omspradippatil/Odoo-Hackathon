const fs = require('fs');

let content = fs.readFileSync('src/components/layout/WorkspaceLayout.tsx', 'utf8');

// The user is already in session, let's fetch it properly in useEffect if not already.
// Wait, is there a user state?
// Let's check WorkspaceLayout for user state.

const fs = require('fs');

let content = fs.readFileSync('src/components/layout/WorkspaceLayout.tsx', 'utf8');

content = content.replace(
  'const [isGuest, setIsGuest] = useState(false);',
  'const [isGuest, setIsGuest] = useState(false);\n  const [currentUser, setCurrentUser] = useState<any>(null);'
);

content = content.replace(
  'const user = sessionStorage.getItem("devflow_user");\n    setIsGuest(!user);',
  'const user = sessionStorage.getItem("devflow_user");\n    setIsGuest(!user);\n    if (user) { setCurrentUser(JSON.parse(user)); }'
);

content = content.replace(
  '<div className="text-sm font-bold text-white">Demo User</div>',
  '<div className="text-sm font-bold text-white">{currentUser?.fullName || "User"}</div>'
);

// We should also replace the role below it if it's hardcoded
// Let's check what's there

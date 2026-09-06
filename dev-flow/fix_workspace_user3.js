const fs = require('fs');

let content = fs.readFileSync('src/components/layout/WorkspaceLayout.tsx', 'utf8');

if (!content.includes('currentUser')) {
  content = content.replace(
    'const [isGuest, setIsGuest] = useState(false);',
    'const [isGuest, setIsGuest] = useState(false);\n  const [currentUser, setCurrentUser] = useState<any>(null);'
  );

  content = content.replace(
    'const user = sessionStorage.getItem("devflow_user");\n    setIsGuest(!user);',
    'const user = sessionStorage.getItem("devflow_user");\n    setIsGuest(!user);\n    if (user) { setCurrentUser(JSON.parse(user)); }'
  );
}

content = content.replace(
  '<div className="w-10 h-10 rounded-full bg-coral flex items-center justify-center text-white font-bold shadow-lg shadow-coral/20">U</div>',
  '<div className="w-10 h-10 rounded-full bg-coral flex items-center justify-center text-white font-bold shadow-lg shadow-coral/20">{currentUser?.fullName?.charAt(0) || "U"}</div>'
);

content = content.replace(
  '<div className="text-sm font-bold text-white">Demo User</div>',
  '<div className="text-sm font-bold text-white">{currentUser?.fullName || "Demo User"}</div>'
);

content = content.replace(
  '<div className="text-xs font-medium text-white/50">Settings</div>',
  '<div className="text-xs font-medium text-white/50">{currentUser?.role || "Settings"}</div>'
);

fs.writeFileSync('src/components/layout/WorkspaceLayout.tsx', content);

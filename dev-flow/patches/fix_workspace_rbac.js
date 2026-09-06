const fs = require('fs');

let content = fs.readFileSync('src/components/layout/WorkspaceLayout.tsx', 'utf8');

// I will insert RBAC after the early returns
// Early returns are: `if (!isLoaded) return null;`
// `if (isGuest)`
const rbacCheck = `
  // RBAC Enforcement
  if (requireAuth && currentUser && role && currentUser.role !== role) {
    return (
      <div className="min-h-screen bg-warm text-navy selection:bg-coral/20 flex flex-col relative items-center justify-center p-4">
        <Navbar />
        <FlowPathBackground />
        <div className="relative z-10 max-w-md w-full text-center bg-white p-10 rounded-3xl border border-navy/10 shadow-2xl shadow-navy/5">
          <div className="w-16 h-16 bg-coral/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-8 h-8 text-coral" />
          </div>
          <h2 className="text-2xl font-bold text-navy mb-3">Access Restricted</h2>
          <p className="text-navy/60 font-medium mb-8">
            You do not have the required permissions to view this workspace. Your current role is <strong>{currentUser.role}</strong>.
          </p>
          <button 
            onClick={() => router.push('/')}
            className="w-full py-3.5 rounded-xl font-bold text-white bg-navy shadow-lg shadow-navy/20 hover:bg-navy/90 transition-colors"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }
`;

content = content.replace(
  'if (!isLoaded) return null; // Hydration guard',
  'if (!isLoaded) return null; // Hydration guard\n' + rbacCheck
);

fs.writeFileSync('src/components/layout/WorkspaceLayout.tsx', content);

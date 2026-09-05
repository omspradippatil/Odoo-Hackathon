const fs = require('fs');
const path = require('path');

const components = {
  'components/layout/Navbar.tsx': `export default function Navbar() { return <nav className="h-16 border-b border-zinc-800 flex items-center px-4">DEV FLOW</nav>; }`,
  'components/layout/Sidebar.tsx': `export default function Sidebar() { return <aside className="w-64 border-r border-zinc-800 h-screen p-4">Menu</aside>; }`,
  'components/layout/ModeToggle.tsx': `export default function ModeToggle() { return <div>Mode Toggle</div>; }`,
  'components/quotation/RiskScoreBadge.tsx': `
export default function RiskScoreBadge({ score }: { score: number }) {
  let color = 'bg-emerald-500';
  let text = 'Auto-approved';
  if (score > 0 && score <= 0.08) {
    color = 'bg-yellow-500';
    text = 'L1 Approval';
  } else if (score > 0.08) {
    color = 'bg-red-500';
    text = 'L1+L2 Approval';
  }
  return <div className={\`px-3 py-1 rounded text-white \${color}\`}>{text} ({ (score * 100).toFixed(1) }%)</div>;
}
  `,
  'components/payment/UpiModal.tsx': `
"use client";
import { useState } from 'react';
export default function UpiModal({ amount, onSuccess }: { amount: number, onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const handlePay = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(onSuccess, 1000);
    }, 1500);
  };
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-zinc-900 p-8 rounded-lg max-w-sm w-full text-center">
        {!success ? (
          <>
            <h2 className="text-xl font-bold mb-4">DEV FLOW UPI</h2>
            <p className="mb-4 text-zinc-400">devflow@upi</p>
            <div className="bg-white w-48 h-48 mx-auto mb-8 rounded">QR</div>
            <button onClick={handlePay} disabled={loading} className="w-full bg-blue-600 py-3 rounded text-white font-bold">
              {loading ? 'Processing...' : \`Pay ₹\${amount}\`}
            </button>
          </>
        ) : (
          <div className="text-emerald-500 text-2xl font-bold">Success!</div>
        )}
      </div>
    </div>
  );
}
  `,
  'components/trust/TrustBadge.tsx': `
export default function TrustBadge({ tier }: { tier: 'gold' | 'silver' | 'bronze' }) {
  const colors = { gold: 'bg-amber-400 text-black', silver: 'bg-zinc-300 text-black', bronze: 'bg-orange-700 text-white' };
  const labels = { gold: 'GOLD VENDOR', silver: 'SILVER VENDOR', bronze: 'BRONZE VENDOR' };
  return <span className={\`px-2 py-1 text-xs font-bold rounded \${colors[tier]}\`}>{labels[tier]}</span>;
}
  `,
};

Object.keys(components).forEach(filepath => {
  const fullpath = path.join('/Users/om/Desktop/Projects/Odoo-Hackathon/frontend', filepath);
  fs.mkdirSync(path.dirname(fullpath), { recursive: true });
  fs.writeFileSync(fullpath, components[filepath]);
});

console.log('Components created!');

const fs = require('fs');
const path = require('path');

const pages = {
  'app/login/page.tsx': `export default function Login() { return <div className="p-8"><h1 className="text-2xl font-bold">Login</h1><div className="flex gap-4 mt-4"><button className="px-4 py-2 bg-blue-600 rounded">Admin</button><button className="px-4 py-2 bg-zinc-800 rounded">Sales</button></div></div>; }`,
  'app/signup/page.tsx': `export default function Signup() { return <div className="p-8"><h1 className="text-2xl font-bold">Signup</h1></div>; }`,
  'app/dashboard/page.tsx': `export default function Dashboard() { return <div className="p-8 grid md:grid-cols-2 gap-4"><div className="bg-blue-900 p-8 rounded-lg"><h2>Local Mode</h2><p>Buy & sell locally with trust escrow</p></div><div className="bg-purple-900 p-8 rounded-lg"><h2>Professional Mode</h2><p>B2B procurement with anonymous bidding</p></div></div>; }`,
  'app/admin/page.tsx': `export default function Admin() { return <div className="p-8">Admin Dashboard</div>; }`,
  'app/workspace/page.tsx': `export default function Workspace() { return <div className="p-8">Workspace</div>; }`,
  'app/workspace/quotations/page.tsx': `export default function Quotations() { return <div className="p-8">Quotations Kanban</div>; }`,
  'app/workspace/quotations/new/page.tsx': `export default function NewQuotation() { return <div className="p-8 grid md:grid-cols-[1fr_300px] gap-8"><div>Product Picker</div><div>Cart & Risk Score</div></div>; }`,
  'app/workspace/quotations/[id]/page.tsx': `export default function QuotationDetail() { return <div className="p-8">Quotation Detail</div>; }`,
  'app/workspace/pipeline/page.tsx': `export default function Pipeline() { return <div className="p-8">Pipeline Kanban</div>; }`,
  'app/workspace/fulfillment/[id]/page.tsx': `export default function Fulfillment() { return <div className="p-8">Fulfillment Split Screen</div>; }`,
  'app/workspace/billing/[id]/page.tsx': `export default function Billing() { return <div className="p-8">Billing</div>; }`,
  'app/workspace/dashboard/page.tsx': `export default function DealDashboard() { return <div className="p-8">Deal Health Dashboard</div>; }`,
  'app/portal/[token]/page.tsx': `export default function Portal() { return <div className="p-8 bg-white text-black min-h-screen">Customer Portal</div>; }`,
  'app/local/page.tsx': `export default function LocalHome() { return <div className="p-8">Local Mode Home</div>; }`,
  'app/local/checkout/[id]/page.tsx': `export default function Checkout() { return <div className="p-8">UPI Modal Payment</div>; }`,
  'app/local/seller/page.tsx': `export default function Seller() { return <div className="p-8">Seller Dashboard</div>; }`,
  'app/professional/bids/page.tsx': `export default function Bids() { return <div className="p-8">Vendor Bids</div>; }`,
  'app/professional/requirements/page.tsx': `export default function Requirements() { return <div className="p-8">Requirements</div>; }`,
  'app/reports/page.tsx': `export default function Reports() { return <div className="p-8">Reports</div>; }`,
};

Object.keys(pages).forEach(filepath => {
  const fullpath = path.join('/Users/om/Desktop/Projects/Odoo-Hackathon/frontend', filepath);
  fs.mkdirSync(path.dirname(fullpath), { recursive: true });
  fs.writeFileSync(fullpath, pages[filepath]);
});

console.log('Pages created!');

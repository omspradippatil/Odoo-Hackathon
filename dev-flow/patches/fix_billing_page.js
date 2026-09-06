const fs = require('fs');

let content = fs.readFileSync('src/app/operations/billing/[dealId]/page.tsx', 'utf8');

// Insert the import
content = content.replace(
  'import { cn } from "@/lib/utils";',
  'import { cn } from "@/lib/utils";\nimport { InvoiceModal } from "@/components/ui/InvoiceModal";'
);

// Add state to component
content = content.replace(
  'export default function BillingDetail() {',
  'export default function BillingDetail() {\n  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);'
);

// Modify the buttons
const originalButtons = `
              <div className="flex gap-2">
                <button className="flex-[2] py-3 rounded-xl bg-navy/5 text-navy text-xs font-bold hover:bg-navy/10 transition-colors border border-navy/5 flex items-center justify-center gap-2"><Eye className="w-4 h-4" /> View Invoice</button>
                <button className="flex-1 py-3 rounded-xl bg-navy/5 text-navy text-xs font-bold hover:bg-navy/10 transition-colors border border-navy/5 flex items-center justify-center"><Download className="w-4 h-4" /></button>
              </div>
`;

const newButtons = `
              <div className="flex gap-2">
                <button 
                  onClick={() => setIsInvoiceOpen(true)}
                  className="flex-[2] py-3 rounded-xl bg-navy/5 text-navy text-xs font-bold hover:bg-navy/10 transition-colors border border-navy/5 flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" /> View Invoice
                </button>
                <button 
                  onClick={() => setIsInvoiceOpen(true)}
                  className="flex-1 py-3 rounded-xl bg-navy/5 text-navy text-xs font-bold hover:bg-navy/10 transition-colors border border-navy/5 flex items-center justify-center"
                  aria-label="Download Invoice"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
              <InvoiceModal isOpen={isInvoiceOpen} onClose={() => setIsInvoiceOpen(false)} />
`;

content = content.replace(originalButtons, newButtons);

fs.writeFileSync('src/app/operations/billing/[dealId]/page.tsx', content);

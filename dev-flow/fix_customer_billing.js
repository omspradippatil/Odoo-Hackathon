const fs = require('fs');

let content = fs.readFileSync('src/app/customer/deals/[dealId]/billing/page.tsx', 'utf8');

// Add import
content = content.replace(
  'import { cn } from "@/lib/utils";',
  'import { cn } from "@/lib/utils";\nimport { InvoiceModal } from "@/components/ui/InvoiceModal";'
);

// We need to replace the entire <AnimatePresence> modal block.
// It starts with `{/* INVOICE PREVIEW MODAL */}`
const startIndex = content.indexOf('{/* INVOICE PREVIEW MODAL */}');
const endIndex = content.indexOf('</AnimatePresence>') + '</AnimatePresence>'.length;

if (startIndex !== -1 && endIndex !== -1) {
  content = content.slice(0, startIndex) + '<InvoiceModal isOpen={showInvoicePreview} onClose={() => setShowInvoicePreview(false)} />\n      ' + content.slice(endIndex);
}

// Ensure the PDF button in the main UI triggers the download/opens modal
content = content.replace(
  /<button className="flex-1 sm:flex-none py-2.5 px-4 rounded-xl bg-navy\/5 text-navy text-xs font-bold hover:bg-navy\/10 transition-colors flex items-center justify-center gap-2 border border-navy\/5">\s*<Download className="w-3.5 h-3.5" \/> PDF\s*<\/button>/g,
  '<button onClick={() => setShowInvoicePreview(true)} className="flex-1 sm:flex-none py-2.5 px-4 rounded-xl bg-navy/5 text-navy text-xs font-bold hover:bg-navy/10 transition-colors flex items-center justify-center gap-2 border border-navy/5"><Download className="w-3.5 h-3.5" /> PDF</button>'
);

fs.writeFileSync('src/app/customer/deals/[dealId]/billing/page.tsx', content);


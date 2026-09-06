const fs = require('fs');

let content = fs.readFileSync('src/components/ui/InvoiceModal.tsx', 'utf8');

// I need to add a Printer Icon
content = content.replace(
  'import { X, Download } from "lucide-react";',
  'import { X, Download, Printer } from "lucide-react";'
);

content = content.replace(
  '<button onClick={handleDownload} className="flex items-center gap-2 px-6 py-2.5 bg-navy text-white rounded-xl text-sm font-bold shadow-sm hover:bg-navy/90 transition-colors">',
  `<button onClick={() => {
              const printContent = invoiceRef.current?.innerHTML;
              if (printContent) {
                const originalContent = document.body.innerHTML;
                document.body.innerHTML = \`<div class="print-container p-8 bg-white">\${printContent}</div>\`;
                window.print();
                document.body.innerHTML = originalContent;
                window.location.reload(); // Quick restore of React state
              }
            }} className="flex items-center gap-2 px-4 py-2.5 bg-navy/5 text-navy rounded-xl text-sm font-bold shadow-sm hover:bg-navy/10 transition-colors">
              <Printer className="w-4 h-4" /> Print
            </button>
            <button onClick={handleDownload} className="flex items-center gap-2 px-6 py-2.5 bg-navy text-white rounded-xl text-sm font-bold shadow-sm hover:bg-navy/90 transition-colors">`
);

fs.writeFileSync('src/components/ui/InvoiceModal.tsx', content);

const fs = require('fs');
let content = fs.readFileSync('src/app/operations/billing/[dealId]/page.tsx', 'utf8');

// We add the platform fee logic to the internal breakdown section.
const platformFeeReplacement = `
                <div className="flex justify-between items-center border-b border-navy/5 pb-3">
                  <span className="text-sm font-medium text-navy/60">One-Time Revenue</span>
                  <span className="font-bold text-navy">₹8.40L</span>
                </div>
                <div className="flex justify-between items-center border-b border-navy/5 pb-3 bg-navy/5 -mx-4 px-4 pt-3 rounded-lg mt-1 mb-1">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-navy">DEV FLOW Platform Fee</span>
                    <span className="text-[10px] font-bold text-navy/40 uppercase tracking-widest">3% of Transaction Value</span>
                  </div>
                  <span className="font-bold text-cobalt">₹25,200</span>
                </div>
                <div className="flex justify-between items-center border-b border-navy/5 pb-3 pt-2">
                  <span className="text-sm font-medium text-navy/60">Recurring Revenue</span>
                  <span className="font-bold text-cobalt">₹55K / mo</span>
                </div>
`;

content = content.replace(/<div className="flex justify-between items-center border-b border-navy\/5 pb-3">\s*<span className="text-sm font-medium text-navy\/60">One-Time Revenue<\/span>\s*<span className="font-bold text-navy">₹8\.40L<\/span>\s*<\/div>\s*<div className="flex justify-between items-center border-b border-navy\/5 pb-3">\s*<span className="text-sm font-medium text-navy\/60">Recurring Revenue<\/span>\s*<span className="font-bold text-cobalt">₹55K \/ mo<\/span>\s*<\/div>/, platformFeeReplacement);

fs.writeFileSync('src/app/operations/billing/[dealId]/page.tsx', content);

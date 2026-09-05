const fs = require('fs');
let content = fs.readFileSync('src/app/admin/reports/page.tsx', 'utf8');

// Add the import for pricing config
content = content.replace('import { PieChart, Download, Filter, TrendingUp, Calendar, ChevronDown, CheckCircle2 } from "lucide-react";', 
'import { PieChart, Download, Filter, TrendingUp, Calendar, ChevronDown, CheckCircle2, DollarSign } from "lucide-react";\nimport { PLATFORM_CONFIG } from "@/lib/pricingConfig";');

// Replace the KPI values with dynamic ones
const dealValueCr = 4.8;
const dealValue = 48000000;
const completedDealsPct = 0.89; // say 89% of 4.8Cr is completed. Wait, it's just mock data.
const completedValue = 42800000; // Let's just say 4.28 Cr
const platformRevenue = completedValue * 0.03;

const newKPIs = `
        {[
          { label: 'Deal Value', value: '₹4.8 Cr' },
          { label: 'Completed Deals', value: '428' },
          { label: 'Platform Revenue', value: '₹' + ((4.8 * 0.89 * 10000000) * PLATFORM_CONFIG.transactionFeeRate / 100000).toFixed(1) + 'L' },
          { label: 'On-Time Fulfilment', value: '93%' },
          { label: 'Outstanding Inv', value: '₹18.4L' },
          { label: 'Monthly ARR', value: '₹6.8L' },
        ].map(kpi => (
`;

content = content.replace(/\{\[\s+\{\s*label:\s*'Deal Value'.*?\}\,\s*\]\.map\(kpi => \(/s, newKPIs);

// Add Platform Revenue block
const revenueBlock = `

        {/* PLATFORM REVENUE REPORT */}
        <div className="w-full mt-8 bg-navy rounded-3xl border border-navy/10 shadow-sm p-6 md:p-8 text-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div>
              <h2 className="text-xs font-bold text-coral uppercase tracking-widest mb-1 flex items-center gap-2"><DollarSign className="w-4 h-4" /> Platform Revenue Model</h2>
              <p className="text-sm font-medium text-white/60">Revenue generated from completed transactions.</p>
            </div>
            <div className="bg-white/10 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
              Platform Fee Rate: <span className="text-coral">{PLATFORM_CONFIG.formatPercentage(PLATFORM_CONFIG.transactionFeeRate)}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
              <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">Completed Transaction Value</div>
              <div className="text-2xl font-bold">₹4,28,00,000</div>
              <div className="text-xs font-medium text-white/50 mt-1">From 428 completed deals</div>
            </div>
            <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
              <div className="text-[10px] font-bold text-coral uppercase tracking-widest mb-2">Realized Platform Revenue</div>
              <div className="text-2xl font-bold text-coral">₹12,84,000</div>
              <div className="text-xs font-medium text-white/50 mt-1">₹4.28Cr × 3%</div>
            </div>
            <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
              <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">Projected Platform Revenue</div>
              <div className="text-2xl font-bold opacity-70">₹1,56,000</div>
              <div className="text-xs font-medium text-white/50 mt-1">From pending deals (₹52L × 3%)</div>
            </div>
          </div>
        </div>
`;

content = content.replace('{/* FUNNEL */}', revenueBlock + '\n        {/* FUNNEL */}');

fs.writeFileSync('src/app/admin/reports/page.tsx', content);

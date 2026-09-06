const fs = require('fs');

let content = fs.readFileSync('src/components/sections/TwoWorlds.tsx', 'utf8');

const bannerHtml = `

        {/* REVENUE MODEL BANNER */}
        <div className="mt-8 md:mt-12 bg-white rounded-3xl p-6 md:p-8 border border-navy/5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 overflow-hidden">
          <div className="flex-1">
            <h4 className="text-sm font-bold text-navy uppercase tracking-widest mb-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cobalt" /> Simple transaction-based pricing
            </h4>
            <p className="text-sm md:text-base text-navy/70 font-medium">
              DEV FLOW earns a <span className="font-bold text-navy">3% platform fee</span> on completed transactions processed through the platform. No large upfront platform cost. The platform earns when a successful transaction is completed.
            </p>
          </div>
          <div className="bg-navy/5 rounded-2xl p-4 min-w-[240px] border border-navy/5">
            <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-2">Example</div>
            <div className="flex justify-between items-center text-sm font-medium text-navy mb-1">
              <span>Transaction Value</span>
              <span>₹8,40,000</span>
            </div>
            <div className="flex justify-between items-center text-sm font-bold text-navy border-t border-navy/10 pt-2 mt-2">
              <span>DEV FLOW Platform Fee (3%)</span>
              <span className="text-cobalt">₹25,200</span>
            </div>
          </div>
        </div>
`;

content = content.replace('        </div>\n      </div>\n    </section>', bannerHtml + '        </div>\n      </div>\n    </section>');
fs.writeFileSync('src/components/sections/TwoWorlds.tsx', content);

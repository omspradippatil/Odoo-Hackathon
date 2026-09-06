const fs = require('fs');

let content = fs.readFileSync('src/app/seller/page.tsx', 'utf8');

const replacement = `
          <div className="flex items-center gap-3">
            <button 
              onClick={() => router.push('/seller/products/new')}
              className="px-6 py-3.5 rounded-xl bg-white border border-navy/10 text-navy font-bold hover:bg-navy/5 transition-colors shadow-sm"
            >
              Add New Product
            </button>
            <button 
              onClick={() => router.push('/seller/opportunities')}
              className="px-6 py-3.5 rounded-xl bg-navy text-white font-bold hover:bg-navy/90 transition-colors shadow-lg shadow-navy/20"
            >
              View Opportunities
            </button>
          </div>
`;

content = content.replace(/<div className="flex items-center gap-3">[\s\S]*?<\/div>/, replacement.trim());

fs.writeFileSync('src/app/seller/page.tsx', content);

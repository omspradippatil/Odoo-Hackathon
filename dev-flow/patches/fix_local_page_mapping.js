const fs = require('fs');

let content = fs.readFileSync('src/app/buyer/local/page.tsx', 'utf8');

// Update mapping
content = content.replace(
  'price: p.basePrice || 0,',
  'price: p.basePrice || 0,\n          originalPrice: p.originalPrice,\n          sellingPrice: p.sellingPrice || p.basePrice || 0,'
);

// Update rendering in product card
const oldPriceRender = '<div className="text-xl font-black text-navy">{formatCurrency(product.price)}</div>';
const newPriceRender = `
                  <div className="flex flex-col">
                    {product.originalPrice && product.originalPrice > (product.sellingPrice || product.price) && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-navy/40 line-through">{formatCurrency(product.originalPrice)}</span>
                        <span className="text-[10px] font-bold text-white bg-coral px-1.5 py-0.5 rounded uppercase tracking-wider">
                          {Math.round(((product.originalPrice - (product.sellingPrice || product.price)) / product.originalPrice) * 100)}% OFF
                        </span>
                      </div>
                    )}
                    <div className="text-xl font-black text-navy">{formatCurrency(product.sellingPrice || product.price)}</div>
                  </div>
`;

content = content.replace(oldPriceRender, newPriceRender);

fs.writeFileSync('src/app/buyer/local/page.tsx', content);

const fs = require('fs');

let content = fs.readFileSync('src/app/buyer/local/page.tsx', 'utf8');

// Replace mock products with state
content = content.replace(
  'import { SAMPLE_PRODUCTS, LocalProduct } from "@/lib/mockLocalProducts";',
  'import { LocalProduct } from "@/lib/mockLocalProducts";'
);

content = content.replace(
  'export default function LocalSellersPage() {\n  const router = useRouter();',
  `export default function LocalSellersPage() {
  const router = useRouter();
  
  const [dbProducts, setDbProducts] = useState<LocalProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8080/api/products")
      .then(res => res.json())
      .then(data => {
        // Map backend Product to frontend LocalProduct format
        const mapped = data.map((p: any) => ({
          id: \`PRD-\${p.id}\`,
          name: p.name,
          category: p.category,
          brand: p.brand || "Generic",
          sellerName: p.sellerName || "Local Vendor",
          sellerId: p.sellerId || "VND-LOC-00",
          price: p.basePrice || 0,
          image: p.imageUrl || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800",
          stock: p.stock || 10,
          sellerLocation: p.city || "Mumbai",
          trustScore: p.trustScore || 80,
          verificationStatus: p.verificationStatus || "VERIFIED"
        }));
        setDbProducts(mapped);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, []);`
);

// Replace SAMPLE_PRODUCTS with dbProducts
content = content.replace(/SAMPLE_PRODUCTS/g, 'dbProducts');

fs.writeFileSync('src/app/buyer/local/page.tsx', content);

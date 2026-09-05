const fs = require('fs');

let content = fs.readFileSync('src/app/operations/billing/[dealId]/page.tsx', 'utf8');

content = content.replace(
  'export default function InternalBillingPage({ params }: { params: Promise<{ dealId: string }> }) {\n  const router = useRouter();',
  'export default function InternalBillingPage({ params }: { params: Promise<{ dealId: string }> }) {\n  const router = useRouter();\n  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);'
);

fs.writeFileSync('src/app/operations/billing/[dealId]/page.tsx', content);

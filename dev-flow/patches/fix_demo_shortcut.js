const fs = require('fs');

let content = fs.readFileSync('src/components/demo/DemoShortcut.tsx', 'utf8');

const replacement = `
export function DemoShortcut() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showExtras, setShowExtras] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      setIsAuth(!!sessionStorage.getItem("devflow_user"));
    }
  }, [pathname]);

  if (isAuth === true || isAuth === null) {
    return null;
  }
`;

content = content.replace(/export function DemoShortcut\(\) \{\s*const \[isOpen, setIsOpen\] = useState\(false\);\s*const \[mounted, setMounted\] = useState\(false\);\s*const \[showExtras, setShowExtras\] = useState\(false\);\s*const pathname = usePathname\(\);\s*const router = useRouter\(\);\s*useEffect\(\(\) => \{\s*setMounted\(true\);\s*\}, \[\]\);/g, replacement.trim());

fs.writeFileSync('src/components/demo/DemoShortcut.tsx', content);

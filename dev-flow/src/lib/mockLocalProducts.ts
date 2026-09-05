export type AvailabilityStatus = "In Stock" | "Low Stock" | "Out of Stock" | "Backorder";

export interface LocalProduct {
  id: string;
  name: string;
  brand: string;
  category: string;
  sellingPrice: number;
  sellerId: string;
  sellerName: string;
  sellerLocation: string;
  distanceKm: number;
  availableQuantity: number;
  availabilityStatus: AvailabilityStatus;
  deliveryAvailable: boolean;
  pickupAvailable: boolean;
  rating: number;
  trustTier: "Gold" | "Silver" | "Bronze";
  trustScore: number;
  active: boolean;
}

export const SELLERS = [
  { id: "ven-1", name: "Vertex Systems", location: "Mumbai", tier: "Gold", score: 92 },
  { id: "ven-2", name: "Delta Electronics", location: "New Delhi", tier: "Gold", score: 90 },
  { id: "ven-3", name: "NexGen IT Infra", location: "Bengaluru", tier: "Gold", score: 98 },
  { id: "ven-8", name: "Finolex Industrial", location: "Pune", tier: "Silver", score: 84 },
  { id: "ven-9", name: "Apex Industrial", location: "Ahmedabad", tier: "Silver", score: 79 },
  { id: "ven-10", name: "TechNova Solutions", location: "Gurugram", tier: "Bronze", score: 65 },
  { id: "ven-11", name: "ElectroMart B2B", location: "Chennai", tier: "Silver", score: 81 },
  { id: "ven-12", name: "Global Office Supplies", location: "Mumbai", tier: "Gold", score: 95 }
];

const BRANDS = {
  "Laptops": ["Dell", "HP", "Lenovo", "Apple", "Asus"],
  "Desktop Computers": ["Dell", "HP", "Lenovo", "Acer", "Asus"],
  "Monitors": ["Dell", "Samsung", "LG", "BenQ", "Acer"],
  "Keyboards": ["Logitech", "Keychron", "Microsoft", "TVS", "Razer"],
  "Mouse": ["Logitech", "Microsoft", "Razer", "Dell", "HP"],
  "Printers": ["HP", "Epson", "Canon", "Brother", "Xerox"],
  "Storage": ["WD", "Seagate", "Samsung", "Crucial", "SanDisk"],
  "Networking": ["Cisco", "Ubiquiti", "TP-Link", "Netgear", "D-Link"],
  "Office Electronics": ["APC", "Microtek", "Luminous", "V-Guard", "Su-Kam"],
  "Accessories": ["Targus", "Belkin", "Anker", "Spigen", "Portronics"]
};

const CATEGORIES = Object.keys(BRANDS);

export const SAMPLE_PRODUCTS: LocalProduct[] = [];

let pId = 1;

for (let i = 0; i < 100; i++) {
  const category = CATEGORIES[i % CATEGORIES.length];
  const brandList = BRANDS[category as keyof typeof BRANDS];
  const brand = brandList[i % brandList.length];
  const seller = SELLERS[i % SELLERS.length];
  
  let name = "";
  let basePrice = 0;
  
  if (category === "Laptops") {
    name = `${brand} ${["Latitude 5450", "ThinkPad T14", "EliteBook 840", "MacBook Air M2", "ExpertBook B5"][i % 5]} - ${["8GB", "16GB", "32GB"][i % 3]} RAM`;
    basePrice = 60000 + (i * 1500) % 40000;
  } else if (category === "Desktop Computers") {
    name = `${brand} ${["OptiPlex 7000", "ProDesk 600", "ThinkCentre M70", "Veriton X", "EliteDesk 800"][i % 5]} Micro Form Factor`;
    basePrice = 35000 + (i * 2000) % 25000;
  } else if (category === "Monitors") {
    name = `${brand} ${["24-inch FHD", "27-inch 4K USB-C", "34-inch Ultrawide", "22-inch Business", "27-inch QHD"][i % 5]} Monitor`;
    basePrice = 8000 + (i * 1200) % 25000;
  } else if (category === "Keyboards") {
    name = `${brand} ${["Wireless Business Combo", "Mechanical K2", "Ergonomic 4000", "Gold Mechanical", "Silent Touch"][i % 5]}`;
    basePrice = 800 + (i * 300) % 8000;
  } else if (category === "Mouse") {
    name = `${brand} ${["MX Master 3S", "Wireless Mobile 1850", "DeathAdder V3", "Ergo M575", "Anywhere 3S"][i % 5]}`;
    basePrice = 500 + (i * 400) % 6000;
  } else if (category === "Printers") {
    name = `${brand} ${["LaserJet Pro MFP", "EcoTank L3250", "ImageCLASS 244dw", "HL-L2321D", "WorkForce Pro"][i % 5]}`;
    basePrice = 12000 + (i * 800) % 20000;
  } else if (category === "Storage") {
    name = `${brand} ${["1TB NVMe SSD", "2TB External HDD", "500GB Portable SSD", "4TB NAS Drive", "8TB Enterprise HDD"][i % 5]}`;
    basePrice = 3000 + (i * 900) % 15000;
  } else if (category === "Networking") {
    name = `${brand} ${["24-Port Gigabit Switch", "UniFi 6 Lite AP", "Archer AX73 Router", "ProSafe 8-Port Switch", "Enterprise Firewall"][i % 5]}`;
    basePrice = 4000 + (i * 1100) % 25000;
  } else if (category === "Office Electronics") {
    name = `${brand} ${["1000VA UPS Backup", "Heavy Duty Paper Shredder", "Biometric Attendance", "Line Interactive UPS", "Smart Projector"][i % 5]}`;
    basePrice = 3500 + (i * 700) % 12000;
  } else {
    name = `${brand} ${["USB-C 7-in-1 Hub", "Laptop Backpack 15.6", "Power Bank 20000mAh", "Webcam 1080p", "Wireless Presenter"][i % 5]}`;
    basePrice = 1200 + (i * 250) % 5000;
  }

  const qty = (i * 13) % 150;
  let status: AvailabilityStatus = "In Stock";
  if (qty === 0) status = "Out of Stock";
  else if (qty < 10) status = "Low Stock";
  else if (i % 15 === 0) status = "Backorder";

  SAMPLE_PRODUCTS.push({
    id: `prod-${pId++}`,
    name,
    brand,
    category,
    sellingPrice: basePrice,
    sellerId: seller.id,
    sellerName: seller.name,
    sellerLocation: seller.location,
    distanceKm: parseFloat((1.5 + ((i * 3.7) % 15)).toFixed(1)),
    availableQuantity: qty,
    availabilityStatus: status,
    deliveryAvailable: i % 7 !== 0,
    pickupAvailable: i % 4 !== 0,
    rating: parseFloat((4.0 + ((i * 0.1) % 1.0)).toFixed(1)),
    trustTier: seller.tier as "Gold" | "Silver" | "Bronze",
    trustScore: seller.score,
    active: true
  });
}

export type UserRole =
  | 'ADMIN'
  | 'SALES_REP'
  | 'SALES_MANAGER'
  | 'FINANCE'
  | 'CUSTOMER'
  | 'BUYER'
  | 'SELLER'
  | 'VENDOR';

export type UserMode = 'LOCAL' | 'PROFESSIONAL';
export type UserTier = 'BRONZE' | 'SILVER' | 'GOLD';

export interface User { displayName?: string; companyName?: string; 
  id: number;
  email: string;
  role: UserRole;
  mode?: UserMode;
  tier?: UserTier;
  trustScore?: number;
  totalTransactions?: number;
}

export interface Category {
  id: number;
  name: string;
  maxDiscountPct: number;
}

export interface Product {
  id: number;
  name: string;
  category?: Category;
  basePrice: number; // Selling price
  actualPrice?: number; // Actual MRP / Original price
  unit?: string;
  taxRate?: number;
  description?: string;
  isRecurring: boolean;
  imageUrl?: string;
  seller?: User;
}

export interface QuotationLine {
  id?: number;
  product: Product;
  qty: number;
  unitPrice: number;
  discountPct: number;
  lineTotal: number;
  isRecurring?: boolean;
}

export type QuotationStatus =
  | 'DRAFT'
  | 'PENDING_L1'
  | 'PENDING_L2'
  | 'APPROVED'
  | 'REJECTED'
  | 'SENT_TO_CUSTOMER'
  | 'UNDER_NEGOTIATION'
  | 'CONFIRMED';

export interface Quotation {
  id: number;
  customer?: User;
  salesRep?: User;
  status: QuotationStatus;
  blendedRiskScore?: number;
  portalToken?: string;
  createdAt?: string;
  updatedAt?: string;
  lines?: QuotationLine[];
}

export interface DashboardStats {
  totalQuotations: number;
  pendingApprovals: number;
  totalRevenue: number;
}

export interface SplitResult {
  allocations: Record<number, number>; // warehouseId -> qty
  remaining: number; // backorder qty
}

export interface PaymentInitiateResponse {
  paymentId: number;
  amount: number;
  status: string;
  mockUpiUrl: string;
  escrowNote: string;
}

export interface PaymentConfirmResponse {
  paymentId: number;
  status: string;
  amountPaid: number;
  platformFee: number;
  sellerReceives: number;
  message: string;
}

// Add the fields we need
export interface ExtendedUser extends User {
  displayName?: string;
  companyName?: string;
}

export interface ExtendedProduct extends Product {
  imageUrl?: string;
  seller?: ExtendedUser;
}

// ─── Review & Tier Rating System ────────────────────────────────────

export interface Rating {
  id?: number;
  orderId?: number;
  rater?: User;
  ratee?: User;
  stars: number;
  reviewText?: string;
  imageUrl?: string;
  createdAt?: string;
}

export interface TrustScore {
  id?: number;
  user?: User;
  tier: UserTier;
  avgStars: number;
  totalTransactions: number;
  aiSummary?: string;
  updatedAt?: string;
}

export interface SellerLeaderboardEntry {
  sellerId: number;
  displayName?: string;
  companyName?: string;
  email: string;
  tier: UserTier;
  avgStars: number;
  totalTransactions: number;
  reviewCount: number;
  aiSummary?: string;
}

export type TrustTier = 'GOLD' | 'SILVER' | 'BRONZE' | 'NONE';

export interface VendorMatch {
  vendorId: string;
  displayName: string;
  isAnonymous?: boolean;
  anonymousCode?: string;
  trustTier: TrustTier;
  trustScore: number;
  rating: number;
  price: number;
  unitPrice: number;
  availableQuantity: number;
  deliveryDays: number;
  distanceKm?: number;
  experienceYears: number;
  qualityScore: number;
  transactionCount: number;
  location: string;
  matchReason?: string;
  isRecommended?: boolean;
  isCheapest?: boolean;
}

export interface VendorCombination {
  id: string;
  vendors: { vendor: VendorMatch, allocatedQuantity: number }[];
  totalQuantity: number;
  totalPrice: number;
  deliveryWindowDays: number;
  combinedTrustSignal: string;
  recommendationReason: string;
}

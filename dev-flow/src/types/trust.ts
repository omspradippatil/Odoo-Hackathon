export type TrustTier = 'GOLD' | 'SILVER' | 'BRONZE';

export interface TrustFactor {
  key: string;
  label: string;
  score: number;
}

export interface ReviewSummary {
  overview: string;
  praise: string[];
  concerns: string[];
}

export interface VerifiedReview {
  id: string;
  buyerName: string;
  rating: number;
  content: string;
  productCategory: string;
  date: string;
  hasImages: boolean;
}

export interface TrustTrend {
  month: string;
  tier: TrustTier;
  score: number;
}

export interface VendorTrustProfile {
  vendorId: string;
  vendorName: string;
  location: string;
  isNewVendor: boolean;
  score: number;
  tier: TrustTier;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  calculatedAt: string;
  policyVersion: string;
  factors: TrustFactor[];
  reviewSummary?: ReviewSummary;
  verifiedReviewCount: number;
  averageRating: number;
  completedTransactions: number;
  deliveryReliability: number; // percentage
  issueResolutionRate: number; // percentage
  repeatBuyerRate: number; // percentage
  trend: TrustTrend[];
}

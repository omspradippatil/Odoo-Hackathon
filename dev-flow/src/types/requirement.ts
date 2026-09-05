export enum RequirementDealType {
  PROFESSIONAL = 'PROFESSIONAL',
  LOCAL = 'LOCAL',
  SMART = 'SMART'
}

export enum PriorityType {
  BEST_VALUE = 'BEST_VALUE',
  LOWEST_PRICE = 'LOWEST_PRICE',
  HIGHEST_TRUST = 'HIGHEST_TRUST',
  FASTEST_DELIVERY = 'FASTEST_DELIVERY',
  PRODUCT_QUALITY = 'PRODUCT_QUALITY',
  VENDOR_EXPERIENCE = 'VENDOR_EXPERIENCE',
  AVAILABILITY = 'AVAILABILITY'
}

export interface RequirementItem {
  id: string; // frontend temp id
  productName: string;
  quantity: number;
  unit: string;
  description?: string;
  preferredBrand?: string;
  brandFlexible: boolean;
  targetUnitPrice?: number;
}

export interface RequirementRequest {
  id?: string;
  dealType: RequirementDealType;
  title?: string;
  items: RequirementItem[];
  
  // Budget
  hasBudget: boolean;
  budgetType?: 'TOTAL' | 'PER_UNIT';
  budgetAmount?: number;
  budgetFlexibility?: number;
  
  // Sourcing & Logistics
  allowSplitFulfilment: 'YES' | 'NO' | 'AUTO';
  deliveryMode: 'DELIVERY' | 'PICKUP' | 'EITHER';
  city?: string;
  state?: string;
  pinCode?: string;
  deliveryAddress?: string;
  
  // Timing
  requiredByMode: 'URGENT' | '3_DAYS' | '7_DAYS' | '14_DAYS' | 'CUSTOM';
  requiredByDate?: string;
  
  // Preferences
  priority: PriorityType;
  
  // Professional Settings
  organization?: string;
  department?: string;
  internalReference?: string;
  quotationDeadline?: string;
  anonymousBiddingEnabled: boolean;
  minimumTrustLevel: 'ANY' | 'SILVER' | 'GOLD';
  requestedQuoteCount: number;
}

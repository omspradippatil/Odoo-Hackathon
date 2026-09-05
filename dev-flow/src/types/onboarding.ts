import { UserRole } from "./auth";

export interface OnboardingProfile {
  userId?: string;
  role: UserRole;
  // Common
  organization?: string;
  department?: string;
  city?: string;
  region?: string;
  
  // Buyer
  dealTypes?: string[]; // Professional, Local, Both
  categories?: string[];
  
  // Seller
  businessName?: string;
  sellerType?: string; // Local, Professional, Both
  gstNumber?: string;
  deliveryCapabilities?: string[]; // Pickup, Local Delivery, Shipping, All
  
  // Sales Rep
  employeeId?: string;
  
  // Manager / Finance
  primaryResponsibilities?: string[];
}

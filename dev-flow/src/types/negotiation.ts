export type NegotiationStatus = 
  | 'AWAITING_CUSTOMER'
  | 'CUSTOMER_VIEWED'
  | 'CUSTOMER_COUNTERED'
  | 'INTERNAL_REVIEW'
  | 'REAPPROVAL_REQUIRED'
  | 'PENDING_REAPPROVAL'
  | 'REAPPROVED'
  | 'COUNTER_PROPOSED'
  | 'CUSTOMER_ACCEPTED'
  | 'DECLINED'
  | 'EXPIRED'
  | 'CANCELLED';

export interface NegotiationMessage {
  id: string;
  timestamp: string;
  sender: 'CUSTOMER' | 'SELLER' | 'SYSTEM';
  senderName: string;
  message: string;
  relatedVersion?: string;
}

export interface QuotationVersionView {
  version: string;
  discountPercent: number;
  dealValue: number;
  marginPercent?: number; // Internal only
  marginValue?: number; // Internal only
  status: string;
  createdAt: string;
}

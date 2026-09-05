export type BillingType = 'ONE_TIME' | 'RECURRING';
export type RecurrenceFreq = 'MONTHLY' | 'QUARTERLY' | 'YEARLY' | null;

export interface QuotationItem {
  id: string;
  productName: string;
  vendorName: string;
  quantity: number;
  vendorCostUnit: number;
  sellingPriceUnit: number;
  discountPercent: number;
  taxRatePercent: number;
  billingType: BillingType;
  recurrence: RecurrenceFreq;
}

export interface QuotationSummary {
  oneTimeSubtotal: number;
  recurringSubtotal: number;
  totalDiscount: number;
  netOneTimeValue: number;
  totalTax: number;
  grandTotalOneTime: number;
  grandTotalRecurring: number;
  totalVendorCost: number;
  grossMargin: number;
  marginPercentage: number;
  requiresApproval: boolean;
  approvalReason?: string;
  marginHealth: 'HEALTHY' | 'WATCH' | 'LOW';
}

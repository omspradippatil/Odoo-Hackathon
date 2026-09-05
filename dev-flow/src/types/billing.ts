export type InvoiceStatus = 
  | 'DRAFT'
  | 'ISSUED'
  | 'SENT'
  | 'PARTIALLY_PAID'
  | 'PAID'
  | 'OVERDUE'
  | 'CANCELLED'
  | 'VOID';

export type SubscriptionStatus =
  | 'SCHEDULED'
  | 'ACTIVE'
  | 'PAST_DUE'
  | 'PAUSED'
  | 'CANCELLED'
  | 'EXPIRED';

export type BillingType = 'ONE_TIME' | 'RECURRING';

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  billingType: BillingType;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  dealId: string;
  customerId: string;
  billingType: BillingType;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  subtotal: number;
  taxableAmount: number;
  taxTotal: number;
  grandTotal: number;
  paidAmount: number;
  outstandingAmount: number;
  items: InvoiceItem[];
}

export interface Subscription {
  id: string;
  dealId: string;
  customerId: string;
  productId: string;
  productName: string;
  quantity: number;
  frequency: 'MONTHLY' | 'QUARTERLY' | 'YEARLY' | 'CUSTOM';
  amount: number;
  startDate: string;
  endDate?: string;
  nextBillingDate: string;
  status: SubscriptionStatus;
}

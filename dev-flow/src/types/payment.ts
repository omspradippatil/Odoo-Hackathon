export type PaymentStatus = 
  | 'PAYMENT_PENDING'
  | 'PAYMENT_INITIATED'
  | 'PAYMENT_RECEIVED'
  | 'PAYMENT_PROTECTED'
  | 'PAYMENT_FAILED'
  | 'PARTIALLY_PAID'
  | 'FULFILMENT_PENDING'
  | 'DELIVERY_CONFIRMATION_PENDING'
  | 'RELEASE_ELIGIBLE'
  | 'PARTIALLY_SETTLED'
  | 'SETTLED'
  | 'UNDER_REVIEW'
  | 'REFUND_PENDING'
  | 'REFUNDED'
  | 'CANCELLED';

export type SettlementStatus = 
  | 'LOCKED'
  | 'PENDING_FULFILMENT'
  | 'READY'
  | 'RELEASED'
  | 'ON_HOLD';

export interface PaymentMilestone {
  id: string;
  sequence: number;
  title: string;
  percentage: number;
  amount: number;
  dueTrigger: 'IMMEDIATE' | 'ORDER_CONFIRMATION' | 'SHIPMENT' | 'DELIVERY' | 'CUSTOM_DATE';
  status: 'PENDING' | 'PAID';
  dueDate?: string;
  paidAt?: string;
}

export interface SettlementAllocation {
  id: string;
  vendorName: string;
  allocatedAmount: number;
  settlementStatus: SettlementStatus;
  releaseCondition: string;
}

export interface PaymentEvent {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  isCompleted: boolean;
}

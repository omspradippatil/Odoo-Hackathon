export enum DealStage {
  DRAFT = 'DRAFT',
  SOURCING = 'SOURCING',
  QUOTES_RECEIVED = 'QUOTES_RECEIVED',
  COMPARING = 'COMPARING',
  QUOTATION_CREATED = 'QUOTATION_CREATED',
  APPROVAL_REQUIRED = 'APPROVAL_REQUIRED',
  APPROVED = 'APPROVED',
  NEGOTIATING = 'NEGOTIATING',
  REAPPROVAL_REQUIRED = 'REAPPROVAL_REQUIRED',
  PAYMENT_PENDING = 'PAYMENT_PENDING',
  PAYMENT_PROTECTED = 'PAYMENT_PROTECTED',
  FULFILMENT = 'FULFILMENT',
  DELIVERED = 'DELIVERED',
  INVOICED = 'INVOICED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface DealSummary {
  id: string;
  title: string;
  customer?: string;
  vendor?: string;
  amount: number;
  stage: DealStage;
  statusLabel: string;
  health: 'HEALTHY' | 'NEEDS_ATTENTION' | 'AT_RISK';
  nextAction?: string;
  updatedAt: string;
  trustTier?: 'GOLD' | 'SILVER' | 'BRONZE' | 'NONE';
  priority?: 'HIGH' | 'NORMAL';
  insight?: string;
}

export interface Notification {
  id: string;
  type: string;
  message: string;
  timestamp: string;
  read: boolean;
}

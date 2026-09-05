export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'REVISION_REQUIRED' | 'ESCALATED';
export type ApprovalPriority = 'HIGH' | 'MEDIUM' | 'LOW';

export interface ApprovalTrigger {
  type: string;
  currentValue: string;
  threshold: string;
  reason: string;
}

export interface ApprovalStep {
  id: string;
  level: number;
  approverRole: string;
  approverName?: string;
  status: 'DONE' | 'CURRENT' | 'WAITING' | 'SKIPPED';
  authorityLimit?: string;
}

export interface ApprovalHistoryEvent {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: string;
  action: string;
  comment?: string;
}

export interface ApprovalRequest {
  id: string; // e.g. APR-9912
  quotationId: string; // e.g. QT-2048
  quotationTitle: string; // e.g. NOVA RETAIL EXPANSION
  requestedBy: string;
  requesterRole: string;
  status: ApprovalStatus;
  priority: ApprovalPriority;
  submittedAt: string;
  waitingTime: string; // e.g. "18 minutes"
  
  // High-level commercial context
  dealValue: number;
  requestedDiscountPercent: number;
  marginPercent: number;
  
  // Deep context (for detail page)
  originalDealValue?: number;
  originalMarginValue?: number;
  originalMarginPercent?: number;
  newMarginValue?: number;
  
  triggers: ApprovalTrigger[];
  approvalSteps: ApprovalStep[];
  history: ApprovalHistoryEvent[];
  
  requesterNote?: string;
  
  // Sourcing context summary
  vendorName?: string;
  vendorTrustTier?: string;
  vendorTrustScore?: number;
  vendorDeliveryDays?: number;
  isSplit?: boolean;
}

export type HealthLevel = 'HEALTHY' | 'WATCH' | 'AT_RISK' | 'CRITICAL_REVIEW';
export type SignalSeverity = 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type SignalStatus = 'OPEN' | 'ACKNOWLEDGED' | 'UNDER_REVIEW' | 'RESOLVED' | 'DISMISSED';
export type SignalCategory = 'COMMERCIAL' | 'APPROVAL' | 'VENDOR' | 'PAYMENT' | 'SETTLEMENT' | 'FULFILMENT' | 'CUSTOMER' | 'BILLING' | 'SUBSCRIPTION' | 'SECURITY';

export interface DealSignal {
  id: string;
  dealId: string;
  category: SignalCategory;
  severity: SignalSeverity;
  title: string;
  description: string;
  source: string;
  status: SignalStatus;
  detectedAt: string;
  currentValue?: string;
  previousValue?: string;
  recommendedAction: string;
  actionUrl?: string;
}

export interface HealthFactor {
  key: string;
  label: string;
  score: number;
}

export interface DealHealth {
  dealId: string;
  score: number;
  level: HealthLevel;
  evaluatedAt: string;
  activeSignalCount: number;
  highestSeverity: SignalSeverity | null;
  factors: HealthFactor[];
  signals: DealSignal[];
}

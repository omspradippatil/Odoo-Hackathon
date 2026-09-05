export type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'sales' | 'customer' | 'seller';
};

export type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  image?: string;
};

export type QuotationLine = {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
  margin: number;
};

export type Quotation = {
  id: string;
  customerName: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'stalled';
  total: number;
  riskScore: number;
  lines: QuotationLine[];
  daysInactive?: number;
};

export type Deal = {
  id: string;
  name: string;
  value: number;
  status: string;
  anomaly?: string;
};

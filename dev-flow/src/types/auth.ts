export enum UserRole {
  BUYER = 'BUYER',
  SELLER = 'SELLER',
  SALES_REP = 'SALES_REP',
  SALES_MANAGER = 'SALES_MANAGER',
  FINANCE_OPERATIONS = 'FINANCE_OPERATIONS',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  organization?: string;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

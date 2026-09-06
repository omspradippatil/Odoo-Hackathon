import { User, UserRole, AuthResponse } from "@/types/auth";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const MOCK_USERS: Record<string, User> = {
  // Official Aakalan360 login credentials
  "buyer@aakalan360.com": { id: "usr_buyer", email: "buyer@aakalan360.com", fullName: "Kadambari Ganore", role: UserRole.BUYER, createdAt: new Date().toISOString() },
  "seller@aakalan360.com": { id: "usr_seller", email: "seller@aakalan360.com", fullName: "Vertex Systems", role: UserRole.SELLER, createdAt: new Date().toISOString() },
  "sales@aakalan360.com": { id: "usr_sales", email: "sales@aakalan360.com", fullName: "Rahul Mehta", role: UserRole.SALES_MANAGER, createdAt: new Date().toISOString() },
  "ops@aakalan360.com": { id: "usr_ops", email: "ops@aakalan360.com", fullName: "Finance Team", role: UserRole.FINANCE_OPERATIONS, createdAt: new Date().toISOString() },
  "customer@aakalan360.com": { id: "usr_customer", email: "customer@aakalan360.com", fullName: "Nova Retail", role: UserRole.CUSTOMER, createdAt: new Date().toISOString() },
  "admin@aakalan360.com": { id: "usr_admin", email: "admin@aakalan360.com", fullName: "System Admin", role: UserRole.ADMIN, createdAt: new Date().toISOString() },
  // Backward-compatibility aliases for legacy demo links
  "buyer@devflow.com": { id: "usr_buyer", email: "buyer@aakalan360.com", fullName: "Kadambari Ganore", role: UserRole.BUYER, createdAt: new Date().toISOString() },
  "seller@devflow.com": { id: "usr_seller", email: "seller@aakalan360.com", fullName: "Vertex Systems", role: UserRole.SELLER, createdAt: new Date().toISOString() },
  "sales@devflow.com": { id: "usr_sales", email: "sales@aakalan360.com", fullName: "Rahul Mehta", role: UserRole.SALES_MANAGER, createdAt: new Date().toISOString() },
  "ops@devflow.com": { id: "usr_ops", email: "ops@aakalan360.com", fullName: "Finance Team", role: UserRole.FINANCE_OPERATIONS, createdAt: new Date().toISOString() },
  "customer@devflow.com": { id: "usr_customer", email: "customer@aakalan360.com", fullName: "Nova Retail", role: UserRole.CUSTOMER, createdAt: new Date().toISOString() },
  "admin@devflow.com": { id: "usr_admin", email: "admin@aakalan360.com", fullName: "System Admin", role: UserRole.ADMIN, createdAt: new Date().toISOString() }
};

export const authService = {
  async login(email: string, password: string):Promise<AuthResponse> {
    await delay(800);

    // Enforce strict login credentials matching mock database
    const user = MOCK_USERS[email.toLowerCase()];
    
    // In a real app, Spring Boot would hash and verify password. 
    // Here we strictly check 'password123' to simulate proper authentication.
    if (!user || password !== "password123") {
      throw new Error("Incorrect email or password.");
    }

    sessionStorage.setItem("aakalan_user", JSON.stringify(user));
    sessionStorage.setItem("devflow_user", JSON.stringify(user));
    return { user, token: "mock-jwt-token" };
  },

  async signup(payload: any): Promise<AuthResponse> {
    await delay(1500);
    
    if (!payload.email || !payload.password) {
      throw new Error("Invalid payload");
    }
    
    // Disallow admin signup
    if (payload.role === UserRole.ADMIN || payload.role === "ADMIN") {
      throw new Error("Cannot sign up as Administrator.");
    }

    const user = {
      id: "usr_" + Math.floor(Math.random() * 10000),
      email: payload.email,
      fullName: payload.fullName,
      role: payload.role || UserRole.BUYER,
      organization: payload.company,
      createdAt: new Date().toISOString()
    };
    sessionStorage.setItem("aakalan_user", JSON.stringify(user));
    sessionStorage.setItem("devflow_user", JSON.stringify(user));
    
    return { user, token: "mock-jwt-token" };
  },

  async logout(): Promise<void> {
    await delay(300);
    sessionStorage.removeItem("aakalan_user");
    sessionStorage.removeItem("devflow_user");
  },

  async getCurrentUser(): Promise<User | null> {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("aakalan_user") || sessionStorage.getItem("devflow_user");
      if (stored) return JSON.parse(stored);
    }
    return null;
  }
};

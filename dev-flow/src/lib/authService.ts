import { User, UserRole, AuthResponse } from "@/types/auth";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const MOCK_USERS: Record<string, User> = {
  "buyer@devflow.com": { id: "usr_buyer", email: "buyer@devflow.com", fullName: "Kadambari Ganore", role: UserRole.BUYER, createdAt: new Date().toISOString() },
  "seller@devflow.com": { id: "usr_seller", email: "seller@devflow.com", fullName: "Vertex Systems", role: UserRole.SELLER, createdAt: new Date().toISOString() },
  "sales@devflow.com": { id: "usr_sales", email: "sales@devflow.com", fullName: "Rahul Mehta", role: UserRole.SALES_MANAGER, createdAt: new Date().toISOString() },
  "ops@devflow.com": { id: "usr_ops", email: "ops@devflow.com", fullName: "Finance Team", role: UserRole.FINANCE_OPERATIONS, createdAt: new Date().toISOString() },
  "customer@devflow.com": { id: "usr_customer", email: "customer@devflow.com", fullName: "Nova Retail", role: UserRole.CUSTOMER, createdAt: new Date().toISOString() },
  "admin@devflow.com": { id: "usr_admin", email: "admin@devflow.com", fullName: "System Admin", role: UserRole.ADMIN, createdAt: new Date().toISOString() }
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
    sessionStorage.setItem("devflow_user", JSON.stringify(user));
    
    return { user, token: "mock-jwt-token" };
  },

  async logout(): Promise<void> {
    await delay(300);
    sessionStorage.removeItem("devflow_user");
  },

  async getCurrentUser(): Promise<User | null> {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("devflow_user");
      if (stored) return JSON.parse(stored);
    }
    return null;
  }
};

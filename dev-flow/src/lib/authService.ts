import { User, UserRole, AuthResponse } from "@/types/auth";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const authService = {
  async login(email: string, password: string):Promise<AuthResponse> {
    await delay(1200);

    if (email === "demo@devflow.com" && password === "Demo123!") {
      const user = {
        id: "usr_12345",
        email: "demo@devflow.com",
        fullName: "Demo User",
        role: UserRole.BUYER,
        createdAt: new Date().toISOString()
      };
      sessionStorage.setItem("devflow_user", JSON.stringify(user));
      return { user, token: "mock-jwt-token" };
    }

    if (password === "wrong") {
        throw new Error("Email or password is incorrect.");
    }
    
    if (!email.includes("@")) throw new Error("Please enter a valid email address.");

    const user = {
      id: "usr_99999",
      email,
      fullName: "New User",
      role: UserRole.BUYER, // Defaulting if random login
      createdAt: new Date().toISOString()
    };
    sessionStorage.setItem("devflow_user", JSON.stringify(user));
    return { user, token: "mock-jwt-token" };
  },

  async signup(payload: any): Promise<AuthResponse> {
    await delay(1500);
    
    if (!payload.email || !payload.password) {
      throw new Error("Invalid payload");
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
    await delay(500);
    sessionStorage.removeItem("devflow_user");
  },

  async getCurrentUser(): Promise<User | null> {
    await delay(300);
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("devflow_user");
      if (stored) return JSON.parse(stored);
    }
    return null;
  }
};

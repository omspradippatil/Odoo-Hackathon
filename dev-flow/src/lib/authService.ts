import { User, UserRole, AuthResponse } from "@/types/auth";

// This is a mock service layer ready for future Spring Boot REST API integration.
// e.g., POST /api/auth/login, POST /api/auth/register

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const authService = {
  async login(email: string, password: string):Promise<AuthResponse> {
    await delay(1200); // Simulate network

    if (email === "demo@devflow.com" && password === "Demo123!") {
      return {
        user: {
          id: "usr_12345",
          email: "demo@devflow.com",
          fullName: "Demo User",
          role: UserRole.BUYER,
          createdAt: new Date().toISOString()
        },
        token: "mock-jwt-token-replace-with-real-token"
      };
    }

    if (password === "wrong") {
        throw new Error("Email or password is incorrect.");
    }
    
    // Default success for demo flexibility if they just type whatever, unless specified otherwise.
    // Wait, requirement asks for specific demo testing. Let's make it accept anything that passes basic regex for demo purposes unless password is literally "wrong".
    if (!email.includes("@")) throw new Error("Please enter a valid email address.");

    return {
      user: {
        id: "usr_99999",
        email,
        fullName: "New User",
        role: UserRole.BUYER,
        createdAt: new Date().toISOString()
      },
      token: "mock-jwt-token-replace-with-real-token"
    };
  },

  async signup(payload: any): Promise<AuthResponse> {
    await delay(1500); // Simulate network
    
    // Simulate API validation
    if (!payload.email || !payload.password) {
      throw new Error("Invalid payload");
    }

    return {
      user: {
        id: "usr_" + Math.floor(Math.random() * 10000),
        email: payload.email,
        fullName: payload.fullName,
        role: payload.role || UserRole.BUYER,
        organization: payload.company,
        createdAt: new Date().toISOString()
      },
      token: "mock-jwt-token-replace-with-real-token"
    };
  },

  async logout(): Promise<void> {
    await delay(500);
    // Future: Clear tokens from HttpOnly cookies / localStorage
  },

  async getCurrentUser(): Promise<User | null> {
    await delay(300);
    // Future: Fetch /api/auth/me
    return null;
  }
};

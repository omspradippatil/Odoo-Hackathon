"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";
import api from "@/lib/api";
import { LogIn, UserPlus } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthContext();
  const [isLogin, setIsLogin] = useState(true);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState("SELLER");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      let res;
      if (isLogin) {
        res = await api.post("/auth/login", { email, password });
      } else {
        res = await api.post("/auth/signup", { 
          email, 
          password, 
          companyName, 
          role,
          mode: role === "CUSTOMER" || role === "VENDOR" ? "PROFESSIONAL" : "LOCAL"
        });
      }
      
      if (res.data && res.data.token && res.data.user) {
        login(res.data.user, res.data.token);
        if (res.data.user.role === 'SELLER') {
          router.push("/local/seller");
        } else {
          router.push("/dashboard");
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center font-black text-white text-xl mx-auto mb-4 shadow-lg shadow-blue-500/20">
            DF
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {isLogin ? "Welcome back" : "Create your account"}
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            {isLogin ? "Sign in to access your dashboard" : "Join DEV FLOW to buy or sell"}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600 font-semibold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="you@example.com"
            />
          </div>
          
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>

          {!isLogin && (
            <>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Company / Display Name</label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Acme Corp"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">I want to...</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                >
                  <option value="SELLER">Sell on Local Marketplace</option>
                  <option value="BUYER">Buy on Local Marketplace</option>
                  <option value="VENDOR">B2B Vendor (Professional)</option>
                  <option value="CUSTOMER">B2B Customer (Professional)</option>
                </select>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2 mt-6 shadow-sm"
          >
            {loading ? "Processing..." : isLogin ? <><LogIn className="w-4 h-4" /> Sign In</> : <><UserPlus className="w-4 h-4" /> Create Account</>}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="font-bold text-blue-600 hover:underline"
          >
            {isLogin ? "Sign up" : "Log in"}
          </button>
        </div>

        {isLogin && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center mb-3">Quick Login (Demo)</p>
            <div className="grid grid-cols-2 gap-2">
              <button 
                type="button"
                onClick={() => { setEmail("admin@devflow.com"); setPassword("admin123"); }}
                className="text-xs py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded font-medium transition"
              >
                Admin
              </button>
              <button 
                type="button"
                onClick={() => { setEmail("rep@devflow.com"); setPassword("rep123"); }}
                className="text-xs py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded font-medium transition"
              >
                Sales Rep
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import React, { useState, Suspense, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRightLeft, Lock, Mail, Eye, EyeOff, Loader2, Sparkles, Activity, ShieldCheck, CheckCircle2 } from "lucide-react";
import * as motion from "framer-motion/client";
import { AnimatePresence } from "framer-motion";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { Input } from "@/components/ui/Input";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { authService } from "@/lib/authService";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo");
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [storyStep, setStoryStep] = useState(0);

  // Left panel story animation
  useEffect(() => {
    const timer = setInterval(() => {
      setStoryStep((prev) => (prev + 1) % 5);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setIsLoading(true);
    try {
      const authRes = await authService.login(email, password);
      if (returnTo && returnTo.startsWith("/")) {
        router.push(returnTo);
      } else {
        // Role-based redirect
        switch(authRes?.user?.role) {
          case "BUYER": router.push("/buyer"); break;
          case "SELLER": router.push("/seller"); break;
          case "SALES_REP": router.push("/sales"); break;
          case "SALES_MANAGER": router.push("/approvals"); break;
          case "FINANCE_OPERATIONS": router.push("/operations"); break;
          case "ADMIN": router.push("/admin"); break;
          default: router.push("/buyer");
        }
      }
    } catch (err: any) {
      setError(err.message || "Email or password is incorrect.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setEmail("buyer@aakalan360.com");
    setPassword("password123");
  };

  return (
    <main className="min-h-screen bg-warm flex">
      {/* LEFT PANEL - STORYTELLING (Desktop Only) */}
      <div className="hidden lg:flex w-[55%] bg-navy p-12 flex-col justify-between relative overflow-hidden">
        <Link href="/" className="flex items-center gap-2 group z-20 w-fit cursor-pointer">
          <ArrowRightLeft className="w-5 h-5 text-white/50 group-hover:text-white transition-colors" />
          <span className="font-bold text-sm tracking-widest text-white/50 group-hover:text-white uppercase transition-colors">Back to Home</span>
        </Link>

        <div className="relative z-10 flex-1 flex flex-col items-center justify-center">
          <div className="w-full max-w-md aspect-square relative flex items-center justify-center">
            
            {/* Animated Story Sequence */}
            <AnimatePresence mode="wait">
              {storyStep === 0 && (
                <motion.div key="step0" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-white/5 border border-white/10 p-6 rounded-2xl text-center shadow-2xl backdrop-blur-sm">
                  <div className="text-[10px] font-bold text-white/50 tracking-widest uppercase mb-2">Requirement Created</div>
                  <div className="text-2xl font-bold text-white">50 Business Laptops</div>
                </motion.div>
              )}
              {storyStep === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex flex-col gap-3 w-full">
                  <div className="text-[10px] font-bold text-white/50 tracking-widest uppercase mb-2 text-center">Vendor Quotes Received</div>
                  {[1, 2, 3].map((i) => (
                    <motion.div key={i} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.1 }} className="bg-white/5 border border-white/10 p-4 rounded-xl flex justify-between items-center">
                      <div className="w-20 h-2 bg-white/20 rounded-full" />
                      <div className="w-12 h-4 bg-white/10 rounded-full" />
                    </motion.div>
                  ))}
                </motion.div>
              )}
              {storyStep === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }} className="flex flex-col items-center">
                  <Activity className="w-16 h-16 text-lime mb-6" />
                  <div className="text-2xl font-bold text-white mb-2">Trust Checked</div>
                  <div className="text-lime text-sm font-bold tracking-widest uppercase">3 Vendors Verified</div>
                </motion.div>
              )}
              {storyStep === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-white rounded-2xl p-6 text-center shadow-2xl shadow-coral/20 border-2 border-coral w-full max-w-sm relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-coral text-white text-[10px] font-bold uppercase tracking-widest rounded-full">Best Deal Identified</div>
                  <div className="text-3xl font-bold text-navy mt-4 mb-2">₹94,000</div>
                  <div className="text-sm font-bold text-navy/50 uppercase tracking-widest">Highest Trust & Speed</div>
                </motion.div>
              )}
              {storyStep === 4 && (
                <motion.div key="step4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }} className="flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full bg-cobalt flex items-center justify-center shadow-lg shadow-cobalt/20 mb-6">
                    <ShieldCheck className="w-12 h-12 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-2">Deal Protected</div>
                  <div className="text-cobalt text-sm font-bold tracking-widest uppercase">Safe Transaction</div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>

        <div className="relative z-10 max-w-md">
          <h2 className="text-3xl font-bold text-white mb-4 leading-tight">Every great deal starts with trust.</h2>
          <p className="text-white/60 text-lg leading-relaxed">Source, compare, negotiate and manage every deal from one intelligent workspace.</p>
        </div>

        {/* Decorative Flow Line */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" viewBox="0 0 1000 1000" preserveAspectRatio="none">
          <path d="M0,800 C300,800 400,200 1000,200" fill="none" stroke="url(#gradient)" strokeWidth="2" />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#C9FF5A" stopOpacity="0" />
              <stop offset="50%" stopColor="#C9FF5A" stopOpacity="1" />
              <stop offset="100%" stopColor="#C9FF5A" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* RIGHT PANEL - AUTH FORM */}
      <div className="w-full lg:w-[45%] flex flex-col justify-center px-6 md:px-12 lg:px-20 py-12 relative">
        <Link href="/" className="lg:hidden absolute top-6 left-6 flex items-center gap-2 group z-20 w-fit">
          <ArrowRightLeft className="w-5 h-5 text-navy/40" />
        </Link>
        
        <div className="w-full max-w-[400px] mx-auto">
          
          <div className="mb-10 text-center lg:text-left">
            <Link href="/" className="inline-flex items-center gap-2 mb-8 group">
              <BrandLogo variant="full" />
            </Link>
            
            <h1 className="text-3xl font-bold text-navy mb-2 tracking-tight">Welcome back to Aakalan360.</h1>
            <p className="text-navy/60 font-medium">Continue where your deal left off.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5" noValidate>
            
            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl bg-coral/10 border border-coral/20 text-coral text-sm font-medium">
                {error}
              </motion.div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-navy/70 uppercase tracking-widest ml-1">Email Address</label>
              <Input 
                type="email" 
                placeholder="name@company.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!error && error.toLowerCase().includes("email")}
                autoComplete="email"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-bold text-navy/70 uppercase tracking-widest">Password</label>
                <button type="button" className="text-xs font-bold text-cobalt hover:text-cobalt/80 transition-colors">Forgot Password?</button>
              </div>
              <div className="relative">
                <Input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={!!error && error.toLowerCase().includes("password")}
                  autoComplete="current-password"
                  className="pr-12"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-navy/40 hover:text-navy/70 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input type="checkbox" id="remember" className="w-4 h-4 rounded border-navy/20 text-navy focus:ring-navy/20 accent-navy cursor-pointer" />
              <label htmlFor="remember" className="text-sm font-medium text-navy/70 cursor-pointer select-none">Remember me for 30 days</label>
            </div>

            <div className="pt-4">
              <PrimaryButton type="submit" disabled={isLoading} className="w-full flex justify-center py-3.5 shadow-lg shadow-navy/10 text-base" showArrow={!isLoading}>
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
              </PrimaryButton>
            </div>
            
          </form>

          <div className="mt-8 text-center text-sm font-medium text-navy/60">
            New to Aakalan360? <Link href="/signup" className="text-navy font-bold hover:text-cobalt transition-colors inline-flex items-center gap-1">Create Account <ArrowRightLeft className="w-3 h-3" /></Link>
          </div>

          <div className="mt-8 relative flex items-center py-4">
            <div className="flex-grow border-t border-navy/10"></div>
            <span className="flex-shrink-0 mx-4 text-xs font-bold text-navy/30 uppercase tracking-widest">Demo Access</span>
            <div className="flex-grow border-t border-navy/10"></div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4">
            <button 
              type="button"
              onClick={() => {
                if (returnTo && returnTo.startsWith("/")) router.push(returnTo);
                else router.push('/buyer');
              }}
              className="py-2.5 rounded-xl border border-navy/10 text-navy font-bold text-xs hover:border-navy/20 hover:bg-navy/5 transition-all"
            >
              Continue as Buyer
            </button>
            <button 
              type="button"
              onClick={() => {
                if (returnTo && returnTo.startsWith("/")) router.push(returnTo);
                else router.push('/approvals');
              }}
              className="py-2.5 rounded-xl border border-navy/10 text-navy font-bold text-xs hover:border-navy/20 hover:bg-navy/5 transition-all"
            >
              Continue as Manager
            </button>
            <button 
              type="button"
              onClick={() => {
                if (returnTo && returnTo.startsWith("/")) router.push(returnTo);
                else router.push('/operations');
              }}
              className="py-2.5 rounded-xl border border-navy/10 text-navy font-bold text-xs hover:border-navy/20 hover:bg-navy/5 transition-all"
            >
              Continue as Ops
            </button>
            <button 
              type="button"
              onClick={() => {
                if (returnTo && returnTo.startsWith("/")) router.push(returnTo);
                else router.push('/admin');
              }}
              className="py-2.5 rounded-xl border border-navy/10 text-navy font-bold text-xs hover:border-navy/20 hover:bg-navy/5 transition-all"
            >
              Continue as Admin
            </button>
          </div>

          <div className="mt-4 text-center">
            <p className="text-[10px] font-bold text-navy/40 uppercase tracking-widest">For Evaluators: Use Demo Access to bypass auth.</p>
          </div>

        </div>
      </div>
    </main>
  );
}


export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-warm flex items-center justify-center">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}

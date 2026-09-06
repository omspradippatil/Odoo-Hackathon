"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRightLeft, Eye, EyeOff, Loader2, CheckCircle2, ChevronRight, Briefcase, ShoppingBag, Store, UserCog, Calculator, MapPin } from "lucide-react";
import * as motion from "framer-motion/client";
import { AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/Input";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { authService } from "@/lib/authService";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { UserRole } from "@/types/auth";
import { cn } from "@/lib/utils";

const ROLES = [
  { id: UserRole.BUYER, title: "Buyer / Customer", desc: "Discover sellers, compare deals, negotiate and manage purchases.", best: "individuals and purchasing customers", icon: ShoppingBag, color: "text-coral", border: "border-coral", bg: "bg-coral/10" },
  { id: UserRole.SELLER, title: "Seller / Vendor", desc: "Receive requirements, submit quotations, manage fulfilment and build your trust profile.", best: "local sellers and professional vendors", icon: Store, color: "text-cobalt", border: "border-cobalt", bg: "bg-cobalt/10" },
  { id: UserRole.SALES_REP, title: "Sales Representative", desc: "Create quotations, manage customers and move deals through the pipeline.", best: "", icon: Briefcase, color: "text-navy", border: "border-navy", bg: "bg-navy/10" },
  { id: UserRole.SALES_MANAGER, title: "Sales Manager / Approver", desc: "Review discounts, approve high-risk quotations and monitor deal health.", best: "", icon: UserCog, color: "text-lime", border: "border-lime", bg: "bg-lime/20" },
  { id: UserRole.FINANCE_OPERATIONS, title: "Finance / Operations", desc: "Manage high-level approvals, billing, fulfilment and payment operations.", best: "", icon: Calculator, color: "text-orange-600", border: "border-orange-600", bg: "bg-orange-600/10" }
];

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo");
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    company: "",
    state: "",
    town: "",
    village: "",
    address: "",
    role: UserRole.BUYER as UserRole,
    password: "",
    confirmPassword: "",
    agree: false
  });

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleAutoDetect = () => {
    setIsDetecting(true);
    // Simulate network delay for geolocation/geocoding
    setTimeout(() => {
      setFormData(prev => ({
        ...prev,
        state: "Maharashtra",
        town: "Palghar",
        village: "Boisar",
        address: "123 Smart City Road, Boisar, Palghar, Maharashtra 401501"
      }));
      setIsDetecting(false);
    }, 1500);
  };

  const validateStep1 = () => {
    if (!formData.fullName || !formData.email || !formData.phone) {
      setError("Please fill in all required fields.");
      return false;
    }
    if (!formData.email.includes("@")) {
      setError("Please enter a valid email address.");
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }
    if (!formData.agree) {
      setError("You must agree to the Terms and Privacy Policy.");
      return false;
    }
    return true;
  };

  const nextStep = () => {
    setError("");
    if (step === 1 && !validateStep1()) return;
    setStep(s => s + 1);
  };

  const prevStep = () => {
    setError("");
    setStep(s => s - 1);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep3()) return;

    setIsLoading(true);
    try {
      await authService.signup(formData);
      setStep(4); // Success State
    } catch (err: any) {
      setError(err.message || "Failed to create account.");
    } finally {
      setIsLoading(false);
    }
  };

  // Password Requirements Logic
  const hasMinLength = formData.password.length >= 8;
  const hasUpper = /[A-Z]/.test(formData.password);
  const hasNumber = /[0-9]/.test(formData.password);
  const hasSpecial = /[^A-Za-z0-9]/.test(formData.password);

  return (
    <main className="min-h-screen bg-warm flex flex-col lg:flex-row">
      {/* LEFT PANEL - PROGRESS (Desktop) */}
      <div className="hidden lg:flex w-[40%] bg-navy p-12 flex-col relative overflow-hidden">
        <div className="flex items-center justify-between mb-16 z-20">
          <Link href="/" className="flex items-center group cursor-pointer">
            <BrandLogo variant="full" theme="dark" />
          </Link>
          <Link href="/" className="flex items-center gap-1.5 text-white/50 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors">
            <ArrowRightLeft className="w-4 h-4" /> Home
          </Link>
        </div>

        <div className="relative z-10 flex flex-col gap-10 mt-10">
          {[
            { num: "01", title: "About You", desc: "Basic information" },
            { num: "02", title: "Your Role", desc: "Workspace setup" },
            { num: "03", title: "Secure Account", desc: "Password & security" }
          ].map((item, i) => {
            const stepNum = i + 1;
            const isActive = step === stepNum;
            const isPast = step > stepNum;
            const isSuccess = step === 4;

            return (
              <div key={item.num} className={cn("flex gap-6 transition-all duration-500", (isActive || (isSuccess && stepNum === 3)) ? "opacity-100 scale-105" : "opacity-40")}>
                <div className="flex flex-col items-center">
                  <div className={cn("w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-colors duration-500", isActive ? "border-coral bg-coral text-white" : isPast ? "border-lime bg-lime text-navy" : "border-white/20 text-white/50")}>
                    {isPast ? <CheckCircle2 className="w-5 h-5" /> : item.num}
                  </div>
                  {stepNum !== 3 && <div className={cn("w-0.5 h-12 mt-2 rounded-full transition-colors duration-500", isPast ? "bg-lime" : "bg-white/10")} />}
                </div>
                <div className="pt-2">
                  <div className="text-xl font-bold text-white mb-1">{item.title}</div>
                  <div className="text-sm font-medium text-white/50">{item.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MOBILE PROGRESS INDICATOR */}
      <div className="lg:hidden flex items-center justify-between px-6 pt-6 pb-2 bg-warm sticky top-0 z-20 border-b border-navy/5">
        <Link href="/" className="p-2 -ml-2 text-navy/40">
          <ArrowRightLeft className="w-5 h-5" />
        </Link>
        {step < 4 && (
          <div className="text-xs font-bold text-navy/40 tracking-widest uppercase">
            Step {step} of 3
          </div>
        )}
      </div>

      {/* RIGHT PANEL - FORM */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="w-full max-w-[500px] mx-auto px-6 py-12 lg:py-24">

          <AnimatePresence mode="wait">

            {/* STEP 1: BASIC INFO */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h1 className="text-3xl font-bold text-navy mb-2 tracking-tight">Let's start with you.</h1>
                <p className="text-navy/60 font-medium mb-10">Tell us who's joining Aakalan360.</p>

                {error && <div className="p-4 mb-6 rounded-xl bg-coral/10 text-coral text-sm font-medium">{error}</div>}

                <div className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-navy/70 uppercase tracking-widest ml-1">Full Name <span className="text-coral">*</span></label>
                    <Input placeholder="John Doe" value={formData.fullName} onChange={e => handleChange("fullName", e.target.value)} autoComplete="name" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-navy/70 uppercase tracking-widest ml-1">Email Address <span className="text-coral">*</span></label>
                    <Input type="email" placeholder="name@company.com" value={formData.email} onChange={e => handleChange("email", e.target.value)} autoComplete="email" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-navy/70 uppercase tracking-widest ml-1">Phone Number <span className="text-coral">*</span></label>
                    <Input type="tel" placeholder="+1 (555) 000-0000" value={formData.phone} onChange={e => handleChange("phone", e.target.value)} autoComplete="tel" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-navy/70 uppercase tracking-widest ml-1">Company / Organization <span className="text-navy/30 font-normal lowercase tracking-normal">(Optional)</span></label>
                    <Input placeholder="Acme Corp" value={formData.company} onChange={e => handleChange("company", e.target.value)} autoComplete="organization" />
                  </div>

                  <div className="space-y-1.5 pt-4 border-t border-navy/10 mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-navy/70 uppercase tracking-widest ml-1">Location Details</label>
                      <button type="button" onClick={handleAutoDetect} className="text-[10px] font-bold text-coral flex items-center gap-1.5 hover:text-coral/80 transition-colors bg-coral/10 px-3 py-1.5 rounded-full uppercase tracking-wider">
                        {isDetecting ? <Loader2 className="w-3 h-3 animate-spin" /> : <MapPin className="w-3 h-3" />}
                        {isDetecting ? "Detecting..." : "Auto-Detect Address"}
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-navy/50 uppercase tracking-widest ml-1">State</label>
                        <div className="relative">
                          <select 
                            className="w-full bg-white border border-navy/10 rounded-xl px-4 py-3.5 text-sm font-medium text-navy focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy/20 transition-all shadow-sm appearance-none"
                            value={formData.state}
                            onChange={e => handleChange("state", e.target.value)}
                          >
                            <option value="">Select State</option>
                            <option value="Maharashtra">Maharashtra</option>
                            <option value="Gujarat">Gujarat</option>
                            <option value="Karnataka">Karnataka</option>
                          </select>
                          <ChevronRight className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-navy/40 rotate-90 pointer-events-none" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-navy/50 uppercase tracking-widest ml-1">Town</label>
                        <div className="relative">
                          <select 
                            className="w-full bg-white border border-navy/10 rounded-xl px-4 py-3.5 text-sm font-medium text-navy focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy/20 transition-all shadow-sm appearance-none"
                            value={formData.town}
                            onChange={e => handleChange("town", e.target.value)}
                          >
                            <option value="">Select Town</option>
                            <option value="Mumbai">Mumbai</option>
                            <option value="Palghar">Palghar</option>
                            <option value="Bhayandar">Bhayandar</option>
                            <option value="Surat">Surat</option>
                            <option value="Bengaluru">Bengaluru</option>
                          </select>
                          <ChevronRight className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-navy/40 rotate-90 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-navy/50 uppercase tracking-widest ml-1">Village/Area</label>
                        <div className="relative">
                          <select 
                            className="w-full bg-white border border-navy/10 rounded-xl px-4 py-3.5 text-sm font-medium text-navy focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy/20 transition-all shadow-sm appearance-none"
                            value={formData.village}
                            onChange={e => handleChange("village", e.target.value)}
                          >
                            <option value="">Select Village</option>
                            <option value="Boisar">Boisar</option>
                            <option value="Safale">Safale</option>
                            <option value="Virar">Virar</option>
                            <option value="Koramangala">Koramangala</option>
                          </select>
                          <ChevronRight className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-navy/40 rotate-90 pointer-events-none" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-navy/50 uppercase tracking-widest ml-1">Detected Address</label>
                        <div className="relative">
                          <Input 
                            placeholder="Address will appear here..." 
                            value={formData.address} 
                            readOnly 
                            className={formData.address ? "bg-lime/5 border-lime/20 text-navy font-semibold pr-10" : "bg-navy/5 cursor-not-allowed text-navy/60"}
                          />
                          {formData.address && <CheckCircle2 className="w-4 h-4 text-lime absolute right-4 top-1/2 -translate-y-1/2" />}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6">
                    <PrimaryButton onClick={nextStep} className="w-full flex justify-center py-3.5 shadow-lg text-base" showArrow>Continue</PrimaryButton>
                  </div>
                  <div className="text-center text-sm font-medium text-navy/60 mt-6">
                    Already have an account? <Link href="/login" className="text-navy font-bold hover:text-cobalt transition-colors">Sign In</Link>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: ROLE SELECTION */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h1 className="text-3xl font-bold text-navy mb-2 tracking-tight">How will you use Aakalan360?</h1>
                <p className="text-navy/60 font-medium mb-8">Choose your primary role. Your workspace will be personalized around it.</p>

                <div className="space-y-4 mb-8">
                  {ROLES.map((role) => {
                    const isSelected = formData.role === role.id;
                    const Icon = role.icon;
                    return (
                      <button
                        key={role.id}
                        onClick={() => handleChange("role", role.id)}
                        className={cn(
                          "w-full text-left p-5 rounded-2xl border-2 transition-all duration-300 relative overflow-hidden group outline-none focus-visible:ring-2 focus-visible:ring-navy/20",
                          isSelected ? cn(role.border, "bg-white shadow-lg scale-[1.02]") : "border-navy/10 bg-white hover:border-navy/20 hover:bg-navy/[0.02]"
                        )}
                      >
                        {isSelected && <div className={cn("absolute top-5 right-5 w-5 h-5 rounded-full flex items-center justify-center", role.bg, role.color)}><CheckCircle2 className="w-3.5 h-3.5" /></div>}
                        <div className="flex gap-4">
                          <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors", isSelected ? role.bg : "bg-navy/5", isSelected ? role.color : "text-navy/50 group-hover:text-navy/70")}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <div>
                            <div className="font-bold text-navy mb-1">{role.title}</div>
                            <div className="text-sm font-medium text-navy/60 leading-relaxed mb-2 pr-6">{role.desc}</div>
                            {role.best && <div className={cn("text-[10px] font-bold tracking-widest uppercase", isSelected ? role.color : "text-navy/40")}>Best for: {role.best}</div>}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <PrimaryButton onClick={prevStep} variant="outline" className="px-6 py-3.5">Back</PrimaryButton>
                  <PrimaryButton onClick={nextStep} className="flex-1 justify-center py-3.5 shadow-lg text-base" showArrow>Continue</PrimaryButton>
                </div>
              </motion.div>
            )}

            {/* STEP 3: SECURE ACCOUNT */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h1 className="text-3xl font-bold text-navy mb-2 tracking-tight">Secure your account.</h1>
                <p className="text-navy/60 font-medium mb-10">Create a strong password for your new workspace.</p>

                {error && <div className="p-4 mb-6 rounded-xl bg-coral/10 text-coral text-sm font-medium">{error}</div>}

                <form onSubmit={handleSignup} className="space-y-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-navy/70 uppercase tracking-widest ml-1">Password</label>
                    <div className="relative">
                      <Input type={showPassword ? "text" : "password"} value={formData.password} onChange={e => handleChange("password", e.target.value)} className="pr-12" autoComplete="new-password" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-navy/40 hover:text-navy/70 transition-colors">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-navy/70 uppercase tracking-widest ml-1">Confirm Password</label>
                    <div className="relative">
                      <Input type={showConfirm ? "text" : "password"} value={formData.confirmPassword} onChange={e => handleChange("confirmPassword", e.target.value)} className="pr-12" autoComplete="new-password" />
                      <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-navy/40 hover:text-navy/70 transition-colors">
                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Requirements Progress */}
                  <div className="bg-navy/5 p-5 rounded-2xl space-y-3">
                    <div className="text-xs font-bold uppercase tracking-widest text-navy/60 mb-2">Password Requirements</div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className={cn("flex items-center gap-2 text-sm font-medium transition-colors", hasMinLength ? "text-lime font-bold" : "text-navy/50")}>
                        <CheckCircle2 className="w-4 h-4" /> 8+ Characters
                      </div>
                      <div className={cn("flex items-center gap-2 text-sm font-medium transition-colors", hasUpper ? "text-lime font-bold" : "text-navy/50")}>
                        <CheckCircle2 className="w-4 h-4" /> 1 Uppercase
                      </div>
                      <div className={cn("flex items-center gap-2 text-sm font-medium transition-colors", hasNumber ? "text-lime font-bold" : "text-navy/50")}>
                        <CheckCircle2 className="w-4 h-4" /> 1 Number
                      </div>
                      <div className={cn("flex items-center gap-2 text-sm font-medium transition-colors", hasSpecial ? "text-lime font-bold" : "text-navy/50")}>
                        <CheckCircle2 className="w-4 h-4" /> 1 Special Char
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 pt-2">
                    <input type="checkbox" id="agree" checked={formData.agree} onChange={e => handleChange("agree", e.target.checked)} className="mt-1 w-5 h-5 rounded border-navy/20 text-navy focus:ring-navy/20 accent-navy cursor-pointer" />
                    <label htmlFor="agree" className="text-sm font-medium text-navy/70 cursor-pointer select-none leading-relaxed">
                      I agree to the <Link href="/legal" className="text-navy font-bold hover:underline">Terms of Service</Link> and <Link href="/legal" className="text-navy font-bold hover:underline">Privacy Policy</Link>.
                    </label>
                  </div>

                  <div className="flex items-center gap-4 pt-6">
                    <PrimaryButton type="button" onClick={prevStep} variant="outline" className="px-6 py-3.5" disabled={isLoading}>Back</PrimaryButton>
                    <PrimaryButton type="submit" disabled={isLoading || !hasMinLength || !hasUpper || !hasNumber || !hasSpecial || !formData.agree} className="flex-1 justify-center py-3.5 shadow-lg text-base">
                      {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Account"}
                      {!isLoading && <ChevronRight className="w-4 h-4 ml-2" />}
                    </PrimaryButton>
                  </div>
                </form>
              </motion.div>
            )}

            {/* STEP 4: SUCCESS */}
            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center text-center py-10">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }} className="w-24 h-24 rounded-full bg-lime/20 flex items-center justify-center mb-8 shadow-xl shadow-lime/10">
                  <CheckCircle2 className="w-12 h-12 text-lime" />
                </motion.div>

                <h1 className="text-3xl md:text-4xl font-bold text-navy mb-4 tracking-tight">Welcome to Aakalan360,<br />{formData.fullName.split(' ')[0]}.</h1>

                <div className="bg-white border border-navy/10 rounded-2xl p-6 mb-10 shadow-lg shadow-navy/5 max-w-sm w-full mx-auto">
                  <div className="text-xs font-bold uppercase tracking-widest text-navy/40 mb-2">Workspace Preparation</div>
                  <div className="font-bold text-navy">{ROLES.find(r => r.id === formData.role)?.title}</div>
                </div>

                <PrimaryButton href="/onboarding" className="w-full max-w-sm flex justify-center py-4 text-base shadow-lg" showArrow>Continue to Workspace</PrimaryButton>
              </motion.div>
            )}

          </AnimatePresence>

        </div>
      </div>
    </main>
  );
}


export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-warm flex items-center justify-center">Loading...</div>}>
      <SignupContent />
    </Suspense>
  );
}

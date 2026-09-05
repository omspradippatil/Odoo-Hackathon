"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRightLeft, ShieldCheck, CheckCircle2, Building2, MapPin, Briefcase, FileText, Check, ChevronRight, Activity } from "lucide-react";
import * as motion from "framer-motion/client";
import { AnimatePresence } from "framer-motion";
import { authService } from "@/lib/authService";
import { User, UserRole } from "@/types/auth";
import { OnboardingProfile } from "@/types/onboarding";
import { Input } from "@/components/ui/Input";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { cn } from "@/lib/utils";

// Helper components for the forms
const OptionCard = ({ title, description, selected, onClick, icon: Icon }: any) => (
  <button 
    onClick={onClick}
    className={cn(
      "w-full text-left p-4 rounded-2xl border-2 transition-all duration-300 relative group flex items-start gap-4",
      selected ? "border-cobalt bg-cobalt/5 shadow-md" : "border-navy/10 bg-white hover:border-navy/20 hover:bg-navy/5"
    )}
  >
    {selected && <div className="absolute top-4 right-4 text-cobalt"><CheckCircle2 className="w-5 h-5" /></div>}
    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors", selected ? "bg-cobalt text-white" : "bg-navy/5 text-navy/50")}>
      {Icon && <Icon className="w-5 h-5" />}
    </div>
    <div className="pr-8">
      <div className={cn("font-bold mb-1 transition-colors", selected ? "text-cobalt" : "text-navy")}>{title}</div>
      {description && <div className="text-xs font-medium text-navy/60 leading-relaxed">{description}</div>}
    </div>
  </button>
);

const Chip = ({ label, selected, onClick }: any) => (
  <button
    onClick={onClick}
    className={cn(
      "px-4 py-2 rounded-full text-sm font-bold border-2 transition-colors duration-200",
      selected ? "bg-navy text-white border-navy" : "bg-white text-navy/60 border-navy/10 hover:border-navy/30"
    )}
  >
    {label}
  </button>
);

export default function OnboardingPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [profile, setProfile] = useState<OnboardingProfile>({
    role: UserRole.BUYER,
    dealTypes: [],
    categories: [],
    deliveryCapabilities: [],
    primaryResponsibilities: []
  });

  useEffect(() => {
    authService.getCurrentUser().then(u => {
      if (u) {
        setUser(u);
        setProfile(prev => ({ ...prev, role: u.role, organization: u.organization || "" }));
      } else {
        // Fallback for testing if refreshed
        const mockUser: User = { id: "usr_mock", email: "demo@devflow.com", fullName: "Demo User", role: UserRole.BUYER, createdAt: "" };
        setUser(mockUser);
        setProfile(prev => ({ ...prev, role: UserRole.BUYER }));
      }
      setLoading(false);
    });
  }, []);

  const handleNext = () => {
    setError("");
    if (step === 2 && (profile.role === UserRole.BUYER || profile.role === UserRole.SELLER)) {
      if (!profile.city?.trim()) {
        setError("Please enter your city / primary location.");
        return;
      }
    }
    setStep(s => Math.min(s + 1, 3));
  };
  const handleBack = () => { setError(""); setStep(s => Math.max(s - 1, 1)); };
  const handleComplete = () => {
    // Route based on role placeholders
    const routes: Record<string, string> = {
      [UserRole.BUYER]: "/buyer",
      [UserRole.SELLER]: "/seller",
      [UserRole.SALES_REP]: "/sales",
      [UserRole.SALES_MANAGER]: "/approvals",
      [UserRole.FINANCE_OPERATIONS]: "/operations",
      [UserRole.ADMIN]: "/dashboard",
    };
    router.push(routes[profile.role] || "/dashboard");
  };

  const toggleArray = (field: keyof OnboardingProfile, value: string) => {
    setProfile(prev => {
      const arr = (prev[field] as string[]) || [];
      return { ...prev, [field]: arr.includes(value) ? arr.filter(x => x !== value) : [...arr, value] };
    });
  };

  const setSingleArray = (field: keyof OnboardingProfile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: [value] }));
  };

  if (loading || !user) return <div className="min-h-screen bg-warm" />;

  const isBuyer = profile.role === UserRole.BUYER;
  const isSeller = profile.role === UserRole.SELLER;
  const isSalesRep = profile.role === UserRole.SALES_REP;
  const isManager = profile.role === UserRole.SALES_MANAGER;
  const isFinance = profile.role === UserRole.FINANCE_OPERATIONS;

  // Visual text mappings
  const welcomeText = isBuyer ? `Let's set up your Buyer workspace.` : 
                      isSeller ? `Let's get your Vendor profile ready for business.` : 
                      isSalesRep ? `Set up your sales workspace.` :
                      isManager ? `Prepare your approval workspace.` : `Set up your operations workspace.`;

  const rightVisualContent = () => {
    if (step === 3) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center p-12">
          <div className="w-24 h-24 rounded-full bg-lime/20 flex items-center justify-center mb-8 shadow-xl shadow-lime/10">
            <CheckCircle2 className="w-12 h-12 text-lime" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">YOUR WORKSPACE IS READY</h2>
          <div className="space-y-3 mb-10 text-white/60 font-medium">
            <div className="flex items-center gap-2 justify-center"><Check className="w-4 h-4 text-lime" /> Profile created</div>
            <div className="flex items-center gap-2 justify-center"><Check className="w-4 h-4 text-lime" /> Preferences saved</div>
            <div className="flex items-center gap-2 justify-center"><Check className="w-4 h-4 text-lime" /> DEV FLOW personalized</div>
          </div>
        </div>
      );
    }

    if (isBuyer) return <VisualFlow steps={["Requirement", "Vendor Discovery", "Smart Comparison", "Best Deal"]} />;
    if (isSeller) return <VisualFlow steps={["Seller Profile", "Trust Engine", "Opportunities", "Deals"]} />;
    if (isSalesRep) return <VisualFlow steps={["Create Quotations", "Compare Vendors", "Apply Discounts", "Request Approvals", "Track Deals"]} />;
    return <VisualFlow steps={["Secure Gateway", "Role Verification", "Policy Application", "Workspace Access"]} />;
  };

  return (
    <main className="min-h-screen bg-warm flex flex-col md:flex-row">
      
      {/* MOBILE PROGRESS HEADER */}
      <div className="md:hidden flex flex-col px-6 pt-6 pb-4 bg-white sticky top-0 z-30 border-b border-navy/5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-navy">
            <ArrowRightLeft className="w-5 h-5" />
            <span className="font-bold text-sm tracking-widest uppercase">DEV FLOW</span>
          </div>
          <div className="text-xs font-bold text-navy/40 uppercase tracking-widest">
            {step} of 3
          </div>
        </div>
        <ProgressLine step={step} />
      </div>

      {/* LEFT PANEL - FORM AREA */}
      <div className="flex-1 flex flex-col relative bg-warm overflow-y-auto">
        <div className="w-full max-w-2xl mx-auto px-6 py-10 md:py-16 lg:py-24 flex flex-col min-h-[calc(100vh-100px)] md:min-h-screen">
          
          {/* DESKTOP HEADER & PROGRESS */}
          <div className="hidden md:block mb-12">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2 text-navy">
                <ArrowRightLeft className="w-6 h-6" />
                <span className="font-bold text-lg tracking-tight">DEV FLOW</span>
              </div>
              <div className="text-xs font-bold text-navy/40 uppercase tracking-widest bg-navy/5 px-3 py-1 rounded-full">
                Step {step} of 3 • {step === 1 ? "PROFILE" : step === 2 ? "PREFERENCES" : "READY"}
              </div>
            </div>
            <ProgressLine step={step} />
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div 
                key={`step-${step}`} 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                
                {step === 1 && (
                  <div className="space-y-8">
                    <div>
                      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-navy mb-2 tracking-tight">
                        Welcome, {user.fullName.split(' ')[0]}.
                      </h1>
                      <p className="text-navy/60 font-medium text-lg">{welcomeText}</p>
                    </div>

                    {isBuyer && (
                      <div className="space-y-4">
                        <div className="text-sm font-bold text-navy/70 uppercase tracking-widest mb-2">What kind of deals are you here for?</div>
                        <OptionCard 
                          title="Professional Procurement" 
                          description="For company purchases, RFQs, vendor quotations, approvals and structured negotiations." 
                          icon={Briefcase}
                          selected={profile.dealTypes?.includes("Professional")} 
                          onClick={() => setSingleArray("dealTypes", "Professional")} 
                        />
                        <OptionCard 
                          title="Local Buying" 
                          description="Discover trusted nearby sellers, compare prices and arrange pickup or delivery." 
                          icon={MapPin}
                          selected={profile.dealTypes?.includes("Local")} 
                          onClick={() => setSingleArray("dealTypes", "Local")} 
                        />
                        <OptionCard 
                          title="Both" 
                          description="Use DEV FLOW for professional and local deals." 
                          icon={ArrowRightLeft}
                          selected={profile.dealTypes?.includes("Both")} 
                          onClick={() => setSingleArray("dealTypes", "Both")} 
                        />
                      </div>
                    )}

                    {isSeller && (
                      <div className="space-y-5">
                        <div className="text-sm font-bold text-navy/70 uppercase tracking-widest mb-2">Business Identity</div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-navy/70 uppercase tracking-widest ml-1">Business / Shop Name</label>
                          <Input value={profile.businessName || ""} onChange={e => setProfile({...profile, businessName: e.target.value})} placeholder="Acme Supplies Ltd" />
                        </div>
                        <div className="pt-4">
                          <div className="text-xs font-bold text-navy/70 uppercase tracking-widest mb-3">Seller Type</div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <OptionCard title="Local Seller" selected={profile.sellerType === "Local"} onClick={() => setProfile({...profile, sellerType: "Local"})} />
                            <OptionCard title="Professional" selected={profile.sellerType === "Professional"} onClick={() => setProfile({...profile, sellerType: "Professional"})} />
                            <OptionCard title="Both" selected={profile.sellerType === "Both"} onClick={() => setProfile({...profile, sellerType: "Both"})} />
                          </div>
                        </div>
                      </div>
                    )}

                    {(isSalesRep || isManager || isFinance) && (
                      <div className="space-y-5">
                        <div className="text-sm font-bold text-navy/70 uppercase tracking-widest mb-4">Organization Details</div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-navy/70 uppercase tracking-widest ml-1">Organization / Company</label>
                          <Input value={profile.organization || ""} onChange={e => setProfile({...profile, organization: e.target.value})} placeholder="Global Corp" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-navy/70 uppercase tracking-widest ml-1">Department <span className="text-navy/30 lowercase tracking-normal font-normal">(Optional)</span></label>
                          <Input value={profile.department || ""} onChange={e => setProfile({...profile, department: e.target.value})} placeholder="e.g. Enterprise Sales" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-navy/70 uppercase tracking-widest ml-1">Operating Region</label>
                          <Input value={profile.region || ""} onChange={e => setProfile({...profile, region: e.target.value})} placeholder="e.g. North America, APAC" />
                        </div>
                        {isSalesRep && (
                          <div className="space-y-1.5 pt-2">
                            <label className="text-xs font-bold text-navy/70 uppercase tracking-widest ml-1">Employee / Rep ID <span className="text-navy/30 lowercase tracking-normal font-normal">(Optional)</span></label>
                            <Input value={profile.employeeId || ""} onChange={e => setProfile({...profile, employeeId: e.target.value})} placeholder="REP-10293" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-8">
                    <div>
                      <h1 className="text-2xl md:text-3xl font-bold text-navy mb-2 tracking-tight">Let's refine your setup.</h1>
                      <p className="text-navy/60 font-medium text-lg">Just a few more details to customize your experience.</p>
                    </div>

                    {error && <div className="p-4 rounded-xl bg-coral/10 text-coral text-sm font-medium">{error}</div>}

                    {(isBuyer || isSeller || isSalesRep) && (
                      <div className="space-y-6">
                        {(isBuyer || isSeller) && (
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-navy/70 uppercase tracking-widest ml-1">City / Primary Location</label>
                            <Input value={profile.city || ""} onChange={e => setProfile({...profile, city: e.target.value})} placeholder="e.g. Mumbai, New York" />
                          </div>
                        )}
                        {isBuyer && (
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-navy/70 uppercase tracking-widest ml-1">Organization Name <span className="text-navy/30 lowercase tracking-normal font-normal">(Optional)</span></label>
                            <Input value={profile.organization || ""} onChange={e => setProfile({...profile, organization: e.target.value})} placeholder="Company Name" />
                          </div>
                        )}
                        {isSeller && (
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-navy/70 uppercase tracking-widest ml-1">GST Number <span className="text-navy/30 lowercase tracking-normal font-normal">(Optional)</span></label>
                            <Input value={profile.gstNumber || ""} onChange={e => setProfile({...profile, gstNumber: e.target.value})} placeholder="XX-XXXXXXXXX" />
                          </div>
                        )}
                        
                        <div className="pt-2">
                          <label className="text-xs font-bold text-navy/70 uppercase tracking-widest ml-1 block mb-3">
                            {isBuyer ? "Common Buying Categories" : isSeller ? "Business Categories" : "Primary Product Categories"}
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {["Electronics", "IT Equipment", "Office Supplies", "Industrial", "Furniture", "Services", "Other"].map(cat => (
                              <Chip key={cat} label={cat} selected={profile.categories?.includes(cat)} onClick={() => toggleArray("categories", cat)} />
                            ))}
                          </div>
                        </div>

                        {isSeller && (
                          <div className="pt-4">
                            <label className="text-xs font-bold text-navy/70 uppercase tracking-widest ml-1 block mb-3">Delivery Capability</label>
                            <div className="flex flex-wrap gap-2">
                              {["Pickup", "Local Delivery", "Shipping", "All"].map(cap => (
                                <Chip key={cap} label={cap} selected={profile.deliveryCapabilities?.includes(cap)} onClick={() => toggleArray("deliveryCapabilities", cap)} />
                              ))}
                            </div>
                            <div className="mt-8 p-5 bg-navy/5 rounded-2xl flex items-start gap-4">
                              <ShieldCheck className="w-6 h-6 text-navy/40 shrink-0" />
                              <div>
                                <div className="text-xs font-bold text-navy/70 uppercase tracking-widest mb-1">Trust Profile <span className="bg-white px-2 py-0.5 rounded text-navy/40 ml-2">Not rated yet</span></div>
                                <div className="text-xs font-medium text-navy/60 leading-relaxed">Your DEV FLOW Trust Level will grow from verified transactions, buyer feedback, delivery reliability and platform history.</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {(isManager || isFinance) && (
                      <div className="space-y-6">
                        <div className="pt-2">
                          <label className="text-xs font-bold text-navy/70 uppercase tracking-widest ml-1 block mb-3">Primary Responsibilities</label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {(isManager ? [
                              "Discount Approvals", "High-Value Deals", "Commercial Terms", "Deal Risk", "Multiple Responsibilities"
                            ] : [
                              "Billing", "Payment Review", "Warehouse Operations", "Fulfilment", "High-Level Approval"
                            ]).map(resp => (
                              <OptionCard key={resp} title={resp} selected={profile.primaryResponsibilities?.includes(resp)} onClick={() => toggleArray("primaryResponsibilities", resp)} />
                            ))}
                          </div>
                        </div>

                        <div className="mt-6 p-5 border border-orange-500/20 bg-orange-500/5 rounded-2xl flex items-start gap-4">
                          <Activity className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                          <div className="text-xs font-medium text-orange-800 leading-relaxed">
                            <strong>Note on Permissions:</strong> Authority and final system access will be assigned according to your organization’s securely configured policy, independent of these preferences.
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-8 flex flex-col items-center justify-center text-center py-10 md:py-0 h-full">
                    <div className="md:hidden w-20 h-20 rounded-full bg-lime/20 flex items-center justify-center mb-6 shadow-xl shadow-lime/10">
                      <CheckCircle2 className="w-10 h-10 text-lime" />
                    </div>
                    
                    <h1 className="text-3xl font-bold text-navy tracking-tight mb-2">
                      {isBuyer ? "Ready to find your first deal?" : 
                       isSeller ? "Ready to receive opportunities?" : 
                       isSalesRep ? "Ready to build your first quotation?" : 
                       "Your workspace is ready."}
                    </h1>
                    <p className="text-navy/60 font-medium text-lg mb-10 max-w-md mx-auto">
                      Your DEV FLOW profile is fully configured. You can update these preferences anytime in settings.
                    </p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* STICKY BOTTOM BUTTONS */}
          <div className="mt-8 pt-6 border-t border-navy/5 flex items-center gap-4 sticky bottom-0 bg-warm pb-6 md:pb-0 z-20">
            {step > 1 && step < 3 && (
              <PrimaryButton onClick={handleBack} variant="outline" className="px-6 md:px-8 py-3.5 md:py-4">Back</PrimaryButton>
            )}
            {step < 3 ? (
              <PrimaryButton onClick={handleNext} className="flex-1 justify-center py-3.5 md:py-4 text-base shadow-lg" showArrow>Continue</PrimaryButton>
            ) : (
              <PrimaryButton onClick={handleComplete} className="w-full justify-center py-4 text-base shadow-lg shadow-navy/20" showArrow>
                {isBuyer ? "Create Requirement" : isSeller ? "Enter Seller Workspace" : isSalesRep ? "Enter Sales Workspace" : "Enter Workspace"}
              </PrimaryButton>
            )}
          </div>

        </div>
      </div>

      {/* RIGHT PANEL - DESKTOP CONTEXTUAL VISUAL */}
      <div className="hidden md:flex w-[45%] bg-navy p-12 flex-col justify-center relative overflow-hidden">
        {/* Dynamic Background SVG Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-cobalt/10 to-navy z-0" />
        
        <div className="relative z-10 w-full max-w-sm mx-auto">
          <AnimatePresence mode="wait">
            <motion.div key={`visual-${step}`} initial={{ opacity: 0, filter: "blur(10px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} exit={{ opacity: 0, filter: "blur(10px)" }}>
              {rightVisualContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

    </main>
  );
}

// Reusable DEV FLOW signature animation components
function ProgressLine({ step }: { step: number }) {
  return (
    <div className="relative w-full h-1 bg-navy/10 rounded-full my-2">
      <motion.div 
        className="absolute top-0 left-0 h-full bg-cobalt rounded-full shadow-[0_0_10px_rgba(83,103,255,0.5)]"
        initial={{ width: "33%" }}
        animate={{ width: step === 1 ? "33%" : step === 2 ? "66%" : "100%" }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />
      <div className="absolute top-1/2 -translate-y-1/2 left-1/3 w-3 h-3 bg-white border-2 border-cobalt rounded-full -ml-1.5 shadow-md" />
      <div className="absolute top-1/2 -translate-y-1/2 left-2/3 w-3 h-3 bg-white border-2 border-cobalt rounded-full -ml-1.5 shadow-md" />
      <div className="absolute top-1/2 -translate-y-1/2 right-0 w-3 h-3 bg-white border-2 border-cobalt rounded-full shadow-md" />
    </div>
  );
}

function VisualFlow({ steps }: { steps: string[] }) {
  return (
    <div className="space-y-0 relative">
      {/* Vertical Animated Line */}
      <div className="absolute left-[27px] top-8 bottom-8 w-[2px] bg-white/10 rounded-full" />
      <motion.div 
        className="absolute left-[27px] top-8 w-[2px] bg-cobalt rounded-full shadow-[0_0_15px_rgba(83,103,255,1)]"
        initial={{ height: 0 }}
        animate={{ height: "100%" }}
        transition={{ duration: 2, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
      />
      
      {steps.map((label, i) => (
        <div key={label} className="flex items-center gap-6 py-6 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 backdrop-blur-md shadow-xl">
            <div className="w-3 h-3 rounded-full bg-white/20" />
          </div>
          <div className="text-lg font-bold text-white/90">{label}</div>
        </div>
      ))}
    </div>
  );
}

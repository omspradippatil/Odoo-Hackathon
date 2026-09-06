"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";
import { WorkspaceLayout } from "@/components/layout/WorkspaceLayout";
import { UserRole } from "@/types/auth";
import { VendorMatch, VendorCombination, TrustTier } from "@/types/vendor";
import { ArrowRight, Search, ShieldCheck, MapPin, Activity, Check, Filter, X, ChevronRight, BarChart2 } from "lucide-react";
import * as motion from "framer-motion/client";
import { AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { assignAliases } from "@/lib/anonymity";

// --- MOCK DATA ---
const MOCK_VENDORS: VendorMatch[] = [
  {
    vendorId: "v1", displayName: "Vertex Systems", trustTier: "GOLD", trustScore: 92, rating: 4.8, price: 470000, unitPrice: 9400,
    availableQuantity: 50, deliveryDays: 2, experienceYears: 6, qualityScore: 91, transactionCount: 1450, location: "Mumbai",
    isRecommended: true
  },
  {
    vendorId: "v2", displayName: "QuickByte Traders", trustTier: "BRONZE", trustScore: 61, rating: 3.6, price: 440000, unitPrice: 8800,
    availableQuantity: 50, deliveryDays: 5, experienceYears: 1, qualityScore: 68, transactionCount: 45, location: "Pune",
    isCheapest: true
  },
  {
    vendorId: "v3", displayName: "NexaByte Solutions", trustTier: "SILVER", trustScore: 81, rating: 4.4, price: 455000, unitPrice: 9100,
    availableQuantity: 40, deliveryDays: 3, experienceYears: 4, qualityScore: 82, transactionCount: 320, location: "Mumbai"
  },
  {
    vendorId: "v4", displayName: "TechCore Supplies", trustTier: "GOLD", trustScore: 88, rating: 4.7, price: 485000, unitPrice: 9700,
    availableQuantity: 50, deliveryDays: 1, experienceYears: 8, qualityScore: 95, transactionCount: 2100, location: "Mumbai"
  }
];

const MOCK_SPLIT: VendorCombination = {
  id: "split-1",
  vendors: [
    { vendor: MOCK_VENDORS[0], allocatedQuantity: 30 },
    { vendor: MOCK_VENDORS[2], allocatedQuantity: 20 }
  ],
  totalQuantity: 50,
  totalPrice: 464000,
  deliveryWindowDays: 3,
  combinedTrustSignal: "GOLD / SILVER Blend",
  recommendationReason: "Combines high trust with complete availability within the required delivery window."
};

const formatCurrency = (val: number) => `₹${val.toLocaleString('en-IN')}`;

// --- SUBCOMPONENTS ---

const TrustBadge = ({ tier, score, label }: { tier: TrustTier, score: number, label?: string }) => {
  const isGold = tier === 'GOLD';
  const isSilver = tier === 'SILVER';
  const isBronze = tier === 'BRONZE';
  
  return (
    <div className={cn(
      "inline-flex flex-col gap-0.5 p-2 rounded-xl border border-b-2",
      isGold ? "bg-amber-50 border-amber-200 border-b-amber-300" : 
      isSilver ? "bg-slate-50 border-slate-200 border-b-slate-300" : 
      "bg-orange-50 border-orange-200 border-b-orange-300"
    )}>
      <div className="flex items-center gap-1.5">
        <ShieldCheck className={cn("w-4 h-4", isGold ? "text-amber-500" : isSilver ? "text-slate-500" : "text-orange-500")} />
        <span className={cn("text-[10px] font-bold uppercase tracking-widest", isGold ? "text-amber-700" : isSilver ? "text-slate-700" : "text-orange-700")}>{tier}</span>
        <span className={cn("text-xs font-bold ml-1", isGold ? "text-amber-900" : isSilver ? "text-slate-900" : "text-orange-900")}>{score}/100</span>
      </div>
      {label && <div className="text-[9px] font-bold text-navy/40 uppercase tracking-widest px-1">{label}</div>}
    </div>
  );
};

const VendorCard = ({ vendor, onSelect, onCompare, isComparing, isSelectedForCompare }: any) => (
  <div className={cn("bg-white p-5 md:p-6 rounded-2xl border transition-all duration-300", 
    isSelectedForCompare ? "border-cobalt shadow-md bg-cobalt/5" : "border-navy/5 shadow-sm hover:shadow-md"
  )}>
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="text-lg font-bold text-navy mb-2 flex items-center gap-2">
          {vendor.displayName}
          {vendor.isRecommended && <span className="bg-lime/20 text-lime-800 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest">Recommended</span>}
          {vendor.isCheapest && <span className="bg-coral/10 text-coral px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest">Cheapest</span>}
        </h3>
        <TrustBadge tier={vendor.trustTier} score={vendor.trustScore} label={vendor.experienceYears > 3 ? "Established Seller" : "Limited History"} />
      </div>
      <div className="text-right">
        <div className="text-xl font-bold text-navy">{formatCurrency(vendor.price)}</div>
        <div className="text-xs font-bold text-navy/40 uppercase tracking-widest mt-1">₹{vendor.unitPrice.toLocaleString('en-IN')} / unit</div>
      </div>
    </div>
    
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 p-4 bg-navy/5 rounded-xl text-sm font-medium">
      <div><span className="block text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-1">Availability</span><span className={cn("font-bold", vendor.availableQuantity === 50 ? "text-lime-700" : "text-orange-600")}>{vendor.availableQuantity} / 50</span></div>
      <div><span className="block text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-1">Delivery</span><span className="text-navy">{vendor.deliveryDays} Days</span></div>
      <div><span className="block text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-1">Rating</span><span className="text-navy">{vendor.rating} ★</span></div>
      <div><span className="block text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-1">Location</span><span className="text-navy">{vendor.location}</span></div>
    </div>

    <div className="flex items-center justify-between pt-4 border-t border-navy/5">
      <button className="text-xs font-bold text-cobalt hover:text-navy transition-colors uppercase tracking-widest">View Vendor</button>
      <div className="flex items-center gap-3">
        {isComparing ? (
          <button 
            onClick={() => onCompare(vendor)}
            className={cn("px-4 py-2 rounded-xl text-xs font-bold transition-colors", isSelectedForCompare ? "bg-cobalt text-white shadow-md shadow-cobalt/20" : "bg-navy/5 text-navy hover:bg-navy/10")}
          >
            {isSelectedForCompare ? "Added to Compare" : "Compare"}
          </button>
        ) : (
          <button onClick={() => onSelect(vendor)} className="px-6 py-2.5 rounded-xl text-sm font-bold bg-navy text-white hover:bg-navy/90 transition-colors shadow-lg shadow-navy/20">Select</button>
        )}
      </div>
    </div>
  </div>
);

// --- MAIN PAGE ---

export default function VendorDiscoveryPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  
  const [analyzing, setAnalyzing] = useState(true);
  const [analyzingStep, setAnalyzingStep] = useState(0);
  const [showWhyModal, setShowWhyModal] = useState(false);
  
  const [isComparing, setIsComparing] = useState(false);
  const [compareList, setCompareList] = useState<VendorMatch[]>([]);
  
  const [showSplit, setShowSplit] = useState(true);
  
  const [isAnonymous, setIsAnonymous] = useState(false);

  const router = useRouter();

  useEffect(() => {
    import("@/lib/demoState").then(m => setIsAnonymous(m.demoState.getAnonymousBidding()));
  }, []);

  // Compute display vendors based on anonymous flag
  const vendorAliases = assignAliases(resolvedParams.id, MOCK_VENDORS.map((v) => v.vendorId));
  const displayVendors = MOCK_VENDORS.map((v) => {
    if (isAnonymous) {
      return {
        ...v,
        displayName: `Vendor "${vendorAliases[v.vendorId]}"`,
      };
    }
    return v;
  });

  const displaySplit = isAnonymous ? {
    ...MOCK_SPLIT,
    vendors: MOCK_SPLIT.vendors.map((sv, i) => {
      const match = displayVendors.find(dv => dv.vendorId === sv.vendor.vendorId);
      return {
        ...sv,
        vendor: match || sv.vendor
      };
    })
  } : MOCK_SPLIT;

  // Fake analysis sequence
  useEffect(() => {
    const steps = ["Price", "Trust", "Experience", "Delivery", "Availability", "Quality"];
    let i = 0;
    const interval = setInterval(() => {
      i++;
      if (i < steps.length) {
        setAnalyzingStep(i);
      } else {
        clearInterval(interval);
        setTimeout(() => setAnalyzing(false), 500);
      }
    }, 400);
    return () => clearInterval(interval);
  }, []);

  const handleCompareToggle = (vendor: VendorMatch) => {
    setCompareList(prev => {
      if (prev.find(v => v.vendorId === vendor.vendorId)) return prev.filter(v => v.vendorId !== vendor.vendorId);
      if (prev.length >= 4) return prev;
      return [...prev, vendor];
    });
  };

  const handleSelect = (data: any) => {
    // Show a native confirm for the demo, then route
    const ok = window.confirm(`Select ${data.displayName || 'this combination'} for Quotation? You can negotiate terms later.`);
    if (ok) router.push(`/buyer/requirements/${resolvedParams.id}/quotation`);
  };

  return (
    <WorkspaceLayout role={UserRole.BUYER}>
      
      {/* JOURNEY HEADER */}
      <div className="mb-8 md:mb-12">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-2">
              <span className="text-navy">{resolvedParams.id}</span>
            </div>
            <h1 className="text-3xl font-bold text-navy tracking-tight mb-2">Vendor Matches</h1>
          </div>
          
          <div className="bg-white p-4 rounded-2xl border border-navy/5 shadow-sm text-sm font-medium text-navy/70 flex flex-wrap gap-x-6 gap-y-2">
            <div><span className="text-navy/40">Req:</span> 50 Business Laptops</div>
            <div><span className="text-navy/40">Budget:</span> ₹5,00,000</div>
            <div><span className="text-navy/40">Priority:</span> Best Overall Value</div>
          </div>
        </div>

        {/* SIGNATURE MOTION LINE */}
        <div className="w-full bg-white p-4 rounded-2xl border border-navy/5 shadow-sm overflow-x-auto no-scrollbar">
          <div className="flex items-center min-w-[600px] justify-between relative px-4">
            <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-[2px] bg-navy/5 -z-10" />
            {[
              { id: 'REQUEST', label: 'REQUEST', done: true },
              { id: 'DISCOVER', label: 'DISCOVER', active: !isComparing },
              { id: 'COMPARE', label: 'COMPARE', active: isComparing },
              { id: 'APPROVE', label: 'APPROVE' },
              { id: 'NEGOTIATE', label: 'NEGOTIATE' },
              { id: 'PROTECT', label: 'PROTECT' },
              { id: 'FULFIL', label: 'FULFIL' },
            ].map((stage, i) => (
              <div key={stage.id} className="flex flex-col items-center gap-2 bg-white px-2">
                <div className={cn("w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all", 
                  stage.done ? "border-lime bg-lime" :
                  stage.active ? "border-cobalt bg-white shadow-[0_0_10px_rgba(83,103,255,0.4)]" : "border-navy/10 bg-white")}>
                  {stage.done && <Check className="w-2.5 h-2.5 text-lime-950" />}
                  {stage.active && <motion.div layoutId="flow-dot" className="w-1.5 h-1.5 bg-cobalt rounded-full" />}
                </div>
                <span className={cn("text-[9px] font-bold uppercase tracking-widest", stage.active ? "text-cobalt" : stage.done ? "text-lime-700" : "text-navy/30")}>{stage.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start relative">
        
        {/* LEFT COLUMN - RESULTS */}
        <div className="w-full lg:w-[65%] space-y-8 pb-24 lg:pb-0">
          
          {/* DISCOVERY STATUS */}
          <div className="bg-navy rounded-3xl p-6 md:p-8 text-white shadow-2xl shadow-navy/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cobalt/20 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10">
              <div className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-4">AAKALAN360 FOUND</div>
              
              <div className="flex flex-wrap gap-6 mb-6">
                <div><span className="text-3xl font-bold text-white">24</span> <span className="text-sm font-medium text-white/60">matching vendors</span></div>
                <div><span className="text-3xl font-bold text-lime">8</span> <span className="text-sm font-medium text-white/60">can fully fulfil</span></div>
              </div>

              <AnimatePresence mode="wait">
                {analyzing ? (
                  <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-3 text-sm font-bold text-cobalt bg-white/10 p-4 rounded-xl inline-flex backdrop-blur-sm border border-white/5">
                    <Activity className="w-4 h-4 animate-spin-slow" />
                    ANALYSING... {["Price", "Trust", "Experience", "Delivery", "Availability", "Quality"][analyzingStep]}
                  </motion.div>
                ) : (
                  <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 text-sm font-bold text-lime bg-lime/10 p-4 rounded-xl inline-flex backdrop-blur-sm border border-lime/20">
                    <Check className="w-4 h-4" /> ANALYSIS COMPLETE
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {!analyzing && !isComparing && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              
              {/* RECOMMENDED VS CHEAPEST SHOWDOWN */}
              <div className="bg-white rounded-3xl border border-navy/10 shadow-xl shadow-navy/5 overflow-hidden">
                <div className="bg-navy/5 p-4 border-b border-navy/5 flex items-center justify-between">
                  <h2 className="text-xs font-bold text-navy uppercase tracking-widest">Match Overview</h2>
                  <button onClick={() => setShowWhyModal(true)} className="text-xs font-bold text-cobalt hover:text-navy uppercase tracking-widest flex items-center gap-1 transition-colors">
                    Why Aakalan360 prefers {displayVendors[0].displayName.split(' ')[0]} <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
                
                <div className="flex flex-col md:flex-row relative">
                  {/* CHEAPEST */}
                  <div className="flex-1 p-6 md:p-8 flex flex-col items-center text-center opacity-70 hover:opacity-100 transition-opacity">
                    <div className="text-[10px] font-bold text-coral uppercase tracking-widest bg-coral/10 px-3 py-1 rounded-full mb-6">Cheapest Quote</div>
                    <div className="text-xl font-bold text-navy mb-2">{displayVendors[1].displayName}</div>
                    <div className="text-3xl font-bold text-navy mb-4">₹4,40,000</div>
                    <TrustBadge tier="BRONZE" score={61} label="Limited Platform History" />
                    <div className="space-y-2 mt-6 text-sm font-medium text-navy/60 w-full bg-warm/50 p-4 rounded-xl">
                      <div className="flex justify-between"><span>Delivery</span> <span className="font-bold text-navy">5 Days</span></div>
                      <div className="flex justify-between"><span>Rating</span> <span className="font-bold text-navy">3.6 ★</span></div>
                    </div>
                  </div>

                  {/* VS BADGE */}
                  <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-navy/10 shadow-md items-center justify-center text-[10px] font-bold text-navy/40 uppercase z-10">VS</div>
                  <div className="md:hidden w-full h-[1px] bg-navy/5 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-[10px] font-bold text-navy/40 uppercase">VS</div>
                  </div>

                  {/* RECOMMENDED */}
                  <div className="flex-1 p-6 md:p-8 flex flex-col items-center text-center bg-lime/5 border-l border-navy/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-lime/20 rounded-full blur-2xl pointer-events-none" />
                    <div className="text-[10px] font-bold text-lime-800 uppercase tracking-widest bg-lime/20 px-3 py-1 rounded-full mb-6 z-10">Best Overall Value</div>
                    <div className="text-xl font-bold text-navy mb-2 z-10">{displayVendors[0].displayName}</div>
                    <div className="text-3xl font-bold text-navy mb-4 z-10">₹4,70,000</div>
                    <div className="z-10"><TrustBadge tier="GOLD" score={92} label="Highly Reliable History" /></div>
                    <div className="space-y-2 mt-6 text-sm font-medium text-navy/60 w-full bg-white/60 p-4 rounded-xl z-10 border border-lime/10">
                      <div className="flex justify-between"><span>Delivery</span> <span className="font-bold text-navy">2 Days</span></div>
                      <div className="flex justify-between"><span>Rating</span> <span className="font-bold text-navy">4.8 ★</span></div>
                    </div>
                    <div className="mt-6 text-xs font-bold text-navy/70 z-10 bg-white px-4 py-2 rounded-lg border border-navy/5 shadow-sm inline-flex items-center gap-2">
                      <span className="text-coral">+ ₹30,000</span> but <span className="text-lime-700">+31 Trust</span> & <span className="text-lime-700">3 days faster</span>
                    </div>
                    <button onClick={() => handleSelect(displayVendors[0])} className="w-full mt-6 py-3.5 bg-navy text-white font-bold rounded-xl shadow-lg shadow-navy/20 z-10 hover:bg-navy/90 transition-colors">Select Recommended</button>
                  </div>
                </div>
              </div>

              {/* FILTER BAR */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative w-full sm:flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-navy/40" />
                  <input type="text" placeholder="Search vendor or location..." className="w-full h-12 pl-10 pr-4 rounded-xl bg-white border border-navy/10 focus:outline-none focus:border-cobalt font-medium text-sm shadow-sm" />
                </div>
                <div className="flex gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar pb-2 sm:pb-0">
                  <button className="h-12 px-4 bg-white border border-navy/10 rounded-xl text-sm font-bold text-navy flex items-center gap-2 shadow-sm whitespace-nowrap"><Filter className="w-4 h-4" /> Filters</button>
                  <button 
                    onClick={() => setIsComparing(true)}
                    className={cn("h-12 px-6 border border-cobalt rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm whitespace-nowrap transition-colors", compareList.length > 0 ? "bg-cobalt text-white shadow-cobalt/20" : "bg-cobalt/5 text-cobalt hover:bg-cobalt/10")}
                  >
                    <BarChart2 className="w-4 h-4" /> Enter Compare Mode {compareList.length > 0 && `(${compareList.length})`}
                  </button>
                </div>
              </div>

              {/* SMART SPLIT OPTION */}
              {showSplit && (
                <div className="bg-gradient-to-r from-cobalt/5 to-white border border-cobalt/20 rounded-3xl p-6 shadow-sm relative overflow-hidden">
                  <div className="flex items-center justify-between mb-6 relative z-10">
                    <div>
                      <h3 className="text-sm font-bold text-cobalt flex items-center gap-2 uppercase tracking-widest mb-1"><Activity className="w-4 h-4" /> Smart Split Option</h3>
                      <p className="text-xs font-medium text-navy/60">No single high-trust vendor has optimal stock at the required delivery date.</p>
                    </div>
                    <button onClick={() => setShowSplit(false)} className="text-navy/40 hover:text-navy"><X className="w-4 h-4" /></button>
                  </div>
                  
                  <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                    
                    {/* Visualizer */}
                    <div className="flex-1 flex items-center justify-center relative w-full h-32">
                      {/* Left node */}
                      <div className="absolute left-0 flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-white border-2 border-navy flex items-center justify-center font-bold text-navy z-10 shadow-md">50</div>
                        <div className="text-[9px] font-bold text-navy/40 uppercase tracking-widest mt-2 text-center w-16">Required</div>
                      </div>
                      
                      {/* SVG Paths */}
                      <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
                        <path d="M 40,64 C 100,64 120,24 180,24" fill="none" stroke="#5367FF" strokeWidth="2" strokeDasharray="4 4" className="animate-[dash_1s_linear_infinite]" style={{ strokeDashoffset: -20 }}/>
                        <path d="M 40,64 C 100,64 120,104 180,104" fill="none" stroke="#5367FF" strokeWidth="2" strokeDasharray="4 4" className="animate-[dash_1s_linear_infinite]" style={{ strokeDashoffset: -20 }}/>
                        
                        <path d="M 280,24 C 340,24 360,64 420,64" fill="none" stroke="#5367FF" strokeWidth="2" strokeDasharray="4 4" className="animate-[dash_1s_linear_infinite]" style={{ strokeDashoffset: -20 }}/>
                        <path d="M 280,104 C 340,104 360,64 420,64" fill="none" stroke="#5367FF" strokeWidth="2" strokeDasharray="4 4" className="animate-[dash_1s_linear_infinite]" style={{ strokeDashoffset: -20 }}/>
                        <style>{`@keyframes dash { to { stroke-dashoffset: 0; } }`}</style>
                      </svg>
                      
                      {/* Middle Nodes */}
                      <div className="absolute left-1/2 -translate-x-1/2 top-0 flex flex-col items-center z-10">
                        <div className="bg-white px-3 py-1.5 rounded-lg border border-navy/10 shadow-sm text-xs font-bold text-navy flex items-center gap-2">
                          {displayVendors[0].displayName.split(' ')[0]} <span className="text-cobalt">30</span>
                        </div>
                      </div>
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-0 flex flex-col items-center z-10">
                        <div className="bg-white px-3 py-1.5 rounded-lg border border-navy/10 shadow-sm text-xs font-bold text-navy flex items-center gap-2">
                          {displayVendors[2].displayName.split(' ')[0]} <span className="text-cobalt">20</span>
                        </div>
                      </div>

                      {/* Right node */}
                      <div className="absolute right-0 flex flex-col items-center z-10">
                        <div className="w-12 h-12 rounded-full bg-lime text-lime-950 flex items-center justify-center font-bold shadow-md shadow-lime/20"><Check className="w-6 h-6" /></div>
                        <div className="text-[9px] font-bold text-navy/40 uppercase tracking-widest mt-2 text-center w-16">Fulfilled</div>
                      </div>
                    </div>

                    <div className="w-full md:w-48 shrink-0 flex flex-col gap-3">
                      <div className="text-center p-3 bg-white rounded-xl shadow-sm border border-navy/5">
                        <div className="text-[9px] font-bold text-navy/40 uppercase tracking-widest mb-1">Blended Value</div>
                        <div className="text-lg font-bold text-navy">₹4,64,000</div>
                      </div>
                      <button onClick={() => handleSelect(displaySplit)} className="w-full py-2.5 bg-cobalt text-white text-xs font-bold rounded-xl shadow-md shadow-cobalt/20 hover:bg-cobalt/90 transition-colors">Use Split Fulfilment</button>
                    </div>
                  </div>
                </div>
              )}

              {/* VENDOR LIST */}
              <div className="space-y-4">
                {displayVendors.map(v => (
                  <VendorCard key={v.vendorId} vendor={v} onSelect={handleSelect} isComparing={false} />
                ))}
              </div>

            </motion.div>
          )}

          {!analyzing && isComparing && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-navy">Compare Vendors</h2>
                <button onClick={() => setIsComparing(false)} className="text-sm font-bold text-navy/60 hover:text-navy px-4 py-2 bg-white rounded-lg shadow-sm border border-navy/10">Exit Compare Mode</button>
              </div>

              {compareList.length === 0 ? (
                <div className="bg-white p-8 rounded-3xl border border-navy/10 shadow-sm text-center">
                  <BarChart2 className="w-12 h-12 text-navy/20 mx-auto mb-4" />
                  <p className="text-navy font-bold mb-6">Select vendors from the list below to compare.</p>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {displayVendors.map(v => (
                      <VendorCard key={v.vendorId} vendor={v} isComparing={true} isSelectedForCompare={compareList.find(c => c.vendorId === v.vendorId)} onCompare={handleCompareToggle} />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* COMPARISON MATRIX (Scrollable horizontally on mobile) */}
                  <div className="overflow-x-auto pb-4">
                    <div className="min-w-[600px] flex gap-4">
                      {/* Labels Column */}
                      <div className="w-32 shrink-0 space-y-6 pt-[88px] text-xs font-bold text-navy/40 uppercase tracking-widest text-right pr-4">
                        <div className="h-10 flex items-center justify-end">Price</div>
                        <div className="h-10 flex items-center justify-end">Trust</div>
                        <div className="h-10 flex items-center justify-end">Delivery</div>
                        <div className="h-10 flex items-center justify-end">Availability</div>
                        <div className="h-10 flex items-center justify-end">Rating</div>
                      </div>

                      {compareList.map(v => (
                        <div key={v.vendorId} className="flex-1 min-w-[200px] bg-white rounded-2xl border border-navy/10 shadow-sm p-4 relative overflow-hidden flex flex-col">
                          {v.isRecommended && <div className="absolute top-0 left-0 right-0 h-1 bg-lime" />}
                          <div className="h-[72px] mb-4 text-center">
                            <h3 className="font-bold text-navy line-clamp-1">{v.displayName}</h3>
                            <div className="text-[10px] text-navy/60 uppercase tracking-widest mt-1 mb-2">{v.trustTier}</div>
                            {v.isRecommended && <span className="bg-lime/20 text-lime-800 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest">Recommended</span>}
                          </div>
                          
                          <div className="space-y-6 flex-1">
                            <div className="h-10 flex flex-col justify-center items-center">
                              <span className={cn("text-lg font-bold", v.isCheapest ? "text-lime-700" : "text-navy")}>{formatCurrency(v.price)}</span>
                              {v.isCheapest && <span className="text-[9px] text-lime-700 font-bold uppercase tracking-widest">Best Price</span>}
                            </div>
                            <div className="h-10 flex flex-col justify-center items-center">
                              <span className="text-sm font-bold text-navy">{v.trustScore}/100</span>
                              {v.trustScore > 90 && <span className="text-[9px] text-lime-700 font-bold uppercase tracking-widest">Highest Trust</span>}
                            </div>
                            <div className="h-10 flex flex-col justify-center items-center">
                              <span className="text-sm font-bold text-navy">{v.deliveryDays} Days</span>
                            </div>
                            <div className="h-10 flex flex-col justify-center items-center">
                              <span className={cn("text-sm font-bold", v.availableQuantity === 50 ? "text-lime-700" : "text-orange-600")}>{v.availableQuantity} / 50</span>
                              {v.availableQuantity === 50 && <span className="text-[9px] text-lime-700 font-bold uppercase tracking-widest">Full</span>}
                            </div>
                            <div className="h-10 flex flex-col justify-center items-center">
                              <span className="text-sm font-bold text-navy">{v.rating} ★</span>
                            </div>
                          </div>

                          <button onClick={() => handleSelect(v)} className="w-full mt-6 py-2.5 rounded-xl bg-navy/5 hover:bg-navy text-navy hover:text-white text-xs font-bold transition-colors">Select</button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-navy/5 p-6 rounded-2xl">
                    <h3 className="text-sm font-bold text-navy mb-4">Add more vendors to compare</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {displayVendors.filter(v => !compareList.find(c => c.vendorId === v.vendorId)).map(v => (
                        <VendorCard key={v.vendorId} vendor={v} isComparing={true} isSelectedForCompare={false} onCompare={handleCompareToggle} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

        </div>

        {/* RIGHT COLUMN - INTELLIGENCE */}
        <div className="hidden lg:block w-[35%]">
          <div className="sticky top-28 space-y-6">
            
            <div className="bg-white rounded-3xl p-6 border border-navy/10 shadow-xl shadow-navy/5 relative overflow-hidden">
              <div className="flex items-center gap-2 mb-6">
                <Activity className="w-5 h-5 text-cobalt" />
                <span className="text-xs font-bold uppercase tracking-widest text-navy/50">Deal Intelligence</span>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-navy/60 font-medium">Budget Health</span>
                  <span className="font-bold text-lime-700">Healthy</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-navy/60 font-medium">Vendor Coverage</span>
                  <span className="font-bold text-navy">Strong (24 matches)</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-navy/60 font-medium">Full-Fulfilment</span>
                  <span className="font-bold text-navy">8 Vendors</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-navy/60 font-medium">Delivery Risk</span>
                  <span className="font-bold text-lime-700">Low</span>
                </div>
              </div>

              <div className="bg-navy/5 p-4 rounded-xl border border-navy/10 text-sm font-medium text-navy/80 leading-relaxed">
                The lowest-price vendor meets quantity but has weaker delivery reliability and lower trust scores than the recommended option.
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-navy/10 shadow-sm text-center">
              <ShieldCheck className="w-8 h-8 text-navy/20 mx-auto mb-3" />
              <div className="text-sm font-bold text-navy mb-2">Aakalan360 Verified Network</div>
              <p className="text-xs font-medium text-navy/60">
                All displayed vendors are platform-verified. Trust scores update dynamically based on recent transaction performance.
              </p>
            </div>

          </div>
        </div>

      </div>

      {/* WHY VENDOR MODAL / DRAWER */}
      <AnimatePresence>
        {showWhyModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-navy/60 backdrop-blur-sm z-50" onClick={() => setShowWhyModal(false)} />
            <motion.div initial={{ opacity: 0, x: 400 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 400 }} className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col p-6 md:p-10 border-l border-navy/10">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-lg font-bold text-navy uppercase tracking-widest">Why This Vendor?</h2>
                <button onClick={() => setShowWhyModal(false)} className="w-10 h-10 rounded-full bg-navy/5 flex items-center justify-center text-navy/60 hover:bg-navy/10 hover:text-navy transition-colors"><X className="w-5 h-5" /></button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-8 no-scrollbar pb-10">
                <div>
                  <h3 className="text-2xl font-bold text-navy mb-4 leading-tight">{displayVendors[0].displayName} is not the cheapest option.</h3>
                  <p className="text-navy/70 font-medium text-lg">Aakalan360 recommends it because:</p>
                </div>

                <div className="space-y-4">
                  {[
                    "Strong transaction history across 1400+ deals",
                    "High buyer ratings (4.8 ★)",
                    "Full quantity available immediately",
                    "2-day delivery guarantee",
                    "Consistent fulfilment performance",
                    "Good past quality feedback"
                  ].map((point, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="mt-0.5"><Check className="w-5 h-5 text-lime-600" /></div>
                      <div className="font-bold text-navy">{point}</div>
                    </div>
                  ))}
                </div>

                <div className="bg-coral/5 border border-coral/20 rounded-2xl p-6">
                  <div className="text-[10px] font-bold text-coral uppercase tracking-widest mb-2">Trade-Off</div>
                  <div className="font-medium text-navy text-sm">You pay approximately <strong>₹30,000 more</strong> than the cheapest quote.</div>
                </div>

                <div className="bg-lime/10 border border-lime/20 rounded-2xl p-6">
                  <div className="text-[10px] font-bold text-lime-800 uppercase tracking-widest mb-2">Benefit</div>
                  <div className="font-medium text-navy text-sm">Lower fulfilment and delivery risk, ensuring your project timelines are met.</div>
                </div>
              </div>

              <div className="pt-6 border-t border-navy/10">
                <button onClick={() => { setShowWhyModal(false); handleSelect(displayVendors[0]); }} className="w-full py-4 rounded-xl bg-navy text-white font-bold shadow-lg hover:bg-navy/90 transition-colors">Select {displayVendors[0].displayName}</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </WorkspaceLayout>
  );
}

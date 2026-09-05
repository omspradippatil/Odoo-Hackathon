"use client";

import React, { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { 
  ShieldCheck, Award, Save, CheckCircle2, Sliders, AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminTrustPolicyPage() {
  const [saved, setSaved] = useState(false);
  const [weights, setWeights] = useState({
    onTimeDelivery: 40,
    lowDefectRate: 30,
    disputeFreeResolution: 20,
    profileVerification: 10
  });
  const [thresholds, setThresholds] = useState({
    goldMin: 90,
    silverMin: 75
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const totalWeight = weights.onTimeDelivery + weights.lowDefectRate + weights.disputeFreeResolution + weights.profileVerification;

  return (
    <AdminLayout>
      <div className="p-6 md:p-10 space-y-8 max-w-5xl mx-auto pb-20">
        
        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold text-navy tracking-tight uppercase">Vendor Trust Engine Policy</h1>
          <p className="text-sm font-medium text-navy/60">Calibrate the automated scoring weights and badge qualification criteria for suppliers.</p>
        </div>

        {saved && (
          <div className="p-4 bg-lime/20 border border-lime/30 rounded-2xl flex items-center gap-3 text-lime-950 font-semibold text-sm">
            <CheckCircle2 className="w-5 h-5 text-lime-700 shrink-0" />
            Trust scoring algorithms updated. All vendor ratings will re-compute overnight.
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          
          {/* SCORING WEIGHTS */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-navy/5 shadow-sm space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-navy flex items-center gap-2">
                <Sliders className="w-5 h-5 text-cobalt" /> Metric Weight Allocation
              </h3>
              <span className={cn(
                "text-xs font-bold px-3 py-1 rounded-full",
                totalWeight === 100 ? "bg-lime/20 text-lime-900" : "bg-red-100 text-red-800"
              )}>
                Total: {totalWeight}% (Target: 100%)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-4 bg-navy/5 rounded-2xl space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-navy uppercase">On-Time Delivery Rate</label>
                  <span className="font-bold text-navy">{weights.onTimeDelivery}%</span>
                </div>
                <input 
                  type="range" min="10" max="60" value={weights.onTimeDelivery} 
                  onChange={(e) => setWeights({...weights, onTimeDelivery: parseInt(e.target.value)})}
                  className="w-full accent-navy"
                />
              </div>

              <div className="p-4 bg-navy/5 rounded-2xl space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-navy uppercase">Zero-Defect Quality History</label>
                  <span className="font-bold text-navy">{weights.lowDefectRate}%</span>
                </div>
                <input 
                  type="range" min="10" max="60" value={weights.lowDefectRate} 
                  onChange={(e) => setWeights({...weights, lowDefectRate: parseInt(e.target.value)})}
                  className="w-full accent-navy"
                />
              </div>

              <div className="p-4 bg-navy/5 rounded-2xl space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-navy uppercase">Dispute-Free Escrow Release</label>
                  <span className="font-bold text-navy">{weights.disputeFreeResolution}%</span>
                </div>
                <input 
                  type="range" min="5" max="40" value={weights.disputeFreeResolution} 
                  onChange={(e) => setWeights({...weights, disputeFreeResolution: parseInt(e.target.value)})}
                  className="w-full accent-navy"
                />
              </div>

              <div className="p-4 bg-navy/5 rounded-2xl space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-navy uppercase">Verified Warehouse & GST Docs</label>
                  <span className="font-bold text-navy">{weights.profileVerification}%</span>
                </div>
                <input 
                  type="range" min="5" max="30" value={weights.profileVerification} 
                  onChange={(e) => setWeights({...weights, profileVerification: parseInt(e.target.value)})}
                  className="w-full accent-navy"
                />
              </div>
            </div>
          </div>

          {/* TIER QUALIFICATION THRESHOLDS */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-navy/5 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-navy flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" /> Tier Score Thresholds
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-amber-400/10 border border-amber-400/20 rounded-2xl">
                <div className="font-bold text-amber-900 text-sm mb-1">Gold Tier Supplier</div>
                <div className="text-xs text-navy/60 mb-3">Score ≥ {thresholds.goldMin} Points</div>
                <div className="text-[11px] text-navy/70">Receives priority RFQ routing and lowest escrow retention holds (25%).</div>
              </div>

              <div className="p-4 bg-slate-100 border border-slate-200 rounded-2xl">
                <div className="font-bold text-slate-800 text-sm mb-1">Silver Tier Supplier</div>
                <div className="text-xs text-navy/60 mb-3">Score ≥ {thresholds.silverMin} Points</div>
                <div className="text-[11px] text-navy/70">Standard marketplace access with standard 50% milestone escrow.</div>
              </div>

              <div className="p-4 bg-orange-50 border border-orange-200 rounded-2xl">
                <div className="font-bold text-orange-900 text-sm mb-1">Bronze Tier Supplier</div>
                <div className="text-xs text-navy/60 mb-3">Score &lt; {thresholds.silverMin} Points</div>
                <div className="text-[11px] text-navy/70">Requires 100% escrow lock until proof-of-delivery signed.</div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button 
              type="submit"
              className="px-6 py-3 rounded-xl font-bold text-white bg-navy shadow-lg shadow-navy/20 hover:bg-navy/90 transition-all text-sm flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Save Trust Policy
            </button>
          </div>

        </form>

      </div>
    </AdminLayout>
  );
}
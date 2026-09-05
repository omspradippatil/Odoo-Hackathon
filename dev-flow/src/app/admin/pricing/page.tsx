"use client";

import React, { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { 
  DollarSign, Percent, ShieldCheck, CheckCircle2, Save, 
  AlertTriangle, Settings2, Sliders
} from "lucide-react";

export default function AdminPricingPage() {
  const [saved, setSaved] = useState(false);
  const [policy, setPolicy] = useState({
    minMarginFloor: 15,
    autoApproveMaxDiscount: 10,
    managerSignoffMaxDiscount: 20,
    highValueThreshold: 2500000,
    freightSurchargePercent: 3.5,
    escrowProtectionFeeBps: 75
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <AdminLayout>
      <div className="p-6 md:p-10 space-y-8 max-w-5xl mx-auto pb-20">
        
        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold text-navy tracking-tight uppercase">Commercial Pricing Rules</h1>
          <p className="text-sm font-medium text-navy/60">Configure automated margin floors, discount approval tiers, and platform escrow tariffs.</p>
        </div>

        {saved && (
          <div className="p-4 bg-lime/20 border border-lime/30 rounded-2xl flex items-center gap-3 text-lime-950 font-semibold text-sm">
            <CheckCircle2 className="w-5 h-5 text-lime-700 shrink-0" />
            Pricing governance and discount limits published to production.
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          
          {/* DISCOUNT & MARGIN GOVERNANCE */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-navy/5 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-navy flex items-center gap-2">
              <Percent className="w-5 h-5 text-cobalt" /> Discount & Margin Thresholds
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-4 bg-navy/5 rounded-2xl space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-navy uppercase">Minimum Margin Floor</label>
                  <span className="font-bold text-navy">{policy.minMarginFloor}%</span>
                </div>
                <input 
                  type="range" 
                  min="5" 
                  max="30" 
                  value={policy.minMarginFloor} 
                  onChange={(e) => setPolicy({...policy, minMarginFloor: parseInt(e.target.value)})}
                  className="w-full accent-navy"
                />
                <div className="text-[11px] text-navy/50">Any quote with margin below this threshold is automatically rejected.</div>
              </div>

              <div className="p-4 bg-navy/5 rounded-2xl space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-navy uppercase">Sales Rep Auto-Approve Max</label>
                  <span className="font-bold text-navy">{policy.autoApproveMaxDiscount}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="20" 
                  value={policy.autoApproveMaxDiscount} 
                  onChange={(e) => setPolicy({...policy, autoApproveMaxDiscount: parseInt(e.target.value)})}
                  className="w-full accent-navy"
                />
                <div className="text-[11px] text-navy/50">Discounts up to this limit skip the manager queue.</div>
              </div>

              <div className="p-4 bg-navy/5 rounded-2xl space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-navy uppercase">Manager Max Sign-off Limit</label>
                  <span className="font-bold text-navy">{policy.managerSignoffMaxDiscount}%</span>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="35" 
                  value={policy.managerSignoffMaxDiscount} 
                  onChange={(e) => setPolicy({...policy, managerSignoffMaxDiscount: parseInt(e.target.value)})}
                  className="w-full accent-navy"
                />
                <div className="text-[11px] text-navy/50">Discounts above this require VP/Executive approval.</div>
              </div>

              <div className="p-4 bg-navy/5 rounded-2xl space-y-2">
                <label className="text-xs font-bold text-navy uppercase block">High-Value Deal Escalation (INR)</label>
                <input 
                  type="number"
                  value={policy.highValueThreshold}
                  onChange={(e) => setPolicy({...policy, highValueThreshold: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-1.5 bg-white border border-navy/10 rounded-xl font-bold text-navy text-sm"
                />
                <div className="text-[11px] text-navy/50">Any deal exceeding this triggers multi-tier finance sign-off.</div>
              </div>
            </div>
          </div>

          {/* ESCROW & LOGISTICS SURCHARGES */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-navy/5 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-navy flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-lime-700" /> Platform Tariffs & Escrow Fees
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-navy uppercase mb-1">Standard Escrow Fee (Basis Points)</label>
                <input 
                  type="number" 
                  value={policy.escrowProtectionFeeBps} 
                  onChange={(e) => setPolicy({...policy, escrowProtectionFeeBps: parseInt(e.target.value) || 0})}
                  className="w-full px-4 py-2.5 bg-navy/5 rounded-xl font-bold text-navy text-sm"
                />
                <div className="text-[11px] text-navy/50 mt-1">75 bps = 0.75% transaction fee on escrow settlement.</div>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy uppercase mb-1">Inter-State Logistics Freight Multiplier (%)</label>
                <input 
                  type="number" 
                  step="0.1"
                  value={policy.freightSurchargePercent} 
                  onChange={(e) => setPolicy({...policy, freightSurchargePercent: parseFloat(e.target.value) || 0})}
                  className="w-full px-4 py-2.5 bg-navy/5 rounded-xl font-bold text-navy text-sm"
                />
                <div className="text-[11px] text-navy/50 mt-1">Calculated automatically on multi-hub cross-state shipments.</div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button 
              type="submit"
              className="px-6 py-3 rounded-xl font-bold text-white bg-navy shadow-lg shadow-navy/20 hover:bg-navy/90 transition-all text-sm flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Save Commercial Policies
            </button>
          </div>

        </form>

      </div>
    </AdminLayout>
  );
}
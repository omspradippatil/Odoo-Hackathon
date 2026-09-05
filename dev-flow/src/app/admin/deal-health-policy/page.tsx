"use client";

import React, { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { 
  Activity, Save, CheckCircle2, AlertTriangle, Sliders, ShieldCheck
} from "lucide-react";

export default function AdminDealHealthPolicyPage() {
  const [saved, setSaved] = useState(false);
  const [config, setConfig] = useState({
    healthyScoreFloor: 80,
    watchScoreFloor: 60,
    marginBreachPenalty: 25,
    leadTimeVariancePenalty: 15,
    paymentEscrowRiskPenalty: 20
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
          <h1 className="text-3xl font-bold text-navy tracking-tight uppercase">Deal Health Scoring Policy</h1>
          <p className="text-sm font-medium text-navy/60">Define risk penalties and real-time health indicator thresholds for in-flight commercial deals.</p>
        </div>

        {saved && (
          <div className="p-4 bg-lime/20 border border-lime/30 rounded-2xl flex items-center gap-3 text-lime-950 font-semibold text-sm">
            <CheckCircle2 className="w-5 h-5 text-lime-700 shrink-0" />
            Deal Health scoring policy saved. Live deal badges updated across dashboards.
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-navy/5 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-navy flex items-center gap-2">
              <Activity className="w-5 h-5 text-cobalt" /> Health Status Classification
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-lime/10 border border-lime/20 rounded-2xl">
                <div className="text-xs font-bold text-lime-900 uppercase tracking-widest mb-1">HEALTHY</div>
                <div className="text-2xl font-bold text-navy mb-2">Score ≥ {config.healthyScoreFloor}</div>
                <div className="text-xs text-navy/60">Deal is on schedule, healthy gross margin, and escrow verified.</div>
              </div>

              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                <div className="text-xs font-bold text-amber-900 uppercase tracking-widest mb-1">NEEDS ATTENTION (WATCH)</div>
                <div className="text-2xl font-bold text-navy mb-2">Score ≥ {config.watchScoreFloor}</div>
                <div className="text-xs text-navy/60">Minor delivery delay, pending buyer sign-off, or warehouse split required.</div>
              </div>

              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
                <div className="text-xs font-bold text-red-900 uppercase tracking-widest mb-1">CRITICAL RISK</div>
                <div className="text-2xl font-bold text-navy mb-2">Score &lt; {config.watchScoreFloor}</div>
                <div className="text-xs text-navy/60">Margin floor breach, unverified payment, or unresolved counter-offer dispute.</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 md:p-8 border border-navy/5 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-navy flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" /> Risk Deduction Penalties (Points)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-navy uppercase mb-1">Margin Floor Breach Deduction</label>
                <input 
                  type="number" 
                  value={config.marginBreachPenalty} 
                  onChange={(e) => setConfig({...config, marginBreachPenalty: parseInt(e.target.value) || 0})}
                  className="w-full px-4 py-2.5 bg-navy/5 rounded-xl font-bold text-navy text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-navy uppercase mb-1">Lead Time Delay Penalty</label>
                <input 
                  type="number" 
                  value={config.leadTimeVariancePenalty} 
                  onChange={(e) => setConfig({...config, leadTimeVariancePenalty: parseInt(e.target.value) || 0})}
                  className="w-full px-4 py-2.5 bg-navy/5 rounded-xl font-bold text-navy text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-navy uppercase mb-1">Unfunded Escrow Penalty</label>
                <input 
                  type="number" 
                  value={config.paymentEscrowRiskPenalty} 
                  onChange={(e) => setConfig({...config, paymentEscrowRiskPenalty: parseInt(e.target.value) || 0})}
                  className="w-full px-4 py-2.5 bg-navy/5 rounded-xl font-bold text-navy text-sm"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button 
              type="submit"
              className="px-6 py-3 rounded-xl font-bold text-white bg-navy shadow-lg shadow-navy/20 hover:bg-navy/90 transition-all text-sm flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Save Scoring Policy
            </button>
          </div>
        </form>

      </div>
    </AdminLayout>
  );
}
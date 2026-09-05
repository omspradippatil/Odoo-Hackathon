"use client";

import React, { useState } from "react";
import { ShieldCheck, Percent, Plus, Settings2, ShieldAlert, ArrowRight, Save, X, Edit2, History } from "lucide-react";
import * as motion from "framer-motion/client";
import { AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function DiscountPoliciesPage() {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-navy tracking-tight mb-2 uppercase">Discount Governance</h1>
          <p className="text-sm font-medium text-navy/60">Configure automated commercial constraints and routing logic.</p>
        </div>
        <button className="px-5 py-3 rounded-xl font-bold text-white bg-navy shadow-lg shadow-navy/20 hover:bg-navy/90 transition-colors text-sm flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" /> New Policy
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-navy/10 shadow-sm overflow-hidden relative">
        <div className="bg-navy/5 p-6 border-b border-navy/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-lg font-bold text-navy">STANDARD COMMERCIAL DISCOUNT</h2>
              <div className="text-[9px] font-bold uppercase tracking-widest bg-lime/20 text-lime-800 px-2 py-0.5 rounded">Active</div>
            </div>
            <div className="text-xs font-medium text-navy/60">Applies To: Professional Sales • Effective: 01 Apr 2026</div>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-10 h-10 rounded-xl bg-white border border-navy/10 flex items-center justify-center hover:bg-navy/5 transition-colors"><History className="w-4 h-4 text-navy/60" /></button>
            <button className="w-10 h-10 rounded-xl bg-white border border-navy/10 flex items-center justify-center hover:bg-navy/5 transition-colors"><Edit2 className="w-4 h-4 text-navy/60" /></button>
          </div>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 text-sm">
            <div className="bg-warm/30 p-4 rounded-xl border border-navy/5">
              <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-1">Organization</div>
              <div className="font-bold text-navy">Global (All)</div>
            </div>
            <div className="bg-warm/30 p-4 rounded-xl border border-navy/5">
              <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-1">Product Category</div>
              <div className="font-bold text-navy">All Hardware</div>
            </div>
            <div className="bg-warm/30 p-4 rounded-xl border border-navy/5">
              <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-1">Margin Floor</div>
              <div className="font-bold text-navy">12%</div>
            </div>
            <div className="bg-warm/30 p-4 rounded-xl border border-navy/5">
              <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-1">Priority</div>
              <div className="font-bold text-navy">1 (Highest)</div>
            </div>
          </div>

          <h3 className="text-xs font-bold text-navy uppercase tracking-widest mb-4 flex items-center gap-2"><Percent className="w-4 h-4 text-cobalt" /> Configured Tiers</h3>
          
          <div className="border border-navy/10 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-navy/5 text-[10px] font-bold text-navy/40 uppercase tracking-widest border-b border-navy/5">
                <tr>
                  <th className="px-6 py-4">Discount Range</th>
                  <th className="px-6 py-4">Required Authority / Routing</th>
                  <th className="px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy/5 font-medium">
                <tr className="hover:bg-navy/[0.02] transition-colors">
                  <td className="px-6 py-4 font-bold text-navy">0% — 5%</td>
                  <td className="px-6 py-4 text-navy/70"><div className="bg-navy/10 text-navy px-2 py-1 rounded inline-block text-xs font-bold">Sales Rep Authority</div></td>
                  <td className="px-6 py-4 text-lime-700 font-bold text-xs uppercase tracking-widest">Auto-Approve</td>
                </tr>
                <tr className="hover:bg-navy/[0.02] transition-colors">
                  <td className="px-6 py-4 font-bold text-navy">5.01% — 10%</td>
                  <td className="px-6 py-4 text-navy/70"><div className="bg-orange-100 text-orange-700 px-2 py-1 rounded inline-block text-xs font-bold">Sales Manager Approval</div></td>
                  <td className="px-6 py-4 text-orange-600 font-bold text-xs uppercase tracking-widest">Route to Manager</td>
                </tr>
                <tr className="hover:bg-navy/[0.02] transition-colors">
                  <td className="px-6 py-4 font-bold text-navy">10.01% — 15%</td>
                  <td className="px-6 py-4 text-navy/70"><div className="bg-coral/10 text-coral px-2 py-1 rounded inline-block text-xs font-bold">Finance / Senior Approval</div></td>
                  <td className="px-6 py-4 text-coral font-bold text-xs uppercase tracking-widest">Route to Finance</td>
                </tr>
                <tr className="hover:bg-navy/[0.02] transition-colors">
                  <td className="px-6 py-4 font-bold text-navy">&gt; 15%</td>
                  <td className="px-6 py-4 text-navy/70"><div className="bg-navy text-white px-2 py-1 rounded inline-block text-xs font-bold">Additional Commercial Review</div></td>
                  <td className="px-6 py-4 text-navy font-bold text-xs uppercase tracking-widest">VP Escalation</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="flex justify-end pt-4">
            <button onClick={() => {setHasUnsavedChanges(true); setShowConfirm(true);}} className="text-sm font-bold text-cobalt hover:text-navy transition-colors">Simulate Policy Changes →</button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-navy/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col">
              <div className="p-6 border-b border-navy/5">
                <h2 className="text-lg font-bold text-navy uppercase tracking-widest flex items-center gap-2"><ShieldAlert className="w-5 h-5 text-coral" /> ACTIVATE NEW POLICY?</h2>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-sm font-medium text-navy/70">Activating this change will update discount routing rules across all new quotations immediately.</p>
                <div className="bg-navy/5 border border-navy/10 p-4 rounded-xl flex justify-between items-center text-sm font-bold">
                  <div>Current: <span className="text-navy/60">DISCOUNT-V2</span></div>
                  <ArrowRight className="w-4 h-4 text-navy/40" />
                  <div>New: <span className="text-coral">DISCOUNT-V3</span></div>
                </div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-navy/40 text-center mt-2">This action will be recorded in the immutable audit log.</div>
              </div>
              <div className="p-6 border-t border-navy/5 flex gap-3">
                <button onClick={() => setShowConfirm(false)} className="flex-1 py-3.5 rounded-xl font-bold text-navy/60 bg-navy/5 hover:bg-navy/10 transition-colors">Cancel</button>
                <button onClick={() => {setShowConfirm(false); setHasUnsavedChanges(false);}} className="flex-1 py-3.5 rounded-xl font-bold text-white bg-coral shadow-lg shadow-coral/20 hover:bg-coral/90 transition-colors">Activate Policy</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

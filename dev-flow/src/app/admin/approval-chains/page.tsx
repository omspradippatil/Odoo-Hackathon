"use client";

import React from "react";
import { GitMerge, Plus, ArrowDown, Settings2, FileText, CheckCircle2 } from "lucide-react";

export default function ApprovalChainsPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-navy tracking-tight mb-2 uppercase">Approval Workflows</h1>
          <p className="text-sm font-medium text-navy/60">Design the routing logic for commercial and financial exceptions.</p>
        </div>
        <button className="px-5 py-3 rounded-xl font-bold text-white bg-navy shadow-lg shadow-navy/20 hover:bg-navy/90 transition-colors text-sm flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" /> New Workflow
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* LIST / SIDEBAR */}
        <div className="w-full lg:w-1/3 space-y-3">
          <div className="bg-white p-4 rounded-2xl border border-navy/20 shadow-sm shadow-navy/5 cursor-pointer relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-lime-500" />
            <div className="font-bold text-navy mb-1">HIGH DISCOUNT APPROVAL</div>
            <div className="text-xs font-medium text-navy/60 mb-3">Sequential • 3 Steps</div>
            <div className="text-[9px] font-bold uppercase tracking-widest bg-lime/10 text-lime-800 px-2 py-0.5 rounded inline-flex">Active (V3)</div>
          </div>
          
          <div className="bg-white p-4 rounded-2xl border border-navy/5 cursor-pointer hover:border-navy/20 transition-colors opacity-70 hover:opacity-100">
            <div className="font-bold text-navy mb-1">MARGIN FLOOR BREACH</div>
            <div className="text-xs font-medium text-navy/60 mb-3">Sequential • 2 Steps</div>
            <div className="text-[9px] font-bold uppercase tracking-widest bg-lime/10 text-lime-800 px-2 py-0.5 rounded inline-flex">Active (V1)</div>
          </div>
        </div>

        {/* WORKFLOW BUILDER VISUAL */}
        <div className="w-full lg:w-2/3 bg-white rounded-3xl border border-navy/10 shadow-sm p-6 md:p-10">
          <div className="flex justify-between items-start mb-8 border-b border-navy/5 pb-6">
            <div>
              <h2 className="text-xl font-bold text-navy mb-2">High Discount Approval Workflow</h2>
              <div className="text-xs font-medium text-navy/60 flex items-center gap-2">
                Trigger: Discount exceeds Sales Rep authority (via Discount Policy)
              </div>
            </div>
            <button className="px-4 py-2 bg-navy/5 hover:bg-navy/10 text-navy font-bold text-xs rounded-lg transition-colors flex items-center gap-2">
              <Settings2 className="w-4 h-4" /> Edit Rules
            </button>
          </div>

          <div className="max-w-md mx-auto py-4">
            
            {/* Step 1 */}
            <div className="bg-warm/30 rounded-2xl border border-navy/10 p-5 relative">
              <div className="absolute -left-3 -top-3 w-6 h-6 rounded-full bg-navy text-white flex items-center justify-center text-[10px] font-bold shadow-sm">1</div>
              <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-1 flex justify-between">
                <span>Role Requirement</span>
                <span className="text-cobalt">Condition Met</span>
              </div>
              <div className="font-bold text-navy text-lg mb-2">SALES_MANAGER</div>
              <div className="text-xs font-medium text-navy/60 bg-white px-3 py-2 rounded-lg border border-navy/5">
                Condition: Discount &gt; Configured Rep Authority
              </div>
            </div>

            <div className="flex justify-center py-3">
              <ArrowDown className="w-5 h-5 text-navy/20" />
            </div>

            {/* Step 2 */}
            <div className="bg-warm/30 rounded-2xl border border-navy/10 p-5 relative">
              <div className="absolute -left-3 -top-3 w-6 h-6 rounded-full bg-navy text-white flex items-center justify-center text-[10px] font-bold shadow-sm">2</div>
              <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-1">Role Requirement</div>
              <div className="font-bold text-navy text-lg mb-2">FINANCE_OPERATIONS</div>
              <div className="text-xs font-medium text-navy/60 bg-white px-3 py-2 rounded-lg border border-navy/5">
                Condition: Margin falls below configured threshold
              </div>
            </div>

            <div className="flex justify-center pt-8">
              <button className="w-12 h-12 rounded-full border-2 border-dashed border-navy/20 flex items-center justify-center text-navy/40 hover:text-navy hover:border-navy hover:bg-navy/5 transition-colors">
                <Plus className="w-6 h-6" />
              </button>
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
}

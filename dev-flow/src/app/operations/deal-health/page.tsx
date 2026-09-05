"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { WorkspaceLayout } from "@/components/layout/WorkspaceLayout";
import { UserRole } from "@/types/auth";
import { 
  Activity, AlertTriangle, AlertCircle, CheckCircle2, ShieldAlert, ArrowRight, 
  Search, Filter, ChevronDown, Check
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function DealHealthDashboard() {
  const router = useRouter();

  return (
    <WorkspaceLayout role={UserRole.FINANCE_OPERATIONS}>
      
      {/* HEADER */}
      <div className="mb-8 md:mb-12">
        <div className="flex items-center gap-2 text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-4">
          <span className="text-navy">Operations</span> <span className="text-navy/20">/</span> <span className="text-navy">Intelligence</span>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-navy tracking-tight mb-2">Deal Health Operations</h1>
            <div className="text-sm font-medium text-navy/60">
              Continuously monitor active deals for operational, commercial, and delivery risks.
            </div>
          </div>
        </div>
      </div>

      {/* SUMMARY DASHBOARD */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-lime/10 border border-lime/20 p-6 rounded-3xl flex flex-col items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-lime/20 flex items-center justify-center"><CheckCircle2 className="w-5 h-5 text-lime-700" /></div>
          <div>
            <div className="text-3xl font-bold text-lime-800">460</div>
            <div className="text-xs font-bold text-lime-700 uppercase tracking-widest mt-1">Healthy</div>
          </div>
        </div>
        
        <div className="bg-orange-50 border border-orange-200 p-6 rounded-3xl flex flex-col items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-orange-200/50 flex items-center justify-center"><AlertCircle className="w-5 h-5 text-orange-600" /></div>
          <div>
            <div className="text-3xl font-bold text-orange-700">8</div>
            <div className="text-xs font-bold text-orange-600 uppercase tracking-widest mt-1">Watch</div>
          </div>
        </div>

        <div className="bg-coral/10 border border-coral/20 p-6 rounded-3xl flex flex-col items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-coral/20 flex items-center justify-center"><AlertTriangle className="w-5 h-5 text-coral" /></div>
          <div>
            <div className="text-3xl font-bold text-coral">3</div>
            <div className="text-xs font-bold text-coral uppercase tracking-widest mt-1">At Risk</div>
          </div>
        </div>

        <div className="bg-navy/5 border border-navy/10 p-6 rounded-3xl flex flex-col items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-navy/10 flex items-center justify-center"><ShieldAlert className="w-5 h-5 text-navy/60" /></div>
          <div>
            <div className="text-3xl font-bold text-navy">0</div>
            <div className="text-xs font-bold text-navy/60 uppercase tracking-widest mt-1">Critical Review</div>
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="bg-white p-4 rounded-2xl border border-navy/10 shadow-sm flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-navy/40 absolute left-4 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search deals, customers, signals..." 
            className="w-full pl-10 pr-4 py-3 bg-warm/30 border border-navy/5 rounded-xl text-sm font-medium focus:outline-none focus:border-navy/20"
          />
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-3 border border-navy/10 rounded-xl text-sm font-bold text-navy flex items-center gap-2 hover:bg-navy/5 transition-colors">
            <Filter className="w-4 h-4" /> Priority Signals <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* DEAL LIST */}
      <div className="space-y-4">
        
        {/* Deal 1: DF-2048 (Watch) */}
        <div 
          onClick={() => router.push('/deals/DF-2048/health')}
          className="bg-white border border-navy/10 rounded-3xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm hover:border-orange-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="font-bold text-navy text-lg">DF-2048</div>
              <div className="text-[10px] font-bold uppercase tracking-widest bg-orange-100 text-orange-700 px-2.5 py-1 rounded flex items-center gap-1.5"><AlertCircle className="w-3 h-3" /> WATCH</div>
              <div className="text-[10px] font-bold uppercase tracking-widest bg-navy/5 text-navy/60 px-2.5 py-1 rounded">Fulfilment Stage</div>
            </div>
            <div className="text-sm font-medium text-navy/60 mb-4">Nova Retail • ₹8.40L + ₹55K/mo</div>
            <div className="flex items-center gap-4 text-xs font-bold text-coral">
              <div className="flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5" /> 3 Active Signals</div>
              <div className="text-navy/40">•</div>
              <div className="text-navy/60">Highest: HIGH (Discount change / Delivery risk)</div>
            </div>
          </div>
          <div className="w-full md:w-48 text-right flex flex-col md:items-end gap-3">
            <div className="text-xs font-medium text-navy/60">Updated 2m ago</div>
            <button className="w-full md:w-auto px-5 py-2.5 bg-navy/5 text-navy text-xs font-bold rounded-xl group-hover:bg-navy group-hover:text-white transition-colors flex items-center justify-center gap-2">
              Review Health <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Deal 2: DF-1984 (At Risk) */}
        <div className="bg-white border border-navy/10 rounded-3xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm hover:border-coral/30 hover:shadow-md transition-all cursor-pointer group">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="font-bold text-navy text-lg">DF-1984</div>
              <div className="text-[10px] font-bold uppercase tracking-widest bg-coral/10 text-coral px-2.5 py-1 rounded flex items-center gap-1.5"><AlertTriangle className="w-3 h-3" /> AT RISK</div>
              <div className="text-[10px] font-bold uppercase tracking-widest bg-navy/5 text-navy/60 px-2.5 py-1 rounded">Payment Stage</div>
            </div>
            <div className="text-sm font-medium text-navy/60 mb-4">Atlas Manufacturing • ₹12.50L</div>
            <div className="flex items-center gap-4 text-xs font-bold text-coral">
              <div className="flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5" /> 5 Active Signals</div>
              <div className="text-navy/40">•</div>
              <div className="text-navy/60">Highest: HIGH (Repeated payment failure)</div>
            </div>
          </div>
          <div className="w-full md:w-48 text-right flex flex-col md:items-end gap-3">
            <div className="text-xs font-medium text-navy/60">Updated 45m ago</div>
            <button className="w-full md:w-auto px-5 py-2.5 bg-navy/5 text-navy text-xs font-bold rounded-xl group-hover:bg-navy group-hover:text-white transition-colors flex items-center justify-center gap-2">
              Review Health <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Deal 3: DF-2061 (Healthy) */}
        <div className="bg-white border border-navy/10 rounded-3xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm hover:border-lime-300 hover:shadow-md transition-all cursor-pointer group">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="font-bold text-navy text-lg">DF-2061</div>
              <div className="text-[10px] font-bold uppercase tracking-widest bg-lime/10 text-lime-700 px-2.5 py-1 rounded flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3" /> HEALTHY</div>
              <div className="text-[10px] font-bold uppercase tracking-widest bg-navy/5 text-navy/60 px-2.5 py-1 rounded">Approval Stage</div>
            </div>
            <div className="text-sm font-medium text-navy/60 mb-4">Zenith Labs • ₹3.20L</div>
            <div className="flex items-center gap-4 text-xs font-bold text-lime-700">
              <div className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5" /> 0 Active Signals</div>
              <div className="text-navy/40">•</div>
              <div className="text-navy/60">All operational checks passed</div>
            </div>
          </div>
          <div className="w-full md:w-48 text-right flex flex-col md:items-end gap-3">
            <div className="text-xs font-medium text-navy/60">Updated 2h ago</div>
            <button className="w-full md:w-auto px-5 py-2.5 bg-navy/5 text-navy text-xs font-bold rounded-xl group-hover:bg-navy group-hover:text-white transition-colors flex items-center justify-center gap-2">
              View Deal <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* PAGINATION */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-navy/10">
        <button className="text-xs font-bold text-navy/40 hover:text-navy transition-colors">← Previous</button>
        <div className="hidden sm:flex gap-2">
          <button className="w-8 h-8 rounded-lg bg-navy text-white text-xs font-bold flex items-center justify-center shadow-sm">1</button>
          <button className="w-8 h-8 rounded-lg bg-white border border-navy/10 text-navy text-xs font-bold hover:bg-navy/5 flex items-center justify-center transition-colors">2</button>
          <button className="w-8 h-8 rounded-lg bg-white border border-navy/10 text-navy text-xs font-bold hover:bg-navy/5 flex items-center justify-center transition-colors">3</button>
          <span className="text-navy/40 text-xs font-bold flex items-end">...</span>
          <button className="w-8 h-8 rounded-lg bg-white border border-navy/10 text-navy text-xs font-bold hover:bg-navy/5 flex items-center justify-center transition-colors">24</button>
        </div>
        <div className="sm:hidden text-xs font-bold text-navy/40">Page 1 of 24</div>
        <button className="text-xs font-bold text-navy hover:text-cobalt transition-colors">Next →</button>
      </div>

    </WorkspaceLayout>
  );
}

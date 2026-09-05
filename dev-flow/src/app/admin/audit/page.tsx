"use client";

import React, { useState } from "react";
import { List, Search, Filter, ChevronDown, Download, AlertCircle, FileText, Settings, User } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AuditLogPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 relative h-[calc(100vh-6rem)] flex flex-col">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-navy tracking-tight mb-2 uppercase">Audit Log</h1>
          <p className="text-sm font-medium text-navy/60">Immutable record of system configuration and governance changes.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2.5 rounded-xl font-bold text-navy bg-white border border-navy/10 shadow-sm hover:bg-navy/5 transition-colors text-sm flex items-center justify-center gap-2">
            <Download className="w-4 h-4" /> Export Log
          </button>
        </div>
      </div>

      {/* FILTERS */}
      <div className="bg-white p-4 rounded-2xl border border-navy/10 shadow-sm flex flex-col sm:flex-row gap-4 shrink-0">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-navy/40 absolute left-4 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search by actor, action, or entity ID..." 
            className="w-full pl-10 pr-4 py-3 bg-warm/30 border border-navy/5 rounded-xl text-sm font-medium focus:outline-none focus:border-navy/20"
          />
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-3 border border-navy/10 rounded-xl text-sm font-bold text-navy flex items-center gap-2 hover:bg-navy/5 transition-colors">
            All Actions <ChevronDown className="w-4 h-4" />
          </button>
          <button className="px-4 py-3 border border-navy/10 rounded-xl text-sm font-bold text-navy flex items-center gap-2 hover:bg-navy/5 transition-colors">
            Last 30 Days <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="bg-white rounded-3xl border border-navy/10 shadow-sm flex-1 flex flex-col overflow-hidden min-h-0">
        <div className="overflow-auto flex-1 relative">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-navy/5 text-[10px] font-bold text-navy/40 uppercase tracking-widest border-b border-navy/5 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">Actor</th>
                <th className="px-6 py-4">Entity Reference</th>
                <th className="px-6 py-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy/5 font-medium">
              
              <tr className="hover:bg-navy/[0.02] transition-colors group cursor-pointer" onClick={() => setDrawerOpen(true)}>
                <td className="px-6 py-4 text-navy/60">05 Sep 2026, 18:42:15</td>
                <td className="px-6 py-4 font-bold text-navy flex items-center gap-2"><Settings className="w-4 h-4 text-coral" /> Discount Policy Updated</td>
                <td className="px-6 py-4 text-navy/80 flex items-center gap-2"><User className="w-4 h-4 text-navy/40" /> Admin User (A. Mehta)</td>
                <td className="px-6 py-4"><span className="bg-navy/5 px-2 py-1 rounded text-xs font-bold text-navy/70">STANDARD-DISCOUNT-V3</span></td>
                <td className="px-6 py-4 text-right text-cobalt font-bold text-xs hover:underline">View Before/After</td>
              </tr>
              
              <tr className="hover:bg-navy/[0.02] transition-colors cursor-pointer">
                <td className="px-6 py-4 text-navy/60">05 Sep 2026, 14:12:05</td>
                <td className="px-6 py-4 font-bold text-navy flex items-center gap-2"><FileText className="w-4 h-4 text-cobalt" /> Approval Workflow Created</td>
                <td className="px-6 py-4 text-navy/80 flex items-center gap-2"><User className="w-4 h-4 text-navy/40" /> Admin User (S. Rao)</td>
                <td className="px-6 py-4"><span className="bg-navy/5 px-2 py-1 rounded text-xs font-bold text-navy/70">APPR-ENTERPRISE-V1</span></td>
                <td className="px-6 py-4 text-right text-navy/40 font-bold text-xs hover:text-navy transition-colors">View</td>
              </tr>
              
              <tr className="hover:bg-navy/[0.02] transition-colors cursor-pointer">
                <td className="px-6 py-4 text-navy/60">04 Sep 2026, 09:30:00</td>
                <td className="px-6 py-4 font-bold text-navy flex items-center gap-2"><AlertCircle className="w-4 h-4 text-orange-500" /> User Role Changed</td>
                <td className="px-6 py-4 text-navy/80 flex items-center gap-2"><User className="w-4 h-4 text-navy/40" /> System Provisioning</td>
                <td className="px-6 py-4"><span className="bg-navy/5 px-2 py-1 rounded text-xs font-bold text-navy/70">USR-8442</span></td>
                <td className="px-6 py-4 text-right text-navy/40 font-bold text-xs hover:text-navy transition-colors">View</td>
              </tr>

              {/* Duplicate rows for demonstration of scrolling/list */}
              {Array.from({ length: 8 }).map((_, i) => (
                <tr key={i} className="hover:bg-navy/[0.02] transition-colors">
                  <td className="px-6 py-4 text-navy/40">01 Sep 2026, 10:15:00</td>
                  <td className="px-6 py-4 font-medium text-navy/60 flex items-center gap-2">Product Catalog Sync</td>
                  <td className="px-6 py-4 text-navy/60 flex items-center gap-2"><User className="w-4 h-4 text-navy/20" /> API Gateway</td>
                  <td className="px-6 py-4"><span className="bg-navy/5 px-2 py-1 rounded text-xs font-bold text-navy/40">BATCH-9021</span></td>
                  <td className="px-6 py-4 text-right text-navy/20 font-bold text-xs">System</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* SERVER-SIDE PAGINATION */}
        <div className="flex items-center justify-between p-4 md:px-6 border-t border-navy/5 shrink-0 bg-white">
          <button className="text-xs font-bold text-navy/40 hover:text-navy transition-colors">← Previous</button>
          <div className="hidden sm:flex gap-2">
            <button className="w-8 h-8 rounded-lg bg-navy text-white text-xs font-bold flex items-center justify-center shadow-sm">1</button>
            <button className="w-8 h-8 rounded-lg bg-white border border-navy/10 text-navy text-xs font-bold hover:bg-navy/5 flex items-center justify-center transition-colors">2</button>
            <button className="w-8 h-8 rounded-lg bg-white border border-navy/10 text-navy text-xs font-bold hover:bg-navy/5 flex items-center justify-center transition-colors">3</button>
            <span className="text-navy/40 text-xs font-bold flex items-end">...</span>
            <button className="w-8 h-8 rounded-lg bg-white border border-navy/10 text-navy text-xs font-bold hover:bg-navy/5 flex items-center justify-center transition-colors">63</button>
          </div>
          <div className="sm:hidden text-xs font-bold text-navy/40">Page 1 of 63</div>
          <button className="text-xs font-bold text-navy hover:text-cobalt transition-colors">Next →</button>
        </div>
      </div>

      {/* AUDIT DETAIL DRAWER */}
      {drawerOpen && (
        <div className="absolute top-0 bottom-0 right-0 w-full max-w-md bg-white border-l border-navy/10 shadow-2xl z-40 flex flex-col animate-in slide-in-from-right-full">
          <div className="p-6 border-b border-navy/5 flex items-center justify-between">
            <h2 className="text-lg font-bold text-navy uppercase tracking-widest">Audit Record Detail</h2>
            <button onClick={() => setDrawerOpen(false)} className="text-navy/40 hover:text-navy">Close</button>
          </div>
          <div className="p-6 overflow-y-auto space-y-6">
            
            <div>
              <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-1">Action</div>
              <div className="font-bold text-navy text-base">Discount Policy Updated</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-1">Actor</div>
                <div className="font-bold text-navy text-sm">Admin User</div>
                <div className="text-xs text-navy/60">aarav.m@company.com</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-1">Timestamp</div>
                <div className="font-bold text-navy text-sm">05 Sep 2026</div>
                <div className="text-xs text-navy/60">18:42:15 IST</div>
              </div>
            </div>

            <div>
              <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-1">Entity</div>
              <div className="bg-navy/5 px-3 py-2 rounded-lg font-bold text-navy text-sm inline-block border border-navy/10">STANDARD-DISCOUNT-V3</div>
            </div>

            <div className="bg-warm/30 rounded-2xl border border-navy/10 p-5 space-y-4">
              <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest">Diff / Payload</div>
              
              <div className="bg-red-50/50 border border-red-100 p-3 rounded-lg">
                <div className="text-[10px] font-bold text-red-700 uppercase tracking-widest mb-1">BEFORE</div>
                <div className="font-mono text-xs text-red-900">- Rep Authority: 5%</div>
                <div className="font-mono text-xs text-red-900">- Manager Threshold: &gt;5%</div>
              </div>

              <div className="bg-green-50/50 border border-green-100 p-3 rounded-lg">
                <div className="text-[10px] font-bold text-green-700 uppercase tracking-widest mb-1">AFTER</div>
                <div className="font-mono text-xs text-green-900">+ Rep Authority: 7%</div>
                <div className="font-mono text-xs text-green-900">+ Manager Threshold: &gt;7%</div>
              </div>
            </div>

            <p className="text-xs font-medium text-navy/40 italic text-center pt-4">This record is permanently sealed and cannot be modified.</p>
          </div>
        </div>
      )}

    </div>
  );
}

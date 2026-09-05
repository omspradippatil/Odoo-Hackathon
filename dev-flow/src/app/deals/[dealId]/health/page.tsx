"use client";

import React, { use, useState } from "react";
import { useRouter } from "next/navigation";
import { WorkspaceLayout } from "@/components/layout/WorkspaceLayout";
import { UserRole } from "@/types/auth";
import { 
  Activity, AlertTriangle, AlertCircle, CheckCircle2, ShieldAlert, ArrowRight, 
  TrendingDown, PackageMinus, Info, Clock, Check, FileText, Settings, X, Search 
} from "lucide-react";
import * as motion from "framer-motion/client";
import { AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function DealHealthDetailPage({ params }: { params: Promise<{ dealId: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <WorkspaceLayout role={UserRole.FINANCE_OPERATIONS}>
      
      {/* HEADER */}
      <div className="mb-8 md:mb-12">
        <div className="flex items-center gap-2 text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-4">
          <span className="text-navy">Operations</span> <span className="text-navy/20">/</span> <span className="text-navy">Deal Health</span> <span className="text-navy/20">/</span> <span>{resolvedParams.dealId}</span>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-navy tracking-tight mb-2">Deal Health</h1>
            <div className="text-sm font-medium text-navy/60 flex flex-wrap items-center gap-x-2 gap-y-1">
              Customer: <strong className="text-navy">Nova Retail</strong> <span className="text-navy/20">•</span> 
              Value: <strong className="text-navy">₹8.40L One-Time + ₹55K / mo</strong>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button className="px-5 py-3 rounded-xl font-bold text-navy bg-white border border-navy/10 shadow-sm hover:bg-navy/5 transition-colors text-sm flex items-center justify-center gap-2">
              <Settings className="w-4 h-4" /> Manage Policies
            </button>
            <button className="px-5 py-3 rounded-xl font-bold text-white bg-navy shadow-lg shadow-navy/20 hover:bg-navy/90 transition-colors text-sm flex items-center justify-center gap-2">
              Review Deal <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* JOURNEY SIGNALS */}
        <div className="w-full bg-white p-4 rounded-2xl border border-navy/5 shadow-sm overflow-x-auto no-scrollbar mb-8">
          <div className="flex items-center min-w-[750px] justify-between relative px-4">
            <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-[2px] bg-navy/5 -z-10" />

            {[
              { id: 'REQUEST', label: 'REQUEST', state: 'done' },
              { id: 'DISCOVER', label: 'DISCOVER', state: 'done' },
              { id: 'QUOTE', label: 'QUOTE', state: 'done' },
              { id: 'APPROVE', label: 'APPROVE', state: 'warn' }, // Risk originated here
              { id: 'NEGOTIATE', label: 'NEGOTIATE', state: 'done' },
              { id: 'PROTECT', label: 'PROTECT', state: 'done' },
              { id: 'FULFIL', label: 'FULFIL', state: 'warn' }, // Current fulfilment risk
              { id: 'BILL', label: 'BILL', state: 'idle' },
            ].map((stage) => (
              <div key={stage.id} className="flex flex-col items-center gap-2 px-2 z-10 relative bg-white">
                <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all bg-white relative", 
                  stage.state === 'done' ? "border-lime text-lime-600" :
                  stage.state === 'warn' ? "border-orange-500 text-orange-600 shadow-[0_0_10px_rgba(249,115,22,0.3)]" : "border-navy/10")}>
                  {stage.state === 'done' && <Check className="w-3 h-3" />}
                  {stage.state === 'warn' && <AlertTriangle className="w-3 h-3" />}
                </div>
                <span className={cn("text-[9px] font-bold uppercase tracking-widest", 
                  stage.state === 'warn' ? "text-orange-600" : stage.state === 'done' ? "text-lime-700" : "text-navy/30")}>
                  {stage.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start relative">
        
        {/* LEFT COLUMN - MAIN AREA */}
        <div className="w-full lg:w-[65%] space-y-8 pb-12 lg:pb-0">
          
          {/* SUMMARY HERO */}
          <div className="bg-orange-50 rounded-3xl border border-orange-200 shadow-sm overflow-hidden text-orange-950 relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-200/50 rounded-full blur-3xl pointer-events-none" />
            
            <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10 border-b border-orange-200/50">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-orange-600/80 mb-1">Overall Status</div>
                <div className="text-3xl font-bold tracking-tight flex items-center gap-3">
                  <AlertCircle className="w-8 h-8 text-orange-600" /> WATCH
                </div>
              </div>
              <div className="bg-white/50 border border-orange-200/50 px-6 py-4 rounded-2xl flex items-center gap-6">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-orange-600/80 mb-1">Health Score</div>
                  <div className="text-4xl font-bold text-orange-700 tabular-nums">74 <span className="text-lg text-orange-600/50">/ 100</span></div>
                </div>
                <div className="w-[1px] h-10 bg-orange-200/50" />
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-orange-600/80 mb-1">Active Signals</div>
                  <div className="text-3xl font-bold text-orange-700">3</div>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8 relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <p className="text-sm font-medium text-orange-900/80 leading-relaxed max-w-lg">
                  The deal is progressing, but <strong className="text-orange-950">3 conditions require attention</strong>. Deal Health summarizes available commercial, payment, fulfilment and operational signals.
                </p>
                <div className="text-[10px] font-bold uppercase tracking-widest text-orange-600/60 mt-3 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Last Evaluated: 2 minutes ago
                </div>
              </div>
              <button 
                onClick={() => setDrawerOpen(true)}
                className="px-4 py-2 bg-orange-600 text-white text-xs font-bold rounded-xl shadow-md shadow-orange-600/20 hover:bg-orange-700 transition-colors shrink-0"
              >
                Why 74? →
              </button>
            </div>
          </div>

          {/* FACTOR BREAKDOWN */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {[
              { label: 'VENDOR', score: 91, status: 'good' },
              { label: 'CUSTOMER', score: 88, status: 'good' },
              { label: 'PAYMENT', score: 84, status: 'good' },
              { label: 'APPROVAL', score: 72, status: 'warn' },
              { label: 'COMMERCIAL', score: 68, status: 'warn' },
              { label: 'FULFILMENT', score: 63, status: 'warn' },
            ].map(factor => (
              <div key={factor.label} className={cn("p-4 rounded-2xl border transition-colors", 
                factor.status === 'good' ? "bg-white border-navy/5" : "bg-orange-50/50 border-orange-200"
              )}>
                <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-2">{factor.label}</div>
                <div className={cn("text-2xl font-bold", factor.status === 'warn' ? "text-orange-600" : "text-navy")}>{factor.score}</div>
              </div>
            ))}
          </div>

          <h2 className="text-lg font-bold text-navy px-2 mt-12 mb-2 flex items-center gap-2">
            <Activity className="w-5 h-5 text-coral" /> Needs Attention
          </h2>

          <div className="space-y-4">
            
            {/* SIGNAL 1: DISCOUNT */}
            <div className="bg-white rounded-3xl border border-coral/20 shadow-sm overflow-hidden">
              <div className="bg-coral/5 px-6 py-4 border-b border-coral/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-coral/10 flex items-center justify-center shrink-0">
                    <TrendingDown className="w-4 h-4 text-coral" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-coral uppercase tracking-widest">Unusual Discount Change</h3>
                  </div>
                </div>
                <div className="text-[9px] font-bold text-white bg-coral px-2.5 py-1 rounded uppercase tracking-widest">HIGH SEVERITY</div>
              </div>
              <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
                <div className="flex-1 space-y-6 text-sm">
                  <div>
                    <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-1">What Happened</div>
                    <p className="font-medium text-navy/80">Customer requested an additional discount after V1 was already approved. Discount increased from <strong className="text-navy">12%</strong> to <strong className="text-navy">15%</strong> within 35 minutes.</p>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-1">Why It Matters</div>
                    <p className="font-medium text-navy/80">The revised discount exceeds the previously approved commercial terms.</p>
                  </div>
                  <div className="bg-warm/30 p-4 rounded-xl border border-navy/5 flex gap-6">
                    <div>
                      <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-1">Approved Auth</div>
                      <div className="font-bold text-navy">12% MAX</div>
                    </div>
                    <div className="w-[1px] bg-navy/10" />
                    <div>
                      <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-1">Latest Requested</div>
                      <div className="font-bold text-coral">15%</div>
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-56 flex flex-col gap-3 justify-center border-t md:border-t-0 md:border-l border-navy/5 pt-6 md:pt-0 md:pl-6">
                  <div className="text-xs font-bold text-navy/60 uppercase tracking-widest mb-1">Action Required</div>
                  <div className="font-bold text-navy mb-3">Reapproval Required</div>
                  <button className="w-full py-3 rounded-xl bg-navy text-white text-sm font-bold shadow-sm hover:bg-navy/90 transition-colors">Review Approval →</button>
                  <button className="w-full py-2.5 rounded-xl bg-white border border-navy/10 text-navy/60 text-xs font-bold hover:bg-navy/5 transition-colors">Acknowledge</button>
                </div>
              </div>
            </div>

            {/* SIGNAL 2: MARGIN */}
            <div className="bg-white rounded-3xl border border-orange-200 shadow-sm overflow-hidden">
              <div className="bg-orange-50 px-6 py-4 border-b border-orange-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                    <TrendingDown className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-orange-700 uppercase tracking-widest">Margin Decrease</h3>
                  </div>
                </div>
                <div className="text-[9px] font-bold text-orange-700 bg-orange-100 border border-orange-200 px-2.5 py-1 rounded uppercase tracking-widest">MEDIUM SEVERITY</div>
              </div>
              <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
                <div className="flex-1 space-y-4 text-sm">
                  <div>
                    <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-1">Impact</div>
                    <p className="font-medium text-navy/80">Commercial health weakened due to latest quotation revisions.</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="px-4 py-2 bg-navy/5 rounded-lg font-bold text-navy/60">18% (V1)</div>
                    <ArrowRight className="w-4 h-4 text-navy/20" />
                    <div className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg font-bold">14% (V2)</div>
                  </div>
                </div>
                <div className="w-full md:w-56 flex flex-col gap-3 justify-center border-t md:border-t-0 md:border-l border-navy/5 pt-6 md:pt-0 md:pl-6">
                  <button className="w-full py-3 rounded-xl bg-navy/5 border border-navy/10 text-navy text-sm font-bold hover:bg-navy/10 transition-colors">Review Commercials</button>
                </div>
              </div>
            </div>

            {/* SIGNAL 3: FULFILMENT RISK */}
            <div className="bg-white rounded-3xl border border-coral/20 shadow-sm overflow-hidden">
              <div className="bg-coral/5 px-6 py-4 border-b border-coral/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-coral/10 flex items-center justify-center shrink-0">
                    <PackageMinus className="w-4 h-4 text-coral" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-coral uppercase tracking-widest">Delivery Risk</h3>
                  </div>
                </div>
                <div className="text-[9px] font-bold text-white bg-coral px-2.5 py-1 rounded uppercase tracking-widest">HIGH SEVERITY</div>
              </div>
              <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
                <div className="flex-1 space-y-4 text-sm">
                  <div>
                    <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-1">What Happened</div>
                    <p className="font-medium text-navy/80"><strong className="text-coral">10 units</strong> currently backordered at Pune Warehouse.</p>
                  </div>
                  <div className="bg-warm/30 p-4 rounded-xl border border-navy/5 flex gap-6">
                    <div>
                      <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-1">Required By</div>
                      <div className="font-bold text-navy">12 Sep 2026</div>
                    </div>
                    <div className="w-[1px] bg-navy/10" />
                    <div>
                      <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-1">Latest Expected</div>
                      <div className="font-bold text-coral">16 Sep 2026 (4 Days Late)</div>
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-56 flex flex-col gap-3 justify-center border-t md:border-t-0 md:border-l border-navy/5 pt-6 md:pt-0 md:pl-6">
                  <button className="w-full py-3 rounded-xl bg-navy text-white text-sm font-bold shadow-sm hover:bg-navy/90 transition-colors">Review Fulfilment →</button>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN - CONTEXT PANEL */}
        <div className="w-full lg:w-[35%]">
          <div className="sticky top-28 space-y-6">
            
            <div className="bg-white rounded-3xl border border-navy/10 shadow-sm p-6">
              <h3 className="text-xs font-bold text-navy uppercase tracking-widest mb-6 flex items-center gap-2"><Clock className="w-4 h-4 text-cobalt" /> Deal Health Timeline</h3>
              
              <div className="space-y-0 relative ml-2">
                <div className="absolute left-[11px] top-4 bottom-4 w-[2px] bg-navy/10" />
                
                <div className="flex gap-4 py-3 relative z-10">
                  <div className="w-6 h-6 rounded-full bg-coral/10 flex items-center justify-center shrink-0 border-[3px] border-white"><AlertTriangle className="w-3 h-3 text-coral" /></div>
                  <div className="pt-0.5">
                    <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest">06 Sep • Today</div>
                    <div className="text-sm font-bold text-navy">Inventory shortage detected</div>
                    <div className="text-xs font-medium text-coral mt-0.5">Delivery risk: LOW → HIGH</div>
                  </div>
                </div>

                <div className="flex gap-4 py-3 relative z-10">
                  <div className="w-6 h-6 rounded-full bg-lime/20 flex items-center justify-center shrink-0 border-[3px] border-white"><CheckCircle2 className="w-3 h-3 text-lime-700" /></div>
                  <div className="pt-0.5">
                    <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest">05 Sep • 11:30</div>
                    <div className="text-sm font-bold text-navy">V2 Reapproval completed</div>
                  </div>
                </div>

                <div className="flex gap-4 py-3 relative z-10">
                  <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center shrink-0 border-[3px] border-white"><AlertTriangle className="w-3 h-3 text-orange-600" /></div>
                  <div className="pt-0.5">
                    <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest">05 Sep • 10:43</div>
                    <div className="text-sm font-bold text-navy">Reapproval Required</div>
                    <div className="text-xs font-medium text-navy/60 mt-0.5">Customer requested 15% discount</div>
                  </div>
                </div>

                <div className="flex gap-4 py-3 relative z-10">
                  <div className="w-6 h-6 rounded-full bg-lime/20 flex items-center justify-center shrink-0 border-[3px] border-white"><CheckCircle2 className="w-3 h-3 text-lime-700" /></div>
                  <div className="pt-0.5">
                    <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest">05 Sep • 10:10</div>
                    <div className="text-sm font-bold text-navy">12% discount approved</div>
                  </div>
                </div>

                <div className="flex gap-4 py-3 relative z-10">
                  <div className="w-6 h-6 rounded-full bg-navy/5 flex items-center justify-center shrink-0 border-[3px] border-white"><FileText className="w-3 h-3 text-navy/40" /></div>
                  <div className="pt-0.5">
                    <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest">04 Sep</div>
                    <div className="text-sm font-bold text-navy">Quotation V1 created</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-navy/10 shadow-sm p-6">
              <h3 className="text-xs font-bold text-navy uppercase tracking-widest mb-4">Signal Resolution</h3>
              <div className="text-sm font-medium text-navy/70 leading-relaxed mb-4">
                Automated signals provide operational intelligence. Resolve signals by addressing the underlying business condition.
              </div>
              <div className="flex flex-col gap-2">
                <div className="text-xs font-bold text-navy/40 uppercase tracking-widest flex justify-between items-center bg-navy/5 px-3 py-2 rounded-lg">
                  <span>Open</span>
                  <span className="text-navy">3</span>
                </div>
                <div className="text-xs font-bold text-navy/40 uppercase tracking-widest flex justify-between items-center bg-navy/5 px-3 py-2 rounded-lg">
                  <span>Acknowledged</span>
                  <span className="text-navy">0</span>
                </div>
                <div className="text-xs font-bold text-navy/40 uppercase tracking-widest flex justify-between items-center bg-navy/5 px-3 py-2 rounded-lg">
                  <span>Resolved</span>
                  <span className="text-lime-700">1</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* WHY 74 DRAWER / MODAL */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-navy/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col">
              
              <div className="p-6 border-b border-navy/5 flex items-center justify-between">
                <h2 className="text-lg font-bold text-navy uppercase tracking-widest">Why 74 / 100?</h2>
                <button onClick={() => setDrawerOpen(false)} className="text-navy/40 hover:text-navy transition-colors"><X className="w-5 h-5" /></button>
              </div>
              
              <div className="p-6 md:p-8 space-y-8 bg-warm/20">
                
                <div>
                  <h3 className="text-xs font-bold text-lime-700 uppercase tracking-widest flex items-center gap-2 mb-4"><CheckCircle2 className="w-4 h-4" /> Positive Signals</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-sm font-medium text-navy/80"><div className="w-1.5 h-1.5 bg-lime-500 rounded-full" /> Vendor Trust is stable at 92 (Gold)</li>
                    <li className="flex items-center gap-3 text-sm font-medium text-navy/80"><div className="w-1.5 h-1.5 bg-lime-500 rounded-full" /> Protected payment milestones confirmed</li>
                    <li className="flex items-center gap-3 text-sm font-medium text-navy/80"><div className="w-1.5 h-1.5 bg-lime-500 rounded-full" /> Customer communication is active</li>
                    <li className="flex items-center gap-3 text-sm font-medium text-navy/80"><div className="w-1.5 h-1.5 bg-lime-500 rounded-full" /> 80% of inventory successfully allocated</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-orange-600 uppercase tracking-widest flex items-center gap-2 mb-4"><AlertTriangle className="w-4 h-4" /> Negative Signals</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-sm font-medium text-navy/80"><div className="w-1.5 h-1.5 bg-orange-500 rounded-full" /> Discount changed outside authority after initial approval</li>
                    <li className="flex items-center gap-3 text-sm font-medium text-navy/80"><div className="w-1.5 h-1.5 bg-orange-500 rounded-full" /> Commercial margin dropped from 18% to 14%</li>
                    <li className="flex items-center gap-3 text-sm font-medium text-navy/80"><div className="w-1.5 h-1.5 bg-coral rounded-full" /> 10 units currently backordered (Delivery risk)</li>
                    <li className="flex items-center gap-3 text-sm font-medium text-navy/80"><div className="w-1.5 h-1.5 bg-coral rounded-full" /> Expected delivery date moved back by 4 days</li>
                  </ul>
                </div>

                <div className="pt-4 border-t border-navy/10 flex justify-between items-center">
                  <div className="text-xs font-bold text-navy/60 uppercase tracking-widest">Resulting Status</div>
                  <div className="px-4 py-2 bg-orange-100 text-orange-700 font-bold rounded-lg flex items-center gap-2 text-sm">
                    WATCH
                  </div>
                </div>

              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </WorkspaceLayout>
  );
}

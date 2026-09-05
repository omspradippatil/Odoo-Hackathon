"use client";

import React, { use } from "react";
import { useRouter } from "next/navigation";
import { WorkspaceLayout } from "@/components/layout/WorkspaceLayout";
import { UserRole } from "@/types/auth";
import { ShieldCheck, Activity, Check, ArrowRight, Lock, Building2, Package, Clock, AlertTriangle } from "lucide-react";
import * as motion from "framer-motion/client";
import { cn } from "@/lib/utils";

const formatCurrency = (val: number) => `₹${val.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

export default function InternalOperationsPaymentPage({ params }: { params: Promise<{ dealId: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();

  return (
    <WorkspaceLayout role={UserRole.FINANCE_OPERATIONS}>
      
      {/* JOURNEY HEADER */}
      <div className="mb-8 md:mb-12">
        <div className="flex items-center gap-2 text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-4">
          <span className="text-navy">Operations</span> <span className="text-navy/20">/</span> <span className="text-navy">Payments</span> <span className="text-navy/20">/</span> <span>{resolvedParams.dealId}</span>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-navy tracking-tight mb-2">Transaction Control</h1>
            <div className="text-sm font-medium text-navy/60 flex items-center gap-2">
              Customer: <strong className="text-navy">Nova Retail</strong> <span className="text-navy/20">•</span> Quotation: <strong className="text-navy">QT-2048</strong>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="bg-lime/20 text-lime-800 border border-lime/30 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-sm">
              <ShieldCheck className="w-4 h-4" /> PAYMENT PROTECTED
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start relative">
        
        {/* LEFT COLUMN - MAIN AREA */}
        <div className="w-full lg:w-[65%] space-y-8 pb-12 lg:pb-0">
          
          {/* PAYMENT SUMMARY */}
          <div className="bg-white rounded-3xl border border-navy/10 shadow-sm overflow-hidden">
            <div className="bg-navy p-6 md:p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-cobalt/20 rounded-full blur-3xl pointer-events-none" />
              <div className="flex flex-col sm:flex-row justify-between gap-8 relative z-10">
                <div className="flex-1">
                  <div className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1">Deal Value</div>
                  <div className="text-3xl font-bold">₹8,40,000</div>
                  <div className="text-[10px] font-bold text-white/50 uppercase tracking-widest mt-4 mb-1">Recurring Commitment</div>
                  <div className="text-sm font-bold">₹55,000 / month</div>
                </div>
                <div className="hidden sm:block w-[1px] bg-white/10" />
                <div className="flex-1 space-y-4">
                  <div>
                    <div className="text-[10px] font-bold text-lime uppercase tracking-widest mb-1 flex items-center gap-1"><Check className="w-3 h-3" /> Collected</div>
                    <div className="text-2xl font-bold text-lime">₹2,52,000</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1">Pending Balance</div>
                    <div className="text-lg font-bold text-white/70">₹5,88,000</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 md:p-8 bg-white flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="text-xs font-bold text-navy uppercase tracking-widest mb-1 flex items-center gap-1.5"><Lock className="w-4 h-4 text-orange-500" /> Settlement Status</h2>
                <div className="text-sm font-bold text-orange-600 bg-orange-50 inline-block px-2 py-0.5 rounded border border-orange-100">ON HOLD / PENDING FULFILMENT</div>
              </div>
              <button disabled className="px-5 py-2.5 rounded-xl font-bold text-navy/40 bg-navy/5 transition-colors text-sm border border-navy/5 cursor-not-allowed">
                Authorize Release (Locked)
              </button>
            </div>
          </div>

          {/* MULTI-VENDOR ALLOCATION & PROTECTED FLOW */}
          <div className="bg-white rounded-3xl border border-navy/10 shadow-sm p-6 md:p-8">
            <h2 className="text-xs font-bold text-navy uppercase tracking-widest mb-6 flex items-center gap-2"><Building2 className="w-4 h-4 text-cobalt" /> Multi-Vendor Payment Allocation</h2>
            
            {/* Visual Flow diagram inside the box */}
            <div className="bg-warm/30 p-6 rounded-2xl border border-navy/5 mb-8 flex flex-col md:flex-row items-center justify-center gap-4 relative overflow-hidden">
               <div className="bg-navy text-white px-4 py-2 rounded-xl text-xs font-bold z-10 shadow-lg shadow-navy/10 text-center">
                 Buyer<br/><span className="text-[9px] text-white/50">Nova Retail</span>
               </div>
               
               <div className="flex flex-col items-center z-10 hidden md:flex">
                 <div className="text-[9px] font-bold text-navy/40 uppercase tracking-widest mb-1">Paid 30%</div>
                 <ArrowRight className="w-5 h-5 text-lime-600" />
               </div>

               <div className="bg-lime/10 border border-lime/30 text-lime-900 px-6 py-4 rounded-xl text-sm font-bold z-10 shadow-sm flex flex-col items-center">
                 <ShieldCheck className="w-6 h-6 text-lime-700 mb-1" />
                 DEV FLOW
                 <div className="text-[10px] uppercase tracking-widest mt-1 opacity-70">Holding ₹2.52L</div>
               </div>

               <div className="flex flex-col justify-center gap-8 relative z-10 w-full md:w-auto mt-4 md:mt-0">
                 {/* Connection lines handled by CSS borders in a real app, simplified for demo */}
                 <div className="flex items-center gap-4 justify-between md:justify-start">
                   <ArrowRight className="w-4 h-4 text-orange-400 rotate-90 md:rotate-0 hidden md:block" />
                   <div className="bg-white border border-navy/10 px-4 py-3 rounded-xl text-xs font-bold w-full md:w-48 shadow-sm">
                     Vendor A: Vertex
                     <div className="text-[10px] text-navy/50 mt-1">Pending Delivery</div>
                   </div>
                 </div>
                 <div className="flex items-center gap-4 justify-between md:justify-start">
                   <ArrowRight className="w-4 h-4 text-orange-400 rotate-90 md:rotate-0 hidden md:block" />
                   <div className="bg-white border border-navy/10 px-4 py-3 rounded-xl text-xs font-bold w-full md:w-48 shadow-sm">
                     Vendor B: NexaByte
                     <div className="text-[10px] text-navy/50 mt-1">Pending Delivery</div>
                   </div>
                 </div>
               </div>
            </div>

            <div className="space-y-4">
              {/* VENDOR A */}
              <div className="border border-navy/10 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-navy/5 transition-colors">
                <div>
                  <h3 className="font-bold text-navy">Vertex Systems</h3>
                  <div className="text-xs font-medium text-navy/60 mt-1">30 Laptops</div>
                </div>
                <div className="text-left md:text-right">
                  <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-1">Total Allocation</div>
                  <div className="font-bold text-navy">₹5,10,000</div>
                </div>
                <div className="w-full md:w-auto">
                  <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-1 text-left md:text-right">Release Status</div>
                  <div className="text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded border border-orange-100 flex items-center gap-1.5 w-max md:ml-auto">
                    <Clock className="w-3.5 h-3.5" /> FULFILMENT PENDING
                  </div>
                </div>
              </div>

              {/* VENDOR B */}
              <div className="border border-navy/10 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-navy/5 transition-colors">
                <div>
                  <h3 className="font-bold text-navy">NexaByte Solutions</h3>
                  <div className="text-xs font-medium text-navy/60 mt-1">20 Laptops</div>
                </div>
                <div className="text-left md:text-right">
                  <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-1">Total Allocation</div>
                  <div className="font-bold text-navy">₹3,30,000</div>
                </div>
                <div className="w-full md:w-auto">
                  <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-1 text-left md:text-right">Release Status</div>
                  <div className="text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded border border-orange-100 flex items-center gap-1.5 w-max md:ml-auto">
                    <Clock className="w-3.5 h-3.5" /> FULFILMENT PENDING
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* EVENT TIMELINE */}
          <div className="bg-white rounded-3xl border border-navy/10 shadow-sm p-6 md:p-8">
            <h2 className="text-xs font-bold text-navy uppercase tracking-widest mb-6">Payment Event Timeline</h2>
            
            <div className="space-y-0 relative ml-2">
              <div className="absolute left-[11px] top-4 bottom-4 w-[2px] bg-navy/10" />
              
              <div className="flex gap-6 py-4 relative z-10">
                <div className="w-6 h-6 rounded-full bg-lime/20 flex items-center justify-center shrink-0 border-[3px] border-white"><Check className="w-3 h-3 text-lime-700" /></div>
                <div>
                  <div className="text-xs font-bold text-navy/40 mb-1">05 Sep 2026, 06:15 PM</div>
                  <div className="text-sm font-bold text-navy">Vendors Notified</div>
                  <div className="text-xs font-medium text-navy/60 mt-0.5">Vertex and NexaByte instructed to begin fulfilment.</div>
                </div>
              </div>

              <div className="flex gap-6 py-4 relative z-10">
                <div className="w-6 h-6 rounded-full bg-lime/20 flex items-center justify-center shrink-0 border-[3px] border-white"><Check className="w-3 h-3 text-lime-700" /></div>
                <div>
                  <div className="text-xs font-bold text-navy/40 mb-1">05 Sep 2026, 06:13 PM</div>
                  <div className="text-sm font-bold text-navy">Transaction Marked Protected</div>
                  <div className="text-xs font-medium text-navy/60 mt-0.5">System recorded safe transition state.</div>
                </div>
              </div>

              <div className="flex gap-6 py-4 relative z-10">
                <div className="w-6 h-6 rounded-full bg-lime/20 flex items-center justify-center shrink-0 border-[3px] border-white"><Check className="w-3 h-3 text-lime-700" /></div>
                <div>
                  <div className="text-xs font-bold text-navy/40 mb-1">05 Sep 2026, 06:13 PM</div>
                  <div className="text-sm font-bold text-navy">Payment Received</div>
                  <div className="text-xs font-medium text-navy/60 mt-0.5">₹2,52,000 • Gateway Ref: TXN-DF-983204</div>
                </div>
              </div>

              <div className="flex gap-6 py-4 relative z-10">
                <div className="w-6 h-6 rounded-full bg-lime/20 flex items-center justify-center shrink-0 border-[3px] border-white"><Check className="w-3 h-3 text-lime-700" /></div>
                <div>
                  <div className="text-xs font-bold text-navy/40 mb-1">05 Sep 2026, 06:12 PM</div>
                  <div className="text-sm font-bold text-navy">Payment Initiated</div>
                  <div className="text-xs font-medium text-navy/60 mt-0.5">Customer started checkout process.</div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN - OPERATIONAL CONTROLS */}
        <div className="w-full lg:w-[35%]">
          <div className="sticky top-28 space-y-6">
            
            <div className="bg-white rounded-3xl border border-navy/10 shadow-sm p-6">
              <h3 className="text-xs font-bold text-navy uppercase tracking-widest mb-4">Operational Status</h3>
              <ul className="text-sm font-medium text-navy/70 space-y-3 mb-6">
                <li className="flex justify-between border-b border-navy/5 pb-2"><span>Milestone 1</span><span className="font-bold text-lime-700">Paid</span></li>
                <li className="flex justify-between border-b border-navy/5 pb-2"><span>Milestone 2</span><span className="font-bold text-orange-600">Pending Delivery</span></li>
                <li className="flex justify-between pb-2"><span>Settlement</span><span className="font-bold text-orange-600">Locked</span></li>
              </ul>
              
              <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl text-xs font-medium text-orange-800 leading-relaxed">
                <div className="font-bold text-orange-900 mb-1 flex items-center gap-1.5"><AlertTriangle className="w-4 h-4" /> System Enforced Rule</div>
                Settlement release will automatically become eligible once the buyer successfully confirms delivery evidence. Manual override requires Administrator role.
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-navy/10 shadow-sm p-6">
              <h3 className="text-xs font-bold text-navy uppercase tracking-widest mb-4">Delivery Evidence</h3>
              <div className="bg-warm/50 border border-navy/5 border-dashed p-8 rounded-xl flex flex-col items-center justify-center text-center">
                <Package className="w-8 h-8 text-navy/20 mb-2" />
                <div className="text-sm font-bold text-navy/50">Awaiting Fulfilment</div>
                <div className="text-xs font-medium text-navy/40 mt-1">Delivery evidence will appear here once fulfilment begins.</div>
              </div>
            </div>

            <button className="w-full py-4 rounded-xl bg-navy/5 text-navy text-sm font-bold hover:bg-navy/10 transition-colors border border-navy/10 flex items-center justify-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Report Transaction Issue
            </button>

          </div>
        </div>

      </div>
    </WorkspaceLayout>
  );
}

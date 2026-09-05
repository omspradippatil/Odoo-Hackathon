"use client";

import React, { useState, use } from "react";
import { useRouter } from "next/navigation";
import { WorkspaceLayout } from "@/components/layout/WorkspaceLayout";
import { UserRole } from "@/types/auth";
import { Check, ShieldCheck, Activity, ArrowRight, MessageSquare, TrendingDown, Clock, Eye, Send, Lock } from "lucide-react";
import * as motion from "framer-motion/client";
import { cn } from "@/lib/utils";

const formatCurrency = (val: number) => `₹${val.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

export default function InternalNegotiationPage({ params }: { params: Promise<{ quotationId: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();

  // Internal simulated state (starts in "Counter-offer received" state)
  const [reapprovalRequested, setReapprovalRequested] = useState(false);

  return (
    <WorkspaceLayout role={UserRole.SALES_REP}>
      
      {/* JOURNEY HEADER */}
      <div className="mb-8 md:mb-12">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-[10px] font-bold text-navy/40 uppercase tracking-widest">
            <span className="text-navy">Deals</span> <span className="text-navy/20">/</span> <span>{resolvedParams.quotationId}</span> <span className="text-navy/20">/</span> <span className="text-navy">Negotiation</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 border border-orange-200">
              <Activity className="w-3 h-3" /> NEGOTIATING
            </div>
            <div className="bg-navy/5 text-navy px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
              V2
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-navy tracking-tight mb-2">Customer Negotiation</h1>
            <div className="text-sm font-medium text-navy/60 flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-navy/40" /> Internal Workspace <span className="text-navy/20">•</span> Customer: <strong className="text-navy">Nova Retail</strong>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button className="px-5 py-2.5 rounded-xl font-bold text-navy bg-white border border-navy/10 shadow-sm hover:bg-navy/5 transition-colors flex items-center gap-2 text-sm">
              <Eye className="w-4 h-4" /> Preview Customer View
            </button>
          </div>
        </div>

        {/* SIGNATURE MOTION LINE */}
        <div className="w-full bg-white p-4 rounded-2xl border border-navy/5 shadow-sm overflow-x-auto no-scrollbar">
          <div className="flex items-center min-w-[750px] justify-between relative px-4">
            <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-[2px] bg-navy/5 -z-10" />
            
            {/* The line to REAPPROVAL animates if reapproval is requested */}
            {reapprovalRequested && (
              <motion.div 
                className="absolute left-[50%] top-1/2 -translate-y-1/2 h-[2px] bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.6)]"
                initial={{ width: 0 }}
                animate={{ width: "12%" }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
            )}

            {[
              { id: 'REQUEST', label: 'REQUEST', state: 'done' },
              { id: 'DISCOVER', label: 'DISCOVER', state: 'done' },
              { id: 'QUOTE', label: 'QUOTE', state: 'done' },
              { id: 'APPROVE', label: 'APPROVE', state: 'done' },
              { id: 'NEGOTIATE', label: 'NEGOTIATE', state: reapprovalRequested ? 'done' : 'active' },
              { id: 'REAPPROVAL', label: 'REAPPROVAL', state: reapprovalRequested ? 'active' : 'idle' },
              { id: 'PROTECT', label: 'PROTECT', state: 'idle' },
              { id: 'FULFIL', label: 'FULFIL', state: 'idle' },
            ].map((stage) => (
              <div key={stage.id} className={cn("flex flex-col items-center gap-2 px-2 z-10 relative bg-white")}>
                <div className={cn("w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all", 
                  stage.state === 'done' && stage.id === 'NEGOTIATE' ? "border-orange-500 bg-orange-500" :
                  stage.state === 'done' ? "border-lime bg-lime" :
                  stage.state === 'active' && stage.id === 'REAPPROVAL' ? "border-orange-500 bg-white shadow-[0_0_10px_rgba(249,115,22,0.4)]" :
                  stage.state === 'active' ? "border-cobalt bg-white shadow-[0_0_10px_rgba(83,103,255,0.4)]" : 
                  "border-navy/10 bg-white")}>
                  {stage.state === 'done' && stage.id !== 'NEGOTIATE' && <Check className="w-2.5 h-2.5 text-lime-950" />}
                  {stage.state === 'done' && stage.id === 'NEGOTIATE' && <Check className="w-2.5 h-2.5 text-white" />}
                  {stage.state === 'active' && stage.id === 'REAPPROVAL' && <motion.div layoutId="flow-dot" className="w-1.5 h-1.5 bg-orange-500 rounded-full" />}
                  {stage.state === 'active' && stage.id !== 'REAPPROVAL' && <motion.div layoutId="flow-dot" className="w-1.5 h-1.5 bg-cobalt rounded-full" />}
                </div>
                <span className={cn("text-[9px] font-bold uppercase tracking-widest", 
                  stage.state === 'active' && stage.id === 'REAPPROVAL' ? "text-orange-600" : 
                  stage.state === 'active' ? "text-cobalt" : 
                  stage.state === 'done' && stage.id === 'NEGOTIATE' ? "text-orange-600" :
                  stage.state === 'done' ? "text-lime-700" : 
                  "text-navy/30")}>
                  {stage.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start relative">
        
        {/* LEFT COLUMN - WORKSPACE */}
        <div className="w-full lg:w-[65%] space-y-8 pb-32 lg:pb-0">
          
          {/* CUSTOMER COUNTER-OFFER CARD */}
          <div className="bg-orange-50 rounded-3xl border border-orange-200 shadow-sm overflow-hidden">
            <div className="bg-orange-500 text-white p-4 flex justify-between items-center text-xs font-bold uppercase tracking-widest">
              <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> Customer Counter-Offer Received</span>
              <span>8 mins ago</span>
            </div>
            
            <div className="p-6 md:p-8">
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white/50 border border-orange-100 p-4 rounded-xl text-center">
                  <div className="text-[10px] font-bold text-orange-600/70 uppercase tracking-widest mb-1">Previous Approved</div>
                  <div className="text-xl font-bold text-navy">12%</div>
                </div>
                <div className="bg-white border border-orange-200 p-4 rounded-xl text-center shadow-md relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-600 text-white text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full">Requested</div>
                  <div className="text-[10px] font-bold text-orange-600/70 uppercase tracking-widest mb-1 mt-2">New Discount</div>
                  <div className="text-3xl font-bold text-orange-600 flex items-center justify-center gap-2"><TrendingDown className="w-5 h-5" /> 15%</div>
                </div>
                <div className="bg-white/50 border border-orange-100 p-4 rounded-xl text-center flex flex-col justify-center">
                  <div className="text-[10px] font-bold text-orange-600/70 uppercase tracking-widest mb-1">Difference</div>
                  <div className="text-xl font-bold text-coral">+ 3%</div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-orange-100 shadow-sm relative">
                <div className="absolute -top-3 left-6 bg-white border border-orange-100 px-2 text-[10px] font-bold text-navy/40 uppercase tracking-widest flex items-center gap-1.5"><MessageSquare className="w-3 h-3" /> Customer Note</div>
                <p className="text-sm font-medium text-navy/80 italic leading-relaxed pt-2">
                  "If the total price can be reduced slightly, we can confirm the order this week. Otherwise, we may need to review alternative vendors."
                </p>
              </div>
            </div>
          </div>

          {/* INTERNAL COMMERCIAL IMPACT */}
          <div className="bg-white rounded-3xl border border-navy/10 shadow-sm p-6 md:p-8 relative overflow-hidden">
            <h2 className="text-sm font-bold text-navy uppercase tracking-widest mb-6">Internal Commercial Impact</h2>
            
            <div className="flex flex-col md:flex-row relative z-10">
              {/* APPROVED V1 */}
              <div className="flex-1 p-6 bg-navy/5 rounded-2xl flex flex-col justify-center border border-navy/5">
                <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-4">Approved Version V1</div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center"><span className="text-sm font-medium text-navy/60">Deal Value</span><span className="font-bold text-navy">₹8,40,000</span></div>
                  <div className="flex justify-between items-center"><span className="text-sm font-medium text-navy/60">Margin</span><span className="font-bold text-navy">₹1,51,000</span></div>
                  <div className="flex justify-between items-center pt-2 border-t border-navy/10"><span className="text-sm font-medium text-navy/60">Margin Health</span><span className="font-bold text-lime-700 bg-lime/20 px-2 py-0.5 rounded text-[10px] uppercase tracking-widest">Healthy (18%)</span></div>
                </div>
              </div>

              {/* ARROW */}
              <div className="flex items-center justify-center py-4 md:py-0 md:px-4 shrink-0">
                <ArrowRight className="w-6 h-6 text-navy/20 rotate-90 md:rotate-0" />
              </div>

              {/* CUSTOMER REQUEST V2 */}
              <div className="flex-1 p-6 bg-white border border-coral/20 rounded-2xl shadow-md flex flex-col justify-center relative">
                <div className="text-[10px] font-bold text-coral uppercase tracking-widest mb-4">Customer Request V2</div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center"><span className="text-sm font-medium text-navy/60">Deal Value</span><span className="font-bold text-navy">₹8,10,000</span></div>
                  <div className="flex justify-between items-center"><span className="text-sm font-medium text-navy/60">Margin</span><span className="font-bold text-navy">₹1,23,000</span></div>
                  <div className="flex justify-between items-center pt-2 border-t border-navy/5"><span className="text-sm font-medium text-navy/60">Margin Health</span><span className="font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded text-[10px] uppercase tracking-widest">Watch (14%)</span></div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-4 bg-coral/5 p-4 rounded-xl border border-coral/10 z-10 relative">
              <div className="text-[10px] font-bold text-coral uppercase tracking-widest flex items-center gap-2 sm:w-1/4">
                <Activity className="w-4 h-4" /> Change
              </div>
              <div className="flex flex-1 justify-between items-center text-sm">
                <span className="font-medium text-coral/80">Deal Value</span>
                <span className="font-bold text-coral">− ₹30,000</span>
              </div>
              <div className="hidden sm:block w-[1px] h-6 bg-coral/20" />
              <div className="flex flex-1 justify-between items-center text-sm">
                <span className="font-medium text-coral/80">Margin</span>
                <span className="font-bold text-coral">− 4 points</span>
              </div>
            </div>
          </div>

          {/* MESSAGE THREAD */}
          <div className="bg-white rounded-3xl border border-navy/10 shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 bg-navy/5 border-b border-navy/5 flex justify-between items-center">
              <h2 className="text-xs font-bold text-navy uppercase tracking-widest flex items-center gap-2"><MessageSquare className="w-4 h-4 text-cobalt" /> Negotiation Thread</h2>
            </div>
            
            <div className="p-6 space-y-6 bg-warm/20">
              <div className="flex flex-col gap-1 items-start">
                <div className="bg-white p-4 rounded-2xl rounded-tl-sm shadow-sm border border-navy/5 max-w-[80%] text-sm font-medium text-navy/80">
                  Could you reduce the quotation slightly? We are ready to proceed if the revised offer is approved.
                </div>
                <div className="text-[9px] font-bold text-navy/40 uppercase tracking-widest ml-1">Customer • 5:14 PM</div>
              </div>
            </div>
            
            <div className="p-4 bg-white border-t border-navy/5 flex gap-3">
              <input type="text" placeholder="Type a message to the customer..." className="flex-1 h-12 px-4 rounded-xl bg-warm/50 border border-navy/10 focus:outline-none focus:border-cobalt text-sm font-medium" />
              <button className="h-12 w-12 rounded-xl bg-cobalt text-white flex items-center justify-center hover:bg-cobalt/90 transition-colors shadow-sm shrink-0"><Send className="w-5 h-5" /></button>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN - ACTIONS & VERSION HISTORY */}
        <div className="hidden lg:block w-[35%]">
          <div className="sticky top-28 space-y-6">
            
            {/* APPROVAL DETECTION */}
            <div className="bg-white rounded-3xl border border-orange-200 shadow-xl shadow-orange-500/10 overflow-hidden">
              <div className="bg-orange-500 text-white p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl pointer-events-none" />
                <h2 className="text-xs font-bold uppercase tracking-widest text-white/70 mb-4 flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Reapproval Required</h2>
                <div className="text-lg font-bold leading-tight mb-2 relative z-10">
                  Current terms exceed approved commercial authority.
                </div>
                <div className="text-sm font-medium text-white/80 relative z-10">
                  The requested discount (15%) is greater than the previously approved maximum (12%).
                </div>
              </div>
              <div className="p-6 bg-white space-y-3">
                <button 
                  onClick={() => setReapprovalRequested(true)}
                  disabled={reapprovalRequested}
                  className={cn("w-full py-4 rounded-xl text-white text-sm font-bold shadow-lg transition-colors flex items-center justify-center gap-2", reapprovalRequested ? "bg-lime-600 shadow-lime-600/20" : "bg-orange-500 hover:bg-orange-600 shadow-orange-500/20")}
                >
                  {reapprovalRequested ? <><Check className="w-4 h-4" /> Reapproval Requested</> : <><ShieldCheck className="w-4 h-4" /> Request Reapproval</>}
                </button>
                <div className="grid grid-cols-2 gap-3">
                  <button disabled={reapprovalRequested} className="w-full py-3 rounded-xl bg-navy/5 text-navy text-sm font-bold hover:bg-navy/10 transition-colors disabled:opacity-50">Counter Propose</button>
                  <button disabled={reapprovalRequested} className="w-full py-3 rounded-xl bg-coral/10 text-coral text-sm font-bold hover:bg-coral/20 transition-colors disabled:opacity-50">Decline Change</button>
                </div>
                {reapprovalRequested && (
                  <p className="text-[10px] font-bold text-navy/40 uppercase tracking-widest text-center mt-4">
                    The customer sees "Commercial Review In Progress".
                  </p>
                )}
              </div>
            </div>

            {/* VERSION HISTORY */}
            <div className="bg-white rounded-3xl border border-navy/10 shadow-sm p-6">
              <h3 className="text-xs font-bold text-navy uppercase tracking-widest mb-6">Version History</h3>
              
              <div className="space-y-0 relative ml-2">
                <div className="absolute left-[11px] top-4 bottom-4 w-[2px] bg-navy/10" />
                
                <div className="flex gap-4 py-3 relative z-10">
                  <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center shrink-0 border-[3px] border-white text-[9px] font-bold text-orange-600">V2</div>
                  <div className="pt-0.5">
                    <div className="text-sm font-bold text-navy">Customer Counter-offer</div>
                    <div className="text-xs font-medium text-navy/60 mt-0.5">15% Discount • 5:14 PM</div>
                  </div>
                </div>

                <div className="flex gap-4 py-3 relative z-10">
                  <div className="w-6 h-6 rounded-full bg-lime/20 flex items-center justify-center shrink-0 border-[3px] border-white text-[9px] font-bold text-lime-800">V1</div>
                  <div className="pt-0.5">
                    <div className="text-sm font-bold text-navy">Approved</div>
                    <div className="text-xs font-medium text-navy/60 mt-0.5">12% Discount • 5:02 PM</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* MOBILE STICKY ACTIONS */}
        <div className="lg:hidden fixed bottom-[80px] left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-navy/5 z-40 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
          <button 
            onClick={() => setReapprovalRequested(true)}
            disabled={reapprovalRequested}
            className={cn("w-full py-4 rounded-xl text-white font-bold shadow-lg flex items-center justify-center gap-2", reapprovalRequested ? "bg-lime-600" : "bg-orange-500")}
          >
            {reapprovalRequested ? "Reapproval Requested" : "Request Reapproval"}
          </button>
        </div>

      </div>
    </WorkspaceLayout>
  );
}

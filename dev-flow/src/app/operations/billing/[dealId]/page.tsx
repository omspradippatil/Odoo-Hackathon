"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { WorkspaceLayout } from "@/components/layout/WorkspaceLayout";
import { UserRole } from "@/types/auth";
import { ShieldCheck, Activity, Check, ArrowRight, Package, Truck, AlertCircle, Clock, MapPin, Building2, Search, X, FileText, Calendar, CreditCard, Download, Eye } from "lucide-react";
import * as motion from "framer-motion/client";
import { cn } from "@/lib/utils";

export default function InternalBillingPage({ params }: { params: Promise<{ dealId: string }> }) {
  const router = useRouter();

  return (
    <WorkspaceLayout role={UserRole.FINANCE_OPERATIONS}>
      
      {/* JOURNEY HEADER */}
      <div className="mb-8 md:mb-12">
        <div className="flex items-center gap-2 text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-4">
          <span className="text-navy">Operations</span> <span className="text-navy/20">/</span> <span className="text-navy">Billing</span> <span className="text-navy/20">/</span> <span>DF-2048</span>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-navy tracking-tight mb-2">Billing & Invoices</h1>
            <div className="text-sm font-medium text-navy/60 flex flex-wrap items-center gap-x-2 gap-y-1">
              Customer: <strong className="text-navy">Nova Retail</strong> <span className="text-navy/20">•</span> Quotation: <strong className="text-navy">QT-2048</strong> <span className="text-navy/20">•</span> Fulfilment: <strong className="text-navy">COMPLETED</strong>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="bg-lime/20 text-lime-800 border border-lime/30 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-sm">
              <Check className="w-4 h-4" /> DEAL BILLED
            </div>
          </div>
        </div>

        {/* SIGNATURE MOTION LINE */}
        <div className="w-full bg-white p-4 rounded-2xl border border-navy/5 shadow-sm overflow-x-auto no-scrollbar mb-8">
          <div className="flex items-center min-w-[750px] justify-between relative px-4">
            <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-[2px] bg-navy/5 -z-10" />
            <div className="absolute left-[85%] top-1/2 -translate-y-1/2 h-[2px] bg-lime w-[10%] shadow-[0_0_10px_rgba(101,163,13,0.4)]" />

            {[
              { id: 'REQUEST', label: 'REQUEST', state: 'done' },
              { id: 'DISCOVER', label: 'DISCOVER', state: 'done' },
              { id: 'QUOTE', label: 'QUOTE', state: 'done' },
              { id: 'APPROVE', label: 'APPROVE', state: 'done' },
              { id: 'NEGOTIATE', label: 'NEGOTIATE', state: 'done' },
              { id: 'PROTECT', label: 'PROTECT', state: 'done' },
              { id: 'FULFIL', label: 'FULFIL', state: 'done' },
              { id: 'BILL', label: 'BILL', state: 'done' },
            ].map((stage) => (
              <div key={stage.id} className="flex flex-col items-center gap-2 px-2 z-10 relative bg-white">
                <div className={cn("w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all", 
                  stage.state === 'done' ? "border-lime bg-lime" : "border-navy/10 bg-white")}>
                  {stage.state === 'done' && <Check className="w-2.5 h-2.5 text-lime-950" />}
                </div>
                <span className={cn("text-[9px] font-bold uppercase tracking-widest text-lime-700")}>
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
          
          {/* HYBRID BILLING VISUAL */}
          <div className="bg-navy rounded-3xl border border-navy shadow-sm overflow-hidden text-white">
            <div className="p-6 md:p-8 flex justify-between items-center border-b border-white/10">
              <h2 className="text-xs font-bold uppercase tracking-widest text-white/50">THIS DEAL CONTAINS</h2>
            </div>
            <div className="flex flex-col md:flex-row relative">
              <div className="flex-1 p-6 md:p-10 text-center relative z-10">
                <div className="text-[10px] font-bold text-lime uppercase tracking-widest mb-2 flex items-center justify-center gap-1"><FileText className="w-4 h-4" /> ONE-TIME</div>
                <div className="text-4xl font-bold">₹8.40L</div>
                <div className="text-xs font-medium text-white/50 mt-2">Billed immediately on fulfilment</div>
              </div>
              
              <div className="w-full md:w-[1px] h-[1px] md:h-auto bg-white/10 relative z-10 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-navy border border-white/10 text-white font-bold flex items-center justify-center text-xs absolute">+</div>
              </div>
              
              <div className="flex-1 p-6 md:p-10 text-center relative z-10">
                <div className="text-[10px] font-bold text-cobalt uppercase tracking-widest mb-2 flex items-center justify-center gap-1"><Calendar className="w-4 h-4" /> RECURRING</div>
                <div className="text-4xl font-bold flex items-center justify-center gap-1">₹55K <span className="text-base font-normal text-white/50">/ mo</span></div>
                <div className="text-xs font-medium text-white/50 mt-2">Billed separately via subscription</div>
              </div>
            </div>
          </div>

          <h2 className="text-xl font-bold text-navy px-2 mt-12 mb-4">Invoices & Schedules</h2>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            
            {/* ONE-TIME INVOICE */}
            <div className="bg-white rounded-3xl border border-navy/10 shadow-sm p-6 relative flex flex-col">
              <div className="absolute top-6 right-6">
                <div className="text-[9px] font-bold text-orange-600 bg-orange-50 border border-orange-100 px-2.5 py-1 rounded uppercase tracking-widest">Partially Paid</div>
              </div>
              
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-navy/5 flex items-center justify-center text-navy shrink-0"><FileText className="w-5 h-5" /></div>
                <div>
                  <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest">ONE-TIME INVOICE</div>
                  <div className="font-bold text-navy">INV-2048-01</div>
                </div>
              </div>

              <div className="space-y-4 mb-6 flex-1 text-sm font-medium">
                <div className="flex justify-between items-center text-navy/70">
                  <span>Subtotal</span><span>₹8,40,000</span>
                </div>
                <div className="flex justify-between items-center text-navy/70 border-b border-navy/5 pb-4">
                  <div className="flex flex-col"><span>Total GST</span><span className="text-[10px] text-navy/40">CGST (9%) + SGST (9%)</span></div>
                  <span>₹1,51,200</span>
                </div>
                <div className="flex justify-between items-center font-bold text-navy text-lg">
                  <span>Invoice Total</span><span>₹9,91,200</span>
                </div>
              </div>

              <div className="bg-navy/5 p-4 rounded-xl space-y-2 text-sm font-medium mb-6">
                <div className="flex justify-between text-lime-700"><span>Paid Advance</span><span>₹2,52,000</span></div>
                <div className="flex justify-between font-bold text-orange-600"><span>Outstanding</span><span>₹7,39,200</span></div>
              </div>

              <div className="flex gap-2">
                <button className="flex-[2] py-3 rounded-xl bg-navy/5 text-navy text-xs font-bold hover:bg-navy/10 transition-colors border border-navy/5 flex items-center justify-center gap-2"><Eye className="w-4 h-4" /> View Invoice</button>
                <button className="flex-1 py-3 rounded-xl bg-navy/5 text-navy text-xs font-bold hover:bg-navy/10 transition-colors border border-navy/5 flex items-center justify-center"><Download className="w-4 h-4" /></button>
              </div>
            </div>

            {/* SUBSCRIPTION BILLING */}
            <div className="bg-white rounded-3xl border border-navy/10 shadow-sm p-6 relative flex flex-col">
              <div className="absolute top-6 right-6">
                <div className="text-[9px] font-bold text-cobalt bg-cobalt/10 border border-cobalt/20 px-2.5 py-1 rounded uppercase tracking-widest">Active</div>
              </div>
              
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-cobalt/10 flex items-center justify-center text-cobalt shrink-0"><Calendar className="w-5 h-5" /></div>
                <div>
                  <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest">SUBSCRIPTION BILLING</div>
                  <div className="font-bold text-navy">Microsoft 365 Business</div>
                </div>
              </div>

              <div className="flex items-end gap-2 mb-6 text-navy">
                <div className="text-4xl font-bold">₹55,000</div>
                <div className="text-sm font-medium text-navy/60 pb-1">/ month</div>
              </div>

              <div className="space-y-4 mb-6 flex-1 text-sm font-medium">
                <div className="flex justify-between items-center text-navy/70 border-b border-navy/5 pb-4">
                  <span>Billing Frequency</span><span className="font-bold text-navy">Monthly</span>
                </div>
                <div className="flex justify-between items-center text-navy/70">
                  <span>Start Date</span><span className="font-bold text-navy">01 Oct 2026</span>
                </div>
                <div className="flex justify-between items-center text-navy/70">
                  <span>Next Invoice Date</span><span className="font-bold text-navy">01 Oct 2026</span>
                </div>
              </div>

              <div className="bg-warm/30 border border-navy/5 p-4 rounded-xl text-xs font-medium text-navy/60 italic mt-auto">
                Next invoice will be generated automatically on 01 Oct 2026.
              </div>
            </div>

          </div>

          {/* PAYMENT RECONCILIATION */}
          <div className="bg-white rounded-3xl border border-navy/10 shadow-sm overflow-hidden">
            <div className="p-6 md:p-8 flex justify-between items-center border-b border-navy/5">
              <h2 className="text-xs font-bold text-navy uppercase tracking-widest flex items-center gap-2"><CreditCard className="w-4 h-4 text-lime-600" /> Payment Reconciliation</h2>
            </div>
            
            <div className="p-6">
              <div className="border border-navy/10 rounded-2xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-navy/5">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm"><Check className="w-4 h-4 text-lime-600" /></div>
                  <div>
                    <div className="font-bold text-navy text-sm">₹2,52,000 Received</div>
                    <div className="text-xs font-medium text-navy/60 mt-0.5">Ref: TXN-DF-983204 • 05 Sep</div>
                  </div>
                </div>
                
                <div className="w-full md:w-auto flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-navy/5 shadow-sm text-xs font-bold text-navy/60">
                  <span>Applied to:</span>
                  <span className="text-navy">INV-2048-01</span>
                  <span className="text-lime-700">₹2,52,000</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN - CONTEXT PANEL */}
        <div className="w-full lg:w-[35%]">
          <div className="sticky top-28 space-y-6">
            
            <div className="bg-white rounded-3xl border border-navy/10 shadow-sm p-6">
              <h3 className="text-xs font-bold text-navy uppercase tracking-widest mb-6 flex items-center gap-2"><Activity className="w-4 h-4 text-cobalt" /> Billing Intelligence</h3>
              
              <div className="space-y-4">
                
                <div className="flex justify-between items-center border-b border-navy/5 pb-3">
                  <span className="text-sm font-medium text-navy/60">One-Time Revenue</span>
                  <span className="font-bold text-navy">₹8.40L</span>
                </div>
                <div className="flex justify-between items-center border-b border-navy/5 pb-3 bg-navy/5 -mx-4 px-4 pt-3 rounded-lg mt-1 mb-1">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-navy">DEV FLOW Platform Fee</span>
                    <span className="text-[10px] font-bold text-navy/40 uppercase tracking-widest">3% of Transaction Value</span>
                  </div>
                  <span className="font-bold text-cobalt">₹25,200</span>
                </div>
                <div className="flex justify-between items-center border-b border-navy/5 pb-3 pt-2">
                  <span className="text-sm font-medium text-navy/60">Recurring Revenue</span>
                  <span className="font-bold text-cobalt">₹55K / mo</span>
                </div>

                <div className="flex justify-between items-center border-b border-navy/5 pb-3">
                  <span className="text-sm font-medium text-navy/60">Total Collected</span>
                  <span className="font-bold text-lime-700">₹2.52L</span>
                </div>
                <div className="flex justify-between items-center border-b border-navy/5 pb-3">
                  <span className="text-sm font-medium text-navy/60">Total Outstanding</span>
                  <span className="font-bold text-orange-600">₹7.39L</span>
                </div>
                <div className="flex justify-between items-center pb-2">
                  <span className="text-sm font-medium text-navy/60">Invoice Health</span>
                  <span className="text-[10px] font-bold text-orange-600 bg-orange-50 border border-orange-100 px-2 py-0.5 rounded uppercase tracking-widest">Partially Paid</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-navy/10 shadow-sm p-6">
              <h3 className="text-xs font-bold text-navy uppercase tracking-widest mb-4">Tax Breakdown (GST)</h3>
              
              <div className="bg-warm/30 p-4 rounded-xl text-sm font-medium text-navy/70 space-y-2 mb-4 border border-navy/5">
                <div className="flex justify-between">
                  <span>Taxable Value</span><span className="font-bold text-navy">₹8,40,000</span>
                </div>
                <div className="flex justify-between">
                  <span>CGST (9%)</span><span>₹75,600</span>
                </div>
                <div className="flex justify-between">
                  <span>SGST (9%)</span><span>₹75,600</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-navy/10 font-bold text-navy">
                  <span>Total Tax</span><span>₹1,51,200</span>
                </div>
              </div>
              
              <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest text-center">
                Tax logic derived from Place of Supply (Maharashtra 27).
              </div>
            </div>

          </div>
        </div>

      </div>
    </WorkspaceLayout>
  );
}

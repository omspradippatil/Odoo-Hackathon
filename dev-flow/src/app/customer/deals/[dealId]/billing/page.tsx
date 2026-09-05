"use client";

import React, { useState, use } from "react";
import { useRouter } from "next/navigation";
import { FileText, Download, Eye, Calendar, CreditCard, Check, Clock, ShieldCheck, Activity, ArrowRight, X, Building2 } from "lucide-react";
import * as motion from "framer-motion/client";
import { AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { InvoiceModal } from "@/components/ui/InvoiceModal";

const formatCurrency = (val: number) => `₹${val.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

export default function CustomerBillingPage({ params }: { params: Promise<{ dealId: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();

  const [showInvoicePreview, setShowInvoicePreview] = useState(false);

  return (
    <div className="min-h-screen bg-warm/20 font-sans text-navy flex flex-col">
      
      {/* CUSTOMER HEADER */}
      <header className="bg-navy text-white px-6 py-4 flex flex-col md:flex-row md:items-center justify-between shadow-md gap-4">
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center gap-2 font-bold text-lg tracking-tight">
            <div className="w-6 h-6 rounded-full bg-lime" /> DEV FLOW
          </div>
          <div className="md:hidden text-xs font-bold text-white/60 uppercase tracking-widest">{resolvedParams.dealId}</div>
        </div>
        <div className="hidden md:flex items-center gap-4 text-sm font-medium">
          <span className="text-white/60">Nova Retail Portal</span>
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold">NR</div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-8 lg:py-12">
        
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-2 flex items-center gap-2">
                <span>Deal {resolvedParams.dealId}</span> <span className="text-navy/20">•</span> <span>Billing & Subscriptions</span>
              </div>
              <h1 className="text-3xl font-bold text-navy tracking-tight mb-2">Your Billing Dashboard</h1>
              <div className="text-sm font-medium text-navy/60">Manage your invoices, payments, and active subscriptions.</div>
            </div>
            <div className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2 border shadow-sm bg-lime/20 text-lime-800 border-lime/30">
              <Check className="w-4 h-4" /> DEAL COMPLETE
            </div>
          </div>
        </div>

        {/* SUMMARY STRIP */}
        <div className="bg-white rounded-3xl border border-navy/10 shadow-sm p-4 md:p-6 mb-8 flex flex-col md:flex-row gap-4 divide-y md:divide-y-0 md:divide-x divide-navy/5">
          <div className="flex-1 px-4 pt-4 md:pt-0">
            <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-1 flex items-center gap-1"><FileText className="w-3 h-3" /> One-Time Invoice</div>
            <div className="text-2xl font-bold text-navy">₹9,91,200</div>
          </div>
          <div className="flex-1 px-4 pt-4 md:pt-0">
            <div className="text-[10px] font-bold text-lime-700 uppercase tracking-widest mb-1 flex items-center gap-1"><Check className="w-3 h-3" /> Paid Advance</div>
            <div className="text-2xl font-bold text-lime-700">₹2,52,000</div>
          </div>
          <div className="flex-1 px-4 pt-4 md:pt-0 bg-orange-50/50 rounded-xl md:rounded-none">
            <div className="text-[10px] font-bold text-orange-600 uppercase tracking-widest mb-1 flex items-center gap-1"><Clock className="w-3 h-3" /> Outstanding</div>
            <div className="text-2xl font-bold text-orange-600">₹7,39,200</div>
            <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mt-1">Due: 16 Sep</div>
          </div>
          <div className="flex-1 px-4 pt-4 md:pt-0">
            <div className="text-[10px] font-bold text-cobalt uppercase tracking-widest mb-1 flex items-center gap-1"><Calendar className="w-3 h-3" /> Recurring</div>
            <div className="text-lg font-bold text-navy">₹55,000 <span className="text-sm font-medium text-navy/60">/ mo</span></div>
            <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mt-1">Next: 01 Oct</div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start relative">
          
          <div className="w-full lg:w-[65%] space-y-6">
            
            {/* INVOICE CARD */}
            <div className="bg-white rounded-3xl border border-navy/10 shadow-sm overflow-hidden">
              <div className="bg-navy/5 px-6 py-4 border-b border-navy/5 flex items-center justify-between">
                <div>
                  <h2 className="text-xs font-bold text-navy uppercase tracking-widest">Invoices</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="border border-navy/10 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 hover:border-navy/20 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-navy/5 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-navy/40" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="font-bold text-navy">INV-2048-01</div>
                        <div className="text-[9px] font-bold text-orange-600 bg-orange-50 border border-orange-100 px-2 py-0.5 rounded uppercase tracking-widest">Partially Paid</div>
                      </div>
                      <div className="text-xs font-medium text-navy/60 mb-1">Issued: 09 Sep • Due: 16 Sep</div>
                      <div className="text-sm font-bold text-navy">₹9,91,200 <span className="text-xs font-medium text-navy/50 font-normal ml-1">(incl. GST)</span></div>
                    </div>
                  </div>
                  <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-3">
                    <div className="flex w-full gap-2">
                      <button onClick={() => setShowInvoicePreview(true)} className="flex-1 sm:flex-none py-2.5 px-4 rounded-xl bg-navy/5 text-navy text-xs font-bold hover:bg-navy/10 transition-colors flex items-center justify-center gap-2 border border-navy/5">
                        <Eye className="w-3.5 h-3.5" /> View
                      </button>
                      <button onClick={() => setShowInvoicePreview(true)} className="flex-1 sm:flex-none py-2.5 px-4 rounded-xl bg-navy/5 text-navy text-xs font-bold hover:bg-navy/10 transition-colors flex items-center justify-center gap-2 border border-navy/5"><Download className="w-3.5 h-3.5" /> PDF</button>
                    </div>
                    <button className="w-full sm:w-auto py-2.5 px-6 rounded-xl bg-navy text-white text-xs font-bold hover:bg-navy/90 shadow-lg shadow-navy/20 transition-colors flex items-center justify-center gap-2">
                      Pay ₹7.39L <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* SUBSCRIPTION CARD */}
            <div className="bg-white rounded-3xl border border-navy/10 shadow-sm overflow-hidden">
              <div className="bg-cobalt/5 px-6 py-4 border-b border-navy/5 flex items-center justify-between">
                <div>
                  <h2 className="text-xs font-bold text-navy uppercase tracking-widest flex items-center gap-2"><Calendar className="w-4 h-4 text-cobalt" /> Subscriptions</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="border border-navy/10 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:border-navy/20 transition-colors">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="font-bold text-navy">Microsoft 365 Business</div>
                      <div className="text-[9px] font-bold text-cobalt bg-cobalt/10 border border-cobalt/20 px-2 py-0.5 rounded uppercase tracking-widest">Active</div>
                    </div>
                    <div className="text-xs font-medium text-navy/60 mb-2">50 Users • Subscription SUB-1024</div>
                    <div className="text-sm font-bold text-navy flex items-center gap-1.5">
                      ₹55,000 <span className="text-xs font-medium text-navy/50 font-normal">/ month</span>
                    </div>
                  </div>
                  <div className="bg-warm/50 border border-navy/5 rounded-xl p-4 w-full md:w-auto text-sm font-medium text-navy/70">
                    <div className="flex justify-between md:justify-start md:gap-8 mb-2">
                      <span className="text-navy/50">Starts</span>
                      <span className="font-bold text-navy">01 Oct 2026</span>
                    </div>
                    <div className="flex justify-between md:justify-start md:gap-8">
                      <span className="text-navy/50">Next Billing</span>
                      <span className="font-bold text-navy">01 Oct 2026</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-[10px] font-bold text-navy/40 uppercase tracking-widest text-center">
                  Automatic renewal according to contract. Invoices generated on billing dates.
                </div>
              </div>
            </div>

          </div>

          <div className="w-full lg:w-[35%]">
            <div className="sticky top-28 space-y-6">
              
              <div className="bg-white rounded-3xl border border-navy/10 shadow-sm p-6">
                <h3 className="text-xs font-bold text-navy uppercase tracking-widest mb-6">Billing Activity</h3>
                
                <div className="space-y-0 relative ml-2">
                  <div className="absolute left-[11px] top-4 bottom-4 w-[2px] bg-navy/10" />
                  
                  <div className="flex gap-4 py-3 relative z-10">
                    <div className="w-6 h-6 rounded-full bg-cobalt/10 flex items-center justify-center shrink-0 border-[3px] border-white"><Calendar className="w-3 h-3 text-cobalt" /></div>
                    <div className="pt-0.5">
                      <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest">01 Oct 2026</div>
                      <div className="text-sm font-bold text-navy">Subscription billing starts</div>
                    </div>
                  </div>

                  <div className="flex gap-4 py-3 relative z-10">
                    <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center shrink-0 border-[3px] border-white"><Clock className="w-3 h-3 text-orange-600" /></div>
                    <div className="pt-0.5">
                      <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest">16 Sep 2026</div>
                      <div className="text-sm font-bold text-navy">Balance payment due</div>
                    </div>
                  </div>

                  <div className="flex gap-4 py-3 relative z-10">
                    <div className="w-6 h-6 rounded-full bg-lime/20 flex items-center justify-center shrink-0 border-[3px] border-white"><Check className="w-3 h-3 text-lime-700" /></div>
                    <div className="pt-0.5">
                      <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest">09 Sep 2026</div>
                      <div className="text-sm font-bold text-navy">Advance payment reconciled</div>
                      <div className="text-xs font-medium text-navy/60 mt-0.5">₹2,52,000 applied to INV-2048-01</div>
                    </div>
                  </div>

                  <div className="flex gap-4 py-3 relative z-10">
                    <div className="w-6 h-6 rounded-full bg-navy/5 flex items-center justify-center shrink-0 border-[3px] border-white"><FileText className="w-3 h-3 text-navy/40" /></div>
                    <div className="pt-0.5">
                      <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest">09 Sep 2026</div>
                      <div className="text-sm font-bold text-navy">Invoice generated</div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>

      <InvoiceModal isOpen={showInvoicePreview} onClose={() => setShowInvoicePreview(false)} />
      

    </div>
  );
}

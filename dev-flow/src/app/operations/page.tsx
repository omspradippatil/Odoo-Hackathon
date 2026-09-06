"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { WorkspaceLayout } from "@/components/layout/WorkspaceLayout";
import { UserRole } from "@/types/auth";
import { ArrowRight, AlertCircle, Calculator, FileText, Truck, Box } from "lucide-react";
import * as motion from "framer-motion/client";

export default function OperationsHome() {
  const router = useRouter();

  return (
    <WorkspaceLayout role={UserRole.FINANCE_OPERATIONS}>
      <div className="space-y-6 md:space-y-8">
        
        {/* HERO */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-navy tracking-tight mb-2">Operations Overview</h1>
            <p className="text-navy/60 font-medium text-lg">Keep every approved deal moving.</p>
          </div>
        </div>

        {/* 4 OPERATIONAL AREAS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
          {[
            { label: "PAYMENTS", icon: Calculator, value: "3", sub: "awaiting confirmation", color: "text-cobalt", bg: "bg-cobalt/10", route: "/operations" },
            { label: "BILLING", icon: FileText, value: "5", sub: "invoices ready", color: "text-navy", bg: "bg-navy/10", route: "/operations" },
            { label: "FULFILMENT", icon: Truck, value: "4", sub: "active orders", color: "text-lime", bg: "bg-lime/20", route: "/operations/fulfilment/DF-2048" },
            { label: "WAREHOUSE", icon: Box, value: "2", sub: "stock allocation issues", color: "text-orange-500", bg: "bg-orange-500/10", route: "/operations/fulfilment/DF-2048" },
          ].map((area, i) => {
            const Icon = area.icon;
            return (
              <motion.div key={area.label} onClick={() => router.push(area.route)} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white rounded-3xl p-6 border border-navy/5 shadow-sm hover:shadow-lg transition-all group cursor-pointer flex flex-col justify-between">
                <div className="flex items-center justify-between mb-8">
                  <div className={`w-10 h-10 rounded-xl ${area.bg} ${area.color} flex items-center justify-center`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest">{area.label}</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-navy mb-1 group-hover:text-cobalt transition-colors">{area.value}</div>
                  <div className="text-xs font-bold text-navy/60 uppercase tracking-widest">{area.sub}</div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 pt-4">
          
          {/* EXCEPTIONS CENTER */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2 px-2">
              <AlertCircle className="w-4 h-4 text-orange-500" />
              <h2 className="text-xs font-bold text-orange-500 uppercase tracking-widest">Requires Attention</h2>
            </div>
            
            <div className="space-y-4">
              <div className="bg-white p-6 md:p-8 rounded-3xl border-l-4 border-orange-500 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-navy mb-1">Order DF-2048</h3>
                    <div className="text-sm font-bold text-navy/60">50 Business Laptops</div>
                  </div>
                  <div className="bg-orange-500/10 text-orange-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Allocation Issue</div>
                </div>

                <div className="flex flex-wrap gap-6 mb-6 p-4 bg-navy/5 rounded-xl">
                  <div><span className="text-[10px] font-bold text-navy/40 uppercase tracking-widest block mb-1">Warehouse Mumbai</span><span className="text-sm font-bold text-navy">30 available</span></div>
                  <div><span className="text-[10px] font-bold text-navy/40 uppercase tracking-widest block mb-1">Warehouse Pune</span><span className="text-sm font-bold text-navy">20 available</span></div>
                </div>

                <div className="mb-6">
                  <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-1">Aakalan360 Recommendation:</div>
                  <div className="text-sm font-bold text-navy">Split fulfilment (Mumbai 30 + Pune 20)</div>
                </div>

                <div className="flex justify-end pt-4 border-t border-navy/5">
                  <button onClick={() => router.push('/operations/fulfilment/DF-2048')} className="flex items-center gap-2 text-sm font-bold text-cobalt hover:text-navy transition-colors">Review Allocation <ArrowRight className="w-4 h-4" /></button>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div onClick={() => router.push('/operations/payments/DF-1990')} className="bg-white p-5 rounded-2xl border border-navy/5 shadow-sm hover:border-navy/20 cursor-pointer transition-colors group">
                  <div className="font-bold text-sm text-navy mb-1 group-hover:text-cobalt">Payment verification pending</div>
                  <div className="text-xs font-medium text-navy/60">Order DF-1990</div>
                </div>
                <div onClick={() => router.push('/operations/billing/DF-1985')} className="bg-white p-5 rounded-2xl border border-navy/5 shadow-sm hover:border-navy/20 cursor-pointer transition-colors group">
                  <div className="font-bold text-sm text-navy mb-1 group-hover:text-cobalt">Invoice generation waiting</div>
                  <div className="text-xs font-medium text-navy/60">Order DF-1985 completed delivery</div>
                </div>
              </div>
            </div>
          </div>

          {/* UPCOMING BILLING */}
          <div className="space-y-6">
            <div className="bg-navy rounded-3xl p-6 md:p-8 text-white shadow-2xl shadow-navy/20 relative overflow-hidden">
              <h3 className="text-xs font-bold text-white/50 mb-6 uppercase tracking-widest">Upcoming Billing Preview</h3>
              
              <div className="mb-8">
                <h4 className="text-lg font-bold text-white mb-6">Enterprise Software Package</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-white/10 pb-4">
                    <span className="text-sm font-medium text-white/60">One-time fee</span>
                    <span className="text-base font-bold text-white">₹2,40,000</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-white/60">Subscription</span>
                    <span className="text-base font-bold text-white">₹24,000 / month</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 text-center py-2 rounded-lg mb-8">
                <span className="text-[10px] font-bold uppercase tracking-widest text-lime">Billing Type: Hybrid</span>
              </div>

              <button 
                onClick={() => router.push('/operations/billing/DF-2048')}
                className="w-full py-3 bg-cobalt hover:bg-cobalt/90 transition-colors rounded-xl text-sm font-bold flex items-center justify-center gap-2"
              >
                Review Billing <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </WorkspaceLayout>
  );
}

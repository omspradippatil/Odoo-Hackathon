"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { WorkspaceLayout } from "@/components/layout/WorkspaceLayout";
import { UserRole } from "@/types/auth";
import { DealCard } from "@/components/ui/dashboard/DealCard";
import { DealStage } from "@/types/dashboard";
import { AlertCircle, Activity, ArrowRight } from "lucide-react";
import * as motion from "framer-motion/client";

export default function SalesHome() {
  const router = useRouter();

  return (
    <WorkspaceLayout role={UserRole.SALES_REP}>
      <div className="space-y-6 md:space-y-8">
        
        {/* HERO */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-navy tracking-tight mb-2">Good evening, Aditi.</h1>
            <p className="text-navy/60 font-medium text-lg">Let's move your deals forward.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button 
              onClick={() => router.push('/buyer/requirements/new')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white border border-navy/10 text-navy font-bold hover:bg-navy/5 transition-colors shadow-sm whitespace-nowrap"
            >
              Create Requirement
            </button>
            <button 
              onClick={() => router.push('/buyer/requirements/REQ-2048/quotation')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-navy text-white font-bold hover:bg-navy/90 transition-colors shadow-lg shadow-navy/20 whitespace-nowrap"
            >
              + Create Quotation
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 pt-4">
          
          {/* ACTIVE DEALS */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-lg font-bold text-navy">My Active Deals</h2>
            </div>
            
            <div className="space-y-4">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <DealCard 
                  onClick={() => router.push('/approvals/QT-2048')}
                  deal={{
                    id: "DF-1054",
                    title: "Nova Retail Expansion",
                    customer: "Nova Retail",
                    amount: 840000,
                    stage: DealStage.APPROVAL_REQUIRED,
                    statusLabel: "AWAITING APPROVAL",
                    health: 'NEEDS_ATTENTION',
                    updatedAt: new Date().toISOString(),
                    insight: "Reason: Discount exceeds standard threshold. (14%)",
                    nextAction: "Open Workspace"
                  }} 
                  showVendor={false} 
                />
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <DealCard 
                  onClick={() => router.push('/negotiation/QT-2048')}
                  deal={{
                    id: "DF-1049",
                    title: "TechCore Upgrade",
                    customer: "TechCore",
                    amount: 1200000,
                    stage: DealStage.NEGOTIATING,
                    statusLabel: "NEGOTIATION",
                    health: 'NEEDS_ATTENTION',
                    updatedAt: new Date().toISOString(),
                    insight: "Customer requested revised pricing.",
                    nextAction: "Open Workspace"
                  }} 
                  showVendor={false} 
                />
              </motion.div>
            </div>
          </div>

          {/* ACTION CENTER & INTELLIGENCE */}
          <div className="space-y-6">
            
            <div className="bg-white rounded-3xl p-6 border border-navy/5 shadow-xl shadow-navy/5">
              <h3 className="text-sm font-bold text-navy mb-4 flex items-center gap-2 uppercase tracking-widest">
                <AlertCircle className="w-4 h-4 text-orange-500" /> Needs Your Attention
              </h3>
              <div className="space-y-3">
                <div onClick={() => router.push('/sales')} className="p-3 bg-navy/5 rounded-xl hover:bg-navy/10 cursor-pointer transition-colors">
                  <div className="font-bold text-sm text-navy mb-1">2 quotations waiting for revision</div>
                  <div className="text-xs font-medium text-navy/60">Updated 1h ago</div>
                </div>
                <div onClick={() => router.push('/negotiation/QT-2048')} className="p-3 bg-navy/5 rounded-xl hover:bg-navy/10 cursor-pointer transition-colors">
                  <div className="font-bold text-sm text-navy mb-1">1 customer counter-offer received</div>
                  <div className="text-xs font-medium text-navy/60">DF-1049 - TechCore</div>
                </div>
                <div onClick={() => router.push('/operations/fulfilment/DF-2048')} className="p-3 bg-navy/5 rounded-xl hover:bg-navy/10 cursor-pointer transition-colors">
                  <div className="font-bold text-sm text-navy mb-1">3 deals missing delivery allocation</div>
                  <div className="text-xs font-medium text-navy/60">Action required before fulfilment</div>
                </div>
              </div>
            </div>

            <div className="bg-navy rounded-3xl p-6 text-white shadow-2xl shadow-navy/20 relative overflow-hidden">
              <div className="flex items-center gap-2 mb-6">
                <Activity className="w-4 h-4 text-lime" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-lime">AAKALAN360 DEAL INTELLIGENCE</span>
              </div>
              
              <div className="text-sm font-bold text-white mb-4">For Nova Retail:</div>
              <div className="space-y-3 mb-6 bg-white/5 p-4 rounded-xl text-sm font-medium">
                <div className="flex justify-between"><span className="text-white/60">Margin:</span> <span className="text-lime">Healthy</span></div>
                <div className="flex justify-between"><span className="text-white/60">Customer urgency:</span> <span className="text-coral">High</span></div>
                <div className="flex justify-between"><span className="text-white/60">Vendor availability:</span> <span className="text-orange-400">Partial</span></div>
                <div className="flex justify-between"><span className="text-white/60">Approval:</span> <span>Required</span></div>
              </div>
              
              <div className="text-xs font-bold text-white/60 uppercase tracking-widest mb-1">Suggested action:</div>
              <p className="text-sm font-medium text-white mb-6">Split fulfilment between two trusted vendors to meet urgent deadline.</p>
              
              <button 
                onClick={() => router.push('/operations/fulfilment/DF-2048')}
                className="w-full py-3 bg-white/10 hover:bg-white/20 transition-colors rounded-xl text-sm font-bold flex items-center justify-center gap-2"
              >
                View Deal <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      </div>
    </WorkspaceLayout>
  );
}

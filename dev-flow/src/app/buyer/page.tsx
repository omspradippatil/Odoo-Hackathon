"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { WorkspaceLayout } from "@/components/layout/WorkspaceLayout";
import { UserRole } from "@/types/auth";
import { DealCard } from "@/components/ui/dashboard/DealCard";
import { DealStage } from "@/types/dashboard";
import { ArrowRight, Activity, MapPin, Search } from "lucide-react";
import * as motion from "framer-motion/client";

export default function BuyerHome() {
  const router = useRouter();

  return (
    <WorkspaceLayout role={UserRole.BUYER}>
      <div className="space-y-6 md:space-y-8">
        
        {/* HERO */}
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-navy tracking-tight mb-2">Good evening, Kadambari.</h1>
          <p className="text-navy/60 font-medium text-lg">What are you looking to source today?</p>
        </div>

        {/* SEARCH & CTAS */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-full sm:flex-1 lg:max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navy/40" />
            <input type="text" placeholder="Search products, suppliers or categories..." className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white border border-navy/10 focus:outline-none focus:border-cobalt focus:ring-4 focus:ring-cobalt/10 transition-all text-base font-medium shadow-sm" />
          </div>
          <button 
            onClick={() => router.push('/buyer/requirements/new')}
            className="w-full sm:w-auto h-14 px-8 rounded-2xl bg-navy text-white font-bold hover:bg-navy/90 transition-colors shadow-lg shadow-navy/20 whitespace-nowrap"
          >
            + Create Requirement
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 pt-4">
          
          {/* ACTIVE DEALS */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-lg font-bold text-navy">Active Deals</h2>
              <button onClick={() => router.push('/buyer')} className="text-xs font-bold text-cobalt hover:text-navy uppercase tracking-widest transition-colors">View All</button>
            </div>
            
            <div className="space-y-4">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <DealCard 
                  onClick={() => router.push('/buyer/requirements/REQ-2048')}
                  deal={{
                    id: "REQ-2048",
                    title: "50 Business Laptops (Mumbai)",
                    amount: 482000,
                    stage: DealStage.COMPARING,
                    statusLabel: "COMPARING",
                    health: 'HEALTHY',
                    updatedAt: new Date().toISOString(),
                    insight: "12 vendors found • 3 quotations received"
                  }} 
                  showCustomer={false} 
                />
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <DealCard 
                  onClick={() => router.push('/buyer/requirements/new')}
                  deal={{
                    id: "REQ-095",
                    title: "Office Furniture",
                    amount: 150000,
                    stage: DealStage.SOURCING,
                    statusLabel: "WAITING FOR QUOTES",
                    health: 'NEEDS_ATTENTION',
                    updatedAt: new Date().toISOString(),
                    insight: "Awaiting 2 vendor quotations"
                  }} 
                  showCustomer={false} 
                  showVendor={false} 
                />
              </motion.div>
            </div>
          </div>

          {/* INSIGHTS & LOCAL */}
          <div className="space-y-6">
            <div className="bg-navy rounded-3xl p-6 text-white shadow-2xl shadow-navy/20 relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-coral/20 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-4 h-4 text-coral" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-coral">AAKALAN360 INSIGHT</span>
              </div>
              <p className="text-sm font-medium text-white/80 leading-relaxed mb-6">
                A vendor offering ₹18,000 less currently has lower delivery reliability. Best overall vendor remains <strong className="text-white">Vertex Systems</strong>.
              </p>
              <button 
                onClick={() => router.push('/buyer/requirements/REQ-2048/vendors')}
                className="w-full py-3 bg-white/10 hover:bg-white/20 transition-colors rounded-xl text-sm font-bold flex items-center justify-center gap-2"
              >
                Compare Vendors <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-navy/5 shadow-xl shadow-navy/5">
              <h3 className="text-sm font-bold text-navy mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cobalt" /> Nearby trusted sellers
              </h3>
              <div className="space-y-3 mb-6">
                <div onClick={() => router.push('/vendors/techsquare/trust')} className="flex items-center justify-between p-3 rounded-xl hover:bg-navy/5 cursor-pointer transition-colors">
                  <div>
                    <div className="font-bold text-sm text-navy mb-1">TechSquare</div>
                    <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest">1.8 km away</div>
                  </div>
                  <div className="text-[10px] font-bold text-gold uppercase tracking-widest bg-gold/10 px-2 py-1 rounded">GOLD</div>
                </div>
                <div onClick={() => router.push('/vendors/bytemart/trust')} className="flex items-center justify-between p-3 rounded-xl hover:bg-navy/5 cursor-pointer transition-colors">
                  <div>
                    <div className="font-bold text-sm text-navy mb-1">ByteMart</div>
                    <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest">2.4 km away</div>
                  </div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-1 rounded">SILVER</div>
                </div>
              </div>
              <button 
                onClick={() => router.push('/buyer')}
                className="w-full text-xs font-bold text-cobalt uppercase tracking-widest hover:text-navy transition-colors"
              >
                Explore Local →
              </button>
            </div>
          </div>

        </div>
      </div>
    </WorkspaceLayout>
  );
}

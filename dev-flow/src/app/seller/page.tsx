"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { WorkspaceLayout } from "@/components/layout/WorkspaceLayout";
import { UserRole } from "@/types/auth";
import { ShieldCheck, ArrowRight, TrendingUp } from "lucide-react";
import * as motion from "framer-motion/client";

export default function SellerHome() {
  const router = useRouter();

  return (
    <WorkspaceLayout role={UserRole.SELLER}>
      <div className="space-y-6 md:space-y-8">
        
        {/* HERO */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-navy tracking-tight mb-2">Welcome back, Vertex Systems.</h1>
            <p className="text-navy/60 font-medium text-lg">You have opportunities waiting.</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => router.push('/seller/products/new')}
              className="px-6 py-3.5 rounded-xl bg-white border border-navy/10 text-navy font-bold hover:bg-navy/5 transition-colors shadow-sm"
            >
              Add New Product
            </button>
            <button 
              onClick={() => router.push('/seller/opportunities')}
              className="px-6 py-3.5 rounded-xl bg-navy text-white font-bold hover:bg-navy/90 transition-colors shadow-lg shadow-navy/20"
            >
              View Opportunities
            </button>
          </div>
        </div>

        {/* PERFORMANCE GRID */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Open Opportunities", value: "12", color: "text-cobalt" },
            { label: "Quotes Submitted", value: "8", color: "text-navy" },
            { label: "Deals Won", value: "4", color: "text-lime" },
            { label: "Pending Fulfilment", value: "2", color: "text-orange-500" },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white p-5 rounded-2xl border border-navy/5 shadow-sm">
              <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-2">{stat.label}</div>
              <div className={`text-2xl md:text-3xl font-bold ${stat.color}`}>{stat.value}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 pt-4">
          
          {/* OPPORTUNITIES */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-lg font-bold text-navy">New Opportunities</h2>
            </div>
            
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-2xl border border-navy/5 shadow-sm hover:shadow-md transition-shadow group">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-navy mb-1 group-hover:text-cobalt transition-colors">50 Business Laptops</h3>
                    <div className="text-xs font-bold text-navy/40 uppercase tracking-widest">Buyer: ABC Enterprises</div>
                  </div>
                  <div className="bg-lime/20 text-lime-800 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Match: High</div>
                </div>
                
                <div className="flex flex-wrap gap-x-6 gap-y-2 mb-6 text-sm font-medium text-navy/60">
                  <div><span className="text-navy/40">Required:</span> <span className="text-navy">50 units</span></div>
                  <div><span className="text-navy/40">Location:</span> <span className="text-navy">Mumbai</span></div>
                  <div><span className="text-navy/40">Deadline:</span> <span className="text-coral">Tomorrow, 4:00 PM</span></div>
                </div>

                <div className="flex justify-end pt-4 border-t border-navy/5">
                  <button onClick={() => router.push('/seller/products/new')} className="flex items-center gap-2 text-sm font-bold text-cobalt hover:text-navy transition-colors">Submit Quote <ArrowRight className="w-4 h-4" /></button>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-navy/5 shadow-sm hover:shadow-md transition-shadow group">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-navy mb-1 group-hover:text-cobalt transition-colors">20 Office Chairs</h3>
                    <div className="text-xs font-bold text-navy/40 uppercase tracking-widest">Buyer: TechCore</div>
                  </div>
                  <div className="bg-navy/10 text-navy px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Match: Medium</div>
                </div>
                <div className="flex justify-end pt-4 border-t border-navy/5">
                  <button onClick={() => router.push('/seller/products/new')} className="flex items-center gap-2 text-sm font-bold text-cobalt hover:text-navy transition-colors">Review Details <ArrowRight className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          </div>

          {/* TRUST PROFILE */}
          <div className="space-y-6">
            <div className="bg-navy rounded-3xl p-8 text-white shadow-2xl shadow-navy/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex items-center gap-2 mb-6">
                <ShieldCheck className="w-5 h-5 text-gold" />
                <span className="text-xs font-bold uppercase tracking-widest text-white/50">Your Trust Profile</span>
              </div>
              
              <div className="flex items-end gap-4 mb-8">
                <div className="text-6xl font-bold tracking-tighter text-white">92</div>
                <div className="pb-1.5 text-gold font-bold uppercase tracking-widest text-sm">GOLD</div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-white/60">Delivery Reliability</span>
                  <span className="text-white font-bold">94</span>
                </div>
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-white/60">Buyer Ratings</span>
                  <span className="text-white font-bold">91</span>
                </div>
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-white/60">Transaction History</span>
                  <span className="text-white font-bold">96</span>
                </div>
              </div>

              <p className="text-xs font-medium text-white/60 leading-relaxed mb-6 bg-white/5 p-4 rounded-xl">
                Your fulfilment reliability places you among high-trust vendors.
              </p>
              
              <button 
                onClick={() => router.push('/vendors/vertex-systems/trust')}
                className="w-full py-3 bg-white/10 hover:bg-white/20 transition-colors rounded-xl text-sm font-bold flex items-center justify-center gap-2"
              >
                View Trust Profile <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </WorkspaceLayout>
  );
}

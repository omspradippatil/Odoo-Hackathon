"use client";

import React from "react";
import { ArrowUpRight, TrendingUp, Clock, AlertCircle, ShieldCheck, FileText } from "lucide-react";
import * as motion from "framer-motion/client";
import { cn } from "@/lib/utils";

const STATS = [
  { label: "Active Deals", value: "12", change: "+2 this week", trend: "up", color: "text-cobalt", bg: "bg-cobalt/10" },
  { label: "Total Spend (MTD)", value: "₹4.2M", change: "-12% vs last month", trend: "down", color: "text-coral", bg: "bg-coral/10" },
  { label: "Pending Approvals", value: "3", change: "Requires attention", trend: "neutral", color: "text-orange-600", bg: "bg-orange-600/10" },
  { label: "Avg Trust Score", value: "94", change: "Top tier vendors", trend: "up", color: "text-lime", bg: "bg-lime/20" },
];

const RECENT_DEALS = [
  { id: "REQ-092", title: "50 Business Laptops", vendor: "Vertex Systems", amount: "₹94,000", status: "Negotiating", trust: "GOLD" },
  { id: "REQ-091", title: "Q3 Cloud Server Provision", vendor: "CloudNet Global", amount: "₹210,000", status: "Approved", trust: "SILVER" },
  { id: "REQ-090", title: "Office Furniture Batch", vendor: "LocalWorks Inc", amount: "₹45,500", status: "Fulfilled", trust: "BRONZE" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-navy tracking-tight mb-2">Welcome back, John.</h1>
          <p className="text-navy/60 font-medium">Here's what's happening in your deals today.</p>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {STATS.map((stat, i) => (
          <motion.div 
            key={stat.label} 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-3xl p-6 border border-navy/5 shadow-xl shadow-navy/5 flex flex-col justify-between"
          >
            <div className="text-xs font-bold text-navy/50 uppercase tracking-widest mb-4">{stat.label}</div>
            <div className="flex items-end justify-between">
              <div className="text-3xl font-bold text-navy">{stat.value}</div>
              <div className={cn("text-[10px] font-bold tracking-widest uppercase flex items-center gap-1", stat.trend === 'up' ? "text-lime" : stat.trend === 'down' ? "text-coral" : "text-orange-500")}>
                {stat.trend === 'up' && <TrendingUp className="w-3 h-3" />}
                {stat.change}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* TWO COLUMNS */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* RECENT DEALS */}
        <div className="lg:col-span-2 bg-white rounded-[32px] border border-navy/5 shadow-xl shadow-navy/5 overflow-hidden">
          <div className="p-6 md:p-8 border-b border-navy/5 flex items-center justify-between">
            <h2 className="text-lg font-bold text-navy">Recent Deals</h2>
            <button className="text-xs font-bold text-cobalt hover:text-navy transition-colors uppercase tracking-widest">View All</button>
          </div>
          <div className="divide-y divide-navy/5">
            {RECENT_DEALS.map((deal, i) => (
              <motion.div key={deal.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + (i * 0.1) }} className="p-6 md:p-8 hover:bg-warm/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 group cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-navy/5 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-navy/40" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-navy/40 mb-1">{deal.id}</div>
                    <div className="text-sm font-bold text-navy mb-1 group-hover:text-cobalt transition-colors">{deal.title}</div>
                    <div className="flex items-center gap-2 text-xs font-medium text-navy/60">
                      {deal.vendor}
                      <span className="w-1 h-1 rounded-full bg-navy/20" />
                      <span className="text-navy font-bold">{deal.amount}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 sm:flex-col sm:items-end">
                  <div className={cn("px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full", deal.status === 'Approved' ? 'bg-lime/20 text-lime-700' : deal.status === 'Fulfilled' ? 'bg-navy/10 text-navy' : 'bg-orange-100 text-orange-700')}>
                    {deal.status}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-gold tracking-widest uppercase">
                    <ShieldCheck className="w-3 h-3" /> {deal.trust}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ACTION ITEMS */}
        <div className="bg-navy rounded-[32px] p-8 text-white relative overflow-hidden shadow-2xl shadow-navy/20">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-lime/10 rounded-full blur-[80px] pointer-events-none" />
          
          <h2 className="text-lg font-bold mb-8 relative z-10">Action Required</h2>
          
          <div className="space-y-4 relative z-10">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors cursor-pointer">
              <div className="flex items-start gap-3 mb-3">
                <AlertCircle className="w-5 h-5 text-coral shrink-0" />
                <div>
                  <div className="text-sm font-bold text-white mb-1">Quotation Expiring Soon</div>
                  <div className="text-xs text-white/60">Vendor C's quote for REQ-092 expires in 4 hours.</div>
                </div>
              </div>
              <button className="w-full py-2 bg-coral text-white text-xs font-bold rounded-xl hover:bg-coral/90 transition-colors">Review Quote</button>
            </div>
            
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors cursor-pointer">
              <div className="flex items-start gap-3 mb-3">
                <Clock className="w-5 h-5 text-lime shrink-0" />
                <div>
                  <div className="text-sm font-bold text-white mb-1">Delivery Confirmed</div>
                  <div className="text-xs text-white/60">REQ-090 has arrived. Please verify to release payment.</div>
                </div>
              </div>
              <button className="w-full py-2 bg-white/10 text-white text-xs font-bold rounded-xl hover:bg-white/20 transition-colors">Verify Delivery</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

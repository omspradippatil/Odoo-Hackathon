"use client";

import React from "react";
import { PieChart, Download, Filter, TrendingUp, Calendar, ChevronDown, CheckCircle2, DollarSign } from "lucide-react";
import { PLATFORM_CONFIG } from "@/lib/pricingConfig";

import { exportToExcel } from "@/lib/exportUtils";

export default function ReportsPage() {
  const handleExport = () => {
    const headers = ["Metric", "Value", "Notes"];
    const rows = [
      ["Deal Value", "₹4.8 Cr", "Total platform GMV"],
      ["Completed Deals", "428", "Fully delivered & billed"],
      ["Platform Revenue", "₹12.84L", "From 3% transaction fee"],
      ["On-Time Fulfilment", "93%", "Delivered within SLA"],
      ["Outstanding Invoices", "₹18.4L", "Awaiting settlement"],
      ["Monthly ARR", "₹6.8L", "Annual recurring revenue run rate"],
      ["Conversion - Requirements", "1240", "100% of funnel"],
      ["Conversion - Quotes Created", "982", "79% of funnel"],
      ["Conversion - Approved Internally", "714", "57% of funnel"],
      ["Conversion - Accepted by Customer", "586", "47% of funnel"],
      ["Conversion - Fulfilled", "472", "38% of funnel"],
      ["Conversion - Completed & Billed", "428", "34% of funnel"]
    ];
    exportToExcel("DEV-FLOW-Platform-Reports.xlsx", "Platform Reports", headers, rows);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-navy tracking-tight mb-2 uppercase">Platform Insights</h1>
          <p className="text-sm font-medium text-navy/60">Executive overview of deal volume, approvals, and fulfillment.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2.5 rounded-xl font-bold text-navy bg-white border border-navy/10 shadow-sm hover:bg-navy/5 transition-colors text-sm flex items-center justify-center gap-2">
            <Filter className="w-4 h-4" /> Date: 01 Aug - 31 Aug <ChevronDown className="w-3 h-3" />
          </button>
          <button 
            onClick={handleExport}
            className="px-4 py-2.5 rounded-xl font-bold text-white bg-navy shadow-lg shadow-navy/20 hover:bg-navy/90 transition-colors text-sm flex items-center justify-center gap-2"
            title="Download Reports Spreadsheet"
          >
            <Download className="w-4 h-4" /> Export CSV / XLSX
          </button>
        </div>
      </div>

      {/* EXECUTIVE SUMMARY */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        
        {[
          { label: 'Deal Value', value: '₹4.8 Cr' },
          { label: 'Completed Deals', value: '428' },
          { label: 'Platform Revenue', value: '₹' + ((4.8 * 0.89 * 10000000) * PLATFORM_CONFIG.transactionFeeRate / 100000).toFixed(1) + 'L' },
          { label: 'On-Time Fulfilment', value: '93%' },
          { label: 'Outstanding Inv', value: '₹18.4L' },
          { label: 'Monthly ARR', value: '₹6.8L' },
        ].map(kpi => (

          <div key={kpi.label} className="bg-white p-5 rounded-3xl border border-navy/5 shadow-sm">
            <div className="text-xl md:text-2xl font-bold text-navy mb-1">{kpi.value}</div>
            <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest leading-tight">{kpi.label}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        

        {/* PLATFORM REVENUE REPORT */}
        <div className="w-full mt-8 bg-navy rounded-3xl border border-navy/10 shadow-sm p-6 md:p-8 text-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div>
              <h2 className="text-xs font-bold text-coral uppercase tracking-widest mb-1 flex items-center gap-2"><DollarSign className="w-4 h-4" /> Platform Revenue Model</h2>
              <p className="text-sm font-medium text-white/60">Revenue generated from completed transactions.</p>
            </div>
            <div className="bg-white/10 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
              Platform Fee Rate: <span className="text-coral">{PLATFORM_CONFIG.formatPercentage(PLATFORM_CONFIG.transactionFeeRate)}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
              <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">Completed Transaction Value</div>
              <div className="text-2xl font-bold">₹4,28,00,000</div>
              <div className="text-xs font-medium text-white/50 mt-1">From 428 completed deals</div>
            </div>
            <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
              <div className="text-[10px] font-bold text-coral uppercase tracking-widest mb-2">Realized Platform Revenue</div>
              <div className="text-2xl font-bold text-coral">₹12,84,000</div>
              <div className="text-xs font-medium text-white/50 mt-1">₹4.28Cr × 3%</div>
            </div>
            <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
              <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">Projected Platform Revenue</div>
              <div className="text-2xl font-bold opacity-70">₹1,56,000</div>
              <div className="text-xs font-medium text-white/50 mt-1">From pending deals (₹52L × 3%)</div>
            </div>
          </div>
        </div>

        {/* FUNNEL */}
        <div className="w-full lg:w-1/2 bg-white rounded-3xl border border-navy/10 shadow-sm p-6 md:p-8">
          <h2 className="text-xs font-bold text-navy uppercase tracking-widest mb-8 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-cobalt" /> Deal Conversion Funnel</h2>
          
          <div className="space-y-4">
            {[
              { label: 'Requirements', value: 1240, pct: 100, color: 'bg-navy/10' },
              { label: 'Quotes Created', value: 982, pct: 79, color: 'bg-navy/20' },
              { label: 'Approved internally', value: 714, pct: 57, color: 'bg-cobalt/40' },
              { label: 'Accepted by Customer', value: 586, pct: 47, color: 'bg-cobalt/70' },
              { label: 'Fulfilled', value: 472, pct: 38, color: 'bg-lime-500' },
              { label: 'Completed & Billed', value: 428, pct: 34, color: 'bg-lime-600' },
            ].map((stage, i) => (
              <div key={stage.label} className="relative group cursor-pointer">
                <div className="flex justify-between text-xs font-bold text-navy mb-1.5 px-1">
                  <span>{stage.label}</span>
                  <span>{stage.value.toLocaleString()}</span>
                </div>
                <div className="h-8 bg-navy/5 rounded-r-full overflow-hidden w-full relative">
                  <div className={`h-full ${stage.color} transition-all duration-1000 flex items-center justify-end px-3`} style={{ width: `${stage.pct}%` }}>
                    <span className="text-[10px] font-bold text-white uppercase mix-blend-difference">{stage.pct}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* COMPACT REPORTS */}
        <div className="w-full lg:w-1/2 space-y-8">
          
          <div className="bg-white rounded-3xl border border-navy/10 shadow-sm p-6 md:p-8">
            <h2 className="text-xs font-bold text-navy uppercase tracking-widest mb-6">Approval Performance</h2>
            <div className="space-y-5">
              <div className="flex justify-between items-center border-b border-navy/5 pb-3">
                <span className="text-sm font-medium text-navy/70">Overall Approval Rate</span>
                <span className="font-bold text-lime-700">82%</span>
              </div>
              <div className="flex justify-between items-center border-b border-navy/5 pb-3">
                <span className="text-sm font-medium text-navy/70">Reapproval Rate</span>
                <span className="font-bold text-orange-600">14%</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-navy/40 uppercase tracking-widest block mb-2">Top Approval Trigger</span>
                <div className="bg-navy/5 px-4 py-3 rounded-xl text-sm font-bold text-navy border border-navy/5 flex justify-between items-center">
                  <span>Discount exceeds rep authority</span>
                  <span className="text-navy/40">48%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-navy/10 shadow-sm p-6 md:p-8">
            <h2 className="text-xs font-bold text-navy uppercase tracking-widest mb-6">Vendor Tier Distribution</h2>
            <div className="flex h-12 rounded-xl overflow-hidden mb-4">
              <div className="bg-yellow-400 w-[26%] flex items-center justify-center text-[10px] font-bold text-yellow-900 uppercase tracking-widest">Gold (84)</div>
              <div className="bg-slate-300 w-[41%] flex items-center justify-center text-[10px] font-bold text-slate-800 uppercase tracking-widest">Silver (132)</div>
              <div className="bg-amber-600/80 w-[33%] flex items-center justify-center text-[10px] font-bold text-amber-50 uppercase tracking-widest">Bronze (111)</div>
            </div>
            <p className="text-xs font-medium text-navy/60 text-center">Do NOT expose absolute vendor ranking lists externally. Internal view only.</p>
          </div>

        </div>

      </div>

    </div>
  );
}

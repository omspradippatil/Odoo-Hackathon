"use client";

import React, { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { 
  Calendar, Plus, Search, CheckCircle2, Clock, DollarSign, 
  CreditCard, ShieldCheck, ArrowUpRight
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SubscriptionPlan {
  id: string;
  planName: string;
  customerName: string;
  frequency: "MONTHLY" | "QUARTERLY" | "ANNUAL";
  amount: number;
  status: "ACTIVE" | "RENEWAL_DUE" | "TRIAL";
  nextBillingDate: string;
  features: string;
}

const SAMPLE_SUBSCRIPTIONS: SubscriptionPlan[] = [
  { id: "sub-1", planName: "Enterprise Procurement SaaS", customerName: "Nova Retail Innovations Pvt Ltd", frequency: "MONTHLY", amount: 155000, status: "ACTIVE", nextBillingDate: "2026-09-15", features: "Unlimited Multi-Tier Approvals & ERP Bridge" },
  { id: "sub-2", planName: "Vendor Pro Marketplace Tier", customerName: "Apex Industrial Supplies Ltd", frequency: "ANNUAL", amount: 450000, status: "ACTIVE", nextBillingDate: "2027-01-10", features: "Priority RFQ Distribution & Reduced Escrow Fee" },
  { id: "sub-3", planName: "Supply Chain Analytics Module", customerName: "Bharat Heavy Forge Corp", frequency: "MONTHLY", amount: 85000, status: "ACTIVE", nextBillingDate: "2026-09-22", features: "Real-time Defect Rate & Multi-Hub Telemetry" },
  { id: "sub-4", planName: "Custom Escrow Settlement Gateway", customerName: "Zenith Precision Tools Ltd", frequency: "QUARTERLY", amount: 120000, status: "RENEWAL_DUE", nextBillingDate: "2026-09-08", features: "Direct Host-to-Host Axis Bank Integration" },
  { id: "sub-5", planName: "Vendor Standard Tier", customerName: "Polycab Industrial Wires & Cables", frequency: "MONTHLY", amount: 45000, status: "ACTIVE", nextBillingDate: "2026-09-30", features: "Standard Catalog Listings & Quotation Portal" }
];

export default function AdminSubscriptionsPage() {
  const [subs, setSubs] = useState(SAMPLE_SUBSCRIPTIONS);
  const [search, setSearch] = useState("");

  const filtered = subs.filter(s => 
    s.planName.toLowerCase().includes(search.toLowerCase()) ||
    s.customerName.toLowerCase().includes(search.toLowerCase())
  );

  const totalMRR = 155000 + (450000 / 12) + 85000 + (120000 / 3) + 45000;
  const totalARR = totalMRR * 12;

  const formatINR = (val: number) => {
    if (val >= 100000) return "₹" + (val / 100000).toFixed(2) + " L";
    return "₹" + Math.round(val).toLocaleString("en-IN");
  };

  return (
    <AdminLayout>
      <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto pb-20">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-navy tracking-tight uppercase">SaaS & Recurring Subscriptions</h1>
            <p className="text-sm font-medium text-navy/60">Manage software licensing tiers, automated recurring invoice generation, and MRR metrics.</p>
          </div>
          <button 
            onClick={() => alert("Opening Subscription Tier Plan Designer...")}
            className="px-5 py-2.5 rounded-xl font-bold text-white bg-navy shadow-lg shadow-navy/20 hover:bg-navy/90 transition-colors text-sm flex items-center gap-2 self-start md:self-auto"
          >
            <Plus className="w-4 h-4" /> Create Plan
          </button>
        </div>

        {/* METRICS */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-navy/5 shadow-sm">
            <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest">MONTHLY RECURRING (MRR)</div>
            <div className="text-2xl font-bold text-navy mt-1">{formatINR(totalMRR)}</div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-navy/5 shadow-sm">
            <div className="text-[10px] font-bold text-cobalt uppercase tracking-widest">ANNUAL RUN RATE (ARR)</div>
            <div className="text-2xl font-bold text-cobalt mt-1">{formatINR(totalARR)}</div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-navy/5 shadow-sm">
            <div className="text-[10px] font-bold text-lime-700 uppercase tracking-widest">ACTIVE SUBSCRIBERS</div>
            <div className="text-2xl font-bold text-lime-700 mt-1">{subs.length} Accounts</div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-navy/5 shadow-sm">
            <div className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">RENEWAL DUE SOON</div>
            <div className="text-2xl font-bold text-amber-600 mt-1">1 Account</div>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="bg-white rounded-2xl p-4 border border-navy/5 shadow-sm">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-navy/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search plan name or corporate subscriber..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-navy/5 rounded-xl text-sm font-medium text-navy placeholder:text-navy/40 focus:outline-none"
            />
          </div>
        </div>

        {/* SUBSCRIPTIONS TABLE */}
        <div className="bg-white rounded-3xl border border-navy/5 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-navy/5 bg-navy/[0.02] text-[10px] font-bold uppercase tracking-wider text-navy/50">
                  <th className="py-4 px-6">Plan Tier</th>
                  <th className="py-4 px-6">Subscriber Company</th>
                  <th className="py-4 px-6">Cadence</th>
                  <th className="py-4 px-6 text-right">Recurring Fee</th>
                  <th className="py-4 px-6">Next Billing Date</th>
                  <th className="py-4 px-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy/5 text-sm">
                {filtered.map(sub => (
                  <tr key={sub.id} className="hover:bg-navy/[0.015] transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-navy">{sub.planName}</div>
                      <div className="text-xs text-navy/50">{sub.features}</div>
                    </td>
                    <td className="py-4 px-6 font-semibold text-navy">
                      {sub.customerName}
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md bg-navy/5 text-navy">
                        {sub.frequency}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-bold text-navy text-right">
                      {formatINR(sub.amount)}
                    </td>
                    <td className="py-4 px-6 text-xs text-navy/70 font-medium">
                      {sub.nextBillingDate}
                    </td>
                    <td className="py-4 px-6">
                      <span className={cn(
                        "text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full inline-flex items-center gap-1",
                        sub.status === "ACTIVE" && "bg-lime/20 text-lime-900",
                        sub.status === "RENEWAL_DUE" && "bg-amber-500/15 text-amber-900"
                      )}>
                        {sub.status === "ACTIVE" ? <CheckCircle2 className="w-3 h-3 text-lime-700" /> : <Clock className="w-3 h-3 text-amber-700" />}
                        {sub.status.replace(/_/g, " ")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
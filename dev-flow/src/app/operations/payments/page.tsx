"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { WorkspaceLayout } from "@/components/layout/WorkspaceLayout";
import { UserRole } from "@/types/auth";
import { 
  CreditCard, Search, Filter, ShieldCheck, CheckCircle2, Clock, 
  AlertTriangle, Lock, Unlock, ArrowRight, Eye, RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PaymentItem {
  id: string;
  dealId: string;
  customerName: string;
  milestoneTitle: string;
  amount: number;
  utrRef: string;
  escrowStatus: "LOCKED" | "READY_TO_RELEASE" | "SETTLED" | "PENDING_VERIFICATION";
  date: string;
  vendorName: string;
}

const SAMPLE_PAYMENTS: PaymentItem[] = [
  {
    id: "pay-1",
    dealId: "DF-2048",
    customerName: "Nova Retail Innovations",
    milestoneTitle: "Milestone 1: 50% Advance on PO",
    amount: 920000,
    utrRef: "HDFC00019283749",
    escrowStatus: "SETTLED",
    date: "2026-08-25",
    vendorName: "Apex Industrial Supplies Ltd"
  },
  {
    id: "pay-2",
    dealId: "DF-2048",
    customerName: "Nova Retail Innovations",
    milestoneTitle: "Milestone 2: 50% on Delivery Verification",
    amount: 920000,
    utrRef: "HDFC00028491024",
    escrowStatus: "READY_TO_RELEASE",
    date: "2026-09-02",
    vendorName: "Apex Industrial Supplies Ltd"
  },
  {
    id: "pay-3",
    dealId: "DF-1990",
    customerName: "Apex Logistics India",
    milestoneTitle: "Full Payment (Escrow Protected)",
    amount: 155000,
    utrRef: "ICIC99882103948",
    escrowStatus: "PENDING_VERIFICATION",
    date: "2026-09-04",
    vendorName: "Schneider Electric Infrastructure"
  },
  {
    id: "pay-4",
    dealId: "DF-1985",
    customerName: "Bharat Heavy Forge Corp",
    milestoneTitle: "Stage 2: 40% Factory Dispatch",
    amount: 1156400,
    utrRef: "SBIN00482910394",
    escrowStatus: "LOCKED",
    date: "2026-08-29",
    vendorName: "Tata Steel Industrial Supplies"
  },
  {
    id: "pay-5",
    dealId: "DF-2055",
    customerName: "Zenith Precision Tools",
    milestoneTitle: "100% Escrow Milestone",
    amount: 967600,
    utrRef: "AXIS88472910283",
    escrowStatus: "LOCKED",
    date: "2026-08-30",
    vendorName: "Siemens Industrial Automation"
  }
];

export default function PaymentsListPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filtered = SAMPLE_PAYMENTS.filter((p) => {
    const match = 
      p.dealId.toLowerCase().includes(search.toLowerCase()) ||
      p.customerName.toLowerCase().includes(search.toLowerCase()) ||
      p.utrRef.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "ALL" || p.escrowStatus === statusFilter;
    return match && matchStatus;
  });

  const formatINR = (val: number) => {
    if (val >= 10000000) return "₹" + (val / 10000000).toFixed(2) + " Cr";
    if (val >= 100000) return "₹" + (val / 100000).toFixed(2) + " L";
    return "₹" + val.toLocaleString("en-IN");
  };

  return (
    <WorkspaceLayout role={UserRole.FINANCE_OPERATIONS}>
      <div className="space-y-6 md:space-y-8 pb-16">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-1">Operations Workspace</div>
            <h1 className="text-3xl lg:text-4xl font-bold text-navy tracking-tight mb-2">Escrow & Payments</h1>
            <p className="text-navy/60 font-medium text-sm md:text-base">
              Monitor escrow accounts, bank UTR verification, and post-delivery fund settlements.
            </p>
          </div>

          <button 
            onClick={() => alert("Synchronizing bank ledger feeds via OpenBanking API...")}
            className="px-4 py-2.5 rounded-xl font-bold text-navy bg-white border border-navy/10 shadow-sm hover:bg-navy/5 transition-colors text-sm flex items-center gap-2 self-start md:self-auto"
          >
            <RefreshCw className="w-4 h-4" /> Sync Bank Feeds
          </button>
        </div>

        {/* METRICS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-navy/5 shadow-sm">
            <div className="flex items-center gap-2 text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-1">
              <Lock className="w-3.5 h-3.5 text-cobalt" /> TOTAL ESCROW LOCKED
            </div>
            <div className="text-2xl font-bold text-navy">₹41.19 L</div>
            <div className="text-xs text-navy/60 mt-1 font-medium">Safe in Axis Escrow Account</div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-navy/5 shadow-sm">
            <div className="flex items-center gap-2 text-[10px] font-bold text-lime-700 uppercase tracking-widest mb-1">
              <Unlock className="w-3.5 h-3.5 text-lime-600" /> READY FOR RELEASE
            </div>
            <div className="text-2xl font-bold text-lime-700">₹9.20 L</div>
            <div className="text-xs text-navy/60 mt-1 font-medium">Delivery confirmed by buyer</div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-navy/5 shadow-sm">
            <div className="flex items-center gap-2 text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1">
              <Clock className="w-3.5 h-3.5 text-amber-600" /> PENDING VERIFICATION
            </div>
            <div className="text-2xl font-bold text-amber-600">₹1.55 L</div>
            <div className="text-xs text-navy/60 mt-1 font-medium">1 NEFT/RTGS receipt unverified</div>
          </div>
        </div>

        {/* FILTER BAR */}
        <div className="bg-white rounded-2xl p-4 border border-navy/5 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-navy/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search deal ref, customer, or UTR..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-navy/5 rounded-xl text-sm font-medium text-navy placeholder:text-navy/40 focus:outline-none focus:ring-2 focus:ring-navy/20"
            />
          </div>

          <div className="flex bg-navy/5 p-1 rounded-xl text-xs font-bold overflow-x-auto w-full md:w-auto">
            {["ALL", "LOCKED", "READY_TO_RELEASE", "PENDING_VERIFICATION", "SETTLED"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={cn(
                  "px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors",
                  statusFilter === st ? "bg-white text-navy shadow-xs" : "text-navy/60 hover:text-navy"
                )}
              >
                {st.replace(/_/g, " ")}
              </button>
            ))}
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-3xl border border-navy/5 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-navy/5 bg-navy/[0.02] text-[10px] font-bold uppercase tracking-wider text-navy/50">
                  <th className="py-4 px-6">Deal Ref</th>
                  <th className="py-4 px-6">Buyer / Customer</th>
                  <th className="py-4 px-6">Milestone Details</th>
                  <th className="py-4 px-6 text-right">Amount</th>
                  <th className="py-4 px-6">UTR / Reference</th>
                  <th className="py-4 px-6">Escrow Status</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy/5 text-sm">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-navy/[0.015] transition-colors">
                    <td className="py-4 px-6 font-bold text-cobalt">
                      {item.dealId}
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-semibold text-navy">{item.customerName}</div>
                      <div className="text-xs text-navy/50">To: {item.vendorName}</div>
                    </td>
                    <td className="py-4 px-6 font-medium text-navy/80">
                      {item.milestoneTitle}
                    </td>
                    <td className="py-4 px-6 font-bold text-navy text-right">
                      {formatINR(item.amount)}
                    </td>
                    <td className="py-4 px-6 font-mono text-xs text-navy/60">
                      {item.utrRef}
                    </td>
                    <td className="py-4 px-6">
                      <span className={cn(
                        "text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full inline-flex items-center gap-1",
                        item.escrowStatus === "SETTLED" && "bg-lime/20 text-lime-900 border border-lime/30",
                        item.escrowStatus === "READY_TO_RELEASE" && "bg-emerald-500/15 text-emerald-900 border border-emerald-500/30",
                        item.escrowStatus === "LOCKED" && "bg-cobalt/15 text-cobalt border border-cobalt/30",
                        item.escrowStatus === "PENDING_VERIFICATION" && "bg-amber-500/15 text-amber-900 border border-amber-500/30"
                      )}>
                        {item.escrowStatus === "LOCKED" && <Lock className="w-3 h-3 text-cobalt" />}
                        {item.escrowStatus === "READY_TO_RELEASE" && <Unlock className="w-3 h-3 text-emerald-700" />}
                        {item.escrowStatus === "SETTLED" && <CheckCircle2 className="w-3 h-3 text-lime-700" />}
                        {item.escrowStatus.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => router.push("/operations/payments/" + item.dealId)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-cobalt hover:text-navy transition-colors bg-cobalt/5 hover:bg-cobalt/10 px-3 py-1.5 rounded-lg"
                      >
                        <Eye className="w-3.5 h-3.5" /> Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </WorkspaceLayout>
  );
}
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { WorkspaceLayout } from "@/components/layout/WorkspaceLayout";
import { UserRole } from "@/types/auth";
import { 
  FileText, Search, Filter, CheckCircle2, Clock, MessageSquare, 
  ArrowRight, Eye, ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SellerQuote {
  id: string;
  quotationRef: string;
  dealId: string;
  customerName: string;
  productSummary: string;
  quoteAmount: number;
  status: "ACCEPTED" | "IN_NEGOTIATION" | "UNDER_REVIEW" | "REJECTED";
  submittedDate: string;
  marginPercent: number;
}

const SAMPLE_QUOTES: SellerQuote[] = [
  {
    id: "q-1",
    quotationRef: "QT-2048",
    dealId: "DF-2048",
    customerName: "Nova Retail Innovations",
    productSummary: "50 Business Laptops & Docking Bundles",
    quoteAmount: 1840000,
    status: "ACCEPTED",
    submittedDate: "2026-08-25",
    marginPercent: 18.5
  },
  {
    id: "q-2",
    quotationRef: "QT-1985",
    dealId: "DF-1985",
    customerName: "Bharat Heavy Forge Corp",
    productSummary: "120 Solenoid Valves High-Pressure CETOP 3",
    quoteAmount: 2891000,
    status: "ACCEPTED",
    submittedDate: "2026-08-16",
    marginPercent: 22.0
  },
  {
    id: "q-3",
    quotationRef: "QT-1990",
    dealId: "DF-1990",
    customerName: "Apex Logistics India",
    productSummary: "ABB Variable Frequency Drives 7.5kW",
    quoteAmount: 155000,
    status: "IN_NEGOTIATION",
    submittedDate: "2026-08-30",
    marginPercent: 16.2
  },
  {
    id: "q-4",
    quotationRef: "QT-2055",
    dealId: "DF-2055",
    customerName: "Zenith Precision Tools",
    productSummary: "400 Deep Groove Ball Bearings SKF 6205",
    quoteAmount: 967600,
    status: "UNDER_REVIEW",
    submittedDate: "2026-09-02",
    marginPercent: 14.8
  }
];

export default function SellerQuotesPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filtered = SAMPLE_QUOTES.filter((q) => {
    const match = 
      q.quotationRef.toLowerCase().includes(search.toLowerCase()) ||
      q.customerName.toLowerCase().includes(search.toLowerCase()) ||
      q.productSummary.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "ALL" || q.status === statusFilter;
    return match && matchStatus;
  });

  const formatINR = (val: number) => {
    if (val >= 100000) return "₹" + (val / 100000).toFixed(2) + " L";
    return "₹" + val.toLocaleString("en-IN");
  };

  return (
    <WorkspaceLayout role={UserRole.SELLER}>
      <div className="space-y-6 md:space-y-8 pb-16">
        
        {/* HEADER */}
        <div>
          <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-1">Seller Workspace</div>
          <h1 className="text-3xl lg:text-4xl font-bold text-navy tracking-tight mb-2">My Submitted Quotes</h1>
          <p className="text-navy/60 font-medium text-sm md:text-base">
            Track quotation lifecycles, respond to buyer counter-offers, and verify deal closures.
          </p>
        </div>

        {/* METRICS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-navy/5 shadow-sm">
            <div className="text-[10px] font-bold text-lime-700 uppercase tracking-widest mb-1">ACCEPTED & WON</div>
            <div className="text-2xl font-bold text-lime-700">₹47.31 L</div>
            <div className="text-xs text-navy/60 mt-1 font-medium">2 quotes converted into confirmed deals</div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-navy/5 shadow-sm">
            <div className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1">IN NEGOTIATION</div>
            <div className="text-2xl font-bold text-amber-600">₹1.55 L</div>
            <div className="text-xs text-navy/60 mt-1 font-medium">Buyer submitted counter-offer</div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-navy/5 shadow-sm">
            <div className="text-[10px] font-bold text-cobalt uppercase tracking-widest mb-1">UNDER REVIEW</div>
            <div className="text-2xl font-bold text-cobalt">₹9.68 L</div>
            <div className="text-xs text-navy/60 mt-1 font-medium">1 quotation pending buyer decision</div>
          </div>
        </div>

        {/* FILTERS */}
        <div className="bg-white rounded-2xl p-4 border border-navy/5 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-navy/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search quote ref, customer, or items..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-navy/5 rounded-xl text-sm font-medium text-navy placeholder:text-navy/40 focus:outline-none focus:ring-2 focus:ring-navy/20"
            />
          </div>

          <div className="flex bg-navy/5 p-1 rounded-xl text-xs font-bold overflow-x-auto w-full md:w-auto">
            {["ALL", "ACCEPTED", "IN_NEGOTIATION", "UNDER_REVIEW"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={cn(
                  "px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors",
                  statusFilter === st ? "bg-white text-navy shadow-xs" : "text-navy/60 hover:text-navy"
                )}
              >
                {st.split("_").join(" ")}
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
                  <th className="py-4 px-6">Quote Ref</th>
                  <th className="py-4 px-6">Buyer Customer</th>
                  <th className="py-4 px-6">Scope of Work</th>
                  <th className="py-4 px-6 text-right">Quoted Value</th>
                  <th className="py-4 px-6">Margin %</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy/5 text-sm">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-navy/[0.015] transition-colors">
                    <td className="py-4 px-6 font-bold text-cobalt flex items-center gap-2">
                      <FileText className="w-4 h-4 text-navy/40" />
                      {item.quotationRef}
                    </td>
                    <td className="py-4 px-6 font-semibold text-navy">
                      {item.customerName}
                    </td>
                    <td className="py-4 px-6 font-medium text-navy/80">
                      {item.productSummary}
                    </td>
                    <td className="py-4 px-6 font-bold text-navy text-right">
                      {formatINR(item.quoteAmount)}
                    </td>
                    <td className="py-4 px-6 font-mono text-xs font-bold text-navy/70">
                      {item.marginPercent}%
                    </td>
                    <td className="py-4 px-6">
                      <span className={cn(
                        "text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full inline-flex items-center gap-1",
                        item.status === "ACCEPTED" && "bg-lime/20 text-lime-900 border border-lime/30",
                        item.status === "IN_NEGOTIATION" && "bg-amber-500/15 text-amber-900 border border-amber-500/30",
                        item.status === "UNDER_REVIEW" && "bg-cobalt/15 text-cobalt border border-cobalt/30"
                      )}>
                        {item.status === "ACCEPTED" && <CheckCircle2 className="w-3 h-3 text-lime-700" />}
                        {item.status === "IN_NEGOTIATION" && <MessageSquare className="w-3 h-3 text-amber-600" />}
                        {item.status.split("_").join(" ")}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => router.push("/negotiation/" + item.quotationRef)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-cobalt hover:text-navy transition-colors bg-cobalt/5 hover:bg-cobalt/10 px-3 py-1.5 rounded-lg"
                      >
                        Negotiation Room <ChevronRight className="w-3.5 h-3.5" />
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
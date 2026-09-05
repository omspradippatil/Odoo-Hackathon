"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { WorkspaceLayout } from "@/components/layout/WorkspaceLayout";
import { UserRole } from "@/types/auth";
import { 
  FileText, Plus, Search, Filter, ArrowRight, ShieldCheck, CheckCircle2, 
  Clock, AlertCircle, ShoppingBag, Eye, TrendingUp, Building2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface BuyerDeal {
  id: string;
  title: string;
  category: string;
  targetBudget: number;
  bestQuote: number;
  stage: "SOURCING" | "COMPARING" | "NEGOTIATING" | "APPROVED" | "FULFILLED";
  vendorCount: number;
  quoteCount: number;
  topVendor: string;
  createdAt: string;
  deliveryCity: string;
}

const SAMPLE_BUYER_DEALS: BuyerDeal[] = [
  {
    id: "REQ-2048",
    title: "50 High-Performance Engineering Workstations",
    category: "IT & Computing",
    targetBudget: 2000000,
    bestQuote: 1840000,
    stage: "COMPARING",
    vendorCount: 12,
    quoteCount: 3,
    topVendor: "Apex Industrial Supplies Ltd",
    createdAt: "2026-08-26",
    deliveryCity: "Mumbai, Maharashtra"
  },
  {
    id: "REQ-1985",
    title: "120 Solenoid Directional Valves CETOP 3",
    category: "Hydraulics & Pneumatics",
    targetBudget: 3000000,
    bestQuote: 2891000,
    stage: "APPROVED",
    vendorCount: 6,
    quoteCount: 4,
    topVendor: "Bosch Rexroth India",
    createdAt: "2026-08-14",
    deliveryCity: "Jamshedpur, Jharkhand"
  },
  {
    id: "REQ-1990",
    title: "15 Industrial VFD Motor Drives 7.5kW",
    category: "Electrical & Power",
    targetBudget: 700000,
    bestQuote: 630000,
    stage: "NEGOTIATING",
    vendorCount: 8,
    quoteCount: 3,
    topVendor: "ABB Power & Robotics",
    createdAt: "2026-08-28",
    deliveryCity: "Hyderabad, Telangana"
  },
  {
    id: "REQ-2055",
    title: "400 Deep Groove Ball Bearings 6205",
    category: "Mechanical Components",
    targetBudget: 1100000,
    bestQuote: 967600,
    stage: "FULFILLED",
    vendorCount: 15,
    quoteCount: 6,
    topVendor: "SKF Bearings India",
    createdAt: "2026-08-05",
    deliveryCity: "Ludhiana, Punjab"
  },
  {
    id: "REQ-2104",
    title: "500m 4-Core Armored Copper Busbar Cable",
    category: "Electrical & Power",
    targetBudget: 4000000,
    bestQuote: 3681600,
    stage: "SOURCING",
    vendorCount: 10,
    quoteCount: 1,
    topVendor: "Polycab Wires Ltd",
    createdAt: "2026-09-02",
    deliveryCity: "Bengaluru, Karnataka"
  }
];

export default function BuyerDealsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("ALL");

  const filtered = SAMPLE_BUYER_DEALS.filter((deal) => {
    const match = 
      deal.title.toLowerCase().includes(search.toLowerCase()) ||
      deal.id.toLowerCase().includes(search.toLowerCase()) ||
      deal.category.toLowerCase().includes(search.toLowerCase());
    const matchStage = stageFilter === "ALL" || deal.stage === stageFilter;
    return match && matchStage;
  });

  const formatINR = (val: number) => {
    if (val >= 100000) return "₹" + (val / 100000).toFixed(2) + " L";
    return "₹" + val.toLocaleString("en-IN");
  };

  return (
    <WorkspaceLayout role={UserRole.BUYER}>
      <div className="space-y-6 md:space-y-8 pb-16">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-1">Buyer Workspace</div>
            <h1 className="text-3xl lg:text-4xl font-bold text-navy tracking-tight mb-2">My Procurement Deals</h1>
            <p className="text-navy/60 font-medium text-sm md:text-base">
              Track open RFQs, compare vendor quotations, and manage active deliveries.
            </p>
          </div>

          <button 
            onClick={() => router.push("/buyer/requirements/new")}
            className="px-6 py-3 rounded-2xl font-bold text-white bg-navy shadow-lg shadow-navy/20 hover:bg-navy/90 transition-all text-sm flex items-center gap-2 self-start md:self-auto"
          >
            <Plus className="w-4 h-4" /> Create Requirement
          </button>
        </div>

        {/* METRICS */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-navy/5 shadow-sm">
            <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-1">ACTIVE DEALS</div>
            <div className="text-2xl font-bold text-navy">5 Orders</div>
            <div className="text-xs text-navy/60 mt-1 font-medium">₹90.09 L procurement value</div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-navy/5 shadow-sm">
            <div className="text-[10px] font-bold text-cobalt uppercase tracking-widest mb-1">QUOTES RECEIVED</div>
            <div className="text-2xl font-bold text-cobalt">17 Quotations</div>
            <div className="text-xs text-navy/60 mt-1 font-medium">Ready for comparison</div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-navy/5 shadow-sm">
            <div className="text-[10px] font-bold text-lime-700 uppercase tracking-widest mb-1">ESTIMATED SAVINGS</div>
            <div className="text-2xl font-bold text-lime-700">₹7.92 L</div>
            <div className="text-xs text-navy/60 mt-1 font-medium">8.1% below initial budgets</div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-navy/5 shadow-sm">
            <div className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1">IN NEGOTIATION</div>
            <div className="text-2xl font-bold text-amber-600">2 Deals</div>
            <div className="text-xs text-navy/60 mt-1 font-medium">Active counter-offers pending</div>
          </div>
        </div>

        {/* FILTER BAR */}
        <div className="bg-white rounded-2xl p-4 border border-navy/5 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-navy/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search deal ID, item, or category..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-navy/5 rounded-xl text-sm font-medium text-navy placeholder:text-navy/40 focus:outline-none focus:ring-2 focus:ring-navy/20"
            />
          </div>

          <div className="flex bg-navy/5 p-1 rounded-xl text-xs font-bold overflow-x-auto w-full md:w-auto">
            {["ALL", "SOURCING", "COMPARING", "NEGOTIATING", "APPROVED", "FULFILLED"].map((st) => (
              <button
                key={st}
                onClick={() => setStageFilter(st)}
                className={cn(
                  "px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors",
                  stageFilter === st ? "bg-white text-navy shadow-xs" : "text-navy/60 hover:text-navy"
                )}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* DEALS LIST */}
        <div className="space-y-4">
          {filtered.map((deal) => (
            <div 
              key={deal.id}
              onClick={() => router.push("/buyer/requirements/" + deal.id)}
              className="bg-white p-6 rounded-3xl border border-navy/5 shadow-sm hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-cobalt bg-cobalt/10 px-2.5 py-1 rounded text-xs">
                      {deal.id}
                    </span>
                    <span className="text-xs text-navy/40 font-semibold uppercase tracking-wider">
                      {deal.category}
                    </span>
                    <span className={cn(
                      "text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full",
                      deal.stage === "COMPARING" && "bg-cobalt/15 text-cobalt",
                      deal.stage === "APPROVED" && "bg-lime/20 text-lime-800",
                      deal.stage === "NEGOTIATING" && "bg-amber-500/15 text-amber-900",
                      deal.stage === "FULFILLED" && "bg-emerald-500/15 text-emerald-900",
                      deal.stage === "SOURCING" && "bg-navy/10 text-navy"
                    )}>
                      {deal.stage}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-navy group-hover:text-cobalt transition-colors">
                    {deal.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-navy/60">
                    <div>Delivery: <strong className="text-navy">{deal.deliveryCity}</strong></div>
                    <div>Top Bidder: <strong className="text-navy">{deal.topVendor}</strong></div>
                    <div>Quotes: <strong className="text-navy">{deal.quoteCount} received</strong> ({deal.vendorCount} invited)</div>
                  </div>
                </div>

                <div className="flex items-center justify-between lg:justify-end gap-6 pt-4 lg:pt-0 border-t lg:border-t-0 border-navy/5">
                  <div className="text-right">
                    <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest">BEST QUOTE</div>
                    <div className="text-xl font-bold text-navy">{formatINR(deal.bestQuote)}</div>
                    <div className="text-[11px] text-lime-700 font-medium">Budget: {formatINR(deal.targetBudget)}</div>
                  </div>

                  <button className="w-10 h-10 rounded-xl bg-navy/5 group-hover:bg-navy group-hover:text-white flex items-center justify-center transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </WorkspaceLayout>
  );
}
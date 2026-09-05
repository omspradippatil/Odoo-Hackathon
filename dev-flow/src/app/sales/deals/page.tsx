"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { WorkspaceLayout } from "@/components/layout/WorkspaceLayout";
import { UserRole } from "@/types/auth";
import { 
  Briefcase, Plus, Search, Filter, ArrowRight, Eye, CheckCircle2, 
  Clock, AlertCircle, DollarSign, TrendingUp, Users
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SalesDeal {
  id: string;
  title: string;
  customerName: string;
  value: number;
  marginPercent: number;
  stage: "LEAD" | "QUOTED" | "NEGOTIATION" | "APPROVED" | "WON";
  health: "HEALTHY" | "WATCH" | "CRITICAL";
  leadRep: string;
  closeDate: string;
}

const SAMPLE_SALES_DEALS: SalesDeal[] = [
  {
    id: "DF-2048",
    title: "Nova Retail IT Infrastructure Modernization",
    customerName: "Nova Retail Innovations",
    value: 1840000,
    marginPercent: 18.5,
    stage: "APPROVED",
    health: "HEALTHY",
    leadRep: "Rahul Verma",
    closeDate: "2026-09-15"
  },
  {
    id: "DF-1985",
    title: "High Pressure Hydraulic Valves Supply",
    customerName: "Bharat Heavy Forge Corp",
    value: 2891000,
    marginPercent: 22.0,
    stage: "WON",
    health: "HEALTHY",
    leadRep: "Priya Sharma",
    closeDate: "2026-08-30"
  },
  {
    id: "DF-1990",
    title: "Warehouse Automation Motors & Drives",
    customerName: "Apex Logistics India",
    value: 155000,
    marginPercent: 16.2,
    stage: "NEGOTIATION",
    health: "WATCH",
    leadRep: "Rahul Verma",
    closeDate: "2026-09-20"
  },
  {
    id: "DF-2055",
    title: "Annual Heavy Machinery Bearing Contract",
    customerName: "Zenith Precision Tools",
    value: 967600,
    marginPercent: 14.8,
    stage: "QUOTED",
    health: "HEALTHY",
    leadRep: "Sneha Patel",
    closeDate: "2026-09-25"
  },
  {
    id: "DF-2104",
    title: "Factory Substation Cabling & Busbar Overhaul",
    customerName: "Kirloskar Power Components",
    value: 3681600,
    marginPercent: 19.4,
    stage: "LEAD",
    health: "WATCH",
    leadRep: "Priya Sharma",
    closeDate: "2026-10-05"
  }
];

export default function SalesDealsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("ALL");

  const filtered = SAMPLE_SALES_DEALS.filter((d) => {
    const match = 
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.customerName.toLowerCase().includes(search.toLowerCase()) ||
      d.id.toLowerCase().includes(search.toLowerCase());
    const matchStage = stageFilter === "ALL" || d.stage === stageFilter;
    return match && matchStage;
  });

  const formatINR = (val: number) => {
    if (val >= 100000) return "₹" + (val / 100000).toFixed(2) + " L";
    return "₹" + val.toLocaleString("en-IN");
  };

  const totalPipeline = SAMPLE_SALES_DEALS.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <WorkspaceLayout role={UserRole.SALES_REP}>
      <div className="space-y-6 md:space-y-8 pb-16">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-1">Sales Workspace</div>
            <h1 className="text-3xl lg:text-4xl font-bold text-navy tracking-tight mb-2">Deals Pipeline</h1>
            <p className="text-navy/60 font-medium text-sm md:text-base">
              Manage commercial opportunities, discount margins, and customer quotation closures.
            </p>
          </div>

          <button 
            onClick={() => router.push("/sales/quotations/new")}
            className="px-6 py-3 rounded-2xl font-bold text-white bg-navy shadow-lg shadow-navy/20 hover:bg-navy/90 transition-all text-sm flex items-center gap-2 self-start md:self-auto"
          >
            <Plus className="w-4 h-4" /> Create Quotation
          </button>
        </div>

        {/* METRICS */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-navy/5 shadow-sm">
            <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-1">TOTAL PIPELINE</div>
            <div className="text-2xl font-bold text-navy">{formatINR(totalPipeline)}</div>
            <div className="text-xs text-navy/60 mt-1 font-medium">5 commercial opportunities</div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-navy/5 shadow-sm">
            <div className="text-[10px] font-bold text-lime-700 uppercase tracking-widest mb-1">CLOSED WON</div>
            <div className="text-2xl font-bold text-lime-700">₹28.91 L</div>
            <div className="text-xs text-navy/60 mt-1 font-medium">1 contract fulfilled & invoiced</div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-navy/5 shadow-sm">
            <div className="text-[10px] font-bold text-cobalt uppercase tracking-widest mb-1">IN APPROVAL</div>
            <div className="text-2xl font-bold text-cobalt">₹18.40 L</div>
            <div className="text-xs text-navy/60 mt-1 font-medium">Approved by Sales Manager</div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-navy/5 shadow-sm">
            <div className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1">AVG MARGIN</div>
            <div className="text-2xl font-bold text-amber-600">18.2%</div>
            <div className="text-xs text-navy/60 mt-1 font-medium">Healthy target above 15% floor</div>
          </div>
        </div>

        {/* FILTERS */}
        <div className="bg-white rounded-2xl p-4 border border-navy/5 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-navy/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search deal name, customer, or ID..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-navy/5 rounded-xl text-sm font-medium text-navy placeholder:text-navy/40 focus:outline-none focus:ring-2 focus:ring-navy/20"
            />
          </div>

          <div className="flex bg-navy/5 p-1 rounded-xl text-xs font-bold overflow-x-auto w-full md:w-auto">
            {["ALL", "LEAD", "QUOTED", "NEGOTIATION", "APPROVED", "WON"].map((st) => (
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
              onClick={() => router.push("/deals/" + deal.id + "/health")}
              className="bg-white p-6 rounded-3xl border border-navy/5 shadow-sm hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-cobalt bg-cobalt/10 px-2.5 py-1 rounded text-xs">
                      {deal.id}
                    </span>
                    <span className="text-xs text-navy/40 font-semibold">
                      Owner: {deal.leadRep}
                    </span>
                    <span className={cn(
                      "text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full",
                      deal.stage === "WON" && "bg-lime/20 text-lime-900",
                      deal.stage === "APPROVED" && "bg-emerald-500/15 text-emerald-900",
                      deal.stage === "NEGOTIATION" && "bg-amber-500/15 text-amber-900",
                      deal.stage === "QUOTED" && "bg-cobalt/15 text-cobalt",
                      deal.stage === "LEAD" && "bg-navy/10 text-navy"
                    )}>
                      {deal.stage}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-navy group-hover:text-cobalt transition-colors">
                    {deal.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-navy/60">
                    <div>Customer: <strong className="text-navy">{deal.customerName}</strong></div>
                    <div>Target Close: <strong className="text-navy">{deal.closeDate}</strong></div>
                    <div>Gross Margin: <strong className="text-lime-800">{deal.marginPercent}%</strong></div>
                  </div>
                </div>

                <div className="flex items-center justify-between lg:justify-end gap-6 pt-4 lg:pt-0 border-t lg:border-t-0 border-navy/5">
                  <div className="text-right">
                    <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest">DEAL VALUE</div>
                    <div className="text-xl font-bold text-navy">{formatINR(deal.value)}</div>
                    <div className="text-[11px] text-navy/50">Deal Health: {deal.health}</div>
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
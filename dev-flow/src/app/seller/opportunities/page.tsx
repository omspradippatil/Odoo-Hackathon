"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { WorkspaceLayout } from "@/components/layout/WorkspaceLayout";
import { UserRole } from "@/types/auth";
import { 
  Search, Filter, MapPin, Clock, ArrowRight, DollarSign, 
  Building2, CheckCircle2, Send, Tag, AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RFQOpportunity {
  id: string;
  title: string;
  category: string;
  buyerName: string;
  quantity: number;
  unit: string;
  targetBudget: number;
  deliveryCity: string;
  deadline: string;
  urgency: "HIGH" | "MEDIUM" | "STANDARD";
  quotesCount: number;
}

const SAMPLE_OPPORTUNITIES: RFQOpportunity[] = [
  {
    id: "RFQ-1049",
    title: "120 High-Pressure CETOP 3 Directional Solenoid Valves 24V",
    category: "Hydraulics & Pneumatics",
    buyerName: "Bharat Heavy Forge Corp",
    quantity: 120,
    unit: "Units",
    targetBudget: 2800000,
    deliveryCity: "Jamshedpur, Jharkhand",
    deadline: "3 days left",
    urgency: "HIGH",
    quotesCount: 2
  },
  {
    id: "RFQ-1052",
    title: "50 Industrial Fan-Cooled Induction Motors 5.5kW",
    category: "Electrical & Power",
    buyerName: "Kirloskar Power Components",
    quantity: 50,
    unit: "Units",
    targetBudget: 1750000,
    deliveryCity: "Pune, Maharashtra",
    deadline: "5 days left",
    urgency: "MEDIUM",
    quotesCount: 4
  },
  {
    id: "RFQ-1055",
    title: "1,000m 4-Core Armored Copper High-Tension Cable",
    category: "Electrical & Power",
    buyerName: "Nova Retail Innovations",
    quantity: 1000,
    unit: "Meters",
    targetBudget: 4200000,
    deliveryCity: "Bengaluru, Karnataka",
    deadline: "24 hours left",
    urgency: "HIGH",
    quotesCount: 5
  },
  {
    id: "RFQ-1060",
    title: "500 Stainless Steel ANSI 50 Roller Chain Links 10ft Box",
    category: "Mechanical Components",
    buyerName: "Zenith Precision Tools",
    quantity: 500,
    unit: "Boxes",
    targetBudget: 1600000,
    deliveryCity: "Ludhiana, Punjab",
    deadline: "7 days left",
    urgency: "STANDARD",
    quotesCount: 1
  }
];

export default function SellerOpportunitiesPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [selectedRfq, setSelectedRfq] = useState<RFQOpportunity | null>(null);
  const [quotePrice, setQuotePrice] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const categories = ["ALL", "Electrical & Power", "Hydraulics & Pneumatics", "Mechanical Components"];

  const filtered = SAMPLE_OPPORTUNITIES.filter((rfq) => {
    const match = 
      rfq.title.toLowerCase().includes(search.toLowerCase()) ||
      rfq.id.toLowerCase().includes(search.toLowerCase()) ||
      rfq.buyerName.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === "ALL" || rfq.category === categoryFilter;
    return match && matchCat;
  });

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setSelectedRfq(null);
      setQuotePrice("");
    }, 2000);
  };

  const formatINR = (val: number) => {
    if (val >= 100000) return "₹" + (val / 100000).toFixed(2) + " L";
    return "₹" + val.toLocaleString("en-IN");
  };

  return (
    <WorkspaceLayout role={UserRole.SELLER}>
      <div className="space-y-6 md:space-y-8 pb-16">
        
        {/* HEADER */}
        <div>
          <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-1">Seller Marketplace</div>
          <h1 className="text-3xl lg:text-4xl font-bold text-navy tracking-tight mb-2">Buyer RFQ Opportunities</h1>
          <p className="text-navy/60 font-medium text-sm md:text-base">
            Discover verified buyer requirements matching your inventory and submit competitive quotations.
          </p>
        </div>

        {/* FILTERS */}
        <div className="bg-white rounded-2xl p-4 border border-navy/5 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-navy/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search RFQ ID, item name, or buyer..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-navy/5 rounded-xl text-sm font-medium text-navy placeholder:text-navy/40 focus:outline-none focus:ring-2 focus:ring-navy/20"
            />
          </div>

          <div className="flex bg-navy/5 p-1 rounded-xl text-xs font-bold overflow-x-auto w-full md:w-auto">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategoryFilter(c)}
                className={cn(
                  "px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors",
                  categoryFilter === c ? "bg-white text-navy shadow-xs" : "text-navy/60 hover:text-navy"
                )}
              >
                {c === "ALL" ? "All Categories" : c}
              </button>
            ))}
          </div>
        </div>

        {/* OPPORTUNITIES LIST */}
        <div className="space-y-4">
          {filtered.map((rfq) => (
            <div 
              key={rfq.id}
              className="bg-white p-6 rounded-3xl border border-navy/5 shadow-sm hover:shadow-md transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-cobalt bg-cobalt/10 px-2.5 py-1 rounded text-xs">
                    {rfq.id}
                  </span>
                  <span className="text-xs text-navy/40 font-semibold uppercase tracking-wider">
                    {rfq.category}
                  </span>
                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full",
                    rfq.urgency === "HIGH" && "bg-red-500/15 text-red-900",
                    rfq.urgency === "MEDIUM" && "bg-amber-500/15 text-amber-900",
                    rfq.urgency === "STANDARD" && "bg-navy/10 text-navy"
                  )}>
                    {rfq.urgency} URGENCY
                  </span>
                </div>

                <h3 className="text-lg font-bold text-navy">
                  {rfq.title}
                </h3>

                <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-navy/60">
                  <div>Buyer: <strong className="text-navy">{rfq.buyerName}</strong></div>
                  <div>Quantity: <strong className="text-navy">{rfq.quantity} {rfq.unit}</strong></div>
                  <div className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {rfq.deliveryCity}</div>
                  <div className="flex items-center gap-1 text-amber-700 font-bold"><Clock className="w-3.5 h-3.5" /> {rfq.deadline}</div>
                </div>
              </div>

              <div className="flex items-center justify-between lg:justify-end gap-6 pt-4 lg:pt-0 border-t lg:border-t-0 border-navy/5">
                <div className="text-right">
                  <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest">BUYER BUDGET</div>
                  <div className="text-xl font-bold text-navy">{formatINR(rfq.targetBudget)}</div>
                  <div className="text-[11px] text-navy/50">{rfq.quotesCount} seller bids submitted</div>
                </div>

                <button 
                  onClick={() => setSelectedRfq(rfq)}
                  className="px-5 py-2.5 rounded-xl font-bold text-white bg-navy hover:bg-navy/90 transition-colors shadow-sm text-sm flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" /> Bid Quotation
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* BID QUOTATION MODAL */}
        {selectedRfq && (
          <div className="fixed inset-0 bg-navy/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border border-navy/10 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold text-cobalt bg-cobalt/10 px-2 py-0.5 rounded uppercase">
                    {selectedRfq.id}
                  </span>
                  <h3 className="text-xl font-bold text-navy mt-1">{selectedRfq.title}</h3>
                  <div className="text-xs text-navy/60">{selectedRfq.buyerName} • {selectedRfq.quantity} {selectedRfq.unit}</div>
                </div>
                <button onClick={() => setSelectedRfq(null)} className="text-navy/40 hover:text-navy font-bold text-lg">×</button>
              </div>

              {submitted ? (
                <div className="p-6 bg-lime/20 border border-lime/30 rounded-2xl text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-lime-700 mx-auto" />
                  <div className="font-bold text-navy">Quotation Sent to Buyer!</div>
                  <div className="text-xs text-navy/60">Your quote is now under review in the buyer comparison room.</div>
                </div>
              ) : (
                <form onSubmit={handleQuoteSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-navy/70 uppercase tracking-wider mb-1">
                      Your Total Quote Amount (INR)
                    </label>
                    <input 
                      type="number"
                      placeholder="e.g. 2650000"
                      required
                      value={quotePrice}
                      onChange={(e) => setQuotePrice(e.target.value)}
                      className="w-full px-4 py-3 bg-navy/5 rounded-xl text-lg font-bold text-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
                    />
                    <div className="text-xs text-navy/50 mt-1">Buyer Budget: {formatINR(selectedRfq.targetBudget)}</div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-navy/70 uppercase tracking-wider mb-1">
                      Dispatch Lead Time
                    </label>
                    <select className="w-full px-4 py-2.5 bg-navy/5 rounded-xl text-sm font-medium text-navy focus:outline-none">
                      <option>Immediate (Ready in local warehouse)</option>
                      <option>2 - 4 business days</option>
                      <option>7 business days</option>
                    </select>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button 
                      type="button" 
                      onClick={() => setSelectedRfq(null)}
                      className="flex-1 py-3 font-bold text-navy bg-navy/5 rounded-xl text-sm hover:bg-navy/10"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="flex-1 py-3 font-bold text-white bg-navy rounded-xl text-sm hover:bg-navy/90 shadow-md shadow-navy/20"
                    >
                      Submit Official Quote
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

      </div>
    </WorkspaceLayout>
  );
}
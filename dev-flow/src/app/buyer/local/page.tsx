"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { WorkspaceLayout } from "@/components/layout/WorkspaceLayout";
import { UserRole } from "@/types/auth";
import { 
  MapPin, Search, Filter, ShieldCheck, Star, Building2, 
  ExternalLink, ArrowRight, CheckCircle2, Phone, Mail
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LocalSeller {
  id: string;
  name: string;
  category: string;
  city: string;
  state: string;
  rating: number;
  trustScore: number;
  trustTier: "Gold" | "Silver" | "Bronze";
  warehouses: string[];
  productCount: number;
}

const SAMPLE_LOCAL_SELLERS: LocalSeller[] = [
  {
    id: "ven-1",
    name: "Tata Steel Industrial Supplies Ltd",
    category: "Raw Materials, Metals & Structural Steel",
    city: "Mumbai",
    state: "Maharashtra",
    rating: 4.9,
    trustScore: 96,
    trustTier: "Gold",
    warehouses: ["Bhiwandi Central Logistics Hub", "Talegaon MIDC Fulfillment"],
    productCount: 28
  },
  {
    id: "ven-2",
    name: "Larsen & Toubro Heavy Equipment",
    category: "Industrial Power & Heavy Machining",
    city: "Pune",
    state: "Maharashtra",
    rating: 4.8,
    trustScore: 95,
    trustTier: "Gold",
    warehouses: ["Chakan Industrial Logistic Park"],
    productCount: 22
  },
  {
    id: "ven-3",
    name: "Siemens Industrial Automation India",
    category: "PLC, VFD Drives & Factory Automation",
    city: "Bengaluru",
    state: "Karnataka",
    rating: 4.9,
    trustScore: 98,
    trustTier: "Gold",
    warehouses: ["Whitefield Supply Depot", "Peenya Stores Hub"],
    productCount: 35
  },
  {
    id: "ven-4",
    name: "Schneider Electric Infrastructure",
    category: "Switchgear, Circuit Breakers & Solar",
    city: "Gurugram",
    state: "Haryana",
    rating: 4.8,
    trustScore: 94,
    trustTier: "Gold",
    warehouses: ["Manesar Auto & Electrical Depot"],
    productCount: 19
  },
  {
    id: "ven-5",
    name: "SKF Bearings & Lubrication Solutions",
    category: "Ball Bearings, Pillow Blocks & Couplings",
    city: "Pune",
    state: "Maharashtra",
    rating: 4.7,
    trustScore: 93,
    trustTier: "Gold",
    warehouses: ["Chakan Logistics Unit 2"],
    productCount: 16
  },
  {
    id: "ven-6",
    name: "Festo Pneumatics & Automation Corp",
    category: "Pneumatic Cylinders, Valves & FRL Units",
    city: "Chennai",
    state: "Tamil Nadu",
    rating: 4.8,
    trustScore: 92,
    trustTier: "Gold",
    warehouses: ["Sriperumbudur Mega Distribution Center"],
    productCount: 24
  },
  {
    id: "ven-7",
    name: "Polycab Industrial Wires & Cables",
    category: "Armored Copper Power Cables & Busbars",
    city: "Vadodara",
    state: "Gujarat",
    rating: 4.5,
    trustScore: 87,
    trustTier: "Gold",
    warehouses: ["Sanand Logistics Facility"],
    productCount: 18
  },
  {
    id: "ven-8",
    name: "Finolex Industrial Cables Ltd",
    category: "Submersible Cables & Flexible Wires",
    city: "Pune",
    state: "Maharashtra",
    rating: 4.4,
    trustScore: 84,
    trustTier: "Silver",
    warehouses: ["Talegaon MIDC Unit 2"],
    productCount: 14
  },
  {
    id: "ven-9",
    name: "Apex Industrial Tools & Hardware",
    category: "Fasteners, Metric Bolts & Anchors",
    city: "Ahmedabad",
    state: "Gujarat",
    rating: 4.2,
    trustScore: 79,
    trustTier: "Silver",
    warehouses: ["Changodar Express Hub"],
    productCount: 26
  }
];

export default function LocalSellersPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("ALL");
  const [tierFilter, setTierFilter] = useState("ALL");

  const cities = ["ALL", "Mumbai", "Pune", "Bengaluru", "Chennai", "Ahmedabad", "Gurugram"];

  const filtered = SAMPLE_LOCAL_SELLERS.filter((s) => {
    const match = 
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase()) ||
      s.city.toLowerCase().includes(search.toLowerCase());
    const matchCity = cityFilter === "ALL" || s.city === cityFilter;
    const matchTier = tierFilter === "ALL" || s.trustTier === tierFilter;
    return match && matchCity && matchTier;
  });

  return (
    <WorkspaceLayout role={UserRole.BUYER}>
      <div className="space-y-6 md:space-y-8 pb-16">
        
        {/* HEADER */}
        <div>
          <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-1">Supplier Discovery</div>
          <h1 className="text-3xl lg:text-4xl font-bold text-navy tracking-tight mb-2">Verified Local Sellers</h1>
          <p className="text-navy/60 font-medium text-sm md:text-base">
            Explore audited B2B suppliers near your fulfillment sites with verified Trust Tiers.
          </p>
        </div>

        {/* SEARCH & FILTERS */}
        <div className="bg-white rounded-2xl p-4 border border-navy/5 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-navy/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search vendor name, product category, or city..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-navy/5 rounded-xl text-sm font-medium text-navy placeholder:text-navy/40 focus:outline-none focus:ring-2 focus:ring-navy/20"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="px-3 py-2 bg-navy/5 text-navy font-bold text-xs rounded-xl focus:outline-none"
            >
              {cities.map((c) => (
                <option key={c} value={c}>{c === "ALL" ? "All Cities" : c}</option>
              ))}
            </select>

            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="px-3 py-2 bg-navy/5 text-navy font-bold text-xs rounded-xl focus:outline-none"
            >
              <option value="ALL">All Tiers</option>
              <option value="Gold">Gold Tier (90+)</option>
              <option value="Silver">Silver Tier (75+)</option>
              <option value="Bronze">Bronze Tier</option>
            </select>
          </div>
        </div>

        {/* CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((vendor) => (
            <div 
              key={vendor.id}
              className="bg-white rounded-3xl p-6 border border-navy/5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1",
                    vendor.trustTier === "Gold" && "bg-amber-400/20 text-amber-900 border border-amber-400/30",
                    vendor.trustTier === "Silver" && "bg-slate-200 text-slate-800 border border-slate-300",
                    vendor.trustTier === "Bronze" && "bg-orange-200 text-orange-900"
                  )}>
                    <ShieldCheck className="w-3 h-3 text-amber-600" />
                    {vendor.trustTier} Tier ({vendor.trustScore})
                  </span>

                  <div className="flex items-center gap-1 text-xs font-bold text-navy">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {vendor.rating}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-navy mb-1 leading-snug">
                  {vendor.name}
                </h3>
                <div className="text-xs font-medium text-navy/60 mb-4">
                  {vendor.category}
                </div>

                <div className="p-3 bg-navy/5 rounded-2xl space-y-1.5 text-xs text-navy/70 mb-6">
                  <div className="flex items-center gap-1.5 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-navy/40" />
                    {vendor.city}, {vendor.state}
                  </div>
                  <div className="flex items-center gap-1.5 font-medium">
                    <Building2 className="w-3.5 h-3.5 text-navy/40" />
                    {vendor.warehouses.length} Active Warehouse Hubs
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-navy/5">
                <button
                  onClick={() => router.push("/vendors/" + vendor.id + "/trust")}
                  className="flex-1 py-2.5 text-xs font-bold text-navy bg-navy/5 hover:bg-navy/10 rounded-xl transition-colors text-center"
                >
                  Trust Scorecard
                </button>
                <button
                  onClick={() => router.push("/buyer/requirements/new")}
                  className="flex-1 py-2.5 text-xs font-bold text-white bg-navy hover:bg-navy/90 rounded-xl transition-colors text-center shadow-xs"
                >
                  Request Quote
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </WorkspaceLayout>
  );
}
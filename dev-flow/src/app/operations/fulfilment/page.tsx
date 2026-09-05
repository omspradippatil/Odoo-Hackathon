"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { WorkspaceLayout } from "@/components/layout/WorkspaceLayout";
import { UserRole } from "@/types/auth";
import { 
  Truck, Search, Package, MapPin, AlertCircle, CheckCircle2, 
  Clock, ArrowRight, Eye, Boxes, Building2, ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FulfilmentOrder {
  id: string;
  dealId: string;
  customerName: string;
  productSummary: string;
  totalQuantity: number;
  originWarehouses: string[];
  destinationCity: string;
  status: "ALLOCATION_NEEDED" | "PACKING" | "DISPATCHED" | "DELIVERED";
  carrier: string;
  trackingNumber?: string;
  dispatchDate: string;
}

const SAMPLE_FULFILMENTS: FulfilmentOrder[] = [
  {
    id: "ful-1",
    dealId: "DF-2048",
    customerName: "Nova Retail Innovations",
    productSummary: "Enterprise Heavy Duty Laptops & Workstations",
    totalQuantity: 50,
    originWarehouses: ["Mumbai Hub (30)", "Pune Unit (20)"],
    destinationCity: "Bengaluru, Karnataka",
    status: "ALLOCATION_NEEDED",
    carrier: "BlueDart Supply Chain",
    trackingNumber: "BD99281048",
    dispatchDate: "2026-09-07"
  },
  {
    id: "ful-2",
    dealId: "DF-1985",
    customerName: "Bharat Heavy Forge Corp",
    productSummary: "Industrial Solenoid Valves CETOP 3",
    totalQuantity: 120,
    originWarehouses: ["Bhiwandi Central Hub (120)"],
    destinationCity: "Jamshedpur, Jharkhand",
    status: "DISPATCHED",
    carrier: "GATI KWE Express",
    trackingNumber: "GATI-8829103",
    dispatchDate: "2026-09-03"
  },
  {
    id: "ful-3",
    dealId: "DF-1990",
    customerName: "Apex Logistics India",
    productSummary: "ABB Industrial Variable Frequency Drives 7.5kW",
    totalQuantity: 15,
    originWarehouses: ["Whitefield Supply Depot (15)"],
    destinationCity: "Hyderabad, Telangana",
    status: "PACKING",
    carrier: "Delhivery Surface",
    trackingNumber: "DEL-4491028",
    dispatchDate: "2026-09-06"
  },
  {
    id: "ful-4",
    dealId: "DF-2055",
    customerName: "Zenith Precision Tools",
    productSummary: "SKF Deep Groove High Temp Ball Bearings",
    totalQuantity: 400,
    originWarehouses: ["Chakan Industrial Park (400)"],
    destinationCity: "Ludhiana, Punjab",
    status: "DELIVERED",
    carrier: "Safexpress Logistics",
    trackingNumber: "SAFE-1029482",
    dispatchDate: "2026-08-31"
  }
];

export default function FulfilmentListPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filtered = SAMPLE_FULFILMENTS.filter((f) => {
    const match = 
      f.dealId.toLowerCase().includes(search.toLowerCase()) ||
      f.customerName.toLowerCase().includes(search.toLowerCase()) ||
      f.productSummary.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "ALL" || f.status === statusFilter;
    return match && matchStatus;
  });

  return (
    <WorkspaceLayout role={UserRole.FINANCE_OPERATIONS}>
      <div className="space-y-6 md:space-y-8 pb-16">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-1">Operations Workspace</div>
            <h1 className="text-3xl lg:text-4xl font-bold text-navy tracking-tight mb-2">Fulfilment & Dispatch</h1>
            <p className="text-navy/60 font-medium text-sm md:text-base">
              Manage multi-warehouse stock allocations, freight manifests, and proof of delivery.
            </p>
          </div>

          <button 
            onClick={() => router.push("/operations/fulfilment/DF-2048")}
            className="px-5 py-2.5 rounded-xl font-bold text-white bg-navy shadow-lg shadow-navy/20 hover:bg-navy/90 transition-all text-sm flex items-center gap-2 self-start md:self-auto"
          >
            <Boxes className="w-4 h-4" /> Multi-Hub Allocator
          </button>
        </div>

        {/* METRICS */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-navy/5 shadow-sm">
            <div className="text-[10px] font-bold text-orange-600 uppercase tracking-widest mb-1">REQUIRES ATTENTION</div>
            <div className="text-2xl font-bold text-orange-600">1 Order</div>
            <div className="text-xs text-navy/60 mt-1 font-medium">Split warehouse allocation needed</div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-navy/5 shadow-sm">
            <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-1">PACKING & STAGING</div>
            <div className="text-2xl font-bold text-navy">1 Order</div>
            <div className="text-xs text-navy/60 mt-1 font-medium">Warehouse packaging verified</div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-navy/5 shadow-sm">
            <div className="text-[10px] font-bold text-cobalt uppercase tracking-widest mb-1">IN TRANSIT / DISPATCHED</div>
            <div className="text-2xl font-bold text-cobalt">1 Consignment</div>
            <div className="text-xs text-navy/60 mt-1 font-medium">GATI tracking active</div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-navy/5 shadow-sm">
            <div className="text-[10px] font-bold text-lime-700 uppercase tracking-widest mb-1">DELIVERED & VERIFIED</div>
            <div className="text-2xl font-bold text-lime-700">1 Order</div>
            <div className="text-xs text-navy/60 mt-1 font-medium">Ready for escrow release</div>
          </div>
        </div>

        {/* FILTERS */}
        <div className="bg-white rounded-2xl p-4 border border-navy/5 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-navy/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search deal ref, customer, or items..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-navy/5 rounded-xl text-sm font-medium text-navy placeholder:text-navy/40 focus:outline-none focus:ring-2 focus:ring-navy/20"
            />
          </div>

          <div className="flex bg-navy/5 p-1 rounded-xl text-xs font-bold overflow-x-auto w-full md:w-auto">
            {["ALL", "ALLOCATION_NEEDED", "PACKING", "DISPATCHED", "DELIVERED"].map((st) => (
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
                  <th className="py-4 px-6">Customer</th>
                  <th className="py-4 px-6">Items & Quantity</th>
                  <th className="py-4 px-6">Origin Warehouses</th>
                  <th className="py-4 px-6">Destination</th>
                  <th className="py-4 px-6">Fulfilment Status</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy/5 text-sm">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-navy/[0.015] transition-colors">
                    <td className="py-4 px-6 font-bold text-cobalt">
                      {item.dealId}
                    </td>
                    <td className="py-4 px-6 font-semibold text-navy">
                      {item.customerName}
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-medium text-navy">{item.productSummary}</div>
                      <div className="text-xs text-navy/50">{item.totalQuantity} Units</div>
                    </td>
                    <td className="py-4 px-6 text-xs font-medium text-navy/70">
                      {item.originWarehouses.join(", ")}
                    </td>
                    <td className="py-4 px-6 text-xs font-medium text-navy/70 flex items-center gap-1 mt-4">
                      <MapPin className="w-3.5 h-3.5 text-navy/40" />
                      {item.destinationCity}
                    </td>
                    <td className="py-4 px-6">
                      <span className={cn(
                        "text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full inline-flex items-center gap-1",
                        item.status === "DELIVERED" && "bg-lime/20 text-lime-900 border border-lime/30",
                        item.status === "DISPATCHED" && "bg-cobalt/15 text-cobalt border border-cobalt/30",
                        item.status === "PACKING" && "bg-blue-500/15 text-blue-900 border border-blue-500/30",
                        item.status === "ALLOCATION_NEEDED" && "bg-orange-500/15 text-orange-900 border border-orange-500/30 animate-pulse"
                      )}>
                        {item.status === "ALLOCATION_NEEDED" && <AlertCircle className="w-3 h-3 text-orange-600" />}
                        {item.status === "DISPATCHED" && <Truck className="w-3 h-3" />}
                        {item.status === "DELIVERED" && <CheckCircle2 className="w-3 h-3 text-lime-700" />}
                        {item.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => router.push("/operations/fulfilment/" + item.dealId)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-cobalt hover:text-navy transition-colors bg-cobalt/5 hover:bg-cobalt/10 px-3 py-1.5 rounded-lg"
                      >
                        <Eye className="w-3.5 h-3.5" /> Details <ChevronRight className="w-3.5 h-3.5" />
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
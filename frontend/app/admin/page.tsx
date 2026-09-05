"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { Product, User } from "@/types";
import {
  ShieldCheck,
  Package,
  Layers,
  Percent,
  Warehouse,
  Plus,
  RefreshCw,
} from "lucide-react";

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const res = await api.get<Product[]>("/products");
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to load admin products", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="pb-6 border-b border-zinc-800 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-100 flex items-center gap-2.5">
            <ShieldCheck className="w-7 h-7 text-blue-500" />
            Platform Governance & Administration
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Master catalog configuration, discount ceiling policies, and warehouse dispatch parameters.
          </p>
        </div>
      </div>

      {/* Tabs / Configuration sections */}
      <div className="space-y-8">
        {/* Products & Policies Table */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2">
              <Package className="w-4 h-4 text-blue-400" />
              Category Discount Policy & Ceiling Limits
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400">
                  <th className="pb-2">Product Name</th>
                  <th className="pb-2">Category</th>
                  <th className="pb-2">Base Price</th>
                  <th className="pb-2">Type</th>
                  <th className="pb-2 text-right">Policy Max Discount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-zinc-900/40">
                    <td className="py-3 font-semibold text-zinc-200">{p.name}</td>
                    <td className="py-3 text-zinc-400">{p.category?.name}</td>
                    <td className="py-3 font-mono text-zinc-300">
                      ₹{p.basePrice?.toLocaleString()}
                    </td>
                    <td className="py-3">
                      {p.isRecurring ? (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 border border-purple-800 text-purple-400 font-bold">
                          RECURRING
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                          ONE-TIME
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-right font-mono font-bold text-blue-400">
                      {((p.category?.maxDiscountPct || 0) * 100).toFixed(0)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Warehouses configuration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
            <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2 mb-3">
              <Warehouse className="w-4 h-4 text-zinc-400" />
              Configured Fulfillment Hubs
            </h3>
            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-zinc-950 border border-zinc-800/80 rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-semibold text-zinc-200">Main Warehouse Mumbai</p>
                  <p className="text-[10px] text-zinc-500">Shipping Weight Factor: 100 (Primary)</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-400">
                  ACTIVE
                </span>
              </div>
              <div className="p-3 bg-zinc-950 border border-zinc-800/80 rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-semibold text-zinc-200">East Depot Pune</p>
                  <p className="text-[10px] text-zinc-500">Shipping Weight Factor: 50 (Secondary)</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-400">
                  ACTIVE
                </span>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
            <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2 mb-3">
              <Percent className="w-4 h-4 text-zinc-400" />
              Approval Routing Escalation Tiers
            </h3>
            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-zinc-950 border border-zinc-800/80 rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-semibold text-zinc-200">Tier 1: Risk &le; 0%</p>
                  <p className="text-[10px] text-zinc-500">Auto-approved by policy engine</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400">
                  AUTO
                </span>
              </div>
              <div className="p-3 bg-zinc-950 border border-zinc-800/80 rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-semibold text-zinc-200">Tier 2: Risk &gt; 0% &le; 8%</p>
                  <p className="text-[10px] text-zinc-500">L1 Approval: Sales Manager review required</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-400">
                  L1 REVIEW
                </span>
              </div>
              <div className="p-3 bg-zinc-950 border border-zinc-800/80 rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-semibold text-zinc-200">Tier 3: Risk &gt; 8%</p>
                  <p className="text-[10px] text-zinc-500">L1 + L2 Approval: Sales Manager + Finance review</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-950 text-red-400">
                  L1+L2 REVIEW
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
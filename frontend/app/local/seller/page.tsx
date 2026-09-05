"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { Product } from "@/types";
import {
  Store,
  Plus,
  PackageCheck,
  DollarSign,
  Star,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  Clock,
  CheckCircle2,
} from "lucide-react";

export default function SellerDashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSellerProducts = async () => {
      try {
        const res = await api.get<Product[]>("/products");
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to load seller catalog", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSellerProducts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-100 flex items-center gap-2.5">
              <Store className="w-7 h-7 text-amber-400" />
              Seller Operations Hub
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-950/60 border border-amber-800 text-amber-400">
              🥇 GOLD MERCHANT
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            Manage local inventory, verify customer delivery OTPs, and track escrow settlements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/local"
            className="px-3.5 py-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-200 rounded-lg text-xs font-semibold transition"
          >
            View Live Shopfront
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-xl">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-semibold">Active Shop Listings</span>
            <Store className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-black text-zinc-100 font-mono">{products.length}</p>
          <p className="text-[10px] text-zinc-500 mt-1">Listed across electronics & accessories</p>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-xl">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-semibold">Trust Tier Rating</span>
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>
          <p className="text-2xl font-black text-amber-400 font-mono">4.9 / 5.0</p>
          <p className="text-[10px] text-zinc-500 mt-1">Based on 42 verified local trades</p>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-xl">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-semibold">Escrow Funds Pending</span>
            <Clock className="w-4 h-4 text-yellow-400" />
          </div>
          <p className="text-2xl font-black text-yellow-400 font-mono">₹14,990</p>
          <p className="text-[10px] text-zinc-500 mt-1">Releasing upon delivery proof</p>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 p-5 rounded-xl">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-semibold">Settled Merchant Payouts</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-emerald-400 font-mono">₹1,84,320</p>
          <p className="text-[10px] text-emerald-400 mt-1">Net of 2% platform fee</p>
        </div>
      </div>

      {/* Product Listings Table */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
        <h2 className="text-sm font-bold text-zinc-200 mb-4 flex items-center justify-between">
          <span>Active Products In Your Store</span>
          <span className="text-xs text-zinc-400 font-normal">Auto-synced with PostgreSQL database</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400">
                <th className="pb-2">Product Name</th>
                <th className="pb-2">Category</th>
                <th className="pb-2">Price</th>
                <th className="pb-2">Status</th>
                <th className="pb-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-zinc-900/40">
                  <td className="py-3 font-semibold text-zinc-200">{p.name}</td>
                  <td className="py-3 text-zinc-400">{p.category?.name || "General"}</td>
                  <td className="py-3 font-mono font-bold text-zinc-100">
                    ₹{p.basePrice?.toLocaleString()}
                  </td>
                  <td className="py-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-400">
                      LIVE IN MARKETPLACE
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <Link
                      href={`/local/checkout/${p.id}`}
                      className="text-blue-400 hover:underline font-semibold"
                    >
                      Test UPI Checkout →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
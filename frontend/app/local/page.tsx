"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { Product } from "@/types";
import {
  ShoppingBag,
  ShieldCheck,
  Star,
  Search,
  CreditCard,
  ArrowRight,
  PlusCircle
} from "lucide-react";

export default function LocalModeHome() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchLocalCatalog = async (q = "") => {
    setLoading(true);
    try {
      const res = await api.get<any[]>("/products" + (q ? `?q=${encodeURIComponent(q)}` : ""));
      setProducts(res.data as any[]);
    } catch (err) {
      console.error("Failed to load local marketplace", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocalCatalog();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLocalCatalog(searchQuery);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white min-h-screen">
      {/* Banner / Trust Assurance */}
      <div className="rounded-2xl bg-blue-50 border border-blue-200 p-6 sm:p-8 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-blue-200 text-blue-700 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> Escrow-Guaranteed Local Trade
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-gray-900">
            Local Marketplace with Zero-Scam Trust
          </h1>
          <p className="text-xs sm:text-sm text-gray-700">
            Funds are locked safely in DEV FLOW escrow until buyer approves delivery. 2% platform fee deducted transparently on payout.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
          <Link
            href="/local/seller"
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
          >
            <PlusCircle className="w-4 h-4 text-blue-600" />
            Sell Your Products
          </Link>
        </div>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search local shops, products, electronics (press enter)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition shadow-sm"
          />
        </div>
        <button type="submit" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition shadow-sm">
          Search
        </button>
      </form>

      {/* Catalog Grid */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Searching...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {products.map((p) => {
            const tier = p.basePrice > 50000 ? "GOLD" : p.basePrice > 10000 ? "SILVER" : "BRONZE";
            return (
              <div
                key={p.id}
                className="bg-white border border-gray-200 hover:border-blue-200 rounded-2xl overflow-hidden flex flex-col justify-between transition shadow-sm hover:shadow-md group"
              >
                {/* Image Placeholder or Actual Image */}
                <div className="w-full h-48 bg-gray-100 border-b border-gray-100 flex items-center justify-center overflow-hidden">
                   {p.imageUrl ? (
                     <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                   ) : (
                     <ShoppingBag className="w-12 h-12 text-gray-300" />
                   )}
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        tier === "GOLD"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : tier === "SILVER"
                          ? "bg-slate-50 text-slate-700 border-slate-200"
                          : "bg-orange-50 text-orange-700 border-orange-200"
                      }`}
                    >
                      🥇 {tier} VENDOR
                    </span>
                    <div className="flex items-center gap-1 text-xs text-amber-600 font-semibold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      4.8
                    </div>
                  </div>

                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition leading-tight mb-1">
                    {p.name}
                  </h3>
                  <p className="text-xs text-gray-500 mb-4 flex-1">
                    {p.category?.name || "General"} • Nearby Shop
                  </p>

                  <div className="pt-4 border-t border-gray-100 flex items-end justify-between mt-auto">
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase font-semibold mb-0.5">Listed Price</p>
                      <p className="text-lg font-black text-gray-900 font-mono">
                        ₹{p.basePrice.toLocaleString()}
                      </p>
                    </div>
                    <Link
                      href={`/local/checkout/${p.id}`}
                      className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white text-xs font-semibold rounded-lg transition"
                    >
                      Buy
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
          {products.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500">
              No products found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

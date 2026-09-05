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
  Filter,
  CreditCard,
  Truck,
  ArrowRight,
} from "lucide-react";

export default function LocalModeHome() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchLocalCatalog = async () => {
      try {
        const res = await api.get<Product[]>("/products");
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to load local marketplace", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLocalCatalog();
  }, []);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Banner / Trust Assurance */}
      <div className="rounded-2xl  bg-blue-50   border border-blue-200 p-6 sm:p-8 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-600 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5" /> Escrow-Guaranteed Local Trade
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-gray-900">
            Local Marketplace with Zero-Scam Trust
          </h1>
          <p className="text-xs sm:text-sm text-gray-600">
            Funds are locked safely in DEV FLOW escrow until buyer approves delivery. 2% platform fee deducted transparently on payout.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
          <Link
            href="/local/checkout/1"
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30"
          >
            <CreditCard className="w-4 h-4" />
            Test Mock UPI Checkout
          </Link>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search local shops, products, electronics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
          />
        </div>
      </div>

      {/* Catalog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProducts.map((p) => {
          // Rule-based dummy tier assignment for showcase
          const tier = p.basePrice > 50000 ? "GOLD" : p.basePrice > 10000 ? "SILVER" : "BRONZE";
          return (
            <div
              key={p.id}
              className="bg-gray-50 border border-gray-200 hover:border-gray-300 rounded-xl p-5 flex flex-col justify-between transition shadow-sm group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      tier === "GOLD"
                        ? "bg-amber-100/60 text-amber-600 border-amber-200"
                        : tier === "SILVER"
                        ? "bg-gray-100 text-gray-600 border-gray-300"
                        : "bg-orange-100 text-orange-600 border-orange-200"
                    }`}
                  >
                    🥇 {tier} VENDOR
                  </span>
                  <div className="flex items-center gap-1 text-xs text-amber-600 font-semibold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    4.8 (24)
                  </div>
                </div>

                <h3 className="font-bold text-base text-gray-800 group-hover:text-blue-600 transition mb-1">
                  {p.name}
                </h3>
                <p className="text-xs text-gray-500 mb-4">
                  Category: {p.category?.name} • Nearby Shop Verified
                </p>
              </div>

              <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-semibold">Listed Price</p>
                  <p className="text-lg font-black text-gray-800 font-mono">
                    ₹{p.basePrice.toLocaleString()}
                  </p>
                </div>
                <Link
                  href={`/local/checkout/${p.id}`}
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5 shadow-sm"
                >
                  Buy with UPI <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
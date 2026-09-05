"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { Product, SellerLeaderboardEntry } from "@/types";
import {
  ShieldCheck,
  Package,
  Percent,
  Warehouse,
  Trophy,
  ExternalLink,
  Store,
  ShoppingBag,
} from "lucide-react";

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [leaderboard, setLeaderboard] = useState<SellerLeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [prodRes, lbRes] = await Promise.all([
          api.get<Product[]>("/products"),
          api.get<SellerLeaderboardEntry[]>("/ratings/leaderboard"),
        ]);
        setProducts(prodRes.data);
        setLeaderboard(lbRes.data);
      } catch (err) {
        console.error("Failed to load admin data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  const tierCounts = {
    GOLD: leaderboard.filter((s) => s.tier === "GOLD").length,
    SILVER: leaderboard.filter((s) => s.tier === "SILVER").length,
    BRONZE: leaderboard.filter((s) => s.tier === "BRONZE").length,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="pb-6 border-b border-gray-200 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-800 flex items-center gap-2.5">
            <ShieldCheck className="w-7 h-7 text-blue-500" />
            Platform Governance &amp; Administration
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Master catalog configuration, discount ceiling policies, and warehouse dispatch parameters.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/local/seller"
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
          >
            <Store className="w-4 h-4" />
            Seller Hub (List Product)
          </Link>
          <Link
            href="/local"
            className="px-3.5 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
          >
            <ShoppingBag className="w-4 h-4 text-blue-600" />
            Marketplace
          </Link>
        </div>
      </div>

      <div className="space-y-8">
        {/* ── Seller Tier Summary ─────────────────────────────────── */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 sm:p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              Seller Trust &amp; Tier Overview
            </h2>
            <Link
              href="/reviews"
              className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold transition-colors"
            >
              View Leaderboard
              <ExternalLink size={11} />
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-5">
            {(["GOLD", "SILVER", "BRONZE"] as const).map((tier) => {
              const cfg = {
                GOLD: {
                  emoji: "🥇",
                  label: "Gold",
                  color: "text-yellow-400",
                  border: "border-yellow-500/30",
                  bg: "bg-yellow-500/5",
                },
                SILVER: {
                  emoji: "🥈",
                  label: "Silver",
                  color: "text-slate-300",
                  border: "border-slate-400/30",
                  bg: "bg-slate-400/5",
                },
                BRONZE: {
                  emoji: "🥉",
                  label: "Bronze",
                  color: "text-orange-500",
                  border: "border-orange-600/30",
                  bg: "bg-orange-600/5",
                },
              }[tier];
              return (
                <div
                  key={tier}
                  className={`p-4 rounded-xl border ${cfg.border} ${cfg.bg}`}
                >
                  <div className="text-xl mb-2">{cfg.emoji}</div>
                  <div className="text-2xl font-black text-white">
                    {tierCounts[tier]}
                  </div>
                  <div className={`text-xs font-semibold mt-0.5 ${cfg.color}`}>
                    {cfg.label} Sellers
                  </div>
                </div>
              );
            })}
          </div>

          {/* Top sellers mini-list */}
          {leaderboard.length > 0 && (
            <div className="space-y-2">
              <p className="text-[10px] text-zinc-600 uppercase font-semibold tracking-wider mb-2">
                Top Performers
              </p>
              {leaderboard.slice(0, 5).map((s, idx) => {
                const tierEmoji =
                  s.tier === "GOLD"
                    ? "🥇"
                    : s.tier === "SILVER"
                    ? "🥈"
                    : "🥉";
                return (
                  <div
                    key={s.sellerId}
                    className="flex items-center justify-between px-3 py-2 bg-zinc-900 rounded-lg"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-bold text-zinc-600 w-4">
                        #{idx + 1}
                      </span>
                      <span className="text-xs font-semibold text-zinc-200">
                        {s.displayName || s.email}
                      </span>
                      <span className="text-[10px]">{tierEmoji}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-zinc-500">
                      <span>{s.avgStars.toFixed(1)}★</span>
                      <span>{s.reviewCount} reviews</span>
                    </div>
                  </div>
                );
              })}
              <Link
                href="/reviews"
                className="block text-center text-xs text-zinc-600 hover:text-amber-400 mt-2 py-1 transition-colors"
              >
                View all sellers →
              </Link>
            </div>
          )}

          {leaderboard.length === 0 && !loading && (
            <p className="text-xs text-zinc-600 text-center py-4">
              No sellers on the leaderboard yet.{" "}
              <Link href="/reviews/submit" className="text-amber-500 hover:text-amber-400">
                Submit the first review →
              </Link>
            </p>
          )}
        </div>

        {/* Products & Policies Table */}
        <div className="bg-gray-50/50 border border-gray-200 rounded-xl p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
              <Package className="w-4 h-4 text-blue-400" />
              Category Discount Policy &amp; Ceiling Limits
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500">
                  <th className="pb-2">Product Name</th>
                  <th className="pb-2">Category</th>
                  <th className="pb-2">Base Price</th>
                  <th className="pb-2">Type</th>
                  <th className="pb-2 text-right">Policy Max Discount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/40">
                    <td className="py-3 font-semibold text-zinc-200">{p.name}</td>
                    <td className="py-3 text-gray-500">{p.category?.name}</td>
                    <td className="py-3 font-mono text-gray-600">
                      ₹{p.basePrice?.toLocaleString()}
                    </td>
                    <td className="py-3">
                      {p.isRecurring ? (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 border border-purple-800 text-purple-400 font-bold">
                          RECURRING
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-100 text-gray-500">
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
          <div className="bg-gray-50/50 border border-gray-200 rounded-xl p-5">
            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2 mb-3">
              <Warehouse className="w-4 h-4 text-gray-500" />
              Configured Fulfillment Hubs
            </h3>
            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-white border border-gray-200/80 rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-semibold text-zinc-200">Main Warehouse Mumbai</p>
                  <p className="text-[10px] text-gray-9000">Shipping Weight Factor: 100 (Primary)</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-400">
                  ACTIVE
                </span>
              </div>
              <div className="p-3 bg-white border border-gray-200/80 rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-semibold text-zinc-200">East Depot Pune</p>
                  <p className="text-[10px] text-gray-9000">Shipping Weight Factor: 50 (Secondary)</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-400">
                  ACTIVE
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50/50 border border-gray-200 rounded-xl p-5">
            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2 mb-3">
              <Percent className="w-4 h-4 text-gray-500" />
              Approval Routing Escalation Tiers
            </h3>
            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-white border border-gray-200/80 rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-semibold text-zinc-200">Tier 1: Risk &le; 0%</p>
                  <p className="text-[10px] text-gray-9000">Auto-approved by policy engine</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400">
                  AUTO
                </span>
              </div>
              <div className="p-3 bg-white border border-gray-200/80 rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-semibold text-zinc-200">Tier 2: Risk &gt; 0% &le; 8%</p>
                  <p className="text-[10px] text-gray-9000">L1 Approval: Sales Manager review required</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-400">
                  L1 REVIEW
                </span>
              </div>
              <div className="p-3 bg-white border border-gray-200/80 rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-semibold text-zinc-200">Tier 3: Risk &gt; 8%</p>
                  <p className="text-[10px] text-gray-9000">L1 + L2 Approval: Sales Manager + Finance review</p>
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

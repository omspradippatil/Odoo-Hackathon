"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { SellerLeaderboardEntry, Rating, UserTier } from "@/types";
import {
  Trophy,
  Star,
  Medal,
  Search,
  RefreshCw,
  X,
  ShoppingBag,
  MessageSquare,
  TrendingUp,
  Plus,
  ChevronRight,
  Award,
} from "lucide-react";

// ─── Tier configuration ───────────────────────────────────────────
const TIER_CONFIG: Record<
  UserTier,
  { label: string; emoji: string; gradient: string; glow: string; border: string; badge: string; rank: string }
> = {
  GOLD: {
    label: "Gold",
    emoji: "🥇",
    gradient: "from-yellow-400 via-amber-300 to-yellow-500",
    glow: "shadow-[0_0_24px_rgba(234,179,8,0.4)]",
    border: "border-yellow-400/50",
    badge: "bg-gradient-to-r from-yellow-500 to-amber-400 text-yellow-950",
    rank: "text-yellow-400",
  },
  SILVER: {
    label: "Silver",
    emoji: "🥈",
    gradient: "from-slate-300 via-gray-200 to-slate-400",
    glow: "shadow-[0_0_24px_rgba(148,163,184,0.35)]",
    border: "border-slate-400/50",
    badge: "bg-gradient-to-r from-slate-400 to-gray-300 text-slate-900",
    rank: "text-slate-300",
  },
  BRONZE: {
    label: "Bronze",
    emoji: "🥉",
    gradient: "from-orange-700 via-amber-600 to-orange-800",
    glow: "shadow-[0_0_24px_rgba(180,83,9,0.35)]",
    border: "border-orange-700/50",
    badge: "bg-gradient-to-r from-orange-700 to-amber-600 text-orange-100",
    rank: "text-orange-400",
  },
};

// ─── Star renderer ────────────────────────────────────────────────
function StarRow({ avg, size = 14 }: { avg: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => {
        const fill = Math.min(1, Math.max(0, avg - (i - 1)));
        return (
          <div key={i} className="relative" style={{ width: size, height: size }}>
            <Star
              size={size}
              className="absolute inset-0 text-zinc-700"
              fill="currentColor"
            />
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${fill * 100}%` }}
            >
              <Star
                size={size}
                className="text-amber-400"
                fill="currentColor"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Review modal ─────────────────────────────────────────────────
function ReviewModal({
  seller,
  onClose,
}: {
  seller: SellerLeaderboardEntry;
  onClose: () => void;
}) {
  const [reviews, setReviews] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);
  const cfg = TIER_CONFIG[seller.tier];

  useEffect(() => {
    api
      .get<Rating[]>(`/ratings/seller/${seller.sellerId}`)
      .then((r) => setReviews(r.data))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, [seller.sellerId]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-zinc-900 border border-zinc-700 rounded-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className={`p-5 border-b border-zinc-800`}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full ${cfg.badge}`}
                >
                  {cfg.emoji} {cfg.label} Seller
                </span>
              </div>
              <h3 className="text-lg font-black text-white">
                {seller.displayName || seller.email}
              </h3>
              {seller.companyName && (
                <p className="text-xs text-zinc-400 mt-0.5">{seller.companyName}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-zinc-500 hover:text-zinc-300 transition-colors mt-1"
            >
              <X size={18} />
            </button>
          </div>
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1.5">
              <StarRow avg={seller.avgStars} size={13} />
              <span className="text-sm font-bold text-white">
                {seller.avgStars.toFixed(1)}
              </span>
            </div>
            <span className="text-xs text-zinc-500">·</span>
            <span className="text-xs text-zinc-400">
              {seller.reviewCount} review{seller.reviewCount !== 1 ? "s" : ""}
            </span>
            <span className="text-xs text-zinc-500">·</span>
            <span className="text-xs text-zinc-400">
              {seller.totalTransactions} transactions
            </span>
          </div>
          {seller.aiSummary && (
            <p className="mt-3 text-xs text-zinc-400 italic leading-relaxed bg-zinc-800 rounded-lg px-3 py-2">
              {seller.aiSummary}
            </p>
          )}
        </div>

        {/* Reviews list */}
        <div className="max-h-80 overflow-y-auto p-4 space-y-3">
          {loading && (
            <div className="flex justify-center py-8">
              <RefreshCw className="w-5 h-5 animate-spin text-zinc-500" />
            </div>
          )}
          {!loading && reviews.length === 0 && (
            <p className="text-center text-xs text-zinc-500 py-8">
              No reviews yet for this seller.
            </p>
          )}
          {reviews.map((r) => (
            <div
              key={r.id}
              className="p-3 bg-zinc-800 rounded-xl border border-zinc-700"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <StarRow avg={r.stars} size={12} />
                  <span className="text-xs font-bold text-white">{r.stars}/5</span>
                </div>
                <span className="text-[10px] text-zinc-500">
                  {r.createdAt
                    ? new Date(r.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : ""}
                </span>
              </div>
              {r.reviewText && (
                <p className="text-xs text-zinc-300 leading-relaxed">
                  "{r.reviewText}"
                </p>
              )}
              {r.rater && (
                <p className="text-[10px] text-zinc-500 mt-1.5">
                  — {r.rater.displayName || r.rater.email}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Seller Card ──────────────────────────────────────────────────
function SellerCard({
  seller,
  rank,
  onClick,
}: {
  seller: SellerLeaderboardEntry;
  rank: number;
  onClick: () => void;
}) {
  const cfg = TIER_CONFIG[seller.tier];
  const isTop3 = rank <= 3;

  return (
    <button
      onClick={onClick}
      className={`
        group w-full text-left p-5 rounded-2xl border transition-all duration-300
        bg-zinc-900 hover:bg-zinc-800
        ${cfg.border}
        ${isTop3 ? cfg.glow : "hover:shadow-lg hover:shadow-black/40"}
        hover:-translate-y-0.5
      `}
    >
      <div className="flex items-start gap-4">
        {/* Rank */}
        <div
          className={`
            flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center
            font-black text-sm
            ${isTop3
              ? `bg-gradient-to-br ${cfg.gradient} text-zinc-950`
              : "bg-zinc-800 text-zinc-500"}
          `}
        >
          {rank <= 3 ? cfg.emoji : `#${rank}`}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-white text-sm truncate">
              {seller.displayName || seller.email}
            </h3>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${cfg.badge}`}
            >
              {cfg.label}
            </span>
          </div>
          {seller.companyName && (
            <p className="text-xs text-zinc-500 mt-0.5 truncate">
              {seller.companyName}
            </p>
          )}

          {/* Stats row */}
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <div className="flex items-center gap-1.5">
              <StarRow avg={seller.avgStars} size={12} />
              <span className="text-xs font-bold text-white">
                {seller.avgStars.toFixed(1)}
              </span>
            </div>
            <span className="text-[10px] text-zinc-600">·</span>
            <span className="text-[11px] text-zinc-400 flex items-center gap-1">
              <MessageSquare size={10} />
              {seller.reviewCount} review{seller.reviewCount !== 1 ? "s" : ""}
            </span>
            <span className="text-[10px] text-zinc-600">·</span>
            <span className="text-[11px] text-zinc-400 flex items-center gap-1">
              <ShoppingBag size={10} />
              {seller.totalTransactions} tx
            </span>
          </div>
        </div>

        {/* Arrow */}
        <ChevronRight
          size={16}
          className="text-zinc-600 group-hover:text-zinc-400 flex-shrink-0 mt-1 transition-colors"
        />
      </div>
    </button>
  );
}

// ─── Main Page ────────────────────────────────────────────────────
export default function ReviewsLeaderboardPage() {
  const [sellers, setSellers] = useState<SellerLeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState<UserTier | "ALL">("ALL");
  const [selectedSeller, setSelectedSeller] =
    useState<SellerLeaderboardEntry | null>(null);

  const fetchLeaderboard = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<SellerLeaderboardEntry[]>("/ratings/leaderboard");
      setSellers(res.data);
    } catch {
      setSellers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const filtered = sellers.filter((s) => {
    const matchTier = tierFilter === "ALL" || s.tier === tierFilter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      (s.displayName || "").toLowerCase().includes(q) ||
      (s.companyName || "").toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q);
    return matchTier && matchSearch;
  });

  // Tier summary counts
  const counts = {
    GOLD: sellers.filter((s) => s.tier === "GOLD").length,
    SILVER: sellers.filter((s) => s.tier === "SILVER").length,
    BRONZE: sellers.filter((s) => s.tier === "BRONZE").length,
  };

  const TABS: { key: UserTier | "ALL"; label: string; count?: number }[] = [
    { key: "ALL", label: "All Sellers", count: sellers.length },
    { key: "GOLD", label: "🥇 Gold", count: counts.GOLD },
    { key: "SILVER", label: "🥈 Silver", count: counts.SILVER },
    { key: "BRONZE", label: "🥉 Bronze", count: counts.BRONZE },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Background ambient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-3xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center shadow-[0_0_20px_rgba(234,179,8,0.4)]">
                  <Trophy size={18} className="text-zinc-950" />
                </div>
                <h1 className="text-2xl font-black text-white tracking-tight">
                  Seller Leaderboard
                </h1>
              </div>
              <p className="text-sm text-zinc-500 ml-11.5">
                Automatically ranked by verified buyer reviews. Tier updates in
                real-time after every review.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Link
                href="/reviews/submit"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold transition-colors shadow-lg shadow-amber-500/20"
              >
                <Plus size={13} />
                Write Review
              </Link>
              <button
                onClick={fetchLeaderboard}
                className="p-2 rounded-xl border border-zinc-700 hover:border-zinc-500 text-zinc-400 hover:text-zinc-200 transition-all"
              >
                <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              </button>
            </div>
          </div>

          {/* Tier summary cards */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            {(["GOLD", "SILVER", "BRONZE"] as UserTier[]).map((tier) => {
              const cfg = TIER_CONFIG[tier];
              return (
                <button
                  key={tier}
                  onClick={() =>
                    setTierFilter(tierFilter === tier ? "ALL" : tier)
                  }
                  className={`
                    p-4 rounded-2xl border text-left transition-all duration-200
                    ${tierFilter === tier
                      ? `bg-zinc-800 ${cfg.border} ${cfg.glow}`
                      : "bg-zinc-900 border-zinc-800 hover:border-zinc-700"}
                  `}
                >
                  <div className="text-xl mb-1.5">{cfg.emoji}</div>
                  <div className="text-2xl font-black text-white">{counts[tier]}</div>
                  <div className="text-xs text-zinc-500 mt-0.5">{cfg.label} Sellers</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Search + filter tabs */}
        <div className="space-y-3 mb-6">
          {/* Search */}
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
            />
            <input
              type="text"
              placeholder="Search sellers by name, company or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-9 pr-4 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/50 transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Tier tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setTierFilter(tab.key as typeof tierFilter)}
                className={`
                  flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
                  ${tierFilter === tab.key
                    ? "bg-zinc-700 text-white border border-zinc-600"
                    : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800"}
                `}
              >
                {tab.label}
                {tab.count !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      tierFilter === tab.key
                        ? "bg-zinc-600 text-zinc-300"
                        : "bg-zinc-800 text-zinc-600"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Seller list */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <RefreshCw className="w-7 h-7 animate-spin text-zinc-600" />
            <p className="text-sm text-zinc-600">Loading leaderboard…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Award size={32} className="text-zinc-700" />
            <p className="text-sm text-zinc-500">
              {search || tierFilter !== "ALL"
                ? "No sellers match your filter."
                : "No sellers on the leaderboard yet."}
            </p>
            {(search || tierFilter !== "ALL") && (
              <button
                onClick={() => { setSearch(""); setTierFilter("ALL"); }}
                className="text-xs text-amber-500 hover:text-amber-400"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((seller, idx) => {
              // Rank is global position (before filtering)
              const globalRank = sellers.findIndex((s) => s.sellerId === seller.sellerId) + 1;
              return (
                <SellerCard
                  key={seller.sellerId}
                  seller={seller}
                  rank={globalRank}
                  onClick={() => setSelectedSeller(seller)}
                />
              );
            })}
          </div>
        )}

        {/* Tier rules legend */}
        <div className="mt-10 p-5 bg-zinc-900 border border-zinc-800 rounded-2xl">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={14} className="text-zinc-500" />
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Tier Classification Rules
            </h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(["GOLD", "SILVER", "BRONZE"] as UserTier[]).map((tier) => {
              const cfg = TIER_CONFIG[tier];
              const rules: Record<UserTier, string> = {
                GOLD: "Avg ≥ 4.5 ★ and ≥ 20 transactions",
                SILVER: "Avg ≥ 3.8 ★ and ≥ 10 transactions",
                BRONZE: "Below Silver threshold",
              };
              return (
                <div
                  key={tier}
                  className={`p-3 rounded-xl border ${cfg.border} bg-zinc-950`}
                >
                  <div className="text-base mb-1">{cfg.emoji}</div>
                  <div className={`text-xs font-bold bg-gradient-to-r ${cfg.gradient} bg-clip-text text-transparent`}>
                    {cfg.label}
                  </div>
                  <div className="text-[11px] text-zinc-500 mt-1">{rules[tier]}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Review modal */}
      {selectedSeller && (
        <ReviewModal
          seller={selectedSeller}
          onClose={() => setSelectedSeller(null)}
        />
      )}
    </div>
  );
}

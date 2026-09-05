"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { SellerLeaderboardEntry, UserTier } from "@/types";
import {
  Star,
  Send,
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Trophy,
  MessageSquare,
  ChevronDown,
} from "lucide-react";

// ─── Tier badge ────────────────────────────────────────────────────
const TIER_CONFIG: Record<
  UserTier,
  { label: string; emoji: string; color: string; bar: string }
> = {
  GOLD: {
    label: "Gold",
    emoji: "🥇",
    color: "text-yellow-400",
    bar: "bg-yellow-400",
  },
  SILVER: {
    label: "Silver",
    emoji: "🥈",
    color: "text-slate-300",
    bar: "bg-slate-300",
  },
  BRONZE: {
    label: "Bronze",
    emoji: "🥉",
    color: "text-orange-500",
    bar: "bg-orange-500",
  },
};

// ─── Interactive star picker ───────────────────────────────────────
function StarPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  const display = hovered || value;

  const labels = ["", "Terrible", "Poor", "Average", "Good", "Excellent"];
  const colors = [
    "",
    "text-red-400",
    "text-orange-400",
    "text-yellow-400",
    "text-lime-400",
    "text-emerald-400",
  ];

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <button
            key={i}
            type="button"
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => onChange(i)}
            className="transition-transform hover:scale-110 focus:outline-none"
            style={{ filter: display >= i ? "drop-shadow(0 0 6px rgba(251,191,36,0.7))" : "none" }}
          >
            <Star
              size={36}
              className={`transition-colors ${
                display >= i ? "text-amber-400" : "text-zinc-700"
              }`}
              fill={display >= i ? "currentColor" : "none"}
            />
          </button>
        ))}
      </div>
      <div
        className={`text-sm font-bold transition-all ${
          display ? colors[display] : "text-zinc-600"
        }`}
      >
        {display ? labels[display] : "Tap to rate"}
      </div>
    </div>
  );
}

// ─── Projected tier indicator ─────────────────────────────────────
function ProjectedTier({
  current,
  avgStars,
  reviewCount,
  newStar,
  totalTx,
}: {
  current: UserTier;
  avgStars: number;
  reviewCount: number;
  newStar: number;
  totalTx: number;
}) {
  // Compute projected average
  const projectedAvg =
    newStar > 0
      ? (avgStars * reviewCount + newStar) / (reviewCount + 1)
      : avgStars;

  const projectedTier: UserTier =
    projectedAvg >= 4.5 && totalTx >= 20
      ? "GOLD"
      : projectedAvg >= 3.8 && totalTx >= 10
      ? "SILVER"
      : "BRONZE";

  const changed = projectedTier !== current && newStar > 0;
  const cfg = TIER_CONFIG[projectedTier];
  const currCfg = TIER_CONFIG[current];

  return (
    <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl space-y-3">
      <p className="text-[11px] text-zinc-500 font-semibold uppercase tracking-wider">
        Seller Tier Impact Preview
      </p>
      <div className="flex items-center justify-between gap-4">
        {/* Current */}
        <div className="text-center">
          <div className="text-2xl">{currCfg.emoji}</div>
          <div className={`text-xs font-bold mt-0.5 ${currCfg.color}`}>
            {currCfg.label}
          </div>
          <div className="text-[10px] text-zinc-600 mt-0.5">Current</div>
        </div>

        {/* Arrow */}
        <div className="flex-1 text-center">
          {changed ? (
            <div className="text-[10px] text-zinc-400">
              {projectedTier === "GOLD" && current !== "GOLD"
                ? "🎉 Tier upgrade!"
                : projectedTier === "BRONZE" && current !== "BRONZE"
                ? "⚠️ Tier drop"
                : "→ Changes"}
            </div>
          ) : (
            <div className="text-[10px] text-zinc-600">→ No change</div>
          )}
          <div className="mt-1 text-[10px] text-zinc-500">
            Projected avg: {projectedAvg.toFixed(2)}★
          </div>
        </div>

        {/* Projected */}
        <div className="text-center">
          <div className="text-2xl">{cfg.emoji}</div>
          <div className={`text-xs font-bold mt-0.5 ${cfg.color}`}>
            {cfg.label}
          </div>
          <div className="text-[10px] text-zinc-600 mt-0.5">After review</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-[10px] text-zinc-500">
          <span>Avg rating</span>
          <span>{newStar > 0 ? projectedAvg.toFixed(2) : avgStars.toFixed(2)} / 5.0</span>
        </div>
        <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${cfg.bar}`}
            style={{
              width: `${Math.min(100, ((newStar > 0 ? projectedAvg : avgStars) / 5) * 100)}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────
export default function SubmitReviewPage() {
  const [sellers, setSellers] = useState<SellerLeaderboardEntry[]>([]);
  const [loadingSellers, setLoadingSellers] = useState(true);
  const [selectedSellerId, setSelectedSellerId] = useState<number | "">("");
  const [stars, setStars] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get<SellerLeaderboardEntry[]>("/ratings/leaderboard")
      .then((r) => setSellers(r.data))
      .catch(() => setSellers([]))
      .finally(() => setLoadingSellers(false));
  }, []);

  const selectedSeller = sellers.find((s) => s.sellerId === selectedSellerId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSellerId || stars === 0) {
      setError("Please select a seller and give a star rating.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      await api.post("/ratings", {
        ratee: { id: selectedSellerId },
        stars,
        reviewText: reviewText.trim() || null,
      });
      setSuccess(true);
      setStars(0);
      setReviewText("");
      setSelectedSellerId("");
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Failed to submit review. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Background ambient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-lg mx-auto px-4 py-10">
        {/* Back link */}
        <Link
          href="/reviews"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 mb-8 transition-colors"
        >
          <ChevronLeft size={13} />
          Back to Leaderboard
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center shadow-[0_0_20px_rgba(234,179,8,0.35)]">
              <MessageSquare size={18} className="text-zinc-950" />
            </div>
            <h1 className="text-2xl font-black text-white">Write a Review</h1>
          </div>
          <p className="text-sm text-zinc-500 ml-13">
            Your review is verified and automatically updates the seller's tier
            in real-time.
          </p>
        </div>

        {/* Success state */}
        {success && (
          <div className="mb-6 p-5 bg-emerald-950 border border-emerald-800 rounded-2xl flex items-start gap-3 animate-pulse-once">
            <CheckCircle2 size={20} className="text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-emerald-300">
                Review submitted successfully!
              </p>
              <p className="text-xs text-emerald-500 mt-0.5">
                The seller's tier has been automatically recalculated.
              </p>
              <div className="flex gap-3 mt-3">
                <button
                  onClick={() => setSuccess(false)}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold underline"
                >
                  Write another review
                </button>
                <Link
                  href="/reviews"
                  className="text-xs text-zinc-400 hover:text-zinc-300"
                >
                  View leaderboard →
                </Link>
              </div>
            </div>
          </div>
        )}

        {!success && (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Seller selector */}
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider">
                Select Seller
              </label>
              <div className="relative">
                {loadingSellers ? (
                  <div className="flex items-center gap-2 px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-zinc-500">
                    <RefreshCw size={13} className="animate-spin" />
                    Loading sellers…
                  </div>
                ) : (
                  <>
                    <select
                      id="seller-select"
                      value={selectedSellerId}
                      onChange={(e) =>
                        setSelectedSellerId(
                          e.target.value ? Number(e.target.value) : ""
                        )
                      }
                      className="w-full appearance-none bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 pr-10 text-sm text-zinc-200 focus:outline-none focus:border-amber-500/60 transition-colors"
                    >
                      <option value="">Choose a seller to review…</option>
                      {sellers.map((s) => (
                        <option key={s.sellerId} value={s.sellerId}>
                          {TIER_CONFIG[s.tier].emoji}{" "}
                          {s.displayName || s.email}
                          {s.companyName ? ` · ${s.companyName}` : ""}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={14}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
                    />
                  </>
                )}
              </div>

              {/* Selected seller info */}
              {selectedSeller && (
                <div className="mt-2 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-between">
                  <span className="text-xs text-zinc-400">
                    Current tier:{" "}
                    <span
                      className={`font-bold ${TIER_CONFIG[selectedSeller.tier].color}`}
                    >
                      {TIER_CONFIG[selectedSeller.tier].emoji}{" "}
                      {TIER_CONFIG[selectedSeller.tier].label}
                    </span>
                  </span>
                  <span className="text-xs text-zinc-500">
                    {selectedSeller.avgStars.toFixed(1)}★ avg ·{" "}
                    {selectedSeller.reviewCount} reviews
                  </span>
                </div>
              )}
            </div>

            {/* Star picker */}
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-4 uppercase tracking-wider">
                Your Rating
              </label>
              <StarPicker value={stars} onChange={setStars} />
            </div>

            {/* Projected tier preview */}
            {selectedSeller && stars > 0 && (
              <ProjectedTier
                current={selectedSeller.tier}
                avgStars={selectedSeller.avgStars}
                reviewCount={selectedSeller.reviewCount}
                newStar={stars}
                totalTx={selectedSeller.totalTransactions}
              />
            )}

            {/* Review text */}
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider">
                Review (optional)
              </label>
              <textarea
                id="review-text"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows={4}
                placeholder="Share your experience with this seller — quality, communication, delivery…"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/60 transition-colors resize-none"
                maxLength={1000}
              />
              <div className="flex justify-end mt-1">
                <span className="text-[10px] text-zinc-600">
                  {reviewText.length}/1000
                </span>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-950 border border-red-800 rounded-xl text-xs text-red-300">
                <AlertCircle size={14} className="flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              id="submit-review-btn"
              disabled={submitting || stars === 0 || !selectedSellerId}
              className={`
                w-full flex items-center justify-center gap-2 py-3.5 rounded-xl
                font-bold text-sm transition-all duration-200
                ${
                  submitting || stars === 0 || !selectedSellerId
                    ? "bg-zinc-800 text-zinc-600 cursor-not-allowed"
                    : "bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-zinc-950 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 hover:-translate-y-0.5"
                }
              `}
            >
              {submitting ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  Submitting…
                </>
              ) : (
                <>
                  <Send size={14} />
                  Submit Review
                </>
              )}
            </button>

            {/* Note */}
            <p className="text-[11px] text-zinc-600 text-center leading-relaxed">
              Reviews are permanent and immediately update the seller's trust
              score and tier classification.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

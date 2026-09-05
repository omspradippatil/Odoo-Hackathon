"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { Quotation, QuotationStatus } from "@/types";
import {
  Kanban as KanbanIcon,
  RefreshCw,
  Plus,
  ExternalLink,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Send,
} from "lucide-react";

export default function PipelinePage() {
  const [pipeline, setPipeline] = useState<Record<string, Quotation[]>>({
    DRAFT: [],
    PENDING: [],
    APPROVED: [],
    CONFIRMED: [],
    REJECTED: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchPipeline = async () => {
    setLoading(true);
    try {
      const res = await api.get<Record<string, Quotation[]>>("/dashboard/pipeline");
      setPipeline(res.data);
    } catch (err) {
      console.error("Failed to load pipeline", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPipeline();
  }, []);

  const columns = [
    { key: "DRAFT", title: "Draft", color: "border-zinc-700 bg-zinc-900/30" },
    { key: "PENDING", title: "Pending Approval", color: "border-amber-800/80 bg-amber-950/10" },
    { key: "APPROVED", title: "Approved / Sent", color: "border-blue-800/80 bg-blue-950/10" },
    { key: "CONFIRMED", title: "Confirmed / Closed", color: "border-emerald-800/80 bg-emerald-950/10" },
    { key: "REJECTED", title: "Rejected", color: "border-red-800/80 bg-red-950/10" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-100 flex items-center gap-2.5">
            <KanbanIcon className="w-7 h-7 text-blue-500" />
            Sales Pipeline Kanban
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Visual governance stage progression from draft through multi-tier review to customer close.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchPipeline}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold hover:bg-zinc-800 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <Link
            href="/workspace/quotations/new"
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-lg shadow-blue-600/20"
          >
            <Plus className="w-4 h-4" />
            New Deal
          </Link>
        </div>
      </div>

      {/* Kanban Board Container */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {columns.map((col) => {
          const cards = pipeline[col.key] || [];
          return (
            <div
              key={col.key}
              className={`border rounded-xl p-3 flex flex-col min-h-[480px] ${col.color}`}
            >
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800">
                <span className="text-xs font-bold tracking-wide text-zinc-200">
                  {col.title}
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 font-bold">
                  {cards.length}
                </span>
              </div>

              {/* Cards list */}
              <div className="space-y-2.5 flex-1 overflow-y-auto">
                {cards.length === 0 ? (
                  <div className="h-32 flex items-center justify-center text-xs text-zinc-600 italic">
                    No quotations
                  </div>
                ) : (
                  cards.map((q) => (
                    <Link
                      key={q.id}
                      href={`/workspace/quotations/${q.id}`}
                      className="block p-3.5 rounded-lg border border-zinc-800/80 bg-zinc-900 hover:border-zinc-700 transition group shadow-sm"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-mono font-bold text-blue-400 group-hover:underline">
                          #{q.id}
                        </span>
                        {q.blendedRiskScore !== null && q.blendedRiskScore !== undefined && (
                          <span
                            className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                              q.blendedRiskScore > 0.08
                                ? "bg-red-950 text-red-400"
                                : q.blendedRiskScore > 0
                                ? "bg-amber-950 text-amber-400"
                                : "bg-emerald-950 text-emerald-400"
                            }`}
                          >
                            {(q.blendedRiskScore * 100).toFixed(0)}% risk
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-zinc-300 font-semibold truncate mb-1">
                        {q.customer?.email || "Unknown Customer"}
                      </p>

                      <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-2 border-t border-zinc-800/60 mt-2">
                        <span>Rep: {q.salesRep?.email?.split("@")[0] || "rep"}</span>
                        <ExternalLink className="w-3 h-3 text-zinc-600 group-hover:text-zinc-300 transition" />
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
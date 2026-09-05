"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { Quotation, DashboardStats } from "@/types";
import {
  Activity,
  AlertTriangle,
  Clock,
  TrendingUp,
  FileText,
  DollarSign,
  ArrowRight,
  RefreshCw,
  ShieldAlert,
} from "lucide-react";

export default function DealDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [stalled, setStalled] = useState<Quotation[]>([]);
  const [anomalies, setAnomalies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, stalledRes, anomaliesRes] = await Promise.all([
        api.get<DashboardStats>("/dashboard/stats"),
        api.get<Quotation[]>("/dashboard/stalled?days=7"),
        api.get<any[]>("/dashboard/anomalies"),
      ]);
      setStats(statsRes.data);
      setStalled(stalledRes.data);
      setAnomalies(anomaliesRes.data);
    } catch (err) {
      console.error("Failed to load dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-800 flex items-center gap-2.5">
            <Activity className="w-7 h-7 text-blue-500" />
            Deal Health & Anomaly Watch
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Real-time pipeline monitoring, stalled quotation alerts, and discount margin anomaly detection.
          </p>
        </div>
        <button
          onClick={fetchData}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-900 rounded-lg text-xs font-semibold self-start sm:self-auto transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh Metrics
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-50 border border-gray-200 p-5 rounded-xl">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-semibold">Total Quotations</span>
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-gray-800 font-mono">
            {stats?.totalQuotations ?? 0}
          </p>
          <p className="text-[10px] text-gray-500 mt-1">Across all sales stages</p>
        </div>

        <div className="bg-gray-50 border border-gray-200 p-5 rounded-xl">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-semibold">Pending Approvals</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-amber-600 font-mono">
            {stats?.pendingApprovals ?? 0}
          </p>
          <p className="text-[10px] text-gray-500 mt-1">Requiring L1 / L2 review</p>
        </div>

        <div className="bg-gray-50 border border-gray-200 p-5 rounded-xl">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-semibold">Stalled Deals</span>
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-red-600 font-mono">
            {stalled.length}
          </p>
          <p className="text-[10px] text-gray-500 mt-1">&gt; 7 days without customer reply</p>
        </div>

        <div className="bg-gray-50 border border-gray-200 p-5 rounded-xl">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-semibold">Settled Escrow Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600 font-mono">
            ₹{(stats?.totalRevenue ?? 0).toLocaleString()}
          </p>
          <p className="text-[10px] text-gray-500 mt-1">Net confirmed transactions</p>
        </div>
      </div>

      {/* Two Columns: Anomalies and Stalled Deals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Anomaly Alerts */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-red-600 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4" />
            Discount & Policy Anomalies ({anomalies.length})
          </h2>

          {anomalies.length === 0 ? (
            <div className="p-8 border border-dashed border-gray-200 rounded-xl bg-gray-50 text-center text-gray-500 text-xs">
              No anomalies detected. All quotations strictly comply with standard margin policies.
            </div>
          ) : (
            <div className="space-y-3">
              {anomalies.map((anom, idx) => (
                <div
                  key={idx}
                  className="bg-red-100/20 border border-red-200 p-4 rounded-xl flex items-start justify-between gap-3 hover:bg-red-100/30 transition"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-red-600">
                        Quote #{anom.quotationId}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-red-100 border border-red-200 text-red-600 font-bold">
                        Risk: {((anom.riskScore || 0) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">
                      Discounts applied significantly surpass category maximums.
                    </p>
                    <p className="text-[10px] text-gray-500">
                      Rep: {anom.rep} | Status: {anom.status}
                    </p>
                  </div>
                  <Link
                    href={`/workspace/quotations/${anom.quotationId}`}
                    className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600 transition"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Stalled Deals */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-amber-600 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Stalled Quotations ({stalled.length})
          </h2>

          {stalled.length === 0 ? (
            <div className="p-8 border border-dashed border-gray-200 rounded-xl bg-gray-50 text-center text-gray-500 text-xs">
              No stalled deals. Recent customer interaction observed on all active proposals.
            </div>
          ) : (
            <div className="space-y-3">
              {stalled.map((q) => (
                <div
                  key={q.id}
                  className="bg-gray-50 border border-gray-200 p-4 rounded-xl flex items-start justify-between gap-3 hover:bg-gray-50 transition"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-900">Quote #{q.id}</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 border border-amber-200 text-amber-600">
                        {q.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Customer: {q.customer?.email || "N/A"}
                    </p>
                    <p className="text-[10px] text-gray-500">
                      Last modified:{" "}
                      {q.updatedAt ? new Date(q.updatedAt).toLocaleDateString() : "Unknown"}
                    </p>
                  </div>
                  <Link
                    href={`/workspace/quotations/${q.id}`}
                    className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-900 transition"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
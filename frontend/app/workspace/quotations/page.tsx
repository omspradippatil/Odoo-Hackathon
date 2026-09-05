"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { Quotation } from "@/types";
import {
  FileText,
  Plus,
  ArrowRight,
  ExternalLink,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Send,
  RefreshCw,
  Search,
  Filter,
} from "lucide-react";

export default function QuotationsPage() {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const fetchQuotations = async () => {
    setLoading(true);
    try {
      const res = await api.get<Quotation[]>("/quotations");
      setQuotations(res.data);
    } catch (err) {
      console.error("Failed to load quotations", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotations();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
      case "CONFIRMED":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800 text-emerald-400">
            <CheckCircle2 className="w-3 h-3" /> {status}
          </span>
        );
      case "PENDING_L1":
      case "PENDING_L2":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-amber-950/60 border border-amber-800 text-amber-400">
            <Clock className="w-3 h-3" /> {status.replace("_", " ")}
          </span>
        );
      case "SENT_TO_CUSTOMER":
      case "UNDER_NEGOTIATION":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-blue-950/60 border border-blue-800 text-blue-400">
            <Send className="w-3 h-3" /> {status.replace("_", " ")}
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-red-950/60 border border-red-800 text-red-400">
            <AlertTriangle className="w-3 h-3" /> {status}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300">
            {status}
          </span>
        );
    }
  };

  const filteredQuotations = quotations.filter((q) => {
    const matchesSearch =
      q.id.toString().includes(search) ||
      (q.customer?.email && q.customer.email.toLowerCase().includes(search.toLowerCase())) ||
      (q.salesRep?.email && q.salesRep.email.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === "ALL" || q.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-100 flex items-center gap-2">
            <FileText className="w-7 h-7 text-blue-500" />
            Quotations
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Manage quotations, track approval states, and generate customer portal links.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchQuotations}
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
            Create Quotation
          </Link>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search by Quote ID or Email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-zinc-500 hidden sm:block" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="PENDING_L1">Pending L1</option>
            <option value="PENDING_L2">Pending L2</option>
            <option value="APPROVED">Approved</option>
            <option value="SENT_TO_CUSTOMER">Sent to Customer</option>
            <option value="UNDER_NEGOTIATION">Under Negotiation</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* Quotations List */}
      {loading ? (
        <div className="p-12 text-center text-zinc-500 border border-zinc-800/80 rounded-xl bg-zinc-900/30">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-500" />
          Loading quotations...
        </div>
      ) : filteredQuotations.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-zinc-800 rounded-xl bg-zinc-900/20">
          <p className="text-zinc-400 font-medium text-sm">No quotations found.</p>
          <p className="text-zinc-500 text-xs mt-1">
            {search || statusFilter !== "ALL"
              ? "Try adjusting your filters"
              : "Click 'Create Quotation' to get started."}
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:gap-4">
          {filteredQuotations.map((q) => (
            <div
              key={q.id}
              className="border border-zinc-800/80 hover:border-zinc-700 bg-zinc-900/50 hover:bg-zinc-900 rounded-xl p-4 sm:p-5 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
            >
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                    #{q.id}
                  </span>
                  {getStatusBadge(q.status)}
                  {q.blendedRiskScore !== undefined && q.blendedRiskScore !== null && (
                    <span
                      className={`text-[11px] font-mono px-2 py-0.5 rounded font-bold ${
                        q.blendedRiskScore > 0.08
                          ? "bg-red-950/80 text-red-400 border border-red-800"
                          : q.blendedRiskScore > 0
                          ? "bg-amber-950/80 text-amber-400 border border-amber-800"
                          : "bg-emerald-950/80 text-emerald-400 border border-emerald-800"
                      }`}
                    >
                      Risk: {(q.blendedRiskScore * 100).toFixed(1)}%
                    </span>
                  )}
                </div>
                <div className="text-xs text-zinc-400 flex flex-wrap gap-x-4 gap-y-1">
                  <span>
                    <strong className="text-zinc-300">Customer:</strong>{" "}
                    {q.customer?.email || "N/A"}
                  </span>
                  <span>
                    <strong className="text-zinc-300">Rep:</strong>{" "}
                    {q.salesRep?.email || "N/A"}
                  </span>
                  {q.createdAt && (
                    <span>
                      <strong className="text-zinc-300">Date:</strong>{" "}
                      {new Date(q.createdAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {q.portalToken && (
                  <a
                    href={`/portal/${q.portalToken}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg border border-blue-900 bg-blue-950/40 text-blue-400 hover:bg-blue-900/60 transition"
                    title="Open Customer Portal View"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Portal
                  </a>
                )}
                <Link
                  href={`/workspace/fulfillment/${q.id}`}
                  className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-950 hover:bg-zinc-800 text-zinc-300 transition"
                  title="Fulfillment Split"
                >
                  Fulfill
                </Link>
                <Link
                  href={`/workspace/billing/${q.id}`}
                  className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-950 hover:bg-zinc-800 text-zinc-300 transition"
                  title="GST Tax Invoice"
                >
                  Invoice
                </Link>
                <Link
                  href={`/workspace/quotations/${q.id}`}
                  className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition shadow-sm"
                >
                  View Details
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
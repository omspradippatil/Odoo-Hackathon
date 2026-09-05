"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { Quotation } from "@/types";
import {
  FileText,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Send,
  ExternalLink,
  ShieldAlert,
  Clock,
  Layers,
  FileDown,
  RefreshCw,
} from "lucide-react";

export default function QuotationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const quotationId = params?.id as string;

  const [quotation, setQuotation] = useState<Quotation | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [approvalReason, setApprovalReason] = useState("");
  const [portalUrl, setPortalUrl] = useState("");
  const [riskData, setRiskData] = useState<{
    score: number;
    approvalLevel: string;
    requiresApproval: boolean;
  } | null>(null);

  const fetchQuotation = async () => {
    if (!quotationId) return;
    setLoading(true);
    try {
      const res = await api.get<Quotation>(`/quotations/${quotationId}`);
      setQuotation(res.data);
      if (res.data.portalToken) {
        setPortalUrl(`${window.location.origin}/portal/${res.data.portalToken}`);
      }

      // Also get live risk assessment
      const riskRes = await api.get(`/quotations/${quotationId}/risk-score`);
      setRiskData(riskRes.data);
    } catch (err) {
      console.error("Failed to load quotation", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotation();
  }, [quotationId]);

  const handleApprove = async () => {
    setActionLoading(true);
    try {
      await api.post(`/approvals/${quotationId}/approve`, {
        reason: approvalReason || "Approved via sales desk",
      });
      await fetchQuotation();
    } catch (err) {
      console.error("Failed to approve", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    setActionLoading(true);
    try {
      await api.post(`/approvals/${quotationId}/reject`, {
        reason: approvalReason || "Terms unacceptable",
      });
      await fetchQuotation();
    } catch (err) {
      console.error("Failed to reject", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReturnForRevision = async () => {
    setActionLoading(true);
    try {
      await api.post(`/approvals/${quotationId}/return`, {
        reason: approvalReason || "Please adjust discount parameters",
      });
      await fetchQuotation();
    } catch (err) {
      console.error("Failed to return", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSendToCustomer = async () => {
    setActionLoading(true);
    try {
      const res = await api.put(`/quotations/${quotationId}/send-to-customer`);
      setPortalUrl(res.data.portalUrl);
      await fetchQuotation();
    } catch (err) {
      console.error("Failed to generate customer portal link", err);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center text-zinc-500">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-blue-500" />
        Loading Quotation #{quotationId}...
      </div>
    );
  }

  if (!quotation) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center text-zinc-400">
        Quotation #{quotationId} not found.
      </div>
    );
  }

  const orderTotal =
    quotation.lines?.reduce((acc, line) => acc + (line.lineTotal || 0), 0) || 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Link
        href="/workspace/quotations"
        className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-100 mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Quotations
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-100">
              Quotation #{quotation.id}
            </h1>
            <span className="text-xs font-bold px-2.5 py-1 rounded bg-blue-950/80 border border-blue-800 text-blue-400">
              {quotation.status}
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Customer: <span className="text-zinc-200">{quotation.customer?.email}</span> |
            Rep: <span className="text-zinc-200">{quotation.salesRep?.email}</span>
          </p>
        </div>

        {/* Action Header Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {portalUrl && (
            <a
              href={portalUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 bg-blue-950/40 border border-blue-800 hover:bg-blue-900/60 text-blue-400 rounded-lg text-xs font-semibold transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Customer Portal
            </a>
          )}
          <Link
            href={`/workspace/fulfillment/${quotation.id}`}
            className="flex items-center gap-1.5 px-3 py-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-200 rounded-lg text-xs font-semibold transition"
          >
            <Layers className="w-3.5 h-3.5" />
            Fulfillment Split
          </Link>
          <Link
            href={`/workspace/billing/${quotation.id}`}
            className="flex items-center gap-1.5 px-3 py-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-200 rounded-lg text-xs font-semibold transition"
          >
            <FileText className="w-3.5 h-3.5 text-blue-400" />
            GST Invoice
          </Link>
          <button
            onClick={handleSendToCustomer}
            disabled={actionLoading}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition shadow-sm disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            Send to Customer
          </button>
        </div>
      </div>

      {/* Grid Layout: Details & Approval Control */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Line items table */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
            <h2 className="text-base font-bold text-zinc-200 mb-4 flex items-center justify-between">
              <span>Quotation Line Items</span>
              <span className="text-xs font-normal text-zinc-400">
                {quotation.lines?.length || 0} line(s)
              </span>
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-400">
                    <th className="pb-2">Product</th>
                    <th className="pb-2 text-center">Qty</th>
                    <th className="pb-2 text-right">Unit Price</th>
                    <th className="pb-2 text-center">Discount</th>
                    <th className="pb-2 text-right">Line Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {quotation.lines?.map((line, idx) => (
                    <tr key={idx} className="hover:bg-zinc-900/40">
                      <td className="py-3 font-semibold text-zinc-200">
                        {line.product?.name}
                        {line.isRecurring && (
                          <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-purple-950 border border-purple-800 text-purple-400">
                            RECURRING
                          </span>
                        )}
                      </td>
                      <td className="py-3 text-center text-zinc-300 font-mono">
                        {line.qty}
                      </td>
                      <td className="py-3 text-right text-zinc-300 font-mono">
                        ₹{line.unitPrice?.toLocaleString()}
                      </td>
                      <td className="py-3 text-center">
                        <span className="px-2 py-0.5 rounded bg-zinc-800 font-mono text-zinc-300">
                          {((line.discountPct || 0) * 100).toFixed(0)}%
                        </span>
                      </td>
                      <td className="py-3 text-right font-bold text-emerald-400 font-mono">
                        ₹{line.lineTotal?.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total Row */}
            <div className="border-t border-zinc-800 mt-4 pt-4 flex justify-between items-center text-sm">
              <span className="font-bold text-zinc-300">Estimated Order Total</span>
              <span className="font-black text-xl text-zinc-50 font-mono">
                ₹{orderTotal.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Portal link box */}
          {portalUrl && (
            <div className="p-4 rounded-xl border border-blue-900/60 bg-blue-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-blue-400">Customer Access Link</p>
                <p className="text-[11px] font-mono text-zinc-400 truncate max-w-md mt-0.5">
                  {portalUrl}
                </p>
              </div>
              <a
                href={portalUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition self-start sm:self-auto shadow-sm"
              >
                Open Portal <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>

        {/* Right Col: Risk Engine & Approval Decisions */}
        <div className="space-y-6">
          {/* Risk Score Widget */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-yellow-500" />
              Blended Risk Engine
            </h3>

            {riskData ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-400">Risk Score:</span>
                  <span
                    className={`font-mono font-bold text-sm px-2 py-0.5 rounded ${
                      riskData.score > 0.08
                        ? "bg-red-950 text-red-400 border border-red-800"
                        : riskData.score > 0
                        ? "bg-amber-950 text-amber-400 border border-amber-800"
                        : "bg-emerald-950 text-emerald-400 border border-emerald-800"
                    }`}
                  >
                    {(riskData.score * 100).toFixed(2)}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-400">Required Level:</span>
                  <span className="text-xs font-bold text-zinc-200">
                    {riskData.approvalLevel}
                  </span>
                </div>
                <div className="text-[11px] text-zinc-500 bg-zinc-950 p-2.5 rounded-lg border border-zinc-800/80">
                  {riskData.score > 0.08
                    ? "Requires L1 (Sales Manager) AND L2 (Finance) approval before customer contract release."
                    : riskData.score > 0
                    ? "Requires L1 (Sales Manager) approval."
                    : "Within standard policy. Auto-approved for quote issuance."}
                </div>
              </div>
            ) : (
              <p className="text-xs text-zinc-500">Calculating risk metrics...</p>
            )}
          </div>

          {/* Governance & Approval Card */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-blue-400" />
              Approval Controls
            </h3>

            <div className="space-y-3">
              <textarea
                placeholder="Approval / Rejection notes (optional)..."
                value={approvalReason}
                onChange={(e) => setApprovalReason(e.target.value)}
                className="w-full text-xs bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                rows={3}
              />

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleApprove}
                  disabled={actionLoading}
                  className="flex items-center justify-center gap-1 text-xs font-bold py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition disabled:opacity-50"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                </button>
                <button
                  onClick={handleReject}
                  disabled={actionLoading}
                  className="flex items-center justify-center gap-1 text-xs font-bold py-2 px-3 rounded-lg bg-red-600 hover:bg-red-500 text-white transition disabled:opacity-50"
                >
                  <XCircle className="w-3.5 h-3.5" /> Reject
                </button>
              </div>

              <button
                onClick={handleReturnForRevision}
                disabled={actionLoading}
                className="w-full flex items-center justify-center gap-1 text-xs font-semibold py-2 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition disabled:opacity-50"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Return for Revision
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
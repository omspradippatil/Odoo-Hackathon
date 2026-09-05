"use client";

import React, { useEffect, useState, use } from "react";
import api from "@/lib/api";
import {
  FileCheck,
  CheckCircle2,
  RefreshCw,
  Send,
  AlertCircle,
  Clock,
  ExternalLink,
} from "lucide-react";

export default function CustomerPortalPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const resolvedParams = use(params);
  const token = resolvedParams.token;

  const [quotation, setQuotation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [counterDiscount, setCounterDiscount] = useState("10");
  const [negotiateComment, setNegotiateComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const fetchPortalQuotation = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/portal/${token}`);
      setQuotation(res.data);
    } catch (err) {
      console.error("Failed to load portal quotation", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortalQuotation();
  }, [token]);

  const handleNegotiate = async () => {
    setSubmitting(true);
    try {
      const disc = (parseFloat(counterDiscount) || 0) / 100;
      const res = await api.post(`/portal/${token}/negotiate`, {
        counterDiscountPct: disc,
        comment: negotiateComment || "Customer requested discount adjustment",
      });
      setStatusMessage("Counter-offer submitted! The quotation is now under review.");
      await fetchPortalQuotation();
    } catch (err) {
      console.error("Negotiation failed", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      const res = await api.post(`/portal/${token}/confirm`);
      setStatusMessage(res.data.message || "Quotation confirmed!");
      await fetchPortalQuotation();
    } catch (err) {
      console.error("Confirmation failed", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-100 flex items-center justify-center text-zinc-600 font-sans">
        <div className="text-center space-y-3">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-600" />
          <p className="text-sm font-medium">Loading Official Quotation Portal...</p>
        </div>
      </div>
    );
  }

  if (!quotation) {
    return (
      <div className="min-h-screen bg-zinc-100 flex items-center justify-center p-4 font-sans">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-zinc-200 text-center max-w-md">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-zinc-900">Quotation Link Not Found</h2>
          <p className="text-xs text-gray-9000 mt-1">
            This token may be invalid or expired. Please contact your sales representative.
          </p>
        </div>
      </div>
    );
  }

  const lines = quotation.lines || [];
  const total = lines.reduce((acc: number, l: any) => acc + (l.lineTotal || 0), 0);

  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900 font-sans pb-16">
      {/* Customer Header */}
      <header className="bg-white border-b border-zinc-200 px-6 py-4 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-black text-white text-sm">
              DF
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-zinc-900">DEV FLOW</h1>
              <p className="text-[10px] text-gray-500">Customer Deal Negotiation Portal</p>
            </div>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 uppercase">
            {quotation.status}
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 mt-8">
        <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 pb-4">
            <div>
              <h2 className="text-xl font-bold text-zinc-900">Quotation #{quotation.id}</h2>
              <p className="text-xs text-gray-9000 mt-0.5">
                Review your pricing proposal below or submit counter-terms.
              </p>
            </div>
          </div>

          {statusMessage && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-2 text-xs font-semibold text-blue-800">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-blue-600" />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Quotation Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-200 text-gray-9000">
                  <th className="pb-3 font-semibold">Product Description</th>
                  <th className="pb-3 font-semibold text-center">Qty</th>
                  <th className="pb-3 font-semibold text-right">Unit Price</th>
                  <th className="pb-3 font-semibold text-center">Discount</th>
                  <th className="pb-3 font-semibold text-right">Line Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {lines.map((l: any, i: number) => (
                  <tr key={i}>
                    <td className="py-3.5 font-medium text-zinc-900">{l.product?.name}</td>
                    <td className="py-3.5 text-center text-zinc-600">{l.qty}</td>
                    <td className="py-3.5 text-right text-zinc-600">
                      ₹{l.unitPrice?.toLocaleString()}
                    </td>
                    <td className="py-3.5 text-center">
                      <span className="px-2 py-0.5 bg-zinc-100 rounded text-zinc-700 font-semibold">
                        {((l.discountPct || 0) * 100).toFixed(0)}%
                      </span>
                    </td>
                    <td className="py-3.5 text-right font-bold text-zinc-900">
                      ₹{l.lineTotal?.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Order Total */}
          <div className="border-t border-zinc-200 pt-4 flex justify-between items-center text-base">
            <span className="font-bold text-zinc-700">Proposal Order Total</span>
            <span className="font-black text-2xl text-blue-600 font-mono">
              ₹{total.toLocaleString()}
            </span>
          </div>

          {/* Negotiation Drawer */}
          <div className="p-5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-600">
              Counter-Offer & Discount Negotiation
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-zinc-600 block mb-1">
                  Requested Discount (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={counterDiscount}
                  onChange={(e) => setCounterDiscount(e.target.value)}
                  className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-xs font-bold text-zinc-800 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-[11px] font-semibold text-zinc-600 block mb-1">
                  Remarks / Justification
                </label>
                <input
                  type="text"
                  placeholder="e.g. Budget ceiling, annual volume commitment..."
                  value={negotiateComment}
                  onChange={(e) => setNegotiateComment(e.target.value)}
                  className="w-full bg-white border border-zinc-300 rounded-lg px-3 py-2 text-xs text-zinc-800 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2">
              <button
                onClick={handleNegotiate}
                disabled={submitting}
                className="px-4 py-2 rounded-lg border border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-bold transition disabled:opacity-50"
              >
                Submit Counter-Offer
              </button>
              <button
                onClick={handleConfirm}
                disabled={submitting}
                className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-sm disabled:opacity-50"
              >
                Accept & Confirm Quotation
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
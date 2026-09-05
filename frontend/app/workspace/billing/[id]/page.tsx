"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { Quotation } from "@/types";
import {
  CreditCard,
  ArrowLeft,
  FileCheck,
  Download,
  Building,
  CheckCircle2,
  Receipt,
  Layers,
  FileText,
  Printer,
  ShieldCheck,
} from "lucide-react";

export default function BillingInvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const quotationId = resolvedParams.id;

  const [quotation, setQuotation] = useState<Quotation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuotation = async () => {
      try {
        const res = await api.get<Quotation>(`/quotations/${quotationId}`);
        setQuotation(res.data);
      } catch (err) {
        console.error("Failed to load invoice for quotation", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuotation();
  }, [quotationId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-gray-9000">
        Loading Tax Invoice...
      </div>
    );
  }

  const lines = quotation?.lines || [];
  const subtotal = lines.reduce((acc, l) => acc + (l.lineTotal || 0), 0);
  const gstRate = 0.18; // 18% GST standard on hardware
  const cgst = subtotal * 0.09;
  const sgst = subtotal * 0.09;
  const grandTotal = subtotal + cgst + sgst;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Controls */}
      <div className="flex items-center justify-between gap-4 mb-6 print:hidden">
        <Link
          href={`/workspace/quotations/${quotationId}`}
          className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Quotation
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-gray-50 border border-gray-200 hover:bg-gray-100 text-zinc-200 rounded-lg text-xs font-semibold transition"
          >
            <Printer className="w-3.5 h-3.5" />
            Print / Save PDF
          </button>
        </div>
      </div>

      {/* Official Tax Invoice Container */}
      <div className="bg-white text-zinc-900 rounded-2xl shadow-xl border border-zinc-200 p-8 sm:p-12 space-y-8 font-sans">
        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b border-zinc-200 pb-8">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center font-black text-white text-base">
                DF
              </div>
              <span className="text-2xl font-black tracking-tight text-zinc-900">DEV FLOW</span>
            </div>
            <p className="text-xs text-gray-9000 max-w-xs leading-relaxed">
              DealFlow Technologies Pvt. Ltd.<br />
              Logistics & Tech Park, Bandra-Kurla Complex<br />
              Mumbai, Maharashtra - 400051<br />
              <strong>GSTIN:</strong> 27AABCT8921K1Z9
            </p>
          </div>

          <div className="text-right space-y-1">
            <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold uppercase tracking-wider">
              TAX INVOICE (GST)
            </span>
            <p className="text-sm font-bold text-zinc-900 font-mono mt-2">
              INV-2026-00{quotationId}
            </p>
            <p className="text-xs text-gray-9000">
              Date: {quotation?.createdAt ? new Date(quotation.createdAt).toLocaleDateString() : "05/09/2026"}
            </p>
            <p className="text-xs text-gray-9000">
              Quotation Ref: <span className="font-mono font-semibold">#QT-{quotationId}</span>
            </p>
          </div>
        </div>

        {/* Bill To / Consignee */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-zinc-50 p-5 rounded-xl border border-zinc-200/80 text-xs">
          <div>
            <p className="font-bold text-gray-9000 uppercase tracking-wider mb-1">Billed To (Customer):</p>
            <p className="font-bold text-sm text-zinc-900">{quotation?.customer?.email || "customer@acme.com"}</p>
            <p className="text-zinc-600 mt-0.5">Acme Corporation India Ltd.</p>
            <p className="text-gray-9000">Pune Tech Park, Maharashtra - 411014</p>
            <p className="text-gray-9000">GSTIN: 27AABCA4412P1ZA</p>
          </div>

          <div>
            <p className="font-bold text-gray-9000 uppercase tracking-wider mb-1">Fulfillment & Dispatch:</p>
            <p className="text-zinc-700">Dispatch Location: <strong>Main Warehouse Mumbai</strong></p>
            <p className="text-zinc-700">Escrow Security: <strong>DEV FLOW Verified Trust</strong></p>
            <p className="text-zinc-700">Payment Status: <strong className="text-emerald-600 font-semibold">SETTLED / ESCROW RELEASED</strong></p>
          </div>
        </div>

        {/* Invoice Line Items */}
        <div>
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b-2 border-zinc-200 text-gray-9000 font-semibold">
                <th className="pb-3">#</th>
                <th className="pb-3">Item Description</th>
                <th className="pb-3 text-center">HSN</th>
                <th className="pb-3 text-center">Qty</th>
                <th className="pb-3 text-right">Unit Rate</th>
                <th className="pb-3 text-center">Disc</th>
                <th className="pb-3 text-right">Taxable Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {lines.map((l, i) => (
                <tr key={i}>
                  <td className="py-3 font-mono text-gray-500">{i + 1}</td>
                  <td className="py-3 font-bold text-zinc-900">{l.product?.name}</td>
                  <td className="py-3 text-center font-mono text-gray-9000">84713010</td>
                  <td className="py-3 text-center font-mono text-zinc-700">{l.qty}</td>
                  <td className="py-3 text-right font-mono text-zinc-700">₹{l.unitPrice?.toLocaleString()}</td>
                  <td className="py-3 text-center font-mono text-zinc-600">{((l.discountPct || 0) * 100).toFixed(0)}%</td>
                  <td className="py-3 text-right font-mono font-bold text-zinc-900">₹{l.lineTotal?.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* GST Calculation Breakout */}
        <div className="border-t border-zinc-200 pt-6 flex flex-col sm:flex-row justify-between gap-6">
          <div className="text-xs text-gray-9000 space-y-1 max-w-sm">
            <p className="font-bold text-zinc-700">Terms & Conditions:</p>
            <p>1. Hardware goods carry standard 1-year manufacturer warranty.</p>
            <p>2. Payment processed via DEV FLOW trust escrow protocol.</p>
            <p>3. This is a computer-generated GST invoice complying with Indian GST rules.</p>
          </div>

          <div className="w-full sm:w-72 space-y-2 text-xs">
            <div className="flex justify-between text-zinc-600">
              <span>Taxable Subtotal:</span>
              <span className="font-mono font-semibold">₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-zinc-600">
              <span>CGST (9.0%):</span>
              <span className="font-mono">₹{cgst.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-zinc-600">
              <span>SGST (9.0%):</span>
              <span className="font-mono">₹{sgst.toLocaleString()}</span>
            </div>
            <div className="border-t-2 border-zinc-900 pt-2 flex justify-between items-center text-sm font-black text-zinc-900">
              <span>Total Invoice Value:</span>
              <span className="font-mono text-lg text-blue-600">₹{grandTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Signoff */}
        <div className="border-t border-zinc-100 pt-6 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1.5 text-emerald-600 font-semibold">
            <ShieldCheck className="w-4 h-4" />
            Digitally Signed & Certified by DEV FLOW Governance
          </div>
          <span>Page 1 of 1</span>
        </div>
      </div>
    </div>
  );
}
"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { Quotation, Product, SplitResult } from "@/types";
import {
  Truck,
  ArrowLeft,
  Warehouse,
  Boxes,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";

export default function FulfillmentPage() {
  const params = useParams();
  const quotationId = params?.id as string;

  const [quotation, setQuotation] = useState<Quotation | null>(null);
  const [loading, setLoading] = useState(true);
  const [splits, setSplits] = useState<Record<number, SplitResult>>({});
  const [computingSplits, setComputingSplits] = useState(false);

  // Warehouse dictionary mapping
  const warehouseNames: Record<number, string> = {
    1: "Main Warehouse Mumbai (Heavy / High Stock)",
    2: "East Depot Pune (Fast Dispatch)",
  };

  const fetchQuotationAndSplits = async () => {
    if (!quotationId) return;
    setLoading(true);
    try {
      const res = await api.get<Quotation>(`/quotations/${quotationId}`);
      setQuotation(res.data);

      if (res.data.lines && res.data.lines.length > 0) {
        setComputingSplits(true);
        const splitMap: Record<number, SplitResult> = {};
        for (const line of res.data.lines) {
          if (line.product?.id) {
            try {
              const splitRes = await api.get<SplitResult>(
                `/warehouse/split?productId=${line.product.id}&qty=${line.qty}`
              );
              splitMap[line.product.id] = splitRes.data;
            } catch (splitErr) {
              console.error("Error splitting line", line, splitErr);
            }
          }
        }
        setSplits(splitMap);
        setComputingSplits(false);
      }
    } catch (err) {
      console.error("Failed to load quotation for fulfillment", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotationAndSplits();
  }, [quotationId]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center text-zinc-500">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-blue-500" />
        Calculating fulfillment splits for Quote #{quotationId}...
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

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href={`/workspace/quotations/${quotationId}`}
        className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-100 mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Quotation
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-100 flex items-center gap-2.5">
            <Truck className="w-7 h-7 text-blue-500" />
            Fulfillment & Warehouse Split
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Automated multi-warehouse inventory allocation with greedy shipping cost & weight optimization.
          </p>
        </div>
        <button
          onClick={fetchQuotationAndSplits}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-200 rounded-lg text-xs font-semibold self-start sm:self-auto transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${computingSplits ? "animate-spin" : ""}`} />
          Recalculate
        </button>
      </div>

      <div className="space-y-6">
        {quotation.lines?.map((line, idx) => {
          const split = line.product?.id ? splits[line.product.id] : null;
          return (
            <div
              key={idx}
              className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3 mb-4">
                <div>
                  <h3 className="font-bold text-sm text-zinc-100 flex items-center gap-2">
                    <Boxes className="w-4 h-4 text-blue-400" />
                    {line.product?.name}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Category: {line.product?.category?.name || "General"} | Total Requested:{" "}
                    <span className="font-mono text-zinc-200 font-bold">{line.qty} units</span>
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  ₹{line.lineTotal?.toLocaleString()}
                </span>
              </div>

              {/* Warehouse allocations breakdown */}
              {split ? (
                <div className="space-y-3">
                  <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                    Warehouse Routing Breakdown:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.entries(split.allocations).map(([whId, allocQty]) => (
                      <div
                        key={whId}
                        className="bg-zinc-950 border border-zinc-800/80 p-3.5 rounded-lg flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5">
                          <Warehouse className="w-4 h-4 text-zinc-400" />
                          <div>
                            <p className="text-xs font-semibold text-zinc-200">
                              {warehouseNames[Number(whId)] || `Warehouse #${whId}`}
                            </p>
                            <p className="text-[10px] text-zinc-500">Dispatch Status: In Stock</p>
                          </div>
                        </div>
                        <span className="font-mono font-bold text-xs bg-blue-950 text-blue-300 border border-blue-800 px-2 py-1 rounded">
                          {allocQty} units
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Backorder status if any */}
                  {split.remaining > 0 && (
                    <div className="p-3 bg-red-950/40 border border-red-900/50 rounded-lg flex items-center gap-2 text-xs text-red-400">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>
                        Backorder Alert: <strong>{split.remaining} units</strong> cannot be fulfilled
                        from active warehouses. Purchase order automatically queued.
                      </span>
                    </div>
                  )}

                  {split.remaining === 0 && (
                    <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Fully fulfillable across configured fulfillment centers.</span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xs text-zinc-500">No warehouse stock data available.</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
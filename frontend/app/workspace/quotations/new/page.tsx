"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { Product, Category } from "@/types";
import {
  FilePlus,
  Search,
  ShoppingCart,
  Trash2,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Zap,
} from "lucide-react";

interface CartItem {
  product: Product;
  qty: number;
  unitPrice: number;
  discountPct: number;
}

export default function QuotationBuilder() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [createdQuotationId, setCreatedQuotationId] = useState<number | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get<Product[]>("/products");
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to load catalog", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Add to cart
  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [
        ...prev,
        {
          product,
          qty: 1,
          unitPrice: product.basePrice,
          discountPct: 0.0,
        },
      ];
    });
  };

  const updateQty = (productId: number, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, qty } : item))
    );
  };

  const updateDiscount = (productId: number, discountPct: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, discountPct: Math.min(Math.max(discountPct, 0), 1) }
          : item
      )
    );
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  // Calculate Blended Risk Score
  // Formula: BlendedRiskScore = Σ [ (GivenDiscount_i - AllowedDiscount_i) × LineWeight_i ]
  const calculateMetrics = () => {
    let orderTotal = 0;
    const lines = cart.map((item) => {
      const lineTotal = item.unitPrice * item.qty * (1 - item.discountPct);
      orderTotal += lineTotal;
      return { ...item, lineTotal };
    });

    let riskScore = 0;
    if (orderTotal > 0) {
      for (const line of lines) {
        const allowed = line.product.category?.maxDiscountPct || 0;
        const weight = line.lineTotal / orderTotal;
        riskScore += (line.discountPct - allowed) * weight;
      }
    }

    return { orderTotal, riskScore, lines };
  };

  const { orderTotal, riskScore, lines } = calculateMetrics();

  // Handle Submission to Backend
  const handleCreateQuote = async () => {
    if (cart.length === 0) return;
    setSubmitting(true);
    try {
      const payload = {
        customerId: 5, // Acme Corp default seeded customer
        lines: cart.map((item) => ({
          productId: item.product.id,
          qty: item.qty,
          unitPrice: item.unitPrice,
          discountPct: item.discountPct,
        })),
      };

      const res = await api.post("/quotations", payload);
      setCreatedQuotationId(res.data.id);
    } catch (err) {
      console.error("Failed to create quotation", err);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCat =
      selectedCategory === "ALL" || p.category?.name === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const categories = ["ALL", ...Array.from(new Set(products.map((p) => p.category?.name).filter(Boolean)))];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-100 flex items-center gap-2.5">
            <FilePlus className="w-7 h-7 text-blue-500" />
            Quotation Builder
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Build live quote, apply item discounts, and inspect the self-governing Blended Risk Score in real time.
          </p>
        </div>
      </div>

      {createdQuotationId ? (
        <div className="max-w-xl mx-auto p-8 rounded-2xl bg-zinc-900 border border-emerald-800/60 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald-950 border border-emerald-700 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-zinc-100">Quotation Successfully Created!</h2>
          <p className="text-xs text-zinc-400">
            Quotation #{createdQuotationId} has been logged in the system and routed through the governance engine.
          </p>
          <div className="pt-4 flex justify-center gap-3">
            <Link
              href={`/workspace/quotations/${createdQuotationId}`}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5"
            >
              View Quotation <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              onClick={() => {
                setCart([]);
                setCreatedQuotationId(null);
              }}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs font-semibold transition"
            >
              Build Another
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Panel: Catalog Browser (7 Cols) */}
          <div className="lg:col-span-7 space-y-5">
            {/* Search & Category Tabs */}
            <div className="bg-zinc-900/40 border border-zinc-800 p-4 rounded-xl space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search catalog products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-md text-[11px] font-bold transition ${
                      selectedCategory === cat
                        ? "bg-blue-600 text-white"
                        : "bg-zinc-950 text-zinc-400 hover:text-zinc-200 border border-zinc-800"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Cards List */}
            {loading ? (
              <div className="p-8 text-center text-zinc-500 text-xs">Loading products...</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredProducts.map((p) => {
                  const maxAllowed = (p.category?.maxDiscountPct || 0) * 100;
                  return (
                    <div
                      key={p.id}
                      className="bg-zinc-900/50 border border-zinc-800/80 hover:border-zinc-700 p-4 rounded-xl flex flex-col justify-between transition group"
                    >
                      <div>
                        <div className="flex justify-between items-start gap-2 mb-1">
                          <h3 className="font-bold text-sm text-zinc-200 group-hover:text-blue-400 transition">
                            {p.name}
                          </h3>
                          {p.isRecurring && (
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-950 border border-purple-800 text-purple-400 font-bold shrink-0">
                              RECURRING
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-zinc-400">
                          {p.category?.name} • Policy max discount:{" "}
                          <strong className="text-zinc-300">{maxAllowed.toFixed(0)}%</strong>
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-zinc-800/60">
                        <span className="text-sm font-black text-zinc-100 font-mono">
                          ₹{p.basePrice.toLocaleString()}
                        </span>
                        <button
                          onClick={() => addToCart(p)}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition shadow-sm"
                        >
                          + Add
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Upsell / Cross-sell Tip Panel */}
            <div className="p-4 rounded-xl border border-blue-900/40 bg-blue-950/20 flex items-start gap-3">
              <Zap className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-blue-300">Live Upsell Recommendation</p>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Bundling Setup Service or Cloud Storage Plan with Hardware unlocks higher margins and offsets single-item discount ceilings.
                </p>
              </div>
            </div>
          </div>

          {/* Right Panel: Quotation Cart & Governance (5 Cols) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5">
              <h2 className="text-sm font-bold text-zinc-200 mb-4 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-blue-400" />
                  Quote Workspace
                </span>
                <span className="text-xs font-mono text-zinc-400">
                  {cart.length} item(s)
                </span>
              </h2>

              {cart.length === 0 ? (
                <div className="py-12 text-center text-zinc-500 text-xs border border-dashed border-zinc-800 rounded-lg">
                  Cart is empty. Add items from the catalog.
                </div>
              ) : (
                <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                  {lines.map((item) => (
                    <div
                      key={item.product.id}
                      className="bg-zinc-950 border border-zinc-800/80 p-3.5 rounded-lg space-y-2.5"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-bold text-xs text-zinc-200">{item.product.name}</p>
                          <p className="text-[10px] text-zinc-500">
                            Base: ₹{item.product.basePrice.toLocaleString()} | Policy:{" "}
                            {((item.product.category?.maxDiscountPct || 0) * 100).toFixed(0)}%
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-zinc-500 hover:text-red-400 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <label className="text-[10px] text-zinc-400 block mb-1">Qty</label>
                          <input
                            type="number"
                            min="1"
                            value={item.qty}
                            onChange={(e) =>
                              updateQty(item.product.id, parseInt(e.target.value) || 1)
                            }
                            className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1 text-xs text-zinc-200 focus:outline-none focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-zinc-400 block mb-1">
                            Discount (%)
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={(item.discountPct * 100).toFixed(0)}
                            onChange={(e) =>
                              updateDiscount(
                                item.product.id,
                                (parseFloat(e.target.value) || 0) / 100
                              )
                            }
                            className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1 text-xs text-zinc-200 focus:outline-none focus:border-blue-500"
                          />
                        </div>
                      </div>

                      <div className="text-right text-xs font-mono font-bold text-emerald-400">
                        Line Total: ₹{item.lineTotal.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Total Summary */}
              {cart.length > 0 && (
                <div className="border-t border-zinc-800 mt-4 pt-4 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-400">Order Subtotal</span>
                    <span className="font-bold text-zinc-100 font-mono text-base">
                      ₹{orderTotal.toLocaleString()}
                    </span>
                  </div>

                  {/* Blended Risk Score Gauge */}
                  <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-zinc-300 flex items-center gap-1.5">
                        {riskScore > 0 ? (
                          <ShieldAlert className="w-4 h-4 text-amber-500" />
                        ) : (
                          <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        )}
                        Blended Risk Score
                      </span>
                      <span
                        className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${
                          riskScore > 0.08
                            ? "bg-red-950 text-red-400 border border-red-800"
                            : riskScore > 0
                            ? "bg-amber-950 text-amber-400 border border-amber-800"
                            : "bg-emerald-950 text-emerald-400 border border-emerald-800"
                        }`}
                      >
                        {(riskScore * 100).toFixed(1)}%
                      </span>
                    </div>

                    <p className="text-[10px] text-zinc-400">
                      {riskScore > 0.08 ? (
                        <span className="text-red-400 font-medium">
                          ⚠️ Triggers L1 (Sales Mgr) + L2 (Finance) review
                        </span>
                      ) : riskScore > 0 ? (
                        <span className="text-amber-400 font-medium">
                          ⚠️ Triggers L1 (Sales Mgr) review
                        </span>
                      ) : (
                        <span className="text-emerald-400 font-medium">
                          ✅ Auto-approved (within policy ceilings)
                        </span>
                      )}
                    </p>
                  </div>

                  <button
                    onClick={handleCreateQuote}
                    disabled={submitting || cart.length === 0}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition shadow-lg shadow-blue-600/20 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {submitting ? "Submitting..." : "Generate & Submit Quotation"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
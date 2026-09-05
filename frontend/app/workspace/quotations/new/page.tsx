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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-800 flex items-center gap-2.5">
            <FilePlus className="w-7 h-7 text-blue-500" />
            Quotation Builder
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Build live quote, apply item discounts, and inspect the self-governing Blended Risk Score in real time.
          </p>
        </div>
      </div>

      {createdQuotationId ? (
        <div className="max-w-xl mx-auto p-8 rounded-2xl bg-gray-50 border border-emerald-200/60 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Quotation Successfully Created!</h2>
          <p className="text-xs text-gray-500">
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
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg text-xs font-semibold transition"
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
            <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search catalog products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500"
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
                        : "bg-white text-gray-500 hover:text-gray-900 border border-gray-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Cards List */}
            {loading ? (
              <div className="p-8 text-center text-gray-500 text-xs">Loading products...</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredProducts.map((p) => {
                  const maxAllowed = (p.category?.maxDiscountPct || 0) * 100;
                  return (
                    <div
                      key={p.id}
                      className="bg-gray-50 border border-gray-200 hover:border-gray-300 p-4 rounded-xl flex flex-col justify-between transition group"
                    >
                      <div>
                        <div className="flex justify-between items-start gap-2 mb-1">
                          <h3 className="font-bold text-sm text-gray-900 group-hover:text-blue-600 transition">
                            {p.name}
                          </h3>
                          {p.isRecurring && (
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-100 border border-blue-200 text-blue-600 font-bold shrink-0">
                              RECURRING
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-500">
                          {p.category?.name} • Policy max discount:{" "}
                          <strong className="text-gray-600">{maxAllowed.toFixed(0)}%</strong>
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
                        <span className="text-sm font-black text-gray-800 font-mono">
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
            <div className="p-4 rounded-xl border border-blue-200 bg-blue-50 flex items-start gap-3">
              <Zap className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-blue-600">Live Hardware Bundle Upsell</p>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Frequently bundled: Pairing <strong>Apple AirPods Pro</strong> or <strong>Logitech MX Master 3S Mouse</strong> with MacBooks unlocks bulk bundle discounts while keeping the Blended Risk Score safely below the L1 approval threshold.
                </p>
              </div>
            </div>
          </div>

          {/* Right Panel: Quotation Cart & Governance (5 Cols) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
              <h2 className="text-sm font-bold text-gray-900 mb-4 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-blue-600" />
                  Quote Workspace
                </span>
                <span className="text-xs font-mono text-gray-500">
                  {cart.length} item(s)
                </span>
              </h2>

              {cart.length === 0 ? (
                <div className="py-12 text-center text-gray-500 text-xs border border-dashed border-gray-200 rounded-lg">
                  Cart is empty. Add items from the catalog.
                </div>
              ) : (
                <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                  {lines.map((item) => (
                    <div
                      key={item.product.id}
                      className="bg-white border border-gray-200 p-3.5 rounded-lg space-y-2.5"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-bold text-xs text-gray-900">{item.product.name}</p>
                          <p className="text-[10px] text-gray-500">
                            Base: ₹{item.product.basePrice.toLocaleString()} | Policy:{" "}
                            {((item.product.category?.maxDiscountPct || 0) * 100).toFixed(0)}%
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-gray-500 hover:text-red-600 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <label className="text-[10px] text-gray-500 block mb-1">Qty</label>
                          <input
                            type="number"
                            min="1"
                            value={item.qty}
                            onChange={(e) =>
                              updateQty(item.product.id, parseInt(e.target.value) || 1)
                            }
                            className="w-full bg-gray-50 border border-gray-200 rounded px-2.5 py-1 text-xs text-gray-900 focus:outline-none focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-gray-500 block mb-1">
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
                            className="w-full bg-gray-50 border border-gray-200 rounded px-2.5 py-1 text-xs text-gray-900 focus:outline-none focus:border-blue-500"
                          />
                        </div>
                      </div>

                      <div className="text-right text-xs font-mono font-bold text-emerald-600">
                        Line Total: ₹{item.lineTotal.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Total Summary */}
              {cart.length > 0 && (
                <div className="border-t border-gray-200 mt-4 pt-4 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500">Order Subtotal</span>
                    <span className="font-bold text-gray-800 font-mono text-base">
                      ₹{orderTotal.toLocaleString()}
                    </span>
                  </div>

                  {/* Blended Risk Score Gauge */}
                  <div className="p-3 bg-white border border-gray-200 rounded-lg space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-gray-600 flex items-center gap-1.5">
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
                            ? "bg-red-100 text-red-600 border border-red-200"
                            : riskScore > 0
                            ? "bg-amber-100 text-amber-600 border border-amber-200"
                            : "bg-emerald-100 text-emerald-600 border border-emerald-200"
                        }`}
                      >
                        {(riskScore * 100).toFixed(1)}%
                      </span>
                    </div>

                    <p className="text-[10px] text-gray-500">
                      {riskScore > 0.08 ? (
                        <span className="text-red-600 font-medium">
                          ⚠️ Triggers L1 (Sales Mgr) + L2 (Finance) review
                        </span>
                      ) : riskScore > 0 ? (
                        <span className="text-amber-600 font-medium">
                          ⚠️ Triggers L1 (Sales Mgr) review
                        </span>
                      ) : (
                        <span className="text-emerald-600 font-medium">
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
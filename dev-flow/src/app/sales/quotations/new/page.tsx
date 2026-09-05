"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { WorkspaceLayout } from "@/components/layout/WorkspaceLayout";
import { UserRole } from "@/types/auth";
import { 
  FileText, Plus, Trash2, ShieldCheck, AlertCircle, CheckCircle2, 
  Send, ArrowRight, DollarSign, Calculator
} from "lucide-react";
import { cn } from "@/lib/utils";

interface QuoteLineItem {
  id: string;
  name: string;
  basePrice: number;
  quantity: number;
  discountPercent: number;
}

const CATALOG_ITEMS = [
  { name: "Siemens 3-Phase Induction Motor 5.5kW", basePrice: 34500 },
  { name: "Schneider Electric Molded Case Breaker 250A", basePrice: 14200 },
  { name: "ABB ACS380 Machinery VFD 7.5kW", basePrice: 42000 },
  { name: "SKF Deep Groove Ball Bearing 6205", basePrice: 385 },
  { name: "Festo Solenoid Directional Valve 24V", basePrice: 3400 },
  { name: "Polycab 4-Core Copper Armored Cable 100m", basePrice: 38900 }
];

export default function CreateQuotationPage() {
  const router = useRouter();
  const [customer, setCustomer] = useState("Nova Retail Innovations Pvt Ltd");
  const [items, setItems] = useState<QuoteLineItem[]>([
    { id: "1", name: "Siemens 3-Phase Induction Motor 5.5kW", basePrice: 34500, quantity: 10, discountPercent: 8 },
    { id: "2", name: "ABB ACS380 Machinery VFD 7.5kW", basePrice: 42000, quantity: 5, discountPercent: 12 }
  ]);
  const [paymentTerms, setPaymentTerms] = useState("50_ADVANCE_50_DELIVERY");
  const [submitted, setSubmitted] = useState(false);

  const addItem = (catalogItem: { name: string; basePrice: number }) => {
    setItems([
      ...items,
      {
        id: Date.now().toString(),
        name: catalogItem.name,
        basePrice: catalogItem.basePrice,
        quantity: 1,
        discountPercent: 5
      }
    ]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const updateQuantity = (id: string, qty: number) => {
    setItems(items.map(i => i.id === id ? { ...i, quantity: Math.max(1, qty) } : i));
  };

  const updateDiscount = (id: string, disc: number) => {
    setItems(items.map(i => i.id === id ? { ...i, discountPercent: Math.max(0, Math.min(30, disc)) } : i));
  };

  const subtotal = items.reduce((acc, curr) => acc + (curr.basePrice * curr.quantity), 0);
  const totalDiscount = items.reduce((acc, curr) => acc + ((curr.basePrice * curr.quantity) * (curr.discountPercent / 100)), 0);
  const netAmount = subtotal - totalDiscount;
  const gstTax = netAmount * 0.18;
  const grandTotal = netAmount + gstTax;
  const averageDiscount = subtotal > 0 ? (totalDiscount / subtotal) * 100 : 0;
  const requiresManagerApproval = averageDiscount > 10;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      router.push("/sales/deals");
    }, 2000);
  };

  return (
    <WorkspaceLayout role={UserRole.SALES_REP}>
      <div className="max-w-5xl mx-auto space-y-8 pb-16">
        
        {/* HEADER */}
        <div>
          <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-1">Commercial CPQ</div>
          <h1 className="text-3xl lg:text-4xl font-bold text-navy tracking-tight mb-2">Create Customer Quotation</h1>
          <p className="text-navy/60 font-medium text-sm md:text-base">
            Configure line items, volume pricing, and trigger multi-tier approval chains automatically.
          </p>
        </div>

        {submitted && (
          <div className="p-6 bg-lime/20 border border-lime/30 rounded-3xl flex items-center gap-4 text-lime-950 font-semibold">
            <CheckCircle2 className="w-8 h-8 text-lime-700 shrink-0" />
            <div>
              <div className="text-base font-bold">Quotation Successfully Generated!</div>
              <div className="text-xs font-normal">Quotation QT-2059 has been routed to the Sales Manager approval queue. Redirecting...</div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* CUSTOMER & TERMS */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-navy/5 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-navy">Account & Terms</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-navy/70 uppercase tracking-wider mb-2">Customer Account</label>
                <select 
                  value={customer}
                  onChange={(e) => setCustomer(e.target.value)}
                  className="w-full px-4 py-2.5 bg-navy/5 rounded-xl text-sm font-medium text-navy focus:outline-none"
                >
                  <option>Nova Retail Innovations Pvt Ltd</option>
                  <option>Bharat Heavy Forge Corp</option>
                  <option>Apex Logistics India Pvt Ltd</option>
                  <option>Zenith Precision Tools Ltd</option>
                  <option>Kirloskar Power Components</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy/70 uppercase tracking-wider mb-2">Escrow Milestone Terms</label>
                <select 
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  className="w-full px-4 py-2.5 bg-navy/5 rounded-xl text-sm font-medium text-navy focus:outline-none"
                >
                  <option value="50_ADVANCE_50_DELIVERY">50% Advance on PO / 50% on Delivery</option>
                  <option value="100_ESCROW">100% Escrow Protected on PO</option>
                  <option value="30_DAYS_NET">Net 30 Days Post-Verification</option>
                </select>
              </div>
            </div>
          </div>

          {/* LINE ITEMS */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-navy/5 shadow-sm space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-navy">Quotation Line Items</h2>
              <div className="text-xs text-navy/60 font-medium">Quick add from catalog:</div>
            </div>

            {/* QUICK ADD CATALOG */}
            <div className="flex flex-wrap gap-2">
              {CATALOG_ITEMS.map((catItem) => (
                <button
                  type="button"
                  key={catItem.name}
                  onClick={() => addItem(catItem)}
                  className="px-3 py-1.5 bg-navy/5 hover:bg-navy/10 text-navy text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-3 h-3" /> {catItem.name.split(" ")[0]} ({catItem.name.split(" ")[1]})
                </button>
              ))}
            </div>

            {/* ITEMS LIST */}
            <div className="space-y-4 pt-4 border-t border-navy/5">
              {items.map((item) => {
                const itemTotal = (item.basePrice * item.quantity) * (1 - item.discountPercent / 100);
                return (
                  <div key={item.id} className="p-4 bg-navy/[0.02] rounded-2xl border border-navy/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="font-bold text-navy text-sm">{item.name}</div>
                      <div className="text-xs text-navy/50">Base Price: ₹{item.basePrice.toLocaleString("en-IN")}</div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-navy/60 font-medium">Qty:</label>
                        <input 
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                          className="w-16 px-2 py-1 bg-white border border-navy/10 rounded-lg text-sm font-bold text-center"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <label className="text-xs text-navy/60 font-medium">Disc %:</label>
                        <input 
                          type="number"
                          min="0"
                          max="30"
                          value={item.discountPercent}
                          onChange={(e) => updateDiscount(item.id, parseInt(e.target.value) || 0)}
                          className="w-16 px-2 py-1 bg-white border border-navy/10 rounded-lg text-sm font-bold text-center"
                        />
                      </div>

                      <div className="w-28 text-right font-bold text-navy text-sm">
                        ₹{Math.round(itemTotal).toLocaleString("en-IN")}
                      </div>

                      <button 
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* FINANCIAL SUMMARY & APPROVAL GOVERNANCE */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-navy/5 shadow-sm flex flex-col md:flex-row justify-between gap-8">
            <div className="space-y-4 max-w-md">
              <div className="text-xs font-bold uppercase tracking-wider text-navy/40">COMMERCIAL GOVERNANCE</div>
              {requiresManagerApproval ? (
                <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                  <div className="text-xs font-medium text-amber-950">
                    <strong className="block font-bold mb-0.5">Manager Approval Required</strong>
                    Average discount of {averageDiscount.toFixed(1)}% exceeds the 10% auto-approval threshold. This quote will route to the Sales Manager first.
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-lime/20 border border-lime/30 rounded-2xl flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-lime-700 shrink-0 mt-0.5" />
                  <div className="text-xs font-medium text-lime-950">
                    <strong className="block font-bold mb-0.5">Instant Customer Transmission Eligible</strong>
                    Discount within standard policy limits. Ready for direct customer sign-off.
                  </div>
                </div>
              )}
            </div>

            <div className="w-full md:w-80 space-y-2 text-sm border-t md:border-t-0 pt-4 md:pt-0">
              <div className="flex justify-between text-navy/60 font-medium">
                <span>Subtotal Catalog Price:</span>
                <span>₹{Math.round(subtotal).toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>Total Discount Applied:</span>
                <span>- ₹{Math.round(totalDiscount).toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-navy/60 font-medium">
                <span>Applicable GST (18%):</span>
                <span>₹{Math.round(gstTax).toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-navy font-bold text-lg pt-2 border-t border-navy/5">
                <span>Grand Total:</span>
                <span>₹{Math.round(grandTotal).toLocaleString("en-IN")}</span>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl font-bold text-white bg-navy shadow-lg shadow-navy/20 hover:bg-navy/90 transition-all text-sm flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" /> Submit for Approval
                </button>
              </div>
            </div>
          </div>

        </form>

      </div>
    </WorkspaceLayout>
  );
}
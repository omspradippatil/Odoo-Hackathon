"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { WorkspaceLayout } from "@/components/layout/WorkspaceLayout";
import { UserRole } from "@/types/auth";
import { QuotationItem, QuotationSummary } from "@/types/quotation";
import { ArrowRight, Check, Activity, ShieldCheck, Tag, Plus, PlusCircle, Building2, MapPin, Package, FileText, Settings, X, MoreHorizontal, Save, Eye, TrendingUp } from "lucide-react";
import * as motion from "framer-motion/client";
import { AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { demoState, QuotationApprovalState } from "@/lib/demoState";

// --- MOCK INITIAL DATA ---
const INITIAL_ITEMS: QuotationItem[] = [
  {
    id: "item-1",
    productName: "Business Laptop (Vertex Systems)",
    vendorName: "Vertex Systems",
    quantity: 30,
    vendorCostUnit: 94000,
    sellingPriceUnit: 102000,
    discountPercent: 0,
    taxRatePercent: 18,
    billingType: 'ONE_TIME',
    recurrence: null
  },
  {
    id: "item-2",
    productName: "Business Laptop (NexaByte Solutions)",
    vendorName: "NexaByte Solutions",
    quantity: 20,
    vendorCostUnit: 91000,
    sellingPriceUnit: 99000,
    discountPercent: 0,
    taxRatePercent: 18,
    billingType: 'ONE_TIME',
    recurrence: null
  }
];

const UPSELLS = [
  {
    id: "up-1",
    productName: "Extended Warranty (3 Years)",
    vendorName: "Vertex Systems",
    quantity: 50,
    vendorCostUnit: 3060,
    sellingPriceUnit: 4500,
    discountPercent: 0,
    taxRatePercent: 18,
    billingType: 'ONE_TIME',
    recurrence: null,
    insight: "Frequently paired with business laptops. Estimated margin impact: +₹72,000",
    revenueLabel: "₹2,25,000"
  },
  {
    id: "up-2",
    productName: "Microsoft 365 Business Standard",
    vendorName: "SoftwareHub Direct",
    quantity: 50,
    vendorCostUnit: 800,
    sellingPriceUnit: 1100,
    discountPercent: 0,
    taxRatePercent: 18,
    billingType: 'RECURRING',
    recurrence: 'MONTHLY',
    insight: "High-margin recurring revenue stream.",
    revenueLabel: "₹55,000 / month"
  }
];

const formatCurrency = (val: number) => `₹${val.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

export default function QuotationBuilderPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();

  const [items, setItems] = useState<QuotationItem[]>(INITIAL_ITEMS);
  const [summary, setSummary] = useState<QuotationSummary | null>(null);
  const [availableUpsells, setAvailableUpsells] = useState(UPSELLS);
  const [showUpsellAnim, setShowUpsellAnim] = useState<string | null>(null);
  const [approvalState, setApprovalState] = useState<QuotationApprovalState>('DRAFT');
  const [isRequestingApproval, setIsRequestingApproval] = useState(false);
  const [approvalError, setApprovalError] = useState<string | null>(null);

  useEffect(() => {
    const syncState = () => {
      setApprovalState(demoState.getQuotationApprovalState('QT-2048'));
    };
    syncState();
    const unsub = demoState.subscribeQuotationState(syncState);
    return () => unsub();
  }, []);

  // MOCK BUSINESS LOGIC (Will be owned by Spring Boot later)
  useEffect(() => {
    let oneTimeSubtotal = 0;
    let recurringSubtotal = 0;
    let totalDiscount = 0;
    let totalTax = 0;
    let totalVendorCost = 0;

    let hasHighDiscount = false;

    items.forEach(item => {
      const isRecurring = item.billingType === 'RECURRING';
      const basePrice = item.quantity * item.sellingPriceUnit;
      const discountAmount = (basePrice * item.discountPercent) / 100;
      const netValue = basePrice - discountAmount;
      const taxAmount = (netValue * item.taxRatePercent) / 100;
      const cost = item.quantity * item.vendorCostUnit;

      if (isRecurring) {
        recurringSubtotal += netValue;
      } else {
        oneTimeSubtotal += basePrice;
        totalDiscount += discountAmount;
        totalTax += taxAmount;
        totalVendorCost += cost;
      }

      if (item.discountPercent > 5) hasHighDiscount = true;
    });

    const netOneTimeValue = oneTimeSubtotal - totalDiscount;
    const grandTotalOneTime = netOneTimeValue + totalTax;
    const grandTotalRecurring = recurringSubtotal + (recurringSubtotal * 0.18); // simplifying recurring tax
    
    const grossMargin = netOneTimeValue - totalVendorCost;
    const marginPercentage = netOneTimeValue > 0 ? (grossMargin / netOneTimeValue) * 100 : 0;

    let marginHealth: 'HEALTHY' | 'WATCH' | 'LOW' = 'HEALTHY';
    if (marginPercentage < 8) marginHealth = 'LOW';
    else if (marginPercentage < 12) marginHealth = 'WATCH';

    setSummary({
      oneTimeSubtotal,
      recurringSubtotal,
      totalDiscount,
      netOneTimeValue,
      totalTax,
      grandTotalOneTime,
      grandTotalRecurring,
      totalVendorCost,
      grossMargin,
      marginPercentage,
      requiresApproval: hasHighDiscount || (totalDiscount > 0 && marginPercentage < 10), // Example policy
      approvalReason: hasHighDiscount ? "Discount exceeds permitted threshold (> 5%)" : "Margin below acceptable limit.",
      marginHealth
    });

  }, [items]);

  const updateItem = (id: string, field: keyof QuotationItem, value: number) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleAddUpsell = (upsell: any) => {
    setAvailableUpsells(prev => prev.filter(u => u.id !== upsell.id));
    
    // Tiny UI feedback
    setShowUpsellAnim(upsell.productName);
    setTimeout(() => setShowUpsellAnim(null), 3000);

    const newItem: QuotationItem = {
      id: Math.random().toString(36).substr(2, 9),
      productName: upsell.productName,
      vendorName: upsell.vendorName,
      quantity: upsell.quantity,
      vendorCostUnit: upsell.vendorCostUnit,
      sellingPriceUnit: upsell.sellingPriceUnit,
      discountPercent: upsell.discountPercent,
      taxRatePercent: upsell.taxRatePercent,
      billingType: upsell.billingType,
      recurrence: upsell.recurrence
    };
    
    setItems([...items, newItem]);
  };

  const handleRequestApproval = () => {
    if (isRequestingApproval || approvalState === 'PENDING_APPROVAL' || approvalState === 'APPROVED') return;
    setIsRequestingApproval(true);
    setApprovalError(null);

    setTimeout(() => {
      try {
        demoState.setQuotationApprovalState('QT-2048', 'PENDING_APPROVAL');
        demoState.addNotification({
          title: "Approval Requested",
          message: "Approval requested for QT-2048 (Discount exceeds current approval authority)",
          type: "approval",
          targetUrl: "/approvals/QT-2048",
          badgeText: "Approval"
        });
        setIsRequestingApproval(false);
      } catch {
        setIsRequestingApproval(false);
        setApprovalError("Approval request could not be submitted. Please try again.");
      }
    }, 700);
  };

  const handleContinue = () => {
    if (approvalState === 'APPROVED') {
      router.push(`/negotiation/QT-2048`);
    } else if (summary?.requiresApproval) {
      if (approvalState === 'PENDING_APPROVAL') {
        router.push(`/approvals/QT-2048`);
      } else {
        handleRequestApproval();
      }
    } else {
      router.push(`/negotiation/QT-2048`);
    }
  };

  if (!summary) return null;

  return (
    <WorkspaceLayout role={UserRole.SALES_REP}>
      
      {/* JOURNEY HEADER */}
      <div className="mb-8 md:mb-12">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-[10px] font-bold text-navy/40 uppercase tracking-widest">
            <span>Deals</span> <span className="text-navy/20">/</span> <span>{resolvedParams.id}</span> <span className="text-navy/20">/</span> <span className="text-navy">Build Quotation</span>
          </div>
          <div className="bg-navy/10 text-navy px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-navy" /> DRAFT
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-navy tracking-tight mb-2">Build your quotation</h1>
            <p className="text-navy/60 font-medium text-lg max-w-2xl">
              Turn your selected sourcing option into a clear, profitable and approval-ready deal.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <button className="px-5 py-2.5 rounded-xl font-bold text-navy bg-white border border-navy/10 shadow-sm hover:bg-navy/5 transition-colors flex items-center gap-2">
              <Eye className="w-4 h-4" /> Preview
            </button>
            <button className="px-5 py-2.5 rounded-xl font-bold text-white bg-navy shadow-lg shadow-navy/20 hover:bg-navy/90 transition-colors flex items-center gap-2">
              <Save className="w-4 h-4" /> Save Draft
            </button>
          </div>
        </div>

        {demoState.getAnonymousBidding() && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 bg-lime/10 border border-lime/20 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-lime/20 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-lime-700" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-lime-800 uppercase tracking-widest mb-1">Identity Revealed</div>
              <div className="text-sm font-bold text-navy">Commercial selection confirmed. Vendor identities (Vertex Systems, NexaByte) are now unmasked for quotation building.</div>
            </div>
          </motion.div>
        )}

        {/* SIGNATURE MOTION LINE */}
        <div className="w-full bg-white p-4 rounded-2xl border border-navy/5 shadow-sm overflow-x-auto no-scrollbar">
          <div className="flex items-center min-w-[700px] justify-between relative px-4">
            <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-[2px] bg-navy/5 -z-10" />
            
            {/* The line to APPROVAL animates if approval is required */}
            {summary.requiresApproval && (
              <motion.div 
                className="absolute left-[35%] top-1/2 -translate-y-1/2 h-[2px] bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.6)]"
                initial={{ width: 0 }}
                animate={{ width: "15%" }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
            )}

            {[
              { id: 'REQUEST', label: 'REQUEST', state: 'done' },
              { id: 'DISCOVER', label: 'DISCOVER', state: 'done' },
              { id: 'QUOTE', label: 'QUOTE', state: approvalState === 'PENDING_APPROVAL' || approvalState === 'APPROVED' ? 'done' : 'active' },
              { id: 'APPROVE', label: 'APPROVE', state: approvalState === 'APPROVED' ? 'done' : approvalState === 'PENDING_APPROVAL' ? 'active' : summary.requiresApproval ? 'next' : 'idle' },
              { id: 'NEGOTIATE', label: 'NEGOTIATE', state: approvalState === 'APPROVED' ? 'active' : !summary.requiresApproval ? 'next' : 'idle' },
              { id: 'PROTECT', label: 'PROTECT', state: 'idle' },
              { id: 'FULFIL', label: 'FULFIL', state: 'idle' },
              { id: 'BILL', label: 'BILL', state: 'idle' },
            ].map((stage, i) => (
              <div key={stage.id} className="flex flex-col items-center gap-2 bg-white px-2 z-10 relative">
                <div className={cn("w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all", 
                  stage.state === 'done' ? "border-lime bg-lime" :
                  stage.state === 'active' ? "border-cobalt bg-white shadow-[0_0_10px_rgba(83,103,255,0.4)]" : 
                  stage.state === 'next' && stage.id === 'APPROVE' ? "border-orange-500 bg-white" :
                  stage.state === 'next' ? "border-navy bg-white" : "border-navy/10 bg-white")}>
                  {stage.state === 'done' && <Check className="w-2.5 h-2.5 text-lime-950" />}
                  {stage.state === 'active' && <motion.div layoutId="flow-dot" className="w-1.5 h-1.5 bg-cobalt rounded-full" />}
                  {stage.state === 'next' && stage.id === 'APPROVE' && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1 }} className="w-1.5 h-1.5 bg-orange-500 rounded-full" />}
                </div>
                <span className={cn("text-[9px] font-bold uppercase tracking-widest transition-colors", 
                  stage.state === 'active' ? "text-cobalt" : 
                  stage.state === 'done' ? "text-lime-700" : 
                  stage.state === 'next' && stage.id === 'APPROVE' ? "text-orange-600" : 
                  stage.state === 'next' ? "text-navy" : "text-navy/30")}>
                  {stage.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start relative">
        
        {/* LEFT COLUMN - MAIN BUILDER */}
        <div className="w-full lg:w-[65%] space-y-8 pb-24 lg:pb-0">
          
          {/* SOURCE CONTEXT */}
          <div className="bg-gradient-to-r from-navy to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cobalt/20 rounded-full blur-3xl pointer-events-none" />
            <div className="flex items-center gap-2 mb-6">
              <ShieldCheck className="w-5 h-5 text-lime" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-lime">Source Selected</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
              {/* Multi-vendor visual */}
              <div className="flex items-center gap-6 w-full">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center font-bold text-white mb-2">50</div>
                  <div className="text-[9px] font-bold text-white/50 uppercase tracking-widest">Required</div>
                </div>
                
                <div className="flex flex-col justify-center gap-3 flex-1 relative">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-[2px] bg-white/20" />
                  <div className="absolute left-8 top-1/2 -translate-y-6 w-[2px] h-3 bg-white/20" />
                  <div className="absolute left-8 top-1/2 translate-y-3 w-[2px] h-3 bg-white/20" />
                  <div className="absolute left-8 top-[calc(50%-24px)] w-4 h-[2px] bg-white/20" />
                  <div className="absolute left-8 top-[calc(50%+24px)] w-4 h-[2px] bg-white/20" />

                  <div className="ml-12 bg-white/10 px-4 py-2 rounded-xl flex items-center justify-between text-sm">
                    <span className="font-bold text-white">Vertex Systems</span>
                    <span className="text-white/60 font-medium">30 units @ ₹94K</span>
                  </div>
                  <div className="ml-12 bg-white/10 px-4 py-2 rounded-xl flex items-center justify-between text-sm">
                    <span className="font-bold text-white">NexaByte Solutions</span>
                    <span className="text-white/60 font-medium">20 units @ ₹91K</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CUSTOMER CONTEXT */}
          <div className="bg-white rounded-3xl p-6 border border-navy/5 shadow-sm flex items-center justify-between">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-navy/5 text-navy flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-navy mb-1">ABC ENTERPRISES</h3>
                <div className="text-xs font-medium text-navy/60">Mumbai, Maharashtra • GSTIN: 27XXXXXXXXXXXXX</div>
              </div>
            </div>
            <button className="text-[10px] font-bold text-cobalt hover:text-navy uppercase tracking-widest">Edit</button>
          </div>

          {/* QUOTATION LINE ITEMS */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-navy">Line Items</h2>
              <button className="text-xs font-bold text-cobalt hover:text-navy transition-colors flex items-center gap-1 uppercase tracking-widest bg-cobalt/10 px-3 py-1.5 rounded-lg"><Plus className="w-4 h-4" /> Add Item</button>
            </div>

            <div className="space-y-4">
              <AnimatePresence>
                {items.map((item, idx) => (
                  <motion.div key={item.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-3xl border border-navy/10 shadow-sm overflow-hidden">
                    
                    <div className="bg-navy/5 px-6 py-4 border-b border-navy/5 flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-navy/40 uppercase tracking-widest bg-white px-2 py-1 rounded-md shadow-sm">Item 0{idx + 1}</span>
                        <h3 className="text-sm font-bold text-navy">{item.productName}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.billingType === 'RECURRING' && <span className="text-[10px] font-bold text-cobalt bg-cobalt/10 px-2 py-1 rounded-full uppercase tracking-widest">Recurring ({item.recurrence})</span>}
                        <button onClick={() => removeItem(item.id)} className="w-8 h-8 rounded-full flex items-center justify-center text-navy/40 hover:text-coral hover:bg-coral/10 transition-colors"><X className="w-4 h-4" /></button>
                      </div>
                    </div>

                    <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-6">
                      <div className="col-span-2 sm:col-span-1">
                        <label className="block text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-2">Quantity</label>
                        <input type="number" min="1" className="w-full h-11 px-4 rounded-xl bg-warm/50 border border-navy/10 focus:outline-none focus:border-cobalt font-medium text-sm" value={item.quantity} onChange={e => updateItem(item.id, 'quantity', Number(e.target.value))} />
                      </div>
                      
                      <div className="col-span-2 sm:col-span-1">
                        <label className="block text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-2">Selling Price</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/40 font-medium">₹</span>
                          <input type="number" className="w-full h-11 pl-8 pr-4 rounded-xl bg-warm/50 border border-navy/10 focus:outline-none focus:border-cobalt font-medium text-sm" value={item.sellingPriceUnit} onChange={e => updateItem(item.id, 'sellingPriceUnit', Number(e.target.value))} />
                        </div>
                        <div className="text-[9px] font-medium text-navy/40 mt-1">Cost: {formatCurrency(item.vendorCostUnit)}</div>
                      </div>

                      <div className="col-span-2 sm:col-span-1">
                        <label className="block text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-2">Discount %</label>
                        <div className="relative">
                          <input type="number" min="0" max="100" className={cn("w-full h-11 pl-4 pr-8 rounded-xl bg-warm/50 border focus:outline-none focus:border-cobalt font-medium text-sm transition-colors", item.discountPercent > 5 ? "border-orange-300 text-orange-700 bg-orange-50" : "border-navy/10")} value={item.discountPercent} onChange={e => updateItem(item.id, 'discountPercent', Number(e.target.value))} />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-navy/40 font-medium">%</span>
                        </div>
                      </div>

                      <div className="col-span-2 sm:col-span-1 flex flex-col justify-center items-end">
                        <label className="block text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-1 text-right w-full">Line Total</label>
                        <div className="text-lg font-bold text-navy">
                          {formatCurrency((item.quantity * item.sellingPriceUnit) * (1 - item.discountPercent / 100))}
                        </div>
                        {item.billingType === 'RECURRING' && <div className="text-[9px] font-bold text-navy/40 uppercase tracking-widest">/ {item.recurrence}</div>}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* UPSELL INTELLIGENCE */}
          {availableUpsells.length > 0 && (
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-2 px-2">
                <TrendingUp className="w-5 h-5 text-cobalt" />
                <h2 className="text-lg font-bold text-navy">DEV FLOW Suggests</h2>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <AnimatePresence>
                  {availableUpsells.map(upsell => (
                    <motion.div key={upsell.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white p-5 rounded-2xl border border-cobalt/20 shadow-sm relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cobalt/10 to-transparent rounded-bl-full pointer-events-none" />
                      
                      <div className="flex justify-between items-start mb-4 relative z-10">
                        <div>
                          <h3 className="text-sm font-bold text-navy mb-1 pr-4">{upsell.productName}</h3>
                          <div className="text-xs font-medium text-navy/60">{upsell.insight}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-end justify-between mt-4 relative z-10">
                        <div>
                          <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-1">Potential Value</div>
                          <div className="text-base font-bold text-navy">{upsell.revenueLabel}</div>
                        </div>
                        <button onClick={() => handleAddUpsell(upsell)} className="px-4 py-2 bg-cobalt/10 hover:bg-cobalt text-cobalt hover:text-white transition-colors rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm">
                          <Plus className="w-3 h-3" /> Add
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* COMMERCIAL TERMS */}
          <div className="space-y-4 pt-4">
            <h2 className="text-lg font-bold text-navy px-2">Commercial Terms & Notes</h2>
            <div className="bg-white p-6 rounded-3xl border border-navy/10 shadow-sm grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-navy/60 uppercase tracking-widest mb-2">Quotation Valid Until</label>
                <input type="text" defaultValue="15 Days" className="w-full h-11 px-4 rounded-xl bg-warm/50 border border-navy/10 focus:outline-none focus:border-cobalt font-medium text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-navy/60 uppercase tracking-widest mb-2">Payment Terms</label>
                <input type="text" defaultValue="30% advance / 70% on delivery" className="w-full h-11 px-4 rounded-xl bg-warm/50 border border-navy/10 focus:outline-none focus:border-cobalt font-medium text-sm" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-navy/60 uppercase tracking-widest mb-2">Customer Notes (Visible on Quote)</label>
                <textarea rows={3} defaultValue="Delivery expected within 7 business days after confirmation." className="w-full p-4 rounded-xl bg-warm/50 border border-navy/10 focus:outline-none focus:border-cobalt font-medium text-sm resize-none" />
              </div>
              <div className="md:col-span-2">
                <label className="flex items-center justify-between text-xs font-bold text-navy/60 uppercase tracking-widest mb-2">
                  <span>Internal Notes</span>
                  <span className="text-[9px] text-coral bg-coral/10 px-2 py-0.5 rounded-full">Not visible to customer</span>
                </label>
                <textarea rows={2} placeholder="Internal commercial context..." className="w-full p-4 rounded-xl bg-coral/5 border border-coral/10 focus:outline-none focus:border-coral font-medium text-sm resize-none" />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - STICKY DEAL SUMMARY */}
        <div className="hidden lg:block w-[35%]">
          <div className="sticky top-28 space-y-6">
            
            {/* DEAL SUMMARY */}
            <div className="bg-white rounded-3xl border border-navy/10 shadow-xl shadow-navy/5 overflow-hidden">
              <div className="p-6 md:p-8 bg-navy text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-cobalt/30 rounded-full blur-3xl pointer-events-none" />
                <h2 className="text-xs font-bold uppercase tracking-widest text-white/50 mb-6">Deal Summary</h2>
                
                <div className="space-y-4 mb-6 text-sm">
                  <div className="flex justify-between font-medium">
                    <span className="text-white/70">Subtotal</span>
                    <span>{formatCurrency(summary.oneTimeSubtotal)}</span>
                  </div>
                  {summary.totalDiscount > 0 && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex justify-between font-bold text-coral">
                      <span>Discount</span>
                      <span>− {formatCurrency(summary.totalDiscount)}</span>
                    </motion.div>
                  )}
                  <div className="flex justify-between font-medium border-t border-white/10 pt-4">
                    <span className="text-white/70">Net Value</span>
                    <span>{formatCurrency(summary.netOneTimeValue)}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span className="text-white/70">GST (18%)</span>
                    <span>{formatCurrency(summary.totalTax)}</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/20">
                  <div className="flex justify-between items-end">
                    <div className="text-[10px] font-bold text-white/50 uppercase tracking-widest">ONE-TIME TOTAL</div>
                    <div className="text-3xl font-bold">{formatCurrency(summary.grandTotalOneTime)}</div>
                  </div>
                </div>

                {summary.recurringSubtotal > 0 && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-6 pt-6 border-t border-white/10 bg-white/5 -mx-8 px-8 pb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-lime animate-pulse" />
                      <span className="text-[10px] font-bold text-lime uppercase tracking-widest">HYBRID DEAL - RECURRING</span>
                    </div>
                    <div className="flex justify-between items-end">
                      <div className="text-sm font-medium text-white/70">Software & Services</div>
                      <div className="text-xl font-bold text-white text-right">
                        {formatCurrency(summary.grandTotalRecurring)}
                        <span className="text-[10px] block text-white/50 uppercase tracking-widest font-normal">/ month (incl. tax)</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* INTERNAL MARGIN SECTION */}
              <div className="p-6 md:p-8 bg-white border-b border-navy/5 relative">
                {/* Temporary animation badge when upsell added */}
                <AnimatePresence>
                  {showUpsellAnim && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute -top-12 left-0 right-0 bg-lime-100 text-lime-800 text-xs font-bold text-center py-2 px-4 shadow-sm z-20 flex justify-center items-center gap-2">
                      DEAL UPDATED <Check className="w-3 h-3" />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xs font-bold text-navy/40 uppercase tracking-widest flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" /> Internal Margin Health
                  </h3>
                  <div className={cn(
                    "text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full",
                    summary.marginHealth === 'HEALTHY' ? "bg-lime/20 text-lime-800" :
                    summary.marginHealth === 'WATCH' ? "bg-orange-100 text-orange-700" : "bg-coral/10 text-coral"
                  )}>
                    {summary.marginHealth}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-navy/5 p-4 rounded-xl">
                    <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-1">Vendor Cost</div>
                    <div className="text-sm font-bold text-navy">{formatCurrency(summary.totalVendorCost)}</div>
                  </div>
                  <div className="bg-navy/5 p-4 rounded-xl">
                    <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-1">Est. Margin</div>
                    <div className={cn("text-lg font-bold", summary.marginHealth === 'LOW' ? "text-coral" : "text-lime-700")}>
                      {formatCurrency(summary.grossMargin)}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-xs font-bold text-navy mt-4">
                  <span>Margin %</span>
                  <span className={cn(summary.marginHealth === 'LOW' ? "text-coral" : "text-lime-700")}>
                    {summary.marginPercentage.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* APPROVAL GOVERNANCE */}
              <div className="p-6 md:p-8 bg-warm/30 relative">
                <AnimatePresence mode="wait">
                  {summary.requiresApproval ? (
                    approvalState === 'APPROVED' ? (
                      <motion.div key="approved" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                        <div className="flex items-center gap-2 text-lime-800 bg-lime/20 p-3 rounded-lg border border-lime/30">
                          <Check className="w-5 h-5 shrink-0" />
                          <span className="text-xs font-bold uppercase tracking-widest">QT-2048 Approved</span>
                        </div>
                        <p className="text-xs font-medium text-navy/70 leading-relaxed bg-white p-4 rounded-xl shadow-sm border border-navy/5">
                          Commercial terms have been approved by the Sales Manager. Quotation is authorized to move to customer negotiation.
                        </p>
                        <button 
                          onClick={() => router.push('/negotiation/QT-2048')} 
                          className="w-full py-4 rounded-xl bg-cobalt hover:bg-cobalt/90 transition-colors text-white font-bold text-sm shadow-lg shadow-cobalt/20 flex items-center justify-center gap-2 mt-2"
                        >
                          Continue to Negotiation <ArrowRight className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ) : approvalState === 'PENDING_APPROVAL' ? (
                      <motion.div key="pending" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                        <div className="flex items-center gap-2 text-orange-700 bg-orange-100 p-3 rounded-lg border border-orange-200">
                          <Activity className="w-5 h-5 shrink-0 animate-pulse" />
                          <span className="text-xs font-bold uppercase tracking-widest">PENDING APPROVAL</span>
                        </div>

                        {/* APPROVAL STATUS CARD */}
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-navy/10 space-y-3">
                          <div className="flex items-center justify-between pb-2 border-b border-navy/5">
                            <span className="text-xs font-bold text-navy uppercase tracking-wider">Approval Requested</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 border border-orange-200">Pending Review</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-[10px] font-bold text-navy/40 uppercase tracking-widest block">Quotation</span>
                              <span className="font-bold text-navy">QT-2048</span>
                            </div>
                            <div>
                              <span className="text-[10px] font-bold text-navy/40 uppercase tracking-widest block">Version</span>
                              <span className="font-bold text-navy">V1</span>
                            </div>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-navy/40 uppercase tracking-widest block">Reason</span>
                            <span className="font-medium text-navy/70 text-xs">{summary.approvalReason || "Discount exceeds current approval authority"}</span>
                          </div>
                          <div className="pt-2 border-t border-navy/5 flex items-center justify-between">
                            <div>
                              <span className="text-[10px] font-bold text-navy/40 uppercase tracking-widest block">Requested From</span>
                              <span className="font-bold text-navy text-xs">Sales Manager</span>
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] font-bold text-navy/40 uppercase tracking-widest block">Status</span>
                              <span className="font-bold text-orange-600 text-xs">Pending Review</span>
                            </div>
                          </div>
                        </div>

                        {/* Non-destructive status/action area */}
                        <div className="p-4 bg-orange-50/80 rounded-xl border border-orange-200/80 text-center space-y-2">
                          <div className="text-xs font-bold text-orange-800 flex items-center justify-center gap-1.5">
                            <Check className="w-4 h-4 text-orange-600" /> Approval Requested ✓
                          </div>
                          <div className="text-[11px] font-medium text-orange-700/80">
                            Waiting for Manager Review
                          </div>
                          <button 
                            onClick={() => router.push('/approvals/QT-2048')}
                            className="w-full mt-2 py-2.5 rounded-lg bg-white border border-orange-200 text-orange-800 text-xs font-bold hover:bg-orange-100 transition-colors flex items-center justify-center gap-1.5"
                          >
                            View in Approval Center <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div key="approval-request" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                        <div className="flex items-center gap-2 text-orange-600 bg-orange-100 p-3 rounded-lg border border-orange-200">
                          <Activity className="w-5 h-5 shrink-0" />
                          <span className="text-xs font-bold uppercase tracking-widest">Approval Required</span>
                        </div>
                        <p className="text-xs font-medium text-navy/60 leading-relaxed bg-white p-4 rounded-xl shadow-sm border border-navy/5">
                          <strong className="text-navy block mb-1">Policy Triggered</strong>
                          {summary.approvalReason}
                        </p>
                        
                        <div className="pt-4 mt-4 border-t border-navy/10 relative">
                          <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-4">Approval Path Preview</div>
                          
                          <div className="space-y-0 relative">
                            <div className="absolute left-[9px] top-4 bottom-4 w-[2px] bg-navy/10" />
                            <div className="flex items-start gap-4 py-2 relative z-10">
                              <div className="w-5 h-5 rounded-full bg-lime text-lime-950 flex items-center justify-center shrink-0 mt-0.5 shadow-sm"><Check className="w-3 h-3" /></div>
                              <div>
                                <div className="text-xs font-bold text-navy">Sales Rep</div>
                                <div className="text-[10px] font-medium text-navy/50">Current Step</div>
                              </div>
                            </div>
                            <div className="flex items-start gap-4 py-2 relative z-10">
                              <div className="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-[0_0_10px_rgba(249,115,22,0.4)]"><Activity className="w-3 h-3" /></div>
                              <div>
                                <div className="text-xs font-bold text-navy">Sales Manager</div>
                                <div className="text-[10px] font-medium text-navy/50">Next Approver</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {approvalError && (
                          <div className="p-3 bg-coral/10 text-coral text-xs font-bold rounded-xl border border-coral/20">
                            {approvalError}
                          </div>
                        )}

                        <button 
                          onClick={handleRequestApproval}
                          disabled={isRequestingApproval} 
                          className="w-full py-4 rounded-xl bg-orange-500 hover:bg-orange-600 transition-colors text-white font-bold text-sm shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 mt-2 disabled:opacity-75 disabled:cursor-not-allowed"
                        >
                          {isRequestingApproval ? (
                            <>
                              <Activity className="w-4 h-4 animate-spin" /> Requesting Approval...
                            </>
                          ) : (
                            <>
                              Request Approval <ArrowRight className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </motion.div>
                    )
                  ) : (
                    <motion.div key="ready" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                      <div className="flex items-center gap-2 text-lime-700 bg-lime/20 p-3 rounded-lg border border-lime/30">
                        <Check className="w-5 h-5 shrink-0" />
                        <span className="text-xs font-bold uppercase tracking-widest">Ready for Review</span>
                      </div>
                      <p className="text-xs font-medium text-navy/60 leading-relaxed p-2">
                        This quotation is within your authority matrix and does not require managerial approval.
                      </p>
                      <button onClick={handleContinue} className="w-full py-4 rounded-xl bg-cobalt hover:bg-cobalt/90 transition-colors text-white font-bold text-sm shadow-lg shadow-cobalt/20 flex items-center justify-center gap-2 mt-2">
                        Continue to Negotiation <ArrowRight className="w-4 h-4" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

          </div>
        </div>

        {/* MOBILE STICKY CTA */}
        <div className="lg:hidden fixed bottom-[80px] left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-navy/5 z-40 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between mb-3 px-2">
            <div>
              <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest">TOTAL</div>
              <div className="text-lg font-bold text-navy">{formatCurrency(summary.grandTotalOneTime)}</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest">Margin</div>
              <div className={cn("text-sm font-bold", summary.marginHealth === 'LOW' ? "text-coral" : "text-lime-700")}>{summary.marginPercentage.toFixed(1)}%</div>
            </div>
          </div>

          {approvalState === 'APPROVED' ? (
            <button 
              onClick={() => router.push('/negotiation/QT-2048')}
              className="w-full py-4 rounded-xl bg-cobalt text-white font-bold shadow-lg flex items-center justify-center gap-2"
            >
              QT-2048 Approved • Continue <ArrowRight className="w-5 h-5" />
            </button>
          ) : approvalState === 'PENDING_APPROVAL' ? (
            <button 
              onClick={() => router.push('/approvals/QT-2048')}
              className="w-full py-4 rounded-xl bg-orange-500 text-white font-bold shadow-lg flex items-center justify-center gap-2"
            >
              Approval Requested ✓ (Pending Review) <ArrowRight className="w-5 h-5" />
            </button>
          ) : summary.requiresApproval ? (
            <button 
              onClick={handleRequestApproval}
              disabled={isRequestingApproval}
              className="w-full py-4 rounded-xl bg-orange-500 text-white font-bold shadow-lg flex items-center justify-center gap-2 disabled:opacity-75"
            >
              {isRequestingApproval ? (
                <>
                  <Activity className="w-5 h-5 animate-spin" /> Requesting Approval...
                </>
              ) : (
                <>
                  Request Approval <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          ) : (
            <button 
              onClick={handleContinue}
              className="w-full py-4 rounded-xl bg-cobalt text-white font-bold shadow-lg flex items-center justify-center gap-2"
            >
              Review Quote <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>

      </div>
    </WorkspaceLayout>
  );
}

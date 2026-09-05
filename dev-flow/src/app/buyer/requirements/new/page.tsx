"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { WorkspaceLayout } from "@/components/layout/WorkspaceLayout";
import { UserRole } from "@/types/auth";
import { RequirementRequest, RequirementDealType, RequirementItem, PriorityType } from "@/types/requirement";
import { ArrowRight, Search, PlusCircle, Check, X, ShieldCheck, Settings, MapPin, Map, Package, Activity, Trash2, Edit2 } from "lucide-react";
import * as motion from "framer-motion/client";
import { AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// --- Subcomponents ---

const OptionCard = ({ title, description, selected, onClick, recommended }: any) => (
  <button 
    onClick={onClick}
    className={cn(
      "w-full text-left p-5 rounded-2xl border-2 transition-all duration-300 relative group flex flex-col gap-2",
      selected ? "border-cobalt bg-cobalt/5 shadow-md" : "border-navy/10 bg-white hover:border-navy/20 hover:bg-navy/5"
    )}
  >
    {recommended && <div className="absolute -top-3 right-4 bg-lime text-lime-950 text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-full shadow-sm">Recommended</div>}
    <div className="flex items-center justify-between w-full">
      <div className={cn("font-bold text-lg transition-colors", selected ? "text-cobalt" : "text-navy")}>{title}</div>
      <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors", selected ? "border-cobalt bg-cobalt" : "border-navy/20")}>
        {selected && <Check className="w-3 h-3 text-white" />}
      </div>
    </div>
    {description && <div className="text-sm font-medium text-navy/60 leading-relaxed">{description}</div>}
  </button>
);

const Chip = ({ label, selected, onClick }: any) => (
  <button
    onClick={onClick}
    className={cn(
      "px-4 py-2.5 rounded-full text-sm font-bold border-2 transition-colors duration-200 whitespace-nowrap",
      selected ? "bg-navy text-white border-navy" : "bg-white text-navy/60 border-navy/10 hover:border-navy/30"
    )}
  >
    {label}
  </button>
);

export default function NewRequirementPage() {
  const router = useRouter();
  const [req, setReq] = useState<RequirementRequest>({
    dealType: RequirementDealType.SMART,
    items: [],
    hasBudget: false,
    allowSplitFulfilment: 'AUTO',
    deliveryMode: 'DELIVERY',
    requiredByMode: '14_DAYS',
    priority: PriorityType.BEST_VALUE,
    anonymousBiddingEnabled: false,
    minimumTrustLevel: 'ANY',
    requestedQuoteCount: 5
  });

  const [isAddingItem, setIsAddingItem] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Temp item state
  const [tempItem, setTempItem] = useState<RequirementItem>({
    id: "",
    productName: "",
    quantity: 1,
    unit: "units",
    brandFlexible: true
  });

  const handleAddItem = () => {
    if (!tempItem.productName || tempItem.quantity <= 0) return;
    setReq(prev => ({
      ...prev,
      items: [...prev.items, { ...tempItem, id: Math.random().toString(36).substr(2, 9) }]
    }));
    setTempItem({ id: "", productName: "", quantity: 1, unit: "units", brandFlexible: true });
    setIsAddingItem(false);
  };

  const handleRemoveItem = (id: string) => {
    setReq(prev => ({ ...prev, items: prev.items.filter(i => i.id !== id) }));
  };

  const handleSubmit = () => {
    if (req.items.length === 0) {
      alert("Please add at least one item.");
      return;
    }
    // Simulate backend save
    const fakeId = "DF-RFQ-" + Math.floor(1000 + Math.random() * 9000);
    router.push(`/buyer/requirements/${fakeId}`);
  };

  const totalItems = req.items.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <WorkspaceLayout role={UserRole.BUYER}>
      
      {/* HEADER & MOTION LINE */}
      <div className="mb-8 md:mb-12">
        <div className="flex items-center gap-2 text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-4">
          <span>Deals</span> <span className="text-navy/20">/</span> <span className="text-navy">New Requirement</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-navy tracking-tight mb-2">What do you need?</h1>
            <p className="text-navy/60 font-medium text-lg max-w-2xl">
              Tell DEV FLOW what you're looking for. We'll help find the strongest sourcing options — not just the cheapest one.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <button className="px-5 py-2.5 rounded-xl font-bold text-navy/60 hover:text-navy hover:bg-navy/5 transition-colors">Cancel</button>
            <button className="px-5 py-2.5 rounded-xl font-bold text-navy bg-white border border-navy/10 shadow-sm hover:bg-navy/5 transition-colors">Save Draft</button>
          </div>
        </div>

        {/* SIGNATURE MOTION LINE */}
        <div className="w-full bg-white p-4 rounded-2xl border border-navy/5 shadow-sm overflow-x-auto no-scrollbar">
          <div className="flex items-center min-w-[600px] justify-between relative px-4">
            <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-[2px] bg-navy/5 -z-10" />
            {[
              { id: 'REQUEST', label: 'REQUEST', active: true },
              { id: 'DISCOVER', label: 'DISCOVER' },
              { id: 'COMPARE', label: 'COMPARE' },
              { id: 'APPROVE', label: 'APPROVE' },
              { id: 'NEGOTIATE', label: 'NEGOTIATE' },
              { id: 'PROTECT', label: 'PROTECT' },
              { id: 'FULFIL', label: 'FULFIL' },
            ].map((stage, i) => (
              <div key={stage.id} className="flex flex-col items-center gap-2 bg-white px-2">
                <div className={cn("w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all", stage.active ? "border-cobalt bg-white shadow-[0_0_10px_rgba(83,103,255,0.4)]" : "border-navy/10 bg-white")}>
                  {stage.active && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-1.5 h-1.5 bg-cobalt rounded-full" />}
                </div>
                <span className={cn("text-[9px] font-bold uppercase tracking-widest", stage.active ? "text-cobalt" : "text-navy/30")}>{stage.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* LEFT COLUMN - FORM */}
        <div className="w-full lg:w-[65%] space-y-10 pb-24 lg:pb-0">
          
          {/* DEAL TYPE */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-navy">1. What kind of deal is this?</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              <OptionCard 
                title="Professional" 
                description="Structured sourcing with quotations, approvals and negotiation."
                selected={req.dealType === RequirementDealType.PROFESSIONAL}
                onClick={() => setReq({...req, dealType: RequirementDealType.PROFESSIONAL})}
              />
              <OptionCard 
                title="Local" 
                description="Find trusted nearby sellers for immediate pickup or delivery."
                selected={req.dealType === RequirementDealType.LOCAL}
                onClick={() => setReq({...req, dealType: RequirementDealType.LOCAL})}
              />
              <OptionCard 
                title="Smart Sourcing" 
                description="Search both professional and local networks simultaneously."
                selected={req.dealType === RequirementDealType.SMART}
                onClick={() => setReq({...req, dealType: RequirementDealType.SMART})}
                recommended
              />
            </div>
          </section>

          {/* ITEMS */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-navy">2. What are you looking for?</h2>
            
            <div className="space-y-3">
              <AnimatePresence>
                {req.items.map((item, idx) => (
                  <motion.div key={item.id} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-white p-5 rounded-2xl border border-navy/10 shadow-sm flex items-start justify-between group">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="w-6 h-6 rounded-md bg-navy/5 text-navy/40 flex items-center justify-center text-xs font-bold">{idx + 1}</span>
                        <h3 className="text-lg font-bold text-navy">{item.productName}</h3>
                      </div>
                      <div className="flex items-center gap-4 text-sm font-medium text-navy/60 ml-9">
                        <span>Qty: <strong className="text-navy">{item.quantity} {item.unit}</strong></span>
                        {item.targetUnitPrice && <span>Target: <strong className="text-navy">₹{item.targetUnitPrice}/{item.unit}</strong></span>}
                      </div>
                      {item.description && <div className="text-sm font-medium text-navy/50 ml-9 mt-2 p-3 bg-navy/5 rounded-xl">{item.description}</div>}
                    </div>
                    <button onClick={() => handleRemoveItem(item.id)} className="w-8 h-8 rounded-full flex items-center justify-center text-coral opacity-0 group-hover:opacity-100 transition-opacity hover:bg-coral/10">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {!isAddingItem ? (
              <button 
                onClick={() => setIsAddingItem(true)}
                className="w-full py-6 border-2 border-dashed border-navy/20 rounded-2xl text-navy/50 font-bold hover:bg-navy/5 hover:border-navy/30 hover:text-navy transition-colors flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-5 h-5" /> {req.items.length === 0 ? "Add First Item" : "Add Another Item"}
              </button>
            ) : (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 md:p-8 rounded-3xl border border-navy/10 shadow-xl shadow-navy/5">
                <div className="flex items-center justify-between mb-6 border-b border-navy/5 pb-4">
                  <h3 className="text-lg font-bold text-navy">Item Details</h3>
                  <button onClick={() => setIsAddingItem(false)} className="text-navy/40 hover:text-navy"><X className="w-5 h-5" /></button>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-navy/60 uppercase tracking-widest mb-2">Product / Service Name</label>
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navy/30" />
                      <input 
                        type="text" 
                        placeholder="e.g. Business Laptop" 
                        className="w-full h-12 pl-12 pr-4 rounded-xl bg-warm/50 border border-navy/10 focus:outline-none focus:border-cobalt focus:ring-2 focus:ring-cobalt/20 transition-all font-medium"
                        value={tempItem.productName}
                        onChange={e => setTempItem({...tempItem, productName: e.target.value})}
                        autoFocus
                      />
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {["Electronics", "Office Supplies", "Furniture", "Software"].map(cat => (
                        <button key={cat} onClick={() => setTempItem({...tempItem, productName: cat})} className="text-[10px] font-bold text-navy/50 bg-navy/5 px-3 py-1.5 rounded-full hover:bg-navy/10 transition-colors">{cat}</button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-navy/60 uppercase tracking-widest mb-2">Quantity</label>
                      <input type="number" min="1" className="w-full h-12 px-4 rounded-xl bg-warm/50 border border-navy/10 focus:outline-none focus:border-cobalt font-medium" value={tempItem.quantity} onChange={e => setTempItem({...tempItem, quantity: parseInt(e.target.value) || 1})} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-navy/60 uppercase tracking-widest mb-2">Unit</label>
                      <select className="w-full h-12 px-4 rounded-xl bg-warm/50 border border-navy/10 focus:outline-none focus:border-cobalt font-medium" value={tempItem.unit} onChange={e => setTempItem({...tempItem, unit: e.target.value})}>
                        <option value="units">units</option>
                        <option value="boxes">boxes</option>
                        <option value="licenses">licenses</option>
                        <option value="months">months</option>
                        <option value="hours">hours</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-navy/60 uppercase tracking-widest mb-2">Smart Specification</label>
                    <textarea 
                      placeholder="Describe what you need (e.g. i7, 16GB RAM, 512GB SSD)..." 
                      className="w-full h-24 p-4 rounded-xl bg-warm/50 border border-navy/10 focus:outline-none focus:border-cobalt font-medium resize-none"
                      value={tempItem.description || ""}
                      onChange={e => setTempItem({...tempItem, description: e.target.value})}
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-navy/5">
                    <button onClick={() => setIsAddingItem(false)} className="px-6 py-3 rounded-xl font-bold text-navy/60 hover:bg-navy/5 transition-colors">Cancel</button>
                    <button onClick={handleAddItem} disabled={!tempItem.productName} className="px-8 py-3 rounded-xl font-bold text-white bg-cobalt hover:bg-cobalt/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-cobalt/20">Add Item</button>
                  </div>
                </div>
              </motion.div>
            )}
          </section>

          {/* SOURCING LOGIC */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-navy">3. Fulfilment & Sourcing</h2>
            <div className="bg-white p-6 rounded-3xl border border-navy/10 shadow-sm space-y-8">
              
              <div>
                <label className="block text-sm font-bold text-navy mb-4">Can this requirement be fulfilled by multiple vendors?</label>
                <div className="grid sm:grid-cols-3 gap-3">
                  <OptionCard title="Yes" description="Allow Split Fulfilment" selected={req.allowSplitFulfilment === 'YES'} onClick={() => setReq({...req, allowSplitFulfilment: 'YES'})} />
                  <OptionCard title="No" description="Single Vendor Preferred" selected={req.allowSplitFulfilment === 'NO'} onClick={() => setReq({...req, allowSplitFulfilment: 'NO'})} />
                  <OptionCard title="Auto" description="Let DEV FLOW Decide" selected={req.allowSplitFulfilment === 'AUTO'} onClick={() => setReq({...req, allowSplitFulfilment: 'AUTO'})} recommended />
                </div>
                {req.allowSplitFulfilment === 'AUTO' && (
                  <div className="mt-4 flex items-start gap-3 p-4 bg-lime/10 rounded-xl border border-lime/20 text-lime-900 text-sm font-medium">
                    <Activity className="w-5 h-5 text-lime-700 shrink-0 mt-0.5" />
                    <p>If one trusted vendor cannot fulfil the full quantity, DEV FLOW will intelligently combine availability from multiple vendors to meet your requirement.</p>
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-navy/5">
                <label className="block text-sm font-bold text-navy mb-4">What matters most for this deal?</label>
                <div className="flex flex-wrap gap-3">
                  {[
                    { val: PriorityType.BEST_VALUE, label: "Best Overall Value" },
                    { val: PriorityType.LOWEST_PRICE, label: "Lowest Price" },
                    { val: PriorityType.HIGHEST_TRUST, label: "Highest Trust" },
                    { val: PriorityType.FASTEST_DELIVERY, label: "Fastest Delivery" }
                  ].map(p => (
                    <Chip key={p.val} label={p.label} selected={req.priority === p.val} onClick={() => setReq({...req, priority: p.val})} />
                  ))}
                </div>
                {req.priority === PriorityType.BEST_VALUE && (
                  <p className="mt-4 text-xs font-medium text-navy/50 bg-navy/5 p-3 rounded-lg inline-block">
                    DEV FLOW balances price, trust, experience, quality, availability and delivery.
                  </p>
                )}
              </div>

            </div>
          </section>

          {/* DELIVERY & TIMING */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-navy">4. Logistics</h2>
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-navy/10 shadow-sm space-y-8">
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-bold text-navy mb-4">Where should this be fulfilled?</label>
                  <div className="space-y-3">
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navy/30" />
                      <input type="text" placeholder="City" className="w-full h-12 pl-12 pr-4 rounded-xl bg-warm/50 border border-navy/10 focus:outline-none focus:border-cobalt font-medium" value={req.city || ""} onChange={e => setReq({...req, city: e.target.value})} />
                    </div>
                    <div className="flex gap-3">
                      <input type="text" placeholder="State" className="flex-1 h-12 px-4 rounded-xl bg-warm/50 border border-navy/10 focus:outline-none focus:border-cobalt font-medium" value={req.state || ""} onChange={e => setReq({...req, state: e.target.value})} />
                      <input type="text" placeholder="PIN Code" className="flex-1 h-12 px-4 rounded-xl bg-warm/50 border border-navy/10 focus:outline-none focus:border-cobalt font-medium" value={req.pinCode || ""} onChange={e => setReq({...req, pinCode: e.target.value})} />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-navy mb-4">When do you need it?</label>
                  <div className="flex flex-col gap-2">
                    {[
                      { val: 'URGENT', label: "Urgent (ASAP)" },
                      { val: '3_DAYS', label: "Within 3 Days" },
                      { val: '7_DAYS', label: "Within 7 Days" },
                      { val: '14_DAYS', label: "Within 14 Days" },
                    ].map(t => (
                      <button 
                        key={t.val} 
                        onClick={() => setReq({...req, requiredByMode: t.val as any})}
                        className={cn("text-left px-4 py-3 rounded-xl text-sm font-bold transition-all border", req.requiredByMode === t.val ? "border-cobalt bg-cobalt/5 text-cobalt" : "border-navy/10 bg-warm/30 text-navy hover:bg-warm/80")}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* ADVANCED SETTINGS */}
          <section className="space-y-4">
            <button 
              onClick={() => setShowAdvanced(!showAdvanced)} 
              className="flex items-center gap-2 text-sm font-bold text-navy/60 hover:text-navy transition-colors bg-white px-6 py-4 rounded-2xl border border-navy/10 w-full"
            >
              <Settings className="w-5 h-5" /> Professional Procurement Settings
            </button>
            <AnimatePresence>
              {showAdvanced && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                  <div className="bg-white p-6 md:p-8 rounded-3xl border border-navy/10 shadow-sm mt-4 space-y-6">
                    <div className="flex items-center justify-between p-4 bg-navy/5 rounded-2xl">
                      <div>
                        <div className="font-bold text-navy">Anonymous Vendor Bidding</div>
                        <div className="text-xs font-medium text-navy/60 mt-1 max-w-sm">Hide vendor identity during initial quotation comparison to ensure unbiased selection based on metrics.</div>
                      </div>
                      <button 
                        onClick={() => setReq({...req, anonymousBiddingEnabled: !req.anonymousBiddingEnabled})}
                        className={cn("w-14 h-8 rounded-full transition-colors relative", req.anonymousBiddingEnabled ? "bg-cobalt" : "bg-navy/20")}
                      >
                        <div className={cn("w-6 h-6 rounded-full bg-white absolute top-1 transition-all", req.anonymousBiddingEnabled ? "left-7" : "left-1")} />
                      </button>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-navy mb-4">Minimum Vendor Trust Level</label>
                      <div className="flex gap-3">
                        <Chip label="Any Verified" selected={req.minimumTrustLevel === 'ANY'} onClick={() => setReq({...req, minimumTrustLevel: 'ANY'})} />
                        <Chip label="Silver or Above" selected={req.minimumTrustLevel === 'SILVER'} onClick={() => setReq({...req, minimumTrustLevel: 'SILVER'})} />
                        <Chip label="Gold Preferred" selected={req.minimumTrustLevel === 'GOLD'} onClick={() => setReq({...req, minimumTrustLevel: 'GOLD'})} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </div>

        {/* RIGHT COLUMN - SUMMARY */}
        <div className="hidden lg:block w-[35%]">
          <div className="sticky top-28 bg-navy rounded-3xl p-8 shadow-2xl shadow-navy/20 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cobalt/20 rounded-full blur-3xl pointer-events-none" />
            
            <h2 className="text-xs font-bold uppercase tracking-widest text-white/50 mb-8">Your Requirement</h2>
            
            <div className="space-y-6 relative z-10">
              <div>
                <div className="text-[10px] font-bold text-cobalt uppercase tracking-widest mb-1">{req.dealType} PROCUREMENT</div>
                <div className="text-2xl font-bold">
                  {req.items.length === 0 ? "Empty Requirement" : 
                   req.items.length === 1 ? req.items[0].productName : 
                   `${req.items.length} Items Selected`}
                </div>
              </div>

              <div className="space-y-4 py-6 border-y border-white/10">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60 font-medium">Total Quantity</span>
                  <span className="font-bold">{totalItems || "-"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60 font-medium">Location</span>
                  <span className="font-bold text-right">{req.city ? `${req.city}${req.state ? `, ${req.state}` : ''}` : "Not set"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60 font-medium">Timeline</span>
                  <span className="font-bold">{req.requiredByMode.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60 font-medium">Sourcing</span>
                  <span className="font-bold text-right">DEV FLOW Smart Match</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60 font-medium">Split Fulfilment</span>
                  <span className="font-bold text-right">{req.allowSplitFulfilment === 'YES' ? "Allowed" : req.allowSplitFulfilment === 'AUTO' ? "Auto" : "No"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60 font-medium">Priority</span>
                  <span className="font-bold text-right text-lime">{req.priority.replace('_', ' ')}</span>
                </div>
              </div>

              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <div className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">Estimated Preview</div>
                <div className="text-sm font-bold">24 matching vendors available</div>
              </div>

              <button 
                onClick={handleSubmit}
                disabled={req.items.length === 0}
                className="w-full py-4 rounded-xl bg-cobalt hover:bg-cobalt/90 transition-colors text-white font-bold text-base shadow-lg shadow-cobalt/20 disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
              >
                Create Requirement <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE STICKY CTA */}
        <div className="lg:hidden fixed bottom-[80px] left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-navy/5 z-40 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
          <button 
            onClick={handleSubmit}
            disabled={req.items.length === 0}
            className="w-full py-4 rounded-xl bg-navy text-white font-bold shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
          >
            Review & Create <ArrowRight className="w-5 h-5" />
          </button>
        </div>

      </div>
    </WorkspaceLayout>
  );
}

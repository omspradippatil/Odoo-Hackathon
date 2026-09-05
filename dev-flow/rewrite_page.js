const fs = require('fs');

const content = `"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { WorkspaceLayout } from "@/components/layout/WorkspaceLayout";
import { UserRole } from "@/types/auth";
import { RequirementRequest, RequirementDealType, RequirementItem, PriorityType } from "@/types/requirement";
import { ArrowRight, Search, PlusCircle, Check, X, ShieldCheck, Settings, MapPin, Activity, Trash2, Edit2, AlertCircle } from "lucide-react";
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

const INITIAL_REQ: RequirementRequest = {
  dealType: RequirementDealType.SMART,
  items: [],
  hasBudget: false,
  allowSplitFulfilment: 'AUTO',
  deliveryMode: 'DELIVERY',
  requiredByMode: '14_DAYS',
  priority: PriorityType.BEST_VALUE,
  anonymousBiddingEnabled: false,
  minimumTrustLevel: 'ANY',
  requestedQuoteCount: 5,
  city: ""
};

const INITIAL_TEMP: RequirementItem = {
  id: "",
  productName: "",
  quantity: 1,
  unit: "units",
  brandFlexible: true,
  description: ""
};

export default function NewRequirementPage() {
  const router = useRouter();
  
  // Strictly fresh state on mount
  const [req, setReq] = useState<RequirementRequest>(INITIAL_REQ);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [tempItem, setTempItem] = useState<RequirementItem>(INITIAL_TEMP);
  
  // Validation & Submission State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isCreating, setIsCreating] = useState(false);
  const [isDrafting, setIsDrafting] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  
  // Refs for scrolling to errors
  const itemsRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);

  // Clear state on mount just in case of any Next.js caching
  useEffect(() => {
    setReq(INITIAL_REQ);
    setTempItem(INITIAL_TEMP);
    setErrors({});
  }, []);

  // Determine if form has unsaved changes
  const hasChanges = req.items.length > 0 || req.city !== "" || req.hasBudget;

  const handleAddItem = () => {
    if (!tempItem.productName || tempItem.quantity <= 0) return;
    setReq(prev => ({
      ...prev,
      items: [...prev.items, { ...tempItem, id: Math.random().toString(36).substr(2, 9) }]
    }));
    setTempItem(INITIAL_TEMP);
    setIsAddingItem(false);
    
    // Clear item error if it exists
    if (errors.items) {
      setErrors(prev => {
        const newErrs = { ...prev };
        delete newErrs.items;
        return newErrs;
      });
    }
  };

  const handleRemoveItem = (id: string) => {
    setReq(prev => ({ ...prev, items: prev.items.filter(i => i.id !== id) }));
  };

  const handleSaveDraft = () => {
    if (isDrafting) return;
    
    // Minimal validation for draft: just something needs to exist
    if (req.items.length === 0 && !req.city) {
      setErrors({ general: "Add at least an item or location to save a draft." });
      return;
    }
    
    setErrors({});
    setIsDrafting(true);
    
    // Simulate save draft
    setTimeout(() => {
      setIsDrafting(false);
      setDraftSaved(true);
      setTimeout(() => setDraftSaved(false), 3000);
    }, 800);
  };

  const handleSubmit = () => {
    if (isCreating) return;
    
    // Full Validation
    const newErrors: Record<string, string> = {};
    let firstErrorRef: React.RefObject<HTMLDivElement | null> | null = null;

    if (req.items.length === 0) {
      newErrors.items = "Please add at least one product or service.";
      firstErrorRef = itemsRef;
    }
    
    if (!req.city || req.city.trim() === "") {
      newErrors.location = "Please enter a delivery city.";
      if (!firstErrorRef) firstErrorRef = locationRef;
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      if (firstErrorRef && firstErrorRef.current) {
        firstErrorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Success Path
    setErrors({});
    setIsCreating(true);
    
    setTimeout(() => {
      // Stable Demo ID
      router.push("/buyer/requirements/REQ-1048");
    }, 1500);
  };

  const handleCancelClick = () => {
    if (hasChanges) {
      setShowUnsavedModal(true);
    } else {
      router.push('/buyer');
    }
  };

  const totalItems = req.items.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <WorkspaceLayout role={UserRole.BUYER}>
      
      {/* UNSAVED CHANGES MODAL */}
      <AnimatePresence>
        {showUnsavedModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-navy/80 backdrop-blur-sm" onClick={() => setShowUnsavedModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                <AlertCircle className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-navy mb-2">Unsaved Changes</h3>
              <p className="text-navy/60 font-medium text-sm mb-8">Your requirement has changes that haven't been saved. Are you sure you want to leave?</p>
              <div className="flex gap-3">
                <button onClick={() => setShowUnsavedModal(false)} className="flex-1 py-3 rounded-xl font-bold text-navy bg-navy/5 hover:bg-navy/10 transition-colors">Stay</button>
                <button onClick={() => router.push('/buyer')} className="flex-1 py-3 rounded-xl font-bold text-white bg-coral hover:bg-coral/90 transition-colors shadow-lg shadow-coral/20">Discard</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 relative pb-24 lg:pb-0">
        
        {/* LEFT COLUMN - FORM */}
        <div className="flex-1 max-w-3xl space-y-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-navy/10">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-navy tracking-tight mb-2">Create Requirement</h1>
              <p className="text-navy/60 font-medium text-lg max-w-2xl">
                Tell DEV FLOW what you're looking for. We'll help find the strongest sourcing options — not just the cheapest one.
              </p>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <button onClick={handleCancelClick} className="px-5 py-2.5 rounded-xl font-bold text-navy/60 hover:text-navy hover:bg-navy/5 transition-colors">Cancel</button>
              <button 
                onClick={handleSaveDraft}
                disabled={isDrafting || isCreating}
                className="px-5 py-2.5 rounded-xl font-bold text-navy bg-white border border-navy/10 shadow-sm hover:bg-navy/5 transition-colors disabled:opacity-50 min-w-[120px]"
              >
                {isDrafting ? "Saving..." : draftSaved ? "Draft Saved" : "Save Draft"}
              </button>
            </div>
          </div>

          {errors.general && (
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-2xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
              <div className="text-sm font-bold text-orange-800">{errors.general}</div>
            </div>
          )}

          {/* ITEM EDITOR */}
          <section className="space-y-4" ref={itemsRef}>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-navy">1. What do you need?</h2>
              {req.items.length > 0 && (
                <div className="text-sm font-bold text-cobalt">{req.items.length} item{req.items.length !== 1 ? 's' : ''} added</div>
              )}
            </div>
            
            {errors.items && (
              <div className="p-3 bg-coral/10 text-coral text-sm font-bold rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> {errors.items}
              </div>
            )}

            <div className="space-y-3">
              {req.items.map((item, idx) => (
                <div key={item.id} className="bg-white p-5 rounded-2xl border border-navy/10 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-cobalt/10 text-cobalt flex items-center justify-center font-bold">{idx + 1}</div>
                    <div>
                      <h4 className="font-bold text-navy text-lg">{item.productName}</h4>
                      <div className="text-xs font-bold text-navy/40 uppercase tracking-widest mt-1">
                        {item.quantity} {item.unit} • {item.description ? "Has specs" : "Standard"}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="w-10 h-10 rounded-xl flex items-center justify-center text-navy/40 hover:bg-navy/5 hover:text-navy transition-colors"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleRemoveItem(item.id)} className="w-10 h-10 rounded-xl flex items-center justify-center text-coral/60 hover:bg-coral/10 hover:text-coral transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
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
                        className="w-full h-12 pl-12 pr-4 rounded-xl bg-warm/50 border border-navy/10 focus:outline-none focus:border-cobalt focus:ring-2 focus:ring-cobalt/20 transition-all font-medium text-navy"
                        value={tempItem.productName}
                        onChange={e => setTempItem({...tempItem, productName: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-navy/60 uppercase tracking-widest mb-2">Quantity</label>
                      <input type="number" min="1" className="w-full h-12 px-4 rounded-xl bg-warm/50 border border-navy/10 focus:outline-none focus:border-cobalt font-medium text-navy" value={tempItem.quantity} onChange={e => setTempItem({...tempItem, quantity: parseInt(e.target.value) || 1})} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-navy/60 uppercase tracking-widest mb-2">Unit</label>
                      <select className="w-full h-12 px-4 rounded-xl bg-warm/50 border border-navy/10 focus:outline-none focus:border-cobalt font-medium text-navy" value={tempItem.unit} onChange={e => setTempItem({...tempItem, unit: e.target.value})}>
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
                      className="w-full h-24 p-4 rounded-xl bg-warm/50 border border-navy/10 focus:outline-none focus:border-cobalt font-medium resize-none text-navy"
                      value={tempItem.description || ""}
                      onChange={e => setTempItem({...tempItem, description: e.target.value})}
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-navy/5">
                    <button onClick={() => setIsAddingItem(false)} className="px-6 py-3 rounded-xl font-bold text-navy/60 hover:bg-navy/5 transition-colors">Cancel</button>
                    <button onClick={handleAddItem} disabled={!tempItem.productName || tempItem.quantity <= 0} className="px-8 py-3 rounded-xl font-bold text-white bg-cobalt hover:bg-cobalt/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-cobalt/20">Add Item</button>
                  </div>
                </div>
              </motion.div>
            )}
          </section>

          {/* BUDGET & DELIVERY */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-navy">2. Execution Details</h2>
            <div className="bg-white p-6 rounded-3xl border border-navy/10 shadow-sm space-y-8">
              
              <div className="grid md:grid-cols-2 gap-8">
                <div ref={locationRef}>
                  <label className="block text-sm font-bold text-navy mb-4">Where is this needed?</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navy/40" />
                    <input 
                      type="text" 
                      placeholder="City (e.g. Mumbai)" 
                      value={req.city || ""}
                      onChange={(e) => {
                        setReq({...req, city: e.target.value});
                        if (errors.location) {
                          setErrors(prev => { const n = {...prev}; delete n.location; return n; });
                        }
                      }}
                      className={cn(
                        "w-full h-12 pl-12 pr-4 rounded-xl bg-warm/30 focus:outline-none focus:ring-2 font-medium transition-all text-navy",
                        errors.location ? "border-coral border focus:ring-coral/20" : "border border-navy/10 focus:border-cobalt focus:ring-cobalt/20"
                      )}
                    />
                  </div>
                  {errors.location && <div className="text-coral text-xs font-bold mt-2">{errors.location}</div>}
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
                  <span className="font-bold text-right">{req.city ? req.city : "Not set"}</span>
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

              <button 
                onClick={handleSubmit}
                disabled={isCreating}
                className="w-full py-4 rounded-xl bg-cobalt hover:bg-cobalt/90 transition-colors text-white font-bold text-base shadow-lg shadow-cobalt/20 disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
              >
                {isCreating ? "Creating..." : "Create Requirement"} <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE STICKY CTA */}
        <div className="lg:hidden fixed bottom-[80px] left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-navy/5 z-40 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] flex gap-2">
           <button 
            onClick={handleSaveDraft}
            disabled={isDrafting || isCreating}
            className="flex-1 py-4 rounded-xl bg-white text-navy font-bold shadow-sm border border-navy/10 disabled:opacity-50"
          >
            {isDrafting ? "Saving..." : "Save Draft"}
          </button>
          <button 
            onClick={handleSubmit}
            disabled={isCreating}
            className="flex-1 py-4 rounded-xl bg-navy text-white font-bold shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isCreating ? "Creating..." : "Create"} <ArrowRight className="w-5 h-5" />
          </button>
        </div>

      </div>
    </WorkspaceLayout>
  );
}
`
fs.writeFileSync('src/app/buyer/requirements/new/page.tsx', content);

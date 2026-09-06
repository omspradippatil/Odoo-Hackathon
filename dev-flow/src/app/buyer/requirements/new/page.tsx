"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { WorkspaceLayout } from "@/components/layout/WorkspaceLayout";
import { UserRole } from "@/types/auth";
import { RequirementRequest, RequirementDealType, RequirementItem, PriorityType } from "@/types/requirement";
import { ArrowRight, Search, PlusCircle, Check, X, Settings, MapPin, Trash2, AlertCircle, CheckCircle2 } from "lucide-react";
import * as motion from "framer-motion/client";
import { AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const FRESH_REQ = (): RequirementRequest => ({
  dealType: RequirementDealType.SMART, items: [], hasBudget: false,
  allowSplitFulfilment: "AUTO", deliveryMode: "DELIVERY", requiredByMode: "14_DAYS",
  priority: PriorityType.BEST_VALUE, anonymousBiddingEnabled: false,
  minimumTrustLevel: "ANY", requestedQuoteCount: 5, city: "",
});

const FRESH_ITEM = (): RequirementItem => ({
  id: "", productName: "", quantity: 1, unit: "units", brandFlexible: true, description: "",
});

function generateReqId(req: RequirementRequest): string {
  const name = req.items[0]?.productName ?? "ITEM";
  const abbr = name.split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("");
  return `REQ-${abbr}${Date.now().toString().slice(-4)}`;
}

const TIMELINE_LABELS: Record<string, string> = {
  URGENT: "Urgent (ASAP)", "3_DAYS": "Within 3 Days",
  "7_DAYS": "Within 7 Days", "14_DAYS": "Within 14 Days",
};

const PRIORITY_LABELS: Record<string, string> = {
  BEST_VALUE: "Best Overall Value", LOWEST_PRICE: "Lowest Price",
  HIGHEST_TRUST: "Highest Trust", FASTEST_DELIVERY: "Fastest Delivery",
  PRODUCT_QUALITY: "Product Quality", VENDOR_EXPERIENCE: "Vendor Experience", AVAILABILITY: "Availability",
};

const DRAFT_KEY = "devflow_req_drafts";
function getDrafts(): RequirementRequest[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(sessionStorage.getItem(DRAFT_KEY) ?? "[]"); } catch { return []; }
}
function saveDraftToSession(req: RequirementRequest, id: string) {
  const drafts = getDrafts();
  const updated = req.id ? drafts.map((d) => (d.id === req.id ? { ...req } : d)) : [{ ...req, id, status: "DRAFT" }, ...drafts];
  sessionStorage.setItem(DRAFT_KEY, JSON.stringify(updated));
}

const OptionCard = ({ title, description, selected, onClick, recommended }: {
  title: string; description?: string; selected: boolean; onClick: () => void; recommended?: boolean;
}) => (
  <button type="button" onClick={onClick}
    className={cn("w-full text-left p-5 rounded-2xl border-2 transition-all duration-200 relative flex flex-col gap-2",
      selected ? "border-cobalt bg-cobalt/5 shadow-md" : "border-navy/10 bg-white hover:border-navy/20 hover:bg-navy/5")}>
    {recommended && <div className="absolute -top-3 right-4 bg-lime text-lime-950 text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-full shadow-sm">Recommended</div>}
    <div className="flex items-center justify-between w-full">
      <div className={cn("font-bold text-lg transition-colors", selected ? "text-cobalt" : "text-navy")}>{title}</div>
      <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors shrink-0", selected ? "border-cobalt bg-cobalt" : "border-navy/20")}>
        {selected && <Check className="w-3 h-3 text-white" />}
      </div>
    </div>
    {description && <div className="text-sm font-medium text-navy/60 leading-relaxed">{description}</div>}
  </button>
);

const Chip = ({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) => (
  <button type="button" onClick={onClick}
    className={cn("px-4 py-2.5 rounded-full text-sm font-bold border-2 transition-colors duration-200 whitespace-nowrap",
      selected ? "bg-navy text-white border-navy" : "bg-white text-navy/60 border-navy/10 hover:border-navy/30")}>
    {label}
  </button>
);

export default function NewRequirementPage() {
  const router = useRouter();
  const [req, setReq] = useState<RequirementRequest>(FRESH_REQ);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [tempItem, setTempItem] = useState<RequirementItem>(FRESH_ITEM());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isCreating, setIsCreating] = useState(false);
  const [isDrafting, setIsDrafting] = useState(false);
  const [draftSavedId, setDraftSavedId] = useState<string | null>(null);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const itemsRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);

  // Hard-reset on every mount — clean slate guaranteed on each navigation
  useEffect(() => {
    setReq(FRESH_REQ());
    setTempItem(FRESH_ITEM());
    setErrors({});
    setIsAddingItem(false);
    setShowAdvanced(false);
    setIsCreating(false);
    setIsDrafting(false);
    setDraftSavedId(null);
    setSubmitError(null);
    setShowUnsavedModal(false);
  }, []);

  const hasChanges = req.items.length > 0 || (req.city ?? "").trim() !== "";
  const totalQuantity = req.items.reduce((acc, i) => acc + i.quantity, 0);

  const handleAddItem = useCallback(() => {
    const name = tempItem.productName.trim();
    if (!name || tempItem.quantity <= 0) return;
    setReq((prev) => ({
      ...prev,
      items: [...prev.items, { ...tempItem, productName: name, id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 7)}` }],
    }));
    setTempItem(FRESH_ITEM());
    setIsAddingItem(false);
    setErrors((prev) => { const n = { ...prev }; delete n.items; return n; });
  }, [tempItem]);

  const handleRemoveItem = useCallback((id: string) => {
    setReq((prev) => ({ ...prev, items: prev.items.filter((i) => i.id !== id) }));
  }, []);

  const handleSaveDraft = useCallback(() => {
    if (isDrafting) return;
    setErrors({});
    setIsDrafting(true);
    setTimeout(() => {
      const draftId = req.id ?? `DRAFT-${Date.now().toString().slice(-5)}`;
      saveDraftToSession(req, draftId);
      setReq((prev) => ({ ...prev, id: draftId }));
      setIsDrafting(false);
      setDraftSavedId(draftId);
      setTimeout(() => setDraftSavedId(null), 3000);
    }, 500);
  }, [isDrafting, req]);

  const handleSubmit = useCallback(() => {
    if (isCreating) return;
    const newErrors: Record<string, string> = {};
    let firstRef: React.RefObject<HTMLDivElement | null> | null = null;
    if (req.items.length === 0) { newErrors.items = "Add at least one product or service."; firstRef = itemsRef; }
    if (!(req.city ?? "").trim()) { newErrors.location = "Enter a delivery city."; if (!firstRef) firstRef = locationRef; }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      firstRef?.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setErrors({});
    setSubmitError(null);
    setIsCreating(true);
    import("@/lib/demoState").then((m) => m.demoState.setAnonymousBidding(req.anonymousBiddingEnabled));
    const reqId = req.id?.startsWith("REQ-") ? req.id : generateReqId(req);
    setTimeout(() => {
      try {
        sessionStorage.setItem(`devflow_req_${reqId}`, JSON.stringify({ ...req, id: reqId, status: "SOURCING" }));
        const drafts = getDrafts().filter((d) => d.id !== req.id);
        sessionStorage.setItem(DRAFT_KEY, JSON.stringify(drafts));
        router.push(`/buyer/requirements/${reqId}`);
      } catch {
        setIsCreating(false);
        setSubmitError("We could not create this requirement. Your information has been kept. Try again.");
      }
    }, 1400);
  }, [isCreating, req, router]);

  const handleCancelClick = useCallback(() => {
    if (hasChanges) setShowUnsavedModal(true);
    else router.push("/buyer");
  }, [hasChanges, router]);

  return (
    <WorkspaceLayout role={UserRole.BUYER} requireAuth>
      <AnimatePresence>
        {showUnsavedModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-navy/80 backdrop-blur-sm" onClick={() => setShowUnsavedModal(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                <AlertCircle className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-navy mb-2">Unsaved Changes</h3>
              <p className="text-navy/60 font-medium text-sm mb-8">Your requirement has changes that have not been saved. Leave anyway?</p>
              <div className="flex gap-3">
                <button onClick={() => setShowUnsavedModal(false)} className="flex-1 py-3 rounded-xl font-bold text-navy bg-navy/5 hover:bg-navy/10 transition-colors">Stay</button>
                <button onClick={() => router.push("/buyer")} className="flex-1 py-3 rounded-xl font-bold text-white bg-coral hover:bg-coral/90 transition-colors shadow-lg shadow-coral/20">Discard</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 relative pb-28 lg:pb-0">
        <div className="flex-1 max-w-3xl space-y-12">

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-navy/10">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-navy tracking-tight mb-2">Create Requirement</h1>
              <p className="text-navy/60 font-medium text-lg max-w-2xl">Tell DEV FLOW what you are looking for. We will help find the strongest sourcing options.</p>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <button type="button" onClick={handleCancelClick} className="px-5 py-2.5 rounded-xl font-bold text-navy/60 hover:text-navy hover:bg-navy/5 transition-colors">Cancel</button>
              <button type="button" onClick={handleSaveDraft} disabled={isDrafting || isCreating}
                className="px-5 py-2.5 rounded-xl font-bold text-navy bg-white border border-navy/10 shadow-sm hover:bg-navy/5 transition-colors disabled:opacity-50 min-w-[130px] flex items-center justify-center gap-2">
                {isDrafting ? "Saving..." : draftSavedId ? (<><CheckCircle2 className="w-4 h-4 text-lime" />Draft Saved</>) : "Save Draft"}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {errors.general && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="p-4 bg-orange-50 border border-orange-200 rounded-2xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                <div className="text-sm font-bold text-orange-800">{errors.general}</div>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {submitError && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="p-4 bg-coral/10 border border-coral/30 rounded-2xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-coral shrink-0 mt-0.5" />
                <div className="flex-1 text-sm font-bold text-coral">{submitError}</div>
                <button type="button" onClick={() => setSubmitError(null)} className="text-coral/60 hover:text-coral"><X className="w-4 h-4" /></button>
              </motion.div>
            )}
          </AnimatePresence>

          <section className="space-y-4" ref={itemsRef}>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-navy">1. What do you need?</h2>
              {req.items.length > 0 && <div className="text-sm font-bold text-cobalt">{req.items.length} item{req.items.length !== 1 ? "s" : ""} added</div>}
            </div>
            <AnimatePresence>
              {errors.items && (
                <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="p-3 bg-coral/10 text-coral text-sm font-bold rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />{errors.items}
                </motion.div>
              )}
            </AnimatePresence>
            <div className="space-y-3">
              <AnimatePresence>
                {req.items.map((item, idx) => (
                  <motion.div key={item.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    className="bg-white p-5 rounded-2xl border border-navy/10 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-cobalt/10 text-cobalt flex items-center justify-center font-bold shrink-0">{idx + 1}</div>
                      <div>
                        <h4 className="font-bold text-navy text-base leading-snug">{item.productName}</h4>
                        <div className="text-xs font-bold text-navy/40 uppercase tracking-widest mt-1">{item.quantity} {item.unit}{item.description ? " - Has specs" : " - Standard"}</div>
                      </div>
                    </div>
                    <button type="button" onClick={() => handleRemoveItem(item.id)}
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-coral/60 hover:bg-coral/10 hover:text-coral transition-colors shrink-0">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            {!isAddingItem ? (
              <button type="button" onClick={() => { setTempItem(FRESH_ITEM()); setIsAddingItem(true); }}
                className="w-full py-6 border-2 border-dashed border-navy/20 rounded-2xl text-navy/50 font-bold hover:bg-navy/5 hover:border-navy/30 hover:text-navy transition-colors flex items-center justify-center gap-2">
                <PlusCircle className="w-5 h-5" />{req.items.length === 0 ? "Add First Item" : "Add Another Item"}
              </button>
            ) : (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 md:p-8 rounded-3xl border border-navy/10 shadow-xl shadow-navy/5">
                <div className="flex items-center justify-between mb-6 border-b border-navy/5 pb-4">
                  <h3 className="text-lg font-bold text-navy">Item Details</h3>
                  <button type="button" onClick={() => setIsAddingItem(false)} className="text-navy/40 hover:text-navy"><X className="w-5 h-5" /></button>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-navy/60 uppercase tracking-widest mb-2">Product / Service Name *</label>
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navy/30" />
                      <input type="text" placeholder="e.g. Business Laptop" autoFocus
                        className="w-full h-12 pl-12 pr-4 rounded-xl bg-warm/50 border border-navy/10 focus:outline-none focus:border-cobalt focus:ring-2 focus:ring-cobalt/20 transition-all font-medium text-navy"
                        value={tempItem.productName}
                        onChange={(e) => setTempItem((p) => ({ ...p, productName: e.target.value }))}
                        onKeyDown={(e) => { if (e.key === "Enter") handleAddItem(); }}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-navy/60 uppercase tracking-widest mb-2">Quantity *</label>
                      <input type="number" min="1" className="w-full h-12 px-4 rounded-xl bg-warm/50 border border-navy/10 focus:outline-none focus:border-cobalt font-medium text-navy"
                        value={tempItem.quantity} onChange={(e) => setTempItem((p) => ({ ...p, quantity: Math.max(1, parseInt(e.target.value) || 1) }))} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-navy/60 uppercase tracking-widest mb-2">Unit</label>
                      <select className="w-full h-12 px-4 rounded-xl bg-warm/50 border border-navy/10 focus:outline-none focus:border-cobalt font-medium text-navy"
                        value={tempItem.unit} onChange={(e) => setTempItem((p) => ({ ...p, unit: e.target.value }))}>
                        <option value="units">units</option>
                        <option value="boxes">boxes</option>
                        <option value="licenses">licenses</option>
                        <option value="months">months</option>
                        <option value="hours">hours</option>
                        <option value="kg">kg</option>
                        <option value="sets">sets</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-navy/60 uppercase tracking-widest mb-2">Specification (optional)</label>
                    <textarea placeholder="e.g. i7 13th Gen, 16GB RAM, 512GB SSD..."
                      className="w-full h-24 p-4 rounded-xl bg-warm/50 border border-navy/10 focus:outline-none focus:border-cobalt font-medium resize-none text-navy"
                      value={tempItem.description ?? ""} onChange={(e) => setTempItem((p) => ({ ...p, description: e.target.value }))} />
                  </div>
                  <div className="flex justify-end gap-3 pt-4 border-t border-navy/5">
                    <button type="button" onClick={() => setIsAddingItem(false)} className="px-6 py-3 rounded-xl font-bold text-navy/60 hover:bg-navy/5 transition-colors">Cancel</button>
                    <button type="button" onClick={handleAddItem} disabled={!tempItem.productName.trim() || tempItem.quantity <= 0}
                      className="px-8 py-3 rounded-xl font-bold text-white bg-cobalt hover:bg-cobalt/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-cobalt/20">
                      Add Item
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-navy">2. Execution Details</h2>
            <div className="bg-white p-6 rounded-3xl border border-navy/10 shadow-sm space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div ref={locationRef}>
                  <label className="block text-sm font-bold text-navy mb-4">Where is this needed? *</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navy/40" />
                    <input type="text" placeholder="City (e.g. Mumbai)" value={req.city ?? ""}
                      onChange={(e) => { setReq((p) => ({ ...p, city: e.target.value })); if (errors.location) setErrors((p) => { const n = { ...p }; delete n.location; return n; }); }}
                      className={cn("w-full h-12 pl-12 pr-4 rounded-xl bg-warm/30 focus:outline-none focus:ring-2 font-medium transition-all text-navy",
                        errors.location ? "border-coral border focus:ring-coral/20" : "border border-navy/10 focus:border-cobalt focus:ring-cobalt/20")} />
                  </div>
                  {errors.location && <p className="text-coral text-xs font-bold mt-2 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.location}</p>}
                </div>
                <div>
                  <label className="block text-sm font-bold text-navy mb-4">When do you need it?</label>
                  <div className="flex flex-col gap-2">
                    {([
                      { val: "URGENT", label: "Urgent (ASAP)" }, { val: "3_DAYS", label: "Within 3 Days" },
                      { val: "7_DAYS", label: "Within 7 Days" }, { val: "14_DAYS", label: "Within 14 Days" },
                    ] as { val: RequirementRequest["requiredByMode"]; label: string }[]).map((t) => (
                      <button key={t.val} type="button" onClick={() => setReq((p) => ({ ...p, requiredByMode: t.val }))}
                        className={cn("text-left px-4 py-3 rounded-xl text-sm font-bold transition-all border",
                          req.requiredByMode === t.val ? "border-cobalt bg-cobalt/5 text-cobalt" : "border-navy/10 bg-warm/30 text-navy hover:bg-warm/80")}>
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-navy">3. Fulfilment &amp; Sourcing</h2>
            <div className="bg-white p-6 rounded-3xl border border-navy/10 shadow-sm space-y-8">
              <div>
                <label className="block text-sm font-bold text-navy mb-4">Can this be fulfilled by multiple vendors?</label>
                <div className="grid sm:grid-cols-3 gap-3">
                  <OptionCard title="Yes" description="Allow Split Fulfilment" selected={req.allowSplitFulfilment === "YES"} onClick={() => setReq((p) => ({ ...p, allowSplitFulfilment: "YES" }))} />
                  <OptionCard title="No" description="Single Vendor Preferred" selected={req.allowSplitFulfilment === "NO"} onClick={() => setReq((p) => ({ ...p, allowSplitFulfilment: "NO" }))} />
                  <OptionCard title="Auto" description="Let DEV FLOW Decide" selected={req.allowSplitFulfilment === "AUTO"} onClick={() => setReq((p) => ({ ...p, allowSplitFulfilment: "AUTO" }))} recommended />
                </div>
              </div>
              <div className="pt-6 border-t border-navy/5">
                <label className="block text-sm font-bold text-navy mb-4">What matters most for this deal?</label>
                <div className="flex flex-wrap gap-3">
                  {([
                    { val: PriorityType.BEST_VALUE, label: "Best Overall Value" }, { val: PriorityType.LOWEST_PRICE, label: "Lowest Price" },
                    { val: PriorityType.HIGHEST_TRUST, label: "Highest Trust" }, { val: PriorityType.FASTEST_DELIVERY, label: "Fastest Delivery" },
                    { val: PriorityType.PRODUCT_QUALITY, label: "Product Quality" }, { val: PriorityType.VENDOR_EXPERIENCE, label: "Vendor Experience" },
                    { val: PriorityType.AVAILABILITY, label: "Availability" },
                  ] as { val: PriorityType; label: string }[]).map((p) => (
                    <Chip key={p.val} label={p.label} selected={req.priority === p.val} onClick={() => setReq((prev) => ({ ...prev, priority: p.val }))} />
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <button type="button" onClick={() => setShowAdvanced((v) => !v)}
              className="flex items-center gap-2 text-sm font-bold text-navy/60 hover:text-navy transition-colors bg-white px-6 py-4 rounded-2xl border border-navy/10 w-full">
              <Settings className="w-5 h-5" />Professional Procurement Settings
            </button>
            <AnimatePresence>
              {showAdvanced && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                  <div className="bg-white p-6 md:p-8 rounded-3xl border border-navy/10 shadow-sm mt-4 space-y-6">
                    <div className="flex items-center justify-between p-4 bg-navy/5 rounded-2xl">
                      <div>
                        <div className="font-bold text-navy">Anonymous Vendor Bidding</div>
                        <div className="text-xs font-medium text-navy/60 mt-1 max-w-sm">Hide vendor identity during initial quotation comparison to ensure unbiased selection.</div>
                      </div>
                      <button type="button" onClick={() => setReq((p) => ({ ...p, anonymousBiddingEnabled: !p.anonymousBiddingEnabled }))}
                        className={cn("w-14 h-8 rounded-full transition-colors relative shrink-0", req.anonymousBiddingEnabled ? "bg-cobalt" : "bg-navy/20")}>
                        <div className={cn("w-6 h-6 rounded-full bg-white absolute top-1 transition-all shadow", req.anonymousBiddingEnabled ? "left-7" : "left-1")} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

        </div>

        <div className="hidden lg:block w-[340px] shrink-0">
          <div className="sticky top-28 bg-navy rounded-3xl p-8 shadow-2xl shadow-navy/20 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cobalt/20 rounded-full blur-3xl pointer-events-none" />
            <h2 className="text-xs font-bold uppercase tracking-widest text-white/50 mb-8">Your Requirement</h2>
            <div className="space-y-6 relative z-10">
              <div>
                <div className="text-[10px] font-bold text-cobalt uppercase tracking-widest mb-1">{req.dealType} PROCUREMENT</div>
                <div className="text-2xl font-bold leading-snug">
                  {req.items.length === 0 ? "Empty Requirement" : req.items.length === 1 ? req.items[0].productName : `${req.items.length} Items`}
                </div>
              </div>
              <div className="space-y-3 py-6 border-y border-white/10">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60 font-medium">Total Quantity</span>
                  <span className="font-bold">{totalQuantity > 0 ? totalQuantity : "-"}</span>
                </div>
                {req.items.length > 1 && (
                  <div className="text-xs text-white/50 font-medium leading-relaxed">{req.items.map((i) => `${i.quantity}x ${i.productName}`).join(" / ")}</div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-white/60 font-medium">Location</span>
                  <span className="font-bold text-right">{(req.city ?? "").trim() || "Not set"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60 font-medium">Timeline</span>
                  <span className="font-bold">{TIMELINE_LABELS[req.requiredByMode] ?? req.requiredByMode}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60 font-medium">Split Fulfilment</span>
                  <span className="font-bold text-right">{req.allowSplitFulfilment === "YES" ? "Allowed" : req.allowSplitFulfilment === "AUTO" ? "Auto" : "No"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60 font-medium">Priority</span>
                  <span className="font-bold text-right text-lime">{PRIORITY_LABELS[req.priority] ?? req.priority}</span>
                </div>
                {req.anonymousBiddingEnabled && (
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60 font-medium">Bidding</span>
                    <span className="font-bold text-right text-cobalt">Anonymous</span>
                  </div>
                )}
              </div>
              <button type="button" onClick={handleSubmit} disabled={isCreating}
                className="w-full py-4 rounded-xl bg-cobalt hover:bg-cobalt/90 transition-colors text-white font-bold text-base shadow-lg shadow-cobalt/20 disabled:opacity-60 flex items-center justify-center gap-2 mt-4">
                {isCreating ? (<><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Creating...</>) : <>Create Requirement <ArrowRight className="w-5 h-5" /></>}
              </button>
              {draftSavedId && <p className="text-center text-xs font-bold text-lime/80">Draft saved ({draftSavedId})</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="lg:hidden fixed bottom-[72px] left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-navy/5 z-40 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] flex gap-2">
        <button type="button" onClick={handleSaveDraft} disabled={isDrafting || isCreating}
          className="flex-1 py-4 rounded-xl bg-white text-navy font-bold shadow-sm border border-navy/10 disabled:opacity-50 flex items-center justify-center gap-1.5 text-sm">
          {isDrafting ? "Saving..." : draftSavedId ? (<><CheckCircle2 className="w-4 h-4 text-lime" />Saved</>) : "Save Draft"}
        </button>
        <button type="button" onClick={handleSubmit} disabled={isCreating}
          className="flex-1 py-4 rounded-xl bg-navy text-white font-bold shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 text-sm">
          {isCreating ? (<><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Creating...</>) : (<>Create <ArrowRight className="w-4 h-4" /></>)}
        </button>
      </div>

    </WorkspaceLayout>
  );
}

"use client";

import React, { useState, use } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Activity, Check, X, FileText, ArrowRight, MessageSquare, Plus, CheckCircle2, Clock } from "lucide-react";
import * as motion from "framer-motion/client";
import { AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const formatCurrency = (val: number) => `₹${val.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

export default function CustomerPortalPage({ params }: { params: Promise<{ quotationId: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();

  const [status, setStatus] = useState<'AWAITING' | 'UNDER_REVIEW' | 'ACCEPTED'>('AWAITING');
  const [modalType, setModalType] = useState<'ACCEPT' | 'COUNTER' | null>(null);
  const [counterPercent, setCounterPercent] = useState<number>(15);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStatus(modalType === 'ACCEPT' ? 'ACCEPTED' : 'UNDER_REVIEW');
      setModalType(null);
    }, 1000);
  };

  if (status === 'ACCEPTED') {
    return (
      <div className="min-h-screen bg-warm/20 flex flex-col items-center justify-center text-center px-4">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-24 h-24 rounded-full bg-lime/20 flex items-center justify-center mb-8 shadow-xl shadow-lime/10">
          <CheckCircle2 className="w-12 h-12 text-lime-700" />
        </motion.div>
        <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-2">Deal Confirmed</div>
        <h1 className="text-3xl lg:text-4xl font-bold text-navy tracking-tight mb-2 uppercase">QUOTATION ACCEPTED</h1>
        <p className="text-navy/60 font-medium text-lg max-w-md mx-auto mb-10">Complete the transaction through DEV FLOW to continue to fulfilment.</p>
        <button onClick={() => router.push(`/customer/deals/${resolvedParams.quotationId}/payment`)} className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-cobalt text-white font-bold hover:bg-cobalt/90 transition-all shadow-lg shadow-cobalt/20 active:scale-95">
          Continue to Payment <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm/20 font-sans text-navy flex flex-col">
      {/* CUSTOMER HEADER */}
      <header className="bg-navy text-white px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2 font-bold text-lg tracking-tight">
          <div className="w-6 h-6 rounded-full bg-lime" /> DEV FLOW
        </div>
        <div className="flex items-center gap-4 text-sm font-medium">
          <span className="hidden md:inline text-white/60">Nova Retail Portal</span>
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold">NR</div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-8 lg:py-12">
        
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
            <div>
              <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-2 flex items-center gap-2">
                <span>Quotation {resolvedParams.quotationId}</span> <span className="text-navy/20">•</span> <span>From ABC Solutions</span>
              </div>
              <h1 className="text-3xl font-bold text-navy tracking-tight">Nova Retail Expansion</h1>
            </div>
            <div className={cn("px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2 border", 
              status === 'AWAITING' ? "bg-white text-navy border-navy/10 shadow-sm" : "bg-orange-50 text-orange-700 border-orange-200"
            )}>
              {status === 'AWAITING' ? <Activity className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
              {status === 'AWAITING' ? 'AWAITING YOUR RESPONSE' : 'COMMERCIAL REVIEW IN PROGRESS'}
            </div>
          </div>
        </div>

        {status === 'UNDER_REVIEW' && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 bg-orange-100 border border-orange-200 p-6 rounded-2xl flex items-start gap-4 shadow-sm">
            <Activity className="w-6 h-6 text-orange-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-orange-900 mb-1">Counter-Offer Submitted</h3>
              <p className="text-xs font-medium text-orange-800/80">You requested a 15% discount. The ABC Solutions team is currently reviewing your request. You will be notified when an updated quotation is available.</p>
            </div>
          </motion.div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          
          <div className="flex-1 space-y-6">
            {/* ITEMS */}
            <div className="bg-white rounded-3xl border border-navy/5 shadow-sm overflow-hidden">
              <div className="bg-navy/5 px-6 py-4 border-b border-navy/5"><h2 className="text-xs font-bold text-navy uppercase tracking-widest">Included Items</h2></div>
              <div className="p-0">
                <div className="p-6 border-b border-navy/5 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-navy">Business Laptops</h3>
                    <div className="text-xs font-medium text-navy/60 mt-1">High-performance workstations</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-navy">50 Units</div>
                    <div className="text-xs font-bold text-navy/40 uppercase tracking-widest mt-1">@ ₹1,02,000 / unit</div>
                  </div>
                </div>
                <div className="p-6 border-b border-navy/5 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-navy">Extended Warranty (3 Years)</h3>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-navy">50 Units</div>
                    <div className="text-xs font-bold text-navy/40 uppercase tracking-widest mt-1">@ ₹4,500 / unit</div>
                  </div>
                </div>
                <div className="p-6 flex items-center justify-between bg-cobalt/5">
                  <div>
                    <h3 className="font-bold text-navy">Microsoft 365 Business Standard</h3>
                    <div className="text-[10px] font-bold text-cobalt uppercase tracking-widest mt-1 bg-cobalt/10 inline-block px-2 py-0.5 rounded">Recurring Monthly</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-navy">50 Users</div>
                    <div className="text-xs font-bold text-navy/40 uppercase tracking-widest mt-1">@ ₹1,100 / user / mo</div>
                  </div>
                </div>
              </div>
            </div>

            {/* TERMS */}
            <div className="bg-white rounded-3xl border border-navy/5 shadow-sm p-6">
              <h2 className="text-xs font-bold text-navy uppercase tracking-widest mb-4">Commercial Terms</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-1">Validity</div>
                  <div className="text-sm font-bold text-navy">18 Sep 2026 (15 Days)</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-1">Payment Terms</div>
                  <div className="text-sm font-bold text-navy">30% advance / 70% on delivery</div>
                </div>
                <div className="sm:col-span-2">
                  <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-1">Seller Notes</div>
                  <div className="text-sm font-medium text-navy/80 bg-warm/50 p-4 rounded-xl border border-navy/5">Delivery expected within 7 business days after confirmation.</div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-[35%] space-y-6">
            
            {/* FINANCIAL SUMMARY */}
            <div className="bg-white rounded-3xl border border-navy/5 shadow-xl shadow-navy/5 overflow-hidden">
              <div className="p-6 bg-navy text-white">
                <h2 className="text-xs font-bold uppercase tracking-widest text-white/50 mb-6">Financial Summary</h2>
                
                <div className="space-y-4 mb-6 text-sm">
                  <div className="flex justify-between font-medium"><span className="text-white/70">Subtotal</span><span>₹53,25,000</span></div>
                  <div className="flex justify-between font-bold text-lime"><span className="flex items-center gap-1">Discount (12%)</span><span>− ₹6,39,000</span></div>
                  <div className="flex justify-between font-medium border-t border-white/10 pt-4"><span className="text-white/70">Net Value</span><span>₹46,86,000</span></div>
                  <div className="flex justify-between font-medium"><span className="text-white/70">GST (18%)</span><span>₹8,43,480</span></div>
                </div>

                <div className="pt-6 border-t border-white/20">
                  <div className="flex justify-between items-end">
                    <div className="text-[10px] font-bold text-white/50 uppercase tracking-widest">ONE-TIME PAYABLE</div>
                    <div className="text-3xl font-bold">₹55,29,480</div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-white/10 bg-white/5 -mx-6 px-6 pb-2">
                  <div className="flex items-center gap-2 mb-2"><span className="w-1.5 h-1.5 rounded-full bg-cobalt" /><span className="text-[10px] font-bold text-cobalt uppercase tracking-widest">RECURRING SUBSCRIPTION</span></div>
                  <div className="flex justify-between items-end">
                    <div className="text-sm font-medium text-white/70">Software</div>
                    <div className="text-xl font-bold text-white text-right">₹55,000 <span className="text-[10px] text-white/50 uppercase tracking-widest">/ month</span></div>
                  </div>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="p-6 bg-white space-y-3">
                {status === 'AWAITING' ? (
                  <>
                    <button onClick={() => setModalType('ACCEPT')} className="w-full py-4 rounded-xl bg-cobalt text-white text-sm font-bold shadow-lg shadow-cobalt/20 hover:bg-cobalt/90 transition-colors flex justify-center items-center gap-2">Accept Quotation <Check className="w-4 h-4" /></button>
                    <button onClick={() => setModalType('COUNTER')} className="w-full py-3 rounded-xl bg-navy/5 text-navy text-sm font-bold hover:bg-navy/10 transition-colors">Request Change / Counter Offer</button>
                    <button className="w-full py-3 text-navy/60 hover:text-navy text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors"><MessageSquare className="w-3 h-3" /> Ask a Question</button>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <div className="text-sm font-bold text-navy mb-1">Commercial Review in Progress</div>
                    <div className="text-xs font-medium text-navy/60">Quotation actions are temporarily disabled while the seller reviews your request.</div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* CUSTOMER MODALS */}
      <AnimatePresence>
        {modalType && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-navy/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col">
              
              <div className="p-6 flex items-center justify-between border-b border-navy/5">
                <h2 className="text-lg font-bold text-navy uppercase tracking-widest">{modalType === 'ACCEPT' ? 'Accept Quotation' : 'Send Counter Offer'}</h2>
                <button onClick={() => !isSubmitting && setModalType(null)} className="text-navy/40 hover:text-navy"><X className="w-5 h-5" /></button>
              </div>
              
              <div className="p-6 md:p-8 space-y-6 flex-1">
                {modalType === 'ACCEPT' ? (
                  <div>
                    <p className="text-navy font-medium mb-6">You are confirming acceptance of the commercial terms. You will proceed to payment and fulfilment.</p>
                    <div className="bg-navy/5 p-4 rounded-xl text-sm font-medium text-navy/70 space-y-2">
                      <div className="flex justify-between"><span className="text-navy/50 uppercase text-[10px] font-bold tracking-widest">One-Time</span><span className="font-bold text-navy">₹55,29,480</span></div>
                      <div className="flex justify-between"><span className="text-navy/50 uppercase text-[10px] font-bold tracking-widest">Recurring</span><span className="font-bold text-navy">₹55,000 / mo</span></div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-navy/60 uppercase tracking-widest mb-2">Request Type</label>
                    <select className="w-full h-12 px-4 mb-6 rounded-xl bg-warm/50 border border-navy/10 focus:outline-none focus:border-cobalt text-sm font-bold text-navy">
                      <option>Request Discount</option>
                      <option>Change Quantity</option>
                      <option>Change Delivery Terms</option>
                      <option>Other Commercial Change</option>
                    </select>

                    <label className="block text-xs font-bold text-navy/60 uppercase tracking-widest mb-2">Requested Discount %</label>
                    <input type="number" value={counterPercent} onChange={e => setCounterPercent(Number(e.target.value))} className="w-full h-12 px-4 mb-6 rounded-xl bg-warm/50 border border-navy/10 focus:outline-none focus:border-cobalt text-sm font-bold text-navy" />

                    <label className="block text-xs font-bold text-navy/60 uppercase tracking-widest mb-2">Message (Optional)</label>
                    <textarea placeholder="e.g. If the total price can be reduced slightly, we can confirm the order this week." value={comment} onChange={e => setComment(e.target.value)} className="w-full p-4 rounded-xl bg-warm/50 border border-navy/10 focus:outline-none focus:border-cobalt text-sm resize-none" rows={3} />
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-navy/5 flex gap-3">
                <button disabled={isSubmitting} onClick={() => setModalType(null)} className="flex-1 py-3.5 rounded-xl font-bold text-navy/60 hover:bg-navy/5 transition-colors">Cancel</button>
                <button disabled={isSubmitting} onClick={handleSubmit} className={cn("flex-[2] py-3.5 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center", modalType === 'ACCEPT' ? "bg-cobalt hover:bg-cobalt/90 shadow-cobalt/20" : "bg-navy hover:bg-navy/90 shadow-navy/20")}>
                  {isSubmitting ? <Activity className="w-5 h-5 animate-spin" /> : modalType === 'ACCEPT' ? 'Confirm Acceptance' : 'Send Request'}
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

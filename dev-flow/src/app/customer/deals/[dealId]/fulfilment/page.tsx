"use client";

import React, { useState, use } from "react";
import { useRouter } from "next/navigation";
import { Package, Truck, Check, MapPin, AlertCircle, CheckCircle2, MessageSquare, ArrowRight, X, Image as ImageIcon, Activity } from "lucide-react";
import * as motion from "framer-motion/client";
import { AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ShipmentStatus } from "@/types/fulfilment";

export default function CustomerFulfilmentPage({ params }: { params: Promise<{ dealId: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();

  const [shipment1Status, setShipment1Status] = useState<ShipmentStatus>('DELIVERED');
  const [modalType, setModalType] = useState<'CONFIRM' | 'ISSUE' | null>(null);
  const [issueType, setIssueType] = useState('Quantity Mismatch');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAction = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      if (modalType === 'CONFIRM') {
        setShipment1Status('DELIVERY_CONFIRMED');
      }
      setModalType(null);
    }, 1000);
  };

  const isConfirmed = shipment1Status === 'DELIVERY_CONFIRMED';
  const allCompleted = isConfirmed; // Assuming demo progresses to complete when S1 is confirmed for UX preview (in reality S2 also needs to be delivered)

  return (
    <div className="min-h-screen bg-warm/20 font-sans text-navy flex flex-col">
      
      {/* CUSTOMER HEADER */}
      <header className="bg-navy text-white px-6 py-4 flex flex-col md:flex-row md:items-center justify-between shadow-md gap-4">
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center gap-2 font-bold text-lg tracking-tight">
            <div className="w-6 h-6 rounded-full bg-lime" /> DEV FLOW
          </div>
          <div className="md:hidden text-xs font-bold text-white/60 uppercase tracking-widest">{resolvedParams.dealId}</div>
        </div>
        <div className="hidden md:flex items-center gap-4 text-sm font-medium">
          <span className="text-white/60">Nova Retail Portal</span>
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold">NR</div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-8 lg:py-12">
        
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-2 flex items-center gap-2">
                <span>Deal {resolvedParams.dealId}</span> <span className="text-navy/20">•</span> <span>Order Progress</span>
              </div>
              <h1 className="text-3xl font-bold text-navy tracking-tight mb-2">Track your delivery</h1>
              <div className="text-sm font-medium text-navy/60">Your order will arrive in <strong className="text-navy">2 shipments</strong>.</div>
            </div>
            <div className={cn("px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2 border shadow-sm bg-white text-navy border-navy/10")}>
              <Package className="w-4 h-4" />
              {isConfirmed ? '30 / 50 DELIVERED' : '30 / 50 SHIPPED'}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          
          {/* SHIPMENT 1 */}
          <div className="bg-white rounded-3xl border border-navy/5 shadow-sm overflow-hidden">
            <div className="bg-navy/5 px-6 py-4 border-b border-navy/5 flex items-center justify-between">
              <div>
                <h2 className="text-xs font-bold text-navy uppercase tracking-widest">Shipment 1</h2>
                <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mt-1">30 Business Laptops</div>
              </div>
              <div className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5",
                isConfirmed ? "bg-lime/20 text-lime-800" : "bg-orange-100 text-orange-700"
              )}>
                {isConfirmed ? <Check className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                {isConfirmed ? 'Delivery Confirmed' : 'Delivered'}
              </div>
            </div>
            
            <div className="p-6 md:p-8">
              
              <div className="flex flex-col md:flex-row gap-8 items-start mb-8">
                <div className="flex-1">
                  <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-1">Status</div>
                  <div className="text-xl font-bold text-navy">{isConfirmed ? 'Completed' : 'Awaiting Confirmation'}</div>
                </div>
                <div className="hidden md:block w-[1px] h-12 bg-navy/10" />
                <div className="flex-1">
                  <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-1">Carrier & Tracking</div>
                  <div className="text-sm font-bold text-navy">BlueDart • BD-483920</div>
                </div>
                <div className="hidden md:block w-[1px] h-12 bg-navy/10" />
                <div className="flex-1">
                  <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-1">{isConfirmed ? 'Confirmed On' : 'Arrived On'}</div>
                  <div className="text-sm font-bold text-navy">08 Sep 2026, 2:41 PM</div>
                </div>
              </div>

              {/* TIMELINE */}
              <div className="bg-navy/5 p-6 rounded-2xl border border-navy/10 mb-6">
                <div className="flex justify-between items-center relative">
                  <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-1 bg-navy/10 -z-10" />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 h-1 bg-lime z-0" style={{ width: isConfirmed ? '100%' : '75%' }} />
                  
                  {[
                    { label: 'Allocated', done: true },
                    { label: 'Packed', done: true },
                    { label: 'Shipped', done: true },
                    { label: 'Delivered', done: true },
                    { label: 'Confirmed', done: isConfirmed }
                  ].map((s, i) => (
                    <div key={i} className="flex flex-col items-center gap-2 z-10">
                      <div className={cn("w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors", s.done ? "bg-lime border-lime" : "bg-white border-navy/20")}>
                        {s.done && <Check className="w-3 h-3 text-lime-950" />}
                      </div>
                      <div className="hidden sm:block text-[9px] font-bold uppercase tracking-widest text-navy/60">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {!isConfirmed && (
                <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-navy/5">
                  <button onClick={() => setModalType('CONFIRM')} className="flex-[2] py-4 rounded-xl bg-navy text-white text-sm font-bold shadow-lg shadow-navy/20 hover:bg-navy/90 transition-colors flex justify-center items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Confirm Delivery
                  </button>
                  <button onClick={() => setModalType('ISSUE')} className="flex-1 py-4 rounded-xl bg-coral/10 text-coral text-sm font-bold hover:bg-coral/20 transition-colors flex justify-center items-center gap-2">
                    <AlertCircle className="w-4 h-4" /> Report Issue
                  </button>
                </div>
              )}

              {isConfirmed && (
                <div className="pt-4 border-t border-navy/5 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-lime-700 bg-lime/20 px-3 py-1.5 rounded-lg text-xs font-bold border border-lime/30">
                    <CheckCircle2 className="w-4 h-4" /> Delivery Verified
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* SHIPMENT 2 */}
          <div className="bg-white rounded-3xl border border-navy/5 shadow-sm overflow-hidden opacity-80">
            <div className="bg-navy/5 px-6 py-4 border-b border-navy/5 flex items-center justify-between">
              <div>
                <h2 className="text-xs font-bold text-navy uppercase tracking-widest">Shipment 2</h2>
                <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mt-1">20 Business Laptops</div>
              </div>
              <div className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 bg-cobalt/10 text-cobalt">
                <Package className="w-3 h-3" /> Preparing
              </div>
            </div>
            <div className="p-6 md:p-8 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-1">Expected Completion</div>
                <div className="text-sm font-bold text-navy">09 Sep 2026</div>
              </div>
              <div className="text-xs font-medium text-navy/60">
                This shipment is currently being packed at the warehouse.
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* MODALS */}
      <AnimatePresence>
        {modalType && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-navy/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col">
              
              <div className={cn("p-6 flex items-center justify-between border-b", modalType === 'CONFIRM' ? "bg-navy text-white" : "bg-white border-navy/5")}>
                <h2 className={cn("text-lg font-bold uppercase tracking-widest", modalType === 'ISSUE' ? "text-navy" : "")}>
                  {modalType === 'CONFIRM' ? 'Confirm Delivery' : 'Report Issue'}
                </h2>
                <button onClick={() => !isSubmitting && setModalType(null)} className={cn("hover:opacity-70 transition-opacity", modalType === 'CONFIRM' ? "text-white" : "text-navy")}><X className="w-5 h-5" /></button>
              </div>
              
              <div className="p-6 md:p-8 space-y-6 flex-1">
                {modalType === 'CONFIRM' ? (
                  <div>
                    <p className="text-navy font-medium mb-6">You are confirming that you have received all items in this shipment in satisfactory condition.</p>
                    <div className="bg-navy/5 p-4 rounded-xl text-sm font-medium text-navy/70 space-y-2">
                      <div className="flex justify-between"><span className="text-navy/50 uppercase text-[10px] font-bold tracking-widest">Shipment</span><span className="font-bold text-navy">#SHP-301</span></div>
                      <div className="flex justify-between"><span className="text-navy/50 uppercase text-[10px] font-bold tracking-widest">Items Received</span><span className="font-bold text-navy">30 Business Laptops</span></div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-navy/60 uppercase tracking-widest mb-2">Issue Type</label>
                    <select value={issueType} onChange={e => setIssueType(e.target.value)} className="w-full h-12 px-4 mb-6 rounded-xl bg-warm/50 border border-navy/10 focus:outline-none focus:border-cobalt text-sm font-bold text-navy">
                      <option>Quantity Mismatch</option>
                      <option>Damaged Product</option>
                      <option>Wrong Product</option>
                      <option>Missing Item</option>
                      <option>Other</option>
                    </select>

                    <label className="block text-xs font-bold text-navy/60 uppercase tracking-widest mb-2">Description</label>
                    <textarea placeholder="Please describe the issue..." value={comment} onChange={e => setComment(e.target.value)} className="w-full p-4 mb-4 rounded-xl bg-warm/50 border border-navy/10 focus:outline-none focus:border-cobalt text-sm resize-none" rows={3} />

                    <button className="w-full py-3 border border-dashed border-navy/20 rounded-xl text-xs font-bold text-navy/60 flex items-center justify-center gap-2 hover:bg-navy/5 transition-colors">
                      <ImageIcon className="w-4 h-4" /> Upload Evidence (Optional)
                    </button>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-navy/5 flex gap-3">
                <button disabled={isSubmitting} onClick={() => setModalType(null)} className="flex-1 py-3.5 rounded-xl font-bold text-navy/60 hover:bg-navy/5 transition-colors">Cancel</button>
                <button disabled={isSubmitting} onClick={handleAction} className={cn("flex-[2] py-3.5 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center", modalType === 'CONFIRM' ? "bg-navy hover:bg-navy/90 shadow-navy/20" : "bg-coral hover:bg-coral/90 shadow-coral/20")}>
                  {isSubmitting ? <Activity className="w-5 h-5 animate-spin" /> : modalType === 'CONFIRM' ? 'Everything Received' : 'Submit Issue'}
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

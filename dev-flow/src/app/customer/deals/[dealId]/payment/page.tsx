"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Activity, Check, ArrowRight, Lock, CreditCard, Building2, Smartphone, FileText, CheckCircle2 } from "lucide-react";
import * as motion from "framer-motion/client";
import { AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { PaymentStatus } from "@/types/payment";

const formatCurrency = (val: number) => `₹${val.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

export default function ProtectedTransactionPage({ params }: { params: Promise<{ dealId: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();

  const [status, setStatus] = useState<PaymentStatus>('PAYMENT_PENDING');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'UPI' | 'CARD' | 'NET_BANKING' | 'TRANSFER'>('UPI');
  const [showDemoCheckout, setShowDemoCheckout] = useState(false);
  const [localOrder, setLocalOrder] = useState<any>(null);

  useEffect(() => {
    if (resolvedParams.dealId.startsWith("ORD-")) {
      import("@/lib/demoState").then(m => {
        const orders = m.demoState.getLocalOrders();
        const order = orders.find((o: any) => o.id === resolvedParams.dealId);
        if (order) setLocalOrder(order);
      });
    }
  }, [resolvedParams.dealId]);

  const handlePayment = () => {
    setIsProcessing(true);
    // Simulate backend call to create Razorpay order
    setTimeout(() => {
      setIsProcessing(false);
      setShowDemoCheckout(true);
    }, 800);
  };

  const simulateSuccess = () => {
    setShowDemoCheckout(false);
    setIsProcessing(true);
    setStatus('PAYMENT_RECEIVED');
    setTimeout(() => {
      setIsProcessing(false);
      setStatus('PAYMENT_PROTECTED');
    }, 1500);
  };

  const simulateFailure = () => {
    setShowDemoCheckout(false);
    setStatus('PAYMENT_FAILED');
  };

  const isProtected = status === 'PAYMENT_PROTECTED';

  return (
    <div className="min-h-screen bg-warm/20 font-sans text-navy flex flex-col pb-24 md:pb-0">
      
      {/* CUSTOMER HEADER */}
      <header className="bg-navy text-white px-6 py-4 flex flex-col md:flex-row md:items-center justify-between shadow-md gap-4">
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center gap-2 font-bold text-lg tracking-tight">
            <div className="w-6 h-6 rounded-full bg-lime" /> DEV FLOW
          </div>
          <div className="md:hidden text-xs font-bold text-white/60 uppercase tracking-widest">{resolvedParams.dealId}</div>
        </div>
        
        {/* DESKTOP JOURNEY LINE */}
        <div className="hidden md:flex items-center gap-2 flex-1 max-w-xl mx-auto px-8 relative">
          <div className="absolute left-10 right-10 top-1/2 -translate-y-1/2 h-[2px] bg-white/10 -z-10" />
          
          <motion.div 
            className="absolute left-[30%] top-1/2 -translate-y-1/2 h-[2px] bg-lime"
            initial={{ width: 0 }} animate={{ width: isProtected ? "20%" : "0%" }} transition={{ duration: 1 }}
          />

          {[
            { id: 'QUOTE', label: 'QUOTE', state: 'done' },
            { id: 'APPROVE', label: 'APPROVE', state: 'done' },
            { id: 'NEGOTIATE', label: 'NEGOTIATE', state: 'done' },
            { id: 'PROTECT', label: 'PROTECT', state: isProtected ? 'done' : 'active' },
            { id: 'FULFIL', label: 'FULFIL', state: isProtected ? 'next' : 'idle' },
            { id: 'BILL', label: 'BILL', state: 'idle' },
          ].map((stage, i) => (
            <div key={stage.id} className="flex flex-col items-center gap-1 z-10 bg-navy px-2 mx-auto">
              <div className={cn("w-3 h-3 rounded-full border-2 flex items-center justify-center transition-all", 
                stage.state === 'done' ? "border-lime bg-lime" :
                stage.state === 'active' ? "border-white bg-white shadow-[0_0_10px_rgba(255,255,255,0.4)]" : "border-white/20 bg-navy")}>
              </div>
              <span className={cn("text-[8px] font-bold uppercase tracking-widest", 
                stage.state === 'active' ? "text-white" : stage.state === 'done' ? "text-lime" : "text-white/30")}>
                {stage.label}
              </span>
            </div>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4 text-sm font-medium">
          <span className="text-white/60">Nova Retail Portal</span>
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold">NR</div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-8 lg:py-12">
        
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-2 flex items-center gap-2">
                <span>Deal {resolvedParams.dealId}</span> <span className="text-navy/20">•</span> <span>Quotation QT-2048</span>
              </div>
              <h1 className="text-3xl font-bold text-navy tracking-tight mb-2">Complete your transaction</h1>
              <div className="text-sm font-medium text-navy/60">Seller: <strong className="text-navy">Vertex Systems & NexaByte</strong></div>
            </div>
            <div className={cn("px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2 border shadow-sm", 
              isProtected ? "bg-lime/20 text-lime-800 border-lime/30" : "bg-white text-navy border-navy/10"
            )}>
              {isProtected ? <ShieldCheck className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              {isProtected ? 'PAYMENT PROTECTED' : 'PAYMENT PENDING'}
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start relative">
          
          <div className="w-full lg:w-[60%] space-y-8">
            
            {/* TRANSACTION SUMMARY */}
            <div className="bg-white rounded-3xl border border-navy/5 shadow-sm p-6 md:p-8">
              <h2 className="text-xs font-bold text-navy uppercase tracking-widest mb-6">Transaction Summary</h2>
              <div className="flex flex-col sm:flex-row justify-between gap-6 mb-6 pb-6 border-b border-navy/5">
                <div>
                  <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-1">One-Time Amount</div>
                  <div className="text-2xl font-bold text-navy">{localOrder ? formatCurrency(localOrder.total) : '₹8,40,000'}</div>
                </div>
                {!localOrder && (
                  <div>
                    <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-1">Recurring Subscription</div>
                    <div className="text-lg font-bold text-navy/60">₹55,000 / month</div>
                    <div className="text-[9px] font-bold text-navy/40 uppercase tracking-widest mt-1">Starts after activation</div>
                  </div>
                )}
              </div>
              
              <div className="bg-navy/5 p-6 rounded-2xl border border-navy/10">
                <h3 className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-4">Payment Plan</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-navy/5 relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-cobalt" />
                    <div>
                      <div className="text-xs font-bold text-navy mb-1">{localOrder ? 'Full Payment' : 'Milestone 1: 30% Advance'}</div>
                      <div className="text-[10px] font-bold text-cobalt uppercase tracking-widest">Due Now</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-navy">{localOrder ? formatCurrency(localOrder.total) : '₹2,52,000'}</div>
                      {isProtected && <div className="text-[10px] font-bold text-lime-700 uppercase tracking-widest mt-1 flex items-center gap-1 justify-end"><Check className="w-3 h-3" /> Paid</div>}
                    </div>
                  </div>
                  
                  {!localOrder && (
                    <div className="flex items-center justify-between p-4 bg-warm/50 rounded-xl border border-navy/5 opacity-70">
                      <div>
                        <div className="text-xs font-bold text-navy mb-1">Milestone 2: 70% Balance</div>
                        <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest">Due After Delivery Confirmation</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-navy/60">₹5,88,000</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* PROTECTED TRANSACTION EXPLAINER */}
            <div className="bg-gradient-to-br from-navy to-slate-900 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-48 h-48 bg-lime/20 rounded-full blur-3xl pointer-events-none" />
              <h2 className="text-xs font-bold uppercase tracking-widest text-lime flex items-center gap-2 mb-6 relative z-10"><ShieldCheck className="w-4 h-4" /> How DEV FLOW Protects The Transaction</h2>
              
              <div className="space-y-6 relative z-10">
                {[
                  { num: '01', title: 'Buyer initiates payment', desc: 'Your payment is securely processed and recorded.' },
                  { num: '02', title: 'Transaction status is protected', desc: 'DEV FLOW locks the transaction workflow.' },
                  { num: '03', title: 'Seller fulfils the order', desc: 'Vendors are notified to begin shipping your items.' },
                  { num: '04', title: 'Buyer confirms delivery', desc: 'You confirm receipt of goods through the portal.' },
                  { num: '05', title: 'Settlement becomes eligible', desc: 'Seller receives settlement based on platform policy.' }
                ].map((step, idx) => (
                  <div key={idx} className="flex gap-4 group">
                    <div className="flex flex-col items-center">
                      <div className="w-6 h-6 rounded-full bg-white/10 text-white/50 flex items-center justify-center text-[10px] font-bold border border-white/20 group-hover:bg-lime/20 group-hover:text-lime group-hover:border-lime/30 transition-colors">{step.num}</div>
                      {idx < 4 && <div className="w-[1px] h-full bg-white/10 mt-1" />}
                    </div>
                    <div className="pb-4">
                      <div className="text-sm font-bold text-white mb-0.5">{step.title}</div>
                      <div className="text-xs font-medium text-white/60">{step.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-white/10 text-[9px] font-medium text-white/40 leading-relaxed relative z-10">
                Your payment status is linked to this specific deal. Settlement follows the transaction and delivery status. DEV FLOW provides transaction coordination and workflow protection.
              </div>
            </div>

          </div>

          <div className="w-full lg:w-[40%]">
            <div className="sticky top-28 space-y-6">
              
              {/* PAYMENT STATUS & ACTIONS */}
              <div className="bg-white rounded-3xl border border-navy/5 shadow-xl shadow-navy/5 overflow-hidden">
                <div className={cn("p-6 text-white relative transition-colors duration-1000", isProtected ? "bg-lime-800" : "bg-navy")}>
                  {isProtected && <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />}
                  
                  <div className="flex justify-between items-start mb-6 relative z-10">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-white/70">Payment Status</h2>
                    {isProtected && <ShieldCheck className="w-6 h-6 text-lime-400" />}
                  </div>
                  
                  <div className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1 relative z-10">Due Today</div>
                  <div className="text-4xl font-bold mb-4 relative z-10">{localOrder ? formatCurrency(localOrder.total) : '₹2,52,000'}</div>
                  
                  <div className="space-y-4 pt-4 border-t border-white/10 relative z-10">
                    <div className="flex justify-between items-center text-sm font-medium">
                      <span className="text-white/70">Current Stage</span>
                      <span className="font-bold text-white text-right">{isProtected ? 'Awaiting seller fulfilment' : 'Awaiting Payment'}</span>
                    </div>
                    {isProtected && (
                      <div className="flex justify-between items-center text-sm font-medium">
                        <span className="text-white/70">Next Step</span>
                        <span className="font-bold text-white/60 text-right">Delivery confirmation</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6 bg-white">
                  {!isProtected ? (
                    <>
                      <h3 className="text-xs font-bold text-navy/40 uppercase tracking-widest mb-4">Select Payment Method</h3>
                      <div className="grid grid-cols-2 gap-3 mb-6">
                        {[
                          { id: 'UPI', label: 'UPI', icon: Smartphone },
                          { id: 'CARD', label: 'Card', icon: CreditCard },
                          { id: 'NET_BANKING', label: 'Net Banking', icon: Building2 },
                          { id: 'TRANSFER', label: 'Bank Transfer', icon: FileText }
                        ].map(method => (
                          <button 
                            key={method.id} 
                            disabled={isProcessing}
                            onClick={() => setSelectedMethod(method.id as any)}
                            className={cn("p-3 text-center rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-2 transition-colors", 
                              selectedMethod === method.id ? "bg-cobalt/5 border-cobalt text-cobalt" : "bg-white border-navy/10 text-navy/60 hover:border-navy/30"
                            )}
                          >
                            <method.icon className="w-5 h-5" />
                            {method.label}
                          </button>
                        ))}
                      </div>
                      
                      {status === 'PAYMENT_FAILED' && (
                        <div className="bg-red-50 border border-red-100 p-4 rounded-xl text-center mb-6">
                          <div className="text-sm font-bold text-red-900 mb-1">Payment was not completed.</div>
                          <div className="text-xs font-medium text-red-800/70">Please try again or select a different payment method.</div>
                        </div>
                      )}
                      
                      <button 
                        onClick={handlePayment}
                        disabled={isProcessing}
                        className={cn("w-full py-4 rounded-xl text-white text-sm font-bold shadow-lg transition-all flex items-center justify-center gap-2", 
                          isProcessing ? "bg-navy/80" : "bg-navy hover:bg-navy/90 shadow-navy/20"
                        )}
                      >
                        {isProcessing ? (
                          <><Activity className="w-4 h-4 animate-spin" /> Opening Secure Payment...</>
                        ) : status === 'PAYMENT_FAILED' ? (
                          <><Lock className="w-4 h-4" /> Try Again</>
                        ) : (
                          <><Lock className="w-4 h-4" /> Pay {localOrder ? formatCurrency(localOrder.total) : '₹2,52,000'} Securely</>
                        )}
                      </button>
                      
                      {status === 'PAYMENT_FAILED' && (
                         <button onClick={() => setStatus('PAYMENT_PENDING')} className="w-full mt-3 py-3 text-navy/60 hover:text-navy text-xs font-bold uppercase tracking-widest flex items-center justify-center transition-colors">
                           Return to Deal
                         </button>
                      )}
                      
                      {!status.includes('FAILED') && <p className="text-[9px] font-bold text-navy/30 uppercase tracking-widest text-center mt-4">Demo Payment Enabled</p>}
                    </>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-lime/10 border border-lime/20 p-4 rounded-xl text-center">
                        <CheckCircle2 className="w-8 h-8 text-lime-700 mx-auto mb-2" />
                        <div className="text-sm font-bold text-lime-900 mb-1">Payment Received</div>
                        <div className="text-xs font-medium text-lime-800/70">Transaction Reference: TXN-DF-983204<br/>05 Sep 2026, 06:13 PM</div>
                      </div>
                      
                      <button 
                        onClick={() => router.push(`/customer/deals/${resolvedParams.dealId}/fulfilment`)}
                        className="w-full py-4 rounded-xl bg-cobalt text-white text-sm font-bold shadow-lg shadow-cobalt/20 hover:bg-cobalt/90 transition-colors flex items-center justify-center gap-2"
                      >
                        View Deal Progress <ArrowRight className="w-4 h-4" />
                      </button>
                      
                      <button onClick={() => router.push(`/customer/deals/${resolvedParams.dealId}/billing`)} className="w-full py-3 text-navy/60 hover:text-navy text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors">
                        <FileText className="w-3 h-3" /> View Invoice
                      </button>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* MOBILE STICKY BOTTOM */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-navy/5 z-40 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
            {!isProtected ? (
              <button 
                onClick={handlePayment}
                disabled={isProcessing}
                className={cn("w-full py-4 rounded-xl text-white font-bold shadow-lg flex items-center justify-center gap-2", status === 'PAYMENT_FAILED' ? "bg-red-600" : "bg-navy")}
              >
                {isProcessing ? <><Activity className="w-5 h-5 animate-spin" /> Opening...</> : status === 'PAYMENT_FAILED' ? <><Lock className="w-4 h-4" /> Try Again</> : <><Lock className="w-4 h-4" /> Pay {localOrder ? formatCurrency(localOrder.total) : '₹2,52,000'}</>}
              </button>
            ) : (
              <button 
                onClick={() => router.push(`/customer/deals/${resolvedParams.dealId}/fulfilment`)}
                className="w-full py-4 rounded-xl bg-cobalt text-white font-bold shadow-lg flex items-center justify-center gap-2"
              >
                View Deal Progress <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>

        </div>
      </main>

      {/* RAZORPAY DEMO CHECKOUT MODAL */}
      <AnimatePresence>
        {showDemoCheckout && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/80 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl relative">
              <div className="bg-[#02042B] p-6 text-white text-center">
                <div className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-2">Demo Payment Mode</div>
                <div className="text-3xl font-bold mb-1">{localOrder ? formatCurrency(localOrder.total) : '₹2,52,000'}</div>
                <div className="text-sm font-medium text-white/70">{localOrder ? 'Full Payment' : 'Milestone 1: 30% Advance'}</div>
              </div>
              
              <div className="p-8 space-y-6">
                <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl text-sm font-medium text-orange-800 text-center">
                  This is a simulated checkout. No real payment will be processed.
                </div>
                
                <button onClick={simulateSuccess} className="w-full py-4 rounded-xl bg-lime-600 hover:bg-lime-700 text-white font-bold shadow-lg shadow-lime-600/20 transition-colors flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-5 h-5" /> Simulate Success
                </button>
                
                <button onClick={simulateFailure} className="w-full py-4 rounded-xl bg-white border-2 border-navy/10 text-navy font-bold hover:bg-navy/5 transition-colors">
                  Simulate Failure / Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

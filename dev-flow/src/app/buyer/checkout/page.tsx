"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { WorkspaceLayout } from "@/components/layout/WorkspaceLayout";
import { UserRole } from "@/types/auth";
import { ArrowRight, CheckCircle2, ShieldCheck, MapPin, CreditCard, Activity, Truck, CalendarCheck } from "lucide-react";
import * as motion from "framer-motion/client";
import { AnimatePresence } from "framer-motion";
import { estimateDelivery, formatEstimateDate } from "@/lib/deliveryEstimate";

const formatCurrency = (val: number) => `₹${val.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/api/cart")
      .then(res => res.json())
      .then(data => setCartItems(data))
      .catch(err => console.error("Failed to load cart", err));
  }, []);

  const total = cartItems.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
  const platformFee = total * 0.02;
  const orderTotal = total + platformFee;
  const delivery = estimateDelivery(cartItems);

  const handleConfirmOrder = () => {
    setIsProcessing(true);
    
    // Simulate secure DEV FLOW escrow payment delay
    setTimeout(() => {
      import("@/lib/demoState").then(m => {
        const orderId = m.demoState.createLocalOrder(cartItems);
        setOrderId(orderId);
        setIsProcessing(false);
        setIsSuccess(true);
      });
    }, 1500);
  };

  if (isSuccess) {
    return (
      <WorkspaceLayout role={UserRole.BUYER}>
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="w-24 h-24 rounded-full bg-lime/20 flex items-center justify-center mb-8 shadow-xl shadow-lime/10"
          >
            <CheckCircle2 className="w-12 h-12 text-lime-700" />
          </motion.div>
          
          <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-2">Order Confirmed</div>
          <h1 className="text-3xl lg:text-4xl font-bold text-navy tracking-tight mb-2 uppercase">{orderId}</h1>
          
          <p className="text-navy/60 font-medium text-lg max-w-md mx-auto mb-8">
            Your payment is protected in the DEV FLOW escrow until delivery is fulfilled.
          </p>

          <div className="bg-white border border-navy/10 rounded-2xl px-6 py-5 shadow-sm mb-10 max-w-sm w-full">
            <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-2">
              <CalendarCheck className="w-3.5 h-3.5" /> Estimated Delivery
            </div>
            <div className="text-xl font-bold text-navy mb-1">{delivery.label}</div>
            <div className="text-xs font-medium text-navy/50">
              Dispatch by {formatEstimateDate(delivery.dispatchBy)} • {delivery.rangeLabel}
            </div>
          </div>

          <button onClick={() => router.push('/buyer/deals')} className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-navy text-white font-bold hover:bg-navy/90 transition-all shadow-lg shadow-navy/20 active:scale-95">
            View in My Deals <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </WorkspaceLayout>
    );
  }

  return (
    <WorkspaceLayout role={UserRole.BUYER}>
      <div className="max-w-4xl mx-auto pb-24">
        <h1 className="text-3xl lg:text-4xl font-bold text-navy tracking-tight mb-2">Checkout</h1>
        <p className="text-navy/60 font-medium text-lg mb-8">Review your local order and confirm payment.</p>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-navy/10 shadow-sm">
              <h2 className="text-xl font-bold text-navy mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-cobalt" /> Delivery Address
              </h2>
              <div className="p-4 bg-navy/5 rounded-2xl">
                <div className="font-bold text-navy">ABC Enterprises (HQ)</div>
                <div className="text-sm font-medium text-navy/70 mt-1">12th Floor, Tower B, Tech Park</div>
                <div className="text-sm font-medium text-navy/70">Andheri East, Mumbai 400093</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-navy/10 shadow-sm">
              <h2 className="text-xl font-bold text-navy mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5 text-cobalt" /> Estimated Delivery
              </h2>
              <div className="p-4 bg-lime/10 border border-lime/30 rounded-2xl">
                <div className="text-[10px] font-bold text-navy/50 uppercase tracking-widest mb-1">Arrives between</div>
                <div className="text-lg font-bold text-navy mb-2">{delivery.label}</div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium text-navy/60">
                  <span>Dispatch by <strong className="text-navy">{formatEstimateDate(delivery.dispatchBy)}</strong></span>
                  <span>{delivery.rangeLabel}</span>
                  <span>{delivery.laneLabel}</span>
                </div>
              </div>
              <p className="text-[11px] font-medium text-navy/40 mt-3">
                Estimated from seller distance and on-hand stock. Confirmed once the seller dispatches.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-navy/10 shadow-sm">
              <h2 className="text-xl font-bold text-navy mb-4">Order Items</h2>
              <div className="space-y-4">
                {cartItems.map((item, idx) => (
                  <div key={idx} className="flex gap-4 p-4 border border-navy/5 rounded-2xl">
                    <img src={item.image} className="w-16 h-16 object-cover rounded-xl" />
                    <div className="flex-1">
                      <div className="font-bold text-navy text-sm leading-tight mb-1">{item.name}</div>
                      <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest">{item.sellerName}</div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs font-bold text-navy">Qty: {item.quantity}</span>
                        <span className="font-bold text-navy">{formatCurrency(item.unitPrice * item.quantity)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full lg:w-[35%]">
            <div className="sticky top-28 bg-navy p-6 md:p-8 rounded-3xl shadow-xl text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-cobalt/30 rounded-full blur-3xl pointer-events-none" />
              <h2 className="text-xs font-bold uppercase tracking-widest text-white/50 mb-6">Payment Summary</h2>
              
              <div className="space-y-4 text-sm font-medium">
                <div className="flex justify-between">
                  <span className="text-white/70">Subtotal</span>
                  <span>{formatCurrency(total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Platform Fee (2%)</span>
                  <span>{formatCurrency(platformFee)}</span>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-white/20">
                <div className="flex justify-between items-end mb-6">
                  <div className="text-[10px] font-bold text-white/50 uppercase tracking-widest">TOTAL</div>
                  <div className="text-2xl font-bold">{formatCurrency(orderTotal)}</div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-white/10 rounded-xl mb-3 text-xs text-white/80">
                  <Truck className="w-5 h-5 text-lime-400 shrink-0" />
                  <span>Estimated delivery <strong className="text-white">{delivery.label}</strong></span>
                </div>

                <div className="flex items-center gap-3 p-3 bg-white/10 rounded-xl mb-6 text-xs text-white/80">
                  <ShieldCheck className="w-5 h-5 text-lime-400 shrink-0" />
                  <span>Your payment is held in escrow until order delivery is confirmed.</span>
                </div>

                <button 
                  onClick={handleConfirmOrder}
                  disabled={isProcessing || cartItems.length === 0}
                  className="w-full py-4 rounded-xl bg-cobalt hover:bg-cobalt/90 transition-colors text-white font-bold text-sm shadow-lg shadow-cobalt/20 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <><Activity className="w-4 h-4 animate-spin" /> Processing...</>
                  ) : (
                    <><CreditCard className="w-4 h-4" /> Confirm & Pay</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </WorkspaceLayout>
  );
}

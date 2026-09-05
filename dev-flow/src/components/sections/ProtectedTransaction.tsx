"use client";

import React, { useState, useEffect } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ShieldCheck, Truck, ArrowRight, CheckCircle2, User } from "lucide-react";
import * as motion from "framer-motion/client";
import { AnimatePresence } from "framer-motion";

export function ProtectedTransaction() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((s) => (s + 1) % 3);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-20 md:py-24 bg-warm px-4 md:px-6">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        
        <div>
          <SectionHeading
            title={
              <>
                Money moves<br />
                <span className="text-navy/50">when trust is earned.</span>
              </>
            }
            className="mb-6 md:mb-8"
          />
          <p className="text-lg md:text-xl text-navy/70 leading-relaxed max-w-md">
            For supported transactions, DEV FLOW acts as a trusted middle layer between unknown buyers and sellers, helping reduce transaction risk.
          </p>
        </div>

        {/* DESKTOP VIEW - Horizontal Storytelling (Preserved exactly as requested) */}
        <div className="hidden md:flex bg-white rounded-[40px] p-12 border border-navy/5 shadow-2xl shadow-navy/5 relative h-[400px] flex-col items-center justify-between overflow-hidden">
          <div className="flex w-full justify-between items-center text-sm font-bold tracking-widest uppercase text-navy/40">
            <div>BUYER</div>
            <div>SELLER</div>
          </div>

          <div className="relative w-full flex-1 flex items-center justify-center my-8">
            <div className="absolute left-8 right-8 h-1 bg-navy/5 rounded-full" />
            <div className={`absolute left-1/2 -translate-x-1/2 w-32 h-32 rounded-full border-2 bg-white flex items-center justify-center transition-colors duration-500 z-10 ${step === 1 ? 'border-cobalt text-cobalt shadow-lg shadow-cobalt/10' : 'border-navy/10 text-navy/20'}`}>
              <ShieldCheck className="w-12 h-12" />
            </div>
            <div 
              className="absolute w-6 h-6 rounded-full bg-coral shadow-lg shadow-coral/30 flex items-center justify-center text-white z-20 transition-all duration-1000 ease-in-out"
              style={{
                left: step === 0 ? '8%' : step === 1 ? '50%' : '92%',
                transform: 'translateX(-50%)',
                opacity: step === 0 ? 0.5 : 1
              }}
            >
              <div className="text-[10px] font-bold">₹</div>
            </div>
          </div>

          <div className="h-12 flex items-center justify-center text-sm font-bold tracking-widest uppercase text-navy w-full text-center">
            {step === 0 && <span className="flex items-center gap-2 animate-pulse"><ArrowRight className="w-4 h-4 text-coral shrink-0" /> PAYMENT SECURED</span>}
            {step === 1 && <span className="flex items-center gap-2"><Truck className="w-4 h-4 text-cobalt shrink-0" /> DELIVERY CONFIRMED</span>}
            {step === 2 && <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-lime shrink-0" /> PAYMENT RELEASED</span>}
          </div>
        </div>

        {/* MOBILE VIEW - Vertical App-Style Tracking Card */}
        <div className="md:hidden bg-white rounded-[32px] p-6 border border-navy/5 shadow-xl shadow-navy/5 relative flex flex-col">
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-navy/5">
            <div className="w-10 h-10 rounded-full bg-navy/5 flex items-center justify-center text-navy">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold tracking-widest text-navy/40 uppercase">DEV FLOW</div>
              <div className="text-sm font-bold text-navy">PROTECTED DEAL</div>
            </div>
            <div className="ml-auto text-lg font-bold text-navy">₹94,000</div>
          </div>

          <div className="relative pl-6 py-2">
            {/* Vertical Line */}
            <div className="absolute left-2.5 top-2 bottom-2 w-[2px] bg-navy/5 rounded-full" />
            
            <div className="flex flex-col gap-6 relative z-10">
              
              {/* Buyer */}
              <div className="flex items-center gap-4">
                <div className="w-5 h-5 rounded-full bg-white border-2 border-navy/20 flex items-center justify-center -ml-[23px] relative z-10">
                  <User className="w-3 h-3 text-navy/40" />
                </div>
                <div className="text-xs font-bold text-navy/60 uppercase tracking-widest">Buyer</div>
              </div>

              {/* Step 1 */}
              <div className="flex items-center gap-4 transition-opacity duration-300">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center -ml-[23px] relative z-10 transition-colors duration-300 ${step >= 0 ? 'bg-coral text-white border-none shadow-md shadow-coral/20' : 'bg-white border-2 border-navy/10'}`}>
                  {step >= 0 && <CheckCircle2 className="w-3 h-3" />}
                </div>
                <div className={`text-xs font-bold uppercase tracking-widest transition-colors duration-300 ${step >= 0 ? 'text-coral' : 'text-navy/30'}`}>Payment Protected</div>
              </div>

              {/* Step 2 */}
              <div className="flex items-center gap-4 transition-opacity duration-300">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center -ml-[23px] relative z-10 transition-colors duration-300 ${step >= 1 ? 'bg-cobalt text-white border-none shadow-md shadow-cobalt/20' : 'bg-white border-2 border-navy/10'}`}>
                  {step >= 1 && <CheckCircle2 className="w-3 h-3" />}
                </div>
                <div className={`text-xs font-bold uppercase tracking-widest transition-colors duration-300 ${step >= 1 ? 'text-cobalt' : 'text-navy/30'}`}>Delivery Confirmed</div>
              </div>

              {/* Step 3 */}
              <div className="flex items-center gap-4 transition-opacity duration-300">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center -ml-[23px] relative z-10 transition-colors duration-300 ${step >= 2 ? 'bg-lime text-navy border-none shadow-md shadow-lime/20' : 'bg-white border-2 border-navy/10'}`}>
                  {step >= 2 && <CheckCircle2 className="w-3 h-3" />}
                </div>
                <div className={`text-xs font-bold uppercase tracking-widest transition-colors duration-300 ${step >= 2 ? 'text-navy' : 'text-navy/30'}`}>Payment Released</div>
              </div>

              {/* Seller */}
              <div className="flex items-center gap-4">
                <div className="w-5 h-5 rounded-full bg-white border-2 border-navy/20 flex items-center justify-center -ml-[23px] relative z-10">
                  <User className="w-3 h-3 text-navy/40" />
                </div>
                <div className="text-xs font-bold text-navy/60 uppercase tracking-widest">Seller</div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

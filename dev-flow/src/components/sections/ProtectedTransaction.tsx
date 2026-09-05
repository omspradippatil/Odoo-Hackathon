"use client";

import React, { useState, useEffect } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ShieldCheck, Truck, ArrowRight, CheckCircle2 } from "lucide-react";
import * as motion from "framer-motion/client";

export function ProtectedTransaction() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((s) => (s + 1) % 3);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-24 bg-warm px-6">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        
        <div>
          <SectionHeading
            title={
              <>
                Money moves<br />
                <span className="text-navy/50">when trust is earned.</span>
              </>
            }
            className="mb-8"
          />
          <p className="text-xl text-navy/70 leading-relaxed max-w-md">
            For supported transactions, DEV FLOW acts as a trusted middle layer between unknown buyers and sellers, helping reduce transaction risk.
          </p>
        </div>

        <div className="bg-white rounded-[40px] p-8 md:p-12 border border-navy/5 shadow-2xl shadow-navy/5 relative h-[400px] flex flex-col items-center justify-between">
          
          <div className="flex w-full justify-between items-center text-sm font-bold tracking-widest uppercase text-navy/40">
            <div>BUYER</div>
            <div>SELLER</div>
          </div>

          <div className="relative w-full flex-1 flex items-center justify-center my-8">
            {/* Background Track */}
            <div className="absolute left-8 right-8 h-1 bg-navy/5 rounded-full" />
            
            {/* DEV FLOW Middle Node */}
            <div className={`absolute left-1/2 -translate-x-1/2 w-32 h-32 rounded-full border-2 bg-white flex items-center justify-center transition-colors duration-500 z-10 ${step === 1 ? 'border-cobalt text-cobalt shadow-lg shadow-cobalt/10' : 'border-navy/10 text-navy/20'}`}>
              <ShieldCheck className="w-12 h-12" />
            </div>

            {/* Token Animation */}
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

          <div className="h-12 flex items-center justify-center text-sm font-bold tracking-widest uppercase text-navy">
            {step === 0 && <span className="flex items-center gap-2 animate-pulse"><ArrowRight className="w-4 h-4 text-coral" /> PAYMENT SECURED</span>}
            {step === 1 && <span className="flex items-center gap-2"><Truck className="w-4 h-4 text-cobalt" /> DELIVERY CONFIRMED</span>}
            {step === 2 && <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-lime" /> PAYMENT RELEASED</span>}
          </div>

        </div>

      </div>
    </section>
  );
}

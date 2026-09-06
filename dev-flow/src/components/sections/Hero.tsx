"use client";

import React, { useState, useEffect } from "react";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { VendorCard } from "@/components/ui/VendorCard";
import { Check, Network, Activity } from "lucide-react";
import * as motion from "framer-motion/client";
import { AnimatePresence } from "framer-motion";

export function Hero() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    // 0: Initial (Cards enter)
    // 1: Comparing (Cards active, text shows)
    // 2: Recommended (Central node + insight)
    const t1 = setTimeout(() => setPhase(1), 2000);
    const t2 = setTimeout(() => setPhase(2), 4500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <section className="relative pt-28 pb-16 md:pt-32 md:pb-20 lg:pt-48 lg:pb-32 px-4 md:px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
        
        {/* LEFT COPY - Preserved from desktop design */}
        <div className="flex flex-col items-start gap-6 md:gap-8 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex px-3 py-1 text-[10px] md:text-xs font-semibold tracking-widest uppercase rounded-full bg-navy/5 text-navy border border-navy/10"
          >
            The smarter way to make a deal
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-navy leading-[1.1] md:leading-[1.1]"
          >
            Deals shouldn't run on guesswork.<br className="hidden md:block" />
            <span className="md:hidden"> </span>
            They should run on <span className="relative inline-block text-coral">
              trust.
              <svg className="absolute w-full h-2 md:h-3 -bottom-0 md:-bottom-1 left-0 text-coral opacity-30" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="transparent"/>
              </svg>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base md:text-lg lg:text-xl text-navy/70 leading-relaxed max-w-lg"
          >
            Source, compare, negotiate, approve and fulfil every deal from one intelligent workspace — whether you're buying locally or managing enterprise procurement.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto"
          >
            <PrimaryButton href="/signup" showArrow className="w-full sm:w-auto">Start a Deal</PrimaryButton>
            <PrimaryButton href="/demo" variant="outline" className="w-full sm:w-auto">Explore Live Demo</PrimaryButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-x-4 md:gap-x-6 gap-y-2 mt-2 md:mt-4 text-xs md:text-sm font-medium text-navy/60"
          >
            {['Compare beyond price', 'Verified vendors', 'Protected transactions'].map(item => (
              <div key={item} className="flex items-center gap-1.5">
                <Check className="w-3 h-3 md:w-4 md:h-4 text-lime" />
                {item}
              </div>
            ))}
          </motion.div>
        </div>

        {/* RIGHT VISUAL - Adapts to app-style sequence on mobile */}
        <div className="relative h-[550px] md:h-[550px] lg:h-[600px] flex items-center justify-center mt-4 md:mt-8 lg:mt-0 w-full">
          <div className="absolute inset-0 bg-gradient-to-tr from-coral/5 to-cobalt/5 rounded-[32px] md:rounded-[40px] -z-10" />
          
          <div className="w-full max-w-[340px] md:max-w-md relative scale-[0.95] sm:scale-100 origin-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-navy rounded-2xl p-3 md:p-4 shadow-2xl relative z-10 text-center mb-6 md:mb-8 mx-auto w-4/5 md:w-full"
            >
              <div className="text-[8px] md:text-[10px] font-bold text-white/50 tracking-widest uppercase mb-1">Requirement</div>
              <div className="text-white text-sm md:text-base font-medium">50 Business Laptops</div>
            </motion.div>

            {/* Connecting Line from Requirement to Intelligence */}
            <div className="absolute left-1/2 top-14 md:top-16 w-0.5 h-10 md:h-12 bg-navy/10 -translate-x-1/2 -z-10" />

            <div className="relative">
              {/* Desktop Intelligence Node Background (Kept for desktop) */}
              <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-lime/10 rounded-full blur-3xl -z-10 transition-opacity duration-1000" style={{ opacity: phase === 2 ? 1 : 0 }} />
              
              {/* Animated Cards Container */}
              <div className="grid grid-cols-1 gap-3 md:gap-4 relative z-20">
                <motion.div animate={{ opacity: phase === 1 ? 0.4 : phase === 2 ? 0.3 : 1, scale: phase === 2 ? 0.9 : 0.95 }} transition={{ duration: 0.5 }}>
                  <VendorCard name="Vendor B" price="₹88,000" tier="BRONZE" rating={3.6} delivery="5-day delivery" className="origin-bottom shadow-sm" />
                </motion.div>
                
                <motion.div animate={{ scale: phase === 2 ? 1.05 : 1, zIndex: phase === 2 ? 30 : 20, y: phase === 2 ? -10 : 0 }} transition={{ duration: 0.5 }}>
                  <VendorCard name="Vendor A" price="₹94,000" tier="GOLD" rating={4.8} delivery="2-day delivery" isRecommended={phase === 2} className={`shadow-xl ${phase === 2 ? 'border-coral shadow-coral/20' : ''}`} />
                </motion.div>
                
                <motion.div animate={{ opacity: phase === 1 ? 0.4 : phase === 2 ? 0.3 : 1, scale: phase === 2 ? 0.9 : 0.95 }} transition={{ duration: 0.5 }}>
                  <VendorCard name="Vendor C" price="₹97,000" tier="GOLD" rating={4.9} delivery="1-day delivery" className="origin-top shadow-sm" />
                </motion.div>
              </div>

              {/* Mobile "Comparing..." Overlay state */}
              <AnimatePresence>
                {phase === 1 && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    exit={{ opacity: 0, scale: 1.1 }}
                    className="absolute inset-0 flex flex-col items-center justify-center z-40"
                  >
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-sm rounded-3xl" />
                    <div className="relative bg-navy text-white rounded-2xl p-6 shadow-2xl border border-navy/10 flex flex-col items-center text-center max-w-[240px]">
                      <Activity className="w-8 h-8 text-coral animate-pulse mb-4" />
                      <div className="text-[10px] font-bold tracking-widest text-white/50 uppercase mb-2">AAKALAN360 IS COMPARING</div>
                      <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
                        <span className="text-lime">Price</span> • <span>Trust</span> • <span>Experience</span> • <span className="text-cobalt">Delivery</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Phase 2: Insight Reveal */}
              <AnimatePresence>
                {phase === 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -bottom-16 left-0 right-0 z-50 mt-6 md:mt-8 text-center bg-white/95 md:bg-white/80 backdrop-blur-md rounded-xl p-3 md:p-4 border border-navy/10 shadow-xl mx-auto w-[105%] md:w-full"
                  >
                    <Network className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-2 text-cobalt" />
                    <p className="text-[11px] md:text-sm font-medium text-navy/80 leading-relaxed">
                      <span className="text-coral font-bold block md:inline mb-1 md:mb-0">AAKALAN360 INTELLIGENCE: </span> 
                      ₹6K more than the cheapest option, but significantly higher trust and faster fulfilment.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

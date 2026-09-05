"use client";

import React from "react";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { VendorCard } from "@/components/ui/VendorCard";
import { Check, Network } from "lucide-react";
import * as motion from "framer-motion/client";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 lg:gap-8 items-center">
        
        {/* LEFT COPY */}
        <div className="flex flex-col items-start gap-8 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex px-3 py-1 text-xs font-semibold tracking-widest uppercase rounded-full bg-navy/5 text-navy border border-navy/10"
          >
            The smarter way to make a deal
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-navy leading-[1.05]"
          >
            Deals shouldn't run on guesswork.<br />
            They should run on <span className="relative inline-block text-coral">
              trust.
              <svg className="absolute w-full h-3 -bottom-1 left-0 text-coral opacity-30" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="transparent"/>
              </svg>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-navy/70 leading-relaxed max-w-lg"
          >
            Source, compare, negotiate, approve and fulfil every deal from one intelligent workspace — whether you're buying locally or managing enterprise procurement.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center gap-4"
          >
            <PrimaryButton href="/signup" showArrow>Start a Deal</PrimaryButton>
            <PrimaryButton href="/demo" variant="outline">Explore Live Demo</PrimaryButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm font-medium text-navy/60"
          >
            {['Compare beyond price', 'Verified vendors', 'Protected transactions'].map(item => (
              <div key={item} className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-lime" />
                {item}
              </div>
            ))}
          </motion.div>
        </div>

        {/* RIGHT VISUAL */}
        <div className="relative lg:h-[600px] flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-tr from-coral/5 to-cobalt/5 rounded-[40px] -z-10" />
          
          <div className="w-full max-w-md relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="bg-navy rounded-2xl p-4 shadow-2xl relative z-10 text-center mb-8"
            >
              <div className="text-[10px] font-bold text-white/50 tracking-widest uppercase mb-1">Requirement</div>
              <div className="text-white font-medium">50 Business Laptops</div>
            </motion.div>

            {/* Connecting Line from Requirement to Intelligence */}
            <div className="absolute left-1/2 top-16 w-0.5 h-12 bg-navy/10 -translate-x-1/2 -z-10" />

            <div className="grid grid-cols-1 gap-4 relative">
              {/* Intelligence Node Background */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-lime/10 rounded-full blur-3xl -z-10" />
              
              <VendorCard
                name="Vendor B"
                price="₹88,000"
                tier="BRONZE"
                rating={3.6}
                delivery="5-day delivery"
                delay={0.5}
                className="scale-90 opacity-70 origin-bottom"
              />
              
              <VendorCard
                name="Vendor A"
                price="₹94,000"
                tier="GOLD"
                rating={4.8}
                delivery="2-day delivery"
                isRecommended
                delay={0.7}
                className="z-20 -my-4"
              />
              
              <VendorCard
                name="Vendor C"
                price="₹97,000"
                tier="GOLD"
                rating={4.9}
                delivery="1-day delivery"
                delay={0.9}
                className="scale-90 opacity-70 origin-top"
              />
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="mt-8 text-center bg-white/60 backdrop-blur rounded-xl p-4 border border-navy/5"
            >
              <Network className="w-5 h-5 mx-auto mb-2 text-cobalt" />
              <p className="text-sm font-medium text-navy/80">
                <span className="text-coral font-bold">DEV FLOW INTELLIGENCE: </span> 
                ₹6K more than the cheapest option, but significantly higher trust and faster fulfilment.
              </p>
            </motion.div>

          </div>
        </div>

      </div>
    </section>
  );
}

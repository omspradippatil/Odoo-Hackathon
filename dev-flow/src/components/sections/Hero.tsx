"use client";

import React from "react";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { VendorCard } from "@/components/ui/VendorCard";
import { Check, Network } from "lucide-react";
import * as motion from "framer-motion/client";

export function Hero() {
  return (
    <section className="relative pt-28 pb-16 md:pt-32 md:pb-20 lg:pt-48 lg:pb-32 px-4 md:px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
        
        {/* LEFT COPY */}
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
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-navy leading-[1.1] md:leading-[1.05]"
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

        {/* RIGHT VISUAL */}
        <div className="relative h-[500px] md:h-[550px] lg:h-[600px] flex items-center justify-center mt-8 lg:mt-0 w-full">
          <div className="absolute inset-0 bg-gradient-to-tr from-coral/5 to-cobalt/5 rounded-[32px] md:rounded-[40px] -z-10" />
          
          <div className="w-full max-w-[320px] md:max-w-md relative scale-90 sm:scale-100 origin-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="bg-navy rounded-2xl p-3 md:p-4 shadow-2xl relative z-10 text-center mb-6 md:mb-8 mx-auto w-4/5 md:w-full"
            >
              <div className="text-[8px] md:text-[10px] font-bold text-white/50 tracking-widest uppercase mb-1">Requirement</div>
              <div className="text-white text-sm md:text-base font-medium">50 Business Laptops</div>
            </motion.div>

            {/* Connecting Line from Requirement to Intelligence */}
            <div className="absolute left-1/2 top-14 md:top-16 w-0.5 h-10 md:h-12 bg-navy/10 -translate-x-1/2 -z-10" />

            <div className="grid grid-cols-1 gap-3 md:gap-4 relative">
              {/* Intelligence Node Background */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 md:w-64 md:h-64 bg-lime/10 rounded-full blur-3xl -z-10" />
              
              <VendorCard
                name="Vendor B"
                price="₹88,000"
                tier="BRONZE"
                rating={3.6}
                delivery="5-day delivery"
                delay={0.5}
                className="scale-[0.85] md:scale-90 opacity-70 origin-bottom"
              />
              
              <VendorCard
                name="Vendor A"
                price="₹94,000"
                tier="GOLD"
                rating={4.8}
                delivery="2-day delivery"
                isRecommended
                delay={0.7}
                className="z-20 -my-5 md:-my-4"
              />
              
              <VendorCard
                name="Vendor C"
                price="₹97,000"
                tier="GOLD"
                rating={4.9}
                delivery="1-day delivery"
                delay={0.9}
                className="scale-[0.85] md:scale-90 opacity-70 origin-top"
              />
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="mt-6 md:mt-8 text-center bg-white/80 md:bg-white/60 backdrop-blur rounded-xl p-3 md:p-4 border border-navy/5 shadow-lg md:shadow-none mx-auto w-[95%] md:w-full"
            >
              <Network className="w-4 h-4 md:w-5 md:h-5 mx-auto mb-1 md:mb-2 text-cobalt" />
              <p className="text-xs md:text-sm font-medium text-navy/80">
                <span className="text-coral font-bold block md:inline mb-1 md:mb-0">DEV FLOW INTELLIGENCE: </span> 
                ₹6K more than cheapest, but significantly higher trust and faster fulfilment.
              </p>
            </motion.div>

          </div>
        </div>

      </div>
    </section>
  );
}

"use client";

import React, { useState, useEffect, useRef } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TrustBadge } from "@/components/ui/TrustBadge";
import { useInView } from "framer-motion";
import * as motion from "framer-motion/client";

function AnimatedNumber({ value }: { value: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      const duration = 2000;
      const incrementTime = (duration / end);
      const timer = setInterval(() => {
        start += 1;
        setCount(start);
        if (start === end) clearInterval(timer);
      }, incrementTime);
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return <span ref={ref}>{count}</span>;
}

export function TrustEngine() {
  return (
    <section id="trust-engine" className="py-20 md:py-24 bg-navy text-white px-4 md:px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        
        <div>
          <SectionHeading
            label="DEV FLOW TRUST ENGINE"
            title={
              <span className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
                A price tells you what it costs.<br />
                <span className="text-lime">Trust tells you what it's worth.</span>
              </span>
            }
            className="mb-8 md:mb-12 [&_div]:bg-white/10 [&_div]:text-lime [&_div]:border-lime/20"
          />
          <p className="text-base sm:text-lg md:text-xl text-white/70 mb-8 md:mb-12 max-w-lg leading-relaxed">
            We continuously evaluate vendors based on actual transaction history, delivery behavior, and verified ratings so you never have to guess.
          </p>
          <div className="flex flex-wrap gap-3 md:gap-4">
            <TrustBadge tier="GOLD" className="bg-white/5 border-white/10" />
            <TrustBadge tier="SILVER" className="bg-white/5 border-white/10" />
            <TrustBadge tier="BRONZE" className="bg-white/5 border-white/10" />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-white/5 border border-white/10 rounded-[32px] p-6 sm:p-8 md:p-12 relative backdrop-blur-md"
        >
          <div className="absolute top-0 right-0 w-48 h-48 md:w-64 md:h-64 bg-lime/10 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="flex justify-between items-start mb-10 md:mb-12 relative z-10">
            <div>
              <div className="text-xs md:text-sm font-bold text-white/50 tracking-widest uppercase mb-1 md:mb-2">Example Vendor Profile</div>
              <div className="text-xl md:text-2xl font-bold">VERTEX SYSTEMS</div>
            </div>
            <TrustBadge tier="GOLD" className="hidden sm:flex" />
          </div>

          <div className="flex items-end gap-3 md:gap-4 mb-12 md:mb-16 relative z-10">
            <div className="text-6xl sm:text-7xl md:text-8xl font-bold text-lime leading-[1.1]">
              <AnimatedNumber value={92} />
            </div>
            <div className="text-xl md:text-2xl font-bold text-white/30 mb-1 md:mb-2">/ 100</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 mb-10 md:mb-12 relative z-10">
            {[
              { label: "Transaction History", val: 96 },
              { label: "Buyer Ratings", val: 91 },
              { label: "Delivery Reliability", val: 94 },
              { label: "Quality Feedback", val: 89 },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-xs md:text-sm font-medium text-white/50 mb-1 md:mb-2">{stat.label}</div>
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="text-lg md:text-xl font-bold">{stat.val}</div>
                  <div className="h-1 md:h-1.5 flex-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${stat.val}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, delay: 0.5 + (i * 0.1) }}
                      className="h-full bg-lime rounded-full"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 md:p-5 rounded-2xl bg-white/5 border border-white/10 relative z-10">
            <div className="text-[10px] md:text-xs font-bold text-lime tracking-widest uppercase mb-1 md:mb-2">AI Trust Overview</div>
            <p className="text-xs md:text-sm text-white/80 leading-relaxed">
              Consistently strong fulfilment history, high buyer satisfaction and reliable delivery performance.
            </p>
          </div>

        </motion.div>

      </div>
    </section>
  );
}

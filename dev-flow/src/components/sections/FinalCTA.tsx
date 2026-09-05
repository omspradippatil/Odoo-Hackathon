"use client";

import React from "react";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import * as motion from "framer-motion/client";

export function FinalCTA() {
  return (
    <section className="py-32 bg-navy text-white relative overflow-hidden px-6">
      <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
        <svg className="w-full h-full max-w-[2000px]" viewBox="0 0 1000 200" preserveAspectRatio="none">
          <path d="M0,100 Q250,200 500,100 T1000,100" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex px-3 py-1 text-xs font-semibold tracking-widest uppercase rounded-full bg-white/5 border border-white/10 mb-8"
        >
          READY TO FLOW?
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8"
        >
          Stop chasing deals.<br />
          <span className="text-white/50">Start controlling the flow.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-white/60 mb-12 max-w-2xl leading-relaxed"
        >
          One intelligent platform for sourcing, trust, negotiation, approvals, fulfilment and billing.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <PrimaryButton href="/signup" variant="secondary" showArrow className="px-8 py-4 text-lg">Start a Deal</PrimaryButton>
          <PrimaryButton href="/login" className="bg-white/10 text-white hover:bg-white/20 px-8 py-4 text-lg">Sign In</PrimaryButton>
        </motion.div>
      </div>
    </section>
  );
}

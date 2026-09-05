"use client";

import React from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TrustBadge } from "@/components/ui/TrustBadge";
import { ArrowRight, ChevronRight } from "lucide-react";
import * as motion from "framer-motion/client";

export function ProblemStory() {
  return (
    <section className="py-24 bg-white px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          title={
            <>
              The cheapest quote isn't always<br />
              <span className="text-coral">the best deal.</span>
            </>
          }
          align="center"
          className="mb-20"
        />

        <div className="flex flex-col lg:flex-row items-stretch justify-center gap-8 lg:gap-16">
          {/* CHEAPEST */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1 bg-warm/50 rounded-3xl p-8 lg:p-12 border border-navy/5 relative"
          >
            <div className="text-sm font-bold text-navy/50 tracking-widest uppercase mb-4">Lowest Price</div>
            <div className="text-5xl font-bold text-navy mb-8">₹88,000</div>
            
            <div className="space-y-6">
              <TrustBadge tier="BRONZE" />
              <ul className="space-y-4 text-navy/70">
                <li className="flex items-center gap-3"><ChevronRight className="w-4 h-4 text-navy/30" /> 3.6 Trust Score</li>
                <li className="flex items-center gap-3"><ChevronRight className="w-4 h-4 text-navy/30" /> Limited transaction history</li>
                <li className="flex items-center gap-3"><ChevronRight className="w-4 h-4 text-navy/30" /> 5-day delivery</li>
              </ul>
            </div>
          </motion.div>

          {/* INDICATOR */}
          <div className="hidden lg:flex flex-col items-center justify-center">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              className="w-16 h-16 rounded-full bg-navy text-white flex items-center justify-center shadow-xl z-10"
            >
              <ArrowRight className="w-6 h-6" />
            </motion.div>
          </div>

          {/* RECOMMENDED */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1 bg-navy rounded-3xl p-8 lg:p-12 text-white relative shadow-2xl shadow-navy/20"
          >
            <div className="text-sm font-bold text-coral tracking-widest uppercase mb-4">Recommended by DEV FLOW</div>
            <div className="text-5xl font-bold mb-8">₹94,000</div>
            
            <div className="space-y-6">
              <TrustBadge tier="GOLD" />
              <ul className="space-y-4 text-white/70">
                <li className="flex items-center gap-3"><ChevronRight className="w-4 h-4 text-lime" /> 4.8 Trust Score</li>
                <li className="flex items-center gap-3"><ChevronRight className="w-4 h-4 text-lime" /> Verified transaction history</li>
                <li className="flex items-center gap-3"><ChevronRight className="w-4 h-4 text-lime" /> 2-day delivery</li>
              </ul>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <div className="text-xl font-medium text-navy mb-4">We look beyond price.</div>
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 text-sm font-bold text-navy/40 uppercase tracking-widest">
            <span>Price</span>
            <span className="w-1.5 h-1.5 rounded-full bg-coral" />
            <span className="text-navy">Trust</span>
            <span className="w-1.5 h-1.5 rounded-full bg-coral" />
            <span>Quality</span>
            <span className="w-1.5 h-1.5 rounded-full bg-coral" />
            <span>Experience</span>
            <span className="w-1.5 h-1.5 rounded-full bg-coral" />
            <span>Availability</span>
            <span className="w-1.5 h-1.5 rounded-full bg-coral" />
            <span>Delivery</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

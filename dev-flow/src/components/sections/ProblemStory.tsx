"use client";

import React from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TrustBadge } from "@/components/ui/TrustBadge";
import { ArrowRight, ChevronRight } from "lucide-react";
import * as motion from "framer-motion/client";

export function ProblemStory() {
  return (
    <section className="py-20 md:py-24 bg-white px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          title={
            <>
              The cheapest quote isn't always<br />
              <span className="text-coral">the best deal.</span>
            </>
          }
          align="center"
          className="mb-12 md:mb-20"
        />

        <div className="flex flex-col lg:flex-row items-stretch justify-center gap-6 lg:gap-16">
          {/* CHEAPEST */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1 bg-warm/50 rounded-[32px] md:rounded-3xl p-6 sm:p-8 lg:p-12 border border-navy/5 relative"
          >
            <div className="text-xs md:text-sm font-bold text-navy/50 tracking-widest uppercase mb-4">Lowest Price</div>
            <div className="text-4xl md:text-5xl font-bold text-navy mb-6 md:mb-8">₹88,000</div>
            
            <div className="space-y-4 md:space-y-6">
              <TrustBadge tier="BRONZE" />
              <ul className="space-y-3 md:space-y-4 text-sm md:text-base text-navy/70">
                <li className="flex items-start md:items-center gap-2 md:gap-3"><ChevronRight className="w-4 h-4 text-navy/30 shrink-0 mt-0.5 md:mt-0" /> <span>3.6 Trust Score</span></li>
                <li className="flex items-start md:items-center gap-2 md:gap-3"><ChevronRight className="w-4 h-4 text-navy/30 shrink-0 mt-0.5 md:mt-0" /> <span>Limited transaction history</span></li>
                <li className="flex items-start md:items-center gap-2 md:gap-3"><ChevronRight className="w-4 h-4 text-navy/30 shrink-0 mt-0.5 md:mt-0" /> <span>5-day delivery</span></li>
              </ul>
            </div>
          </motion.div>

          {/* INDICATOR */}
          <div className="flex flex-col items-center justify-center -my-2 lg:my-0">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-navy text-white flex items-center justify-center shadow-xl z-10 lg:rotate-0 rotate-90"
            >
              <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
            </motion.div>
          </div>

          {/* RECOMMENDED */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1 bg-navy rounded-[32px] md:rounded-3xl p-6 sm:p-8 lg:p-12 text-white relative shadow-2xl shadow-navy/20"
          >
            <div className="text-xs md:text-sm font-bold text-coral tracking-widest uppercase mb-4">Recommended by Aakalan360</div>
            <div className="text-4xl md:text-5xl font-bold mb-6 md:mb-8">₹94,000</div>
            
            <div className="space-y-4 md:space-y-6">
              <TrustBadge tier="GOLD" />
              <ul className="space-y-3 md:space-y-4 text-sm md:text-base text-white/70">
                <li className="flex items-start md:items-center gap-2 md:gap-3"><ChevronRight className="w-4 h-4 text-lime shrink-0 mt-0.5 md:mt-0" /> <span>4.8 Trust Score</span></li>
                <li className="flex items-start md:items-center gap-2 md:gap-3"><ChevronRight className="w-4 h-4 text-lime shrink-0 mt-0.5 md:mt-0" /> <span>Verified transaction history</span></li>
                <li className="flex items-start md:items-center gap-2 md:gap-3"><ChevronRight className="w-4 h-4 text-lime shrink-0 mt-0.5 md:mt-0" /> <span>2-day delivery</span></li>
              </ul>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 md:mt-20 text-center"
        >
          <div className="text-lg md:text-xl font-medium text-navy mb-4">We look beyond price.</div>
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 text-[10px] sm:text-xs md:text-sm font-bold text-navy/40 uppercase tracking-widest">
            <span>Price</span>
            <span className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-coral" />
            <span className="text-navy">Trust</span>
            <span className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-coral" />
            <span>Quality</span>
            <span className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-coral" />
            <span>Experience</span>
            <span className="hidden sm:block w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-coral" />
            <span className="hidden sm:block">Availability</span>
            <span className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-coral" />
            <span>Delivery</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

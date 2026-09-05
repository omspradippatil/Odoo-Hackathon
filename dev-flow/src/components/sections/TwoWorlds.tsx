"use client";

import React from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { Building2, Store } from "lucide-react";
import * as motion from "framer-motion/client";

export function TwoWorlds() {
  return (
    <section id="solutions" className="py-20 md:py-24 bg-warm px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          title={
            <>
              One platform.<br />
              <span className="text-navy/50">Two worlds of deals.</span>
            </>
          }
          className="mb-12 md:mb-16"
        />

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          
          {/* PROFESSIONAL DEALS */}
          <motion.div
            id="for-business"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className="bg-navy rounded-[32px] md:rounded-[40px] p-6 sm:p-8 md:p-10 lg:p-14 text-white relative overflow-hidden group scroll-mt-28"
          >
            <span id="professional" className="absolute -top-28" />
            <div className="absolute top-0 right-0 p-8 md:p-12 opacity-5 pointer-events-none transition-transform duration-700 group-hover:scale-110">
              <Building2 className="w-48 h-48 md:w-64 md:h-64" />
            </div>
            
            <div className="relative z-10">
              <div className="text-coral font-bold tracking-widest uppercase text-xs md:text-sm mb-4 md:mb-6">Professional Deals</div>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 md:mb-10 leading-tight">Procurement without the spreadsheet chaos.</h3>
              
              <div className="flex flex-wrap gap-2 text-[10px] md:text-xs font-semibold uppercase tracking-wider text-white/50 mb-8 md:mb-12">
                Create Requirement → Receive Bids → Compare → Negotiate → Approve → Fulfil
              </div>

              <ul className="space-y-3 md:space-y-4 text-sm md:text-base text-white/80 font-medium mb-10 md:mb-12">
                <li className="flex items-start md:items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-coral shrink-0 mt-2 md:mt-0" /> <span>Multi-vendor quotations</span></li>
                <li className="flex items-start md:items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-coral shrink-0 mt-2 md:mt-0" /> <span>Anonymous bidding</span></li>
                <li className="flex items-start md:items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-coral shrink-0 mt-2 md:mt-0" /> <span>Approval routing</span></li>
                <li className="flex items-start md:items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-coral shrink-0 mt-2 md:mt-0" /> <span>Vendor trust intelligence</span></li>
                <li className="flex items-start md:items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-coral shrink-0 mt-2 md:mt-0" /> <span>Structured negotiation</span></li>
              </ul>

              <PrimaryButton href="/signup" variant="secondary" showArrow className="w-full sm:w-auto">Explore Professional</PrimaryButton>
            </div>
          </motion.div>

          {/* LOCAL DEALS */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-[32px] md:rounded-[40px] p-6 sm:p-8 md:p-10 lg:p-14 border border-navy/5 relative overflow-hidden group shadow-xl shadow-navy/5"
          >
            <div className="absolute top-0 right-0 p-8 md:p-12 opacity-[0.03] pointer-events-none transition-transform duration-700 group-hover:scale-110">
              <Store className="w-48 h-48 md:w-64 md:h-64 text-navy" />
            </div>
            
            <div className="relative z-10">
              <div className="text-cobalt font-bold tracking-widest uppercase text-xs md:text-sm mb-4 md:mb-6">Local Deals</div>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-navy mb-8 md:mb-10 leading-tight">Buy nearby.<br />Know who you're dealing with.</h3>
              
              <div className="flex flex-wrap gap-2 text-[10px] md:text-xs font-semibold uppercase tracking-wider text-navy/40 mb-8 md:mb-12">
                Search → Compare Sellers → Verify Trust → Buy / Deliver
              </div>

              <ul className="space-y-3 md:space-y-4 text-sm md:text-base text-navy/70 font-medium mb-10 md:mb-12">
                <li className="flex items-start md:items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-cobalt shrink-0 mt-2 md:mt-0" /> <span>Nearby verified sellers</span></li>
                <li className="flex items-start md:items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-cobalt shrink-0 mt-2 md:mt-0" /> <span>Location-based pricing</span></li>
                <li className="flex items-start md:items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-cobalt shrink-0 mt-2 md:mt-0" /> <span>Seller trust tiers</span></li>
                <li className="flex items-start md:items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-cobalt shrink-0 mt-2 md:mt-0" /> <span>Protected transaction</span></li>
                <li className="flex items-start md:items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-cobalt shrink-0 mt-2 md:mt-0" /> <span>Delivery or store pickup</span></li>
              </ul>

              <PrimaryButton href="/signup" variant="outline" showArrow className="w-full sm:w-auto">Explore Local</PrimaryButton>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

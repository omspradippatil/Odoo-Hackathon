"use client";

import React from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { Building2, Store } from "lucide-react";
import * as motion from "framer-motion/client";

export function TwoWorlds() {
  return (
    <section id="solutions" className="py-24 bg-warm px-6">
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          title={
            <>
              One platform.<br />
              <span className="text-navy/50">Two worlds of deals.</span>
            </>
          }
          className="mb-16"
        />

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          
          {/* PROFESSIONAL DEALS */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className="bg-navy rounded-[40px] p-10 md:p-14 text-white relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none transition-transform duration-700 group-hover:scale-110">
              <Building2 className="w-64 h-64" />
            </div>
            
            <div className="relative z-10">
              <div className="text-coral font-bold tracking-widest uppercase text-sm mb-6">Professional Deals</div>
              <h3 className="text-3xl md:text-4xl font-bold mb-10 leading-tight">Procurement without the spreadsheet chaos.</h3>
              
              <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wider text-white/50 mb-12">
                Create Requirement → Receive Bids → Compare → Negotiate → Approve → Fulfil
              </div>

              <ul className="space-y-4 text-white/80 font-medium mb-12">
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-coral" /> Multi-vendor quotations</li>
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-coral" /> Anonymous bidding</li>
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-coral" /> Approval routing</li>
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-coral" /> Vendor trust intelligence</li>
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-coral" /> Structured negotiation</li>
              </ul>

              <PrimaryButton href="/professional" variant="secondary" showArrow>Explore Professional</PrimaryButton>
            </div>
          </motion.div>

          {/* LOCAL DEALS */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-[40px] p-10 md:p-14 border border-navy/5 relative overflow-hidden group shadow-xl shadow-navy/5"
          >
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none transition-transform duration-700 group-hover:scale-110">
              <Store className="w-64 h-64 text-navy" />
            </div>
            
            <div className="relative z-10">
              <div className="text-cobalt font-bold tracking-widest uppercase text-sm mb-6">Local Deals</div>
              <h3 className="text-3xl md:text-4xl font-bold text-navy mb-10 leading-tight">Buy nearby.<br />Know who you're dealing with.</h3>
              
              <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-wider text-navy/40 mb-12">
                Search → Compare Sellers → Verify Trust → Buy / Deliver
              </div>

              <ul className="space-y-4 text-navy/70 font-medium mb-12">
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-cobalt" /> Nearby verified sellers</li>
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-cobalt" /> Location-based pricing</li>
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-cobalt" /> Seller trust tiers</li>
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-cobalt" /> Protected transaction</li>
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-cobalt" /> Delivery or store pickup</li>
              </ul>

              <PrimaryButton href="/local" variant="outline" showArrow>Explore Local</PrimaryButton>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

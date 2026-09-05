"use client";
import React, { use } from "react";
import { FileText, ArrowRight } from "lucide-react";
import Link from "next/link";
import * as motion from "framer-motion/client";

export default function BillingPlaceholder({ params }: { params: Promise<{ dealId: string }> }) {
  const resolvedParams = use(params);
  return (
    <div className="min-h-screen bg-warm/20 flex flex-col items-center justify-center text-center px-4">
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-24 h-24 rounded-full bg-navy/10 flex items-center justify-center mb-8 shadow-xl shadow-navy/5">
        <FileText className="w-12 h-12 text-navy" />
      </motion.div>
      <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-2">Deal Progression</div>
      <h1 className="text-3xl lg:text-4xl font-bold text-navy tracking-tight mb-2 uppercase">{resolvedParams.dealId}</h1>
      <p className="text-navy/60 font-medium text-lg max-w-md mx-auto mb-10">Fulfilment is complete. Ready to proceed to final GST Invoicing and Billing.</p>
      <Link href="/" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-navy text-white font-bold hover:bg-navy/90 transition-all shadow-lg active:scale-95">Return to Home <ArrowRight className="w-5 h-5" /></Link>
    </div>
  );
}

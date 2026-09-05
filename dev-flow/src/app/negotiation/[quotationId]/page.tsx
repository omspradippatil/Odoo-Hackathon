"use client";
import React, { use } from "react";
import { WorkspaceLayout } from "@/components/layout/WorkspaceLayout";
import { UserRole } from "@/types/auth";
import { CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";
import * as motion from "framer-motion/client";

export default function NegotiationPlaceholderPage({ params }: { params: Promise<{ quotationId: string }> }) {
  const resolvedParams = use(params);
  return (
    <WorkspaceLayout role={UserRole.SALES_REP}>
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-24 h-24 rounded-full bg-lime/20 flex items-center justify-center mb-8 shadow-xl shadow-lime/10">
          <CheckCircle2 className="w-12 h-12 text-lime" />
        </motion.div>
        <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-2">Quotation Ready</div>
        <h1 className="text-3xl lg:text-4xl font-bold text-navy tracking-tight mb-2 uppercase">{resolvedParams.quotationId}</h1>
        <p className="text-navy/60 font-medium text-lg max-w-md mx-auto mb-10">This quotation is within your authority and ready for customer review.</p>
        <Link href="/sales" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-navy text-white font-bold hover:bg-navy/90 transition-all shadow-lg active:scale-95">Continue to Negotiation <ArrowRight className="w-5 h-5" /></Link>
      </div>
    </WorkspaceLayout>
  );
}

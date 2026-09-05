import React from "react";
import Link from "next/link";
import { ArrowRightLeft } from "lucide-react";

export default function SalesPlaceholder() {
  return (
    <main className="min-h-screen bg-warm flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-[32px] p-10 md:p-14 border border-navy/5 shadow-2xl shadow-navy/5 text-center">
        <div className="w-16 h-16 rounded-xl bg-navy text-white flex items-center justify-center mx-auto mb-8 shadow-xl shadow-navy/20">
          <ArrowRightLeft className="w-8 h-8" />
        </div>
        <div className="text-xs font-bold text-navy/40 uppercase tracking-widest mb-2">DEV FLOW</div>
        <h1 className="text-3xl font-bold text-navy mb-4 tracking-tight">Sales Workspace</h1>
        <p className="text-navy/60 font-medium mb-10 leading-relaxed">
          Workspace coming next. This is a minimal placeholder to verify role routing.
        </p>
        <Link href="/" className="inline-flex items-center justify-center w-full px-6 py-4 rounded-full bg-navy/5 text-navy font-bold text-sm hover:bg-navy/10 transition-colors">
          Return to Landing Page
        </Link>
      </div>
    </main>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, ArrowRightLeft } from "lucide-react";
import * as motion from "framer-motion/client";

export function AuthGate({ title = "Sign in to continue your deal." }: { title?: string }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white p-8 md:p-12 rounded-3xl border border-navy/10 shadow-2xl shadow-navy/5 max-w-lg w-full relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cobalt to-lime" />
        
        <div className="w-20 h-20 bg-navy/5 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldCheck className="w-10 h-10 text-navy" />
        </div>
        
        <h2 className="text-2xl font-bold text-navy mb-3">{title}</h2>
        <p className="text-navy/60 font-medium mb-8 leading-relaxed">
          You can explore Aakalan360 without an account. Sign in when you're ready to create, negotiate or complete a transaction.
        </p>

        <div className="flex flex-col gap-3">
          <Link 
            href={`/login?returnTo=${encodeURIComponent(pathname)}`}
            className="w-full py-4 rounded-xl font-bold text-white bg-navy shadow-lg shadow-navy/20 hover:bg-navy/90 transition-colors"
          >
            Sign In
          </Link>
          <Link 
            href={`/signup?returnTo=${encodeURIComponent(pathname)}`}
            className="w-full py-4 rounded-xl font-bold text-navy bg-white border border-navy/10 shadow-sm hover:bg-navy/5 transition-colors"
          >
            Create Account
          </Link>
          <Link 
            href="/explore"
            className="w-full py-4 rounded-xl font-bold text-navy/60 hover:text-navy hover:bg-navy/5 transition-colors flex items-center justify-center gap-2 mt-2"
          >
            <ArrowRightLeft className="w-4 h-4" /> Continue Browsing
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

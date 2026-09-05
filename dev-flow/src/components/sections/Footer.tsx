import React from "react";
import Link from "next/link";
import { ArrowRightLeft } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white pt-16 md:pt-20 pb-8 md:pb-10 px-4 md:px-6 border-t border-navy/5">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 md:gap-12 lg:gap-8 mb-16 md:mb-20">
        
        <div className="col-span-1 sm:col-span-2 md:col-span-4 lg:col-span-2">
          <Link href="/" className="flex items-center gap-2 mb-4 md:mb-6 group inline-flex">
            <div className="w-8 h-8 rounded-lg bg-navy text-white flex items-center justify-center transition-transform group-hover:scale-105">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-navy">DEV FLOW</span>
          </Link>
          <div className="text-xl md:text-2xl font-bold text-navy/40 leading-tight">
            Better deals.<br />Built on trust.
          </div>
        </div>

        <div>
          <div className="font-bold text-navy mb-4 md:mb-6 text-xs md:text-sm tracking-widest uppercase">Product</div>
          <ul className="space-y-3 md:space-y-4 text-sm font-medium text-navy/60">
            <li><Link href="#how-it-works" className="hover:text-coral transition-colors">How it works</Link></li>
            <li><Link href="#trust-engine" className="hover:text-coral transition-colors">Trust Engine</Link></li>
            <li><Link href="/pricing" className="hover:text-coral transition-colors">Pricing</Link></li>
          </ul>
        </div>

        <div>
          <div className="font-bold text-navy mb-4 md:mb-6 text-xs md:text-sm tracking-widest uppercase">Solutions</div>
          <ul className="space-y-3 md:space-y-4 text-sm font-medium text-navy/60">
            <li><Link href="/professional" className="hover:text-coral transition-colors">Professional Deals</Link></li>
            <li><Link href="/local" className="hover:text-coral transition-colors">Local Deals</Link></li>
            <li><Link href="/enterprise" className="hover:text-coral transition-colors">Enterprise</Link></li>
          </ul>
        </div>

        <div>
          <div className="font-bold text-navy mb-4 md:mb-6 text-xs md:text-sm tracking-widest uppercase">Company</div>
          <ul className="space-y-3 md:space-y-4 text-sm font-medium text-navy/60">
            <li><Link href="/about" className="hover:text-coral transition-colors">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-coral transition-colors">Contact</Link></li>
            <li><Link href="/legal" className="hover:text-coral transition-colors">Legal</Link></li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto pt-6 md:pt-8 border-t border-navy/5 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] md:text-xs font-semibold text-navy/40 uppercase tracking-widest text-center md:text-left">
        <div>&copy; {new Date().getFullYear()} DEV FLOW. ALL RIGHTS RESERVED.</div>
        <div>Built for modern commerce.</div>
      </div>
    </footer>
  );
}

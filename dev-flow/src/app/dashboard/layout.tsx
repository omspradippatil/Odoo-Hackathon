"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRightLeft, LayoutDashboard, FileText, Store, ShieldCheck, Settings, Bell, Search, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import * as motion from "framer-motion/client";
import { AnimatePresence } from "framer-motion";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
  { icon: FileText, label: "Requirements", href: "/dashboard/requirements" },
  { icon: Store, label: "Vendor Network", href: "/dashboard/network" },
  { icon: ShieldCheck, label: "Trust Engine", href: "/dashboard/trust" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-warm flex text-navy selection:bg-coral/20">
      
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex w-[280px] bg-navy flex-col justify-between fixed inset-y-0 left-0 z-40">
        <div>
          <div className="h-24 flex items-center px-8 border-b border-white/5">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 rounded-lg bg-white/10 text-white flex items-center justify-center transition-transform group-hover:scale-105">
                <ArrowRightLeft className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg tracking-tight text-white">DEV FLOW</span>
            </Link>
          </div>
          
          <nav className="p-4 space-y-2 mt-4">
            <div className="px-4 text-[10px] font-bold text-white/40 uppercase tracking-widest mb-4">Workspace</div>
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link key={item.label} href={item.href} className={cn("flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200", isActive ? "bg-white text-navy shadow-lg" : "text-white/60 hover:bg-white/5 hover:text-white")}>
                  <Icon className={cn("w-5 h-5", isActive ? "text-cobalt" : "")} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-8 border-t border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-coral flex items-center justify-center text-white font-bold shadow-lg shadow-coral/20">JD</div>
            <div>
              <div className="text-sm font-bold text-white">John Doe</div>
              <div className="text-xs font-medium text-white/50">Buyer Workspace</div>
            </div>
          </div>
        </div>
      </aside>

      {/* MOBILE HEADER */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-navy/5 flex items-center justify-between px-4 z-40">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-navy text-white flex items-center justify-center">
            <ArrowRightLeft className="w-4 h-4" />
          </div>
          <span className="font-bold text-base tracking-tight text-navy">DEV FLOW</span>
        </Link>
        <button onClick={() => setMobileMenuOpen(true)} className="p-2 text-navy">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* MOBILE SIDEBAR OVERLAY */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileMenuOpen(false)} className="fixed inset-0 bg-navy/20 backdrop-blur-sm z-40 lg:hidden" />
            <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", bounce: 0, duration: 0.4 }} className="fixed inset-y-0 left-0 w-[280px] bg-navy z-50 flex flex-col justify-between lg:hidden shadow-2xl">
              <div>
                <div className="h-16 flex items-center justify-between px-6 border-b border-white/5">
                  <span className="font-bold text-lg tracking-tight text-white">Workspace</span>
                  <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-white/50 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <nav className="p-4 space-y-2 mt-2">
                  {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                      <Link key={item.label} href={item.href} onClick={() => setMobileMenuOpen(false)} className={cn("flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200", isActive ? "bg-white text-navy shadow-lg" : "text-white/60 hover:bg-white/5 hover:text-white")}>
                        <Icon className={cn("w-5 h-5", isActive ? "text-cobalt" : "")} />
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>
              </div>
              <div className="p-6 border-t border-white/5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-coral flex items-center justify-center text-white font-bold shadow-lg shadow-coral/20">JD</div>
                <div>
                  <div className="text-sm font-bold text-white">John Doe</div>
                  <div className="text-xs font-medium text-white/50">Buyer Workspace</div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 lg:ml-[280px] flex flex-col min-h-screen pt-16 lg:pt-0 overflow-x-hidden">
        
        {/* TOP HEADERBAR (Desktop) */}
        <header className="hidden lg:flex h-24 items-center justify-between px-10 border-b border-navy/5 bg-warm/50 backdrop-blur-md sticky top-0 z-30">
          <div className="relative w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-navy/40" />
            <input type="text" placeholder="Search requirements, vendors or deals..." className="w-full h-12 pl-12 pr-4 rounded-full bg-white border border-navy/5 focus:outline-none focus:border-cobalt focus:ring-2 focus:ring-cobalt/20 transition-all text-sm font-medium placeholder:text-navy/30" />
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-3 rounded-full bg-white border border-navy/5 text-navy/60 hover:text-navy hover:shadow-md transition-all">
              <Bell className="w-5 h-5" />
              <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-coral border-2 border-white" />
            </button>
            <Link href="/dashboard/new" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-navy text-white text-sm font-bold hover:bg-navy/90 hover:shadow-lg transition-all active:scale-95">
              Start New Deal
            </Link>
          </div>
        </header>

        {/* DASHBOARD CONTENT */}
        <main className="flex-1 p-6 lg:p-10">
          {children}
        </main>
      </div>

    </div>
  );
}

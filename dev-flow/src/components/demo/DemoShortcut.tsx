"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { 
  ChevronRight, Settings2, ShieldCheck, X, PlayCircle, Search,
  FileText, CheckCircle, Handshake, CreditCard, Truck, Receipt,
  Activity, Settings, ExternalLink, ChevronDown, ChevronUp, Gavel
} from "lucide-react";
import * as motion from "framer-motion/client";
import { AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// The 8 Core Evaluator Steps aligned with Aakalan360's verified narrative
const CORE_JOURNEY_STEPS = [
  { 
    id: 1, 
    stepNumber: 1, 
    label: 'Create Requirement', 
    href: '/buyer/requirements/new', 
    icon: Settings2, 
    role: 'BUYER',
    description: 'Post structured specifications & requirements'
  },
  { 
    id: 2, 
    stepNumber: 2, 
    label: 'Compare Vendors', 
    href: '/buyer/requirements/REQ-2048/vendors', 
    icon: Search, 
    role: 'BUYER',
    description: 'Benchmark matching suppliers on price & trust'
  },
  { 
    id: 3, 
    stepNumber: 3, 
    label: 'Build Quotation', 
    href: '/buyer/requirements/REQ-2048/quotation', 
    icon: FileText, 
    role: 'SALES',
    description: 'Model line items, margins & policy thresholds'
  },
  { 
    id: 4, 
    stepNumber: 4, 
    label: 'Approval', 
    href: '/approvals/QT-2048', 
    icon: CheckCircle, 
    role: 'MANAGER',
    description: 'Review policy triggers & authorize commercial terms'
  },
  { 
    id: 5, 
    stepNumber: 5, 
    label: 'Negotiation', 
    href: '/negotiation/QT-2048', 
    icon: Handshake, 
    role: 'SALES',
    description: 'Manage counter-offers & reapproval triggers'
  },
  { 
    id: 6, 
    stepNumber: 6, 
    label: 'Protected Transaction', 
    href: '/customer/deals/DF-2048/payment', 
    icon: CreditCard, 
    role: 'CUSTOMER',
    description: 'Milestone escrow & settlement security'
  },
  { 
    id: 7, 
    stepNumber: 7, 
    label: 'Fulfilment', 
    href: '/operations/fulfilment/DF-2048', 
    icon: Truck, 
    role: 'OPS',
    description: 'Warehouse dispatch & tracking logistics'
  },
  { 
    id: 8, 
    stepNumber: 8, 
    label: 'Billing', 
    href: '/operations/billing/DF-2048', 
    icon: Receipt, 
    role: 'FINANCE',
    description: 'Tax invoices, ledger sync & reconciliation'
  },
];

const ADDITIONAL_SHORTCUTS = [
  { label: 'Demo Hub', href: '/demo', icon: PlayCircle, role: 'PUBLIC' },
  { label: 'Live Bidding Calendar', href: '/demo/live-bidding', icon: Gavel, role: 'SALES' },
  { label: 'Explore (Guest Browsing)', href: '/explore', icon: Search, role: 'PUBLIC' },
  { label: 'Admin Control Center', href: '/admin', icon: Settings, role: 'ADMIN' },
  { label: 'Deal Health Intelligence', href: '/deals/DF-2048/health', icon: Activity, role: 'OPS' },
  { label: 'Trust Intelligence Profile', href: '/vendors/vertex-systems/trust', icon: ShieldCheck, role: 'PUBLIC' },
  { label: 'Operations Payment View', href: '/operations/payments/DF-2048', icon: CreditCard, role: 'OPS' },
  { label: 'Customer Fulfilment Tracking', href: '/customer/deals/DF-2048/fulfilment', icon: Truck, role: 'CUSTOMER' },
  { label: 'Customer Invoice View', href: '/customer/deals/DF-2048/billing', icon: Receipt, role: 'CUSTOMER' },
];

export function DemoShortcut() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showExtras, setShowExtras] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle ESC key to close on desktop
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  if (!mounted) return null;

  // Pages with mobile sticky CTA at bottom-[80px]
  const hasStickyCta = 
    pathname?.includes('/quotation') || 
    pathname?.includes('/approvals/QT') || 
    pathname?.includes('/negotiation/QT') ||
    pathname?.includes('/payment');

  const isStepActive = (href: string) => {
    if (pathname === href) return true;
    if (href !== '/' && pathname?.startsWith(href)) return true;
    return false;
  };

  return (
    <>
      {/* FLOATING LAUNCHER:
          - Desktop: bottom-6 right-6 (safe area, opposite side from desktop sidebar, clear of content)
          - Mobile: bottom-[164px] when sticky CTA is present, or bottom-[96px] above bottom nav
          - Never covers sidebar, forms, or bottom navigation
      */}
      <div 
        className={cn(
          "fixed right-3 sm:right-6 lg:right-6 lg:bottom-6 z-40 transition-all duration-300",
          hasStickyCta ? "bottom-[164px]" : "bottom-[96px]"
        )}
      >
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-navy text-white px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full shadow-xl hover:shadow-2xl flex items-center gap-2 hover:bg-navy/90 transition-all active:scale-95 text-xs font-bold border border-white/10 group backdrop-blur-md"
          aria-label="Open Demo Journey"
        >
          <PlayCircle className="w-4 h-4 text-lime group-hover:scale-110 transition-transform shrink-0" />
          <span className="hidden sm:inline">Demo Journey</span>
          <span className="sm:hidden text-[11px]">Journey</span>
          <span className="w-1.5 h-1.5 rounded-full bg-lime animate-ping shrink-0" />
        </button>
      </div>

      {/* DEMO JOURNEY MODAL */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="fixed inset-0 bg-navy/50 backdrop-blur-sm z-[60]"
              onClick={() => setIsOpen(false)}
            />

            {/* Modal Dialog */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, x: '-50%', y: '-50%' }} 
              animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }} 
              exit={{ opacity: 0, scale: 0.95, x: '-50%', y: '-50%' }} 
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed top-1/2 left-1/2 w-[92vw] max-w-2xl bg-white rounded-3xl shadow-2xl z-[61] overflow-hidden flex flex-col max-h-[85vh] border border-navy/10"
            >
              {/* HEADER */}
              <div className="p-4 sm:p-6 border-b border-navy/5 flex items-center justify-between bg-warm/30 shrink-0">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-navy uppercase tracking-wider flex items-center gap-2">
                    <PlayCircle className="w-5 h-5 text-cobalt shrink-0" /> Evaluator Demo Journey
                  </h2>
                  <p className="text-xs font-medium text-navy/60 mt-0.5">
                    DF-2048 • 50 Enterprise Laptops • Vertex Systems
                  </p>
                </div>
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="w-8 h-8 rounded-full bg-white border border-navy/10 flex items-center justify-center hover:bg-navy/5 transition-colors text-navy/60 shrink-0"
                  aria-label="Close Demo Journey"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* JOURNEY STEPS (8 Core Evaluator Steps) */}
              <div className="overflow-y-auto p-3 sm:p-5 bg-white flex-1 no-scrollbar space-y-1.5">
                <div className="text-[10px] font-bold uppercase tracking-widest text-navy/40 px-3 py-1">
                  8-Stage Evaluation Path
                </div>

                {CORE_JOURNEY_STEPS.map((step) => {
                  const isActive = isStepActive(step.href);
                  const Icon = step.icon;

                  return (
                    <button 
                      key={step.id}
                      onClick={() => {
                        router.push(step.href);
                        setIsOpen(false);
                      }}
                      className={cn(
                        "w-full text-left px-3.5 py-3 rounded-2xl flex items-center justify-between transition-all group relative border",
                        isActive 
                          ? "bg-navy text-white border-navy shadow-md" 
                          : "hover:bg-warm/40 text-navy border-transparent hover:border-navy/5"
                      )}
                    >
                      <div className="flex items-center gap-3 min-w-0 pr-2">
                        <div className={cn(
                          "w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 transition-colors",
                          isActive ? "bg-white/20 text-white" : "bg-navy/5 text-navy group-hover:bg-navy/10"
                        )}>
                          {step.stepNumber}
                        </div>

                        <Icon className={cn(
                          "w-4 h-4 shrink-0", 
                          isActive ? "text-lime" : "text-navy/50 group-hover:text-cobalt"
                        )} />

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs sm:text-sm font-bold truncate">{step.label}</span>
                            {isActive && (
                              <span className="px-1.5 py-0.2 text-[9px] font-bold rounded-full bg-lime text-lime-950">
                                Current
                              </span>
                            )}
                          </div>
                          <p className={cn(
                            "text-[11px] truncate hidden sm:block",
                            isActive ? "text-white/70" : "text-navy/50"
                          )}>
                            {step.description}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 shrink-0">
                        <div className={cn(
                          "text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded",
                          isActive ? "bg-white/10 text-white" : "bg-navy/5 text-navy/60"
                        )}>
                          {step.role}
                        </div>
                        <ChevronRight className={cn(
                          "w-4 h-4 transition-transform",
                          isActive ? "text-white" : "text-navy/30 group-hover:text-navy group-hover:translate-x-0.5"
                        )} />
                      </div>
                    </button>
                  );
                })}

                {/* EXPANDABLE ADDITIONAL SHORTCUTS */}
                <div className="pt-2">
                  <button 
                    onClick={() => setShowExtras(!showExtras)}
                    className="w-full px-3 py-2 text-xs font-bold text-navy/60 hover:text-navy flex items-center justify-between rounded-xl hover:bg-navy/5 transition-colors"
                  >
                    <span className="flex items-center gap-1.5">
                      <ExternalLink className="w-3.5 h-3.5 text-navy/40" />
                      More Workspaces & Dashboards
                    </span>
                    {showExtras ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {showExtras && (
                    <div className="mt-1 space-y-1 pl-2 border-l-2 border-navy/10">
                      {ADDITIONAL_SHORTCUTS.map(item => (
                        <button
                          key={item.label}
                          onClick={() => {
                            router.push(item.href);
                            setIsOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-navy/80 hover:bg-navy/5 flex items-center justify-between group transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <item.icon className="w-3.5 h-3.5 text-navy/40 group-hover:text-cobalt" />
                            <span>{item.label}</span>
                          </div>
                          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-navy/5 text-navy/50">
                            {item.role}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* FOOTER */}
              <div className="p-3.5 border-t border-navy/5 bg-warm/30 text-center shrink-0 flex items-center justify-between px-6">
                <span className="text-[10px] font-bold uppercase tracking-widest text-navy/40">
                  Evaluator Fast-Track
                </span>
                <span className="text-[10px] text-navy/40 hidden sm:inline">
                  Press <kbd className="px-1.5 py-0.5 bg-white border border-navy/10 rounded text-[9px] font-mono text-navy font-bold">ESC</kbd> to close
                </span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

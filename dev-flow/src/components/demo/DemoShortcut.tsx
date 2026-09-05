"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ChevronRight, Settings2, ShieldCheck, X, PlayCircle, LogIn, LayoutDashboard, Search, FileText, CheckCircle, Handshake, CreditCard, Truck, Receipt, Activity, Settings } from "lucide-react";
import * as motion from "framer-motion/client";
import { AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const DEMO_STEPS = [
  { id: 1, label: 'Login', href: '/login', icon: LogIn, role: 'PUBLIC' },
  { id: 2, label: 'Buyer Home', href: '/buyer', icon: LayoutDashboard, role: 'BUYER' },
  { id: 3, label: 'Create Requirement', href: '/buyer/requirements/new', icon: Settings2, role: 'BUYER' },
  { id: 4, label: 'Vendor Discovery', href: '/buyer/requirements/REQ-2048/vendors', icon: Search, role: 'BUYER' },
  { id: 5, label: 'Intelligent Quotation', href: '/buyer/requirements/REQ-2048/quotation', icon: FileText, role: 'BUYER' },
  { id: 6, label: 'Manager Approval', href: '/approvals/QT-2048', icon: CheckCircle, role: 'MANAGER' },
  { id: 7, label: 'Customer Portal (Negotiation)', href: '/customer/quotes/QT-2048', icon: Handshake, role: 'CUSTOMER' },
  { id: 8, label: 'Internal Negotiation', href: '/negotiation/QT-2048', icon: Handshake, role: 'SALES' },
  { id: 9, label: 'Protected Payment', href: '/customer/deals/DF-2048/payment', icon: CreditCard, role: 'CUSTOMER' },
  { id: 10, label: 'Internal Operations Payment', href: '/operations/payments/DF-2048', icon: CreditCard, role: 'OPS' },
  { id: 11, label: 'Smart Fulfilment', href: '/operations/fulfilment/DF-2048', icon: Truck, role: 'OPS' },
  { id: 12, label: 'Customer Tracking', href: '/customer/deals/DF-2048/fulfilment', icon: Truck, role: 'CUSTOMER' },
  { id: 13, label: 'Internal Billing', href: '/operations/billing/DF-2048', icon: Receipt, role: 'OPS' },
  { id: 14, label: 'Customer Invoice', href: '/customer/deals/DF-2048/billing', icon: Receipt, role: 'CUSTOMER' },
  { id: 15, label: 'Trust Intelligence', href: '/vendors/vertex-systems/trust', icon: ShieldCheck, role: 'PUBLIC' },
  { id: 16, label: 'Deal Health (Risk Intelligence)', href: '/deals/DF-2048/health', icon: Activity, role: 'OPS' },
  { id: 17, label: 'Admin Control Center', href: '/admin', icon: Settings, role: 'ADMIN' },
];

export function DemoShortcut() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const currentStep = DEMO_STEPS.findIndex(step => pathname === step.href);

  return (
    <>
      <div className="fixed bottom-4 left-4 z-50">
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-navy text-white px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 hover:bg-navy/90 transition-transform active:scale-95 text-xs font-bold border border-white/10"
        >
          <PlayCircle className="w-4 h-4 text-lime" />
          Demo Journey
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="fixed inset-0 bg-navy/40 backdrop-blur-sm z-[100]"
              onClick={() => setIsOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, x: '-50%', y: '-50%' }} 
              animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }} 
              exit={{ opacity: 0, scale: 0.95, x: '-50%', y: '-50%' }} 
              className="fixed top-1/2 left-1/2 w-full max-w-2xl bg-white rounded-3xl shadow-2xl z-[101] overflow-hidden flex flex-col max-h-[85vh]"
            >
              <div className="p-4 md:p-6 border-b border-navy/5 flex items-center justify-between bg-warm/30 shrink-0">
                <div>
                  <h2 className="text-lg font-bold text-navy uppercase tracking-widest flex items-center gap-2">
                    <PlayCircle className="w-5 h-5 text-cobalt" /> Evaluator Demo Path
                  </h2>
                  <p className="text-xs font-medium text-navy/60 mt-1">DF-2048 • 50 Laptops • Vertex Systems</p>
                </div>
                <button onClick={() => setIsOpen(false)} className="w-8 h-8 rounded-full bg-white border border-navy/10 flex items-center justify-center hover:bg-navy/5 transition-colors text-navy/60">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="overflow-y-auto p-4 md:p-6 bg-white flex-1 no-scrollbar space-y-1">
                {DEMO_STEPS.map((step, idx) => {
                  const isActive = pathname === step.href;
                  return (
                    <button 
                      key={step.id}
                      onClick={() => {
                        router.push(step.href);
                        setIsOpen(false);
                      }}
                      className={cn("w-full text-left px-4 py-3 rounded-xl flex items-center justify-between transition-all group",
                        isActive ? "bg-navy text-white shadow-md" : "hover:bg-navy/5 text-navy/80"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0",
                          isActive ? "bg-white/20 text-white" : "bg-navy/10 text-navy"
                        )}>
                          {idx + 1}
                        </div>
                        <step.icon className={cn("w-4 h-4 shrink-0", isActive ? "text-lime" : "text-navy/40")} />
                        <span className="text-sm font-bold">{step.label}</span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className={cn("text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded",
                          isActive ? "bg-white/10" : "bg-navy/5"
                        )}>
                          {step.role}
                        </div>
                        <ChevronRight className={cn("w-4 h-4 transition-transform",
                          isActive ? "text-white" : "text-navy/20 group-hover:text-navy group-hover:translate-x-1"
                        )} />
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="p-4 border-t border-navy/5 bg-warm/30 text-center shrink-0">
                <p className="text-[10px] font-bold uppercase tracking-widest text-navy/40">Use this panel to instantly teleport between core modules during the hackathon evaluation.</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

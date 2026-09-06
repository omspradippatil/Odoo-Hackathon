"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Settings2, Search, FileText, CheckCircle, Handshake, CreditCard, Truck, Receipt,
  Gavel, Settings, Activity, ShieldCheck, ArrowLeft, ArrowRight, PlayCircle, Radio, Store
} from "lucide-react";
import * as motion from "framer-motion/client";
import { cn } from "@/lib/utils";
import { demoState, getSessionStatus } from "@/lib/demoState";

const JOURNEY_STEPS = [
  { step: 1, label: "Create Requirement", href: "/buyer/requirements/new", icon: Settings2, role: "BUYER", description: "Post structured specifications & requirements" },
  { step: 2, label: "Compare Vendors", href: "/buyer/requirements/REQ-2048/vendors", icon: Search, role: "BUYER", description: "Benchmark matching suppliers on price & trust" },
  { step: 3, label: "Build Quotation", href: "/buyer/requirements/REQ-2048/quotation", icon: FileText, role: "SALES", description: "Model line items, margins & policy thresholds" },
  { step: 4, label: "Approval", href: "/approvals/QT-2048", icon: CheckCircle, role: "MANAGER", description: "Review policy triggers & authorize terms" },
  { step: 5, label: "Negotiation", href: "/negotiation/QT-2048", icon: Handshake, role: "SALES", description: "Manage counter-offers & reapproval triggers" },
  { step: 6, label: "Protected Transaction", href: "/customer/deals/DF-2048/payment", icon: CreditCard, role: "CUSTOMER", description: "Milestone escrow & settlement security" },
  { step: 7, label: "Fulfilment", href: "/operations/fulfilment/DF-2048", icon: Truck, role: "OPS", description: "Warehouse dispatch & tracking logistics" },
  { step: 8, label: "Billing", href: "/operations/billing/DF-2048", icon: Receipt, role: "FINANCE", description: "Tax invoices, ledger sync & reconciliation" },
];

const WORKSPACES = [
  { label: "Admin Control Center", href: "/admin", icon: Settings, role: "ADMIN" },
  { label: "Deal Health Intelligence", href: "/deals/DF-2048/health", icon: Activity, role: "OPS" },
  { label: "Trust Intelligence Profile", href: "/vendors/vertex-systems/trust", icon: ShieldCheck, role: "PUBLIC" },
  { label: "Local Marketplace", href: "/buyer/local", icon: Store, role: "BUYER" },
];

export default function DemoHubPage() {
  const router = useRouter();
  const [liveCount, setLiveCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const sync = () => {
      const sessions = demoState.getBiddingSessions();
      setLiveCount(sessions.filter((s) => getSessionStatus(s) === "LIVE").length);
    };
    sync();
    const unsubscribe = demoState.subscribeBidding(sync);
    const id = setInterval(sync, 5000);
    return () => { unsubscribe(); clearInterval(id); };
  }, []);

  return (
    <div className="min-h-screen bg-warm/30 font-sans text-navy">
      <header className="bg-navy text-white px-4 md:px-8 py-4 sticky top-0 z-30 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 text-sm font-bold hover:opacity-80 transition-opacity">
            <ArrowLeft className="w-4 h-4" /> <span className="hidden sm:inline">Home</span>
          </Link>
          <div className="flex items-center gap-2 font-bold tracking-tight">
            <PlayCircle className="w-5 h-5 text-lime" /> Live Demo
          </div>
          <Link href="/explore" className="text-sm font-bold hover:opacity-80 transition-opacity">
            Explore
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 md:p-8 pb-20">
        <div className="mb-10">
          <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-2">
            DF-2048 • 50 Enterprise Laptops • Vertex Systems
          </div>
          <h1 className="text-3xl lg:text-5xl font-bold tracking-tight mb-3">
            Walk a deal end to end.
          </h1>
          <p className="text-navy/60 font-medium text-lg max-w-2xl">
            Every stage below is a live, clickable workspace running on demo data — no account required.
            Follow the eight steps in order, or jump straight into a live bidding room.
          </p>
        </div>

        {/* LIVE BIDDING CALLOUT */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-navy text-white rounded-3xl p-6 md:p-8 mb-10 shadow-xl"
        >
          <div className="absolute top-0 right-0 w-72 h-72 bg-coral/30 rounded-full blur-3xl pointer-events-none" />
          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-xl">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">New</span>
                {mounted && liveCount > 0 && (
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-coral text-[10px] font-bold uppercase tracking-widest">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" /> {liveCount} room live now
                  </span>
                )}
              </div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2 flex items-center gap-3">
                <Gavel className="w-7 h-7 text-lime shrink-0" /> Live Bidding
              </h2>
              <p className="text-white/70 font-medium leading-relaxed">
                Book a bidding window on the calendar and let verified vendors compete in a live reverse auction.
                The lowest compliant bid when the clock stops wins the deal.
              </p>
            </div>
            <Link
              href="/demo/live-bidding"
              className="shrink-0 inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-lime text-navy font-bold hover:bg-lime/90 transition-all active:scale-95 shadow-lg"
            >
              <Radio className="w-4 h-4" /> Open Bidding Calendar
            </Link>
          </div>
        </motion.div>

        {/* 8-STAGE JOURNEY */}
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-xl font-bold tracking-tight">The 8-stage deal journey</h2>
          <span className="text-[10px] font-bold uppercase tracking-widest text-navy/40">Evaluator fast-track</span>
        </div>

        <div className="grid sm:grid-cols-2 gap-3 mb-12">
          {JOURNEY_STEPS.map((step, i) => (
            <motion.button
              key={step.step}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              onClick={() => router.push(step.href)}
              className="group text-left bg-white rounded-2xl border border-navy/10 p-5 hover:border-cobalt/30 hover:shadow-md transition-all flex items-start gap-4"
            >
              <div className="w-9 h-9 rounded-xl bg-navy/5 text-navy flex items-center justify-center font-bold text-sm shrink-0 group-hover:bg-navy group-hover:text-white transition-colors">
                {step.step}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-bold truncate flex items-center gap-2">
                    <step.icon className="w-4 h-4 text-cobalt shrink-0" />
                    {step.label}
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-navy/5 text-navy/50 shrink-0">
                    {step.role}
                  </span>
                </div>
                <p className="text-xs font-medium text-navy/50 leading-relaxed">{step.description}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-navy/20 group-hover:text-cobalt group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
            </motion.button>
          ))}
        </div>

        {/* WORKSPACES */}
        <div className="mb-4">
          <h2 className="text-xl font-bold tracking-tight">Other workspaces</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {WORKSPACES.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="group bg-white rounded-2xl border border-navy/10 p-5 hover:border-cobalt/30 hover:shadow-md transition-all"
            >
              <item.icon className="w-5 h-5 text-cobalt mb-3" />
              <div className="font-bold text-sm mb-1 leading-tight">{item.label}</div>
              <div className="text-[9px] font-bold uppercase tracking-wider text-navy/40">{item.role}</div>
            </Link>
          ))}
        </div>

        <div className="mt-12 p-6 rounded-3xl bg-white border border-navy/10 text-center">
          <p className="text-sm font-medium text-navy/60 mb-4">
            Prefer to browse before diving in?
          </p>
          <Link
            href="/explore"
            className={cn(
              "inline-flex items-center gap-2 px-6 py-3 rounded-full border border-navy/20 font-bold text-navy",
              "hover:bg-navy/5 transition-colors"
            )}
          >
            Explore the platform <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    </div>
  );
}

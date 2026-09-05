"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { WorkspaceLayout } from "@/components/layout/WorkspaceLayout";
import { UserRole } from "@/types/auth";
import { 
  Activity, CheckCircle2, Clock, MessageSquare, FileText, 
  Send, ShieldCheck, DollarSign, ArrowRight, UserCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityEvent {
  id: string;
  type: "APPROVAL" | "NEGOTIATION" | "QUOTE_SENT" | "ESCROW_RELEASED" | "COUNTER_OFFER";
  dealId: string;
  title: string;
  description: string;
  timestamp: string;
  author: string;
  value?: string;
}

const SAMPLE_ACTIVITIES: ActivityEvent[] = [
  {
    id: "act-1",
    type: "APPROVAL",
    dealId: "DF-2048",
    title: "Manager Approval Granted",
    description: "Vikram Malhotra approved the 12% commercial discount on Business Laptops bundle.",
    timestamp: "10 mins ago",
    author: "Vikram Malhotra (Sales Manager)",
    value: "₹18.40 L"
  },
  {
    id: "act-2",
    type: "COUNTER_OFFER",
    dealId: "DF-1990",
    title: "Counter-Offer Received from Buyer",
    description: "Apex Logistics requested a 4% reduction on ABB VFD motor drives.",
    timestamp: "1 hour ago",
    author: "Sunil Kulkarni (Buyer)",
    value: "₹1.55 L"
  },
  {
    id: "act-3",
    type: "QUOTE_SENT",
    dealId: "DF-2055",
    title: "Official Proposal Transmitted",
    description: "QT-2055 with standard 30-day payment term dispatched to Zenith Tools.",
    timestamp: "3 hours ago",
    author: "Sneha Patel (Sales Rep)",
    value: "₹9.68 L"
  },
  {
    id: "act-4",
    type: "ESCROW_RELEASED",
    dealId: "DF-1985",
    title: "Escrow Milestone Settled",
    description: "Delivery verification signed off. Axis Bank escrow payout released to Tata Steel.",
    timestamp: "Yesterday, 4:30 PM",
    author: "Anita Roy (Finance Operations)",
    value: "₹28.91 L"
  }
];

export default function SalesActivityPage() {
  const router = useRouter();

  return (
    <WorkspaceLayout role={UserRole.SALES_REP}>
      <div className="max-w-4xl mx-auto space-y-8 pb-16">
        
        {/* HEADER */}
        <div>
          <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-1">Sales Workspace</div>
          <h1 className="text-3xl lg:text-4xl font-bold text-navy tracking-tight mb-2">Commercial Activity Stream</h1>
          <p className="text-navy/60 font-medium text-sm md:text-base">
            Real-time chronological events across quotations, counter-offers, manager approvals, and customer milestones.
          </p>
        </div>

        {/* TIMELINE */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-navy/5 shadow-sm space-y-8">
          {SAMPLE_ACTIVITIES.map((act, index) => (
            <div key={act.id} className="flex gap-4 relative">
              {index !== SAMPLE_ACTIVITIES.length - 1 && (
                <div className="absolute left-5 top-10 bottom-[-32px] w-[2px] bg-navy/5" />
              )}

              <div className="w-10 h-10 rounded-2xl bg-navy/5 flex items-center justify-center shrink-0 z-10">
                {act.type === "APPROVAL" && <CheckCircle2 className="w-5 h-5 text-lime-700" />}
                {act.type === "COUNTER_OFFER" && <MessageSquare className="w-5 h-5 text-amber-600" />}
                {act.type === "QUOTE_SENT" && <Send className="w-5 h-5 text-cobalt" />}
                {act.type === "ESCROW_RELEASED" && <DollarSign className="w-5 h-5 text-emerald-600" />}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-navy text-base">{act.title}</span>
                    <span className="text-xs font-bold text-cobalt bg-cobalt/10 px-2 py-0.5 rounded">
                      {act.dealId}
                    </span>
                  </div>
                  <span className="text-xs text-navy/40 font-medium">{act.timestamp}</span>
                </div>

                <p className="text-sm text-navy/70 font-medium leading-relaxed">
                  {act.description}
                </p>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-navy/50 font-semibold">
                    {act.author}
                  </span>
                  {act.value && (
                    <span className="text-xs font-bold text-navy bg-navy/5 px-2.5 py-1 rounded-lg">
                      Deal: {act.value}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </WorkspaceLayout>
  );
}
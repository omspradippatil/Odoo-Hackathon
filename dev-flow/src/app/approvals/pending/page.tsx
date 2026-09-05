"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { WorkspaceLayout } from "@/components/layout/WorkspaceLayout";
import { UserRole } from "@/types/auth";
import { 
  ShieldCheck, CheckCircle2, XCircle, AlertTriangle, ArrowRight, 
  Eye, FileText, UserCheck, DollarSign, Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PendingApproval {
  id: string;
  quotationRef: string;
  dealId: string;
  customerName: string;
  salesRep: string;
  amount: number;
  discountPercent: number;
  triggerReason: string;
  submittedTime: string;
}

const SAMPLE_PENDING: PendingApproval[] = [
  {
    id: "appr-1",
    quotationRef: "QT-2048",
    dealId: "DF-2048",
    customerName: "Nova Retail Innovations",
    salesRep: "Rahul Verma",
    amount: 1840000,
    discountPercent: 12.5,
    triggerReason: "Discount exceeds standard 10% commercial policy floor",
    submittedTime: "25 mins ago"
  },
  {
    id: "appr-2",
    quotationRef: "QT-1990",
    dealId: "DF-1990",
    customerName: "Apex Logistics India",
    salesRep: "Rahul Verma",
    amount: 155000,
    discountPercent: 8.0,
    triggerReason: "Custom Escrow Milestone structure requested by buyer",
    submittedTime: "1 hour ago"
  },
  {
    id: "appr-3",
    quotationRef: "QT-2104",
    dealId: "DF-2104",
    customerName: "Kirloskar Power Components",
    salesRep: "Priya Sharma",
    amount: 3681600,
    discountPercent: 6.5,
    triggerReason: "High-value commercial threshold (> ₹25 Lakhs) trigger",
    submittedTime: "3 hours ago"
  }
];

export default function PendingApprovalsPage() {
  const router = useRouter();
  const [approvals, setApprovals] = useState(SAMPLE_PENDING);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const handleAction = (quotationRef: string, action: "APPROVED" | "REJECTED") => {
    setApprovals(approvals.filter(a => a.quotationRef !== quotationRef));
    setActionSuccess("Quotation " + quotationRef + " successfully " + action.toLowerCase() + "!");
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const formatINR = (val: number) => {
    if (val >= 100000) return "₹" + (val / 100000).toFixed(2) + " L";
    return "₹" + val.toLocaleString("en-IN");
  };

  return (
    <WorkspaceLayout role={UserRole.SALES_MANAGER}>
      <div className="space-y-6 md:space-y-8 pb-16">
        
        {/* HEADER */}
        <div>
          <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-1">Governance Queue</div>
          <h1 className="text-3xl lg:text-4xl font-bold text-navy tracking-tight mb-2">Pending Approvals</h1>
          <p className="text-navy/60 font-medium text-sm md:text-base">
            Review commercial margin exceptions, payment term variations, and enterprise contract releases.
          </p>
        </div>

        {actionSuccess && (
          <div className="p-4 bg-lime/20 border border-lime/30 rounded-2xl flex items-center gap-3 text-lime-950 font-semibold text-sm">
            <CheckCircle2 className="w-5 h-5 text-lime-700 shrink-0" />
            {actionSuccess}
          </div>
        )}

        {/* METRICS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-navy/5 shadow-sm">
            <div className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1">AWAITING DECISION</div>
            <div className="text-2xl font-bold text-amber-600">{approvals.length} Quotations</div>
            <div className="text-xs text-navy/60 mt-1 font-medium">Average review turnaround: 18 mins</div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-navy/5 shadow-sm">
            <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-1">TOTAL QUEUE VALUE</div>
            <div className="text-2xl font-bold text-navy">
              {formatINR(approvals.reduce((a, b) => a + b.amount, 0))}
            </div>
            <div className="text-xs text-navy/60 mt-1 font-medium">Across all sales reps</div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-navy/5 shadow-sm">
            <div className="text-[10px] font-bold text-lime-700 uppercase tracking-widest mb-1">APPROVED THIS WEEK</div>
            <div className="text-2xl font-bold text-lime-700">₹1.42 Cr</div>
            <div className="text-xs text-navy/60 mt-1 font-medium">94% healthy deal health ratio</div>
          </div>
        </div>

        {/* APPROVALS CARDS */}
        <div className="space-y-4">
          {approvals.length === 0 ? (
            <div className="p-12 bg-white rounded-3xl border border-navy/5 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-lime-600 mx-auto" />
              <h3 className="text-lg font-bold text-navy">All Caught Up!</h3>
              <p className="text-sm text-navy/60">No pending commercial exceptions in your queue.</p>
            </div>
          ) : (
            approvals.map((appr) => (
              <div 
                key={appr.id}
                className="bg-white p-6 rounded-3xl border border-navy/5 shadow-sm space-y-4"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-cobalt bg-cobalt/10 px-2.5 py-1 rounded text-xs">
                        {appr.quotationRef}
                      </span>
                      <span className="text-xs font-semibold text-navy/40">
                        Deal: {appr.dealId}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-widest bg-amber-500/15 text-amber-900 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-700" /> {appr.submittedTime}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-navy">
                      {appr.customerName}
                    </h3>

                    <div className="text-xs text-navy/60 font-medium">
                      Submitted by: <strong className="text-navy">{appr.salesRep}</strong> • Discount: <strong className="text-amber-800">{appr.discountPercent}%</strong>
                    </div>
                  </div>

                  <div className="text-left lg:text-right">
                    <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest">QUOTE VALUE</div>
                    <div className="text-2xl font-bold text-navy">{formatINR(appr.amount)}</div>
                  </div>
                </div>

                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center gap-2 text-xs font-semibold text-amber-950">
                  <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Exception Trigger: {appr.triggerReason}</span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-navy/5">
                  <button
                    onClick={() => router.push("/approvals/" + appr.quotationRef)}
                    className="text-xs font-bold text-cobalt hover:text-navy transition-colors flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" /> Full Audit & Margin Breakdown
                  </button>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleAction(appr.quotationRef, "REJECTED")}
                      className="px-4 py-2 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors flex items-center gap-1.5"
                    >
                      <XCircle className="w-4 h-4" /> Reject & Counter
                    </button>
                    <button
                      onClick={() => handleAction(appr.quotationRef, "APPROVED")}
                      className="px-5 py-2 text-xs font-bold text-white bg-navy hover:bg-navy/90 rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      <CheckCircle2 className="w-4 h-4 text-lime-400" /> 1-Click Approve
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </WorkspaceLayout>
  );
}
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { WorkspaceLayout } from "@/components/layout/WorkspaceLayout";
import { UserRole } from "@/types/auth";
import { 
  FileText, Search, Filter, Download, Plus, ArrowRight, CheckCircle2, 
  Clock, AlertCircle, Calendar, DollarSign, Building2, ChevronRight, Eye
} from "lucide-react";
import * as motion from "framer-motion/client";
import { cn } from "@/lib/utils";

interface BillingRecord {
  id: string;
  invoiceNumber: string;
  dealId: string;
  customerName: string;
  billingType: "ONE_TIME" | "RECURRING";
  subtotal: number;
  taxTotal: number;
  grandTotal: number;
  status: "PAID" | "ISSUED" | "PARTIALLY_PAID" | "OVERDUE";
  issueDate: string;
  dueDate: string;
  quotationRef: string;
}

const SAMPLE_INVOICES: BillingRecord[] = [
  {
    id: "inv-1",
    invoiceNumber: "INV-2026-048",
    dealId: "DF-2048",
    customerName: "Nova Retail Innovations",
    billingType: "ONE_TIME",
    subtotal: 1559322,
    taxTotal: 280678,
    grandTotal: 1840000,
    status: "ISSUED",
    issueDate: "2026-08-28",
    dueDate: "2026-09-12",
    quotationRef: "QT-2048"
  },
  {
    id: "inv-2",
    invoiceNumber: "INV-2026-042",
    dealId: "DF-1985",
    customerName: "Bharat Heavy Forge Corp",
    billingType: "ONE_TIME",
    subtotal: 2450000,
    taxTotal: 441000,
    grandTotal: 2891000,
    status: "PAID",
    issueDate: "2026-08-15",
    dueDate: "2026-08-30",
    quotationRef: "QT-1985"
  },
  {
    id: "inv-3",
    invoiceNumber: "INV-2026-039",
    dealId: "DF-1990",
    customerName: "Apex Logistics India Pvt Ltd",
    billingType: "RECURRING",
    subtotal: 131355,
    taxTotal: 23645,
    grandTotal: 155000,
    status: "PAID",
    issueDate: "2026-08-01",
    dueDate: "2026-08-15",
    quotationRef: "QT-1990"
  },
  {
    id: "inv-4",
    invoiceNumber: "INV-2026-051",
    dealId: "DF-2055",
    customerName: "Zenith Precision Tools",
    billingType: "ONE_TIME",
    subtotal: 820000,
    taxTotal: 147600,
    grandTotal: 967600,
    status: "PARTIALLY_PAID",
    issueDate: "2026-08-22",
    dueDate: "2026-09-05",
    quotationRef: "QT-2055"
  },
  {
    id: "inv-5",
    invoiceNumber: "INV-2026-055",
    dealId: "DF-2104",
    customerName: "Kirloskar Power Components",
    billingType: "ONE_TIME",
    subtotal: 3120000,
    taxTotal: 561600,
    grandTotal: 3681600,
    status: "ISSUED",
    issueDate: "2026-09-01",
    dueDate: "2026-09-15",
    quotationRef: "QT-2104"
  },
  {
    id: "inv-6",
    invoiceNumber: "INV-2026-031",
    dealId: "DF-1940",
    customerName: "Siemens Partner Engineering",
    billingType: "RECURRING",
    subtotal: 211864,
    taxTotal: 38136,
    grandTotal: 250000,
    status: "PAID",
    issueDate: "2026-07-15",
    dueDate: "2026-07-30",
    quotationRef: "QT-1940"
  }
];

export default function BillingListPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");

  const filteredInvoices = SAMPLE_INVOICES.filter((inv) => {
    const matchesSearch = 
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.dealId.toLowerCase().includes(search.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === "ALL" || inv.status === statusFilter;
    const matchesType = typeFilter === "ALL" || inv.billingType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const totalInvoiced = SAMPLE_INVOICES.reduce((acc, curr) => acc + curr.grandTotal, 0);
  const totalPaid = SAMPLE_INVOICES.filter(i => i.status === "PAID").reduce((acc, curr) => acc + curr.grandTotal, 0);
  const awaitingPayment = totalInvoiced - totalPaid;

  const formatINR = (val: number) => {
    if (val >= 10000000) return "₹" + (val / 10000000).toFixed(2) + " Cr";
    if (val >= 100000) return "₹" + (val / 100000).toFixed(2) + " L";
    return "₹" + val.toLocaleString("en-IN");
  };

  return (
    <WorkspaceLayout role={UserRole.FINANCE_OPERATIONS}>
      <div className="space-y-6 md:space-y-8 pb-16">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-1">Operations Workspace</div>
            <h1 className="text-3xl lg:text-4xl font-bold text-navy tracking-tight mb-2">Billing & Invoices</h1>
            <p className="text-navy/60 font-medium text-sm md:text-base">
              Monitor customer invoices, GST tax schedules, and recurring billing cycles.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => alert("Exporting all billing statements to CSV...")} 
              className="px-4 py-2.5 rounded-xl font-bold text-navy bg-white border border-navy/10 shadow-sm hover:bg-navy/5 transition-colors text-sm flex items-center gap-2"
            >
              <Download className="w-4 h-4" /> Export CSV
            </button>
            <button 
              onClick={() => router.push("/operations/billing/DF-2048")} 
              className="px-5 py-2.5 rounded-xl font-bold text-white bg-navy shadow-lg shadow-navy/20 hover:bg-navy/90 transition-all text-sm flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> New Invoice
            </button>
          </div>
        </div>

        {/* METRICS ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-navy/5 shadow-sm">
            <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-1">TOTAL INVOICED</div>
            <div className="text-2xl font-bold text-navy">{formatINR(totalInvoiced)}</div>
            <div className="text-xs text-navy/60 mt-1 font-medium">6 verified deal contracts</div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-navy/5 shadow-sm">
            <div className="text-[10px] font-bold text-lime-700 uppercase tracking-widest mb-1">COLLECTED / PAID</div>
            <div className="text-2xl font-bold text-lime-700">{formatINR(totalPaid)}</div>
            <div className="text-xs text-navy/60 mt-1 font-medium">Funds settled to Escrow</div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-navy/5 shadow-sm">
            <div className="text-[10px] font-bold text-orange-600 uppercase tracking-widest mb-1">AWAITING PAYMENT</div>
            <div className="text-2xl font-bold text-orange-600">{formatINR(awaitingPayment)}</div>
            <div className="text-xs text-navy/60 mt-1 font-medium">Within standard 15-day Net</div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-navy/5 shadow-sm">
            <div className="text-[10px] font-bold text-cobalt uppercase tracking-widest mb-1">RECURRING MRR</div>
            <div className="text-2xl font-bold text-cobalt">₹4.05 L</div>
            <div className="text-xs text-navy/60 mt-1 font-medium">2 active SaaS maintenance plans</div>
          </div>
        </div>

        {/* SEARCH AND FILTERS */}
        <div className="bg-white rounded-2xl p-4 border border-navy/5 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-navy/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search invoice number, deal ref, or customer..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-navy/5 rounded-xl text-sm font-medium text-navy placeholder:text-navy/40 focus:outline-none focus:ring-2 focus:ring-navy/20"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <div className="flex bg-navy/5 p-1 rounded-xl text-xs font-bold">
              {["ALL", "PAID", "ISSUED", "PARTIALLY_PAID"].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg transition-colors",
                    statusFilter === st ? "bg-white text-navy shadow-xs" : "text-navy/60 hover:text-navy"
                  )}
                >
                  {st.replace("_", " ")}
                </button>
              ))}
            </div>

            <select 
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 bg-navy/5 text-navy font-bold text-xs rounded-xl focus:outline-none"
            >
              <option value="ALL">All Types</option>
              <option value="ONE_TIME">One-Time</option>
              <option value="RECURRING">Recurring</option>
            </select>
          </div>
        </div>

        {/* INVOICES TABLE */}
        <div className="bg-white rounded-3xl border border-navy/5 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-navy/5 bg-navy/[0.02] text-[10px] font-bold uppercase tracking-wider text-navy/50">
                  <th className="py-4 px-6">Invoice #</th>
                  <th className="py-4 px-6">Deal Ref</th>
                  <th className="py-4 px-6">Customer</th>
                  <th className="py-4 px-6">Billing Type</th>
                  <th className="py-4 px-6 text-right">Amount (Inc. GST)</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Due Date</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy/5 text-sm">
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-navy/[0.015] transition-colors group">
                    <td className="py-4 px-6 font-bold text-navy flex items-center gap-2">
                      <FileText className="w-4 h-4 text-navy/40" />
                      {inv.invoiceNumber}
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-bold text-cobalt bg-cobalt/10 px-2 py-0.5 rounded text-xs">
                        {inv.dealId}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-semibold text-navy">
                      {inv.customerName}
                    </td>
                    <td className="py-4 px-6">
                      <span className={cn(
                        "text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full",
                        inv.billingType === "ONE_TIME" ? "bg-navy/10 text-navy" : "bg-cobalt/15 text-cobalt"
                      )}>
                        {inv.billingType.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-bold text-navy text-right">
                      {formatINR(inv.grandTotal)}
                    </td>
                    <td className="py-4 px-6">
                      <span className={cn(
                        "text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full inline-flex items-center gap-1",
                        inv.status === "PAID" && "bg-lime/20 text-lime-900 border border-lime/30",
                        inv.status === "ISSUED" && "bg-amber-500/15 text-amber-900 border border-amber-500/30",
                        inv.status === "PARTIALLY_PAID" && "bg-blue-500/15 text-blue-900 border border-blue-500/30"
                      )}>
                        {inv.status === "PAID" && <CheckCircle2 className="w-3 h-3 text-lime-700" />}
                        {inv.status === "ISSUED" && <Clock className="w-3 h-3 text-amber-700" />}
                        {inv.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-navy/60 font-medium text-xs">
                      {inv.dueDate}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => router.push("/operations/billing/" + inv.dealId)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-cobalt hover:text-navy transition-colors bg-cobalt/5 hover:bg-cobalt/10 px-3 py-1.5 rounded-lg"
                      >
                        <Eye className="w-3.5 h-3.5" /> View Deal <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </WorkspaceLayout>
  );
}
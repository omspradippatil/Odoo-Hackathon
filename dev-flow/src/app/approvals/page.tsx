"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { WorkspaceLayout } from "@/components/layout/WorkspaceLayout";
import { UserRole } from "@/types/auth";
import { ApprovalRequest } from "@/types/approval";
import { Search, Filter, AlertCircle, Clock, ArrowRight, ShieldCheck, TrendingDown } from "lucide-react";
import { Pagination } from "@/components/ui/shared/Pagination";
import { cn } from "@/lib/utils";

// --- MOCK DATA ---
const MOCK_APPROVALS: ApprovalRequest[] = [
  {
    id: "APR-9912", quotationId: "QT-2048", quotationTitle: "NOVA RETAIL EXPANSION",
    requestedBy: "Aditi Shah", requesterRole: "Sales Rep",
    status: "PENDING", priority: "HIGH", submittedAt: "Today, 4:12 PM", waitingTime: "18 minutes",
    dealValue: 840000, requestedDiscountPercent: 12, marginPercent: 18,
    triggers: [{ type: 'DISCOUNT', currentValue: '12%', threshold: '5%', reason: 'Discount exceeds Sales Rep authority' }],
    approvalSteps: [], history: []
  },
  {
    id: "APR-9910", quotationId: "QT-1092", quotationTitle: "TECHCORP Q3 INFRA",
    requestedBy: "Rahul Mehta", requesterRole: "Senior Sales Rep",
    status: "PENDING", priority: "MEDIUM", submittedAt: "Today, 2:30 PM", waitingTime: "2 hours",
    dealValue: 2450000, requestedDiscountPercent: 8, marginPercent: 12,
    triggers: [{ type: 'MARGIN', currentValue: '12%', threshold: '15%', reason: 'Margin below standard threshold for this category' }],
    approvalSteps: [], history: []
  },
  {
    id: "APR-9884", quotationId: "QT-0941", quotationTitle: "GLOBAL LOGISTICS FLEET",
    requestedBy: "Karan Singh", requesterRole: "Sales Rep",
    status: "ESCALATED", priority: "HIGH", submittedAt: "Yesterday, 11:15 AM", waitingTime: "1 day",
    dealValue: 12500000, requestedDiscountPercent: 18, marginPercent: 14,
    triggers: [{ type: 'DISCOUNT', currentValue: '18%', threshold: '12%', reason: 'Requires Commercial Head approval' }],
    approvalSteps: [], history: []
  }
];

export default function ApprovalCenterPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Pending');
  const [currentPage, setCurrentPage] = useState(1);
  
  const TABS = ['Pending', 'Approved', 'Rejected', 'Sent Back', 'Escalated', 'All'];

  return (
    <WorkspaceLayout role={UserRole.SALES_MANAGER}>
      
      {/* HEADER */}
      <div className="mb-8 md:mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-navy tracking-tight mb-2">Approval Center</h1>
            <p className="text-navy/60 font-medium text-lg max-w-2xl">
              Review the deals that need your commercial decision.
            </p>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-white p-4 rounded-2xl border border-navy/5 shadow-sm text-center min-w-[100px]">
              <div className="text-2xl font-bold text-navy">5</div>
              <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mt-1">Awaiting</div>
            </div>
            <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 shadow-sm text-center min-w-[100px]">
              <div className="text-2xl font-bold text-orange-600">2</div>
              <div className="text-[10px] font-bold text-orange-600/60 uppercase tracking-widest mt-1">High Priority</div>
            </div>
            <div className="bg-coral/5 p-4 rounded-2xl border border-coral/10 shadow-sm text-center min-w-[100px]">
              <div className="text-2xl font-bold text-coral">1</div>
              <div className="text-[10px] font-bold text-coral/60 uppercase tracking-widest mt-1">Escalated</div>
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="flex overflow-x-auto no-scrollbar border-b border-navy/10">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
              className={cn(
                "px-6 py-4 text-sm font-bold whitespace-nowrap transition-colors relative",
                activeTab === tab ? "text-cobalt" : "text-navy/50 hover:text-navy"
              )}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cobalt rounded-t-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* FILTERS & SEARCH */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-8">
        <div className="relative w-full sm:flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-navy/40" />
          <input type="text" placeholder="Search quotation, customer, requester..." className="w-full h-12 pl-10 pr-4 rounded-xl bg-white border border-navy/10 focus:outline-none focus:border-cobalt font-medium text-sm shadow-sm" />
        </div>
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar">
          <button className="h-12 px-4 bg-white border border-navy/10 rounded-xl text-sm font-bold text-navy flex items-center gap-2 shadow-sm whitespace-nowrap hover:bg-navy/5"><Filter className="w-4 h-4" /> Filters</button>
          <select className="h-12 px-4 bg-white border border-navy/10 rounded-xl text-sm font-bold text-navy shadow-sm focus:outline-none focus:border-cobalt">
            <option>Highest Priority</option>
            <option>Newest</option>
            <option>Highest Deal Value</option>
            <option>Largest Discount</option>
            <option>Lowest Margin</option>
          </select>
        </div>
      </div>

      {/* APPROVAL LIST */}
      <div className="space-y-4 mb-8">
        {MOCK_APPROVALS.filter(a => activeTab === 'All' || a.status === activeTab.toUpperCase() || (activeTab === 'Pending' && a.status === 'PENDING') || (activeTab === 'Escalated' && a.status === 'ESCALATED')).map(approval => (
          <div key={approval.id} className="bg-white p-6 rounded-3xl border border-navy/10 shadow-sm hover:shadow-md transition-all group">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  {approval.priority === 'HIGH' && <span className="bg-orange-100 text-orange-700 px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-widest flex items-center gap-1"><AlertCircle className="w-3 h-3" /> High Priority</span>}
                  {approval.status === 'ESCALATED' && <span className="bg-coral/10 text-coral px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-widest">Escalated</span>}
                  <span className="text-[10px] font-bold text-navy/40 uppercase tracking-widest">{approval.quotationId}</span>
                </div>
                
                <div>
                  <h2 className="text-xl font-bold text-navy mb-1">{approval.quotationTitle}</h2>
                  <div className="text-sm font-medium text-navy/60">Requested by <strong className="text-navy">{approval.requestedBy}</strong> • {approval.submittedAt}</div>
                </div>

                <div className="bg-navy/5 rounded-xl p-4 inline-flex flex-wrap gap-x-8 gap-y-4">
                  <div>
                    <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-1">Deal Value</div>
                    <div className="font-bold text-navy">₹{(approval.dealValue / 100000).toFixed(2)}L</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-1">Req. Discount</div>
                    <div className="font-bold text-orange-600 flex items-center gap-1"><TrendingDown className="w-3 h-3" /> {approval.requestedDiscountPercent}%</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-1">Est. Margin</div>
                    <div className="font-bold text-navy">{approval.marginPercent}%</div>
                  </div>
                </div>
                
                <div className="text-sm font-medium text-navy/60 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-orange-500" />
                  <strong className="text-navy">Reason:</strong> {approval.triggers[0].reason}
                </div>
              </div>

              <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-4 shrink-0 border-t md:border-t-0 md:border-l border-navy/10 pt-4 md:pt-0 md:pl-6">
                <div className="flex items-center gap-1.5 text-orange-600 bg-orange-50 px-3 py-1.5 rounded-lg text-xs font-bold border border-orange-100">
                  <Clock className="w-3.5 h-3.5" /> Waiting: {approval.waitingTime}
                </div>
                <button 
                  onClick={() => router.push(`/approvals/${approval.quotationId}`)}
                  className="px-6 py-3 rounded-xl bg-navy text-white text-sm font-bold shadow-lg shadow-navy/20 hover:bg-navy/90 transition-colors flex items-center gap-2 mt-auto"
                >
                  Review Approval <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>
        ))}
        {MOCK_APPROVALS.length === 0 && (
          <div className="py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-lime/20 text-lime-800 flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-navy mb-2">You're all caught up!</h3>
            <p className="text-navy/60 font-medium">No deals currently need your approval.</p>
          </div>
        )}
      </div>

      {/* REUSABLE PAGINATION */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-navy/10">
        <div className="text-xs font-bold text-navy/40 uppercase tracking-widest">
          Showing 1–3 of 24 approvals
        </div>
        <Pagination currentPage={currentPage} totalPages={8} onPageChange={setCurrentPage} />
      </div>

    </WorkspaceLayout>
  );
}

"use client";

import React, { useState, use } from "react";
import { useRouter } from "next/navigation";
import { WorkspaceLayout } from "@/components/layout/WorkspaceLayout";
import { UserRole } from "@/types/auth";
import { ArrowRight, Check, ShieldCheck, Activity, X, TrendingDown, Clock, MessageSquare, AlertCircle, FileText } from "lucide-react";
import * as motion from "framer-motion/client";
import { AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const formatCurrency = (val: number) => `₹${val.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

export default function ApprovalDetailPage({ params }: { params: Promise<{ quotationId: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();

  const [status, setStatus] = useState<'PENDING' | 'APPROVED' | 'REJECTED' | 'SENT_BACK'>('PENDING');
  const [modalType, setModalType] = useState<'APPROVE' | 'REJECT' | 'SEND_BACK' | null>(null);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStatus(modalType === 'APPROVE' ? 'APPROVED' : modalType === 'REJECT' ? 'REJECTED' : 'SENT_BACK');
      setModalType(null);
    }, 800);
  };

  const isApproved = status === 'APPROVED';

  return (
    <WorkspaceLayout role={UserRole.SALES_MANAGER}>
      
      {/* JOURNEY HEADER */}
      <div className="mb-8 md:mb-12">
        <div className="flex items-center gap-2 text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-4">
          <span className="cursor-pointer hover:text-navy" onClick={() => router.push('/approvals')}>Approvals</span> <span className="text-navy/20">/</span> <span className="text-navy">{resolvedParams.quotationId}</span>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-navy tracking-tight mb-2">Approval Request</h1>
            <h2 className="text-lg font-bold text-navy/60 uppercase tracking-widest">Nova Retail Expansion</h2>
          </div>
          
          <div className="flex flex-col items-start md:items-end gap-1">
            <div className={cn("px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 border", 
              isApproved ? "bg-lime/20 text-lime-800 border-lime/30" : 
              status === 'REJECTED' ? "bg-coral/10 text-coral border-coral/20" :
              status === 'SENT_BACK' ? "bg-orange-100 text-orange-700 border-orange-200" :
              "bg-orange-500 text-white border-orange-600 shadow-md shadow-orange-500/20"
            )}>
              {isApproved ? <Check className="w-3 h-3" /> : status === 'PENDING' ? <Activity className="w-3 h-3" /> : <X className="w-3 h-3" />}
              {status === 'PENDING' ? 'PENDING YOUR APPROVAL' : status.replace('_', ' ')}
            </div>
            {status === 'PENDING' && <div className="text-xs font-bold text-navy/40">Waiting 18 minutes</div>}
          </div>
        </div>

        {/* SIGNATURE MOTION LINE */}
        <div className="w-full bg-white p-4 rounded-2xl border border-navy/5 shadow-sm overflow-x-auto no-scrollbar">
          <div className="flex items-center min-w-[700px] justify-between relative px-4">
            <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-[2px] bg-navy/5 -z-10" />
            
            <motion.div 
              className={cn("absolute left-[40%] top-1/2 -translate-y-1/2 h-[2px]", isApproved ? "bg-lime" : status === 'PENDING' ? "bg-orange-500" : "bg-coral")}
              initial={{ width: 0 }} animate={{ width: isApproved ? "20%" : "10%" }} transition={{ duration: 1 }}
            />

            {[
              { id: 'REQUEST', label: 'REQUEST', state: 'done' },
              { id: 'DISCOVER', label: 'DISCOVER', state: 'done' },
              { id: 'QUOTE', label: 'QUOTE', state: 'done' },
              { id: 'APPROVE', label: 'APPROVE', state: isApproved ? 'done' : status === 'PENDING' ? 'active' : 'rejected' },
              { id: 'NEGOTIATE', label: 'NEGOTIATE', state: isApproved ? 'next' : 'idle' },
              { id: 'PROTECT', label: 'PROTECT', state: 'idle' },
              { id: 'FULFIL', label: 'FULFIL', state: 'idle' },
              { id: 'BILL', label: 'BILL', state: 'idle' },
            ].map((stage, i) => (
              <div key={stage.id} className="flex flex-col items-center gap-2 bg-white px-2 z-10 relative">
                <div className={cn("w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all", 
                  stage.state === 'done' ? "border-lime bg-lime" :
                  stage.state === 'active' ? "border-orange-500 bg-white shadow-[0_0_10px_rgba(249,115,22,0.4)]" : 
                  stage.state === 'rejected' ? "border-coral bg-white" :
                  stage.state === 'next' ? "border-navy bg-white" : "border-navy/10 bg-white")}>
                  {stage.state === 'done' && <Check className="w-2.5 h-2.5 text-lime-950" />}
                  {stage.state === 'active' && <motion.div layoutId="flow-dot" className="w-1.5 h-1.5 bg-orange-500 rounded-full" />}
                  {stage.state === 'rejected' && <X className="w-2.5 h-2.5 text-coral" />}
                </div>
                <span className={cn("text-[9px] font-bold uppercase tracking-widest", 
                  stage.state === 'active' ? "text-orange-600" : 
                  stage.state === 'done' ? "text-lime-700" : 
                  stage.state === 'rejected' ? "text-coral" :
                  stage.state === 'next' ? "text-navy" : "text-navy/30")}>
                  {stage.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start relative">
        
        {/* LEFT COLUMN - MAIN AREA */}
        <div className="w-full lg:w-[70%] space-y-8 pb-32 lg:pb-0">
          
          {/* WHY APPROVAL IS REQUIRED */}
          <div className="bg-orange-50 border border-orange-200 rounded-3xl overflow-hidden shadow-sm">
            <div className="bg-orange-500 text-white p-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
              <AlertCircle className="w-4 h-4" /> Why this needs approval
            </div>
            <div className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1 text-center md:text-left">
                <div className="text-[10px] font-bold text-orange-600/70 uppercase tracking-widest mb-1">Requested Discount</div>
                <div className="text-4xl font-bold text-orange-600 flex items-center justify-center md:justify-start gap-2"><TrendingDown className="w-6 h-6" /> 12%</div>
              </div>
              <div className="hidden md:block w-[1px] h-16 bg-orange-200" />
              <div className="flex-1 text-center">
                <div className="text-[10px] font-bold text-orange-600/70 uppercase tracking-widest mb-1">Sales Rep Authority</div>
                <div className="text-2xl font-bold text-navy">Up to 5%</div>
              </div>
              <div className="hidden md:block w-[1px] h-16 bg-orange-200" />
              <div className="flex-1 text-center md:text-right">
                <div className="text-[10px] font-bold text-orange-600/70 uppercase tracking-widest mb-1">Difference</div>
                <div className="text-2xl font-bold text-coral">+ 7%</div>
              </div>
            </div>
            <div className="bg-white/50 border-t border-orange-100 p-4 text-center text-xs font-bold text-orange-800 uppercase tracking-widest">
              Sales Manager Approval Required
            </div>
          </div>

          {/* BEFORE VS AFTER IMPACT */}
          <div className="bg-white rounded-3xl border border-navy/10 shadow-sm p-6 md:p-8">
            <h2 className="text-sm font-bold text-navy uppercase tracking-widest mb-6">Commercial Impact</h2>
            
            <div className="flex flex-col md:flex-row relative">
              {/* BEFORE */}
              <div className="flex-1 p-6 bg-navy/5 rounded-2xl flex flex-col justify-center border border-navy/5">
                <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-4">Before Discount</div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center"><span className="text-sm font-medium text-navy/60">Deal Value</span><span className="font-bold text-navy">₹9,54,000</span></div>
                  <div className="flex justify-between items-center"><span className="text-sm font-medium text-navy/60">Margin</span><span className="font-bold text-navy">₹2,10,000</span></div>
                  <div className="flex justify-between items-center pt-2 border-t border-navy/10"><span className="text-sm font-medium text-navy/60">Margin %</span><span className="font-bold text-navy">22%</span></div>
                </div>
              </div>

              {/* ARROW */}
              <div className="flex items-center justify-center py-4 md:py-0 md:px-4 shrink-0">
                <ArrowRight className="w-6 h-6 text-navy/20 rotate-90 md:rotate-0" />
              </div>

              {/* REQUESTED */}
              <div className="flex-1 p-6 bg-white border border-cobalt/20 rounded-2xl shadow-md flex flex-col justify-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-cobalt/10 rounded-full blur-2xl pointer-events-none" />
                <div className="text-[10px] font-bold text-cobalt uppercase tracking-widest mb-4 relative z-10">Requested Deal</div>
                <div className="space-y-4 relative z-10">
                  <div className="flex justify-between items-center"><span className="text-sm font-medium text-navy/60">Deal Value</span><span className="font-bold text-navy">₹8,40,000</span></div>
                  <div className="flex justify-between items-center"><span className="text-sm font-medium text-navy/60">Margin</span><span className="font-bold text-navy">₹1,51,000</span></div>
                  <div className="flex justify-between items-center pt-2 border-t border-navy/5"><span className="text-sm font-medium text-navy/60">Margin %</span><span className="font-bold text-navy">18%</span></div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-4 bg-coral/5 p-4 rounded-xl border border-coral/10">
              <div className="text-[10px] font-bold text-coral uppercase tracking-widest flex items-center gap-2 sm:w-1/4">
                <Activity className="w-4 h-4" /> Impact
              </div>
              <div className="flex flex-1 justify-between items-center text-sm">
                <span className="font-medium text-coral/80">Revenue Change</span>
                <span className="font-bold text-coral">− ₹1,14,000</span>
              </div>
              <div className="hidden sm:block w-[1px] h-6 bg-coral/20" />
              <div className="flex flex-1 justify-between items-center text-sm">
                <span className="font-medium text-coral/80">Margin Change</span>
                <span className="font-bold text-coral">− ₹59,000</span>
              </div>
            </div>
          </div>

          {/* QUOTATION SUMMARY & SOURCING */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl border border-navy/10 shadow-sm p-6">
              <h2 className="text-xs font-bold text-navy uppercase tracking-widest mb-4 flex items-center gap-2"><FileText className="w-4 h-4 text-cobalt" /> Quotation Summary</h2>
              <div className="space-y-4">
                <div>
                  <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest">Customer</div>
                  <div className="font-bold text-navy text-sm mt-0.5">Nova Retail (GST: 27XXXXXX)</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest">Items</div>
                  <ul className="text-sm font-medium text-navy/70 mt-1 space-y-1">
                    <li>50 × Business Laptops</li>
                    <li>50 × Extended Warranties</li>
                    <li>50 × Microsoft 365 (Recurring)</li>
                  </ul>
                </div>
                <div className="pt-3 border-t border-navy/5 flex justify-between items-end">
                  <div className="text-[10px] font-bold text-cobalt uppercase tracking-widest bg-cobalt/10 px-2 py-1 rounded">HYBRID BILLING</div>
                  <button className="text-[10px] font-bold text-cobalt hover:text-navy uppercase tracking-widest uppercase transition-colors">View Full Quotation</button>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-navy to-slate-900 rounded-3xl shadow-xl p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-lime/20 rounded-full blur-2xl pointer-events-none" />
              <h2 className="text-xs font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-lime" /> Sourcing Context</h2>
              <div className="space-y-4 relative z-10">
                <div className="text-[10px] font-bold text-lime uppercase tracking-widest bg-lime/20 px-2 py-1 rounded inline-block">FULL REQUIREMENT COVERED</div>
                <div>
                  <div className="font-bold text-lg">Vertex Systems</div>
                  <div className="text-[10px] font-bold text-amber-300 uppercase tracking-widest flex items-center gap-1 mt-1"><ShieldCheck className="w-3 h-3" /> GOLD • 92/100 Trust</div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/10">
                  <div>
                    <div className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Availability</div>
                    <div className="text-sm font-bold mt-0.5 text-lime">50 / 50</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Delivery</div>
                    <div className="text-sm font-bold mt-0.5">2 Days</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* DEAL HEALTH & REQUESTER NOTE */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-navy px-2">Deal Health & Justification</h2>
            <div className="bg-white p-6 rounded-3xl border border-navy/10 shadow-sm grid md:grid-cols-2 gap-6">
              
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-navy/5 pb-2">
                  <span className="text-xs font-bold text-navy/40 uppercase tracking-widest">Overall Health</span>
                  <span className="text-xs font-bold text-lime-700 bg-lime/20 px-2 py-1 rounded">HEALTHY</span>
                </div>
                <div className="flex justify-between items-center"><span className="text-sm font-medium text-navy/60">Margin</span><span className="font-bold text-lime-700">Healthy</span></div>
                <div className="flex justify-between items-center"><span className="text-sm font-medium text-navy/60">Vendor Trust</span><span className="font-bold text-lime-700">Strong</span></div>
                <div className="flex justify-between items-center"><span className="text-sm font-medium text-navy/60">Delivery Risk</span><span className="font-bold text-lime-700">Low</span></div>
                <div className="pt-2">
                  <p className="text-xs font-medium text-navy/70 bg-navy/5 p-3 rounded-lg border border-navy/10">
                    The requested discount reduces margin, but vendor reliability and delivery feasibility remain strong.
                  </p>
                </div>
              </div>

              <div className="bg-warm/50 border border-navy/10 rounded-2xl p-5 flex flex-col h-full">
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare className="w-4 h-4 text-cobalt" />
                  <h3 className="text-xs font-bold text-navy uppercase tracking-widest">Requester Note</h3>
                </div>
                <div className="flex-1 bg-white p-4 rounded-xl border border-navy/5 shadow-sm text-sm font-medium text-navy/80 italic leading-relaxed">
                  "Customer is evaluating a competing quotation and requested a revised commercial offer. Discount is requested to secure the deal before Friday."
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-cobalt text-white flex items-center justify-center text-[10px] font-bold">AS</div>
                  <div className="text-xs font-bold text-navy">Aditi Shah <span className="font-medium text-navy/50">Sales Rep</span></div>
                </div>
              </div>

            </div>
          </div>
          
          {/* AUDIT HISTORY */}
          <div className="pt-8">
            <h2 className="text-sm font-bold text-navy uppercase tracking-widest mb-6">Approval History</h2>
            <div className="space-y-0 relative ml-2">
              <div className="absolute left-[11px] top-4 bottom-4 w-[2px] bg-navy/10" />
              <div className="flex gap-6 py-4 relative z-10">
                <div className="w-6 h-6 rounded-full bg-navy/10 flex items-center justify-center shrink-0 border-[3px] border-white"><Check className="w-3 h-3 text-navy/40" /></div>
                <div>
                  <div className="text-xs font-bold text-navy/40 mb-1">Today, 04:18 PM</div>
                  <div className="text-sm font-bold text-navy">Routed to Sales Manager</div>
                  <div className="text-xs font-medium text-navy/60 mt-0.5">DEV FLOW System</div>
                </div>
              </div>
              <div className="flex gap-6 py-4 relative z-10">
                <div className="w-6 h-6 rounded-full bg-cobalt/20 flex items-center justify-center shrink-0 border-[3px] border-white"><Check className="w-3 h-3 text-cobalt" /></div>
                <div>
                  <div className="text-xs font-bold text-navy/40 mb-1">Today, 04:12 PM</div>
                  <div className="text-sm font-bold text-navy">Submitted approval request</div>
                  <div className="text-xs font-medium text-navy/60 mt-0.5">Aditi Shah • Sales Rep</div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN - STICKY DECISION WORKSPACE */}
        <div className="hidden lg:block w-[30%]">
          <div className="sticky top-28 space-y-6">
            
            <div className="bg-white rounded-3xl border border-navy/10 shadow-xl shadow-navy/5 overflow-hidden">
              <div className="bg-navy p-6 text-white">
                <h2 className="text-xs font-bold uppercase tracking-widest text-white/50 mb-6">Approval Path</h2>
                
                <div className="space-y-0 relative">
                  <div className="absolute left-[9px] top-4 bottom-4 w-[2px] bg-white/10" />
                  
                  <div className="flex items-start gap-4 py-3 relative z-10">
                    <div className="w-5 h-5 rounded-full bg-lime text-lime-950 flex items-center justify-center shrink-0 mt-0.5"><Check className="w-3 h-3" /></div>
                    <div>
                      <div className="text-sm font-bold text-white">Aditi Shah</div>
                      <div className="text-xs font-medium text-white/60">Sales Rep • Requested</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 py-3 relative z-10">
                    <div className={cn("w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-all duration-500", isApproved ? "bg-lime text-lime-950" : status === 'PENDING' ? "bg-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.6)]" : "bg-coral text-white")}>
                      {isApproved ? <Check className="w-3 h-3" /> : status === 'PENDING' ? <motion.div layoutId="path-dot" className="w-2 h-2 bg-white rounded-full" /> : <X className="w-3 h-3" />}
                    </div>
                    <div>
                      <div className={cn("text-sm font-bold", status === 'PENDING' ? "text-orange-400" : "text-white")}>Rahul Mehta</div>
                      <div className="text-xs font-medium text-white/60">Sales Manager • {status === 'PENDING' ? 'Current' : 'Decided'}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 py-3 relative z-10 opacity-50">
                    <div className="w-5 h-5 rounded-full border-2 border-white/20 bg-transparent flex items-center justify-center shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm font-bold text-white">Finance</div>
                      <div className="text-xs font-medium text-white/60">If Required</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 bg-white">
                {status === 'PENDING' ? (
                  <div className="space-y-3">
                    <button onClick={() => setModalType('APPROVE')} className="w-full py-4 rounded-xl bg-navy text-white text-sm font-bold shadow-lg shadow-navy/20 hover:bg-navy/90 transition-colors">Approve Deal</button>
                    <div className="grid grid-cols-2 gap-3">
                      <button onClick={() => setModalType('SEND_BACK')} className="w-full py-3 rounded-xl bg-navy/5 text-navy text-sm font-bold hover:bg-navy/10 transition-colors">Send Back</button>
                      <button onClick={() => setModalType('REJECT')} className="w-full py-3 rounded-xl bg-coral/10 text-coral text-sm font-bold hover:bg-coral/20 transition-colors">Reject</button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 text-center py-4">
                    <div className={cn("w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-2", isApproved ? "bg-lime/20 text-lime-700" : "bg-coral/10 text-coral")}>
                      {isApproved ? <Check className="w-8 h-8" /> : <X className="w-8 h-8" />}
                    </div>
                    <div className="text-lg font-bold text-navy">{isApproved ? 'Approved' : status.replace('_', ' ')}</div>
                    {isApproved && (
                      <button onClick={() => router.push(`/negotiation/${resolvedParams.quotationId}`)} className="w-full mt-4 py-3 rounded-xl bg-cobalt text-white text-sm font-bold shadow-lg shadow-cobalt/20 hover:bg-cobalt/90 transition-colors flex items-center justify-center gap-2">
                        Continue to Negotiation <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-navy/10 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-widest text-navy/40 mb-3">Policy Details</h3>
              <ul className="text-xs font-medium text-navy/60 space-y-2">
                <li><strong className="text-navy">Policy:</strong> Standard Enterprise Discount</li>
                <li><strong className="text-navy">Effective:</strong> Current</li>
                <li><strong className="text-navy">Scope:</strong> Direct Sales Force</li>
              </ul>
            </div>

          </div>
        </div>

        {/* MOBILE STICKY ACTIONS */}
        <div className="lg:hidden fixed bottom-[80px] left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-navy/5 z-40 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
          {status === 'PENDING' ? (
            <div className="flex gap-3">
              <button onClick={() => setModalType('REJECT')} className="flex-1 py-4 rounded-xl bg-coral/10 text-coral font-bold">Reject</button>
              <button onClick={() => setModalType('APPROVE')} className="flex-[2] py-4 rounded-xl bg-navy text-white font-bold shadow-lg">Approve Deal</button>
            </div>
          ) : (
             <button onClick={() => router.push(`/negotiation/${resolvedParams.quotationId}`)} className="w-full py-4 rounded-xl bg-cobalt text-white font-bold shadow-lg flex items-center justify-center gap-2">
               Continue <ArrowRight className="w-5 h-5" />
             </button>
          )}
        </div>

      </div>

      {/* DECISION MODALS */}
      <AnimatePresence>
        {modalType && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-navy/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden flex flex-col">
                
                <div className={cn("p-6 text-white flex items-center justify-between", modalType === 'APPROVE' ? "bg-navy" : modalType === 'REJECT' ? "bg-coral" : "bg-orange-500")}>
                  <h2 className="text-lg font-bold uppercase tracking-widest">{modalType === 'APPROVE' ? 'Approve Deal' : modalType === 'REJECT' ? 'Reject Deal' : 'Request Revision'}</h2>
                  <button onClick={() => !isSubmitting && setModalType(null)} className="text-white/60 hover:text-white"><X className="w-5 h-5" /></button>
                </div>
                
                <div className="p-6 md:p-8 space-y-6 flex-1">
                  {modalType === 'APPROVE' ? (
                    <div>
                      <p className="text-navy font-medium mb-6">You are authorizing the requested commercial terms. This quotation will proceed to customer negotiation.</p>
                      <div className="bg-navy/5 p-4 rounded-xl text-sm font-medium text-navy/70 mb-4">
                        <strong className="text-navy block mb-1">Quotation: QT-2048</strong>
                        Discount: 12%<br/>Margin: 18%
                      </div>
                      <textarea placeholder="Optional approval comment..." value={comment} onChange={e => setComment(e.target.value)} className="w-full p-4 rounded-xl bg-warm/50 border border-navy/10 focus:outline-none focus:border-cobalt text-sm resize-none" rows={3} />
                    </div>
                  ) : (
                    <div>
                      <p className="text-navy font-medium mb-4">Please provide a reason for {modalType === 'REJECT' ? 'rejecting' : 'sending back'} this request.</p>
                      <select className="w-full h-12 px-4 mb-4 rounded-xl bg-warm/50 border border-navy/10 focus:outline-none focus:border-cobalt text-sm font-bold text-navy">
                        <option>Discount Too High</option>
                        <option>Margin Too Low</option>
                        <option>Insufficient Justification</option>
                        <option>Other</option>
                      </select>
                      <textarea placeholder="Add mandatory comment..." value={comment} onChange={e => setComment(e.target.value)} className="w-full p-4 rounded-xl bg-warm/50 border border-navy/10 focus:outline-none focus:border-cobalt text-sm resize-none" rows={3} />
                    </div>
                  )}
                </div>

                <div className="p-6 border-t border-navy/5 flex gap-3">
                  <button disabled={isSubmitting} onClick={() => setModalType(null)} className="flex-1 py-3.5 rounded-xl font-bold text-navy/60 hover:bg-navy/5">Cancel</button>
                  <button disabled={isSubmitting || (modalType !== 'APPROVE' && !comment.trim())} onClick={handleSubmit} className={cn("flex-[2] py-3.5 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center disabled:opacity-50", modalType === 'APPROVE' ? "bg-navy hover:bg-navy/90" : modalType === 'REJECT' ? "bg-coral hover:bg-coral/90" : "bg-orange-500 hover:bg-orange-600")}>
                    {isSubmitting ? <Activity className="w-5 h-5 animate-spin" /> : modalType === 'APPROVE' ? 'Confirm Approval' : modalType === 'REJECT' ? 'Reject Request' : 'Send Back'}
                  </button>
                </div>

              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </WorkspaceLayout>
  );
}

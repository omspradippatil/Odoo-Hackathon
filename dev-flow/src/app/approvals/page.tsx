"use client";

import React from "react";
import { WorkspaceLayout } from "@/components/layout/WorkspaceLayout";
import { UserRole } from "@/types/auth";
import { ShieldCheck, ArrowRight, AlertCircle } from "lucide-react";
import * as motion from "framer-motion/client";

export default function ApprovalsHome() {
  return (
    <WorkspaceLayout role={UserRole.SALES_MANAGER}>
      <div className="space-y-6 md:space-y-8">
        
        {/* HERO */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-navy tracking-tight mb-2">Approval Center</h1>
            <p className="text-navy/60 font-medium text-lg">5 deals require your attention.</p>
          </div>
          <button className="w-full md:w-auto px-6 py-3.5 rounded-xl bg-navy text-white font-bold hover:bg-navy/90 transition-colors shadow-lg shadow-navy/20 whitespace-nowrap">
            Review Approvals
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 pt-4">
          
          {/* PENDING APPROVALS */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* HIGH PRIORITY */}
            <div>
              <div className="flex items-center gap-2 mb-4 px-2">
                <AlertCircle className="w-4 h-4 text-coral" />
                <h2 className="text-xs font-bold text-coral uppercase tracking-widest">High Priority</h2>
              </div>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-2xl border-l-4 border-coral shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-navy mb-1">Nova Retail Expansion</h3>
                    <div className="text-xs font-bold text-navy/40 uppercase tracking-widest">Requester: Sales Rep — Aditi</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-navy">₹12.6L</div>
                    <div className="text-[10px] font-bold text-coral uppercase tracking-widest bg-coral/10 px-2 py-1 rounded mt-1">Customer waiting</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 p-4 bg-navy/5 rounded-xl">
                  <div>
                    <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-1">Requested Discount</div>
                    <div className="text-sm font-bold text-coral">18%</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-1">Standard Allowed</div>
                    <div className="text-sm font-bold text-navy">10%</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-1">Margin (Post-disc)</div>
                    <div className="text-sm font-bold text-navy">16%</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-1">Deal Risk</div>
                    <div className="text-sm font-bold text-lime">Low</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-navy/5">
                  <button className="px-5 py-2.5 rounded-xl text-sm font-bold text-coral bg-coral/10 hover:bg-coral/20 transition-colors">Reject</button>
                  <button className="px-5 py-2.5 rounded-xl text-sm font-bold text-navy bg-navy/5 hover:bg-navy/10 transition-colors">Review Details</button>
                  <button className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-cobalt hover:bg-cobalt/90 transition-colors shadow-lg shadow-cobalt/20">Approve</button>
                </div>
              </motion.div>
            </div>

            {/* NORMAL PRIORITY */}
            <div>
              <div className="flex items-center gap-2 mb-4 px-2">
                <ShieldCheck className="w-4 h-4 text-cobalt" />
                <h2 className="text-xs font-bold text-navy/60 uppercase tracking-widest">Normal</h2>
              </div>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-6 rounded-2xl border border-navy/5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-navy mb-1">TechCore Infrastructure</h3>
                    <div className="text-xs font-bold text-navy/40 uppercase tracking-widest">Requester: Sales Rep — Rahul</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-navy">₹4.2L</div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-6 mb-6">
                  <div><span className="text-[10px] font-bold text-navy/40 uppercase tracking-widest block mb-1">Discount</span><span className="text-sm font-bold text-navy">12%</span></div>
                  <div><span className="text-[10px] font-bold text-navy/40 uppercase tracking-widest block mb-1">Risk</span><span className="text-sm font-bold text-lime">Low</span></div>
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-navy/5">
                  <button className="px-5 py-2.5 rounded-xl text-sm font-bold text-navy bg-navy/5 hover:bg-navy/10 transition-colors">Review Details</button>
                  <button className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-cobalt hover:bg-cobalt/90 transition-colors">Approve</button>
                </div>
              </motion.div>
            </div>

          </div>

          {/* DEAL HEALTH */}
          <div className="space-y-6">
            <div className="bg-navy rounded-3xl p-6 text-white shadow-2xl shadow-navy/20 relative overflow-hidden">
              <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-widest">Deal Health</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-lime" /> <span className="text-sm font-medium">Healthy</span></div>
                  <div className="font-bold">12</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-orange-400" /> <span className="text-sm font-medium">Needs Attention</span></div>
                  <div className="font-bold text-orange-400">4</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-coral animate-pulse" /> <span className="text-sm font-medium">At Risk</span></div>
                  <div className="font-bold text-coral">2</div>
                </div>
              </div>

              <div className="p-4 bg-white/5 border border-white/10 rounded-xl mb-6">
                <p className="text-sm font-medium leading-relaxed">
                  Two high-value deals are waiting longer than the normal approval window.
                </p>
              </div>

              <button className="w-full py-3 bg-white/10 hover:bg-white/20 transition-colors rounded-xl text-sm font-bold flex items-center justify-center gap-2">
                Review Deal Health <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </WorkspaceLayout>
  );
}

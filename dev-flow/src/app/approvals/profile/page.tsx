"use client";

import React, { useState } from "react";
import { WorkspaceLayout } from "@/components/layout/WorkspaceLayout";
import { UserRole } from "@/types/auth";
import { 
  User, ShieldCheck, Mail, Phone, CheckCircle2, Save, Award, Lock
} from "lucide-react";

export default function ApprovalsProfilePage() {
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState({
    name: "Vikram Malhotra",
    email: "v.malhotra@devflow.sales",
    phone: "+91 98200 44920",
    roleTitle: "Commercial Sales Director & Approval Authority",
    discountSignoffLimit: "Up to 25% Commercial Discretion",
    dealSizeAuthority: "₹1,00,00,000 (Level 2 Approval)",
    instantNotification: true
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <WorkspaceLayout role={UserRole.SALES_MANAGER}>
      <div className="max-w-4xl mx-auto space-y-8 pb-16">
        
        {/* HEADER */}
        <div>
          <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-1">Manager Settings</div>
          <h1 className="text-3xl lg:text-4xl font-bold text-navy tracking-tight mb-2">Manager Governance Profile</h1>
          <p className="text-navy/60 font-medium text-sm md:text-base">
            Configure commercial sign-off thresholds, escalation chains, and deal governance settings.
          </p>
        </div>

        {saved && (
          <div className="bg-lime/20 border border-lime/30 text-lime-950 p-4 rounded-2xl flex items-center gap-3 font-medium text-sm">
            <CheckCircle2 className="w-5 h-5 text-lime-700 shrink-0" />
            Manager settings and approval thresholds updated.
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-navy/5 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-navy/5">
              <div className="w-20 h-20 rounded-2xl bg-navy text-white flex items-center justify-center font-bold text-2xl shadow-lg shadow-navy/20">
                VM
              </div>
              <div className="text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                  <h2 className="text-xl font-bold text-navy">{formData.name}</h2>
                  <span className="bg-lime/20 text-lime-900 border border-lime/30 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-lime-700" /> Tier 2 Approval Authority
                  </span>
                </div>
                <div className="text-sm font-medium text-navy/60">{formData.roleTitle}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-navy/70 uppercase tracking-wider mb-2">Full Name</label>
                <input 
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2.5 bg-navy/5 rounded-xl text-sm font-medium text-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-navy/70 uppercase tracking-wider mb-2">Corporate Email</label>
                <input 
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-2.5 bg-navy/5 rounded-xl text-sm font-medium text-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-navy/70 uppercase tracking-wider mb-2">Discount Authority Threshold</label>
                <input 
                  type="text"
                  disabled
                  value={formData.discountSignoffLimit}
                  className="w-full px-4 py-2.5 bg-navy/10 rounded-xl text-sm font-bold text-navy cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-navy/70 uppercase tracking-wider mb-2">Maximum Deal Sign-off Limit</label>
                <input 
                  type="text"
                  disabled
                  value={formData.dealSizeAuthority}
                  className="w-full px-4 py-2.5 bg-navy/10 rounded-xl text-sm font-bold text-navy cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button 
              type="submit"
              className="px-6 py-3 rounded-xl font-bold text-white bg-navy shadow-lg shadow-navy/20 hover:bg-navy/90 transition-all text-sm flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Save Authority Settings
            </button>
          </div>
        </form>

      </div>
    </WorkspaceLayout>
  );
}
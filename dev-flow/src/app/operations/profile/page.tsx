"use client";

import React, { useState } from "react";
import { WorkspaceLayout } from "@/components/layout/WorkspaceLayout";
import { UserRole } from "@/types/auth";
import { 
  User, ShieldCheck, Mail, Phone, Building2, Key, Bell, CheckCircle2, 
  Lock, Save, ExternalLink
} from "lucide-react";

export default function OperationsProfilePage() {
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState({
    name: "Anita Roy",
    email: "anita.roy@aakalan360.com",
    phone: "+91 98201 49201",
    roleTitle: "Lead Finance & Settlement Operations Controller",
    organization: "Aakalan360 Corporate Settlement Ops",
    escrowApprovalLimit: "₹50,00,000",
    twoFactorEnabled: true,
    emailAlerts: true,
    smsAlerts: true
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <WorkspaceLayout role={UserRole.FINANCE_OPERATIONS}>
      <div className="max-w-4xl mx-auto space-y-8 pb-16">
        
        {/* HEADER */}
        <div>
          <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-1">Operations Settings</div>
          <h1 className="text-3xl lg:text-4xl font-bold text-navy tracking-tight mb-2">Controller Profile</h1>
          <p className="text-navy/60 font-medium text-sm md:text-base">
            Manage your settlement authority credentials, escrow signing keys, and audit notifications.
          </p>
        </div>

        {saved && (
          <div className="bg-lime/20 border border-lime/30 text-lime-950 p-4 rounded-2xl flex items-center gap-3 font-medium text-sm">
            <CheckCircle2 className="w-5 h-5 text-lime-700 shrink-0" />
            Profile changes and escrow notification preferences have been saved.
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          
          {/* USER CARD */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-navy/5 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-navy/5">
              <div className="w-20 h-20 rounded-2xl bg-navy text-white flex items-center justify-center font-bold text-2xl shadow-lg shadow-navy/20">
                AR
              </div>
              <div className="text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                  <h2 className="text-xl font-bold text-navy">{formData.name}</h2>
                  <span className="bg-lime/20 text-lime-900 border border-lime/30 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-lime-700" /> Authorized Signatory
                  </span>
                </div>
                <div className="text-sm font-medium text-navy/60">{formData.roleTitle}</div>
                <div className="text-xs text-navy/40 mt-1">{formData.organization}</div>
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
                <label className="block text-xs font-bold text-navy/70 uppercase tracking-wider mb-2">Email Address</label>
                <input 
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-2.5 bg-navy/5 rounded-xl text-sm font-medium text-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-navy/70 uppercase tracking-wider mb-2">Direct Phone</label>
                <input 
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-2.5 bg-navy/5 rounded-xl text-sm font-medium text-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-navy/70 uppercase tracking-wider mb-2">Escrow Release Limit</label>
                <input 
                  type="text"
                  disabled
                  value={formData.escrowApprovalLimit}
                  className="w-full px-4 py-2.5 bg-navy/10 rounded-xl text-sm font-bold text-navy cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* ESCROW SIGNING KEYS & SECURITY */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-navy/5 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-navy flex items-center gap-2">
              <Lock className="w-5 h-5 text-cobalt" /> Escrow Security & Governance
            </h3>
            
            <div className="p-4 bg-navy/5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <div className="font-bold text-sm text-navy">Hardware Multi-Sig Token (FIDO2)</div>
                <div className="text-xs text-navy/60">Required for escrow release authorizations exceeding ₹10 Lakhs</div>
              </div>
              <span className="bg-lime/20 text-lime-900 text-xs font-bold px-3 py-1 rounded-lg">Connected & Active</span>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <div className="font-bold text-sm text-navy">Two-Factor Authentication (2FA)</div>
                <div className="text-xs text-navy/60">Enforced on every payout ledger confirmation</div>
              </div>
              <input 
                type="checkbox" 
                checked={formData.twoFactorEnabled} 
                onChange={(e) => setFormData({...formData, twoFactorEnabled: e.target.checked})}
                className="w-5 h-5 accent-navy cursor-pointer"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button 
              type="submit"
              className="px-6 py-3 rounded-xl font-bold text-white bg-navy shadow-lg shadow-navy/20 hover:bg-navy/90 transition-all text-sm flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Save Profile Preferences
            </button>
          </div>

        </form>

      </div>
    </WorkspaceLayout>
  );
}
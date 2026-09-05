"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { WorkspaceLayout } from "@/components/layout/WorkspaceLayout";
import { UserRole } from "@/types/auth";
import { 
  Building2, ShieldCheck, MapPin, Mail, Phone, CheckCircle2, 
  Save, Star, ExternalLink, Package, Boxes
} from "lucide-react";

export default function SellerProfilePage() {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState({
    name: "Vikram Singhania",
    email: "v.singhania@apexindustrial.in",
    phone: "+91 98220 99482",
    company: "Apex Industrial Supplies Ltd",
    gstin: "27AAACA1928K1ZX",
    city: "Mumbai",
    state: "Maharashtra",
    bankAccount: "Axis Bank •••• 9281 (Escrow Verified)",
    primaryWarehouse: "Bhiwandi Central Logistics Hub",
    trustTier: "Gold",
    trustScore: 95
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <WorkspaceLayout role={UserRole.SELLER}>
      <div className="max-w-4xl mx-auto space-y-8 pb-16">
        
        {/* HEADER */}
        <div>
          <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-1">Seller Settings</div>
          <h1 className="text-3xl lg:text-4xl font-bold text-navy tracking-tight mb-2">Vendor Business Profile</h1>
          <p className="text-navy/60 font-medium text-sm md:text-base">
            Manage your verified seller credentials, settlement bank account, and logistics capabilities.
          </p>
        </div>

        {saved && (
          <div className="bg-lime/20 border border-lime/30 text-lime-950 p-4 rounded-2xl flex items-center gap-3 font-medium text-sm">
            <CheckCircle2 className="w-5 h-5 text-lime-700 shrink-0" />
            Seller credentials and warehouse configurations saved successfully.
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-navy/5 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-navy/5">
              <div className="w-20 h-20 rounded-2xl bg-navy text-white flex items-center justify-center font-bold text-2xl shadow-lg shadow-navy/20">
                AI
              </div>
              <div className="text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                  <h2 className="text-xl font-bold text-navy">{formData.company}</h2>
                  <span className="bg-amber-400/20 text-amber-900 border border-amber-400/30 text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-amber-600" /> {formData.trustTier} Tier ({formData.trustScore})
                  </span>
                </div>
                <div className="text-sm font-medium text-navy/60">Managing Director: {formData.name}</div>
                <div className="text-xs text-navy/40 mt-1">{formData.city}, {formData.state} • GSTIN: {formData.gstin}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-navy/70 uppercase tracking-wider mb-2">Business Contact Name</label>
                <input 
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2.5 bg-navy/5 rounded-xl text-sm font-medium text-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-navy/70 uppercase tracking-wider mb-2">Official Email</label>
                <input 
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-2.5 bg-navy/5 rounded-xl text-sm font-medium text-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-navy/70 uppercase tracking-wider mb-2">Phone</label>
                <input 
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-2.5 bg-navy/5 rounded-xl text-sm font-medium text-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-navy/70 uppercase tracking-wider mb-2">Escrow Payout Account</label>
                <input 
                  type="text"
                  disabled
                  value={formData.bankAccount}
                  className="w-full px-4 py-2.5 bg-navy/10 rounded-xl text-sm font-bold text-navy cursor-not-allowed"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-navy/70 uppercase tracking-wider mb-2">Registered Distribution Facility</label>
                <input 
                  type="text"
                  value={formData.primaryWarehouse}
                  onChange={(e) => setFormData({...formData, primaryWarehouse: e.target.value})}
                  className="w-full px-4 py-2.5 bg-navy/5 rounded-xl text-sm font-medium text-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button 
              type="submit"
              className="px-6 py-3 rounded-xl font-bold text-white bg-navy shadow-lg shadow-navy/20 hover:bg-navy/90 transition-all text-sm flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Save Vendor Settings
            </button>
          </div>
        </form>

      </div>
    </WorkspaceLayout>
  );
}
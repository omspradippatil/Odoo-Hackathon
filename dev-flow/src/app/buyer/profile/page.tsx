"use client";

import React, { useState } from "react";
import { WorkspaceLayout } from "@/components/layout/WorkspaceLayout";
import { UserRole } from "@/types/auth";
import { 
  User, Building2, MapPin, Mail, Phone, ShieldCheck, CheckCircle2, 
  Save, CreditCard, ShoppingBag
} from "lucide-react";

export default function BuyerProfilePage() {
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState({
    name: "Kadambari Mehta",
    email: "k.mehta@novaretail.com",
    phone: "+91 98112 34567",
    designation: "Head of Technical Procurement",
    company: "Nova Retail Innovations Pvt Ltd",
    gstin: "27AABCN9928P1Z5",
    primaryWarehouse: "Bhiwandi Central Facility, Maharashtra",
    monthlyBudget: "₹50,00,000"
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <WorkspaceLayout role={UserRole.BUYER}>
      <div className="max-w-4xl mx-auto space-y-8 pb-16">
        
        {/* HEADER */}
        <div>
          <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-1">Buyer Settings</div>
          <h1 className="text-3xl lg:text-4xl font-bold text-navy tracking-tight mb-2">Buyer Organization Profile</h1>
          <p className="text-navy/60 font-medium text-sm md:text-base">
            Configure enterprise billing credentials, default delivery drop-off hubs, and procurement approvals.
          </p>
        </div>

        {saved && (
          <div className="bg-lime/20 border border-lime/30 text-lime-950 p-4 rounded-2xl flex items-center gap-3 font-medium text-sm">
            <CheckCircle2 className="w-5 h-5 text-lime-700 shrink-0" />
            Buyer profile and delivery addresses saved successfully.
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-navy/5 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-navy/5">
              <div className="w-20 h-20 rounded-2xl bg-navy text-white flex items-center justify-center font-bold text-2xl shadow-lg shadow-navy/20">
                KM
              </div>
              <div className="text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                  <h2 className="text-xl font-bold text-navy">{formData.name}</h2>
                  <span className="bg-lime/20 text-lime-900 border border-lime/30 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-lime-700" /> Verified Enterprise Buyer
                  </span>
                </div>
                <div className="text-sm font-medium text-navy/60">{formData.designation}</div>
                <div className="text-xs text-navy/40 mt-1">{formData.company}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-navy/70 uppercase tracking-wider mb-2">Procurement Lead</label>
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
                <label className="block text-xs font-bold text-navy/70 uppercase tracking-wider mb-2">Company Legal Entity</label>
                <input 
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  className="w-full px-4 py-2.5 bg-navy/5 rounded-xl text-sm font-medium text-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-navy/70 uppercase tracking-wider mb-2">GSTIN Identification</label>
                <input 
                  type="text"
                  value={formData.gstin}
                  onChange={(e) => setFormData({...formData, gstin: e.target.value})}
                  className="w-full px-4 py-2.5 bg-navy/5 rounded-xl text-sm font-medium font-mono text-navy focus:outline-none focus:ring-2 focus:ring-navy/20"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-navy/70 uppercase tracking-wider mb-2">Primary Receiving Warehouse / Site</label>
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
              <Save className="w-4 h-4" /> Save Profile Details
            </button>
          </div>
        </form>

      </div>
    </WorkspaceLayout>
  );
}
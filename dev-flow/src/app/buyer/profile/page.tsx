"use client";

import React, { useState } from "react";
import { WorkspaceLayout } from "@/components/layout/WorkspaceLayout";
import { UserRole } from "@/types/auth";
import { User, Mail, Building2, MapPin, ShieldCheck, Bell, Save, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import * as motion from "framer-motion/client";

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    firstName: "Demo",
    lastName: "User",
    email: "demo@devflow.com",
    role: "Senior Procurement Manager",
    company: "Nova Retail",
    location: "Mumbai, Maharashtra",
    notifications: true,
  });

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 800);
  };

  return (
    <WorkspaceLayout role={UserRole.BUYER} requireAuth>
      <div className="max-w-4xl mx-auto pb-28 md:pb-12">
        <div className="mb-8 md:mb-10">
          <h1 className="text-3xl font-bold text-navy tracking-tight mb-2">User Profile</h1>
          <p className="text-navy/60 font-medium">Manage your personal information, account settings, and preferences.</p>
        </div>

        <div className="space-y-6 md:space-y-8">
          
          {/* PERSONAL INFO */}
          <section className="bg-white rounded-[24px] border border-navy/10 shadow-sm p-5 md:p-8">
            <h2 className="text-lg font-bold text-navy flex items-center gap-2 mb-6"><User className="w-5 h-5 text-cobalt" /> Personal Information</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-navy/60 uppercase tracking-widest block">First Name</label>
                <input 
                  type="text" 
                  value={formData.firstName}
                  onChange={e => setFormData({...formData, firstName: e.target.value})}
                  className="w-full h-12 px-4 rounded-xl bg-warm/50 border border-navy/10 focus:outline-none focus:border-cobalt focus:ring-2 focus:ring-cobalt/20 transition-all font-medium text-navy"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-navy/60 uppercase tracking-widest block">Last Name</label>
                <input 
                  type="text" 
                  value={formData.lastName}
                  onChange={e => setFormData({...formData, lastName: e.target.value})}
                  className="w-full h-12 px-4 rounded-xl bg-warm/50 border border-navy/10 focus:outline-none focus:border-cobalt focus:ring-2 focus:ring-cobalt/20 transition-all font-medium text-navy"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-navy/60 uppercase tracking-widest block">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navy/40" />
                  <input 
                    type="email" 
                    value={formData.email}
                    disabled
                    className="w-full h-12 pl-12 pr-4 rounded-xl bg-navy/5 border border-navy/10 text-navy/60 font-medium cursor-not-allowed"
                  />
                </div>
                <p className="text-[10px] font-bold text-navy/40 mt-1 uppercase tracking-widest">Email address cannot be changed.</p>
              </div>
            </div>
          </section>

          {/* COMPANY & ROLE */}
          <section className="bg-white rounded-[24px] border border-navy/10 shadow-sm p-5 md:p-8">
            <h2 className="text-lg font-bold text-navy flex items-center gap-2 mb-6"><Building2 className="w-5 h-5 text-coral" /> Account & Organization</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-navy/60 uppercase tracking-widest block">Organization</label>
                <input 
                  type="text" 
                  value={formData.company}
                  onChange={e => setFormData({...formData, company: e.target.value})}
                  className="w-full h-12 px-4 rounded-xl bg-warm/50 border border-navy/10 focus:outline-none focus:border-cobalt focus:ring-2 focus:ring-cobalt/20 transition-all font-medium text-navy"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-navy/60 uppercase tracking-widest block">Role / Title</label>
                <input 
                  type="text" 
                  value={formData.role}
                  onChange={e => setFormData({...formData, role: e.target.value})}
                  className="w-full h-12 px-4 rounded-xl bg-warm/50 border border-navy/10 focus:outline-none focus:border-cobalt focus:ring-2 focus:ring-cobalt/20 transition-all font-medium text-navy"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-navy/60 uppercase tracking-widest block">Default Location</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navy/40" />
                  <input 
                    type="text" 
                    value={formData.location}
                    onChange={e => setFormData({...formData, location: e.target.value})}
                    className="w-full h-12 pl-12 pr-4 rounded-xl bg-warm/50 border border-navy/10 focus:outline-none focus:border-cobalt focus:ring-2 focus:ring-cobalt/20 transition-all font-medium text-navy"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* PREFERENCES & SECURITY */}
          <section className="bg-white rounded-[24px] border border-navy/10 shadow-sm p-5 md:p-8">
            <h2 className="text-lg font-bold text-navy flex items-center gap-2 mb-6"><ShieldCheck className="w-5 h-5 text-lime-700" /> Security & Preferences</h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-navy/5 rounded-xl">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-navy/60" />
                  <div>
                    <div className="font-bold text-navy">Email Notifications</div>
                    <div className="text-xs font-medium text-navy/60">Receive updates on quotations and deal statuses.</div>
                  </div>
                </div>
                <button 
                  onClick={() => setFormData({...formData, notifications: !formData.notifications})}
                  className={cn("w-12 h-6 rounded-full transition-colors relative shrink-0", formData.notifications ? "bg-cobalt" : "bg-navy/20")}
                >
                  <div className={cn("w-4 h-4 rounded-full bg-white absolute top-1 transition-all", formData.notifications ? "left-7" : "left-1")} />
                </button>
              </div>

              <div className="pt-4 border-t border-navy/5 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div>
                  <div className="font-bold text-navy">Change Password</div>
                  <div className="text-xs font-medium text-navy/60 max-w-sm">We recommend changing your password every 90 days.</div>
                </div>
                <button className="px-5 py-2.5 rounded-xl border border-navy/10 text-navy font-bold text-sm hover:bg-navy/5 transition-colors w-full sm:w-auto text-center">
                  Update Password
                </button>
              </div>
            </div>
          </section>

          {/* SAVE BUTTON */}
          <div className="flex justify-end pt-4 pb-12 lg:pb-0">
            <button 
              onClick={handleSave}
              disabled={saving}
              className="w-full md:w-auto px-8 py-4 rounded-xl font-bold text-white bg-cobalt hover:bg-cobalt/90 disabled:opacity-50 transition-colors shadow-lg shadow-cobalt/20 flex items-center justify-center gap-2"
            >
              {saving ? "Saving..." : saved ? "Changes Saved!" : <><Save className="w-5 h-5" /> Save Profile</>}
            </button>
          </div>

        </div>
      </div>
    </WorkspaceLayout>
  );
}

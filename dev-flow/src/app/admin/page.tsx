"use client";

import React from "react";
import Link from "next/link";
import { Users, Package, Percent, GitMerge, Settings, ShieldCheck, Activity, Calendar, ArrowRight, CheckCircle2, AlertTriangle } from "lucide-react";

export default function AdminHome() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      <div>
        <h1 className="text-3xl font-bold text-navy tracking-tight mb-2 uppercase">Control Center</h1>
        <p className="text-sm font-medium text-navy/60">Configure the business rules that power every Aakalan360 deal.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Users', value: '1,248', icon: Users },
          { label: 'Products', value: '684', icon: Package },
          { label: 'Approval Policies', value: '6', icon: GitMerge },
          { label: 'Active Vendors', value: '327', icon: Settings },
          { label: 'Warehouses', value: '42', icon: Package },
          { label: 'Subscriptions', value: '8', icon: Calendar },
        ].map(kpi => (
          <div key={kpi.label} className="bg-white p-4 rounded-2xl border border-navy/5 shadow-sm">
            <kpi.icon className="w-5 h-5 text-navy/40 mb-3" />
            <div className="text-2xl font-bold text-navy">{kpi.value}</div>
            <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mt-1">{kpi.label}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="w-full lg:w-[65%] space-y-6">
          <div className="bg-white rounded-3xl border border-navy/10 shadow-sm p-6 md:p-8">
            <h2 className="text-xs font-bold text-navy uppercase tracking-widest mb-6 flex items-center gap-2">Configuration Health</h2>
            
            <div className="space-y-4 mb-6">
              {[
                { label: 'Approval Policies', status: 'ACTIVE', ok: true },
                { label: 'Pricing Engine', status: 'ACTIVE', ok: true },
                { label: 'Warehouse Rules', status: 'ACTIVE', ok: true },
                { label: 'Trust Policy', status: 'TRUST-V2', ok: true },
                { label: 'Deal Health', status: 'DEAL-HEALTH-V2', ok: true },
                { label: 'Subscription Billing', status: 'ACTIVE', ok: true },
              ].map(sys => (
                <div key={sys.label} className="flex items-center justify-between p-3 bg-navy/5 rounded-xl border border-navy/5">
                  <span className="text-sm font-bold text-navy">{sys.label}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-lime/20 text-lime-800 px-2 py-0.5 rounded flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3" /> {sys.status}</span>
                </div>
              ))}
            </div>
            
            <div className="bg-orange-50 border border-orange-200 p-4 rounded-xl flex items-start gap-4">
              <AlertTriangle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-bold text-orange-900 mb-1">2 items need attention</div>
                <ul className="text-xs font-medium text-orange-800/80 space-y-1">
                  <li>• 1 warehouse inventory feed is outdated</li>
                  <li>• 1 approval policy scheduled to expire in 7 days</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[35%]">
          <div className="bg-white rounded-3xl border border-navy/10 shadow-sm p-6 sticky top-24">
            <h2 className="text-xs font-bold text-navy uppercase tracking-widest mb-6">Quick Admin Actions</h2>
            <div className="space-y-2">
              {[
                { label: 'Add User', href: '/admin/users' },
                { label: 'Add Product', href: '/admin/products' },
                { label: 'Create Price List', href: '/admin/pricing' },
                { label: 'Configure Discount Policy', href: '/admin/discount-policies' },
                { label: 'Create Approval Chain', href: '/admin/approval-chains' },
                { label: 'Add Warehouse', href: '/admin/warehouses' },
                { label: 'View Reports', href: '/admin/reports' },
              ].map(action => (
                <Link key={action.label} href={action.href} className="w-full text-left px-4 py-3 bg-navy/5 hover:bg-navy/10 text-navy text-sm font-bold rounded-xl transition-colors border border-navy/5 flex items-center justify-between">
                  {action.label} <ArrowRight className="w-4 h-4 text-navy/40" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

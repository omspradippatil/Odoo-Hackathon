"use client";

import React, { useState } from "react";
import { WorkspaceLayout } from "@/components/layout/WorkspaceLayout";
import { UserRole } from "@/types/auth";
import { 
  UserCog, Users, TrendingUp, ShieldCheck, Award, CheckCircle2, 
  Clock, DollarSign, Mail
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  territory: string;
  quarterQuota: number;
  attainmentPercent: number;
  dealsClosed: number;
  avgDiscountGiven: number;
}

const SAMPLE_TEAM: TeamMember[] = [
  {
    id: "tm-1",
    name: "Rahul Verma",
    role: "Senior Enterprise Sales Rep",
    territory: "Western Region (Mumbai & Pune)",
    quarterQuota: 5000000,
    attainmentPercent: 88,
    dealsClosed: 6,
    avgDiscountGiven: 9.4
  },
  {
    id: "tm-2",
    name: "Priya Sharma",
    role: "Commercial Key Account Lead",
    territory: "Northern Region (Delhi-NCR & Punjab)",
    quarterQuota: 6000000,
    attainmentPercent: 104,
    dealsClosed: 8,
    avgDiscountGiven: 7.8
  },
  {
    id: "tm-3",
    name: "Sneha Patel",
    role: "Mid-Market Account Executive",
    territory: "Southern Region (Bengaluru & Chennai)",
    quarterQuota: 3500000,
    attainmentPercent: 74,
    dealsClosed: 4,
    avgDiscountGiven: 11.2
  },
  {
    id: "tm-4",
    name: "Amit Joshi",
    role: "Industrial Equipment Specialist",
    territory: "Gujarat & Central India",
    quarterQuota: 4500000,
    attainmentPercent: 92,
    dealsClosed: 5,
    avgDiscountGiven: 8.5
  }
];

export default function ApprovalsTeamPage() {
  const [delegationActive, setDelegationActive] = useState(false);

  const formatINR = (val: number) => "₹" + (val / 100000).toFixed(1) + " L";

  return (
    <WorkspaceLayout role={UserRole.SALES_MANAGER}>
      <div className="space-y-6 md:space-y-8 pb-16">
        
        {/* HEADER */}
        <div>
          <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-1">Sales Management</div>
          <h1 className="text-3xl lg:text-4xl font-bold text-navy tracking-tight mb-2">Team Governance & Roster</h1>
          <p className="text-navy/60 font-medium text-sm md:text-base">
            Track sales team margin compliance, quota attainment, and configure out-of-office approval delegation.
          </p>
        </div>

        {/* DELEGATION BANNER */}
        <div className="bg-white rounded-3xl p-6 border border-navy/5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-5 h-5 text-cobalt" />
              <h3 className="font-bold text-navy text-base">Out-of-Office Approval Delegation</h3>
            </div>
            <p className="text-xs text-navy/60 font-medium max-w-xl">
              When enabled, incoming quotes requiring manager sign-off will automatically route to Priya Sharma (Acting Lead).
            </p>
          </div>

          <button
            onClick={() => setDelegationActive(!delegationActive)}
            className={cn(
              "px-5 py-2.5 rounded-xl font-bold text-xs transition-colors shadow-xs",
              delegationActive ? "bg-lime-600 text-white" : "bg-navy/5 text-navy hover:bg-navy/10"
            )}
          >
            {delegationActive ? "Delegation Active ✓" : "Enable Delegation"}
          </button>
        </div>

        {/* TEAM GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SAMPLE_TEAM.map((member) => (
            <div key={member.id} className="bg-white rounded-3xl p-6 border border-navy/5 shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold text-navy">{member.name}</h3>
                  <div className="text-xs font-medium text-navy/60">{member.role}</div>
                  <div className="text-[11px] text-navy/40 mt-0.5">{member.territory}</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-navy">{member.attainmentPercent}%</div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-navy/40">Quota Attained</div>
                </div>
              </div>

              {/* PROGRESS BAR */}
              <div className="w-full bg-navy/5 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-lime-600 h-full rounded-full" 
                  style={{ width: `${Math.min(100, member.attainmentPercent)}%` }} 
                />
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-navy/5 text-center">
                <div className="p-2 bg-navy/[0.02] rounded-xl">
                  <div className="text-[10px] font-bold text-navy/40 uppercase">Quarter Quota</div>
                  <div className="text-xs font-bold text-navy mt-0.5">{formatINR(member.quarterQuota)}</div>
                </div>
                <div className="p-2 bg-navy/[0.02] rounded-xl">
                  <div className="text-[10px] font-bold text-navy/40 uppercase">Deals Won</div>
                  <div className="text-xs font-bold text-navy mt-0.5">{member.dealsClosed} Deals</div>
                </div>
                <div className="p-2 bg-navy/[0.02] rounded-xl">
                  <div className="text-[10px] font-bold text-navy/40 uppercase">Avg Discount</div>
                  <div className="text-xs font-bold text-amber-700 mt-0.5">{member.avgDiscountGiven}%</div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </WorkspaceLayout>
  );
}
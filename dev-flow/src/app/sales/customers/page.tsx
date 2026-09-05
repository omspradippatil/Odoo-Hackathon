"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { WorkspaceLayout } from "@/components/layout/WorkspaceLayout";
import { UserRole } from "@/types/auth";
import { 
  Users, Plus, Search, Building2, Mail, Phone, MapPin, 
  CheckCircle2, DollarSign, Briefcase, ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CustomerAccount {
  id: string;
  name: string;
  industry: string;
  city: string;
  contactPerson: string;
  email: string;
  phone: string;
  totalBilled: number;
  activeDealsCount: number;
  paymentScore: number;
  tier: "Enterprise" | "Strategic" | "Standard";
}

const SAMPLE_CUSTOMERS: CustomerAccount[] = [
  {
    id: "cust-1",
    name: "Nova Retail Innovations Pvt Ltd",
    industry: "Retail Infrastructure & Computing",
    city: "Mumbai, Maharashtra",
    contactPerson: "Kadambari Mehta",
    email: "k.mehta@novaretail.com",
    phone: "+91 98112 34567",
    totalBilled: 4250000,
    activeDealsCount: 2,
    paymentScore: 98,
    tier: "Enterprise"
  },
  {
    id: "cust-2",
    name: "Bharat Heavy Forge Corp",
    industry: "Heavy Metallurgy & Forging",
    city: "Jamshedpur, Jharkhand",
    contactPerson: "Rajeshwar Sengupta",
    email: "r.sengupta@bhforge.in",
    phone: "+91 98310 99482",
    totalBilled: 6800000,
    activeDealsCount: 1,
    paymentScore: 92,
    tier: "Enterprise"
  },
  {
    id: "cust-3",
    name: "Apex Logistics India Pvt Ltd",
    industry: "Supply Chain & Multi-Modal Freight",
    city: "Hyderabad, Telangana",
    contactPerson: "Sunil Kulkarni",
    email: "s.kulkarni@apexlogistics.in",
    phone: "+91 98490 12049",
    totalBilled: 1850000,
    activeDealsCount: 1,
    paymentScore: 88,
    tier: "Strategic"
  },
  {
    id: "cust-4",
    name: "Zenith Precision Tools Ltd",
    industry: "Automotive Component Tooling",
    city: "Ludhiana, Punjab",
    contactPerson: "Harpreet Singh",
    email: "h.singh@zenithtools.com",
    phone: "+91 98140 88291",
    totalBilled: 2400000,
    activeDealsCount: 1,
    paymentScore: 84,
    tier: "Strategic"
  },
  {
    id: "cust-5",
    name: "Kirloskar Power Components",
    industry: "Power Generation Equipment",
    city: "Pune, Maharashtra",
    contactPerson: "Anand Deshmukh",
    email: "a.deshmukh@kirloskarpower.in",
    phone: "+91 98220 11928",
    totalBilled: 5100000,
    activeDealsCount: 1,
    paymentScore: 95,
    tier: "Enterprise"
  }
];

export default function SalesCustomersPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const filtered = SAMPLE_CUSTOMERS.filter((c) => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.industry.toLowerCase().includes(search.toLowerCase()) ||
    c.city.toLowerCase().includes(search.toLowerCase())
  );

  const formatINR = (val: number) => {
    if (val >= 100000) return "₹" + (val / 100000).toFixed(2) + " L";
    return "₹" + val.toLocaleString("en-IN");
  };

  return (
    <WorkspaceLayout role={UserRole.SALES_REP}>
      <div className="space-y-6 md:space-y-8 pb-16">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-1">CRM Directory</div>
            <h1 className="text-3xl lg:text-4xl font-bold text-navy tracking-tight mb-2">Corporate Accounts</h1>
            <p className="text-navy/60 font-medium text-sm md:text-base">
              Manage client relationships, billing history, and active quotation opportunities.
            </p>
          </div>

          <button 
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 rounded-2xl font-bold text-white bg-navy shadow-lg shadow-navy/20 hover:bg-navy/90 transition-all text-sm flex items-center gap-2 self-start md:self-auto"
          >
            <Plus className="w-4 h-4" /> Add Account
          </button>
        </div>

        {/* SEARCH BAR */}
        <div className="bg-white rounded-2xl p-4 border border-navy/5 shadow-sm">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-navy/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search account name, city, or contact..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-navy/5 rounded-xl text-sm font-medium text-navy placeholder:text-navy/40 focus:outline-none focus:ring-2 focus:ring-navy/20"
            />
          </div>
        </div>

        {/* CUSTOMERS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((customer) => (
            <div 
              key={customer.id}
              className="bg-white rounded-3xl p-6 border border-navy/5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full",
                    customer.tier === "Enterprise" && "bg-cobalt/15 text-cobalt",
                    customer.tier === "Strategic" && "bg-lime/20 text-lime-800",
                    customer.tier === "Standard" && "bg-navy/10 text-navy"
                  )}>
                    {customer.tier} Account
                  </span>

                  <span className="text-xs font-bold text-navy bg-navy/5 px-2 py-0.5 rounded">
                    Score: {customer.paymentScore}/100
                  </span>
                </div>

                <h3 className="text-lg font-bold text-navy mb-1 leading-snug">
                  {customer.name}
                </h3>
                <div className="text-xs font-medium text-navy/60 mb-4">
                  {customer.industry}
                </div>

                <div className="p-3 bg-navy/5 rounded-2xl space-y-2 text-xs text-navy/70 mb-6">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Users className="w-3.5 h-3.5 text-navy/40" />
                    {customer.contactPerson}
                  </div>
                  <div className="flex items-center gap-1.5 font-medium">
                    <Mail className="w-3.5 h-3.5 text-navy/40" />
                    {customer.email}
                  </div>
                  <div className="flex items-center gap-1.5 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-navy/40" />
                    {customer.city}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-navy/5">
                <div>
                  <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest">LIFETIME VOLUME</div>
                  <div className="text-base font-bold text-navy">{formatINR(customer.totalBilled)}</div>
                </div>

                <button
                  onClick={() => router.push("/sales/quotations/new")}
                  className="px-4 py-2 text-xs font-bold text-white bg-navy hover:bg-navy/90 rounded-xl transition-colors flex items-center gap-1 shadow-xs"
                >
                  New Quote <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ADD ACCOUNT MODAL */}
        {showAddModal && (
          <div className="fixed inset-0 bg-navy/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-navy/10 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-navy">Add Enterprise Account</h3>
                <button onClick={() => setShowAddModal(false)} className="text-navy/40 hover:text-navy font-bold text-lg">×</button>
              </div>
              <div className="space-y-3">
                <input placeholder="Company Name" className="w-full px-4 py-2.5 bg-navy/5 rounded-xl text-sm font-medium" />
                <input placeholder="Industry / Domain" className="w-full px-4 py-2.5 bg-navy/5 rounded-xl text-sm font-medium" />
                <input placeholder="Primary Contact Person" className="w-full px-4 py-2.5 bg-navy/5 rounded-xl text-sm font-medium" />
                <input placeholder="Email Address" className="w-full px-4 py-2.5 bg-navy/5 rounded-xl text-sm font-medium" />
                <input placeholder="City, State" className="w-full px-4 py-2.5 bg-navy/5 rounded-xl text-sm font-medium" />
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={() => setShowAddModal(false)} className="flex-1 py-2.5 bg-navy/5 font-bold rounded-xl text-sm text-navy">Cancel</button>
                <button onClick={() => setShowAddModal(false)} className="flex-1 py-2.5 bg-navy font-bold rounded-xl text-sm text-white shadow-xs">Save Account</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </WorkspaceLayout>
  );
}
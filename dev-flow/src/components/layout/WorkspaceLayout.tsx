"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  ArrowRightLeft, Home, FileText, PlusCircle, MapPin, Activity, User, 
  Search, Bell, Menu, ShieldCheck, Briefcase, UserCog, Calculator, Settings, X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UserRole } from "@/types/auth";
import { FlowPathBackground } from "@/components/ui/dashboard/FlowPathBackground";
import * as motion from "framer-motion/client";
import { AnimatePresence } from "framer-motion";

type NavItem = {
  label: string;
  href: string;
  icon: any;
  isCreate?: boolean;
};

const NAV_CONFIG: Record<UserRole, NavItem[]> = {
  [UserRole.BUYER]: [
    { label: "Home", href: "/buyer", icon: Home },
    { label: "My Deals", href: "/buyer/deals", icon: FileText },
    { label: "Create Req", href: "/buyer/requirements/new", icon: PlusCircle, isCreate: true },
    { label: "Local Sellers", href: "/buyer/local", icon: MapPin },
    { label: "Profile", href: "/buyer/profile", icon: User },
  ],
  [UserRole.SELLER]: [
    { label: "Home", href: "/seller", icon: Home },
    { label: "Opportunities", href: "/seller/opportunities", icon: Search },
    { label: "Quotes", href: "/seller/quotes", icon: FileText },
    { label: "Trust Profile", href: "/seller/trust", icon: ShieldCheck },
    { label: "Profile", href: "/seller/profile", icon: User },
  ],
  [UserRole.SALES_REP]: [
    { label: "Home", href: "/sales", icon: Home },
    { label: "Deals", href: "/sales/deals", icon: Briefcase },
    { label: "Create Quote", href: "/sales/quotations/new", icon: PlusCircle, isCreate: true },
    { label: "Customers", href: "/sales/customers", icon: User },
    { label: "Activity", href: "/sales/activity", icon: Activity },
  ],
  [UserRole.SALES_MANAGER]: [
    { label: "Home", href: "/approvals", icon: Home },
    { label: "Approvals", href: "/approvals/pending", icon: ShieldCheck },
    { label: "Deal Health", href: "/approvals/health", icon: Activity },
    { label: "Team", href: "/approvals/team", icon: UserCog },
    { label: "Profile", href: "/approvals/profile", icon: User },
  ],
  [UserRole.FINANCE_OPERATIONS]: [
    { label: "Home", href: "/operations", icon: Home },
    { label: "Payments", href: "/operations/payments", icon: Calculator },
    { label: "Billing", href: "/operations/billing", icon: FileText },
    { label: "Fulfilment", href: "/operations/fulfilment", icon: Activity },
    { label: "Profile", href: "/operations/profile", icon: User },
  ],
  [UserRole.ADMIN]: [] // Placeholder
};

const ROLE_TITLES = {
  [UserRole.BUYER]: "Buyer Workspace",
  [UserRole.SELLER]: "Seller Workspace",
  [UserRole.SALES_REP]: "Sales Workspace",
  [UserRole.SALES_MANAGER]: "Approval Center",
  [UserRole.FINANCE_OPERATIONS]: "Operations Workspace",
  [UserRole.ADMIN]: "Admin"
};

export function WorkspaceLayout({ children, role }: { children: React.ReactNode, role: UserRole }) {
  const pathname = usePathname();
  const navItems = NAV_CONFIG[role] || [];
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <div className="min-h-screen bg-warm text-navy selection:bg-coral/20 flex relative">
      <FlowPathBackground />
      
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex w-[260px] bg-navy flex-col justify-between fixed inset-y-0 left-0 z-40 border-r border-navy">
        <div>
          <div className="h-20 flex items-center px-8 border-b border-white/5">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 rounded-lg bg-white/10 text-white flex items-center justify-center transition-transform group-hover:scale-105">
                <ArrowRightLeft className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg tracking-tight text-white">DEV FLOW</span>
            </Link>
          </div>
          <div className="px-8 py-6">
            <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">{ROLE_TITLES[role]}</div>
            <nav className="space-y-1.5 mt-6">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link 
                    key={item.label} 
                    href={item.href} 
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200", 
                      isActive ? "bg-white text-navy shadow-lg" : "text-white/60 hover:bg-white/5 hover:text-white",
                      item.isCreate ? "bg-cobalt text-white hover:bg-cobalt/90 hover:text-white" : ""
                    )}
                  >
                    <Icon className={cn("w-5 h-5", isActive && !item.isCreate ? "text-cobalt" : "")} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
        <div className="p-6 border-t border-white/5 bg-white/5 m-4 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-white/10 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-coral flex items-center justify-center text-white font-bold shadow-lg shadow-coral/20">U</div>
            <div>
              <div className="text-sm font-bold text-white">Demo User</div>
              <div className="text-xs font-medium text-white/50">Settings</div>
            </div>
          </div>
          <Settings className="w-4 h-4 text-white/40" />
        </div>
      </aside>

      {/* MOBILE HEADER */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-navy/5 flex items-center justify-between px-4 z-40 shadow-sm">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-navy text-white flex items-center justify-center">
            <ArrowRightLeft className="w-4 h-4" />
          </div>
          <span className="font-bold text-base tracking-tight text-navy">DEV FLOW</span>
        </Link>
        <div className="flex items-center gap-4">
          <button className="relative text-navy/60">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-coral border-2 border-white" />
          </button>
          <div className="w-8 h-8 rounded-full bg-coral flex items-center justify-center text-white font-bold text-xs">U</div>
        </div>
      </div>

      {/* MOBILE BOTTOM NAV */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 h-20 bg-white border-t border-navy/5 flex items-center justify-around px-2 z-40 pb-4 shadow-[0_-10px_40px_rgba(11,16,32,0.05)]">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          if (item.isCreate) {
            return (
              <Link key={item.label} href={item.href} className="relative -top-5 flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-cobalt text-white flex items-center justify-center shadow-xl shadow-cobalt/30 active:scale-95 transition-transform border-4 border-white">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold text-navy mt-1">{item.label}</span>
              </Link>
            );
          }
          return (
            <Link key={item.label} href={item.href} className="flex flex-col items-center gap-1 p-2 w-16">
              <Icon className={cn("w-5 h-5", isActive ? "text-cobalt" : "text-navy/40")} />
              <span className={cn("text-[9px] font-bold text-center", isActive ? "text-navy" : "text-navy/40")}>{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 lg:ml-[260px] flex flex-col min-h-screen relative z-10 pt-16 pb-24 lg:pt-0 lg:pb-0">
        <header className="hidden lg:flex h-20 items-center justify-between px-10 border-b border-navy/5 bg-warm/80 backdrop-blur-md sticky top-0 z-30">
          <div className="relative w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-navy/40" />
            <input type="text" placeholder="Search products, suppliers, or deals..." className="w-full h-11 pl-11 pr-4 rounded-full bg-white border border-navy/5 focus:outline-none focus:border-cobalt focus:ring-2 focus:ring-cobalt/20 transition-all text-sm font-medium placeholder:text-navy/30" />
          </div>
          <div className="flex items-center gap-6">
            <button className="relative text-navy/60 hover:text-navy transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-coral border-2 border-warm" />
            </button>
            <div className="text-xs font-bold text-navy/40 uppercase tracking-widest">{ROLE_TITLES[role]}</div>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8 lg:p-10 w-full max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  Settings, Users, Package, DollarSign, Percent, GitMerge, 
  Building2, Boxes, Calendar, ShieldCheck, Activity, PieChart, 
  List, Search, Menu
} from "lucide-react";
import { NotificationBell } from "@/components/ui/NotificationBell";
import { AakalanBrand } from "@/components/brand/AakalanBrand";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navGroups = [
    {
      title: 'PEOPLE',
      items: [{ label: 'Users & Roles', href: '/admin/users', icon: Users }]
    },
    {
      title: 'COMMERCE',
      items: [
        { label: 'Products', href: '/admin/products', icon: Package },
        { label: 'Pricing', href: '/admin/pricing', icon: DollarSign },
        { label: 'Discount Policies', href: '/admin/discount-policies', icon: Percent },
      ]
    },
    {
      title: 'GOVERNANCE',
      items: [
        { label: 'Approval Chains', href: '/admin/approval-chains', icon: GitMerge },
        { label: 'Trust Policy', href: '/admin/trust-policy', icon: ShieldCheck },
        { label: 'Deal Health', href: '/admin/deal-health-policy', icon: Activity },
      ]
    },
    {
      title: 'OPERATIONS',
      items: [
        { label: 'Warehouses', href: '/admin/warehouses', icon: Building2 },
        { label: 'Inventory', href: '/admin/inventory', icon: Boxes },
      ]
    },
    {
      title: 'FINANCE',
      items: [
        { label: 'Subscriptions', href: '/admin/subscriptions', icon: Calendar },
      ]
    },
    {
      title: 'INSIGHTS',
      items: [
        { label: 'Reports', href: '/admin/reports', icon: PieChart },
        { label: 'Audit Log', href: '/admin/audit', icon: List },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-warm/20 font-sans text-navy flex">
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex flex-col w-64 bg-navy text-white h-screen sticky top-0 overflow-y-auto no-scrollbar border-r border-navy/10">
        <div className="p-6 shrink-0 flex items-center border-b border-white/10">
          <Link href="/" className="flex items-center">
            <AakalanBrand theme="dark" size="sidebar" badge="Admin" />
          </Link>
        </div>
        
        <div className="p-4 space-y-6 flex-1">
          {navGroups.map(group => (
            <div key={group.title}>
              <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2 px-2">{group.title}</div>
              <div className="space-y-1">
                {group.items.map(item => {
                  const active = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/admin');
                  return (
                    <Link key={item.href} href={item.href} className={cn("flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors", active ? "bg-white/10 text-white" : "text-white/60 hover:text-white hover:bg-white/5")}>
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-4 shrink-0 border-t border-white/10">
          <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-white/60 hover:text-white transition-colors">
            Exit Admin
          </Link>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-h-screen max-w-full overflow-hidden">
        {/* TOP HEADER */}
        <header className="bg-white h-16 border-b border-navy/5 flex items-center justify-between px-4 lg:px-8 shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-navy/60 hover:text-navy"><Menu className="w-5 h-5" /></button>
            <div className="hidden sm:flex items-center gap-2 bg-warm/30 px-3 py-1.5 rounded-lg border border-navy/5 w-64 lg:w-96 focus-within:border-navy/20 transition-colors">
              <Search className="w-4 h-4 text-navy/40 shrink-0" />
              <input type="text" placeholder="Global admin search..." className="bg-transparent border-none outline-none text-sm w-full font-medium" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <NotificationBell />
            <div className="w-8 h-8 rounded-full bg-navy text-white flex items-center justify-center text-xs font-bold shrink-0">AD</div>
          </div>
        </header>
        
        {/* PAGE CONTENT */}
        <div className="flex-1 p-4 md:p-8 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

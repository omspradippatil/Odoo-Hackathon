"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";
import {
  FileText,
  Kanban,
  Activity,
  PlusCircle,
  Truck,
  FileCheck,
  LogOut,
  Layers,
  ShoppingBag,
  Shield,
  Menu,
  X,
  CreditCard,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuthContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If in customer portal, do not show internal navigation
  if (pathname.startsWith("/portal/")) {
    return null;
  }

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: Layers },
    { label: "Quotations", href: "/workspace/quotations", icon: FileText },
    { label: "New Quote", href: "/workspace/quotations/new", icon: PlusCircle },
    { label: "Pipeline", href: "/workspace/pipeline", icon: Kanban },
    { label: "Deal Health", href: "/workspace/dashboard", icon: Activity },
    { label: "Local Mode", href: "/local", icon: ShoppingBag },
    { label: "B2B Bids", href: "/professional/bids", icon: Shield },
    { label: "Admin", href: "/admin", icon: FileCheck },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-black text-white text-lg tracking-wider shadow-lg shadow-blue-500/20">
              DF
            </div>
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r text-gray-900">
              DEV FLOW
            </span>
          </Link>
          <span className="hidden md:inline-flex text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-blue-50 border border-blue-100 text-blue-600">
            PROTOTYPE v1.0
          </span>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  active
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User / Auth Controls */}
        <div className="hidden sm:flex items-center gap-3">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2 text-xs bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-gray-600 font-medium max-w-[120px] truncate">
                {user.email}
              </span>
              <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-blue-400 font-semibold uppercase">
                {user.role}
              </span>
              <button
                onClick={handleLogout}
                title="Logout"
                className="text-gray-500 hover:text-red-400 transition-colors ml-1"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-1.5 rounded-md transition shadow-sm"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="lg:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md text-gray-500 hover:text-gray-800 hover:bg-gray-50"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-gray-200 bg-white px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${
                  active
                    ? "bg-blue-600 text-white"
                    : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
          <div className="pt-3 border-t border-gray-200 flex justify-between items-center text-xs">
            {isAuthenticated && user ? (
              <>
                <span className="text-gray-500">{user.email} ({user.role})</span>
                <button
                  onClick={handleLogout}
                  className="text-red-400 hover:underline flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" /> Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="w-full text-center py-2 bg-blue-600 text-white rounded text-sm font-medium"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
import Link from "next/link";
import {
  ShoppingBag,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Building,
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12 sm:py-24 bg-white">
      {/* Hero Section */}
      <div className="text-center max-w-4xl mx-auto space-y-6 mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold tracking-wide border border-blue-100">
          <Sparkles className="w-4 h-4" />
          Intelligent Sales Operations Platform
        </div>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900">
          Welcome to <span className="text-blue-600">DEV FLOW</span>
        </h1>
        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Select an operating mode below to experience automated multi-tier discount governance, escrow trust, and anonymous B2B tender bidding.
        </p>
      </div>

      {/* Dual Mode Big Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
        {/* Local Mode Card */}
        <Link
          href="/local"
          className="group rounded-2xl border border-gray-200 bg-white p-8 hover:border-blue-300 transition-all shadow-sm hover:shadow-md flex flex-col justify-between"
        >
          <div className="space-y-5">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition">
                  LOCAL MODE
                </h2>
                <span className="text-[10px] uppercase font-bold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
                  Consumer
                </span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Buy & sell locally with verified Gold/Silver/Bronze trust tiers and instant escrow protection.
              </p>
            </div>

            <ul className="space-y-2.5 text-sm text-gray-700 pt-4 border-t border-gray-100">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>Escrow vault locks funds until delivery verified</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>Transparent 2% platform fee on final payout</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>Instant payment confirmation</span>
              </li>
            </ul>
          </div>

          <div className="pt-6 mt-6 border-t border-gray-100 flex items-center justify-between text-sm font-semibold text-blue-600 group-hover:translate-x-1 transition-transform">
            <span>Explore Local Goods</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </Link>

        {/* Professional Mode Card */}
        <Link
          href="/workspace/quotations"
          className="group rounded-2xl border border-gray-200 bg-white p-8 hover:border-blue-300 transition-all shadow-sm hover:shadow-md flex flex-col justify-between"
        >
          <div className="space-y-5">
            <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-700 group-hover:scale-105 transition-transform">
              <Building className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition">
                  PROFESSIONAL MODE
                </h2>
                <span className="text-[10px] uppercase font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                  Enterprise B2B
                </span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Self-governing sales operations with live Blended Risk calculation, multi-warehouse splitting, and automated approvals.
              </p>
            </div>

            <ul className="space-y-2.5 text-sm text-gray-700 pt-4 border-t border-gray-100">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>Automated L1 / L2 approval escalation routing</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>Greedy multi-warehouse inventory auto-split</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>Anonymous vendor bidding killing corruption</span>
              </li>
            </ul>
          </div>

          <div className="pt-6 mt-6 border-t border-gray-100 flex items-center justify-between text-sm font-semibold text-blue-600 group-hover:translate-x-1 transition-transform">
            <span>Enter Enterprise Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </Link>
      </div>

      {/* Quick Links Row */}
      <div className="mt-16 flex flex-wrap items-center justify-center gap-3 text-sm text-gray-600">
        <span className="font-semibold text-gray-900 mr-2">Quick Jump:</span>
        <Link href="/workspace/quotations/new" className="px-3.5 py-1.5 rounded-lg bg-gray-50 border border-gray-200 hover:bg-gray-100 transition text-gray-700 font-medium">
          Quotation Builder
        </Link>
        <Link href="/workspace/pipeline" className="px-3.5 py-1.5 rounded-lg bg-gray-50 border border-gray-200 hover:bg-gray-100 transition text-gray-700 font-medium">
          Pipeline Kanban
        </Link>
        <Link href="/workspace/dashboard" className="px-3.5 py-1.5 rounded-lg bg-gray-50 border border-gray-200 hover:bg-gray-100 transition text-gray-700 font-medium">
          Deal Health
        </Link>
      </div>
    </div>
  );
}

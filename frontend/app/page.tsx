import Link from "next/link";
import {
  ShoppingBag,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Layers,
  Activity,
  CheckCircle2,
  Lock,
  Building,
  Zap,
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold tracking-wide">
          <Sparkles className="w-3.5 h-3.5" />
          India&apos;s Dual-Mode Intelligent Sales Operations Platform
        </div>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white">
          Welcome to <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">DEV FLOW</span>
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed">
          Select an operating mode below to experience automated multi-tier discount governance, escrow trust, and anonymous B2B tender bidding.
        </p>
      </div>

      {/* Dual Mode Big Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
        {/* Local Mode Card */}
        <Link
          href="/local"
          className="group relative rounded-2xl border border-blue-500/30 bg-gradient-to-b from-blue-950/40 via-zinc-900/60 to-zinc-900 p-8 hover:border-blue-500/80 transition-all shadow-xl hover:shadow-blue-500/10 flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-black text-white group-hover:text-blue-400 transition">
                  LOCAL MODE
                </h2>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                  Consumer
                </span>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Buy & sell locally with verified Gold/Silver/Bronze trust tiers and instant mock UPI escrow protection.
              </p>
            </div>

            <ul className="space-y-2 text-xs text-zinc-300 pt-2 border-t border-zinc-800">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                Escrow vault locks funds until delivery verified
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                Transparent 2% platform fee on final seller payout
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                One-click mock UPI payment confirmation
              </li>
            </ul>
          </div>

          <div className="pt-6 mt-6 border-t border-zinc-800/80 flex items-center justify-between text-xs font-bold text-blue-400 group-hover:translate-x-1 transition-transform">
            <span>Explore Local Goods & UPI Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </Link>

        {/* Professional Mode Card */}
        <Link
          href="/workspace/quotations"
          className="group relative rounded-2xl border border-purple-500/30 bg-gradient-to-b from-purple-950/40 via-zinc-900/60 to-zinc-900 p-8 hover:border-purple-500/80 transition-all shadow-xl hover:shadow-purple-500/10 flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
              <Building className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-black text-white group-hover:text-purple-400 transition">
                  PROFESSIONAL MODE
                </h2>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                  Enterprise B2B
                </span>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Self-governing sales operations with live Blended Risk calculation, multi-warehouse splitting, and blind tender bidding.
              </p>
            </div>

            <ul className="space-y-2 text-xs text-zinc-300 pt-2 border-t border-zinc-800">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                Automated L1 / L2 approval escalation routing
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                Greedy multi-warehouse inventory auto-split
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                Anonymous vendor bidding killing middleman corruption
              </li>
            </ul>
          </div>

          <div className="pt-6 mt-6 border-t border-zinc-800/80 flex items-center justify-between text-xs font-bold text-purple-400 group-hover:translate-x-1 transition-transform">
            <span>Enter Enterprise Sales Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </Link>
      </div>

      {/* Quick Links Row */}
      <div className="mt-12 flex flex-wrap items-center justify-center gap-3 text-xs text-zinc-400">
        <span className="text-zinc-500 font-semibold">Quick Jump:</span>
        <Link href="/workspace/quotations/new" className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:text-white transition">
          Quotation Builder
        </Link>
        <Link href="/workspace/pipeline" className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:text-white transition">
          Pipeline Kanban
        </Link>
        <Link href="/workspace/dashboard" className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:text-white transition">
          Deal Health
        </Link>
        <Link href="/local/checkout/1" className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:text-white transition">
          Mock UPI Checkout
        </Link>
      </div>
    </div>
  );
}

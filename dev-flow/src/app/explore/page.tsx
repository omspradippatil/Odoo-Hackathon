"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Navbar } from "@/components/sections/Navbar";
import { Footer } from "@/components/sections/Footer";
import { TrustBadge } from "@/components/ui/TrustBadge";
import {
  Search, MapPin, Star, ShieldCheck, Building2, Store, ArrowRight, Gavel,
  PlayCircle, Package, TrendingDown, Users, Truck
} from "lucide-react";
import * as motion from "framer-motion/client";
import { cn } from "@/lib/utils";
import { demoState, getSessionStatus, getLeadingBid, type BiddingSession } from "@/lib/demoState";
import { estimateDelivery } from "@/lib/deliveryEstimate";

const formatCurrency = (val: number) => `₹${val.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

type Tier = "GOLD" | "SILVER" | "BRONZE" | "NONE";

const normalizeTier = (tier?: string): Tier => {
  const upper = (tier || "").toUpperCase();
  return upper === "GOLD" || upper === "SILVER" || upper === "BRONZE" ? upper : "NONE";
};

const ENTERPRISE_VENDORS = [
  { id: "vertex-systems", name: "Vertex Systems", tier: "GOLD" as const, score: 94, category: "IT Hardware", city: "Mumbai", deals: 218, onTime: "98%" },
  { id: "nova-supply", name: "Nova Supply Co", tier: "SILVER" as const, score: 81, category: "Office Supplies", city: "Pune", deals: 132, onTime: "91%" },
  { id: "orbit-traders", name: "Orbit Traders", tier: "BRONZE" as const, score: 67, category: "Industrial", city: "Nashik", deals: 54, onTime: "84%" },
  { id: "meridian-industrial", name: "Meridian Industrial", tier: "GOLD" as const, score: 92, category: "Heavy Equipment", city: "Ahmedabad", deals: 176, onTime: "96%" },
];

const CATEGORIES = ["ALL", "Electronics", "Furniture", "IT Hardware", "Industrial"];

export default function ExplorePage() {
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [products, setProducts] = useState<any[]>([]);
  const [sessions, setSessions] = useState<BiddingSession[]>([]);

  useEffect(() => {
    setMounted(true);
    setProducts(demoState.getMockProducts());
    const sync = () => setSessions(demoState.getBiddingSessions());
    sync();
    return demoState.subscribeBidding(sync);
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.sellerName?.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "ALL" || p.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, category]);

  const filteredVendors = useMemo(() => {
    return ENTERPRISE_VENDORS.filter((v) => {
      const matchesSearch = !search || v.name.toLowerCase().includes(search.toLowerCase()) || v.category.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "ALL" || v.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [search, category]);

  const openRooms = sessions.filter((s) => getSessionStatus(s) !== "CLOSED").slice(0, 3);

  return (
    <main className="min-h-screen bg-warm/30">
      <Navbar />

      <section className="pt-28 md:pt-36 pb-10 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <div className="inline-flex px-3 py-1 text-[10px] font-semibold tracking-widest uppercase rounded-full bg-navy/5 text-navy border border-navy/10 mb-6">
              Browsing as a guest — no account needed
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-navy leading-[1.1] mb-5">
              Explore every deal <span className="text-coral">before</span> you commit.
            </h1>
            <p className="text-base md:text-lg text-navy/70 leading-relaxed mb-8">
              Compare verified vendors on trust, not just price. Browse local sellers near you, watch live bidding
              rooms in progress, and see exactly how a deal moves from requirement to delivery.
            </p>
          </motion.div>

          {/* SEARCH + FILTERS */}
          <div className="flex flex-col md:flex-row gap-3 md:items-center">
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-navy/40" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products, vendors or categories..."
                className="w-full h-12 pl-11 pr-4 rounded-2xl bg-white border border-navy/10 focus:outline-none focus:border-cobalt text-sm font-medium shadow-sm"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={cn(
                    "px-4 h-12 rounded-2xl text-xs font-bold whitespace-nowrap border transition-colors shrink-0",
                    category === c
                      ? "bg-navy text-white border-navy"
                      : "bg-white text-navy/70 border-navy/10 hover:border-navy/25"
                  )}
                >
                  {c === "ALL" ? "All Categories" : c}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* LIVE BIDDING STRIP */}
      {mounted && openRooms.length > 0 && (
        <section className="px-4 md:px-6 pb-10">
          <div className="max-w-7xl mx-auto bg-navy text-white rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-72 h-72 bg-coral/30 rounded-full blur-3xl pointer-events-none" />
            <div className="relative">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold tracking-tight flex items-center gap-2.5 mb-1">
                    <Gavel className="w-6 h-6 text-lime" /> Bidding rooms
                  </h2>
                  <p className="text-white/60 text-sm font-medium">
                    Vendors competing live — lowest compliant bid wins.
                  </p>
                </div>
                <Link
                  href="/demo/live-bidding"
                  className="shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-lime text-navy font-bold text-sm hover:bg-lime/90 transition-colors active:scale-95"
                >
                  Open calendar <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                {openRooms.map((session) => {
                  const status = getSessionStatus(session);
                  const leading = getLeadingBid(session);
                  return (
                    <Link
                      key={session.id}
                      href="/demo/live-bidding"
                      className="bg-white/10 hover:bg-white/15 backdrop-blur-sm rounded-2xl p-4 transition-colors border border-white/10"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-white/50">{session.id}</span>
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest flex items-center gap-1",
                          status === "LIVE" ? "bg-coral text-white" : "bg-white/15 text-white/70"
                        )}>
                          {status === "LIVE" && <span className="w-1 h-1 rounded-full bg-white animate-ping" />}
                          {status}
                        </span>
                      </div>
                      <div className="font-bold text-sm leading-tight mb-3 line-clamp-2">{session.title}</div>
                      <div className="flex items-end justify-between">
                        <div>
                          <div className="text-[9px] font-bold uppercase tracking-widest text-white/40 mb-0.5">Reserve</div>
                          <div className="text-xs font-bold text-white/80">{formatCurrency(session.reservePrice)}</div>
                        </div>
                        {leading && (
                          <div className="text-right">
                            <div className="text-[9px] font-bold uppercase tracking-widest text-white/40 mb-0.5">Leading</div>
                            <div className="text-xs font-bold text-lime flex items-center gap-1">
                              <TrendingDown className="w-3 h-3" /> {formatCurrency(leading.amount)}
                            </div>
                          </div>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* LOCAL MARKETPLACE */}
      <section className="px-4 md:px-6 pb-14">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <Store className="w-3 h-3" /> Local Marketplace
              </div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-navy">Sellers near you</h2>
            </div>
            <Link href="/buyer/local" className="text-sm font-bold text-cobalt hover:underline shrink-0 flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl border border-dashed border-navy/15 p-12 text-center">
              <Package className="w-8 h-8 text-navy/20 mx-auto mb-3" />
              <p className="text-sm font-medium text-navy/50">No products match that search.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((product, i) => {
                const delivery = estimateDelivery([{ distanceKm: product.distanceKm }]);
                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white rounded-3xl border border-navy/10 overflow-hidden shadow-sm hover:shadow-lg transition-shadow group"
                  >
                    <div className="aspect-[4/3] bg-navy/5 overflow-hidden">
                      {product.image && (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      )}
                    </div>
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-bold text-navy leading-tight text-sm">{product.name}</h3>
                        <TrustBadge tier={normalizeTier(product.trustTier)} />
                      </div>

                      <div className="flex items-center gap-3 text-[10px] font-bold text-navy/50 uppercase tracking-wider mb-3">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{product.sellerLocation}</span>
                        {product.rating && <span className="flex items-center gap-1"><Star className="w-3 h-3 text-gold" />{product.rating}</span>}
                      </div>

                      <div className="flex items-baseline gap-2 mb-3">
                        <span className="text-xl font-bold text-navy">{formatCurrency(product.sellingPrice)}</span>
                        {product.originalPrice > product.sellingPrice && (
                          <span className="text-xs font-medium text-navy/40 line-through">{formatCurrency(product.originalPrice)}</span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-lime-700 bg-lime/15 border border-lime/30 rounded-lg px-2.5 py-1.5">
                        <Truck className="w-3 h-3 shrink-0" />
                        Delivery by {delivery.label.split("–")[1]?.trim() ?? delivery.label}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ENTERPRISE VENDORS */}
      <section className="px-4 md:px-6 pb-14">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <Building2 className="w-3 h-3" /> Enterprise Procurement
              </div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-navy">Verified vendors</h2>
            </div>
          </div>

          {filteredVendors.length === 0 ? (
            <div className="bg-white rounded-3xl border border-dashed border-navy/15 p-12 text-center">
              <Users className="w-8 h-8 text-navy/20 mx-auto mb-3" />
              <p className="text-sm font-medium text-navy/50">No vendors match that search.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredVendors.map((vendor, i) => (
                <motion.div
                  key={vendor.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={`/vendors/${vendor.id}/trust`}
                    className="block bg-white rounded-3xl border border-navy/10 p-5 shadow-sm hover:shadow-lg hover:border-cobalt/30 transition-all h-full"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-navy text-white flex items-center justify-center font-bold text-sm shrink-0">
                        {vendor.name.slice(0, 2).toUpperCase()}
                      </div>
                      <TrustBadge tier={vendor.tier} />
                    </div>

                    <h3 className="font-bold text-navy leading-tight mb-1">{vendor.name}</h3>
                    <div className="text-[10px] font-bold text-navy/40 uppercase tracking-wider mb-4">
                      {vendor.category} • {vendor.city}
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-3 border-t border-navy/5">
                      <div>
                        <div className="text-[9px] font-bold text-navy/40 uppercase tracking-wider">Score</div>
                        <div className="font-bold text-navy text-sm">{vendor.score}</div>
                      </div>
                      <div>
                        <div className="text-[9px] font-bold text-navy/40 uppercase tracking-wider">Deals</div>
                        <div className="font-bold text-navy text-sm">{vendor.deals}</div>
                      </div>
                      <div>
                        <div className="text-[9px] font-bold text-navy/40 uppercase tracking-wider">On-time</div>
                        <div className="font-bold text-lime-700 text-sm">{vendor.onTime}</div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 md:px-6 pb-20">
        <div className="max-w-7xl mx-auto bg-white rounded-3xl border border-navy/10 p-8 md:p-12 text-center shadow-sm">
          <ShieldCheck className="w-10 h-10 text-cobalt mx-auto mb-5" />
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-navy mb-3">
            Ready to see a full deal in motion?
          </h2>
          <p className="text-navy/60 font-medium max-w-xl mx-auto mb-8">
            Walk the eight-stage journey from requirement to payment release — every screen is live demo data.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/demo"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-navy text-white font-bold hover:bg-navy/90 transition-all active:scale-95 shadow-lg shadow-navy/20"
            >
              <PlayCircle className="w-4 h-4" /> Open Live Demo
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full border border-navy/20 text-navy font-bold hover:bg-navy/5 transition-colors"
            >
              Create an account <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

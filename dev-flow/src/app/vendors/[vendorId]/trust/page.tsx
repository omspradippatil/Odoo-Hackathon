"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Star, Package, Clock, MessageSquare, ShieldAlert, ArrowRight, CheckCircle2, AlertCircle, Building2, ChevronDown, Check, TrendingUp, Info, MapPin, Activity } from "lucide-react";
import * as motion from "framer-motion/client";
import { AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function VendorTrustPage({ params }: { params: Promise<{ vendorId: string }> }) {
  const router = useRouter();
  const [isBronzeMode, setIsBronzeMode] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  React.useEffect(() => {
    setIsGuest(!sessionStorage.getItem("devflow_user"));
  }, []);
  const [animatedScore, setAnimatedScore] = useState(0);

  const targetScore = isBronzeMode ? 61 : 92;
  const tier = isBronzeMode ? 'BRONZE' : 'GOLD';

  useEffect(() => {
    setAnimatedScore(0);
    const duration = 1000;
    const steps = 30;
    const stepTime = duration / steps;
    let currentStep = 0;
    
    const timer = setInterval(() => {
      currentStep++;
      setAnimatedScore(Math.round((targetScore / steps) * currentStep));
      if (currentStep >= steps) clearInterval(timer);
    }, stepTime);

    return () => clearInterval(timer);
  }, [targetScore]);

  const [expandedFactor, setExpandedFactor] = useState<string | null>(null);

  const vendorName = isBronzeMode ? 'Nexus Tech Store' : 'Vertex Systems';
  const reviewsCount = isBronzeMode ? 7 : 324;
  const transactionsCount = isBronzeMode ? 8 : 1240;
  const rating = isBronzeMode ? 4.7 : 4.8;
  const memberSince = isBronzeMode ? '2026' : '2023';

  return (
    <div className="min-h-screen bg-warm/20 font-sans text-navy flex flex-col pb-24 lg:pb-0">
      
      {/* HEADER */}
      <header className="bg-navy text-white px-6 py-4 flex flex-col md:flex-row md:items-center justify-between shadow-md gap-4 sticky top-0 z-50">
        <div className="flex items-center gap-2 font-bold text-lg tracking-tight">
          <div className="w-6 h-6 rounded-full bg-lime" /> DEV FLOW
        </div>
        <div className="flex items-center gap-4 text-sm font-medium">
          <span className="text-white/60">Platform Trust Intelligence</span>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-8 lg:py-12">
        
        {/* DEMO TOGGLE */}
        <div className="flex justify-end mb-4">
          <button 
            onClick={() => setIsBronzeMode(!isBronzeMode)}
            className="text-[10px] font-bold text-navy/40 uppercase tracking-widest hover:text-navy transition-colors bg-white px-3 py-1.5 rounded-lg border border-navy/10 shadow-sm"
          >
            [Toggle: {isBronzeMode ? 'Preview Established Vendor (Gold)' : 'Preview New Vendor (Bronze)'}]
          </button>
        </div>

        {/* PROFILE HEADER */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-6">
            <div>
              <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-2 flex items-center gap-2">
                <Building2 className="w-3 h-3" /> {isBronzeMode ? 'Local Vendor' : 'Professional Vendor'} <span className="text-navy/20">•</span> Mumbai, Maharashtra
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-navy tracking-tight mb-3">{vendorName}</h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-navy/70">
                <div className={cn("px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 border shadow-sm",
                  isBronzeMode ? "bg-amber-100 text-amber-800 border-amber-200" : "bg-yellow-100 text-yellow-800 border-yellow-200"
                )}>
                  <ShieldCheck className="w-3.5 h-3.5" /> {tier} • {animatedScore} TRUST
                </div>
                <div className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /> <span className="font-bold text-navy">{rating}</span></div>
                <div className="flex items-center gap-1"><MessageSquare className="w-4 h-4 text-navy/40" /> {reviewsCount} Verified Reviews</div>
                <div className="flex items-center gap-1"><Package className="w-4 h-4 text-navy/40" /> {transactionsCount.toLocaleString()} Transactions</div>
                <div className="flex items-center gap-1 text-navy/40">Member Since: {memberSince}</div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <button className="px-5 py-3 rounded-xl font-bold text-navy bg-white border border-navy/10 shadow-sm hover:bg-navy/5 transition-colors text-sm flex-1 sm:flex-none">Compare Vendor</button>
              <button onClick={() => router.push("/login?returnTo=/buyer/requirements/new")} className="px-5 py-3 rounded-xl font-bold text-white bg-cobalt shadow-lg shadow-cobalt/20 hover:bg-cobalt/90 transition-colors text-sm flex-1 sm:flex-none">Request Quote</button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start relative">
          
          {/* LEFT COLUMN - MAIN PROFILE */}
          <div className="w-full lg:w-[65%] space-y-8">
            
            {/* TRUST HERO */}
            <div className={cn("rounded-3xl p-6 md:p-10 border shadow-xl overflow-hidden relative",
              isBronzeMode ? "bg-gradient-to-br from-amber-50 to-white border-amber-200 shadow-amber-900/5" : "bg-gradient-to-br from-navy to-slate-900 border-navy shadow-navy/10 text-white"
            )}>
              {isBronzeMode ? (
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-100 rounded-full blur-3xl pointer-events-none opacity-50" />
              ) : (
                <div className="absolute top-0 right-0 w-64 h-64 bg-lime/20 rounded-full blur-3xl pointer-events-none" />
              )}
              
              <div className="flex flex-col md:flex-row gap-8 items-center relative z-10">
                <div className="flex flex-col items-center justify-center shrink-0">
                  <div className={cn("text-6xl md:text-7xl font-bold tracking-tighter tabular-nums", isBronzeMode ? "text-amber-800" : "text-lime")}>
                    {animatedScore}
                  </div>
                  <div className={cn("text-[10px] font-bold uppercase tracking-widest mt-2", isBronzeMode ? "text-amber-800/60" : "text-white/50")}>TRUST SCORE</div>
                  <div className={cn("px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mt-4 border",
                    isBronzeMode ? "bg-amber-100 text-amber-800 border-amber-200" : "bg-white/10 text-white border-white/20"
                  )}>
                    {tier}
                  </div>
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  {isBronzeMode ? (
                    <>
                      <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-amber-600 bg-amber-100/50 px-3 py-1 rounded-full mb-3 border border-amber-200/50">
                        <Activity className="w-3.5 h-3.5" /> NEW VENDOR
                      </div>
                      <p className="text-lg font-medium text-amber-950/80 leading-relaxed">
                        Early performance is positive, but transaction history is still limited. Trust score reflects developing platform activity.
                      </p>
                    </>
                  ) : (
                    <p className="text-lg font-medium text-white/90 leading-relaxed">
                      Highly reliable across verified transactions, delivery performance, buyer feedback, and fulfilment history.
                    </p>
                  )}
                  
                  <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-4">
                    <button className={cn("text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 transition-colors",
                      isBronzeMode ? "text-amber-700 hover:text-amber-900" : "text-lime hover:text-lime-400"
                    )}>
                      Why {animatedScore}? <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* TRUST FACTORS */}
            <div className="bg-white rounded-3xl border border-navy/10 shadow-sm overflow-hidden">
              <div className="bg-navy/5 px-6 py-4 border-b border-navy/5 flex items-center justify-between">
                <h2 className="text-xs font-bold text-navy uppercase tracking-widest flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-cobalt" /> Factor Breakdown</h2>
                <div className="text-[9px] font-bold text-navy/40 uppercase tracking-widest">Calculated: 05 Sep 2026</div>
              </div>
              
              <div className="p-6 md:p-8 space-y-5">
                {[
                  { label: 'Transaction History', score: isBronzeMode ? 45 : 96 },
                  { label: 'Buyer Ratings', score: isBronzeMode ? 95 : 91 },
                  { label: 'Delivery Reliability', score: isBronzeMode ? 100 : 94 },
                  { label: 'Quality Feedback', score: isBronzeMode ? 90 : 89 },
                  { label: 'Issue Resolution', score: isBronzeMode ? 0 : 86, empty: isBronzeMode },
                  { label: 'Experience', score: isBronzeMode ? 30 : 93 },
                ].map((factor, i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                    <div className="w-40 text-xs font-bold text-navy">{factor.label}</div>
                    <div className="flex-1 flex items-center gap-4">
                      <div className="flex-1 h-2 bg-navy/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }} 
                          animate={{ width: `${factor.score}%` }} 
                          transition={{ duration: 1, delay: i * 0.1 }}
                          className={cn("h-full rounded-full", 
                            factor.empty ? "bg-transparent" :
                            factor.score >= 90 ? "bg-lime-500" : 
                            factor.score >= 70 ? "bg-cobalt" : 
                            factor.score >= 50 ? "bg-orange-400" : "bg-coral"
                          )} 
                        />
                      </div>
                      <div className="w-8 text-right text-sm font-bold text-navy">
                        {factor.empty ? '—' : factor.score}
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="mt-8 pt-6 border-t border-navy/5">
                  <div className="bg-warm/50 border border-navy/5 p-5 rounded-2xl">
                    <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-3 flex items-center gap-2"><Info className="w-3.5 h-3.5" /> Explaining the Score</div>
                    {isBronzeMode ? (
                      <p className="text-sm font-medium text-navy/80 leading-relaxed">
                        <strong className="text-navy">Positive Signals:</strong> 100% delivery reliability so far and 4.7 average buyer rating.<br/>
                        <strong className="text-navy mt-2 block">Watch Signals:</strong> Only 8 verified transactions completed. Issue resolution history is unavailable due to lack of reported issues.
                      </p>
                    ) : (
                      <p className="text-sm font-medium text-navy/80 leading-relaxed">
                        <strong className="text-navy">Positive Signals:</strong> 96% of verified orders completed successfully. 94% delivery reliability. 4.8 average rating.<br/>
                        <strong className="text-navy mt-2 block">Watch Signals:</strong> Minor delivery delays reported in 2 recent shipments out of 186.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* AI REVIEW OVERVIEW */}
            <div className="bg-white rounded-3xl border border-navy/10 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-navy/5 bg-[linear-gradient(110deg,#ffffff,45%,#f8fafc,55%,#ffffff)] bg-[length:200%_100%] animate-[shimmer_5s_infinite]">
                <h2 className="text-xs font-bold text-navy uppercase tracking-widest flex items-center gap-2 mb-4">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-r from-cobalt to-coral flex items-center justify-center text-white text-[8px] shrink-0">✦</div>
                  AI Review Overview
                </h2>
                <p className="text-sm font-medium text-navy/80 leading-relaxed italic">
                  {isBronzeMode 
                    ? "“Early buyers praise Nexus Tech Store for excellent communication and fast local delivery. There are not enough reviews yet to identify common concerns.”"
                    : "“Buyers consistently praise Vertex Systems for product quality, professional communication and reliable delivery. Most negative feedback relates to occasional shipment delays rather than product defects.”"
                  }
                </p>
                <div className="mt-4 text-[9px] font-bold text-navy/40 uppercase tracking-widest">
                  AI-generated overview from verified customer feedback.
                </div>
              </div>
              <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-navy/5">
                <div className="p-6">
                  <h3 className="text-[10px] font-bold text-lime-700 uppercase tracking-widest mb-4 flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Common Praise</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2 text-sm font-medium text-navy/70"><div className="w-1.5 h-1.5 rounded-full bg-lime-500 mt-1.5 shrink-0" /> Fast communication</li>
                    <li className="flex items-start gap-2 text-sm font-medium text-navy/70"><div className="w-1.5 h-1.5 rounded-full bg-lime-500 mt-1.5 shrink-0" /> Product quality</li>
                    {!isBronzeMode && <li className="flex items-start gap-2 text-sm font-medium text-navy/70"><div className="w-1.5 h-1.5 rounded-full bg-lime-500 mt-1.5 shrink-0" /> Professional enterprise packaging</li>}
                  </ul>
                </div>
                <div className="p-6">
                  <h3 className="text-[10px] font-bold text-orange-600 uppercase tracking-widest mb-4 flex items-center gap-2"><AlertCircle className="w-4 h-4" /> Common Concerns</h3>
                  <ul className="space-y-3">
                    {isBronzeMode ? (
                      <li className="text-sm font-medium text-navy/40 italic">Not enough data to identify trends.</li>
                    ) : (
                      <>
                        <li className="flex items-start gap-2 text-sm font-medium text-navy/70"><div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 shrink-0" /> Occasional delivery delays</li>
                        <li className="flex items-start gap-2 text-sm font-medium text-navy/70"><div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 shrink-0" /> Limited weekend support</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {/* VERIFIED REVIEWS */}
            <div className="bg-white rounded-3xl border border-navy/10 shadow-sm p-6 md:p-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 border-b border-navy/5 pb-6">
                <div>
                  <h2 className="text-xs font-bold text-navy uppercase tracking-widest mb-1">Verified Reviews</h2>
                  <div className="text-3xl font-bold text-navy flex items-center gap-2">{rating} <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" /></div>
                  <div className="text-sm font-medium text-navy/60 mt-1">Based on {reviewsCount} verified ratings</div>
                </div>
                
                <div className="w-full md:w-64 space-y-2">
                  {[
                    { stars: 5, pct: isBronzeMode ? 90 : 76 },
                    { stars: 4, pct: isBronzeMode ? 10 : 17 },
                    { stars: 3, pct: isBronzeMode ? 0 : 5 },
                    { stars: 2, pct: isBronzeMode ? 0 : 1 },
                    { stars: 1, pct: isBronzeMode ? 0 : 1 },
                  ].map(row => (
                    <div key={row.stars} className="flex items-center gap-3 text-xs font-medium text-navy/60">
                      <div className="w-8 flex items-center gap-1 justify-end">{row.stars} <Star className="w-3 h-3 text-yellow-500" /></div>
                      <div className="flex-1 h-1.5 bg-navy/5 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${row.pct}%` }} />
                      </div>
                      <div className="w-8 text-right">{row.pct}%</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between mb-6">
                <div className="flex gap-2">
                  <select className="px-3 py-1.5 bg-warm/50 border border-navy/10 rounded-lg text-xs font-bold text-navy focus:outline-none">
                    <option>All Ratings</option>
                    <option>5 Star</option>
                  </select>
                  <select className="px-3 py-1.5 bg-warm/50 border border-navy/10 rounded-lg text-xs font-bold text-navy focus:outline-none hidden sm:block">
                    <option>Most Relevant</option>
                    <option>Newest</option>
                  </select>
                </div>
              </div>

              <div className="space-y-6">
                {/* Review 1 */}
                <div className="border-b border-navy/5 pb-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="font-bold text-navy">Nova Retail</div>
                      <div className="text-[9px] font-bold text-lime-700 bg-lime/20 px-2 py-0.5 rounded uppercase tracking-widest inline-flex items-center gap-1 mt-1"><CheckCircle2 className="w-3 h-3" /> Verified Purchase</div>
                    </div>
                    <div className="text-right">
                      <div className="flex text-yellow-500 mb-1">
                        <Star className="w-3.5 h-3.5 fill-yellow-500" /><Star className="w-3.5 h-3.5 fill-yellow-500" /><Star className="w-3.5 h-3.5 fill-yellow-500" /><Star className="w-3.5 h-3.5 fill-yellow-500" /><Star className="w-3.5 h-3.5 fill-yellow-500" />
                      </div>
                      <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest">08 Aug 2026</div>
                    </div>
                  </div>
                  <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-2">Deal: Business Laptops</div>
                  <p className="text-sm font-medium text-navy/80 leading-relaxed">
                    “Delivery was on time and the packaging was very professional. Everything arrived safely and communication was fast when we needed to update our billing address.”
                  </p>
                </div>

                {/* Review 2 */}
                {!isBronzeMode && (
                  <div className="border-b border-navy/5 pb-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="font-bold text-navy">Enterprise Buyer</div>
                        <div className="text-[9px] font-bold text-lime-700 bg-lime/20 px-2 py-0.5 rounded uppercase tracking-widest inline-flex items-center gap-1 mt-1"><CheckCircle2 className="w-3 h-3" /> Verified Purchase</div>
                      </div>
                      <div className="text-right">
                        <div className="flex text-yellow-500 mb-1">
                          <Star className="w-3.5 h-3.5 fill-yellow-500" /><Star className="w-3.5 h-3.5 fill-yellow-500" /><Star className="w-3.5 h-3.5 fill-yellow-500" /><Star className="w-3.5 h-3.5 fill-yellow-500" /><Star className="w-3.5 h-3.5 text-navy/20" />
                        </div>
                        <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest">22 Jul 2026</div>
                      </div>
                    </div>
                    <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-2">Deal: Workstation PCs</div>
                    <p className="text-sm font-medium text-navy/80 leading-relaxed">
                      “Great hardware quality. We experienced a slight 1-day delay on the final shipment, but support kept us informed. Will buy again.”
                    </p>
                  </div>
                )}
              </div>

              {/* PAGINATION UI */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-navy/5">
                <button className="text-xs font-bold text-navy/40 hover:text-navy transition-colors">← Previous</button>
                <div className="hidden sm:flex gap-2">
                  <button className="w-8 h-8 rounded-lg bg-navy text-white text-xs font-bold flex items-center justify-center shadow-sm">1</button>
                  <button className="w-8 h-8 rounded-lg bg-white border border-navy/10 text-navy text-xs font-bold hover:bg-navy/5 flex items-center justify-center transition-colors">2</button>
                  <button className="w-8 h-8 rounded-lg bg-white border border-navy/10 text-navy text-xs font-bold hover:bg-navy/5 flex items-center justify-center transition-colors">3</button>
                  <span className="text-navy/40 text-xs font-bold flex items-end">...</span>
                  <button className="w-8 h-8 rounded-lg bg-white border border-navy/10 text-navy text-xs font-bold hover:bg-navy/5 flex items-center justify-center transition-colors">{isBronzeMode ? 1 : 18}</button>
                </div>
                <div className="sm:hidden text-xs font-bold text-navy/40">Page 1 of {isBronzeMode ? 1 : 18}</div>
                <button className="text-xs font-bold text-navy hover:text-cobalt transition-colors">Next →</button>
              </div>

            </div>

          </div>

          {/* RIGHT COLUMN - CONTEXT PANEL */}
          <div className="w-full lg:w-[35%]">
            <div className="sticky top-28 space-y-6">
              
              <div className="bg-white rounded-3xl border border-navy/10 shadow-sm p-6">
                <h3 className="text-xs font-bold text-navy uppercase tracking-widest mb-6 flex items-center gap-2"><Activity className="w-4 h-4 text-cobalt" /> Performance History</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-navy/5 pb-3">
                    <span className="text-sm font-medium text-navy/60">Completed Transactions</span>
                    <span className="font-bold text-navy">{transactionsCount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-navy/5 pb-3">
                    <span className="text-sm font-medium text-navy/60">Last 90 Days</span>
                    <span className="font-bold text-navy">{isBronzeMode ? 8 : 186}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-navy/5 pb-3">
                    <span className="text-sm font-medium text-navy/60">Delivery On-Time</span>
                    <span className="font-bold text-lime-700">{isBronzeMode ? '100%' : '94%'}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-navy/5 pb-3">
                    <span className="text-sm font-medium text-navy/60">Repeat Buyers</span>
                    <span className="font-bold text-navy">{isBronzeMode ? '12%' : '38%'}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2">
                    <span className="text-sm font-medium text-navy/60">Avg. Fulfilment Time</span>
                    <span className="font-bold text-navy">{isBronzeMode ? '1.8 Days' : '2.4 Days'}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-navy/10 shadow-sm p-6">
                <h3 className="text-xs font-bold text-navy uppercase tracking-widest mb-6 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-orange-500" /> Trust Trend</h3>
                
                <div className="flex items-end gap-2 h-24 mb-4">
                  {[
                    { m: 'Apr', v: isBronzeMode ? 0 : 86 },
                    { m: 'May', v: isBronzeMode ? 0 : 88 },
                    { m: 'Jun', v: isBronzeMode ? 0 : 90 },
                    { m: 'Jul', v: isBronzeMode ? 0 : 91 },
                    { m: 'Aug', v: isBronzeMode ? 50 : 92 },
                    { m: 'Sep', v: isBronzeMode ? 61 : 92 },
                  ].map((pt, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
                      <div className="w-full bg-navy/5 rounded-t-sm flex items-end overflow-hidden h-full">
                        <div className="w-full bg-cobalt/40 group-hover:bg-cobalt transition-colors" style={{ height: `${pt.v}%` }} />
                      </div>
                      <span className="text-[8px] font-bold uppercase tracking-widest text-navy/40">{pt.m}</span>
                      
                      {pt.v > 0 && (
                        <div className="absolute -top-6 bg-navy text-white text-[9px] font-bold px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          {pt.v}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest text-center mt-2">
                  {isBronzeMode ? 'Trust score developing.' : 'Stable • Consistent High Performance'}
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-navy/10 shadow-sm p-6">
                <h3 className="text-xs font-bold text-navy uppercase tracking-widest mb-4">Platform Experience</h3>
                <div className="space-y-3 text-sm font-medium text-navy/70">
                  <div className="flex gap-2">
                    <CheckCircle2 className="w-4 h-4 text-lime-600 shrink-0 mt-0.5" />
                    <div>{isBronzeMode ? 'Consumer Electronics' : 'Enterprise Electronics, IT Hardware, Software Subscriptions'}</div>
                  </div>
                  <div className="flex gap-2">
                    <MapPin className="w-4 h-4 text-cobalt shrink-0 mt-0.5" />
                    <div>Mumbai, Pune, Navi Mumbai, Thane</div>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* MOBILE STICKY CTA */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-navy/5 z-40 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
        <button onClick={() => router.push("/login?returnTo=/buyer/requirements/new")} className="w-full py-4 rounded-xl bg-cobalt text-white font-bold shadow-lg flex items-center justify-center gap-2">
          Request Quote <ArrowRight className="w-5 h-5" />
        </button>
      </div>

    </div>
  );
}

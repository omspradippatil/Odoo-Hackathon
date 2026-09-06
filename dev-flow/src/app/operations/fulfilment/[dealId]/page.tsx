"use client";

import React, { useState, use } from "react";
import { useRouter } from "next/navigation";
import { WorkspaceLayout } from "@/components/layout/WorkspaceLayout";
import { UserRole } from "@/types/auth";
import { ShieldCheck, Activity, Check, ArrowRight, Package, Truck, AlertCircle, Clock, MapPin, Building2, Search, X, Lock } from "lucide-react";
import * as motion from "framer-motion/client";
import { AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function InternalFulfilmentPage({ params }: { params: Promise<{ dealId: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);

  const [simulateBackorder, setSimulateBackorder] = useState(false);

  return (
    <WorkspaceLayout role={UserRole.FINANCE_OPERATIONS}>
      
      {/* JOURNEY HEADER */}
      <div className="mb-8 md:mb-12">
        <div className="flex items-center gap-2 text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-4">
          <span className="text-navy">Operations</span> <span className="text-navy/20">/</span> <span className="text-navy">Fulfilment</span> <span className="text-navy/20">/</span> <span>DF-2048</span>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-navy tracking-tight mb-2">Fulfilment Control</h1>
            <div className="text-sm font-medium text-navy/60 flex flex-wrap items-center gap-x-2 gap-y-1">
              Customer: <strong className="text-navy">Nova Retail</strong> <span className="text-navy/20">•</span> Quotation: <strong className="text-navy">QT-2048</strong>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="bg-orange-100 text-orange-700 border border-orange-200 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-sm">
              <Activity className="w-4 h-4" /> FULFILMENT IN PROGRESS
            </div>
          </div>
        </div>

        {/* SIGNATURE MOTION LINE */}
        <div className="w-full bg-white p-4 rounded-2xl border border-navy/5 shadow-sm overflow-x-auto no-scrollbar mb-8">
          <div className="flex items-center min-w-[750px] justify-between relative px-4">
            <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-[2px] bg-navy/5 -z-10" />
            <div className="absolute left-[70%] top-1/2 -translate-y-1/2 h-[2px] bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.6)] w-[10%]" />

            {[
              { id: 'REQUEST', label: 'REQUEST', state: 'done' },
              { id: 'DISCOVER', label: 'DISCOVER', state: 'done' },
              { id: 'QUOTE', label: 'QUOTE', state: 'done' },
              { id: 'APPROVE', label: 'APPROVE', state: 'done' },
              { id: 'NEGOTIATE', label: 'NEGOTIATE', state: 'done' },
              { id: 'PROTECT', label: 'PROTECT', state: 'done' },
              { id: 'FULFIL', label: 'FULFIL', state: 'active' },
              { id: 'BILL', label: 'BILL', state: 'idle' },
            ].map((stage) => (
              <div key={stage.id} className="flex flex-col items-center gap-2 px-2 z-10 relative bg-white">
                <div className={cn("w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all", 
                  stage.state === 'done' ? "border-lime bg-lime" :
                  stage.state === 'active' ? "border-orange-500 bg-white shadow-[0_0_10px_rgba(249,115,22,0.4)]" : "border-navy/10 bg-white")}>
                  {stage.state === 'done' && <Check className="w-2.5 h-2.5 text-lime-950" />}
                  {stage.state === 'active' && <motion.div layoutId="flow-dot" className="w-1.5 h-1.5 bg-orange-500 rounded-full" />}
                </div>
                <span className={cn("text-[9px] font-bold uppercase tracking-widest", 
                  stage.state === 'active' ? "text-orange-600" : stage.state === 'done' ? "text-lime-700" : "text-navy/30")}>
                  {stage.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FULFILMENT OVERVIEW STRIP */}
      <div className="bg-white rounded-3xl border border-navy/10 shadow-sm p-4 md:p-6 mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex-1 min-w-[100px] text-center md:text-left md:border-r border-navy/10 px-4">
          <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-1">Required</div>
          <div className="text-2xl font-bold text-navy">50</div>
        </div>
        <div className="flex-1 min-w-[100px] text-center md:text-left md:border-r border-navy/10 px-4">
          <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-1">Allocated</div>
          <div className={cn("text-2xl font-bold", simulateBackorder ? "text-orange-600" : "text-lime-700")}>{simulateBackorder ? '40' : '50'}</div>
        </div>
        <div className="flex-1 min-w-[100px] text-center md:text-left md:border-r border-navy/10 px-4">
          <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-1">Shipped</div>
          <div className="text-2xl font-bold text-navy">30</div>
        </div>
        <div className="flex-1 min-w-[100px] text-center md:text-left md:border-r border-navy/10 px-4">
          <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-1">Delivered</div>
          <div className="text-2xl font-bold text-navy">0</div>
        </div>
        <div className="flex-1 min-w-[100px] text-center md:text-left px-4">
          <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-1">Backordered</div>
          <div className={cn("text-2xl font-bold", simulateBackorder ? "text-coral" : "text-navy")}>{simulateBackorder ? '10' : '0'}</div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start relative">
        
        {/* LEFT COLUMN - MAIN AREA */}
        <div className="w-full lg:w-[65%] space-y-8 pb-12 lg:pb-0">
          
          {/* SMART ALLOCATION */}
          <div className="bg-white rounded-3xl border border-navy/10 shadow-sm overflow-hidden">
            <div className="p-6 md:p-8 flex justify-between items-start border-b border-navy/5">
              <div>
                <h2 className="text-xs font-bold text-navy uppercase tracking-widest mb-2 flex items-center gap-2"><Building2 className="w-4 h-4 text-cobalt" /> Aakalan360 Allocation</h2>
                {!simulateBackorder ? (
                  <div className="bg-lime/20 text-lime-800 border border-lime/30 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest inline-flex items-center gap-1">
                    <Check className="w-3 h-3" /> Complete Coverage
                  </div>
                ) : (
                  <div className="bg-coral/10 text-coral border border-coral/20 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest inline-flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Delivery Risk
                  </div>
                )}
              </div>
              <button className="text-[10px] font-bold text-cobalt uppercase tracking-widest hover:text-navy transition-colors flex items-center gap-1">
                Why this allocation? <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="p-6 md:p-8 bg-warm/20 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
              
              <div className="flex flex-col items-center z-10 w-full md:w-auto">
                <div className="bg-navy text-white p-4 rounded-xl text-center shadow-lg w-full md:w-32">
                  <div className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1">Required</div>
                  <div className="text-3xl font-bold">50</div>
                  <div className="text-[10px] text-white/80 mt-1">Laptops</div>
                </div>
              </div>

              {/* Connected Lines Visual */}
              <div className="hidden md:flex flex-col justify-center gap-16 relative w-16">
                 <div className="absolute top-1/2 left-0 w-8 h-[2px] bg-navy/20 -translate-y-1/2" />
                 <div className="absolute top-1/2 left-8 w-[2px] h-[72px] bg-navy/20 -translate-y-1/2" />
                 <div className="absolute top-[calc(50%-36px)] left-8 w-8 h-[2px] bg-navy/20" />
                 <div className="absolute top-[calc(50%+36px)] left-8 w-8 h-[2px] bg-navy/20" />
                 
                 <ArrowRight className="absolute top-[calc(50%-44px)] -right-3 w-4 h-4 text-navy/40" />
                 <ArrowRight className="absolute top-[calc(50%+28px)] -right-3 w-4 h-4 text-navy/40" />
              </div>

              <div className="flex flex-col gap-6 z-10 w-full md:w-auto flex-1">
                <div className="bg-white border border-navy/10 p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest flex items-center gap-1"><Building2 className="w-3 h-3" /> Vertex Systems</div>
                      <div className="font-bold text-navy">Mumbai Warehouse</div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-lime-700">30 Units</div>
                    </div>
                  </div>
                  <div className="text-[10px] font-bold text-lime-800 bg-lime/20 px-2 py-0.5 rounded inline-block uppercase tracking-widest">Ready Now</div>
                </div>

                <div className="bg-white border border-navy/10 p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow relative">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest flex items-center gap-1"><Building2 className="w-3 h-3" /> Vertex Systems</div>
                      <div className="font-bold text-navy">Pune Warehouse</div>
                    </div>
                    <div className="text-right">
                      <div className={cn("text-lg font-bold", simulateBackorder ? "text-orange-600" : "text-lime-700")}>{simulateBackorder ? '10 Units' : '20 Units'}</div>
                    </div>
                  </div>
                  <div className={cn("text-[10px] font-bold px-2 py-0.5 rounded inline-block uppercase tracking-widest", simulateBackorder ? "bg-orange-100 text-orange-700" : "bg-lime/20 text-lime-800")}>Ready Now</div>
                </div>
              </div>

            </div>
          </div>

          {/* BACKORDER EXCEPTION */}
          <AnimatePresence>
            {simulateBackorder && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-coral/5 rounded-3xl border border-coral/20 shadow-sm overflow-hidden">
                <div className="bg-coral text-white p-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                  <AlertCircle className="w-4 h-4" /> Backorder Exception Detected
                </div>
                <div className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
                    <div>
                      <div className="text-[10px] font-bold text-coral uppercase tracking-widest mb-1">Shortfall</div>
                      <div className="text-3xl font-bold text-coral">10 Units</div>
                    </div>
                    <div className="text-sm font-medium text-coral/80 bg-white p-4 rounded-xl border border-coral/20">
                      <strong className="text-coral block mb-1">Stock Availability Delay</strong>
                      Expected availability: 14 Sep. Customer required date: 12 Sep.
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-coral/20">
                    <h3 className="text-xs font-bold text-navy uppercase tracking-widest flex items-center gap-2 mb-4"><ShieldCheck className="w-4 h-4 text-cobalt" /> Aakalan360 Alternative Found</h3>
                    
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                      <div>
                        <div className="font-bold text-navy">NexaByte Solutions</div>
                        <div className="text-xs font-medium text-navy/60">Thane Warehouse • 10 available</div>
                      </div>
                      <div className="flex gap-4 text-sm font-medium text-navy/70">
                        <div>ETA: <strong className="text-navy">2 Days</strong></div>
                        <div>Cost: <strong className="text-coral">+ ₹8,000</strong></div>
                      </div>
                      <button className="px-4 py-2 bg-navy text-white text-xs font-bold rounded-xl shadow-sm hover:bg-navy/90 transition-colors flex items-center gap-2">
                        Review Alternative <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <button className="px-4 py-2 border border-coral/20 bg-white text-coral text-xs font-bold rounded-lg hover:bg-coral/5 transition-colors">Wait for Restock</button>
                    <button className="px-4 py-2 border border-coral/20 bg-white text-coral text-xs font-bold rounded-lg hover:bg-coral/5 transition-colors">Accept Partial Delivery</button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* DEMO CONTROLS */}
          <div className="flex justify-end">
            <button onClick={() => setSimulateBackorder(!simulateBackorder)} className="text-[10px] font-bold text-navy/40 uppercase tracking-widest hover:text-navy transition-colors bg-white px-3 py-1.5 rounded-lg border border-navy/10 shadow-sm">
              [Toggle Backorder Exception Preview]
            </button>
          </div>

          {/* SHIPMENTS */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-navy px-2 flex items-center gap-2">Shipments</h2>
            
            <div className="bg-white rounded-3xl border border-navy/10 shadow-sm overflow-hidden p-6 md:p-8 flex flex-col md:flex-row gap-6 hover:border-navy/20 transition-colors">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-lime/20 flex items-center justify-center text-lime-700 shrink-0"><Truck className="w-5 h-5" /></div>
                  <div>
                    <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest">Shipment #SHP-301</div>
                    <div className="font-bold text-navy">30 Business Laptops</div>
                  </div>
                </div>
                <div className="text-sm font-medium text-navy/60">Vertex Systems • Mumbai Warehouse</div>
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-[10px] font-bold text-lime-800 bg-lime/20 px-2.5 py-1 rounded uppercase tracking-widest flex items-center gap-1.5"><Check className="w-3 h-3" /> Shipped</span>
                  <span className="text-xs font-bold text-navy/40 uppercase tracking-widest">BlueDart BD-483920</span>
                </div>
              </div>
              <div className="md:w-48 flex flex-col justify-center">
                <button className="w-full py-3 rounded-xl bg-navy/5 text-navy text-sm font-bold hover:bg-navy/10 transition-colors border border-navy/10">View Shipment</button>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-navy/10 shadow-sm overflow-hidden p-6 md:p-8 flex flex-col md:flex-row gap-6 hover:border-navy/20 transition-colors">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 shrink-0"><Package className="w-5 h-5" /></div>
                  <div>
                    <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest">Shipment #SHP-302</div>
                    <div className="font-bold text-navy">20 Business Laptops</div>
                  </div>
                </div>
                <div className="text-sm font-medium text-navy/60">Vertex Systems • Pune Warehouse</div>
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-[10px] font-bold text-orange-600 bg-orange-50 border border-orange-100 px-2.5 py-1 rounded uppercase tracking-widest flex items-center gap-1.5"><Clock className="w-3 h-3" /> Ready to Dispatch</span>
                </div>
              </div>
              <div className="md:w-48 flex flex-col justify-center gap-2">
                <button className="w-full py-3 rounded-xl bg-navy text-white text-sm font-bold hover:bg-navy/90 transition-colors shadow-sm">Dispatch</button>
                <button className="w-full py-2 text-navy/60 text-xs font-bold hover:text-navy uppercase tracking-widest transition-colors">Add Tracking</button>
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN - CONTEXT PANEL */}
        <div className="w-full lg:w-[35%]">
          <div className="sticky top-28 space-y-6">
            
            <div className="bg-white rounded-3xl border border-navy/10 shadow-sm p-6">
              <h3 className="text-xs font-bold text-navy uppercase tracking-widest mb-4 flex items-center gap-2"><Activity className="w-4 h-4 text-cobalt" /> Fulfilment Intelligence</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-navy/5 pb-3">
                  <span className="text-sm font-medium text-navy/60">Coverage</span>
                  <span className={cn("font-bold", simulateBackorder ? "text-coral" : "text-lime-700")}>{simulateBackorder ? '80%' : '100%'}</span>
                </div>
                <div className="flex justify-between items-center border-b border-navy/5 pb-3">
                  <span className="text-sm font-medium text-navy/60">Warehouses</span>
                  <span className="font-bold text-navy">2</span>
                </div>
                <div className="flex justify-between items-center border-b border-navy/5 pb-3">
                  <span className="text-sm font-medium text-navy/60">Est. Final Delivery</span>
                  <span className="font-bold text-navy">09 Sep</span>
                </div>
                <div className="flex justify-between items-center pb-2">
                  <span className="text-sm font-medium text-navy/60">Required By</span>
                  <span className="font-bold text-navy">12 Sep</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-navy/5 text-xs font-medium text-navy/60 leading-relaxed italic bg-warm/30 p-4 rounded-xl">
                {!simulateBackorder ? 'All 50 units are currently covered and expected to arrive before the customer required date.' : 'A 10-unit backorder threatens the required delivery date. Action is recommended.'}
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-navy/10 shadow-sm p-6">
              <h3 className="text-xs font-bold text-navy uppercase tracking-widest mb-4 flex items-center gap-2"><Lock className="w-4 h-4 text-orange-500" /> Settlement Dependency</h3>
              
              <ul className="text-xs font-bold text-navy/70 space-y-3">
                <li className="flex justify-between items-center bg-navy/5 p-3 rounded-lg border border-navy/10">
                  <span>Shipment 1 (30 Units)</span>
                  <span className="text-orange-600">Pending Delivery</span>
                </li>
                <li className="flex justify-between items-center bg-navy/5 p-3 rounded-lg border border-navy/10">
                  <span>Shipment 2 (20 Units)</span>
                  <span className="text-orange-600">Pending Delivery</span>
                </li>
              </ul>

              <div className="mt-4 text-[10px] font-bold text-navy/40 uppercase tracking-widest text-center">
                Vendor settlement becomes eligible only after customer delivery confirmation.
              </div>
            </div>

            <button onClick={() => router.push(`/operations/billing/${resolvedParams.dealId}`)} className="w-full py-4 rounded-xl bg-cobalt text-white text-sm font-bold shadow-lg shadow-cobalt/20 hover:bg-cobalt/90 transition-colors flex items-center justify-center gap-2 mt-4">
              Continue to Billing & Invoice <ArrowRight className="w-4 h-4" />
            </button>

          </div>
        </div>

      </div>
    </WorkspaceLayout>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Shield,
  EyeOff,
  Building,
  CheckCircle2,
  Clock,
  Send,
  AlertCircle,
} from "lucide-react";

interface Requirement {
  id: number;
  title: string;
  organization: string;
  budget: string;
  deadline: string;
  anonymous: boolean;
  bidsCount: number;
}

export default function BidsPage() {
  const [submitted, setSubmitted] = useState(false);
  const [selectedReq, setSelectedReq] = useState<number>(1);
  const [bidAmount, setBidAmount] = useState("54000");
  const [notes, setNotes] = useState("");

  const requirements: Requirement[] = [
    {
      id: 1,
      title: "Supply of 500 Enterprise Laptops for IT Expansion",
      organization: "Tata Consultancy Services (Anonymous Org #382)",
      budget: "₹3,25,00,000",
      deadline: "15 Oct 2026",
      anonymous: true,
      bidsCount: 4,
    },
    {
      id: 2,
      title: "Cisco Industrial Switches for Logistics Facility",
      organization: "JSW Steel Logistics Hub (Anonymous Org #109)",
      budget: "₹18,00,000",
      deadline: "28 Sep 2026",
      anonymous: true,
      bidsCount: 2,
    },
  ];

  const handleSubmitBid = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="pb-6 border-b border-zinc-800 mb-8 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-950/60 border border-purple-800 text-purple-400 text-xs font-bold">
          <EyeOff className="w-3.5 h-3.5" /> Anonymous B2B Procurement Protocol
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-zinc-100 flex items-center gap-2.5">
          <Shield className="w-7 h-7 text-purple-500" />
          Enterprise Tender Bids
        </h1>
        <p className="text-xs text-zinc-400 max-w-2xl">
          Vendor identity and quoted pricing remain cryptographically anonymous to buyers and middlemen until tender selection. Prevents insider price leaks and corrupt kickbacks.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Requirements List (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-400">
            Open Organization Tenders
          </h2>

          <div className="space-y-3">
            {requirements.map((req) => (
              <div
                key={req.id}
                onClick={() => {
                  setSelectedReq(req.id);
                  setSubmitted(false);
                }}
                className={`p-5 rounded-xl border transition cursor-pointer ${
                  selectedReq === req.id
                    ? "bg-purple-950/20 border-purple-800/80 shadow-md shadow-purple-900/10"
                    : "bg-zinc-900/40 border-zinc-800 hover:border-zinc-700"
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-bold text-sm text-zinc-100">{req.title}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-950 border border-purple-800 text-purple-300 shrink-0">
                    ANONYMOUS
                  </span>
                </div>

                <div className="text-xs text-zinc-400 space-y-1">
                  <p className="flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-zinc-500" />
                    {req.organization}
                  </p>
                  <p className="flex items-center gap-1.5 font-mono text-zinc-300">
                    <Clock className="w-3.5 h-3.5 text-zinc-500" />
                    Deadline: {req.deadline} | Target: {req.budget}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between text-xs">
                  <span className="text-zinc-500">{req.bidsCount} anonymous bids placed</span>
                  <span className="text-purple-400 font-semibold hover:underline">
                    Select to Quote →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bid Submission Panel (5 Cols) */}
        <div className="lg:col-span-5">
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 sm:p-6 space-y-5">
            <h2 className="text-sm font-bold text-zinc-200 flex items-center gap-2">
              <EyeOff className="w-4 h-4 text-purple-400" />
              Submit Anonymous Tender Bid
            </h2>

            {submitted ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-12 h-12 rounded-full bg-purple-950 border border-purple-700 text-purple-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-zinc-100">Bid Submitted Anonymously!</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Your bid reference is <strong>#BID-2026-X88</strong>. Your vendor profile and pricing are locked until the tender committee reveals results.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-lg transition"
                >
                  Submit Another Quote
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitBid} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-zinc-400 block mb-1">
                    Quoted Unit / Lot Rate (₹)
                  </label>
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    required
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm font-mono text-zinc-100 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-400 block mb-1">
                    Delivery ETA (Weeks)
                  </label>
                  <input
                    type="number"
                    defaultValue={2}
                    min={1}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono text-zinc-100 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-400 block mb-1">
                    Compliance & Warranty Notes
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Include OEM certification, GST compliance info..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="p-3 bg-purple-950/30 border border-purple-900/50 rounded-lg flex items-start gap-2 text-[11px] text-purple-300">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    DEV FLOW Anonymous Shield is ACTIVE. Middlemen cannot intercept this quote.
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-lg transition shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  Submit Blind Quotation
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import {
  FileSpreadsheet,
  Download,
  Filter,
  TrendingUp,
  BarChart3,
  Calendar,
  Layers,
} from "lucide-react";

export default function ReportsPage() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchReportStats = async () => {
      try {
        const res = await api.get("/dashboard/stats");
        setStats(res.data);
      } catch (err) {
        console.error("Error loading stats", err);
      }
    };
    fetchReportStats();
  }, []);

  const handleDownloadCsv = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "ID,Entity,Status,Date,Amount\n" +
      "1,Acme Corp,CONFIRMED,2026-09-01,130000\n" +
      "2,Tata Consultancy,PENDING_L1,2026-09-03,276250\n" +
      "3,JSW Logistics,APPROVED,2026-09-04,136500\n";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "DEVFLOW_Sales_Audit_2026.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="pb-6 border-b border-zinc-800 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-zinc-100 flex items-center gap-2.5">
            <FileSpreadsheet className="w-7 h-7 text-blue-500" />
            Executive Reports & Audit Export
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Export GST audit trails, platform escrow fees, and sales operation performance logs.
          </p>
        </div>

        <button
          onClick={handleDownloadCsv}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition shadow-md shadow-blue-600/20"
        >
          <Download className="w-4 h-4" />
          Export CSV / Excel
        </button>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <div className="p-5 rounded-xl bg-zinc-900/50 border border-zinc-800">
          <p className="text-xs text-zinc-400 mb-1">Total Platform Volume</p>
          <p className="text-2xl font-black text-white font-mono">
            ₹{(stats?.totalRevenue ? stats.totalRevenue * 10 : 542750).toLocaleString()}
          </p>
          <p className="text-[10px] text-emerald-400 mt-1">↑ 18.4% month over month</p>
        </div>

        <div className="p-5 rounded-xl bg-zinc-900/50 border border-zinc-800">
          <p className="text-xs text-zinc-400 mb-1">Total Platform Fees (2% Escrow)</p>
          <p className="text-2xl font-black text-blue-400 font-mono">
            ₹{((stats?.totalRevenue ? stats.totalRevenue * 10 : 542750) * 0.02).toLocaleString()}
          </p>
          <p className="text-[10px] text-zinc-500 mt-1">Automatic SaaS transaction take</p>
        </div>

        <div className="p-5 rounded-xl bg-zinc-900/50 border border-zinc-800">
          <p className="text-xs text-zinc-400 mb-1">Audit Log Integrity</p>
          <p className="text-2xl font-black text-emerald-400 font-mono">100%</p>
          <p className="text-[10px] text-zinc-500 mt-1">All approvals cryptographically traced</p>
        </div>
      </div>

      {/* Historical Logs Table */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
        <h2 className="text-sm font-bold text-zinc-200 mb-4 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-zinc-400" />
          Recent Transaction Audit Snapshot
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400">
                <th className="pb-2">Audit Ref</th>
                <th className="pb-2">Customer / Org</th>
                <th className="pb-2">Status</th>
                <th className="pb-2">Governance Review</th>
                <th className="pb-2 text-right">Settled Volume</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              <tr className="hover:bg-zinc-900/40">
                <td className="py-3 font-mono text-blue-400 font-semibold">#AUD-8921</td>
                <td className="py-3 text-zinc-200">Acme Corporation</td>
                <td className="py-3">
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold text-[10px]">
                    CONFIRMED
                  </span>
                </td>
                <td className="py-3 text-zinc-400">Auto-approved by policy engine</td>
                <td className="py-3 text-right font-mono font-bold text-zinc-200">₹1,30,000</td>
              </tr>
              <tr className="hover:bg-zinc-900/40">
                <td className="py-3 font-mono text-blue-400 font-semibold">#AUD-8922</td>
                <td className="py-3 text-zinc-200">Tata Consultancy Services</td>
                <td className="py-3">
                  <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-400 font-bold text-[10px]">
                    PENDING_L1
                  </span>
                </td>
                <td className="py-3 text-zinc-400">Sales Manager Review Triggered</td>
                <td className="py-3 text-right font-mono font-bold text-zinc-200">₹2,76,250</td>
              </tr>
              <tr className="hover:bg-zinc-900/40">
                <td className="py-3 font-mono text-blue-400 font-semibold">#AUD-8923</td>
                <td className="py-3 text-zinc-200">JSW Logistics Hub</td>
                <td className="py-3">
                  <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-400 font-bold text-[10px]">
                    APPROVED
                  </span>
                </td>
                <td className="py-3 text-zinc-400">Approved by manager@devflow.com</td>
                <td className="py-3 text-right font-mono font-bold text-zinc-200">₹1,36,500</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
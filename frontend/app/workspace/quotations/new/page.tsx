"use client";
import { useState } from 'react';
import RiskScoreBadge from '@/components/quotation/RiskScoreBadge';

export default function NewQuotation() {
  const [riskScore, setRiskScore] = useState(0.05);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 p-4 md:p-8 flex flex-col md:flex-row gap-8">
      {/* Left panel: Product Picker */}
      <div className="flex-1 border border-zinc-800 rounded-lg p-6 bg-zinc-900">
        <h2 className="text-2xl font-bold mb-4">Products</h2>
        <input type="text" placeholder="Search..." className="w-full bg-zinc-950 border border-zinc-800 rounded px-4 py-2 mb-4" />
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 border border-zinc-800 rounded bg-zinc-950">
            <div>
              <p className="font-bold">MacBook Pro M3</p>
              <p className="text-zinc-400">$1,999</p>
            </div>
            <button className="bg-blue-600 px-4 py-2 rounded font-bold hover:bg-blue-700">Add</button>
          </div>
        </div>
      </div>

      {/* Right panel: Cart */}
      <div className="w-full md:w-96 border border-zinc-800 rounded-lg p-6 bg-zinc-900 flex flex-col">
        <h2 className="text-2xl font-bold mb-4">Cart</h2>
        <div className="flex-1">
          <div className="mb-4">
            <p className="font-bold">MacBook Pro M3</p>
            <div className="flex justify-between items-center mt-2">
              <input type="number" defaultValue={1} className="w-16 bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-center" />
              <input type="number" placeholder="Disc %" className="w-20 bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-center" />
            </div>
          </div>
        </div>
        
        {/* Bottom bar */}
        <div className="border-t border-zinc-800 pt-4 mt-4">
          <div className="flex justify-between items-center mb-4">
            <span>Risk Score:</span>
            <RiskScoreBadge score={riskScore} />
          </div>
          <button className="w-full bg-blue-600 py-3 rounded font-bold hover:bg-blue-700">Create Quotation</button>
        </div>
      </div>
    </div>
  );
}
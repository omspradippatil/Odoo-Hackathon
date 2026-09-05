"use client";
import { useState } from 'react';
import UpiModal from '@/components/payment/UpiModal';

export default function Checkout() {
  const [showUpi, setShowUpi] = useState(false);
  const [paid, setPaid] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 p-8 flex items-center justify-center">
      <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-xl max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">Local Checkout</h1>
        
        <div className="space-y-4 mb-8">
          <div className="flex justify-between border-b border-zinc-800 pb-2">
            <span>Fresh Organic Apples (2kg)</span>
            <span>₹400</span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>₹400</span>
          </div>
        </div>

        {!paid ? (
          <button 
            onClick={() => setShowUpi(true)}
            className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-lg font-bold text-lg transition-colors"
          >
            Pay via UPI
          </button>
        ) : (
          <div className="text-center">
            <div className="bg-emerald-500/20 text-emerald-500 p-4 rounded-lg mb-4 font-bold">
              Payment Successful!
            </div>
            <button className="text-blue-400 hover:underline">Download Invoice</button>
          </div>
        )}

        {showUpi && !paid && (
          <UpiModal amount={400} onSuccess={() => { setShowUpi(false); setPaid(true); }} />
        )}
      </div>
    </div>
  );
}
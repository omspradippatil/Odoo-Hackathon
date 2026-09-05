"use client";
import { useState } from 'react';

export default function UpiModal({ amount, onSuccess }: { amount: number, onSuccess: () => void }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const handlePay = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(onSuccess, 1000);
    }, 1500);
  };
  
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-gray-50 p-8 rounded-lg max-w-sm w-full text-center">
        {!success ? (
          <>
            <h2 className="text-xl font-bold mb-4">DEV FLOW UPI</h2>
            <p className="mb-4 text-gray-500">devflow@upi</p>
            <div className="bg-white w-48 h-48 mx-auto mb-8 rounded">QR</div>
            <button onClick={handlePay} disabled={loading} className="w-full bg-blue-600 py-3 rounded text-white font-bold">
              {loading ? 'Processing...' : `Pay ₹${amount}`}
            </button>
          </>
        ) : (
          <div className="text-emerald-500 text-2xl font-bold">Success!</div>
        )}
      </div>
    </div>
  );
}
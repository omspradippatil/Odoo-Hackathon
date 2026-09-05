"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { Product } from "@/types";
import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowLeft,
  Smartphone,
  QrCode,
  Sparkles,
  RefreshCw,
  Clock,
} from "lucide-react";

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentId, setPaymentId] = useState<number | null>(null);
  const [mockUpiUrl, setMockUpiUrl] = useState("");
  const [paying, setPaying] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [confirmData, setConfirmData] = useState<any>(null);

  useEffect(() => {
    const initOrder = async () => {
      setLoading(true);
      try {
        // Fetch all products and find the matching one
        const res = await api.get<Product[]>("/products");
        const found = res.data.find((p) => p.id.toString() === productId) || res.data[0];
        setProduct(found);

        // Initiate Mock UPI Escrow Payment on Backend
        const payRes = await api.post("/payments/initiate", {
          buyerId: 5, // Customer
          sellerId: 2, // Sales Rep / Seller
          amount: found.basePrice,
        });

        setPaymentId(payRes.data.paymentId);
        setMockUpiUrl(payRes.data.mockUpiUrl);
      } catch (err) {
        console.error("Failed to initiate checkout", err);
      } finally {
        setLoading(false);
      }
    };

    initOrder();
  }, [productId]);

  const handlePay = async () => {
    if (!paymentId) return;
    setPaying(true);

    // Simulated 1.5s UPI processing animation
    setTimeout(async () => {
      try {
        const confirmRes = await api.post(`/payments/${paymentId}/confirm`);
        setConfirmData(confirmRes.data);
        setPaymentConfirmed(true);
      } catch (err) {
        console.error("Payment confirmation failed", err);
      } finally {
        setPaying(false);
      }
    }, 1500);
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center text-zinc-500">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-blue-500" />
        Securing Escrow Payment Session...
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <Link
        href="/local"
        className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-100 mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Marketplace
      </Link>

      <div className="border border-zinc-800 bg-zinc-900/60 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Title */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-800 text-emerald-400 text-[11px] font-bold">
            <Lock className="w-3 h-3" /> DEV FLOW Escrow Vault Active
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-zinc-100">
            {paymentConfirmed ? "Payment Confirmed!" : "Pay via Mock UPI"}
          </h1>
          <p className="text-xs text-zinc-400">
            {paymentConfirmed
              ? "Funds are securely locked in escrow until delivery is verified."
              : "Prototype demo UPI payment flow with automatic 2% platform fee calculation."}
          </p>
        </div>

        {/* Product Order Summary */}
        {product && (
          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-400">Selected Item:</span>
              <span className="font-bold text-zinc-200">{product.name}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-400">Escrow Security:</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Covered
              </span>
            </div>
            <div className="border-t border-zinc-800/80 pt-2 flex justify-between items-center text-sm">
              <span className="font-bold text-zinc-300">Total Payable:</span>
              <span className="font-black text-lg text-white font-mono">
                ₹{product.basePrice.toLocaleString()}
              </span>
            </div>
          </div>
        )}

        {paymentConfirmed ? (
          /* Payment Success State */
          <div className="space-y-5 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-950/80 border border-emerald-700 text-emerald-400 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl space-y-2 text-xs text-left">
              <div className="flex justify-between">
                <span className="text-zinc-400">Payment ID:</span>
                <span className="font-mono text-zinc-200">#{confirmData?.paymentId || paymentId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Status:</span>
                <span className="font-bold text-emerald-400">RELEASED / SETTLED</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Platform Fee (2%):</span>
                <span className="font-mono text-zinc-300">₹{confirmData?.platformFee?.toFixed(2) || "100.00"}</span>
              </div>
              <div className="flex justify-between border-t border-zinc-800 pt-2">
                <span className="font-bold text-zinc-300">Seller Net Payout:</span>
                <span className="font-mono font-bold text-emerald-400">
                  ₹{confirmData?.sellerReceives?.toFixed(2) || "4900.00"}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/local"
                className="flex-1 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition"
              >
                Continue Shopping
              </Link>
              <Link
                href="/workspace/dashboard"
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-md shadow-blue-600/30"
              >
                Inspect Settlement
              </Link>
            </div>
          </div>
        ) : (
          /* Payment Action State */
          <div className="space-y-6">
            {/* Mock QR / UPI display */}
            <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-xl text-center space-y-3">
              <div className="w-32 h-32 mx-auto bg-white p-3 rounded-lg flex items-center justify-center shadow-inner">
                {/* SVG Mock QR Code */}
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <rect width="100" height="100" fill="white" />
                  <rect x="10" y="10" width="30" height="30" fill="black" />
                  <rect x="15" y="15" width="20" height="20" fill="white" />
                  <rect x="20" y="20" width="10" height="10" fill="black" />
                  <rect x="60" y="10" width="30" height="30" fill="black" />
                  <rect x="65" y="15" width="20" height="20" fill="white" />
                  <rect x="70" y="20" width="10" height="10" fill="black" />
                  <rect x="10" y="60" width="30" height="30" fill="black" />
                  <rect x="15" y="65" width="20" height="20" fill="white" />
                  <rect x="20" y="70" width="10" height="10" fill="black" />
                  <rect x="50" y="45" width="10" height="10" fill="black" />
                  <rect x="70" y="65" width="15" height="15" fill="black" />
                </svg>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-mono font-bold text-zinc-300">UPI ID: devflow@ybl</p>
                <p className="text-[10px] text-zinc-500">Scan using GPay, PhonePe, Paytm or click Pay below</p>
              </div>
            </div>

            {/* Pay Button */}
            <button
              onClick={handlePay}
              disabled={paying}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-black transition shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {paying ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Processing Payment via UPI...
                </>
              ) : (
                <>
                  <Smartphone className="w-4 h-4" />
                  Pay ₹{product?.basePrice.toLocaleString()} Instantly
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
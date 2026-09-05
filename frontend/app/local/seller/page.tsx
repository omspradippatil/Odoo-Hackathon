"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { Product } from "@/types";
import {
  Store, Plus, Clock, DollarSign, Star, 
  ShoppingBag, CheckCircle2, Image as ImageIcon, Upload
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuthContext } from "@/context/AuthContext";

export default function SellerDashboardPage() {
  const { user } = useAuthContext();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New product form
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchSellerProducts();
  }, []);

  const fetchSellerProducts = async () => {
    try {
      // For demo, just fetch all products or filter by seller if API supports
      const res = await api.get<any[]>("/products");
      setProducts(res.data as any[]);
    } catch (err) {
      console.error("Failed to load seller catalog", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price) return;
    setIsSubmitting(true);

    try {
      let imageUrl = "";
      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        const uploadRes = await api.post("/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        imageUrl = uploadRes.data.url;
      }

      await api.post("/products", {
        name,
        basePrice: parseFloat(price),
        imageUrl,
        isRecurring: false,
        seller: user ? { id: user.id } : null,
      });

      setDialogOpen(false);
      setName("");
      setPrice("");
      setImageFile(null);
      fetchSellerProducts();
    } catch (err) {
      console.error("Failed to add product", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white min-h-screen">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 flex items-center gap-2.5">
              <Store className="w-7 h-7 text-blue-600" />
              Seller Operations Hub
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700">
              Verified Business
            </span>
          </div>
          <p className="text-sm text-gray-500">
            Welcome {user?.companyName || user?.displayName || "Seller"}. Manage local inventory, and track escrow settlements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/local"
            className="px-4 py-2 bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold transition"
          >
            View Shopfront
          </Link>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger className="inline-flex">
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold transition flex items-center gap-2 shadow-sm">
                <Plus className="w-4 h-4" />
                List New Product
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-white border border-gray-200">
              <DialogHeader>
                <DialogTitle className="text-gray-900">List a New Product</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddProduct} className="space-y-4 pt-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Product Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="e.g. Sony WH-1000XM5"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="29990"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Product Image</label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {imageFile ? (
                          <p className="text-sm text-blue-600 font-semibold flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4" /> {imageFile.name}
                          </p>
                        ) : (
                          <>
                            <Upload className="w-6 h-6 mb-2 text-gray-400" />
                            <p className="mb-1 text-sm text-gray-500"><span className="font-semibold text-gray-700">Click to upload</span></p>
                            <p className="text-xs text-gray-400">JPG, PNG or WebP</p>
                          </>
                        )}
                      </div>
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/png, image/jpeg, image/webp" 
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setImageFile(e.target.files[0]);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {isSubmitting ? "Listing..." : "List Product"}
                </button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Product Listings Table */}
      <div className="bg-white border border-gray-200 rounded-xl p-0 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-sm font-bold text-gray-900 flex items-center justify-between">
            <span>Active Products In Your Store</span>
            <span className="text-xs text-gray-500 font-normal">Auto-synced with PostgreSQL</span>
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50">
              <tr className="border-b border-gray-200 text-gray-600 text-xs font-semibold uppercase tracking-wider">
                <th className="px-5 py-3">Product</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Price</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition">
                  <td className="px-5 py-4 font-semibold text-gray-900 flex items-center gap-3">
                    <div className="w-10 h-10 rounded border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden shrink-0">
                      {p.imageUrl ? (
                        <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    {p.name}
                  </td>
                  <td className="px-5 py-4 text-gray-600">{p.category?.name || "General"}</td>
                  <td className="px-5 py-4 font-mono font-bold text-gray-900">
                    ₹{p.basePrice?.toLocaleString()}
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700">
                      LIVE
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/local/checkout/${p.id}`}
                      className="text-blue-600 hover:text-blue-700 font-semibold text-xs transition"
                    >
                      Test Checkout →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

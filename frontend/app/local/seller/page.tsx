"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { Product } from "@/types";
import {
  Store, Plus, DollarSign, Star, 
  ShoppingBag, CheckCircle2, Image as ImageIcon, Upload,
  Percent, Tag, Sparkles, Trash2, ShieldCheck,
  Layers, ArrowUpRight, AlertCircle, Link2
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { useAuthContext } from "@/context/AuthContext";

// Sample presets for quick testing
const PRESET_IMAGES = [
  { label: "MacBook Pro", url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80" },
  { label: "iPhone 15 Pro", url: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80" },
  { label: "Headphones", url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80" },
  { label: "Smart Watch", url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80" },
  { label: "Sony Camera", url: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80" },
];

export default function SellerDashboardPage() {
  const { user } = useAuthContext();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // New product form state
  const [name, setName] = useState("");
  const [categoryName, setCategoryName] = useState("Hardware");
  const [actualPrice, setActualPrice] = useState(""); // MRP
  const [sellingPrice, setSellingPrice] = useState(""); // Deal / Offer price
  const [description, setDescription] = useState("");
  
  // Image handling state
  const [imageInputType, setImageInputType] = useState<"upload" | "url">("upload");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [imagePreview, setImagePreview] = useState<string>("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchSellerProducts();
  }, []);

  const fetchSellerProducts = async () => {
    try {
      const res = await api.get<Product[]>("/products");
      setProducts(res.data || []);
    } catch (err) {
      console.error("Failed to load seller catalog", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle local file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const preview = URL.createObjectURL(file);
      setImagePreview(preview);
    }
  };

  // Select preset sample image
  const handleSelectPreset = (url: string) => {
    setImageUrl(url);
    setImagePreview(url);
    setImageFile(null);
    setImageInputType("url");
  };

  // Clear selected image
  const handleClearImage = () => {
    setImageFile(null);
    setImageUrl("");
    setImagePreview("");
  };

  // Price calculations
  const actualNum = parseFloat(actualPrice) || 0;
  const sellingNum = parseFloat(sellingPrice) || 0;
  const savings = actualNum > sellingNum ? actualNum - sellingNum : 0;
  const discountPct = actualNum > 0 && actualNum > sellingNum 
    ? Math.round((savings / actualNum) * 100) 
    : 0;

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !sellingPrice) return;
    setIsSubmitting(true);

    try {
      let finalImageUrl = imageUrl;

      // If a file was chosen, upload it to the backend /api/upload endpoint
      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        try {
          const uploadRes = await api.post("/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          finalImageUrl = uploadRes.data.url;
        } catch (uploadErr) {
          console.warn("Backend file upload failed, falling back to preview URL", uploadErr);
          finalImageUrl = imagePreview || "";
        }
      }

      await api.post("/products", {
        name,
        basePrice: parseFloat(sellingPrice),
        actualPrice: actualPrice ? parseFloat(actualPrice) : parseFloat(sellingPrice),
        imageUrl: finalImageUrl,
        description: description || undefined,
        isRecurring: false,
        seller: user ? { id: user.id } : null,
      });

      // Reset form
      setDialogOpen(false);
      setName("");
      setActualPrice("");
      setSellingPrice("");
      setDescription("");
      handleClearImage();

      // Refresh catalog
      fetchSellerProducts();
    } catch (err) {
      console.error("Failed to add product", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate summary stats
  const totalProducts = products.length;
  const discountedProducts = products.filter(p => (p.actualPrice || 0) > p.basePrice);
  const avgDiscount = discountedProducts.length > 0
    ? Math.round(
        discountedProducts.reduce((acc, p) => {
          const act = p.actualPrice || p.basePrice;
          return acc + ((act - p.basePrice) / act) * 100;
        }, 0) / discountedProducts.length
      )
    : 15;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-slate-50/50 min-h-screen">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-gray-200 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1.5">
            <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-sm">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                  Seller Operations Hub
                </h1>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100/70 border border-blue-200 text-blue-700">
                  Verified Merchant
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-500">
                Manage your product catalog, upload high-res imagery, specify MRP & offer prices, and track escrow settlements.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/local"
            className="px-4 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 shadow-sm"
          >
            <span>Live Storefront</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/reviews"
            className="px-4 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 shadow-sm"
          >
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            <span>Tier Leaderboard</span>
          </Link>

          {/* List New Product Dialog */}
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger className="inline-flex">
              <button className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 shadow-md shadow-blue-500/20 active:scale-[0.99]">
                <Plus className="w-4 h-4 stroke-[2.5]" />
                List New Product
              </button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto bg-white border border-gray-200 rounded-2xl p-6 shadow-2xl">
              <DialogHeader className="pb-3 border-b border-gray-100">
                <DialogTitle className="text-xl font-black text-gray-900 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-blue-600" />
                  List a New Product
                </DialogTitle>
                <DialogDescription className="text-xs text-gray-500">
                  Upload images, set the original Actual Price (MRP) and your discounted Selling Price.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleAddProduct} className="space-y-5 pt-3">
                {/* Product Name & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-800 mb-1.5">
                      Product Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-gray-50/50 border border-gray-300 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
                      placeholder="e.g. Sony WH-1000XM5 Wireless Headphones"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-800 mb-1.5">
                      Category
                    </label>
                    <select
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                      className="w-full px-3 py-2.5 bg-gray-50/50 border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
                    >
                      <option value="Hardware">Hardware</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Accessories">Accessories</option>
                      <option value="Services">Services</option>
                      <option value="Subscriptions">Subscriptions</option>
                    </select>
                  </div>
                </div>

                {/* PRICING SECTION: Actual Price (MRP) vs Selling Price */}
                <div className="bg-gradient-to-br from-blue-50/50 to-indigo-50/30 border border-blue-100 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-900 uppercase tracking-wide flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-blue-600" />
                      Dual Pricing (MRP vs Offer Price)
                    </span>
                    <span className="text-[11px] text-blue-600 font-semibold bg-blue-100/50 px-2 py-0.5 rounded-md">
                      Auto-Calculated Discount
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Actual Price (MRP) */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Actual Price / MRP (₹)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-mono text-sm font-semibold">₹</span>
                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={actualPrice}
                          onChange={(e) => setActualPrice(e.target.value)}
                          className="w-full pl-8 pr-3 py-2 bg-white border border-gray-300 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition font-mono"
                          placeholder="34990"
                        />
                      </div>
                      <p className="text-[10px] text-gray-500 mt-1">Shown crossed-out (e.g. ₹34,990)</p>
                    </div>

                    {/* Selling Price (Deal Price) */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Selling Price (₹) <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600 font-mono text-sm font-bold">₹</span>
                        <input
                          type="number"
                          required
                          min="1"
                          step="any"
                          value={sellingPrice}
                          onChange={(e) => setSellingPrice(e.target.value)}
                          className="w-full pl-8 pr-3 py-2 bg-white border border-blue-300 rounded-xl text-sm text-gray-900 font-bold placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition font-mono shadow-sm"
                          placeholder="29990"
                        />
                      </div>
                      <p className="text-[10px] text-blue-600 font-medium mt-1">The final amount buyer pays</p>
                    </div>
                  </div>

                  {/* Real-time Discount & Savings Badge */}
                  {actualNum > 0 && sellingNum > 0 && (
                    <div className="pt-2 border-t border-blue-200/50">
                      {actualNum > sellingNum ? (
                        <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs">
                          <span className="font-bold flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                            {discountPct}% OFF Active!
                          </span>
                          <span>
                            Buyer saves <strong className="font-mono">₹{savings.toLocaleString()}</strong>
                          </span>
                        </div>
                      ) : actualNum < sellingNum ? (
                        <div className="flex items-center gap-2 p-2 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-xs">
                          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>Selling price is higher than MRP. (Recommended: Selling Price ≤ MRP)</span>
                        </div>
                      ) : (
                        <div className="p-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 text-xs">
                          Standard pricing: Selling at full MRP (0% discount).
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* PRODUCT IMAGE SECTION */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                      Product Image
                    </label>
                    <div className="flex items-center gap-1 text-[11px] bg-gray-100 p-0.5 rounded-lg">
                      <button
                        type="button"
                        onClick={() => setImageInputType("upload")}
                        className={`px-2.5 py-0.5 rounded-md font-medium transition ${
                          imageInputType === "upload"
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-500 hover:text-gray-900"
                        }`}
                      >
                        Upload File
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageInputType("url")}
                        className={`px-2.5 py-0.5 rounded-md font-medium transition ${
                          imageInputType === "url"
                            ? "bg-white text-gray-900 shadow-sm"
                            : "text-gray-500 hover:text-gray-900"
                        }`}
                      >
                        Image URL
                      </button>
                    </div>
                  </div>

                  {/* Image Preview if selected */}
                  {imagePreview ? (
                    <div className="relative border border-gray-200 rounded-xl overflow-hidden bg-gray-50 p-3 flex items-center gap-4">
                      <div className="w-24 h-24 rounded-lg overflow-hidden bg-white border border-gray-200 shrink-0">
                        <img
                          src={imagePreview}
                          alt="Product preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-gray-900 truncate">
                          {imageFile ? imageFile.name : "Image Ready"}
                        </p>
                        <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                          <CheckCircle2 className="w-3.5 h-3.5" /> High-Resolution Photo Loaded
                        </p>
                        <button
                          type="button"
                          onClick={handleClearImage}
                          className="mt-2 text-xs text-red-600 hover:text-red-700 font-semibold flex items-center gap-1 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Remove Image
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Upload File Mode */}
                      {imageInputType === "upload" ? (
                        <div className="flex items-center justify-center w-full">
                          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50/60 hover:bg-blue-50/50 hover:border-blue-300 transition group">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <Upload className="w-6 h-6 mb-2 text-gray-400 group-hover:text-blue-600 group-hover:scale-110 transition-transform" />
                              <p className="mb-1 text-xs text-gray-600">
                                <span className="font-bold text-blue-600">Click to browse</span> or drag and drop
                              </p>
                              <p className="text-[10px] text-gray-400">PNG, JPG, or WebP up to 10MB</p>
                            </div>
                            <input
                              type="file"
                              className="hidden"
                              accept="image/png, image/jpeg, image/webp"
                              onChange={handleFileChange}
                            />
                          </label>
                        </div>
                      ) : (
                        /* Direct URL Input Mode */
                        <div className="space-y-2">
                          <div className="relative">
                            <Link2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                              type="url"
                              value={imageUrl}
                              onChange={(e) => {
                                setImageUrl(e.target.value);
                                setImagePreview(e.target.value);
                              }}
                              placeholder="https://images.unsplash.com/... or CDN link"
                              className="w-full pl-9 pr-3 py-2 bg-gray-50/50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
                            />
                          </div>
                        </div>
                      )}

                      {/* Quick Sample Presets */}
                      <div className="mt-2.5">
                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                          Quick Preset Samples:
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {PRESET_IMAGES.map((preset) => (
                            <button
                              key={preset.label}
                              type="button"
                              onClick={() => handleSelectPreset(preset.url)}
                              className="text-[11px] px-2.5 py-1 bg-white border border-gray-200 hover:border-blue-400 hover:text-blue-600 rounded-lg text-gray-600 transition shadow-sm"
                            >
                              + {preset.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Short Description */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Short Description (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50/50 border border-gray-300 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
                    placeholder="Provide key features, warranty, or product condition..."
                  />
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting || !name || !sellingPrice}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm rounded-xl transition shadow-lg shadow-blue-500/25 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>Processing Catalog Sync...</>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 stroke-[2.5]" />
                        Publish Product Listing
                      </>
                    )}
                  </button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold mb-2">
            <span>Active Products</span>
            <ShoppingBag className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-gray-900">{totalProducts}</div>
          <p className="text-[11px] text-gray-400 mt-1">Live in store catalog</p>
        </div>

        <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold mb-2">
            <span>Average Deal Discount</span>
            <Percent className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600">{avgDiscount}% OFF</div>
          <p className="text-[11px] text-gray-400 mt-1">Calculated from MRP vs Selling Price</p>
        </div>

        <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold mb-2">
            <span>Escrow Protection</span>
            <ShieldCheck className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-gray-900">100%</div>
          <p className="text-[11px] text-gray-400 mt-1">Protected with milestone delivery lock</p>
        </div>

        <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold mb-2">
            <span>Seller Tier</span>
            <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
          </div>
          <div className="text-2xl font-black text-gray-900">
            {user?.tier || "GOLD"}
          </div>
          <p className="text-[11px] text-amber-600 font-semibold mt-1">Automated Buyer Review Score</p>
        </div>
      </div>

      {/* Product Listings Table */}
      <div className="bg-white border border-gray-200/80 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-50/50">
          <div>
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>Active Products in Your Store</span>
            </h2>
            <p className="text-xs text-gray-500">
              Each product displays real photos, actual retail MRP, and the active selling price.
            </p>
          </div>
          <div className="text-xs text-gray-500 font-mono bg-white px-3 py-1.5 rounded-lg border border-gray-200">
            {products.length} Products Listed
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center text-gray-400 text-sm">Loading catalog...</div>
        ) : products.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <ShoppingBag className="w-10 h-10 text-gray-300 mx-auto" />
            <p className="text-sm font-bold text-gray-700">No products listed yet</p>
            <p className="text-xs text-gray-400">Click &quot;List New Product&quot; to publish your first deal.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/80">
                <tr className="border-b border-gray-200/80 text-gray-500 text-[11px] font-bold uppercase tracking-wider">
                  <th className="px-5 py-3.5">Product & Image</th>
                  <th className="px-5 py-3.5">Category</th>
                  <th className="px-5 py-3.5">Pricing (Selling vs Actual)</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((p) => {
                  const actPrice = p.actualPrice || (p.basePrice ? Math.round(p.basePrice * 1.15) : 0);
                  const hasDiscount = actPrice > p.basePrice;
                  const discountPercentage = hasDiscount
                    ? Math.round(((actPrice - p.basePrice) / actPrice) * 100)
                    : 0;

                  return (
                    <tr key={p.id} className="hover:bg-blue-50/20 transition group">
                      {/* Product details & thumbnail */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3.5">
                          <div className="w-12 h-12 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden shrink-0 group-hover:shadow-sm transition">
                            {p.imageUrl ? (
                              <img
                                src={p.imageUrl}
                                alt={p.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                            ) : (
                              <ImageIcon className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 group-hover:text-blue-600 transition text-sm">
                              {p.name}
                            </p>
                            {p.description && (
                              <p className="text-[11px] text-gray-400 line-clamp-1 max-w-xs mt-0.5">
                                {p.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-5 py-4">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-gray-100 text-gray-700">
                          {p.category?.name || "General"}
                        </span>
                      </td>

                      {/* Dual Pricing: Selling Price vs Actual MRP */}
                      <td className="px-5 py-4">
                        <div className="space-y-0.5">
                          <div className="flex items-baseline gap-2">
                            <span className="font-mono font-black text-gray-900 text-base">
                              ₹{p.basePrice?.toLocaleString()}
                            </span>
                            {hasDiscount && (
                              <span className="font-mono text-xs text-gray-400 line-through">
                                ₹{actPrice.toLocaleString()}
                              </span>
                            )}
                          </div>

                          {hasDiscount ? (
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                                {discountPercentage}% OFF
                              </span>
                              <span className="text-[10px] text-gray-500 font-medium">
                                Save ₹{(actPrice - p.basePrice).toLocaleString()}
                              </span>
                            </div>
                          ) : (
                            <span className="text-[10px] text-gray-400">Regular MRP</span>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 inline-flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          LIVE
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/local/checkout/${p.id}`}
                            className="px-3 py-1.5 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 text-xs font-semibold rounded-lg transition"
                          >
                            Test Checkout
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

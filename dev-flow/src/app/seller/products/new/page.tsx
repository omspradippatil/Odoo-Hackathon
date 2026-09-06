"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { WorkspaceLayout } from "@/components/layout/WorkspaceLayout";
import { UserRole } from "@/types/auth";
import { Package, Upload, ArrowRight, CheckCircle2 } from "lucide-react";

export default function AddProductPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: "",
    category: "Electrical & Power",
    description: "",
    imageUrl: "",
    originalPrice: "",
    sellingPrice: "",
    stock: "10"
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const payload = {
      name: formData.name,
      category: formData.category,
      description: formData.description,
      imageUrl: formData.imageUrl || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80",
      originalPrice: parseFloat(formData.originalPrice),
      sellingPrice: parseFloat(formData.sellingPrice),
      basePrice: parseFloat(formData.sellingPrice),
      stock: parseInt(formData.stock, 10),
      sellerName: "My Local Business",
      sellerId: "VND-LOCAL-USER",
      city: "Mumbai",
      trustScore: 100,
      verificationStatus: "VERIFIED"
    };

    try {
      await fetch("http://localhost:8080/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      setSuccess(true);
      setTimeout(() => router.push("/buyer/local"), 2000);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <WorkspaceLayout role={UserRole.SELLER}>
      <div className="max-w-3xl mx-auto space-y-8">
        
        <div>
          <h1 className="text-3xl font-bold text-navy tracking-tight mb-2 flex items-center gap-3">
            <Package className="w-8 h-8 text-cobalt" /> Upload New Product
          </h1>
          <p className="text-sm font-medium text-navy/60">List your product in the local marketplace to reach nearby buyers.</p>
        </div>

        {success ? (
          <div className="bg-lime/20 border border-lime/40 rounded-3xl p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-lime text-lime-950 rounded-full flex items-center justify-center mb-6 shadow-xl">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-navy mb-2">Product Published!</h2>
            <p className="text-navy/60 font-medium mb-6">Your product is now live on the local marketplace.</p>
            <div className="text-sm font-bold text-cobalt flex items-center gap-2">Redirecting to Local Marketplace <ArrowRight className="w-4 h-4 animate-pulse" /></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 border border-navy/5 shadow-sm space-y-6">
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-navy uppercase tracking-widest">Product Name</label>
                <input 
                  required
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full h-12 px-4 rounded-xl border border-navy/10 bg-warm/50 focus:border-cobalt focus:outline-none font-medium"
                  placeholder="e.g. Industrial Diesel Generator 10kVA"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-navy uppercase tracking-widest">Category</label>
                <select 
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  className="w-full h-12 px-4 rounded-xl border border-navy/10 bg-warm/50 focus:border-cobalt focus:outline-none font-medium text-navy"
                >
                  <option>Electrical & Power</option>
                  <option>Tooling & Metrology</option>
                  <option>Safety & PPE</option>
                  <option>HVAC & Cooling</option>
                  <option>Material Handling</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-navy uppercase tracking-widest">Available Stock</label>
                <input 
                  required
                  type="number" min="1"
                  value={formData.stock}
                  onChange={e => setFormData({...formData, stock: e.target.value})}
                  className="w-full h-12 px-4 rounded-xl border border-navy/10 bg-warm/50 focus:border-cobalt focus:outline-none font-medium"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-navy uppercase tracking-widest flex items-center justify-between">
                  <span>Image URL</span>
                  <span className="text-[10px] text-navy/40">Provide a direct link to the image</span>
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/40"><Upload className="w-4 h-4" /></div>
                  <input 
                    type="url" 
                    value={formData.imageUrl}
                    onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                    className="w-full h-12 pl-12 pr-4 rounded-xl border border-navy/10 bg-warm/50 focus:border-cobalt focus:outline-none font-medium"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-navy uppercase tracking-widest">Description</label>
                <textarea 
                  rows={4}
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full p-4 rounded-xl border border-navy/10 bg-warm/50 focus:border-cobalt focus:outline-none font-medium resize-none"
                  placeholder="Detailed product specifications..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-navy uppercase tracking-widest">MRP (Original Price ₹)</label>
                <input 
                  required
                  type="number" min="0" step="0.01"
                  value={formData.originalPrice}
                  onChange={e => setFormData({...formData, originalPrice: e.target.value})}
                  className="w-full h-12 px-4 rounded-xl border border-navy/10 bg-warm/50 focus:border-cobalt focus:outline-none font-medium line-through text-navy/60"
                  placeholder="e.g. 15000"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-navy uppercase tracking-widest">Discounted Selling Price (₹)</label>
                <input 
                  required
                  type="number" min="0" step="0.01"
                  value={formData.sellingPrice}
                  onChange={e => setFormData({...formData, sellingPrice: e.target.value})}
                  className="w-full h-12 px-4 rounded-xl border border-navy/10 bg-coral/10 bg-warm/50 focus:border-coral focus:outline-none font-bold text-coral"
                  placeholder="e.g. 12000"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-navy/5 flex justify-end">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="px-8 py-4 bg-navy hover:bg-navy/90 text-white rounded-xl font-bold shadow-xl shadow-navy/20 flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Publishing..." : "Publish Product"} <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </form>
        )}

      </div>
    </WorkspaceLayout>
  );
}

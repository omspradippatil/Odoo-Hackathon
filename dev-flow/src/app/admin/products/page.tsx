"use client";

import React, { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { 
  Package, Plus, Search, Filter, Tag, CheckCircle2, DollarSign, Boxes
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  brand: string;
  basePrice: number;
  active: boolean;
}

const SAMPLE_PRODUCTS: ProductItem[] = [
  { id: "1", sku: "PRD-ELC-001", name: "Siemens 3-Phase Induction Motor 5.5kW 415V", category: "Electrical & Power", brand: "Siemens", basePrice: 34500, active: true },
  { id: "2", sku: "PRD-ELC-002", name: "Schneider Electric EasyPact MCCB 250A", category: "Electrical & Power", brand: "Schneider Electric", basePrice: 14200, active: true },
  { id: "3", sku: "PRD-ELC-003", name: "ABB ACS380 Machinery VFD 7.5kW", category: "Electrical & Power", brand: "ABB", basePrice: 42000, active: true },
  { id: "4", sku: "PRD-MEC-001", name: "SKF Deep Groove Ball Bearing 6205-2RSH", category: "Mechanical & Transmission", brand: "SKF", basePrice: 385, active: true },
  { id: "5", sku: "PRD-HYD-001", name: "Bosch Rexroth Directional Solenoid Valve CETOP 3", category: "Hydraulics & Pneumatics", brand: "Bosch Rexroth", basePrice: 16800, active: true },
  { id: "6", sku: "PRD-AUT-001", name: "Siemens SIMATIC S7-1200 CPU 1214C Compact PLC", category: "Industrial Automation", brand: "Siemens", basePrice: 29500, active: true },
  { id: "7", sku: "PRD-RAW-001", name: "Tata Steel Hot Rolled IS 2062 Plate 12mm", category: "Raw Materials & Metals", brand: "Tata Steel", basePrice: 28500, active: true },
  { id: "8", sku: "PRD-SAF-001", name: "3M Half Facepiece Reusable Respirator 6200", category: "Safety & PPE", brand: "3M", basePrice: 1850, active: true }
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState(SAMPLE_PRODUCTS);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("Electrical & Power");
  const [price, setPrice] = useState("");

  const categories = ["ALL", "Electrical & Power", "Mechanical & Transmission", "Hydraulics & Pneumatics", "Industrial Automation", "Raw Materials & Metals", "Safety & PPE"];

  const filtered = products.filter(p => {
    const match = p.name.toLowerCase().includes(search.toLowerCase()) ||
                  p.sku.toLowerCase().includes(search.toLowerCase()) ||
                  p.brand.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === "ALL" || p.category === categoryFilter;
    return match && matchCat;
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newP: ProductItem = {
      id: (products.length + 1).toString(),
      sku: "PRD-NEW-" + (products.length + 1).toString().padStart(3, "0"),
      name,
      brand: brand || "Generic OEM",
      category,
      basePrice: parseFloat(price) || 5000,
      active: true
    };
    setProducts([...products, newP]);
    setShowAddModal(false);
    setName("");
    setBrand("");
    setPrice("");
  };

  return (
    <AdminLayout>
      <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto pb-20">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-navy tracking-tight uppercase">Master Product Catalog</h1>
            <p className="text-sm font-medium text-navy/60">Configure universal SKUs, standard baseline pricing, and category classifications.</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2.5 rounded-xl font-bold text-white bg-navy shadow-lg shadow-navy/20 hover:bg-navy/90 transition-colors text-sm flex items-center gap-2 self-start md:self-auto"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>

        {/* METRICS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-navy/5 shadow-sm">
            <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest">ACTIVE CATALOG ITEMS</div>
            <div className="text-2xl font-bold text-navy mt-1">{products.length} Products</div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-navy/5 shadow-sm">
            <div className="text-[10px] font-bold text-lime-700 uppercase tracking-widest">MASTER CATEGORIES</div>
            <div className="text-2xl font-bold text-lime-700 mt-1">7 Verticals</div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-navy/5 shadow-sm">
            <div className="text-[10px] font-bold text-cobalt uppercase tracking-widest">TIER-1 OEM BRANDS</div>
            <div className="text-2xl font-bold text-cobalt mt-1">12 Brands</div>
          </div>
        </div>

        {/* FILTERS */}
        <div className="bg-white rounded-2xl p-4 border border-navy/5 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-navy/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search SKU, product title, or brand..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-navy/5 rounded-xl text-sm font-medium text-navy placeholder:text-navy/40 focus:outline-none"
            />
          </div>

          <div className="flex bg-navy/5 p-1 rounded-xl text-xs font-bold overflow-x-auto w-full md:w-auto">
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setCategoryFilter(c)}
                className={cn(
                  "px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors",
                  categoryFilter === c ? "bg-white text-navy shadow-xs" : "text-navy/60 hover:text-navy"
                )}
              >
                {c === "ALL" ? "All Categories" : c.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-3xl border border-navy/5 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-navy/5 bg-navy/[0.02] text-[10px] font-bold uppercase tracking-wider text-navy/50">
                  <th className="py-4 px-6">SKU Code</th>
                  <th className="py-4 px-6">Product Title</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Brand</th>
                  <th className="py-4 px-6 text-right">Base Price (INR)</th>
                  <th className="py-4 px-6 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy/5 text-sm">
                {filtered.map(item => (
                  <tr key={item.id} className="hover:bg-navy/[0.015] transition-colors">
                    <td className="py-4 px-6 font-mono text-xs font-bold text-cobalt">
                      {item.sku}
                    </td>
                    <td className="py-4 px-6 font-bold text-navy">
                      {item.name}
                    </td>
                    <td className="py-4 px-6 text-xs font-medium text-navy/70">
                      {item.category}
                    </td>
                    <td className="py-4 px-6 font-medium text-navy">
                      {item.brand}
                    </td>
                    <td className="py-4 px-6 font-bold text-navy text-right">
                      ₹{item.basePrice.toLocaleString("en-IN")}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-lime/20 text-lime-900 inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-lime-700" /> Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* MODAL */}
        {showAddModal && (
          <div className="fixed inset-0 bg-navy/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-navy/10 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-navy">Add Catalog Product</h3>
                <button onClick={() => setShowAddModal(false)} className="text-navy/40 hover:text-navy font-bold text-lg">×</button>
              </div>
              <form onSubmit={handleAdd} className="space-y-3">
                <input placeholder="Product Title" required value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-2.5 bg-navy/5 rounded-xl text-sm font-medium" />
                <input placeholder="Brand (e.g. Siemens, SKF)" value={brand} onChange={e => setBrand(e.target.value)} className="w-full px-4 py-2.5 bg-navy/5 rounded-xl text-sm font-medium" />
                <select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-4 py-2.5 bg-navy/5 rounded-xl text-sm font-medium">
                  {categories.filter(c => c !== "ALL").map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <input placeholder="Base Price (INR)" type="number" required value={price} onChange={e => setPrice(e.target.value)} className="w-full px-4 py-2.5 bg-navy/5 rounded-xl text-sm font-medium" />
                <div className="flex gap-2 pt-3">
                  <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-2.5 bg-navy/5 font-bold rounded-xl text-sm text-navy">Cancel</button>
                  <button type="submit" className="flex-1 py-2.5 bg-navy font-bold rounded-xl text-sm text-white shadow-xs">Save Product</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
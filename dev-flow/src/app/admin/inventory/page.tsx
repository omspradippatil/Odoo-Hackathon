"use client";

import React, { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { 
  Boxes, Search, Filter, AlertTriangle, CheckCircle2, 
  ArrowUpDown, Building2, Package, RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";

interface InventoryStockRow {
  id: string;
  productName: string;
  category: string;
  warehouseName: string;
  physicalStock: number;
  reservedStock: number;
  availableStock: number;
  sellingPrice: number;
  isLowStock: boolean;
}

const SAMPLE_INVENTORY: InventoryStockRow[] = [
  { id: "inv-1", productName: "Siemens 3-Phase Induction Motor 5.5kW", category: "Electrical & Power", warehouseName: "Whitefield Supply Depot", physicalStock: 120, reservedStock: 15, availableStock: 105, sellingPrice: 38640, isLowStock: false },
  { id: "inv-2", productName: "Schneider Electric MCCB 250A", category: "Electrical & Power", warehouseName: "Manesar Auto Depot", physicalStock: 85, reservedStock: 20, availableStock: 65, sellingPrice: 15900, isLowStock: false },
  { id: "inv-3", productName: "SKF Deep Groove Ball Bearing 6205", category: "Mechanical & Transmission", warehouseName: "Chakan Logistic Park", physicalStock: 650, reservedStock: 140, availableStock: 510, sellingPrice: 430, isLowStock: false },
  { id: "inv-4", productName: "Bosch Rexroth Solenoid Valve CETOP 3", category: "Hydraulics & Pneumatics", warehouseName: "Bhiwandi Central Hub", physicalStock: 45, reservedStock: 35, availableStock: 10, sellingPrice: 18800, isLowStock: true },
  { id: "inv-5", productName: "ABB ACS380 Machinery VFD 7.5kW", category: "Electrical & Power", warehouseName: "Whitefield Supply Depot", physicalStock: 30, reservedStock: 22, availableStock: 8, sellingPrice: 47000, isLowStock: true },
  { id: "inv-6", productName: "Tata Steel Hot Rolled IS 2062 Plate", category: "Raw Materials & Metals", warehouseName: "Bhiwandi Central Hub", physicalStock: 280, reservedStock: 40, availableStock: 240, sellingPrice: 31900, isLowStock: false },
  { id: "inv-7", productName: "Festo Compact Cylinder ADN 40x50mm", category: "Hydraulics & Pneumatics", warehouseName: "Sriperumbudur Mega DC", physicalStock: 160, reservedStock: 25, availableStock: 135, sellingPrice: 5150, isLowStock: false }
];

export default function AdminInventoryPage() {
  const [stock, setStock] = useState(SAMPLE_INVENTORY);
  const [search, setSearch] = useState("");
  const [lowStockOnly, setLowStockOnly] = useState(false);

  const filtered = stock.filter(item => {
    const match = item.productName.toLowerCase().includes(search.toLowerCase()) ||
                  item.warehouseName.toLowerCase().includes(search.toLowerCase()) ||
                  item.category.toLowerCase().includes(search.toLowerCase());
    const matchLow = !lowStockOnly || item.isLowStock;
    return match && matchLow;
  });

  const totalPhysical = stock.reduce((a, b) => a + b.physicalStock, 0);
  const totalReserved = stock.reduce((a, b) => a + b.reservedStock, 0);
  const totalAvailable = stock.reduce((a, b) => a + b.availableStock, 0);

  return (
    <AdminLayout>
      <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto pb-20">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-navy tracking-tight uppercase">Multi-Hub Inventory Management</h1>
            <p className="text-sm font-medium text-navy/60">Live physical stock reconciliation, reserved order allocations, and regional price parity.</p>
          </div>
          <button 
            onClick={() => alert("Re-syncing stock counts from database repositories...")}
            className="px-4 py-2.5 rounded-xl font-bold text-navy bg-white border border-navy/10 shadow-sm hover:bg-navy/5 transition-colors text-sm flex items-center gap-2 self-start md:self-auto"
          >
            <RefreshCw className="w-4 h-4" /> Sync Database
          </button>
        </div>

        {/* METRICS */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-navy/5 shadow-sm">
            <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest">PHYSICAL STOCK ON HAND</div>
            <div className="text-2xl font-bold text-navy mt-1">{totalPhysical.toLocaleString("en-IN")} Units</div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-navy/5 shadow-sm">
            <div className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">RESERVED FOR ORDERS</div>
            <div className="text-2xl font-bold text-amber-600 mt-1">{totalReserved.toLocaleString("en-IN")} Units</div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-navy/5 shadow-sm">
            <div className="text-[10px] font-bold text-lime-700 uppercase tracking-widest">AVAILABLE TO PROMISE</div>
            <div className="text-2xl font-bold text-lime-700 mt-1">{totalAvailable.toLocaleString("en-IN")} Units</div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-navy/5 shadow-sm">
            <div className="text-[10px] font-bold text-red-600 uppercase tracking-widest">LOW-STOCK WARNINGS</div>
            <div className="text-2xl font-bold text-red-600 mt-1">{stock.filter(s => s.isLowStock).length} SKUs</div>
          </div>
        </div>

        {/* SEARCH & TOGGLE */}
        <div className="bg-white rounded-2xl p-4 border border-navy/5 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-navy/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search product, warehouse, or category..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-navy/5 rounded-xl text-sm font-medium text-navy placeholder:text-navy/40 focus:outline-none"
            />
          </div>

          <label className="flex items-center gap-2 text-xs font-bold text-navy cursor-pointer self-start md:self-auto">
            <input 
              type="checkbox" 
              checked={lowStockOnly} 
              onChange={e => setLowStockOnly(e.target.checked)}
              className="w-4 h-4 accent-red-600 rounded"
            />
            Show Low Stock Alerts Only
          </label>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-3xl border border-navy/5 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-navy/5 bg-navy/[0.02] text-[10px] font-bold uppercase tracking-wider text-navy/50">
                  <th className="py-4 px-6">Product Item</th>
                  <th className="py-4 px-6">Warehouse Hub</th>
                  <th className="py-4 px-6 text-right">Physical Stock</th>
                  <th className="py-4 px-6 text-right">Reserved Stock</th>
                  <th className="py-4 px-6 text-right">Available Stock</th>
                  <th className="py-4 px-6 text-right">Unit Selling Price</th>
                  <th className="py-4 px-6 text-center">Stock Health</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy/5 text-sm">
                {filtered.map(item => (
                  <tr key={item.id} className="hover:bg-navy/[0.015] transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-navy">{item.productName}</div>
                      <div className="text-xs text-navy/50">{item.category}</div>
                    </td>
                    <td className="py-4 px-6 font-medium text-navy/80 text-xs">
                      {item.warehouseName}
                    </td>
                    <td className="py-4 px-6 font-mono font-medium text-navy text-right">
                      {item.physicalStock}
                    </td>
                    <td className="py-4 px-6 font-mono font-medium text-amber-700 text-right">
                      {item.reservedStock}
                    </td>
                    <td className="py-4 px-6 font-mono font-bold text-lime-800 text-right">
                      {item.availableStock}
                    </td>
                    <td className="py-4 px-6 font-bold text-navy text-right">
                      ₹{item.sellingPrice.toLocaleString("en-IN")}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {item.isLowStock ? (
                        <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-red-100 text-red-900 border border-red-200 inline-flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-red-700" /> Low Stock
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-lime/20 text-lime-900 inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-lime-700" /> Healthy
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
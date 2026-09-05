"use client";

import React, { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { 
  Building2, Plus, Search, MapPin, Boxes, CheckCircle2, 
  ExternalLink, Truck, ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

interface WarehouseItem {
  id: string;
  name: string;
  vendorOwner: string;
  city: string;
  state: string;
  activeStockSKUs: number;
  totalUnits: number;
  status: "ACTIVE" | "MAINTENANCE";
}

const SAMPLE_WAREHOUSES: WarehouseItem[] = [
  { id: "wh-1", name: "Bhiwandi Central Logistics Hub", vendorOwner: "Tata Steel Industrial Supplies Ltd", city: "Thane / Mumbai", state: "Maharashtra", activeStockSKUs: 48, totalUnits: 14200, status: "ACTIVE" },
  { id: "wh-2", name: "Chakan Industrial Logistic Park", vendorOwner: "SKF Bearings & Lubrication Solutions", city: "Pune", state: "Maharashtra", activeStockSKUs: 36, totalUnits: 9800, status: "ACTIVE" },
  { id: "wh-3", name: "Whitefield Supply Depot", vendorOwner: "Siemens Industrial Automation India", city: "Bengaluru", state: "Karnataka", activeStockSKUs: 52, totalUnits: 11400, status: "ACTIVE" },
  { id: "wh-4", name: "Sriperumbudur Mega Distribution Center", vendorOwner: "Festo Pneumatics & Automation Corp", city: "Chennai", state: "Tamil Nadu", activeStockSKUs: 42, totalUnits: 8900, status: "ACTIVE" },
  { id: "wh-5", name: "Sanand Logistics Facility", vendorOwner: "Polycab Industrial Wires & Cables", city: "Ahmedabad", state: "Gujarat", activeStockSKUs: 29, totalUnits: 6500, status: "ACTIVE" },
  { id: "wh-6", name: "Manesar Auto & Electrical Depot", vendorOwner: "Schneider Electric Infrastructure", city: "Gurugram", state: "Haryana", activeStockSKUs: 38, totalUnits: 7800, status: "ACTIVE" },
  { id: "wh-7", name: "Shamshabad Air Cargo Warehousing", vendorOwner: "Honeywell Process & Safety", city: "Hyderabad", state: "Telangana", activeStockSKUs: 24, totalUnits: 5100, status: "ACTIVE" },
  { id: "wh-8", name: "Dankuni Eastern Freight Terminal", vendorOwner: "Larsen & Toubro Heavy Equipment", city: "Kolkata", state: "West Bengal", activeStockSKUs: 31, totalUnits: 6200, status: "ACTIVE" }
];

export default function AdminWarehousesPage() {
  const [warehouses, setWarehouses] = useState(SAMPLE_WAREHOUSES);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState("");
  const [vendor, setVendor] = useState("Tata Steel Industrial Supplies Ltd");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  const filtered = warehouses.filter(w => 
    w.name.toLowerCase().includes(search.toLowerCase()) ||
    w.vendorOwner.toLowerCase().includes(search.toLowerCase()) ||
    w.city.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newW: WarehouseItem = {
      id: "wh-" + (warehouses.length + 1),
      name,
      vendorOwner: vendor,
      city,
      state,
      activeStockSKUs: 10,
      totalUnits: 1500,
      status: "ACTIVE"
    };
    setWarehouses([...warehouses, newW]);
    setShowAddModal(false);
    setName("");
    setCity("");
    setState("");
  };

  return (
    <AdminLayout>
      <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto pb-20">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-navy tracking-tight uppercase">Fulfillment Warehouses</h1>
            <p className="text-sm font-medium text-navy/60">Configure supplier logistics centers, multi-hub dispatch routing, and storage capacities.</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2.5 rounded-xl font-bold text-white bg-navy shadow-lg shadow-navy/20 hover:bg-navy/90 transition-colors text-sm flex items-center gap-2 self-start md:self-auto"
          >
            <Plus className="w-4 h-4" /> Add Warehouse
          </button>
        </div>

        {/* METRICS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-navy/5 shadow-sm">
            <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest">NETWORK FACILITIES</div>
            <div className="text-2xl font-bold text-navy mt-1">{warehouses.length} Active Hubs</div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-navy/5 shadow-sm">
            <div className="text-[10px] font-bold text-lime-700 uppercase tracking-widest">STORED CAPACITY</div>
            <div className="text-2xl font-bold text-lime-700 mt-1">69,900 Units</div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-navy/5 shadow-sm">
            <div className="text-[10px] font-bold text-cobalt uppercase tracking-widest">LOGISTICS HUBS COVERED</div>
            <div className="text-2xl font-bold text-cobalt mt-1">8 Key States</div>
          </div>
        </div>

        {/* SEARCH */}
        <div className="bg-white rounded-2xl p-4 border border-navy/5 shadow-sm">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-navy/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search warehouse name, city, or vendor..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-navy/5 rounded-xl text-sm font-medium text-navy placeholder:text-navy/40 focus:outline-none"
            />
          </div>
        </div>

        {/* WAREHOUSE CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(w => (
            <div key={w.id} className="bg-white rounded-3xl p-6 border border-navy/5 shadow-sm space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-lime/20 text-lime-900 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-lime-700" /> Operational
                  </span>
                  <span className="text-xs font-mono font-bold text-navy/40">{w.id}</span>
                </div>

                <h3 className="text-lg font-bold text-navy mb-1">{w.name}</h3>
                <div className="text-xs font-medium text-navy/60 mb-3">Owner: {w.vendorOwner}</div>

                <div className="p-3 bg-navy/5 rounded-2xl space-y-1 text-xs text-navy/70">
                  <div className="flex items-center gap-1.5 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-navy/40" />
                    {w.city}, {w.state}
                  </div>
                  <div className="flex items-center gap-1.5 font-medium">
                    <Boxes className="w-3.5 h-3.5 text-navy/40" />
                    {w.activeStockSKUs} Active SKUs ({w.totalUnits.toLocaleString("en-IN")} units)
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-navy/5 text-right">
                <span className="text-xs font-bold text-cobalt hover:text-navy cursor-pointer">
                  View Stock Allocation →
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* MODAL */}
        {showAddModal && (
          <div className="fixed inset-0 bg-navy/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-navy/10 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-navy">Register Hub Facility</h3>
                <button onClick={() => setShowAddModal(false)} className="text-navy/40 hover:text-navy font-bold text-lg">×</button>
              </div>
              <form onSubmit={handleAdd} className="space-y-3">
                <input placeholder="Warehouse Facility Name" required value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-2.5 bg-navy/5 rounded-xl text-sm font-medium" />
                <input placeholder="City (e.g. Pune, Bhiwandi)" required value={city} onChange={e => setCity(e.target.value)} className="w-full px-4 py-2.5 bg-navy/5 rounded-xl text-sm font-medium" />
                <input placeholder="State (e.g. Maharashtra)" required value={state} onChange={e => setState(e.target.value)} className="w-full px-4 py-2.5 bg-navy/5 rounded-xl text-sm font-medium" />
                <select value={vendor} onChange={e => setVendor(e.target.value)} className="w-full px-4 py-2.5 bg-navy/5 rounded-xl text-sm font-medium">
                  <option>Tata Steel Industrial Supplies Ltd</option>
                  <option>Siemens Industrial Automation India</option>
                  <option>SKF Bearings & Lubrication Solutions</option>
                  <option>Schneider Electric Infrastructure</option>
                  <option>Festo Pneumatics & Automation Corp</option>
                </select>
                <div className="flex gap-2 pt-3">
                  <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-2.5 bg-navy/5 font-bold rounded-xl text-sm text-navy">Cancel</button>
                  <button type="submit" className="flex-1 py-2.5 bg-navy font-bold rounded-xl text-sm text-white shadow-xs">Register Hub</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { WorkspaceLayout } from "@/components/layout/WorkspaceLayout";
import { UserRole } from "@/types/auth";
import { Search, MapPin, Building2, ShieldCheck, Star, Package, ChevronLeft, ChevronRight, Truck, Store, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { LocalProduct } from "@/lib/mockLocalProducts";

export default function LocalSellersPage() {
  const router = useRouter();
  
  const [dbProducts, setDbProducts] = useState<LocalProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8080/api/products")
      .then(res => res.json())
      .then(data => {
        // Map backend Product to frontend LocalProduct format
        const mapped = data.map((p: any) => ({
          id: `PRD-${p.id}`,
          name: p.name,
          category: p.category,
          brand: p.brand || "Generic",
          sellerName: p.sellerName || "Local Vendor",
          sellerId: p.sellerId || "VND-LOC-00",
          price: p.basePrice || 0,
          originalPrice: p.originalPrice,
          sellingPrice: p.sellingPrice || p.basePrice || 0,
          image: p.imageUrl || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800",
          stock: p.stock || 10,
          sellerLocation: p.city || "Mumbai",
          trustScore: p.trustScore || 80,
          verificationStatus: p.verificationStatus || "VERIFIED"
        }));
        setDbProducts(mapped);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, []);
  
  // Filters & Search
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [cityFilter, setCityFilter] = useState("ALL");
  const [tierFilter, setTierFilter] = useState("ALL");
  const [sortOrder, setSortOrder] = useState("BEST_MATCH");
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const categories = ["ALL", ...Array.from(new Set(dbProducts.map(p => p.category))).sort()];
  const cities = ["ALL", ...Array.from(new Set(dbProducts.map(p => p.sellerLocation))).sort()];

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, categoryFilter, cityFilter, tierFilter, sortOrder]);

  const filteredAndSorted = useMemo(() => {
    let result = dbProducts.filter((p) => {
      const matchSearch = 
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.brand.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase()) ||
        p.sellerName.toLowerCase().includes(search.toLowerCase());
        
      const matchCat = categoryFilter === "ALL" || p.category === categoryFilter;
      const matchCity = cityFilter === "ALL" || p.sellerLocation === cityFilter;
      const matchTier = tierFilter === "ALL" || p.trustTier === tierFilter;
      
      return matchSearch && matchCat && matchCity && matchTier;
    });

    switch (sortOrder) {
      case "PRICE_ASC":
        result.sort((a, b) => a.sellingPrice - b.sellingPrice);
        break;
      case "PRICE_DESC":
        result.sort((a, b) => b.sellingPrice - a.sellingPrice);
        break;
      case "TRUST_DESC":
        result.sort((a, b) => b.trustScore - a.trustScore);
        break;
      case "RATING_DESC":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "NEAREST":
        result.sort((a, b) => a.distanceKm - b.distanceKm);
        break;
      case "BEST_MATCH":
      default:
        // Keep original order
        break;
    }

    return result;
  }, [search, categoryFilter, cityFilter, tierFilter, sortOrder]);

  const totalItems = filteredAndSorted.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  
  const currentProducts = filteredAndSorted.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(price);
  };

  const getPageNumbers = () => {
    const pages = [];
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + 4);
    
    if (end - start < 4) {
      start = Math.max(1, end - 4);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const handleClearFilters = () => {
    setSearch("");
    setCategoryFilter("ALL");
    setCityFilter("ALL");
    setTierFilter("ALL");
    setSortOrder("BEST_MATCH");
  };

  return (
    <WorkspaceLayout role={UserRole.BUYER} requireAuth={false}>
      <div className="space-y-6 md:space-y-8 pb-24">
        
        {/* HEADER */}
        <div>
          <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-1">Supplier Discovery</div>
          <h1 className="text-3xl lg:text-4xl font-bold text-navy tracking-tight mb-2">Local Products</h1>
          <p className="text-navy/60 font-medium text-sm md:text-base">
            Browse and source verified local products available from nearby registered sellers.
          </p>
        </div>

        {/* SEARCH & FILTERS */}
        <div className="bg-white rounded-2xl p-4 border border-navy/5 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center z-20 relative">
          <div className="relative w-full md:w-80 lg:w-96">
            <Search className="w-4 h-4 text-navy/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search products, brands, or sellers..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-navy/5 rounded-xl text-sm font-medium text-navy placeholder:text-navy/40 focus:outline-none focus:ring-2 focus:ring-navy/20"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 bg-navy/5 text-navy font-bold text-xs rounded-xl focus:outline-none max-w-[140px] truncate"
            >
              <option value="ALL">All Categories</option>
              {categories.filter(c => c !== "ALL").map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="px-3 py-2 bg-navy/5 text-navy font-bold text-xs rounded-xl focus:outline-none max-w-[120px] truncate"
            >
              {cities.map((c) => (
                <option key={c} value={c}>{c === "ALL" ? "All Cities" : c}</option>
              ))}
            </select>

            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="px-3 py-2 bg-navy/5 text-navy font-bold text-xs rounded-xl focus:outline-none"
            >
              <option value="ALL">All Tiers</option>
              <option value="Gold">Gold</option>
              <option value="Silver">Silver</option>
              <option value="Bronze">Bronze</option>
            </select>
            
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="px-3 py-2 bg-navy/5 text-navy font-bold text-xs rounded-xl focus:outline-none hidden md:block border border-navy/10"
            >
              <option value="BEST_MATCH">Best Match</option>
              <option value="PRICE_ASC">Price: Low to High</option>
              <option value="PRICE_DESC">Price: High to Low</option>
              <option value="TRUST_DESC">Highest Trust</option>
              <option value="RATING_DESC">Highest Rating</option>
              <option value="NEAREST">Nearest</option>
            </select>
          </div>
        </div>
        
        {/* Mobile Sort (Visible only on small screens) */}
        <div className="md:hidden flex justify-end">
           <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="px-3 py-2 bg-white border border-navy/10 text-navy font-bold text-xs rounded-xl focus:outline-none shadow-sm"
            >
              <option value="BEST_MATCH">Sort: Best Match</option>
              <option value="PRICE_ASC">Price: Low to High</option>
              <option value="PRICE_DESC">Price: High to Low</option>
              <option value="TRUST_DESC">Highest Trust</option>
              <option value="RATING_DESC">Highest Rating</option>
              <option value="NEAREST">Nearest</option>
            </select>
        </div>

        {/* RESULTS INFO */}
        <div className="text-sm font-bold text-navy/60 px-1">
          {totalItems > 0 ? (
            `Showing ${(currentPage - 1) * itemsPerPage + 1}–${Math.min(currentPage * itemsPerPage, totalItems)} of ${totalItems} products`
          ) : (
            `0 products found`
          )}
        </div>

        {/* CARDS GRID */}
        {totalItems > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {currentProducts.map((product) => (
              <div 
                key={product.id}
                className="bg-white rounded-3xl p-5 border border-navy/5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group cursor-pointer"
                onClick={() => router.push(`/vendors/${product.sellerId}/trust`)}
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className={cn(
                      "text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full",
                      product.availabilityStatus === "In Stock" && "bg-lime/20 text-lime-800",
                      product.availabilityStatus === "Low Stock" && "bg-amber-400/20 text-amber-900",
                      product.availabilityStatus === "Out of Stock" && "bg-coral/10 text-coral",
                      product.availabilityStatus === "Backorder" && "bg-navy/10 text-navy"
                    )}>
                      {product.availabilityStatus}
                    </span>
                    <div className="text-lg font-black text-navy">{formatPrice(product.sellingPrice)}</div>
                  </div>

                  <h3 className="text-base font-bold text-navy mb-1 leading-snug group-hover:text-cobalt transition-colors">
                    {product.name}
                  </h3>
                  <div className="text-xs font-bold text-navy/40 mb-4 uppercase tracking-widest">
                    {product.brand} • {product.category}
                  </div>

                  <div className="p-3 bg-navy/5 rounded-2xl space-y-2 text-xs font-medium text-navy/70 mb-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-bold text-navy">
                        <Store className="w-3.5 h-3.5 text-navy/40" />
                        {product.sellerName}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-bold">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {product.rating}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-navy/40" />
                        {product.sellerLocation}
                      </div>
                      <div className="text-[10px] font-bold text-navy/50">{product.distanceKm} km away</div>
                    </div>
                    <div className="flex items-center gap-3 pt-1">
                      {product.deliveryAvailable && (
                        <div className="flex items-center gap-1 text-[10px] font-bold text-cobalt bg-cobalt/5 px-2 py-0.5 rounded-md">
                          <Truck className="w-3 h-3" /> Delivery
                        </div>
                      )}
                      {product.pickupAvailable && (
                        <div className="flex items-center gap-1 text-[10px] font-bold text-lime-700 bg-lime/10 px-2 py-0.5 rounded-md">
                          <Package className="w-3 h-3" /> Pickup
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-navy/5">
                   <div className={cn(
                    "text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md flex items-center gap-1",
                    product.trustTier === "Gold" && "text-amber-700 bg-amber-50",
                    product.trustTier === "Silver" && "text-slate-600 bg-slate-50",
                    product.trustTier === "Bronze" && "text-orange-800 bg-orange-50"
                  )}>
                    <ShieldCheck className="w-3 h-3" />
                    {product.trustTier} ({product.trustScore})
                  </div>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push("/login?returnTo=/buyer/requirements/new");
                    }}
                    className="py-2 px-4 text-xs font-bold text-white bg-navy hover:bg-navy/90 rounded-xl transition-colors shadow-sm flex items-center gap-1"
                  >
                    Buy / Quote <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-navy/5 flex flex-col items-center justify-center min-h-[40vh]">
            <Search className="w-12 h-12 text-navy/20 mb-4" />
            <h3 className="text-xl font-bold text-navy mb-2">No local products found</h3>
            <p className="text-navy/60 font-medium mb-6 max-w-sm mx-auto">
              No local products match these filters. Try adjusting your search criteria or clear all filters.
            </p>
            <button 
              onClick={handleClearFilters}
              className="px-6 py-3 font-bold text-navy bg-navy/5 hover:bg-navy/10 rounded-xl transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="mt-10 flex flex-col items-center border-t border-navy/10 pt-8">
            
            {/* Desktop Pagination */}
            <div className="hidden md:flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-bold text-navy hover:bg-navy/5 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
              
              <div className="flex items-center gap-1 px-4">
                {getPageNumbers().map(pageNum => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={cn(
                      "w-10 h-10 rounded-xl text-sm font-bold transition-colors flex items-center justify-center",
                      currentPage === pageNum 
                        ? "bg-navy text-white shadow-md" 
                        : "text-navy hover:bg-navy/5"
                    )}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-bold text-navy hover:bg-navy/5 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile Pagination */}
            <div className="flex md:hidden items-center justify-between w-full max-w-sm mx-auto bg-white p-2 rounded-2xl shadow-sm border border-navy/5">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-3 rounded-xl text-navy hover:bg-navy/5 disabled:opacity-30 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="text-sm font-bold text-navy">
                Page {currentPage} of {totalPages}
              </div>

              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-3 rounded-xl text-navy hover:bg-navy/5 disabled:opacity-30 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

          </div>
        )}

      </div>
    </WorkspaceLayout>
  );
}

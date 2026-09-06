"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { WorkspaceLayout } from "@/components/layout/WorkspaceLayout";
import { UserRole } from "@/types/auth";
import { 
  Search, MapPin, Building2, ShieldCheck, Star, Package, 
  ChevronLeft, ChevronRight, Truck, Store, ArrowRight, MessageSquare, Scale, X, Send, ShoppingCart, Plus, Minus, Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";
import * as motion from "framer-motion/client";
import { AnimatePresence } from "framer-motion";

const formatCurrency = (val: number) => `₹${val.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

export default function LocalSellersPage() {
  const router = useRouter();
  
  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [cityFilter, setCityFilter] = useState("ALL");
  const [sortOrder, setSortOrder] = useState("BEST_MATCH");
  
  // New Features: Compare & Chat
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [showCompare, setShowCompare] = useState(false);
  const [chatSeller, setChatSeller] = useState<any>(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Cart
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    import("@/lib/demoState").then(m => {
      setCartItems(m.demoState.getCartItems());
      const unsub = m.demoState.subscribeCart(() => setCartItems(m.demoState.getCartItems()));
      return () => unsub();
    });
  }, []);

  const addToCart = (product: any, e: React.MouseEvent) => {
    e.stopPropagation();
    import("@/lib/demoState").then(m => {
      const currentCart = m.demoState.getCartItems();
      const existing = currentCart.find(i => i.productId === product.id);
      if (existing) {
        if (existing.quantity < product.stock) {
           existing.quantity += 1;
           m.demoState.setCartItems([...currentCart]);
        }
      } else {
        const newItem = {
          id: Math.random().toString(36).substr(2, 9),
          productId: product.id,
          sellerId: product.sellerId,
          sellerName: product.sellerName,
          name: product.name,
          image: product.image,
          quantity: 1,
          unitPrice: product.sellingPrice,
          availableQuantity: product.stock
        };
        m.demoState.setCartItems([...currentCart, newItem]);
      }
      setIsCartOpen(true);
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    import("@/lib/demoState").then(m => {
      const currentCart = m.demoState.getCartItems();
      const item = currentCart.find(i => i.id === id);
      if (item) {
        const newQ = item.quantity + delta;
        if (newQ > 0 && newQ <= item.availableQuantity) {
          item.quantity = newQ;
          m.demoState.setCartItems([...currentCart]);
        } else if (newQ === 0) {
          m.demoState.setCartItems(currentCart.filter(i => i.id !== id));
        }
      }
    });
  };

  const removeCartItem = (id: string) => {
    import("@/lib/demoState").then(m => {
      const currentCart = m.demoState.getCartItems();
      m.demoState.setCartItems(currentCart.filter(i => i.id !== id));
    });
  };

  const cartItemCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);
  const cartSubtotal = cartItems.reduce((acc, i) => acc + (i.unitPrice * i.quantity), 0);

  const handleCheckout = () => {
    // Guest checkout logic
    import("@/lib/authService").then(m => {
      const user = m.authService.getCurrentUser();
      if (!user) {
        router.push("/login?returnTo=/buyer/checkout");
      } else {
        router.push("/buyer/checkout");
      }
    });
  };

  useEffect(() => {
    fetch("http://localhost:8080/api/products")
      .then(res => res.json())
      .then(data => {
        const mapped = data.map((p: any) => {
          // Generate deterministic mock data for missing fields based on ID
          const mockDist = (p.id % 15) + 1.2;
          const mockRating = 4.0 + ((p.id % 10) / 10);
          
          return {
            id: `PRD-${p.id}`,
            name: p.name,
            category: p.category,
            brand: p.brand || "Generic",
            sellerName: p.sellerName || "Local Vendor",
            sellerId: p.sellerId || "VND-LOC-00",
            price: p.basePrice || 0,
            originalPrice: p.originalPrice || (p.basePrice ? p.basePrice * 1.25 : 0),
            sellingPrice: p.sellingPrice || p.basePrice || 0,
            image: p.imageUrl || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800",
            stock: p.stock || 10,
            sellerLocation: p.city || "Mumbai",
            trustScore: p.trustScore || 85,
            verificationStatus: p.verificationStatus || "VERIFIED",
            distanceKm: parseFloat(mockDist.toFixed(1)),
            rating: mockRating,
            trustTier: p.trustScore > 90 ? "Gold" : (p.trustScore > 80 ? "Silver" : "Bronze"),
            availabilityStatus: p.stock > 20 ? "In Stock" : (p.stock > 0 ? "Low Stock" : "Out of Stock"),
            deliveryAvailable: true,
            pickupAvailable: true
          };
        });
        setDbProducts(mapped);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, []);

  const categories = useMemo(() => ["ALL", ...Array.from(new Set(dbProducts.map(p => p.category))).sort()], [dbProducts]);
  const cities = useMemo(() => ["ALL", ...Array.from(new Set(dbProducts.map(p => p.sellerLocation))).sort()], [dbProducts]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, categoryFilter, cityFilter, sortOrder]);

  const filteredAndSorted = useMemo(() => {
    let result = dbProducts.filter((p) => {
      const matchSearch = 
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.brand.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase()) ||
        p.sellerName.toLowerCase().includes(search.toLowerCase());
        
      const matchCategory = categoryFilter === "ALL" || p.category === categoryFilter;
      const matchCity = cityFilter === "ALL" || p.sellerLocation === cityFilter;
      
      return matchSearch && matchCategory && matchCity;
    });

    switch (sortOrder) {
      case "PRICE_LOW": result.sort((a, b) => a.sellingPrice - b.sellingPrice); break;
      case "PRICE_HIGH": result.sort((a, b) => b.sellingPrice - a.sellingPrice); break;
      case "TRUST": result.sort((a, b) => b.trustScore - a.trustScore); break;
      case "DISTANCE": result.sort((a, b) => a.distanceKm - b.distanceKm); break;
    }

    return result;
  }, [dbProducts, search, categoryFilter, cityFilter, sortOrder]);

  const totalPages = Math.ceil(filteredAndSorted.length / itemsPerPage);
  const currentItems = filteredAndSorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleCompare = (id: string) => {
    setCompareIds(prev => {
      if (prev.includes(id)) return prev.filter(pid => pid !== id);
      if (prev.length >= 3) {
        alert("You can compare up to 3 products at a time.");
        return prev;
      }
      return [...prev, id];
    });
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  return (
    <WorkspaceLayout role={UserRole.BUYER} requireAuth={false}>
      <div className="space-y-6 md:space-y-8 pb-32">
        
        {/* HEADER & SEARCH */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-navy tracking-tight mb-2">Local Sellers</h1>
            <p className="text-navy/60 font-medium text-lg">Discover products available immediately in your area.</p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-3 rounded-xl bg-white border border-navy/10 shadow-sm text-navy hover:bg-navy/5 transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartItemCount > 0 && (
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-coral text-white text-xs font-bold flex items-center justify-center shadow-md">
                  {cartItemCount}
                </div>
              )}
            </button>
          </div>
        </div>

        {/* FILTERS */}
        <div className="bg-white p-4 rounded-2xl border border-navy/5 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy/40" />
            <input 
              type="text" 
              placeholder="Search products, brands, sellers..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-warm/30 border-none focus:ring-2 focus:ring-cobalt/20 outline-none font-medium text-navy placeholder:text-navy/40"
            />
          </div>
          <select 
            value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-warm/30 border-none focus:ring-2 focus:ring-cobalt/20 outline-none font-bold text-navy appearance-none cursor-pointer"
          >
            {categories.map(c => <option key={c} value={c}>{c === "ALL" ? "All Categories" : c}</option>)}
          </select>
          <select 
            value={cityFilter} onChange={(e) => setCityFilter(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-warm/30 border-none focus:ring-2 focus:ring-cobalt/20 outline-none font-bold text-navy appearance-none cursor-pointer"
          >
            {cities.map(c => <option key={c} value={c}>{c === "ALL" ? "All Locations" : c}</option>)}
          </select>
          <select 
            value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-warm/30 border-none focus:ring-2 focus:ring-cobalt/20 outline-none font-bold text-navy appearance-none cursor-pointer"
          >
            <option value="BEST_MATCH">Best Match</option>
            <option value="DISTANCE">Nearest First</option>
            <option value="PRICE_LOW">Price: Low to High</option>
            <option value="PRICE_HIGH">Price: High to Low</option>
            <option value="TRUST">Highest Trust Score</option>
          </select>
        </div>

        {/* PRODUCT GRID */}
        {loading ? (
          <div className="py-20 text-center font-bold text-navy/40">Loading local products...</div>
        ) : currentItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentItems.map((product) => (
              <div 
                key={product.id} 
                className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-navy/5 shadow-sm hover:shadow-xl transition-all duration-300 relative"
              >
                {/* Compare Checkbox */}
                <div className="absolute top-4 left-4 z-10">
                  <label className="flex items-center gap-2 cursor-pointer bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg shadow-sm border border-navy/10 hover:bg-white transition-colors">
                    <input 
                      type="checkbox" 
                      checked={compareIds.includes(product.id)}
                      onChange={() => toggleCompare(product.id)}
                      className="w-4 h-4 rounded text-cobalt focus:ring-cobalt/20"
                    />
                    <span className="text-[10px] font-bold text-navy uppercase tracking-widest">Compare</span>
                  </label>
                </div>

                {/* Image */}
                <div className="aspect-[4/3] bg-warm relative overflow-hidden">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col cursor-pointer">
                  <div className="flex justify-between items-start mb-3">
                    <span className={cn(
                      "text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full",
                      product.availabilityStatus === "In Stock" && "bg-lime/20 text-lime-800",
                      product.availabilityStatus === "Low Stock" && "bg-amber-400/20 text-amber-900",
                      product.availabilityStatus === "Out of Stock" && "bg-coral/10 text-coral"
                    )}>
                      {product.availabilityStatus}
                    </span>
                    
                    {/* Pricing Display */}
                    <div className="flex flex-col items-end">
                      {product.originalPrice > product.sellingPrice && (
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-navy/40 line-through">MRP {formatCurrency(product.originalPrice)}</span>
                          <span className="text-[9px] font-black text-white bg-coral px-1.5 py-0.5 rounded uppercase tracking-widest">
                            {Math.round(((product.originalPrice - product.sellingPrice) / product.originalPrice) * 100)}% OFF
                          </span>
                        </div>
                      )}
                      <div className="text-xl font-black text-navy">{formatCurrency(product.sellingPrice)}</div>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-navy mb-1 leading-snug group-hover:text-cobalt transition-colors">
                    {product.name}
                  </h3>
                  <div className="text-xs font-bold text-navy/40 mb-4 uppercase tracking-widest">
                    {product.brand} • {product.category}
                  </div>

                  <div className="p-3 bg-navy/5 rounded-2xl space-y-2 text-xs font-medium text-navy/70 mb-5 flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-bold text-navy">
                        <Store className="w-3.5 h-3.5 text-navy/40" /> {product.sellerName}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-bold">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {product.rating}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-navy/40" /> {product.sellerLocation}
                      </div>
                      <div className="text-[10px] font-bold text-cobalt flex items-center gap-1">
                         <span className="w-1.5 h-1.5 rounded-full bg-cobalt animate-pulse" /> {product.distanceKm} km away
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-navy/5 gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); setChatSeller(product); }}
                      className="flex-1 py-2 px-2 text-[10px] md:text-xs font-bold text-navy bg-navy/5 hover:bg-navy/10 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                    >
                      <MessageSquare className="w-3.5 h-3.5" /> Chat
                    </button>
                    <button
                      onClick={(e) => addToCart(product, e)}
                      className="flex-1 py-2 px-2 text-[10px] md:text-xs font-bold text-white bg-navy hover:bg-navy/90 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-1.5"
                    >
                      Add to Cart <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-navy/5">
            <h3 className="text-xl font-bold text-navy mb-2">No local products found</h3>
            <p className="text-navy/60 font-medium">Try adjusting your filters or location.</p>
          </div>
        )}

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-4">
             <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-lg bg-white border border-navy/10 text-navy disabled:opacity-50 hover:bg-navy/5"><ChevronLeft className="w-5 h-5"/></button>
             <span className="font-bold text-sm text-navy">Page {currentPage} of {totalPages}</span>
             <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 rounded-lg bg-white border border-navy/10 text-navy disabled:opacity-50 hover:bg-navy/5"><ChevronRight className="w-5 h-5"/></button>
          </div>
        )}

      </div>

      {/* FLOATING COMPARE BAR */}
      <AnimatePresence>
        {compareIds.length > 0 && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-24 md:bottom-12 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md bg-navy text-white rounded-2xl p-4 shadow-2xl flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"><Scale className="w-5 h-5" /></div>
              <div>
                <div className="font-bold text-sm">{compareIds.length} Products Selected</div>
                <button onClick={() => setCompareIds([])} className="text-[10px] text-white/50 hover:text-white uppercase tracking-widest font-bold">Clear All</button>
              </div>
            </div>
            <button 
              onClick={() => setShowCompare(true)}
              className="px-6 py-2.5 bg-lime text-lime-950 font-bold rounded-xl text-sm hover:bg-lime/90 transition-colors shadow-lg"
            >
              Compare Now
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* COMPARE MODAL */}
      <AnimatePresence>
        {showCompare && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-navy/60 backdrop-blur-sm" onClick={() => setShowCompare(false)} />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-5xl max-h-[85vh] overflow-y-auto relative z-10 shadow-2xl"
            >
              <div className="sticky top-0 bg-white/90 backdrop-blur p-6 border-b border-navy/5 flex items-center justify-between z-20">
                <h2 className="text-2xl font-bold text-navy flex items-center gap-2"><Scale className="w-6 h-6 text-cobalt" /> Compare Local Products</h2>
                <button onClick={() => setShowCompare(false)} className="p-2 bg-warm rounded-full hover:bg-navy/5"><X className="w-5 h-5 text-navy" /></button>
              </div>
              
              <div className="p-6 overflow-x-auto">
                <table className="w-full min-w-[600px] text-left border-collapse">
                  <thead>
                    <tr>
                      <th className="p-4 border-b-2 border-navy/10 text-xs font-bold text-navy/40 uppercase tracking-widest w-1/4">Feature</th>
                      {compareIds.map(id => {
                        const p = dbProducts.find(x => x.id === id);
                        return (
                          <th key={id} className="p-4 border-b-2 border-navy/10 w-1/4 align-top">
                            <img src={p?.image} className="w-full h-32 object-cover rounded-xl mb-3 shadow-sm" />
                            <div className="font-bold text-navy text-sm mb-1">{p?.name}</div>
                            <div className="text-[10px] text-navy/50 uppercase tracking-widest">{p?.brand}</div>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody className="text-sm font-medium text-navy/80">
                    <tr>
                      <td className="p-4 border-b border-navy/5 font-bold">Selling Price</td>
                      {compareIds.map(id => <td key={id} className="p-4 border-b border-navy/5 font-black text-navy text-lg">{formatCurrency(dbProducts.find(x => x.id === id)?.sellingPrice)}</td>)}
                    </tr>
                    <tr>
                      <td className="p-4 border-b border-navy/5 font-bold">MRP</td>
                      {compareIds.map(id => {
                        const p = dbProducts.find(x => x.id === id);
                        return <td key={id} className="p-4 border-b border-navy/5 line-through text-navy/40">{formatCurrency(p?.originalPrice)}</td>;
                      })}
                    </tr>
                    <tr>
                      <td className="p-4 border-b border-navy/5 font-bold">Seller</td>
                      {compareIds.map(id => <td key={id} className="p-4 border-b border-navy/5 flex items-center gap-2"><Store className="w-4 h-4 text-navy/40"/>{dbProducts.find(x => x.id === id)?.sellerName}</td>)}
                    </tr>
                    <tr>
                      <td className="p-4 border-b border-navy/5 font-bold">Distance</td>
                      {compareIds.map(id => <td key={id} className="p-4 border-b border-navy/5 font-bold text-cobalt">{dbProducts.find(x => x.id === id)?.distanceKm} km away</td>)}
                    </tr>
                    <tr>
                      <td className="p-4 border-b border-navy/5 font-bold">Trust Score</td>
                      {compareIds.map(id => {
                        const p = dbProducts.find(x => x.id === id);
                        return (
                          <td key={id} className="p-4 border-b border-navy/5">
                            <div className="flex items-center gap-1">
                              <ShieldCheck className={cn("w-4 h-4", p.trustTier === 'Gold' ? 'text-amber-500' : 'text-slate-500')} /> 
                              {p.trustScore}/100
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CART DRAWER */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-[120] flex justify-end">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-navy/60 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
            <motion.div 
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-white w-full max-w-md h-full relative z-10 shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-navy/5 flex items-center justify-between">
                <h2 className="text-xl font-bold text-navy flex items-center gap-2"><ShoppingCart className="w-6 h-6 text-cobalt" /> Your Cart</h2>
                <button onClick={() => setIsCartOpen(false)} className="p-2 bg-warm rounded-full hover:bg-navy/5"><X className="w-5 h-5 text-navy" /></button>
              </div>
              
              {/* Items */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {cartItems.length === 0 ? (
                  <div className="text-center py-20 opacity-50">
                    <ShoppingCart className="w-12 h-12 mx-auto mb-4" />
                    <p className="font-bold">Your cart is empty.</p>
                  </div>
                ) : (
                  cartItems.map(item => (
                    <div key={item.id} className="flex gap-4 p-4 border border-navy/5 rounded-2xl shadow-sm">
                      <img src={item.image} className="w-20 h-20 object-cover rounded-xl" />
                      <div className="flex-1">
                        <div className="text-sm font-bold text-navy mb-1 leading-tight">{item.name}</div>
                        <div className="text-[10px] text-navy/50 uppercase tracking-widest mb-2">{item.sellerName}</div>
                        <div className="font-bold text-navy">{formatCurrency(item.unitPrice)}</div>
                        
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-3 bg-navy/5 rounded-lg px-2 py-1">
                            <button onClick={() => updateQuantity(item.id, -1)} className="text-navy hover:text-cobalt"><Minus className="w-4 h-4" /></button>
                            <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, 1)} className="text-navy hover:text-cobalt"><Plus className="w-4 h-4" /></button>
                          </div>
                          <button onClick={() => removeCartItem(item.id)} className="text-coral hover:bg-coral/10 p-1.5 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              {/* Footer */}
              {cartItems.length > 0 && (
                <div className="p-6 bg-navy text-white shadow-[0_-10px_20px_rgba(0,0,0,0.1)]">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-medium text-white/70">Subtotal</span>
                    <span className="text-xl font-bold">{formatCurrency(cartSubtotal)}</span>
                  </div>
                  <button onClick={handleCheckout} className="w-full py-4 bg-cobalt hover:bg-cobalt/90 text-white font-bold rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2">
                    Proceed to Checkout <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CHAT MODAL */}
      <AnimatePresence>
        {chatSeller && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-navy/60 backdrop-blur-sm" onClick={() => setChatSeller(null)} />
            <motion.div 
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-lg relative z-10 shadow-2xl overflow-hidden flex flex-col h-[600px]"
            >
              {/* Chat Header */}
              <div className="bg-navy p-5 text-white flex items-center justify-between shadow-md z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold">{chatSeller.sellerName.substring(0, 2).toUpperCase()}</div>
                  <div>
                    <h3 className="font-bold text-sm">{chatSeller.sellerName}</h3>
                    <div className="text-[10px] text-lime-400 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse" /> Online now</div>
                  </div>
                </div>
                <button onClick={() => setChatSeller(null)} className="p-2 bg-white/10 rounded-full hover:bg-white/20"><X className="w-4 h-4" /></button>
              </div>

              {/* Product Reference */}
              <div className="bg-warm/50 p-3 flex items-center gap-3 border-b border-navy/5">
                <img src={chatSeller.image} className="w-12 h-12 rounded-lg object-cover" />
                <div className="flex-1">
                  <div className="text-xs font-bold text-navy truncate">{chatSeller.name}</div>
                  <div className="text-[10px] font-bold text-navy/50">{formatCurrency(chatSeller.sellingPrice)}</div>
                </div>
              </div>

              {/* Chat Body */}
              <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-[#f8f9fb]">
                <div className="text-center text-[10px] font-bold text-navy/30 uppercase tracking-widest my-4">Today</div>
                <div className="flex flex-col gap-1 items-start">
                  <div className="bg-white border border-navy/5 text-navy p-3 text-sm rounded-2xl rounded-tl-sm shadow-sm max-w-[85%]">
                    Hi! Thanks for your interest in the {chatSeller.name}. I have {chatSeller.stock} units currently in stock at our {chatSeller.sellerLocation} warehouse ({chatSeller.distanceKm} km from your location). Let me know if you need more details!
                  </div>
                  <div className="text-[9px] font-bold text-navy/30 ml-1">10:02 AM</div>
                </div>
              </div>

              {/* Chat Input */}
              <div className="p-4 bg-white border-t border-navy/5">
                <div className="relative">
                  <input type="text" placeholder="Type your message..." className="w-full pl-4 pr-12 py-3 bg-warm/50 rounded-xl border-none focus:ring-2 focus:ring-cobalt/20 outline-none text-sm font-medium" />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-cobalt text-white rounded-lg flex items-center justify-center hover:bg-cobalt/90 shadow-sm">
                    <Send className="w-3.5 h-3.5 ml-0.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </WorkspaceLayout>
  );
}

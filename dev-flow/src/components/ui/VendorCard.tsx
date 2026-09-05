import React from "react";
import { cn } from "@/lib/utils";
import { TrustBadge } from "./TrustBadge";
import { Star, Truck, CheckCircle2 } from "lucide-react";
import * as motion from "framer-motion/client";

export interface VendorProps {
  name: string;
  price: string;
  tier: "GOLD" | "SILVER" | "BRONZE" | "NONE";
  rating: number;
  delivery: string;
  isRecommended?: boolean;
  className?: string;
  delay?: number;
}

export function VendorCard({ name, price, tier, rating, delivery, isRecommended, className, delay = 0 }: VendorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      className={cn(
        "relative p-5 rounded-2xl bg-white border transition-all duration-300",
        isRecommended ? "border-coral shadow-lg shadow-coral/10 scale-[1.02]" : "border-navy/10 hover:border-navy/20 hover:shadow-md",
        className
      )}
    >
      {isRecommended && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-coral text-white text-[10px] font-bold uppercase tracking-widest rounded-full flex items-center gap-1 shadow-sm">
          <CheckCircle2 className="w-3 h-3" /> Best Overall Value
        </div>
      )}
      
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="text-sm font-medium text-navy/60 mb-1 uppercase tracking-wide">{name}</h4>
          <div className="text-2xl font-bold text-navy">{price}</div>
        </div>
        <TrustBadge tier={tier} />
      </div>
      
      <div className="flex flex-col gap-2 pt-4 border-t border-navy/5 text-sm text-navy/70">
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 fill-gold text-gold" />
          <span className="font-medium text-navy">{rating}</span> rating
        </div>
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-navy/40" />
          {delivery}
        </div>
      </div>
    </motion.div>
  );
}

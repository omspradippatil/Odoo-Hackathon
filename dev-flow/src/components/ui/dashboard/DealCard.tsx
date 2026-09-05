import React from "react";
import { cn } from "@/lib/utils";
import { ShieldCheck, ChevronRight, AlertCircle, Activity } from "lucide-react";
import { DealSummary } from "@/types/dashboard";
import { StatusChip } from "./StatusChip";

interface DealCardProps {
  deal: DealSummary;
  onClick?: () => void;
  showCustomer?: boolean;
  showVendor?: boolean;
}

export function DealCard({ deal, onClick, showCustomer = true, showVendor = true }: DealCardProps) {
  const formatCurrency = (val: number) => {
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)}L`;
    return `₹${val.toLocaleString('en-IN')}`;
  };

  return (
    <div 
      onClick={onClick}
      className={cn(
        "bg-white p-5 md:p-6 rounded-2xl border border-navy/5 shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer flex flex-col gap-4 relative overflow-hidden",
        deal.priority === 'HIGH' ? "border-l-4 border-l-coral" : ""
      )}
    >
      <div className="flex justify-between items-start gap-4">
        <div>
          <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mb-1.5">{deal.id}</div>
          <h3 className="text-base font-bold text-navy leading-tight group-hover:text-cobalt transition-colors">{deal.title}</h3>
        </div>
        <div className="text-right shrink-0">
          <div className="text-lg font-bold text-navy">{formatCurrency(deal.amount)}</div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-navy/60">
        {showCustomer && deal.customer && (
          <div className="flex items-center gap-1.5"><span className="text-navy/40">Customer:</span> <span className="text-navy font-bold">{deal.customer}</span></div>
        )}
        {showVendor && deal.vendor && (
          <div className="flex items-center gap-1.5"><span className="text-navy/40">Vendor:</span> <span className="text-navy font-bold">{deal.vendor}</span></div>
        )}
        {deal.trustTier && deal.trustTier !== 'NONE' && (
          <div className="flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase text-gold">
            <ShieldCheck className="w-3 h-3" /> {deal.trustTier}
          </div>
        )}
      </div>

      {deal.insight && (
        <div className="bg-navy/5 p-3 rounded-xl flex items-start gap-2.5">
          <Activity className="w-4 h-4 text-cobalt shrink-0 mt-0.5" />
          <div className="text-xs font-medium text-navy/70 leading-relaxed">{deal.insight}</div>
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-navy/5">
        <StatusChip label={deal.statusLabel} />
        
        <div className="flex items-center gap-3">
          {deal.health === 'NEEDS_ATTENTION' && <AlertCircle className="w-4 h-4 text-orange-500" />}
          {deal.health === 'AT_RISK' && <AlertCircle className="w-4 h-4 text-coral animate-pulse" />}
          <div className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-cobalt opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0">
            {deal.nextAction || "View"} <ChevronRight className="w-3 h-3" />
          </div>
        </div>
      </div>
    </div>
  );
}

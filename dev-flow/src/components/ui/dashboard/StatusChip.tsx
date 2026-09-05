import React from "react";
import { cn } from "@/lib/utils";
import { Clock, CheckCircle2, AlertCircle, ShieldCheck, Truck, FileText } from "lucide-react";

export interface StatusChipProps {
  label: string;
  className?: string;
}

export function StatusChip({ label, className }: StatusChipProps) {
  let colorClass = "bg-navy/10 text-navy";
  let Icon = FileText;

  const lbl = label.toUpperCase();

  if (lbl.includes("WAITING") || lbl.includes("PENDING")) {
    colorClass = "bg-orange-50 text-orange-700 border border-orange-200/50";
    Icon = Clock;
  } else if (lbl.includes("APPROV") && !lbl.includes("REQUIRED")) {
    colorClass = "bg-lime/20 text-lime-800 border border-lime/30";
    Icon = CheckCircle2;
  } else if (lbl.includes("REQUIRED") || lbl.includes("RISK") || lbl.includes("EXCEPTION")) {
    colorClass = "bg-coral/10 text-coral border border-coral/20";
    Icon = AlertCircle;
  } else if (lbl.includes("PROTECTED")) {
    colorClass = "bg-cobalt/10 text-cobalt border border-cobalt/20";
    Icon = ShieldCheck;
  } else if (lbl.includes("FULFILMENT") || lbl.includes("DELIVERED")) {
    colorClass = "bg-navy text-white";
    Icon = Truck;
  }

  return (
    <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase", colorClass, className)}>
      <Icon className="w-3 h-3" />
      {label}
    </div>
  );
}

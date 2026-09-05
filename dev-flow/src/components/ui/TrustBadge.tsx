import React from "react";
import { cn } from "@/lib/utils";
import { ShieldCheck } from "lucide-react";

type Tier = "GOLD" | "SILVER" | "BRONZE" | "NONE";

export function TrustBadge({ tier, className }: { tier: Tier; className?: string }) {
  if (tier === "NONE") return null;

  const styles = {
    GOLD: "bg-gold/10 text-yellow-700 border-gold/30",
    SILVER: "bg-silver/10 text-gray-700 border-silver/30",
    BRONZE: "bg-bronze/10 text-orange-800 border-bronze/30",
  };

  return (
    <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold tracking-wider border", styles[tier], className)}>
      <ShieldCheck className="w-3.5 h-3.5" />
      {tier}
    </div>
  );
}

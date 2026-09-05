"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import * as motion from "framer-motion/client";
import { ShieldCheck, Network, Activity, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: 1, label: "Securing connection", icon: ShieldCheck },
  { id: 2, label: "Provisioning workspace environment", icon: Network },
  { id: 3, label: "Initializing DEV FLOW Trust Engine", icon: Activity },
  { id: 4, label: "Workspace ready", icon: CheckCircle2 },
];

export default function OnboardingProduction() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => {
        if (prev >= STEPS.length - 1) {
          clearInterval(interval);
          setTimeout(() => {
            router.push("/dashboard");
          }, 1000);
          return prev;
        }
        return prev + 1;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [router]);

  return (
    <main className="min-h-screen bg-warm flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
        <Activity className="w-[800px] h-[800px] text-navy" />
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="mb-12 text-center">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            className="w-16 h-16 rounded-2xl bg-navy flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-navy/20"
          >
            <Network className="w-8 h-8 text-white animate-pulse" />
          </motion.div>
          <h1 className="text-2xl font-bold text-navy tracking-tight mb-2">Preparing Your Workspace</h1>
          <p className="text-navy/50 font-medium text-sm">Please wait while we configure your DEV FLOW environment.</p>
        </div>

        <div className="bg-white rounded-[32px] p-8 border border-navy/5 shadow-xl shadow-navy/5">
          <div className="space-y-6">
            {STEPS.map((s, i) => {
              const isActive = i === step;
              const isPast = i < step;
              const isFuture = i > step;
              const Icon = s.icon;

              return (
                <div key={s.id} className={cn("flex items-center gap-4 transition-all duration-500", isFuture ? "opacity-30" : "opacity-100")}>
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors duration-500", 
                    isPast ? "bg-lime/20 text-lime" : isActive ? "bg-cobalt text-white shadow-lg shadow-cobalt/20" : "bg-navy/5 text-navy/30"
                  )}>
                    {isPast ? <CheckCircle2 className="w-5 h-5" /> : <Icon className={cn("w-5 h-5", isActive && "animate-pulse")} />}
                  </div>
                  <div className="flex-1">
                    <div className={cn("text-sm font-bold tracking-wide transition-colors duration-500", isActive ? "text-navy" : isPast ? "text-navy/60" : "text-navy/40")}>
                      {s.label}
                    </div>
                    {isActive && (
                      <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 1.2, ease: "linear" }} className="h-0.5 bg-cobalt/20 mt-2 rounded-full overflow-hidden">
                        <div className="h-full bg-cobalt w-full" />
                      </motion.div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}

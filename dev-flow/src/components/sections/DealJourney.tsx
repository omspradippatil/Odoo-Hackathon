"use client";

import React, { useRef, useState, useEffect } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useScroll, useTransform } from "framer-motion";
import * as motion from "framer-motion/client";

const STAGES = [
  { num: "01", title: "REQUEST", desc: "Create requirement" },
  { num: "02", title: "COMPARE", desc: "Evaluate vendors" },
  { num: "03", title: "APPROVE", desc: "Route exceptions" },
  { num: "04", title: "NEGOTIATE", desc: "Agree terms" },
  { num: "05", title: "PROTECT", desc: "Secure transaction" },
  { num: "06", title: "FULFIL", desc: "Coordinate delivery" },
  { num: "07", title: "BILL", desc: "Close the deal" },
];

export function DealJourney() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 50%"]
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const lineWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    return scrollYProgress.on("change", (v) => {
      const idx = Math.min(Math.floor(v * STAGES.length), STAGES.length - 1);
      setActiveStage(idx);
    });
  }, [scrollYProgress]);

  return (
    <section id="how-it-works" className="py-32 bg-white px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <SectionHeading
          title={
            <>
              From requirement to revenue.<br />
              <span className="text-cobalt">One continuous deal.</span>
            </>
          }
          className="mb-24"
        />

        <div ref={containerRef} className="relative pb-10">
          {/* DESKTOP HORIZONTAL LINE */}
          <div className="hidden md:block absolute top-6 left-0 right-0 h-1 bg-navy/5 rounded-full overflow-hidden">
            <motion.div className="h-full bg-cobalt" style={{ width: lineWidth }} />
          </div>

          {/* MOBILE VERTICAL LINE */}
          <div className="md:hidden absolute top-0 bottom-0 left-6 w-1 bg-navy/5 rounded-full overflow-hidden -z-10">
            <motion.div className="w-full bg-cobalt" style={{ height: lineHeight }} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-7 gap-12 md:gap-4 relative z-10">
            {STAGES.map((stage, i) => {
              const isActive = i <= activeStage;
              const isCurrent = i === activeStage;
              
              return (
                <div key={stage.num} className="relative flex md:flex-col items-center md:items-start gap-6 md:gap-8 pl-16 md:pl-0">
                  <div 
                    className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center font-bold text-sm md:text-base border-2 transition-all duration-500 absolute md:relative left-0 md:left-auto top-0 md:top-auto -translate-x-1/2 md:translate-x-0 ${isActive ? 'border-cobalt bg-cobalt text-white' : 'border-navy/10 bg-white text-navy/40'} ${isCurrent ? 'ring-4 ring-cobalt/20 scale-110' : ''}`}
                  >
                    {stage.num}
                  </div>
                  
                  <div className={`transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-40'}`}>
                    <h4 className="text-sm md:text-xs lg:text-sm font-bold text-navy mb-1 md:mb-2 tracking-widest">{stage.title}</h4>
                    <p className="text-sm md:text-xs lg:text-sm font-medium text-navy/60">{stage.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}

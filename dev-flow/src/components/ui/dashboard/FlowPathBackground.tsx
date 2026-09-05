"use client";

import React from "react";
import * as motion from "framer-motion/client";

export function FlowPathBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-10">
      <svg className="w-full h-full" viewBox="0 0 1000 600" preserveAspectRatio="none">
        <path 
          id="flow-path"
          d="M-100,100 C200,100 300,400 600,400 C800,400 900,200 1200,200" 
          fill="none" 
          stroke="#0B1020" 
          strokeWidth="1"
          strokeDasharray="4 8"
        />
        <motion.circle
          r="4"
          fill="#5367FF"
          initial={{ offsetDistance: "0%" } as any}
          animate={{ offsetDistance: "100%" } as any}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{ offsetPath: "path('M-100,100 C200,100 300,400 600,400 C800,400 900,200 1200,200')" } as any}
        />
        <motion.circle
          r="2"
          fill="#C9FF5A"
          initial={{ offsetDistance: "30%" } as any}
          animate={{ offsetDistance: "100%" } as any}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{ offsetPath: "path('M-100,100 C200,100 300,400 600,400 C800,400 900,200 1200,200')" } as any}
        />
      </svg>
    </div>
  );
}

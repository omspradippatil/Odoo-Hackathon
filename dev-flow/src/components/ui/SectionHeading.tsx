import React from "react";
import { cn } from "@/lib/utils";
import * as motion from "framer-motion/client";

interface Props {
  label?: string;
  title: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({ label, title, align = "left", className }: Props) {
  return (
    <div className={cn("flex flex-col gap-4", align === "center" ? "items-center text-center" : "items-start text-left", className)}>
      {label && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="inline-flex px-3 py-1 text-xs font-semibold tracking-widest uppercase rounded-full bg-navy/5 text-navy border border-navy/10"
        >
          {label}
        </motion.div>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-navy leading-[1.1]"
      >
        {title}
      </motion.h2>
    </div>
  );
}

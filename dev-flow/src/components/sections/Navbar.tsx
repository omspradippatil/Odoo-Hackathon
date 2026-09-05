"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { ArrowRightLeft } from "lucide-react";
import * as motion from "framer-motion/client";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
        scrolled ? "bg-warm/80 backdrop-blur-md border-b border-navy/5 py-3" : "bg-transparent py-6"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-navy text-white flex items-center justify-center transition-transform group-hover:scale-105">
            <ArrowRightLeft className="w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight text-navy">DEV FLOW</span>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-navy/70">
          <Link href="#how-it-works" className="hover:text-navy transition-colors">How It Works</Link>
          <Link href="#solutions" className="hover:text-navy transition-colors">Solutions</Link>
          <Link href="#trust-engine" className="hover:text-navy transition-colors">Trust Engine</Link>
          <Link href="#professional" className="hover:text-navy transition-colors">For Business</Link>
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-4">
          <Link href="/login" className="hidden md:block text-sm font-medium text-navy hover:opacity-70 transition-opacity">
            Sign In
          </Link>
          <PrimaryButton href="/signup" className="py-2 px-5 text-sm" showArrow>
            Start a Deal
          </PrimaryButton>
        </div>
      </div>
    </motion.header>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { ArrowRightLeft, Menu, X } from "lucide-react";
import * as motion from "framer-motion/client";
import { AnimatePresence } from "framer-motion";
import { BrandLogo } from "@/components/brand/BrandLogo";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{ fullName?: string; role?: string } | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    try {
      const stored = sessionStorage.getItem("aakalan_user") || sessionStorage.getItem("devflow_user");
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      // ignore
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleForBusinessClick = (e: React.MouseEvent) => {
    if (window.location.pathname !== "/") {
      return;
    }
    e.preventDefault();
    const el = document.getElementById("two-worlds");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      const allSections = document.querySelectorAll("section");
      for (const sec of Array.from(allSections)) {
        if (sec.textContent?.includes("TWO WORLDS") || sec.textContent?.includes("FOR BUSINESS")) {
          sec.scrollIntoView({ behavior: "smooth" });
          break;
        }
      }
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 md:px-6 py-4",
          scrolled ? "bg-warm/80 backdrop-blur-md border-b border-navy/5 py-3" : "bg-transparent py-4 md:py-6"
        )}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2 group z-50 relative">
            <BrandLogo variant="responsive" />
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-navy/70">
            <Link href="/explore" className="hover:text-navy transition-colors">Explore</Link>
            <Link href="#how-it-works" className="hover:text-navy transition-colors">How It Works</Link>
            <Link href="/buyer/local" className="hover:text-navy transition-colors">Local Sellers</Link>
            <Link href="#solutions" className="hover:text-navy transition-colors">Solutions</Link>
            <Link href="#trust-engine" className="hover:text-navy transition-colors">Trust Engine</Link>
            <Link href="/#for-business" onClick={handleForBusinessClick} className="hover:text-navy transition-colors">For Business</Link>
          </nav>

          {/* DESKTOP CTA */}
          <div className="hidden md:flex items-center gap-4">
            {!user ? (
              <>
                <Link href="/login" className="text-sm font-medium text-navy hover:opacity-70 transition-opacity">
                  Sign In
                </Link>
                <PrimaryButton href="/login?returnTo=/buyer/requirements/new" className="py-2 px-5 text-sm" showArrow>
                  Start a Deal
                </PrimaryButton>
              </>
            ) : (
              <PrimaryButton href="/buyer" className="py-2 px-5 text-sm" showArrow>
                Go to Workspace
              </PrimaryButton>
            )}
          </div>

          {/* MOBILE MENU TOGGLE */}
          <button 
            className="md:hidden relative z-50 p-2 text-navy"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </motion.header>

      {/* MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-warm pt-24 px-6 pb-6 md:hidden flex flex-col"
          >
            <nav className="flex flex-col gap-6 text-xl font-bold text-navy mb-12">
              <Link href="/explore" onClick={() => setMobileMenuOpen(false)}>Explore</Link>
              <Link href="#how-it-works" onClick={() => setMobileMenuOpen(false)}>How It Works</Link>
              <Link href="/buyer/local" onClick={() => setMobileMenuOpen(false)}>Local Sellers</Link>
              <Link href="#solutions" onClick={() => setMobileMenuOpen(false)}>Solutions</Link>
              <Link href="#trust-engine" onClick={() => setMobileMenuOpen(false)}>Trust Engine</Link>
              <Link href="/#for-business" onClick={(e) => { setMobileMenuOpen(false); handleForBusinessClick(e); }}>For Business</Link>
            </nav>
            <div className="flex flex-col gap-4 mt-auto border-t border-navy/10 pt-8">
              {!user ? (
                <>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="text-center font-bold text-navy py-3">
                    Sign In
                  </Link>
                  <PrimaryButton href="/login?returnTo=/buyer/requirements/new" onClick={() => setMobileMenuOpen(false)} showArrow className="w-full">
                    Start a Deal
                  </PrimaryButton>
                </>
              ) : (
                <PrimaryButton href="/buyer" onClick={() => setMobileMenuOpen(false)} showArrow className="w-full">
                  Go to Workspace
                </PrimaryButton>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

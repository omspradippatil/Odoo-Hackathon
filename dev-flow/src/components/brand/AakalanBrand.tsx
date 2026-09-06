"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface AakalanBrandProps {
  /** Size preset: sm (compact), md (default/sidebar), lg (navbar/hero) */
  size?: "sm" | "md" | "lg" | "sidebar" | "navbar" | "mobile";
  /** Color theme: light (navy text) or dark (white text) */
  theme?: "light" | "dark";
  /** If true, show only the A icon mark (for collapsed sidebar, favicon, avatar) */
  collapsed?: boolean;
  /** Whether to show text wordmark */
  showText?: boolean;
  /** Backwards compatibility with previous BrandLogo component */
  variant?: "full" | "mark" | "responsive";
  /** Optional badge text e.g. "Admin" */
  badge?: string;
  className?: string;
  iconClassName?: string;
  textClassName?: string;
}

/**
 * Aakalan360 Unified Brand Component
 *
 * Rules:
 * 1. ICON: Only the stylized circular/squircle 'A' symbol, tightly cropped, sharp, aspect-ratio 1:1.
 * 2. WORDMARK: Real HTML text `Aakalan360` with modern sans-serif typography (font-weight 700-800).
 *    - 'Aakalan' = Navy (light theme) or White (dark theme).
 *    - '360' = Warm gold/orange brand accent (#D49838 / #E0A745).
 * 3. NO TAGLINE: Absolutely no subtitles or taglines in navigation brand headers.
 * 4. COLLAPSED: Only the A icon (32–36px), centered.
 */
export function AakalanBrand({
  size,
  theme = "light",
  collapsed = false,
  showText = true,
  variant,
  badge,
  className = "",
  iconClassName = "",
  textClassName = "",
}: AakalanBrandProps) {
  // Determine if icon-only
  const isMarkOnly = collapsed || variant === "mark" || showText === false;

  // Sizing configurations according to official brand guidelines:
  // Desktop sidebar: icon ~32-38px, wordmark ~18-21px
  // Landing navbar: icon ~34-40px, wordmark ~20-24px
  // Mobile: icon ~28-32px, wordmark ~17-19px
  // Collapsed: icon ~32-36px
  let iconSizeClass = "h-9 w-9"; // ~36px default
  let textSizeClass = "text-lg md:text-xl"; // ~18-20px
  let gapClass = "gap-2.5"; // 10px

  if (size === "mobile") {
    iconSizeClass = "h-[30px] w-[30px]"; // ~28-30px
    textSizeClass = "text-[17px]"; // ~17-18px
    gapClass = "gap-2";
  } else if (size === "sm") {
    iconSizeClass = "h-7 w-7"; // 28px
    textSizeClass = "text-sm md:text-base";
    gapClass = "gap-2";
  } else if (size === "sidebar" || size === "md") {
    iconSizeClass = "h-[35px] w-[35px]"; // ~35px (fits 32-38px spec)
    textSizeClass = "text-[20px]"; // ~19-20px (fits 18-21px spec)
    gapClass = "gap-2.5";
  } else if (size === "navbar" || size === "lg") {
    iconSizeClass = "h-[38px] w-[38px]"; // ~38px (fits 34-40px spec)
    textSizeClass = "text-[22px]"; // ~22px (fits 20-24px spec)
    gapClass = "gap-3";
  }

  // Handle responsive variant from previous implementation
  if (variant === "responsive") {
    return (
      <div className={cn("inline-flex items-center gap-2 md:gap-2.5", className)}>
        <img
          src="/brand/aakalan-icon.png"
          alt="Aakalan360"
          className={cn(
            "h-[30px] w-[30px] md:h-[38px] md:w-[38px] shrink-0 object-contain drop-shadow-xs select-none",
            iconClassName
          )}
          loading="eager"
        />
        <span
          className={cn(
            "font-extrabold tracking-tight leading-none select-none text-[17px] md:text-[22px]",
            theme === "dark" ? "text-white" : "text-navy",
            textClassName
          )}
        >
          Aakalan<span className={theme === "dark" ? "text-[#E0A745]" : "text-[#D49838]"}>360</span>
        </span>
        {badge && (
          <span
            className={cn(
              "text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ml-1",
              theme === "dark" ? "bg-white/10 text-white/70" : "bg-navy/10 text-navy/70"
            )}
          >
            {badge}
          </span>
        )}
      </div>
    );
  }

  // Mark only (collapsed sidebar, compact avatar)
  if (isMarkOnly) {
    return (
      <div className={cn("inline-flex items-center justify-center", className)}>
        <img
          src="/brand/aakalan-icon.png"
          alt="Aakalan360"
          className={cn(
            "shrink-0 object-contain drop-shadow-xs select-none",
            collapsed ? "h-8 w-8" : iconSizeClass,
            iconClassName
          )}
          loading="eager"
        />
      </div>
    );
  }

  // Standard full brand header (Desktop Sidebar, Dashboards, Landing, Auth)
  return (
    <div className={cn("inline-flex items-center", gapClass, className)}>
      <img
        src="/brand/aakalan-icon.png"
        alt="Aakalan360"
        className={cn(
          "shrink-0 object-contain drop-shadow-xs select-none",
          iconSizeClass,
          iconClassName
        )}
        loading="eager"
      />
      <span
        className={cn(
          "font-extrabold tracking-tight leading-none select-none",
          textSizeClass,
          theme === "dark" ? "text-white" : "text-navy",
          textClassName
        )}
      >
        Aakalan<span className={theme === "dark" ? "text-[#E0A745]" : "text-[#D49838]"}>360</span>
      </span>
      {badge && (
        <span
          className={cn(
            "text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ml-1",
            theme === "dark" ? "bg-white/10 text-white/70" : "bg-navy/10 text-navy/70"
          )}
        >
          {badge}
        </span>
      )}
    </div>
  );
}

// BrandLogo export for backwards compatibility
export const BrandLogo = AakalanBrand;
export default AakalanBrand;

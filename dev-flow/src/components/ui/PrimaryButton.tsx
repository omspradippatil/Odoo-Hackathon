import React from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  variant?: "primary" | "secondary" | "outline";
  showArrow?: boolean;
}

export function PrimaryButton({
  children,
  className,
  href,
  variant = "primary",
  showArrow = false,
  ...props
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ease-out hover:scale-[1.02] active:scale-95";
  
  const variants = {
    primary: "bg-navy text-white hover:bg-navy/90 hover:shadow-lg shadow-navy/20",
    secondary: "bg-coral text-white hover:bg-coral/90 hover:shadow-lg shadow-coral/20",
    outline: "border border-navy/20 text-navy hover:bg-navy/5"
  };

  const content = (
    <>
      {children}
      {showArrow && <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={cn(baseStyles, variants[variant], "group", className)}>
        {content}
      </Link>
    );
  }

  return (
    <button className={cn(baseStyles, variants[variant], "group", className)} {...props}>
      {content}
    </button>
  );
}

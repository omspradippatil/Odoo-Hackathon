import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-xl border bg-white px-4 py-2 text-sm text-navy transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-navy/30 focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50",
          error ? "border-coral focus-visible:ring-coral/20" : "border-navy/10 hover:border-navy/20 focus-visible:border-cobalt focus-visible:ring-cobalt/20",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({ currentPage, totalPages, onPageChange, className }: PaginationProps) {
  // A simple implementation of DEV FLOW server-side pagination UX
  // Demonstrating the pattern requested in the prompt
  
  const renderPages = () => {
    const pages = [];
    const maxVisible = 5;
    
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    if (start > 1) {
      pages.push(<button key="1" onClick={() => onPageChange(1)} className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-navy/60 hover:bg-navy/5 hover:text-navy transition-colors">1</button>);
      if (start > 2) pages.push(<span key="dots1" className="w-8 h-8 flex items-center justify-center text-navy/40">...</span>);
    }

    for (let i = start; i <= end; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all",
            currentPage === i ? "bg-navy text-white shadow-md" : "text-navy/60 hover:bg-navy/5 hover:text-navy"
          )}
        >
          {i}
        </button>
      );
    }

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push(<span key="dots2" className="w-8 h-8 flex items-center justify-center text-navy/40">...</span>);
      pages.push(<button key={totalPages} onClick={() => onPageChange(totalPages)} className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-navy/60 hover:bg-navy/5 hover:text-navy transition-colors">{totalPages}</button>);
    }

    return pages;
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <button 
        onClick={() => onPageChange(currentPage - 1)} 
        disabled={currentPage === 1}
        className="h-8 px-3 rounded-lg flex items-center gap-1 text-xs font-bold text-navy/60 hover:bg-navy/5 hover:text-navy disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
      >
        <ChevronLeft className="w-3 h-3" /> <span className="hidden sm:inline">Previous</span>
      </button>
      
      <div className="flex items-center gap-1">
        {renderPages()}
      </div>

      <button 
        onClick={() => onPageChange(currentPage + 1)} 
        disabled={currentPage === totalPages}
        className="h-8 px-3 rounded-lg flex items-center gap-1 text-xs font-bold text-navy/60 hover:bg-navy/5 hover:text-navy disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
      >
        <span className="hidden sm:inline">Next</span> <ChevronRight className="w-3 h-3" />
      </button>
    </div>
  );
}

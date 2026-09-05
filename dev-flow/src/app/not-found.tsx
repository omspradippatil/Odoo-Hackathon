import React from 'react';
import Link from 'next/link';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { FlowPathBackground } from '@/components/ui/dashboard/FlowPathBackground';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-warm flex flex-col items-center justify-center p-4 relative overflow-hidden text-navy">
      <FlowPathBackground />
      
      <div className="relative z-10 max-w-md w-full text-center">
        <div className="w-20 h-20 rounded-3xl bg-navy flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-navy/20">
          <AlertTriangle className="w-10 h-10 text-coral" />
        </div>
        
        <h1 className="text-4xl font-bold mb-4 tracking-tight">Route Not Found</h1>
        <p className="text-navy/60 font-medium mb-12 text-lg">
          The requested page could not be found or you do not have permission to view it.
        </p>
        
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 bg-navy text-white px-8 py-4 rounded-xl font-bold hover:bg-navy/90 transition-all shadow-lg shadow-navy/20"
        >
          <ArrowLeft className="w-5 h-5" /> Return to DEV FLOW
        </Link>
      </div>
    </div>
  );
}

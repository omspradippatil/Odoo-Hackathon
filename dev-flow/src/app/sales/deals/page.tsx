"use client";
import React from "react";
import { WorkspaceLayout } from "@/components/layout/WorkspaceLayout";
import { UserRole } from "@/types/auth";
import { Construction } from "lucide-react";

export default function PlaceholderPage() {
  return (
    <WorkspaceLayout role={UserRole.SALES_REP}>
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <div className="w-16 h-16 rounded-full bg-navy/5 flex items-center justify-center mb-6">
          <Construction className="w-8 h-8 text-navy/40" />
        </div>
        <h1 className="text-2xl font-bold text-navy mb-2">Deals</h1>
        <p className="text-navy/60 font-medium max-w-md">This view is currently connected to backend integration. Please navigate via the main dashboard or use the Demo Shortcut.</p>
      </div>
    </WorkspaceLayout>
  );
}

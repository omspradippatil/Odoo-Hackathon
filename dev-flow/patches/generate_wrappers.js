const fs = require('fs');
const path = require('path');

const generate = (filePath, role, title) => {
  const content = `"use client";
import React from "react";
import { WorkspaceLayout } from "@/components/layout/WorkspaceLayout";
import { UserRole } from "@/types/auth";
import { Construction } from "lucide-react";

export default function PlaceholderPage() {
  return (
    <WorkspaceLayout role={UserRole.${role}}>
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <div className="w-16 h-16 rounded-full bg-navy/5 flex items-center justify-center mb-6">
          <Construction className="w-8 h-8 text-navy/40" />
        </div>
        <h1 className="text-2xl font-bold text-navy mb-2">${title}</h1>
        <p className="text-navy/60 font-medium max-w-md">This view is currently connected to backend integration. Please navigate via the main dashboard or use the Demo Shortcut.</p>
      </div>
    </WorkspaceLayout>
  );
}
`;
  fs.writeFileSync(filePath, content);
};

generate('src/app/buyer/deals/page.tsx', 'BUYER', 'My Deals');
generate('src/app/buyer/local/page.tsx', 'BUYER', 'Local Sellers');
generate('src/app/buyer/profile/page.tsx', 'BUYER', 'User Profile');

generate('src/app/seller/opportunities/page.tsx', 'SELLER', 'Opportunities');
generate('src/app/seller/quotes/page.tsx', 'SELLER', 'Quotes');
generate('src/app/seller/profile/page.tsx', 'SELLER', 'Seller Profile');

generate('src/app/sales/deals/page.tsx', 'SALES_REP', 'Deals');
generate('src/app/sales/customers/page.tsx', 'SALES_REP', 'Customers');
generate('src/app/sales/activity/page.tsx', 'SALES_REP', 'Activity');
generate('src/app/sales/quotations/new/page.tsx', 'SALES_REP', 'Create Quotation');

generate('src/app/approvals/pending/page.tsx', 'SALES_MANAGER', 'Pending Approvals');
generate('src/app/approvals/team/page.tsx', 'SALES_MANAGER', 'Team');
generate('src/app/approvals/profile/page.tsx', 'SALES_MANAGER', 'Manager Profile');

generate('src/app/operations/payments/page.tsx', 'FINANCE_OPERATIONS', 'Payments List');
generate('src/app/operations/billing/page.tsx', 'FINANCE_OPERATIONS', 'Billing List');
generate('src/app/operations/fulfilment/page.tsx', 'FINANCE_OPERATIONS', 'Fulfilment List');
generate('src/app/operations/profile/page.tsx', 'FINANCE_OPERATIONS', 'Operations Profile');

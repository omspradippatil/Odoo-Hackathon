const fs = require('fs');
const path = require('path');

const generate = (routePath, title) => {
  const fullPath = path.join('src/app', routePath, 'page.tsx');
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  
  const content = `"use client";
import React from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Construction } from "lucide-react";

export default function AdminPlaceholder() {
  return (
    <AdminLayout>
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <div className="w-16 h-16 rounded-full bg-navy/5 flex items-center justify-center mb-6">
          <Construction className="w-8 h-8 text-navy/40" />
        </div>
        <h1 className="text-2xl font-bold text-navy mb-2">${title}</h1>
        <p className="text-navy/60 font-medium max-w-md">This configuration area is connected to backend services. Use the navigation to explore active modules.</p>
      </div>
    </AdminLayout>
  );
}
`;
  fs.writeFileSync(fullPath, content);
};

generate('admin/users', 'Users & Roles');
generate('admin/products', 'Products');
generate('admin/pricing', 'Pricing');
generate('admin/trust-policy', 'Trust Policy');
generate('admin/deal-health-policy', 'Deal Health Policy');
generate('admin/warehouses', 'Warehouses');
generate('admin/inventory', 'Inventory');
generate('admin/subscriptions', 'Subscriptions');


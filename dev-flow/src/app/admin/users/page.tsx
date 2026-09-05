"use client";

import React, { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { 
  Users, Plus, Search, Filter, ShieldCheck, Mail, Building2, 
  MoreVertical, CheckCircle2, XCircle, UserCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  organization: string;
  status: "ACTIVE" | "SUSPENDED";
  lastLogin: string;
}

const SAMPLE_USERS: AdminUser[] = [
  { id: "u-1", name: "Kadambari Mehta", email: "k.mehta@novaretail.com", role: "BUYER", organization: "Nova Retail Innovations", status: "ACTIVE", lastLogin: "10 mins ago" },
  { id: "u-2", name: "Vikram Singhania", email: "v.singhania@apexindustrial.in", role: "SELLER", organization: "Apex Industrial Supplies", status: "ACTIVE", lastLogin: "25 mins ago" },
  { id: "u-3", name: "Rahul Verma", email: "rahul.verma@devflow.sales", role: "SALES_REP", organization: "DEV FLOW Commercial", status: "ACTIVE", lastLogin: "Just now" },
  { id: "u-4", name: "Vikram Malhotra", email: "v.malhotra@devflow.sales", role: "SALES_MANAGER", organization: "DEV FLOW Commercial", status: "ACTIVE", lastLogin: "1 hour ago" },
  { id: "u-5", name: "Anita Roy", email: "anita.roy@devflow.ops", role: "FINANCE_OPERATIONS", organization: "DEV FLOW Settlement Ops", status: "ACTIVE", lastLogin: "5 mins ago" },
  { id: "u-6", name: "Om Shinde", email: "admin@devflow.internal", role: "ADMIN", organization: "Platform Administration", status: "ACTIVE", lastLogin: "Active now" }
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState(SAMPLE_USERS);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState("BUYER");
  const [newOrg, setNewOrg] = useState("");

  const filtered = users.filter(u => {
    const match = u.name.toLowerCase().includes(search.toLowerCase()) ||
                  u.email.toLowerCase().includes(search.toLowerCase()) ||
                  u.organization.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "ALL" || u.role === roleFilter;
    return match && matchRole;
  });

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail) return;
    const created: AdminUser = {
      id: "u-" + (users.length + 1),
      name: newName,
      email: newEmail,
      role: newRole,
      organization: newOrg || "Standard Enterprise",
      status: "ACTIVE",
      lastLogin: "Never"
    };
    setUsers([...users, created]);
    setShowAddModal(false);
    setNewName("");
    setNewEmail("");
    setNewOrg("");
  };

  return (
    <AdminLayout>
      <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto pb-20">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-navy tracking-tight uppercase">Users & Access Control</h1>
            <p className="text-sm font-medium text-navy/60">Configure role-based access, corporate identities, and security permissions.</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2.5 rounded-xl font-bold text-white bg-navy shadow-lg shadow-navy/20 hover:bg-navy/90 transition-colors text-sm flex items-center gap-2 self-start md:self-auto"
          >
            <Plus className="w-4 h-4" /> Add User
          </button>
        </div>

        {/* METRICS */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-navy/5 shadow-sm">
            <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest">TOTAL ACCOUNTS</div>
            <div className="text-2xl font-bold text-navy mt-1">{users.length} Users</div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-navy/5 shadow-sm">
            <div className="text-[10px] font-bold text-lime-700 uppercase tracking-widest">ACTIVE SESSIONS</div>
            <div className="text-2xl font-bold text-lime-700 mt-1">6 Online</div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-navy/5 shadow-sm">
            <div className="text-[10px] font-bold text-cobalt uppercase tracking-widest">BUYER & SELLER ORGS</div>
            <div className="text-2xl font-bold text-cobalt mt-1">4 Enrolled</div>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-navy/5 shadow-sm">
            <div className="text-[10px] font-bold text-navy/40 uppercase tracking-widest">INTERNAL ROLES</div>
            <div className="text-2xl font-bold text-navy mt-1">3 Operators</div>
          </div>
        </div>

        {/* FILTER BAR */}
        <div className="bg-white rounded-2xl p-4 border border-navy/5 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-navy/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search by name, email, or organization..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-navy/5 rounded-xl text-sm font-medium text-navy placeholder:text-navy/40 focus:outline-none"
            />
          </div>

          <div className="flex bg-navy/5 p-1 rounded-xl text-xs font-bold overflow-x-auto w-full md:w-auto">
            {["ALL", "BUYER", "SELLER", "SALES_REP", "SALES_MANAGER", "FINANCE_OPERATIONS", "ADMIN"].map(r => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={cn(
                  "px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors",
                  roleFilter === r ? "bg-white text-navy shadow-xs" : "text-navy/60 hover:text-navy"
                )}
              >
                {r.replace(/_/g, " ")}
              </button>
            ))}
          </div>
        </div>

        {/* USERS TABLE */}
        <div className="bg-white rounded-3xl border border-navy/5 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-navy/5 bg-navy/[0.02] text-[10px] font-bold uppercase tracking-wider text-navy/50">
                  <th className="py-4 px-6">User Name</th>
                  <th className="py-4 px-6">Corporate Email</th>
                  <th className="py-4 px-6">RBAC Role</th>
                  <th className="py-4 px-6">Organization</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Last Active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy/5 text-sm">
                {filtered.map(user => (
                  <tr key={user.id} className="hover:bg-navy/[0.015] transition-colors">
                    <td className="py-4 px-6 font-bold text-navy flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-navy/10 text-navy font-bold flex items-center justify-center text-xs">
                        {user.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      {user.name}
                    </td>
                    <td className="py-4 px-6 font-medium text-navy/70">
                      {user.email}
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-[10px] font-bold uppercase tracking-widest bg-navy/5 text-navy px-2.5 py-1 rounded-md">
                        {user.role.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-medium text-navy">
                      {user.organization}
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-lime/20 text-lime-900 flex items-center gap-1 w-fit">
                        <CheckCircle2 className="w-3 h-3 text-lime-700" /> Active
                      </span>
                    </td>
                    <td className="py-4 px-6 text-xs text-navy/50 font-medium">
                      {user.lastLogin}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ADD USER MODAL */}
        {showAddModal && (
          <div className="fixed inset-0 bg-navy/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-navy/10 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-navy">Add Platform User</h3>
                <button onClick={() => setShowAddModal(false)} className="text-navy/40 hover:text-navy font-bold text-lg">×</button>
              </div>
              <form onSubmit={handleAddUser} className="space-y-3">
                <input 
                  placeholder="Full Name" 
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-navy/5 rounded-xl text-sm font-medium" 
                />
                <input 
                  placeholder="Email Address" 
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-navy/5 rounded-xl text-sm font-medium" 
                />
                <input 
                  placeholder="Organization / Company" 
                  value={newOrg}
                  onChange={(e) => setNewOrg(e.target.value)}
                  className="w-full px-4 py-2.5 bg-navy/5 rounded-xl text-sm font-medium" 
                />
                <select 
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full px-4 py-2.5 bg-navy/5 rounded-xl text-sm font-medium"
                >
                  <option value="BUYER">BUYER</option>
                  <option value="SELLER">SELLER</option>
                  <option value="SALES_REP">SALES_REP</option>
                  <option value="SALES_MANAGER">SALES_MANAGER</option>
                  <option value="FINANCE_OPERATIONS">FINANCE_OPERATIONS</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
                <div className="flex gap-2 pt-3">
                  <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-2.5 bg-navy/5 font-bold rounded-xl text-sm text-navy">Cancel</button>
                  <button type="submit" className="flex-1 py-2.5 bg-navy font-bold rounded-xl text-sm text-white shadow-xs">Create Account</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
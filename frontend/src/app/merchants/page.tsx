"use client";

import { useState } from "react";
import { Search, Filter, ShieldCheck, Key, ShieldAlert, BadgeCheck, CheckCircle2, TrendingUp, AlertTriangle } from "lucide-react";

interface Merchant {
  id: number;
  businessName: string;
  owner: string;
  email: string;
  avatar: string;
  integrationMode: "API" | "Dashboard";
  apiKeyStatus: "Active" | "Inactive" | "None";
  activeOrders: number;
  monthlyRevenue: number;
  status: "Approved" | "Pending Verification" | "Suspended";
  joinedDate: string;
}

const initialMerchants: Merchant[] = [
  { id: 1, businessName: "ElectroMaroc S.A.R.L", owner: "Kamal Naciri", email: "contact@electromaroc.ma", avatar: "EM", integrationMode: "API", apiKeyStatus: "Active", activeOrders: 142, monthlyRevenue: 184500, status: "Approved", joinedDate: "Dec 12, 2024" },
  { id: 2, businessName: "Marrakech Craft Boutique", owner: "Fatima Zahra", email: "info@marrakechcrafts.com", avatar: "MC", integrationMode: "Dashboard", apiKeyStatus: "None", activeOrders: 28, monthlyRevenue: 34200, status: "Approved", joinedDate: "Jan 28, 2025" },
  { id: 3, businessName: "Jumia Morocco Partner", owner: "Jumia Hub Team", email: "partners-support@jumia.ma", avatar: "JM", integrationMode: "API", apiKeyStatus: "Active", activeOrders: 984, monthlyRevenue: 789200, status: "Approved", joinedDate: "Oct 15, 2024" },
  { id: 4, businessName: "Fashion Hub Casablanca", owner: "Anas Bennani", email: "sales@fashionhub.ma", avatar: "FH", integrationMode: "Dashboard", apiKeyStatus: "Inactive", activeOrders: 0, monthlyRevenue: 0, status: "Pending Verification", joinedDate: "May 18, 2026" },
  { id: 5, businessName: "BioMorocco Organics", owner: "Salma Guessous", email: "wholesale@biomorocco.co", avatar: "BM", integrationMode: "API", apiKeyStatus: "Active", activeOrders: 54, monthlyRevenue: 62100, status: "Suspended", joinedDate: "Feb 10, 2025" },
  { id: 6, businessName: "Atlas Spices Export", owner: "Rachid Idrissi", email: "export@atlasspices.com", avatar: "AS", integrationMode: "Dashboard", apiKeyStatus: "None", activeOrders: 12, monthlyRevenue: 18900, status: "Approved", joinedDate: "Mar 04, 2025" },
];

export default function Merchants() {
  const [merchants, setMerchants] = useState<Merchant[]>(initialMerchants);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const handleApprove = (id: number) => {
    setMerchants(merchants.map(m => m.id === id ? { ...m, status: "Approved", apiKeyStatus: m.integrationMode === "API" ? "Active" : "None" } : m));
  };

  const handleToggleSuspend = (id: number) => {
    setMerchants(merchants.map(m => {
      if (m.id === id) {
        return { ...m, status: m.status === "Suspended" ? "Approved" : "Suspended" };
      }
      return m;
    }));
  };

  const filteredMerchants = merchants.filter(m => {
    const matchesSearch = m.businessName.toLowerCase().includes(search.toLowerCase()) || m.owner.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Merchant Management</h2>
        <p className="text-gray-500 text-sm font-medium mt-1">
          Verify merchant accounts, audit API credentials, and review shipment volumes.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Partners</span>
            <h3 className="text-2xl font-black text-gray-900 mt-1">{merchants.length}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
            <BadgeCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">API Integrations</span>
            <h3 className="text-2xl font-black text-gray-900 mt-1">
              {merchants.filter(m => m.integrationMode === "API").length}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Key className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Monthly Vol. (MAD)</span>
            <h3 className="text-2xl font-black text-emerald-600 mt-1">
              {merchants.reduce((acc, curr) => acc + curr.monthlyRevenue, 0).toLocaleString()} DH
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Requires Verification</span>
            <h3 className="text-2xl font-black text-brand-500 mt-1">
              {merchants.filter(m => m.status === "Pending Verification").length}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-pink-50 text-brand-500 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Section */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        
        {/* Filters */}
        <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search business, owner name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
            />
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            {["All", "Approved", "Pending Verification", "Suspended"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                  statusFilter === status
                    ? "bg-brand-500 border-brand-500 text-white shadow-sm"
                    : "bg-white border-gray-100 text-gray-500 hover:bg-gray-50"
                }`}
              >
                {status === "Pending Verification" ? "Pending" : status}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50/50">
                <th className="py-4 px-6">Merchant Business</th>
                <th className="py-4 px-6">Integration</th>
                <th className="py-4 px-6">API Key Status</th>
                <th className="py-4 px-6">Live Shipments</th>
                <th className="py-4 px-6">Monthly Revenue</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs font-semibold text-gray-800">
              {filteredMerchants.map((merchant) => (
                <tr key={merchant.id} className="hover:bg-gray-50/30 transition-colors">
                  
                  {/* Business Name and Owner */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-pink-50 text-brand-500 font-black flex items-center justify-center text-sm border border-pink-100">
                        {merchant.avatar}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{merchant.businessName}</p>
                        <span className="text-[10px] text-gray-400 font-bold block">{merchant.owner} • {merchant.email}</span>
                      </div>
                    </div>
                  </td>

                  {/* Integration Mode */}
                  <td className="py-4 px-6">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      merchant.integrationMode === "API" 
                        ? "bg-indigo-50 text-indigo-700 border border-indigo-100" 
                        : "bg-gray-100 text-gray-600"
                    }`}>
                      {merchant.integrationMode}
                    </span>
                  </td>

                  {/* API Key Status */}
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1.5 font-bold ${
                      merchant.apiKeyStatus === "Active" ? "text-emerald-600" :
                      merchant.apiKeyStatus === "Inactive" ? "text-amber-500" :
                      "text-gray-400 font-medium"
                    }`}>
                      {merchant.apiKeyStatus}
                    </span>
                  </td>

                  {/* Live Shipments */}
                  <td className="py-4 px-6 text-gray-700">
                    {merchant.activeOrders} active
                  </td>

                  {/* Monthly revenue */}
                  <td className="py-4 px-6 font-bold text-gray-900">
                    {merchant.monthlyRevenue.toLocaleString()} MAD
                  </td>

                  {/* Status */}
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                      merchant.status === "Approved" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                      merchant.status === "Pending Verification" ? "bg-amber-50 text-amber-700 border-amber-100 animate-pulse" :
                      "bg-red-50 text-red-700 border-red-100"
                    }`}>
                      {merchant.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {merchant.status === "Pending Verification" ? (
                        <button 
                          onClick={() => handleApprove(merchant.id)}
                          className="flex items-center gap-1 bg-zinc-950 hover:bg-zinc-800 text-white px-3 py-1.5 rounded-xl text-[10px] font-bold shadow-sm transition-all"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          Verify
                        </button>
                      ) : (
                        <>
                          <button 
                            onClick={() => handleToggleSuspend(merchant.id)}
                            className={`p-2 rounded-xl border transition-colors ${
                              merchant.status === "Suspended" 
                                ? "bg-emerald-50 border-emerald-100 text-emerald-600 hover:bg-emerald-100" 
                                : "bg-red-50 border-red-100 text-red-600 hover:bg-red-100"
                            }`}
                            title={merchant.status === "Suspended" ? "Approve" : "Suspend"}
                          >
                            {merchant.status === "Suspended" ? <ShieldCheck className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
                          </button>
                          <button className="px-3 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-100 text-gray-600 rounded-xl font-bold text-[10px] transition-colors">
                            API Configuration
                          </button>
                        </>
                      )}
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}

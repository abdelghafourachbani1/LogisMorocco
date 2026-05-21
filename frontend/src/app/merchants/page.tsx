"use client";

import { useState, useEffect } from "react";
import { Search, Filter, ShieldCheck, Key, ShieldAlert, BadgeCheck, CheckCircle2, TrendingUp, AlertTriangle } from "lucide-react";

interface Merchant {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  email_verified_at: string | null;
  region: string;
  created_at: string;
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(";").shift();
    return cookieValue ? decodeURIComponent(cookieValue) : null;
  }
  return null;
}

function getApiUrl(path: string): string {
  const host = typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:8000"
    : "http://127.0.0.1:8000";
  return `${host}${path}`;
}

export default function Merchants() {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  const fetchMerchants = async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      queryParams.append("role", "merchant");
      if (search) {
        queryParams.append("search", search);
      }
      if (statusFilter === "Approved") {
        queryParams.append("status", "active");
      } else if (statusFilter === "Pending Verification") {
        queryParams.append("status", "pending");
      }

      const res = await fetch(getApiUrl(`/api/admin/users?${queryParams.toString()}`), {
        headers: { "Accept": "application/json" },
        credentials: "include"
      });

      if (res.ok) {
        const data = await res.json();
        setMerchants(data.users || []);
      }
    } catch (err) {
      console.error("Failed to load merchants:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMerchants();
  }, [search, statusFilter]);

  const handleApprove = async (id: number) => {
    try {
      const xsrfToken = getCookie("XSRF-TOKEN");
      const res = await fetch(getApiUrl(`/api/admin/users/${id}/approve`), {
        method: "POST",
        headers: {
          "Accept": "application/json",
          ...(xsrfToken ? { "X-XSRF-TOKEN": xsrfToken } : {}),
        },
        credentials: "include",
      });
      if (res.ok) {
        fetchMerchants();
      }
    } catch (err) {
      console.error("Approve failed:", err);
    }
  };

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
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Merchants</span>
            <h3 className="text-2xl font-black text-gray-900 mt-1">{merchants.length}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
            <BadgeCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">eCom Integrations</span>
            <h3 className="text-2xl font-black text-gray-900 mt-1">
              {merchants.length}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Key className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Verified Accounts</span>
            <h3 className="text-2xl font-black text-emerald-600 mt-1">
              {merchants.filter(m => m.email_verified_at !== null).length}
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
              {merchants.filter(m => m.email_verified_at === null).length}
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
              placeholder="Search merchant name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
            />
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            {["All", "Approved", "Pending Verification"].map((status) => (
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
          {isLoading ? (
            <div className="py-20 text-center text-sm font-bold text-gray-400">
              Loading merchant partners...
            </div>
          ) : merchants.length === 0 ? (
            <div className="py-20 text-center text-sm font-bold text-gray-400">
              No merchant partners found.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50/50">
                  <th className="py-4 px-6">Merchant Business</th>
                  <th className="py-4 px-6">Location</th>
                  <th className="py-4 px-6">Joined Date</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs font-semibold text-gray-800">
                {merchants.map((merchant) => {
                  const isVerified = merchant.email_verified_at !== null;
                  const joinedDate = new Date(merchant.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric"
                  });

                  return (
                    <tr key={merchant.id} className="hover:bg-gray-50/30 transition-colors">
                      
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-pink-50 text-brand-500 font-black flex items-center justify-center text-sm border border-pink-100">
                            {merchant.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 text-sm">{merchant.name}</p>
                            <span className="text-[10px] text-gray-400 font-bold block">{merchant.email} {merchant.phone ? `| ${merchant.phone}` : ""}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-gray-500 font-medium">
                        {merchant.region}, MA
                      </td>

                      <td className="py-4 px-6 text-gray-400 font-bold">
                        {joinedDate}
                      </td>

                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                          isVerified ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-amber-50 text-amber-700 border-amber-100 animate-pulse"
                        }`}>
                          {isVerified ? "Approved" : "Pending Verification"}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {!isVerified ? (
                            <button 
                              onClick={() => handleApprove(merchant.id)}
                              className="flex items-center gap-1 bg-zinc-950 hover:bg-zinc-800 text-white px-3 py-1.5 rounded-xl text-[10px] font-bold shadow-sm transition-all"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              Verify
                            </button>
                          ) : (
                            <span className="text-[10px] font-bold text-gray-400">Verified Partner</span>
                          )}
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

      </div>

    </div>
  );
}

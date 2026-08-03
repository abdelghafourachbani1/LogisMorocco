"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  Filter, 
  ShieldCheck, 
  Key, 
  ShieldAlert, 
  BadgeCheck, 
  CheckCircle2, 
  TrendingUp, 
  AlertTriangle,
  X,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  ShoppingBag,
  Trash2,
  Lock,
  Unlock
} from "lucide-react";

interface Merchant {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  email_verified_at: string | null;
  region: string;
  created_at: string;
  status?: string;
  verified?: boolean;
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
  if (process.env.NEXT_PUBLIC_API_URL) {
    return `${process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")}${path}`;
  }
  const host = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
    ? "http://localhost:8000"
    : "";
  return `${host}${path}`;
}

export default function Merchants() {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  // Detail Modal States
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);
  const [merchantStats, setMerchantStats] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(false);

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
      } else if (statusFilter === "Suspended") {
        queryParams.append("status", "suspended");
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

  const fetchStats = async (id: number) => {
    setLoadingStats(true);
    try {
      const res = await fetch(getApiUrl(`/api/admin/users/${id}/stats`), {
        headers: { "Accept": "application/json" },
        credentials: "include"
      });
      if (res.ok) {
        const data = await res.json();
        setMerchantStats(data.stats);
      }
    } catch (err) {
      console.error("Failed to load merchant stats:", err);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchMerchants();
  }, [search, statusFilter]);

  useEffect(() => {
    if (selectedMerchant) {
      fetchStats(selectedMerchant.id);
    } else {
      setMerchantStats(null);
    }
  }, [selectedMerchant]);

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
        setSelectedMerchant(null);
      }
    } catch (err) {
      console.error("Approve failed:", err);
    }
  };

  const handleSuspend = async (id: number) => {
    try {
      const xsrfToken = getCookie("XSRF-TOKEN");
      const res = await fetch(getApiUrl(`/api/admin/users/${id}/suspend`), {
        method: "POST",
        headers: {
          "Accept": "application/json",
          ...(xsrfToken ? { "X-XSRF-TOKEN": xsrfToken } : {}),
        },
        credentials: "include",
      });
      if (res.ok) {
        fetchMerchants();
        setSelectedMerchant(null);
      }
    } catch (err) {
      console.error("Suspend failed:", err);
    }
  };

  const handleActivate = async (id: number) => {
    try {
      const xsrfToken = getCookie("XSRF-TOKEN");
      const res = await fetch(getApiUrl(`/api/admin/users/${id}/activate`), {
        method: "POST",
        headers: {
          "Accept": "application/json",
          ...(xsrfToken ? { "X-XSRF-TOKEN": xsrfToken } : {}),
        },
        credentials: "include",
      });
      if (res.ok) {
        fetchMerchants();
        setSelectedMerchant(null);
      }
    } catch (err) {
      console.error("Activate failed:", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to permanently delete this merchant account? This will clean up all associated data.")) return;
    try {
      const xsrfToken = getCookie("XSRF-TOKEN");
      const res = await fetch(getApiUrl(`/api/admin/users/${id}`), {
        method: "DELETE",
        headers: {
          "Accept": "application/json",
          ...(xsrfToken ? { "X-XSRF-TOKEN": xsrfToken } : {}),
        },
        credentials: "include",
      });
      if (res.ok) {
        fetchMerchants();
        setSelectedMerchant(null);
      }
    } catch (err) {
      console.error("Delete failed:", err);
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
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Accounts</span>
            <h3 className="text-2xl font-black text-emerald-600 mt-1">
              {merchants.filter(m => m.status === "Active").length}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pending Verification</span>
            <h3 className="text-2xl font-black text-amber-500 mt-1">
              {merchants.filter(m => m.status === "Verification Pending").length}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Suspended Accounts</span>
            <h3 className="text-2xl font-black text-red-500 mt-1">
              {merchants.filter(m => m.status === "Suspended").length}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
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
                  const isVerified = merchant.verified;
                  const joinedDate = merchant.created_at;

                  return (
                    <tr 
                      key={merchant.id} 
                      onClick={() => setSelectedMerchant(merchant)}
                      className="hover:bg-gray-50/50 cursor-pointer transition-colors"
                    >
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
                        {merchant.region}
                      </td>

                      <td className="py-4 px-6 text-gray-400 font-bold">
                        {merchant.created_at}
                      </td>

                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                          merchant.status === "Active" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                          merchant.status === "Suspended" ? "bg-red-50 text-red-700 border-red-100" :
                          "bg-amber-50 text-amber-700 border-amber-100 animate-pulse"
                        }`}>
                          {merchant.status}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          {merchant.status === "Verification Pending" && (
                            <button 
                              onClick={() => handleApprove(merchant.id)}
                              className="flex items-center gap-1 bg-zinc-950 hover:bg-zinc-800 text-white px-3 py-1.5 rounded-xl text-[10px] font-bold shadow-sm transition-all"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              Verify
                            </button>
                          )}
                          {merchant.status === "Active" && (
                            <button 
                              onClick={() => handleSuspend(merchant.id)}
                              className="flex items-center gap-1 bg-amber-50 hover:bg-amber-100 text-amber-700 px-3 py-1.5 rounded-xl text-[10px] font-bold border border-amber-100 transition-all"
                            >
                              <Lock className="w-3 h-3" />
                              Suspend
                            </button>
                          )}
                          {merchant.status === "Suspended" && (
                            <button 
                              onClick={() => handleActivate(merchant.id)}
                              className="flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-xl text-[10px] font-bold border border-emerald-100 transition-all"
                            >
                              <Unlock className="w-3 h-3" />
                              Activate
                            </button>
                          )}
                          <button 
                            onClick={() => handleDelete(merchant.id)}
                            className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-all border border-red-100/50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
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

      {/* Details Modal */}
      {selectedMerchant && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-[28px] border border-gray-100 shadow-2xl p-8 max-w-md w-full relative space-y-6 animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setSelectedMerchant(null)}
              className="absolute right-6 top-6 text-gray-400 hover:text-gray-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-pink-50 text-brand-500 font-black flex items-center justify-center text-sm border border-pink-100">
                  {selectedMerchant.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900 tracking-tight">{selectedMerchant.name}</h3>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 mt-1 rounded-full text-[9px] font-bold border ${
                    selectedMerchant.status === "Active" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                    selectedMerchant.status === "Suspended" ? "bg-red-50 text-red-700 border-red-100" :
                    "bg-amber-50 text-amber-700 border-amber-100"
                  }`}>
                    {selectedMerchant.status}
                  </span>
                </div>
              </div>

              {/* Statistics grid */}
              <div className="grid grid-cols-2 gap-4 bg-gray-50/50 p-4 rounded-2xl border border-gray-100/50">
                {loadingStats ? (
                  <div className="col-span-2 py-4 text-center text-xs text-gray-400 font-bold">
                    Fetching latest statistics...
                  </div>
                ) : merchantStats ? (
                  <>
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Total Orders</span>
                      <span className="text-xl font-black text-gray-900 mt-1 block">{merchantStats.total_orders}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Completed Sales</span>
                      <span className="text-xl font-black text-emerald-600 mt-1 block">{merchantStats.total_sales.toLocaleString()} MAD</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Pending / Transit</span>
                      <span className="text-xs font-bold text-gray-600 mt-1 block">
                        {merchantStats.pending_orders} / {merchantStats.in_transit_orders}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Wallet Balance</span>
                      <span className="text-sm font-black text-brand-500 mt-1 block">
                        {merchantStats.wallet_balance.toLocaleString()} MAD
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="col-span-2 py-4 text-center text-xs text-red-500 font-bold">
                    Failed to fetch statistics.
                  </div>
                )}
              </div>

              {/* Store & Contact info */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Business & Contact Info</h4>
                <div className="space-y-2 text-xs font-semibold text-gray-700">
                  <div className="flex items-center gap-2 border-b border-gray-50 pb-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <div>
                      <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wider">Email Address</span>
                      <span className="text-gray-900 font-bold">{selectedMerchant.email}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 border-b border-gray-50 pb-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <div>
                      <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wider">Phone Number</span>
                      <span className="text-gray-900 font-bold">{selectedMerchant.phone || "Not Configured"}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 border-b border-gray-50 pb-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <div>
                      <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wider">Registration Region</span>
                      <span className="text-gray-900 font-bold">{selectedMerchant.region}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <div>
                      <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wider">Registered Since</span>
                      <span className="text-gray-900 font-bold">{selectedMerchant.created_at}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Administrative Actions */}
              <div className="pt-4 border-t border-gray-100 flex gap-2">
                {selectedMerchant.status === "Verification Pending" && (
                  <button 
                    onClick={() => handleApprove(selectedMerchant.id)}
                    className="flex-1 bg-zinc-950 hover:bg-zinc-900 text-white rounded-xl py-3 text-xs font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Approve Merchant
                  </button>
                )}
                {selectedMerchant.status === "Active" && (
                  <button 
                    onClick={() => handleSuspend(selectedMerchant.id)}
                    className="flex-1 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-100 rounded-xl py-3 text-xs font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    Suspend Account
                  </button>
                )}
                {selectedMerchant.status === "Suspended" && (
                  <button 
                    onClick={() => handleActivate(selectedMerchant.id)}
                    className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-100 rounded-xl py-3 text-xs font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <Unlock className="w-4 h-4" />
                    Activate Account
                  </button>
                )}
                <button 
                  onClick={() => handleDelete(selectedMerchant.id)}
                  className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 rounded-xl p-3 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

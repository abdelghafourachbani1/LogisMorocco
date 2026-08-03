"use client";

import { useState, useEffect } from "react";
import { 
  CreditCard, 
  Search, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Clock, 
  User, 
  ArrowUpRight, 
  Banknote,
  Building,
  Check,
  X
} from "lucide-react";

interface Withdrawal {
  id: number;
  user_id: number;
  user_name: string;
  user_email: string;
  user_role: string;
  amount: number;
  status: string; // pending, completed, rejected
  bank_details: {
    bank_name: string;
    bank_rib: string;
    holder_name: string;
  };
  description: string;
  date: string;
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

export default function WithdrawalRequests() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const fetchWithdrawals = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(getApiUrl("/api/admin/withdrawals"), {
        headers: { "Accept": "application/json" },
        credentials: "include"
      });
      if (res.ok) {
        const data = await res.json();
        setWithdrawals(data.withdrawals || []);
      }
    } catch (err) {
      console.error("Failed to load withdrawal requests:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const handleApprove = async (id: number) => {
    setProcessingId(id);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const xsrfToken = getCookie("XSRF-TOKEN");
      const res = await fetch(getApiUrl(`/api/admin/withdrawals/${id}/approve`), {
        method: "POST",
        headers: {
          "Accept": "application/json",
          ...(xsrfToken ? { "X-XSRF-TOKEN": xsrfToken } : {})
        },
        credentials: "include"
      });

      const data = await res.json();

      if (res.ok) {
        setSuccessMessage("Withdrawal approved successfully!");
        fetchWithdrawals();
      } else {
        setErrorMessage(data.error || "Failed to approve withdrawal.");
      }
    } catch (err) {
      setErrorMessage("Network error occurred.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: number) => {
    setProcessingId(id);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const xsrfToken = getCookie("XSRF-TOKEN");
      const res = await fetch(getApiUrl(`/api/admin/withdrawals/${id}/reject`), {
        method: "POST",
        headers: {
          "Accept": "application/json",
          ...(xsrfToken ? { "X-XSRF-TOKEN": xsrfToken } : {})
        },
        credentials: "include"
      });

      const data = await res.json();

      if (res.ok) {
        setSuccessMessage("Withdrawal rejected successfully.");
        fetchWithdrawals();
      } else {
        setErrorMessage(data.error || "Failed to reject withdrawal.");
      }
    } catch (err) {
      setErrorMessage("Network error occurred.");
    } finally {
      setProcessingId(null);
    }
  };

  const filteredWithdrawals = withdrawals.filter(w => {
    const matchesSearch = w.user_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          w.user_email.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          w.bank_details.bank_name.toLowerCase().includes(searchQuery.toLowerCase());
    if (statusFilter === "All") return matchesSearch;
    return matchesSearch && w.status === statusFilter.toLowerCase();
  });

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <span className="bg-pink-50 text-brand-500 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full">
          Finance Management
        </span>
        <h2 className="text-2xl font-black text-gray-900 tracking-tight mt-1">Withdrawal Settlements</h2>
        <p className="text-xs font-semibold text-gray-500">Review, approve, and reject withdrawal requests from merchants and driver partners.</p>
      </div>

      {/* Alert states */}
      {errorMessage && (
        <div className="bg-red-50 text-red-600 text-xs font-bold px-4 py-3 rounded-2xl border border-red-100 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="bg-emerald-50 text-emerald-600 text-xs font-bold px-4 py-3 rounded-2xl border border-emerald-100 flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Main List */}
      <div className="bg-white rounded-[28px] border border-gray-100 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-50">
          <div>
            <h4 className="text-base font-black text-gray-900 tracking-tight">Withdrawal Requests Queue</h4>
            <p className="text-xs text-gray-400 font-semibold">Verify banking coordinates and process pending withdrawals.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search requests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#F3F4F6]/50 pl-9 pr-4 py-2 rounded-xl text-xs border-none focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-800 font-medium placeholder-gray-400 w-48"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#F3F4F6]/50 px-3 py-2 rounded-xl text-xs font-bold text-gray-800 border-none focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Requests Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <th className="pb-3 font-black">User Details</th>
                <th className="pb-3 font-black">Bank Coordinates</th>
                <th className="pb-3 font-black">Requested Payout</th>
                <th className="pb-3 font-black">Status</th>
                <th className="pb-3 font-black">Request Date</th>
                <th className="pb-3 font-black text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs font-semibold text-gray-700">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400 font-bold">
                    Fetching withdrawal registry...
                  </td>
                </tr>
              ) : filteredWithdrawals.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400 font-bold">
                    No withdrawal requests found.
                  </td>
                </tr>
              ) : (
                filteredWithdrawals.map((w) => (
                  <tr key={w.id} className="hover:bg-gray-50/40 transition-all">
                    <td className="py-4">
                      <p className="text-gray-900 font-extrabold">{w.user_name}</p>
                      <p className="text-[10px] text-gray-400 font-semibold">{w.user_email}</p>
                      <span className="text-[9px] font-black uppercase tracking-wider bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md mt-0.5 inline-block">
                        {w.user_role}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <div>
                          <p className="text-gray-900 font-bold">{w.bank_details.bank_name}</p>
                          <p className="text-[10px] text-gray-400 font-semibold">{w.bank_details.bank_rib}</p>
                          <p className="text-[9px] text-zinc-500 font-medium">Holder: {w.bank_details.holder_name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="text-brand-500 font-black">{w.amount.toLocaleString()} MAD</span>
                    </td>
                    <td className="py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider ${
                        w.status === "completed" 
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
                          : w.status === "rejected"
                          ? "bg-red-50 text-red-600 border border-red-100"
                          : "bg-amber-50 text-amber-600 border border-amber-100"
                      }`}>
                        {w.status === "completed" && <Check className="w-3 h-3" />}
                        {w.status === "rejected" && <X className="w-3 h-3" />}
                        {w.status === "pending" && <Clock className="w-3 h-3" />}
                        {w.status}
                      </span>
                    </td>
                    <td className="py-4 text-gray-400 text-[10px] font-bold">
                      {w.date}
                    </td>
                    <td className="py-4 text-right">
                      {w.status === "pending" ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            disabled={processingId !== null}
                            onClick={() => handleApprove(w.id)}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl px-3 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all disabled:opacity-50"
                          >
                            Approve
                          </button>
                          <button
                            disabled={processingId !== null}
                            onClick={() => handleReject(w.id)}
                            className="bg-red-500 hover:bg-red-600 text-white rounded-xl px-3 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all disabled:opacity-50"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Settled</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

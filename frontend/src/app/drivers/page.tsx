"use client";

import { useState, useEffect } from "react";
import { UserCheck, Star, Shield, Search, Filter, AlertCircle, CheckCircle, MapPin, Truck } from "lucide-react";

interface Driver {
  id: number;
  name: string;
  phone: string | null;
  email: string;
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

export default function Drivers() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  const fetchDrivers = async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      queryParams.append("role", "livreur");
      if (search) {
        queryParams.append("search", search);
      }
      if (statusFilter === "Approved") {
        queryParams.append("status", "active");
      } else if (statusFilter === "Pending") {
        queryParams.append("status", "pending");
      }

      const res = await fetch(getApiUrl(`/api/admin/users?${queryParams.toString()}`), {
        headers: { "Accept": "application/json" },
        credentials: "include"
      });

      if (res.ok) {
        const data = await res.json();
        setDrivers(data.users || []);
      }
    } catch (err) {
      console.error("Failed to load drivers:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
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
        fetchDrivers();
      }
    } catch (err) {
      console.error("Approve failed:", err);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Driver Management</h2>
          <p className="text-gray-500 text-sm font-medium mt-1">
            Monitor courier status, verifications, cash collections, and performance ratings.
          </p>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Drivers</span>
            <h3 className="text-2xl font-black text-gray-900 mt-1">{drivers.length}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
            <Truck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Approved & Active</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <h3 className="text-2xl font-black text-gray-900">{drivers.filter(d => d.email_verified_at !== null).length}</h3>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pending Verification</span>
            <h3 className="text-2xl font-black text-gray-900 mt-1">{drivers.filter(d => d.email_verified_at === null).length}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filters and List */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        
        {/* Filter Bar */}
        <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search driver by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
            />
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            {["All", "Approved", "Pending"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                  statusFilter === status
                    ? "bg-brand-500 border-brand-500 text-white shadow-sm"
                    : "bg-white border-gray-100 text-gray-500 hover:bg-gray-50"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Driver List Table */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="py-20 text-center text-sm font-bold text-gray-400">
              Loading driver partners...
            </div>
          ) : drivers.length === 0 ? (
            <div className="py-20 text-center text-sm font-bold text-gray-400">
              No driver partners found.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50/50">
                  <th className="py-4 px-6">Driver Info</th>
                  <th className="py-4 px-6">Region</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Joined Date</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs font-semibold text-gray-800">
                {drivers.map((driver) => {
                  const isVerified = driver.email_verified_at !== null;
                  const joinedDate = new Date(driver.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric"
                  });

                  return (
                    <tr key={driver.id} className="hover:bg-gray-50/30 transition-colors">
                      
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-pink-50 text-brand-500 font-black flex items-center justify-center text-sm border border-pink-100">
                            {driver.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 text-sm">{driver.name}</p>
                            <span className="text-[10px] text-gray-400 font-bold block">{driver.email} {driver.phone ? `| ${driver.phone}` : ""}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1.5 text-gray-700">
                          <MapPin className="w-3.5 h-3.5 text-gray-400" />
                          <span>{driver.region}, MA</span>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                          isVerified ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-amber-50 text-amber-700 border-amber-100 animate-pulse"
                        }`}>
                          {isVerified ? "Approved" : "Pending Verification"}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-gray-400 font-bold">
                        {joinedDate}
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {!isVerified ? (
                            <button 
                              onClick={() => handleApprove(driver.id)}
                              className="flex items-center gap-1 bg-zinc-950 hover:bg-zinc-800 text-white px-3 py-1.5 rounded-xl text-[10px] font-bold shadow-sm transition-all"
                            >
                              <CheckCircle className="w-3 h-3" />
                              Approve
                            </button>
                          ) : (
                            <span className="text-[10px] font-bold text-gray-400">Verified Driver</span>
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

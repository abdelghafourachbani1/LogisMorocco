"use client";

import { useState, useEffect } from "react";
import { 
  Users, 
  CheckCircle, 
  Clock, 
  Ban, 
  Search, 
  ChevronDown, 
  Download, 
  ShieldCheck, 
  MoreVertical, 
  UserPlus, 
  FileCheck, 
  ChevronLeft, 
  ChevronRight,
  Store,
  Truck
} from "lucide-react";

interface UserItem {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  email_verified_at: string | null;
  created_at: string;
  region: string;
}

interface DashboardStats {
  total_partners: number;
  active_partners: number;
  pending_partners: number;
  suspended_partners: number;
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

export default function UserManagement() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    total_partners: 0,
    active_partners: 0,
    pending_partners: 0,
    suspended_partners: 0,
  });

  const [activeTab, setActiveTab] = useState<"All" | "Merchant" | "Driver">("All");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [regionFilter, setRegionFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch KPI Stats
  const fetchDashboardStats = async () => {
    try {
      const res = await fetch(getApiUrl("/api/dashboard"), {
        headers: { "Accept": "application/json" },
        credentials: "include"
      });
      if (res.ok) {
        const data = await res.json();
        if (data.stats) {
          setStats({
            total_partners: data.stats.total_partners || 0,
            active_partners: data.stats.active_partners || 0,
            pending_partners: data.stats.pending_partners || 0,
            suspended_partners: data.stats.suspended_partners || 0,
          });
        }
      }
    } catch (err) {
      console.error("Failed to load dashboard stats:", err);
    }
  };

  // Fetch Partner List
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      queryParams.append("page", currentPage.toString());

      if (activeTab === "Merchant") queryParams.append("role", "merchant");
      if (activeTab === "Driver") queryParams.append("role", "livreur");

      if (search) queryParams.append("search", search);
      
      if (statusFilter === "Active") queryParams.append("status", "active");
      if (statusFilter === "Verification Pending") queryParams.append("status", "pending");

      if (regionFilter !== "All") queryParams.append("region", regionFilter);

      const res = await fetch(getApiUrl(`/api/admin/users?${queryParams.toString()}`), {
        headers: { "Accept": "application/json" },
        credentials: "include"
      });

      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
        if (data.meta) {
          setCurrentPage(data.meta.current_page);
          setLastPage(data.meta.last_page);
          setTotalEntries(data.meta.total);
        }
      }
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [activeTab, search, statusFilter, regionFilter, currentPage]);

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
        fetchUsers();
        fetchDashboardStats();
      }
    } catch (err) {
      console.error("Approve failed:", err);
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Top Title and Tab Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-[28px] font-black text-gray-900 tracking-tight">User Management</h2>
          <p className="text-gray-500 text-sm font-semibold mt-0.5">
            Review and manage platform partners across Morocco.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="bg-white border border-gray-100 p-1 rounded-2xl flex gap-1 shadow-sm w-fit self-start md:self-auto">
          <button
            onClick={() => { setActiveTab("All"); setCurrentPage(1); }}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "All" 
                ? "bg-brand-500 text-white shadow-md shadow-brand-500/10" 
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            All Users
          </button>
          <button
            onClick={() => { setActiveTab("Merchant"); setCurrentPage(1); }}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "Merchant" 
                ? "bg-brand-500 text-white shadow-md shadow-brand-500/10" 
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Merchants
          </button>
          <button
            onClick={() => { setActiveTab("Driver"); setCurrentPage(1); }}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "Driver" 
                ? "bg-brand-500 text-white shadow-md shadow-brand-500/10" 
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Drivers
          </button>
        </div>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Partners */}
        <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-pink-50 flex items-center justify-center text-brand-500">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Total Partners</span>
            <h3 className="text-2xl font-black text-gray-900 leading-none mt-1">{stats.total_partners}</h3>
          </div>
        </div>

        {/* Active */}
        <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Active</span>
            <h3 className="text-2xl font-black text-gray-900 leading-none mt-1">{stats.active_partners}</h3>
          </div>
        </div>

        {/* Pending */}
        <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
            <Clock className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Pending</span>
            <h3 className="text-2xl font-black text-gray-900 leading-none mt-1">{stats.pending_partners}</h3>
          </div>
        </div>

        {/* Suspended */}
        <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
            <Ban className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Suspended</span>
            <h3 className="text-2xl font-black text-gray-900 leading-none mt-1">{stats.suspended_partners}</h3>
          </div>
        </div>
      </div>

      {/* Main Filter & Table Area */}
      <div className="bg-white rounded-[28px] border border-gray-100 shadow-sm overflow-hidden">
        
        {/* Table Filters */}
        <div className="p-6 border-b border-gray-50 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <span className="text-xs font-bold text-gray-500">Search:</span>
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                placeholder="Name, email or phone..."
                className="bg-gray-50 border border-gray-100 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold text-gray-700 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            <span className="text-xs font-bold text-gray-500 ml-2">Filters:</span>
            
            {/* Status Dropdown */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                className="appearance-none bg-gray-50 hover:bg-gray-100/80 border border-gray-100 rounded-xl pl-4 pr-10 py-2 text-xs font-bold text-gray-700 focus:outline-none cursor-pointer"
              >
                <option value="All">Status: All</option>
                <option value="Active">Active</option>
                <option value="Verification Pending">Pending</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Region Dropdown */}
            <div className="relative">
              <select
                value={regionFilter}
                onChange={(e) => { setRegionFilter(e.target.value); setCurrentPage(1); }}
                className="appearance-none bg-gray-50 hover:bg-gray-100/80 border border-gray-100 rounded-xl pl-4 pr-10 py-2 text-xs font-bold text-gray-700 focus:outline-none cursor-pointer"
              >
                <option value="All">Region: All</option>
                <option value="Casablanca">Casablanca</option>
                <option value="Marrakech">Marrakech</option>
                <option value="Agadir">Agadir</option>
                <option value="Tangier">Tangier</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Export Action */}
          <button className="flex items-center gap-2 hover:bg-gray-50 px-4 py-2 rounded-xl text-xs font-bold text-gray-600 border border-gray-100 self-end sm:self-auto transition-colors">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        {/* User Table */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="py-20 text-center font-bold text-gray-400 text-sm">
              Loading partners...
            </div>
          ) : users.length === 0 ? (
            <div className="py-20 text-center font-bold text-gray-400 text-sm">
              No partners found.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50/40">
                  <th className="py-4 px-6">User / Organization</th>
                  <th className="py-4 px-6">Role</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">Region</th>
                  <th className="py-4 px-6">Joined</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs font-bold text-gray-700">
                {users.map((user) => {
                  const isVerified = user.email_verified_at !== null;
                  const joinedDate = new Date(user.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric"
                  });

                  // Generate standard initials representation for avatar
                  const initials = user.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();

                  return (
                    <tr key={user.id} className="hover:bg-gray-50/30 transition-colors">
                      
                      {/* User Details */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm border border-purple-100/50 bg-purple-50 text-purple-600`}>
                            {initials}
                          </div>
                          <div>
                            <p className="font-extrabold text-gray-900 text-sm">{user.name}</p>
                            <span className="text-[10px] text-gray-400 font-bold block mt-0.5">
                              {user.email} {user.phone ? `| ${user.phone}` : ""}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1.5 text-gray-500 font-semibold">
                          {user.role === "merchant" ? (
                            <Store className="w-4 h-4 text-gray-400" />
                          ) : (
                            <Truck className="w-4 h-4 text-gray-400" />
                          )}
                          <span className="capitalize">{user.role === 'livreur' ? 'driver' : user.role}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        {!isVerified ? (
                          <div className="inline-flex flex-col">
                            <span className="bg-pink-50 text-brand-500 px-2 py-0.5 rounded text-[9px] font-extrabold uppercase text-center leading-tight">
                              Verification
                            </span>
                            <span className="bg-pink-50 text-brand-500 px-2 py-0.5 rounded text-[9px] font-extrabold uppercase text-center leading-tight mt-0.5">
                              Pending
                            </span>
                          </div>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-extrabold border bg-emerald-50 text-emerald-700 border-emerald-100">
                            Active
                          </span>
                        )}
                      </td>

                      {/* Region */}
                      <td className="py-4 px-6 text-gray-500 font-medium">
                        {user.region}, MA
                      </td>

                      {/* Joined Date */}
                      <td className="py-4 px-6 text-gray-400 font-bold">
                        {joinedDate}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-3.5">
                          {!isVerified ? (
                            <button 
                              onClick={() => handleApprove(user.id)}
                              className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-1.5 rounded-xl text-[10px] font-bold shadow-sm transition-all"
                            >
                              Approve
                            </button>
                          ) : (
                            <ShieldCheck className="w-5 h-5 text-brand-500" />
                          )}
                          <button className="p-1 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-gray-900 transition-colors">
                            <MoreVertical className="w-4 h-4" />
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

        {/* Pagination footer */}
        <div className="p-6 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs font-semibold text-gray-400">
            Showing {(currentPage - 1) * 10 + 1} to {Math.min(currentPage * 10, totalEntries)} of {totalEntries} entries
          </span>
          
          <div className="flex items-center gap-1.5">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 border border-gray-100 rounded-xl hover:bg-gray-50 text-gray-400 hover:text-gray-900 transition-colors disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            {Array.from({ length: lastPage }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`w-8 h-8 rounded-xl font-extrabold text-xs flex items-center justify-center transition-all ${
                  p === currentPage 
                    ? "bg-brand-500 text-white shadow-sm" 
                    : "hover:bg-gray-50 text-gray-500"
                }`}
              >
                {p}
              </button>
            ))}

            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, lastPage))}
              disabled={currentPage === lastPage}
              className="p-2 border border-gray-100 rounded-xl hover:bg-gray-50 text-gray-400 hover:text-gray-900 transition-colors disabled:opacity-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Footer Dual Cards Block */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Left block - Partner Onboarding */}
        <div className="lg:col-span-3 bg-pink-50/30 border border-dashed border-pink-200 rounded-[28px] p-6 flex flex-col justify-between min-h-[180px] relative overflow-hidden">
          <div className="space-y-2 max-w-[70%]">
            <h4 className="text-[18px] font-black text-brand-500">New Partner Onboarding</h4>
            <p className="text-gray-500 text-xs font-semibold leading-relaxed">
              Generate a unique registration link for high-volume corporate merchants or fleet owners.
            </p>
          </div>
          <button className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-5 py-3 rounded-xl text-xs font-bold shadow-md shadow-brand-500/10 w-fit transition-all hover:-translate-y-0.5 mt-4">
            <UserPlus className="w-4 h-4" />
            Generate Secure Link
          </button>
          <div className="absolute right-6 bottom-4 text-brand-500/10 pointer-events-none">
            <UserPlus className="w-24 h-24 stroke-[1]" />
          </div>
        </div>

        {/* Right block - Verification Queue */}
        <div className="lg:col-span-2 bg-[#1A1D20] rounded-[28px] p-6 flex flex-col justify-between min-h-[180px] text-white relative overflow-hidden">
          <div className="space-y-2 max-w-[80%]">
            <h4 className="text-[18px] font-black">Verification Queue</h4>
            <p className="text-zinc-400 text-xs font-semibold leading-relaxed">
              There are currently {stats.pending_partners} partners awaiting manual review from the operations team.
            </p>
          </div>
          <button className="flex items-center gap-2 bg-white hover:bg-zinc-100 text-zinc-900 px-5 py-3 rounded-xl text-xs font-bold shadow-md w-fit transition-all hover:-translate-y-0.5 mt-4">
            <FileCheck className="w-4 h-4" />
            Review Documents
          </button>
          <div className="absolute right-6 bottom-4 text-zinc-800 pointer-events-none">
            <FileCheck className="w-24 h-24 stroke-[1]" />
          </div>
        </div>

      </div>

    </div>
  );
}

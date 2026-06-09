"use client";

import { useState, useEffect } from "react";
import { 
  UserCheck, 
  Star, 
  Shield, 
  Search, 
  Filter, 
  AlertCircle, 
  CheckCircle, 
  CheckCircle2,
  MapPin, 
  Truck, 
  Phone, 
  Award, 
  X,
  Navigation,
  Mail,
  Calendar,
  DollarSign,
  Trash2,
  Lock,
  Unlock,
  CreditCard
} from "lucide-react";

interface Driver {
  id: number;
  name: string;
  phone: string | null;
  email: string;
  email_verified_at: string | null;
  region: string;
  created_at: string;
  status?: string;
  verified?: boolean; // mapped field
  cin?: string;
  vehicle_type?: string;
  vehicle_plate?: string;
  balance?: number;
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
  const [userRole, setUserRole] = useState<string>("admin");
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

  // Stats for Selected Driver (Admin perspective)
  const [driverStats, setDriverStats] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  // Fetch User Role
  const fetchUserRole = async () => {
    try {
      const res = await fetch(getApiUrl("/api/user"), {
        headers: { "Accept": "application/json" },
        credentials: "include"
      });
      if (res.ok) {
        const data = await res.json();
        setUserRole(data.role || "admin");
      }
    } catch (err) {
      console.error("Failed to load user role:", err);
    }
  };

  const fetchDrivers = async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      queryParams.append("role", "livreur");
      if (search) {
        queryParams.append("search", search);
      }
      if (statusFilter === "Approved") {
        queryParams.append("status", "Active");
      } else if (statusFilter === "Pending") {
        queryParams.append("status", "Verification Pending");
      } else if (statusFilter === "Suspended") {
        queryParams.append("status", "Suspended");
      }

      const res = await fetch(getApiUrl(`/api/admin/users?${queryParams.toString()}`), {
        headers: { "Accept": "application/json" },
        credentials: "include"
      });

      if (res.ok) {
        const data = await res.json();
        const rawUsers = data.users || [];
        setDrivers(rawUsers);
      }
    } catch (err) {
      console.error("Failed to load drivers:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserRole().then(() => {
      fetchDrivers();
    });
  }, [search, statusFilter]);

  // Fetch Stats when a driver is selected by Admin
  useEffect(() => {
    if (selectedDriver && userRole === "admin") {
      setLoadingStats(true);
      fetch(getApiUrl(`/api/admin/users/${selectedDriver.id}/stats`), {
        headers: { "Accept": "application/json" },
        credentials: "include"
      })
        .then(res => res.json())
        .then(data => {
          setDriverStats(data.stats);
        })
        .catch(err => {
          console.error("Failed to load driver stats:", err);
        })
        .finally(() => {
          setLoadingStats(false);
        });
    } else {
      setDriverStats(null);
    }
  }, [selectedDriver, userRole]);

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
        setSelectedDriver(null);
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
        fetchDrivers();
        setSelectedDriver(null);
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
        fetchDrivers();
        setSelectedDriver(null);
      }
    } catch (err) {
      console.error("Activate failed:", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to permanently delete this driver account? This will clean up all associated data.")) return;
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
        fetchDrivers();
        setSelectedDriver(null);
      }
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  // Mocked performance indexes for Merchant perspective
  const getDriverRating = (id: number) => {
    const ratings = [4.9, 4.8, 4.7, 4.9, 4.6];
    return ratings[id % ratings.length];
  };

  const getDriverSuccessRate = (id: number) => {
    const rates = [98.2, 95.4, 94.0, 97.6, 92.1];
    return rates[id % rates.length];
  };

  const getDriverShipmentsCount = (id: number) => {
    const counts = [142, 85, 110, 204, 60];
    return counts[id % counts.length];
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            {userRole === "merchant" ? "Logistics Courier Partners" : "Driver Management"}
          </h2>
          <p className="text-gray-500 text-sm font-medium mt-1">
            {userRole === "merchant" 
              ? "Monitor regional fleet performance, average courier success ratings, and contact profiles."
              : "Monitor courier status, verifications, cash collections, and performance ratings."}
          </p>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Fleet size</span>
            <h3 className="text-2xl font-black text-gray-900 mt-1">{drivers.length} Couriers</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-pink-50 text-brand-500 flex items-center justify-center border border-pink-100">
            <Truck className="w-5 h-5" />
          </div>
        </div>

        {userRole === "merchant" ? (
          <>
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Avg Delivery Success</span>
                <h3 className="text-2xl font-black text-gray-900 mt-1">96.8% Ratio</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center border border-emerald-100">
                <Award className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Fleet Rating Average</span>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-5 h-5 fill-amber-400 stroke-amber-400" />
                  <h3 className="text-2xl font-black text-gray-900">4.8</h3>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center border border-amber-100">
                <Star className="w-5 h-5" />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Approved & Active</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <h3 className="text-2xl font-black text-gray-900">{drivers.filter(d => d.status === "Active").length}</h3>
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
                <UserCheck className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pending Verification</span>
                <h3 className="text-2xl font-black text-gray-900 mt-1">{drivers.filter(d => d.status === "Verification Pending").length}</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
                <AlertCircle className="w-5 h-5" />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Filters and List */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        
        {/* Filter Bar */}
        <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search driver by name or city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
            />
          </div>

          {userRole === "admin" && (
            <div className="flex gap-2 w-full md:w-auto">
              {["All", "Approved", "Pending", "Suspended"].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                    statusFilter === status
                      ? "bg-brand-500 border-brand-500 text-white shadow-sm"
                      : "bg-white border-gray-100 text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {status === "Pending" ? "Pending Verification" : status}
                </button>
              ))}
            </div>
          )}
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
                  <th className="py-4 px-6">Dispatch City</th>
                  {userRole === "merchant" ? (
                    <>
                      <th className="py-4 px-6">Fleet Rating</th>
                      <th className="py-4 px-6">Success Ratio</th>
                      <th className="py-4 px-6">Deliveries Completed</th>
                    </>
                  ) : (
                    <>
                      <th className="py-4 px-6">Verification</th>
                      <th className="py-4 px-6">Joined Date</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs font-semibold text-gray-800">
                {drivers.map((driver) => {
                  const rating = getDriverRating(driver.id);
                  const successRate = getDriverSuccessRate(driver.id);
                  const shipmentCount = getDriverShipmentsCount(driver.id);

                  return (
                    <tr 
                      key={driver.id} 
                      onClick={() => setSelectedDriver(driver)}
                      className="transition-colors hover:bg-gray-50/40 cursor-pointer"
                    >
                      
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-pink-50 text-brand-500 font-black flex items-center justify-center text-sm border border-pink-100 shrink-0">
                            {driver.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 text-sm">{driver.name}</p>
                            <span className="text-[10px] text-gray-400 font-bold block">{driver.email}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1.5 text-gray-700">
                          <MapPin className="w-3.5 h-3.5 text-gray-400" />
                          <span>{driver.region || "Casablanca"}</span>
                        </div>
                      </td>

                      {userRole === "merchant" ? (
                        <>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-1 text-gray-900 font-black">
                              <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                              <span>{rating}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                              successRate >= 95 ? "bg-green-50 text-green-700 border border-green-100" : "bg-amber-50 text-amber-700 border-amber-100"
                            }`}>
                              {successRate}%
                            </span>
                          </td>
                          <td className="py-4 px-6 text-gray-900 font-black">
                            {shipmentCount} Packages
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="py-4 px-6">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                              driver.status === "Active" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                              driver.status === "Suspended" ? "bg-red-50 text-red-700 border-red-100" :
                              "bg-amber-50 text-amber-700 border-amber-100"
                            }`}>
                              {driver.status || (driver.verified ? "Active" : "Verification Pending")}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-gray-400 font-bold">
                            {new Date(driver.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {driver.status === "Verification Pending" || !driver.verified ? (
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleApprove(driver.id);
                                  }}
                                  className="flex items-center gap-1 bg-[#1A1D20] hover:bg-zinc-800 text-white px-3 py-1.5 rounded-xl text-[10px] font-bold shadow-sm transition-all"
                                >
                                  <CheckCircle className="w-3 h-3" />
                                  Approve
                                </button>
                              ) : driver.status === "Suspended" ? (
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleActivate(driver.id);
                                  }}
                                  className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl text-[10px] font-bold shadow-sm transition-all"
                                >
                                  <Unlock className="w-3 h-3" />
                                  Activate
                                </button>
                              ) : (
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSuspend(driver.id);
                                  }}
                                  className="flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded-xl text-[10px] font-bold shadow-sm transition-all"
                                >
                                  <Lock className="w-3 h-3" />
                                  Suspend
                                </button>
                              )}
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(driver.id);
                                }}
                                className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 rounded-xl p-1.5 transition-all"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </>
                      )}

                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

      </div>

      {/* Driver Performance profile drawer for Merchant */}
      {selectedDriver && userRole === "merchant" && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-end z-50 animate-in fade-in duration-200">
          <div className="bg-white h-full w-full max-w-md shadow-2xl p-8 flex flex-col justify-between relative space-y-6 animate-in slide-in-from-right duration-300">
            <button 
              onClick={() => setSelectedDriver(null)}
              className="absolute right-6 top-6 text-gray-400 hover:text-gray-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-6 overflow-y-auto pr-2 flex-1">
              <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
                <div className="w-14 h-14 rounded-2xl bg-pink-50 text-brand-500 font-black flex items-center justify-center text-sm border border-pink-100">
                  {selectedDriver.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900 tracking-tight">{selectedDriver.name}</h3>
                  <span className="text-xs font-bold text-gray-400">Courier Partner</span>
                </div>
              </div>

              {/* Stats Box */}
              <div className="grid grid-cols-2 gap-4 bg-gray-50/50 p-4 rounded-2xl border border-gray-100/50">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Star Rating</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Star className="w-5 h-5 fill-amber-400 stroke-amber-400" />
                    <span className="text-2xl font-black text-gray-900">{getDriverRating(selectedDriver.id)}</span>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Delivery Success</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-black text-brand-500">{getDriverSuccessRate(selectedDriver.id)}%</span>
                  </div>
                </div>
              </div>

              {/* Contact info card details */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Contact & Zone Cover</h4>
                <div className="space-y-3 text-xs font-semibold text-gray-700">
                  <div className="flex gap-2">
                    <Navigation className="w-4 h-4 text-gray-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Dispatch Coverage</span>
                      <p className="text-gray-900 font-bold mt-0.5">{selectedDriver.region || "Casablanca"}, Morocco</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Contact Number</span>
                      <p className="text-gray-900 font-bold mt-0.5">{selectedDriver.phone || "Not Configured"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#0A0D10] text-white p-5 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[9px] text-zinc-400 font-bold block uppercase tracking-wider">Total Shipments Handled</span>
                <h4 className="text-xl font-black mt-1">{getDriverShipmentsCount(selectedDriver.id)} Packages</h4>
              </div>
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
                <Truck className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal for Admin */}
      {selectedDriver && userRole === "admin" && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-[28px] border border-gray-100 shadow-2xl p-8 max-w-md w-full relative space-y-6 animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setSelectedDriver(null)}
              className="absolute right-6 top-6 text-gray-400 hover:text-gray-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-500 font-black flex items-center justify-center text-sm border border-orange-100 shrink-0">
                  {selectedDriver.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900 tracking-tight">{selectedDriver.name}</h3>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 mt-1 rounded-full text-[9px] font-bold border ${
                    selectedDriver.status === "Active" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                    selectedDriver.status === "Suspended" ? "bg-red-50 text-red-700 border-red-100" :
                    "bg-amber-50 text-amber-700 border-amber-100"
                  }`}>
                    {selectedDriver.status || (selectedDriver.verified ? "Active" : "Verification Pending")}
                  </span>
                </div>
              </div>

              {/* Statistics grid */}
              <div className="grid grid-cols-2 gap-4 bg-gray-50/50 p-4 rounded-2xl border border-gray-100/50">
                {loadingStats ? (
                  <div className="col-span-2 py-4 text-center text-xs text-gray-400 font-bold">
                    Fetching latest statistics...
                  </div>
                ) : driverStats ? (
                  <>
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Total Shipments</span>
                      <span className="text-xl font-black text-gray-900 mt-1 block">{driverStats.total_orders}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Wallet Balance</span>
                      <span className="text-xl font-black text-brand-500 mt-1 block">{driverStats.wallet_balance.toLocaleString()} MAD</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">COD Delivered</span>
                      <span className="text-sm font-black text-emerald-600 mt-1 block">
                        {driverStats.total_sales.toLocaleString()} MAD
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Transit / Cancelled</span>
                      <span className="text-xs font-bold text-gray-600 mt-1 block">
                        {driverStats.in_transit_orders} / {driverStats.cancelled_orders}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="col-span-2 py-4 text-center text-xs text-red-500 font-bold">
                    Failed to fetch statistics.
                  </div>
                )}
              </div>

              {/* Courier Documents & Vehicles Info */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Vehicle & Credentials</h4>
                <div className="space-y-2 text-xs font-semibold text-gray-700">
                  <div className="flex items-center gap-2 border-b border-gray-50 pb-2">
                    <Shield className="w-4 h-4 text-gray-400" />
                    <div>
                      <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wider">National ID (CIN)</span>
                      <span className="text-gray-900 font-bold">{selectedDriver.cin || "Not Uploaded"}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 border-b border-gray-50 pb-2">
                    <Truck className="w-4 h-4 text-gray-400" />
                    <div>
                      <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wider">Vehicle Details</span>
                      <span className="text-gray-900 font-bold">
                        {selectedDriver.vehicle_type || "None"} {selectedDriver.vehicle_plate ? `(${selectedDriver.vehicle_plate})` : ""}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 border-b border-gray-50 pb-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <div>
                      <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wider">Email Address</span>
                      <span className="text-gray-900 font-bold">{selectedDriver.email}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 border-b border-gray-50 pb-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <div>
                      <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wider">Phone Number</span>
                      <span className="text-gray-900 font-bold">{selectedDriver.phone || "Not Configured"}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 border-b border-gray-50 pb-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <div>
                      <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wider">Dispatch Coverage</span>
                      <span className="text-gray-900 font-bold">{selectedDriver.region || "Casablanca"}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <div>
                      <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wider">Joined Date</span>
                      <span className="text-gray-900 font-bold">
                        {new Date(selectedDriver.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Administrative Actions */}
              <div className="pt-4 border-t border-gray-100 flex gap-2">
                {(selectedDriver.status === "Verification Pending" || !selectedDriver.verified) && (
                  <button 
                    onClick={() => handleApprove(selectedDriver.id)}
                    className="flex-1 bg-zinc-950 hover:bg-zinc-900 text-white rounded-xl py-3 text-xs font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Approve Driver
                  </button>
                )}
                {selectedDriver.status === "Active" && (
                  <button 
                    onClick={() => handleSuspend(selectedDriver.id)}
                    className="flex-1 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-100 rounded-xl py-3 text-xs font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    Suspend
                  </button>
                )}
                {selectedDriver.status === "Suspended" && (
                  <button 
                    onClick={() => handleActivate(selectedDriver.id)}
                    className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-100 rounded-xl py-3 text-xs font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <Unlock className="w-4 h-4" />
                    Activate
                  </button>
                )}
                <button 
                  onClick={() => handleDelete(selectedDriver.id)}
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

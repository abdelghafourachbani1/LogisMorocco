"use client";

import { useState, useEffect } from "react";
import { 
  Download, 
  Sliders, 
  Calendar, 
  Truck, 
  AlertCircle, 
  RotateCw, 
  Search, 
  ChevronDown, 
  MoreVertical, 
  ChevronLeft, 
  ChevronRight,
  Plus,
  CheckCircle2,
  AlertTriangle,
  CloudLightning,
  X
} from "lucide-react";

interface OrderRow {
  id: number;
  tracking_number: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  amount_cod: number;
  status: string;
  created_at: string;
  merchant?: { name: string } | null;
  livreur?: { name: string } | null;
}

interface DashboardStats {
  total_orders?: number;
  total_cod?: number;
  delivered_count?: number;
  in_transit_count?: number;
  pending_count?: number;
  balance?: number;
  active_deliveries?: number;
  available_orders?: number;
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

export default function Orders() {
  const [userRole, setUserRole] = useState<string>("admin");
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [stats, setStats] = useState<DashboardStats>({});
  
  // Filters
  const [activeTab, setActiveTab] = useState<string>("All"); // Livreur: "available", "active"
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Create Order Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [amountCod, setAmountCod] = useState("");
  const [modalError, setModalError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch user role
  const fetchUserRole = async () => {
    try {
      const res = await fetch(getApiUrl("/api/user"), {
        headers: { "Accept": "application/json" },
        credentials: "include"
      });
      if (res.ok) {
        const data = await res.json();
        setUserRole(data.role || "admin");
        if (data.role === "livreur") {
          setActiveTab("available");
        }
      }
    } catch (err) {
      console.error("Failed to load user role:", err);
    }
  };

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
          setStats(data.stats);
        }
      }
    } catch (err) {
      console.error("Failed to load dashboard stats:", err);
    }
  };

  // Fetch Orders
  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const queryParams = new URLSearchParams();
      queryParams.append("page", currentPage.toString());
      
      if (search) {
        queryParams.append("search", search);
      }

      if (userRole === "livreur") {
        queryParams.append("tab", activeTab === "active" ? "active" : "available");
      } else {
        if (statusFilter !== "All") {
          queryParams.append("status", statusFilter);
        }
      }

      const res = await fetch(getApiUrl(`/api/orders?${queryParams.toString()}`), {
        headers: { "Accept": "application/json" },
        credentials: "include"
      });

      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
        if (data.meta) {
          setCurrentPage(data.meta.current_page);
          setLastPage(data.meta.last_page);
          setTotalEntries(data.meta.total);
        }
      }
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserRole();
    fetchDashboardStats();
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [userRole, activeTab, search, statusFilter, currentPage]);

  // Create Order Handler
  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError("");
    setIsSubmitting(true);

    try {
      const xsrfToken = getCookie("XSRF-TOKEN");
      const res = await fetch(getApiUrl("/api/orders"), {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          ...(xsrfToken ? { "X-XSRF-TOKEN": xsrfToken } : {})
        },
        body: JSON.stringify({
          customer_name: customerName,
          customer_phone: customerPhone,
          customer_address: customerAddress,
          amount_cod: parseFloat(amountCod)
        }),
        credentials: "include"
      });

      if (res.ok) {
        setIsModalOpen(false);
        setCustomerName("");
        setCustomerPhone("");
        setCustomerAddress("");
        setAmountCod("");
        fetchOrders();
        fetchDashboardStats();
      } else {
        const errData = await res.json();
        setModalError(errData.message || "Failed to create order.");
      }
    } catch (err) {
      console.error("Error creating order:", err);
      setModalError("Unable to connect to the backend.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Claim Order Handler
  const handleClaimOrder = async (id: number) => {
    try {
      const xsrfToken = getCookie("XSRF-TOKEN");
      const res = await fetch(getApiUrl(`/api/orders/${id}/claim`), {
        method: "POST",
        headers: {
          "Accept": "application/json",
          ...(xsrfToken ? { "X-XSRF-TOKEN": xsrfToken } : {})
        },
        credentials: "include"
      });

      if (res.ok) {
        fetchOrders();
        fetchDashboardStats();
      }
    } catch (err) {
      console.error("Error claiming order:", err);
    }
  };

  // Update Status Handler
  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      const xsrfToken = getCookie("XSRF-TOKEN");
      const res = await fetch(getApiUrl(`/api/orders/${id}/status`), {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          ...(xsrfToken ? { "X-XSRF-TOKEN": xsrfToken } : {})
        },
        body: JSON.stringify({ status }),
        credentials: "include"
      });

      if (res.ok) {
        fetchOrders();
        fetchDashboardStats();
      }
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Top Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-[28px] font-black text-gray-900 tracking-tight">Orders Management</h2>
          <p className="text-gray-500 text-sm font-semibold mt-0.5">
            Real-time monitoring of active logistics flows across Morocco.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-[#1A1D20] hover:bg-zinc-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm">
            <Download className="w-4 h-4" />
            Export Data
          </button>
          <button className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm">
            <Sliders className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total/Available Orders */}
        <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-brand-500">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
              {userRole === "livreur" ? "Available Orders" : "Total Orders"}
            </span>
            <h3 className="text-3xl font-black text-gray-900 mt-1">
              {userRole === "livreur" ? (stats.available_orders ?? 0) : (stats.total_orders ?? 0)}
            </h3>
          </div>
        </div>

        {/* Card 2: In Transit */}
        <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500">
              <Truck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
              {userRole === "livreur" ? "Active Deliveries" : "In Transit"}
            </span>
            <h3 className="text-3xl font-black text-gray-900 mt-1">
              {userRole === "livreur" ? (stats.active_deliveries ?? 0) : (stats.in_transit_count ?? 0)}
            </h3>
          </div>
        </div>

        {/* Card 3: Delivered Count */}
        <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-500">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Delivered Orders</span>
            <h3 className="text-3xl font-black text-gray-900 mt-1">
              {stats.delivered_count ?? 0}
            </h3>
          </div>
        </div>

        {/* Card 4: Financial Summary */}
        <div className="bg-[#0A0D10] text-white p-6 rounded-[24px] shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <RotateCw className="w-5 h-5 text-zinc-300" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">
              {userRole === "livreur" ? "COD Held" : "Total COD"}
            </span>
            <h3 className="text-3xl font-black text-white mt-1">
              {userRole === "livreur" ? (stats.balance ?? 0) : (stats.total_cod ?? 0)}{" "}
              <span className="text-sm font-bold text-zinc-400">MAD</span>
            </h3>
          </div>
        </div>
      </div>

      {/* Main Grid View */}
      <div className="bg-white rounded-[28px] border border-gray-100 shadow-sm overflow-hidden relative">
        
        {/* Table Header Filter & Sorting */}
        <div className="p-6 border-b border-gray-50 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex border-b border-gray-100 w-full sm:w-auto">
            {userRole === "livreur" ? (
              <>
                <button
                  onClick={() => { setActiveTab("available"); setCurrentPage(1); }}
                  className={`px-4 py-3 text-xs font-bold transition-all relative border-b-2 -mb-[2px] ${
                    activeTab === "available" ? "border-brand-500 text-brand-500" : "border-transparent text-gray-400 hover:text-gray-900"
                  }`}
                >
                  Available for Claim
                </button>
                <button
                  onClick={() => { setActiveTab("active"); setCurrentPage(1); }}
                  className={`px-4 py-3 text-xs font-bold transition-all relative border-b-2 -mb-[2px] ${
                    activeTab === "active" ? "border-brand-500 text-brand-500" : "border-transparent text-gray-400 hover:text-gray-900"
                  }`}
                >
                  My Active Shipments
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => { setStatusFilter("All"); setCurrentPage(1); }}
                  className={`px-4 py-3 text-xs font-bold transition-all relative border-b-2 -mb-[2px] ${
                    statusFilter === "All" ? "border-brand-500 text-brand-500" : "border-transparent text-gray-400 hover:text-gray-900"
                  }`}
                >
                  All Orders
                </button>
                <button
                  onClick={() => { setStatusFilter("pending"); setCurrentPage(1); }}
                  className={`px-4 py-3 text-xs font-bold transition-all relative border-b-2 -mb-[2px] ${
                    statusFilter === "pending" ? "border-brand-500 text-brand-500" : "border-transparent text-gray-400 hover:text-gray-900"
                  }`}
                >
                  Pending Dispatch
                </button>
                <button
                  onClick={() => { setStatusFilter("in_transit"); setCurrentPage(1); }}
                  className={`px-4 py-3 text-xs font-bold transition-all relative border-b-2 -mb-[2px] ${
                    statusFilter === "in_transit" ? "border-brand-500 text-brand-500" : "border-transparent text-gray-400 hover:text-gray-900"
                  }`}
                >
                  Out for Delivery
                </button>
                <button
                  onClick={() => { setStatusFilter("refused"); setCurrentPage(1); }}
                  className={`px-4 py-3 text-xs font-bold transition-all relative border-b-2 -mb-[2px] ${
                    statusFilter === "refused" ? "border-brand-500 text-brand-500" : "border-transparent text-gray-400 hover:text-gray-900"
                  }`}
                >
                  Returns (RTO)
                </button>
              </>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                placeholder="Search tracking, client..."
                className="bg-gray-50 border border-gray-100 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold text-gray-700 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="py-20 text-center font-bold text-gray-400 text-sm">
              Loading orders...
            </div>
          ) : orders.length === 0 ? (
            <div className="py-20 text-center font-bold text-gray-400 text-sm">
              No orders found.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50/40">
                  <th className="py-4 px-6">Order & Date</th>
                  <th className="py-4 px-6">Customer / Destination</th>
                  <th className="py-4 px-6">Merchant</th>
                  <th className="py-4 px-6">Courier Status</th>
                  <th className="py-4 px-6">Value</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs font-bold text-gray-700">
                {orders.map((order) => {
                  const dateString = new Date(order.created_at).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  });

                  return (
                    <tr key={order.id} className="hover:bg-gray-50/30 transition-colors">
                      
                      {/* Order & Date */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-brand-500 text-sm hover:underline cursor-pointer">
                            {order.tracking_number}
                          </span>
                        </div>
                        <span className="text-[10px] text-gray-400 font-bold block mt-0.5">{dateString}</span>
                      </td>

                      {/* Customer / Destination */}
                      <td className="py-4 px-6">
                        <p className="font-extrabold text-gray-900">{order.customer_name}</p>
                        <span className="text-[10px] text-gray-400 font-bold block mt-0.5">{order.customer_address}</span>
                      </td>

                      {/* Merchant */}
                      <td className="py-4 px-6 text-gray-500 font-semibold">
                        {order.merchant?.name ?? "LogiMerchant"}
                      </td>

                      {/* Courier Status */}
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-extrabold capitalize ${
                          order.status === "delivered" ? "bg-emerald-50 text-emerald-700" :
                          order.status === "in_transit" ? "bg-pink-50 text-brand-500" :
                          order.status === "refused" ? "bg-red-50 text-red-700" :
                          order.status === "canceled" ? "bg-gray-100 text-gray-400" :
                          "bg-blue-50 text-blue-700"
                        }`}>
                          • {order.status === 'livreur' ? 'driver' : order.status}
                        </span>
                      </td>

                      {/* Value */}
                      <td className="py-4 px-6 font-extrabold text-gray-900 text-sm">
                        {order.amount_cod.toLocaleString()} MAD
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {userRole === "livreur" && activeTab === "available" && (
                            <button
                              onClick={() => handleClaimOrder(order.id)}
                              className="bg-brand-500 hover:bg-brand-600 text-white px-3 py-1.5 rounded-xl text-[10px] font-bold shadow-sm transition-all"
                            >
                              Claim Order
                            </button>
                          )}

                          {userRole === "livreur" && activeTab === "active" && (
                            <div className="flex items-center gap-1.5">
                              <select
                                onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                                defaultValue=""
                                className="bg-gray-50 border border-gray-100 rounded-xl px-2 py-1.5 text-[10px] font-bold text-gray-700 focus:outline-none cursor-pointer"
                              >
                                <option value="" disabled>Complete...</option>
                                <option value="delivered">Delivered</option>
                                <option value="refused">Refused</option>
                                <option value="canceled">Canceled</option>
                              </select>
                            </div>
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
        <div className="p-6 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4 relative">
          <span className="text-xs font-semibold text-gray-400">
            Showing {(currentPage - 1) * 10 + 1} to {Math.min(currentPage * 10, totalEntries)} of {totalEntries} orders
          </span>
          
          <div className="flex items-center gap-1.5 mr-12 sm:mr-0">
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

          {/* Floating plus button for Merchant */}
          {userRole === "merchant" && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="absolute -top-5 right-6 w-11 h-11 rounded-full bg-brand-500 hover:bg-brand-600 text-white shadow-md shadow-brand-500/20 flex items-center justify-center transition-all hover:scale-105"
            >
              <Plus className="w-5 h-5 stroke-[3]" />
            </button>
          )}
        </div>

      </div>

      {/* Create Order Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-[28px] border border-gray-100 shadow-2xl p-8 max-w-md w-full relative space-y-6">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute right-6 top-6 text-gray-400 hover:text-gray-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-gray-900 tracking-tight">Create Order</h3>
              <p className="text-xs font-semibold text-gray-500">Add a new cash-on-delivery delivery shipment.</p>
            </div>

            {modalError && (
              <div className="bg-red-50 text-red-600 text-xs font-semibold px-4 py-3 rounded-xl border border-red-100">
                {modalError}
              </div>
            )}

            <form onSubmit={handleCreateOrder} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Customer Name
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-[#F3F4F6]/50 px-4 py-3 rounded-xl text-sm border-none focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-800 font-medium"
                  placeholder="e.g. Karim Bennani"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Customer Phone
                </label>
                <input
                  type="text"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-[#F3F4F6]/50 px-4 py-3 rounded-xl text-sm border-none focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-800 font-medium"
                  placeholder="e.g. +212 661-234567"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Customer Address
                </label>
                <textarea
                  required
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className="w-full bg-[#F3F4F6]/50 px-4 py-3 rounded-xl text-sm border-none focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-800 font-medium h-20 resize-none"
                  placeholder="e.g. 45 Bd Zerktouni, Maarif, Casablanca"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  COD Amount (MAD)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={amountCod}
                  onChange={(e) => setAmountCod(e.target.value)}
                  className="w-full bg-[#F3F4F6]/50 px-4 py-3 rounded-xl text-sm border-none focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-800 font-medium"
                  placeholder="e.g. 450.00"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-brand-500 hover:bg-brand-600 text-white rounded-xl py-3 text-sm font-bold shadow-md shadow-brand-500/10 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isSubmitting ? "Creating Order..." : "Create Order"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Bottom section (Live Event Feed + Fleet distribution map) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Live Event Feed */}
        <div className="lg:col-span-2 bg-white rounded-[24px] border border-gray-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h4 className="text-base font-extrabold text-gray-900">Live Event Feed</h4>
              <span className="w-2 h-2 rounded-full bg-brand-500 animate-ping" />
            </div>
          </div>

          <div className="space-y-4">
            {/* Event 1 */}
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-4.5 h-4.5" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-gray-700 leading-normal">
                  <span className="font-bold text-gray-900">#LOG-A82B3</span> was successfully delivered in Tangier.
                </p>
                <span className="text-[10px] text-gray-400 font-bold block">2 mins ago</span>
              </div>
            </div>

            {/* Event 2 */}
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-pink-50 text-brand-500 flex items-center justify-center shrink-0 mt-0.5">
                <Truck className="w-4.5 h-4.5" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-gray-700 leading-normal">
                  Driver <span className="font-bold text-gray-900">Reda S.</span> picked up 14 packages from Warehouse B.
                </p>
                <span className="text-[10px] text-gray-400 font-bold block">15 mins ago</span>
              </div>
            </div>
          </div>
        </div>

        {/* National Fleet Distribution Map */}
        <div className="lg:col-span-3 bg-[#0A0D10] text-white rounded-[24px] p-6 flex flex-col justify-between h-[300px] lg:h-auto relative overflow-hidden">
          <div className="flex items-center justify-between z-10">
            <h4 className="text-base font-extrabold">National Fleet Distribution</h4>
            <div className="bg-white/10 rounded-lg p-0.5 flex gap-1 border border-white/5">
              <button className="px-3 py-1 rounded bg-white text-zinc-900 text-[10px] font-extrabold shadow-sm">
                Live
              </button>
              <button className="px-3 py-1 rounded text-zinc-400 text-[10px] font-bold">
                Historical
              </button>
            </div>
          </div>

          {/* Map Graphic Node Simulation */}
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <svg viewBox="0 0 500 300" className="w-full h-full opacity-60">
              {/* Connection Lines */}
              <line x1="200" y1="80" x2="250" y2="120" stroke="#DB0087" strokeWidth="1.5" strokeDasharray="3 3" />
              <line x1="250" y1="120" x2="220" y2="180" stroke="#DB0087" strokeWidth="1.5" />
              <line x1="220" y1="180" x2="310" y2="220" stroke="#DB0087" strokeWidth="1.5" strokeDasharray="3 3" />
              <line x1="310" y1="220" x2="340" y2="100" stroke="#DB0087" strokeWidth="1.5" />
              <line x1="340" y1="100" x2="200" y2="80" stroke="#DB0087" strokeWidth="1.5" />

              {/* Tangier Node */}
              <circle cx="200" cy="80" r="5" fill="#DB0087" />
              <circle cx="200" cy="80" r="12" fill="none" stroke="#DB0087" strokeWidth="1" className="animate-ping" style={{ transformOrigin: "200px 80px" }} />
              <text x="190" y="65" fill="#FFF" fontSize="10" fontWeight="bold">Tangier</text>

              {/* Rabat Node */}
              <circle cx="250" cy="120" r="5" fill="#DB0087" />
              <text x="260" y="125" fill="#FFF" fontSize="10" fontWeight="bold">Rabat</text>

              {/* Casablanca Node */}
              <circle cx="220" cy="180" r="5" fill="#DB0087" />
              <circle cx="220" cy="180" r="10" fill="none" stroke="#DB0087" strokeWidth="1" className="animate-ping" style={{ transformOrigin: "220px 180px" }} />
              <text x="145" y="185" fill="#FFF" fontSize="10" fontWeight="bold">Casablanca</text>

              {/* Marrakech Node */}
              <circle cx="310" cy="220" r="5" fill="#DB0087" />
              <text x="320" y="225" fill="#FFF" fontSize="10" fontWeight="bold">Marrakech</text>

              {/* Fez Node */}
              <circle cx="340" cy="100" r="5" fill="#DB0087" />
              <text x="350" y="105" fill="#FFF" fontSize="10" fontWeight="bold">Fez</text>
            </svg>
          </div>

          <div className="text-[10px] text-zinc-500 font-bold z-10 mt-auto">
            Interactive routing network mapping active courier dispatches.
          </div>
        </div>

      </div>

    </div>
  );
}

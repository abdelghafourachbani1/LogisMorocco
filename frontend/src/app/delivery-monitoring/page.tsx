"use client";

import { useState, useEffect } from "react";
import { 
  Truck, 
  MapPin, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Clock, 
  UserPlus, 
  ChevronRight,
  Sparkles,
  Map,
  Layers,
  ArrowRight,
  X
} from "lucide-react";

interface Order {
  id: number;
  tracking_number: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  amount_cod: number;
  status: string;
  created_at: string;
  updated_at: string;
  livreur?: {
    id: number;
    name: string;
    phone: string | null;
  } | null;
  merchant?: {
    id: number;
    name: string;
  } | null;
}

interface Driver {
  id: number;
  name: string;
  phone: string | null;
  email: string;
  status: string;
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

export default function DeliveryMonitoring() {
  const [activeDeliveries, setActiveDeliveries] = useState<Order[]>([]);
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("All");
  const [selectedOrderForAssign, setSelectedOrderForAssign] = useState<Order | null>(null);
  const [isAssigning, setIsAssigning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMonitoringData = async () => {
    setIsLoading(true);
    try {
      // Fetch in-transit orders
      const transitRes = await fetch(getApiUrl("/api/orders?status=in_transit"), {
        headers: { "Accept": "application/json" },
        credentials: "include"
      });
      const transitData = await transitRes.json();
      setActiveDeliveries(transitData.orders || []);

      // Fetch pending orders for allocation
      const pendingRes = await fetch(getApiUrl("/api/orders?status=pending"), {
        headers: { "Accept": "application/json" },
        credentials: "include"
      });
      const pendingData = await pendingRes.json();
      setPendingOrders(pendingData.orders || []);

      // Fetch active drivers
      const driversRes = await fetch(getApiUrl("/api/admin/users?role=livreur"), {
        headers: { "Accept": "application/json" },
        credentials: "include"
      });
      const driversData = await driversRes.json();
      setDrivers(driversData.users || []);
    } catch (err) {
      console.error("Failed to load monitoring data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMonitoringData();
    // Auto-refresh every 30 seconds for live monitoring feel
    const interval = setInterval(fetchMonitoringData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleAllocateDriver = async (orderId: number, driverId: number) => {
    setIsAssigning(true);
    try {
      const xsrfToken = getCookie("XSRF-TOKEN");
      const res = await fetch(getApiUrl(`/api/admin/orders/${orderId}/reassign`), {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          ...(xsrfToken ? { "X-XSRF-TOKEN": xsrfToken } : {})
        },
        body: JSON.stringify({ livreur_id: driverId }),
        credentials: "include"
      });

      if (res.ok) {
        setSelectedOrderForAssign(null);
        fetchMonitoringData();
      }
    } catch (err) {
      console.error("Allocation failed:", err);
    } finally {
      setIsAssigning(false);
    }
  };

  // Filter transit list
  const filteredTransit = activeDeliveries.filter(order => {
    const matchesSearch = order.tracking_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (order.livreur?.name || "").toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedCity === "All") return matchesSearch;
    return matchesSearch && order.customer_address.toLowerCase().includes(selectedCity.toLowerCase());
  });

  // Cities mock positions for map nodes
  const mapNodes = [
    { name: "Tangier", cx: 200, cy: 60, activeCount: activeDeliveries.filter(o => o.customer_address.toLowerCase().includes("tangier")).length },
    { name: "Rabat", cx: 250, cy: 110, activeCount: activeDeliveries.filter(o => o.customer_address.toLowerCase().includes("rabat")).length },
    { name: "Casablanca", cx: 210, cy: 170, activeCount: activeDeliveries.filter(o => o.customer_address.toLowerCase().includes("casablanca") || o.customer_address.toLowerCase().includes("maarif")).length },
    { name: "Marrakech", cx: 310, cy: 220, activeCount: activeDeliveries.filter(o => o.customer_address.toLowerCase().includes("marrakech")).length },
    { name: "Fez", cx: 340, cy: 90, activeCount: activeDeliveries.filter(o => o.customer_address.toLowerCase().includes("fez")).length },
  ];

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-pink-50 text-brand-500 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" /> Live Control Center
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight mt-1">Delivery Monitoring</h2>
          <p className="text-xs font-semibold text-gray-500">Real-time dispatcher console, driver assignments, and transit routes.</p>
        </div>

        <button 
          onClick={fetchMonitoringData}
          className="bg-white border border-gray-100 hover:bg-gray-50 text-gray-800 font-bold px-4 py-2.5 rounded-xl text-xs shadow-sm flex items-center gap-2 transition-all"
        >
          <Clock className="w-4 h-4 text-brand-500" /> Refresh Live Console
        </button>
      </div>

      {/* KPI stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Active In Transit", value: activeDeliveries.length, icon: Truck, color: "text-brand-500 bg-pink-50" },
          { label: "Pending Allocation", value: pendingOrders.length, icon: UserPlus, color: "text-amber-500 bg-amber-50" },
          { label: "Online Couriers", value: drivers.length, icon: CheckCircle, color: "text-emerald-500 bg-emerald-50" },
          { label: "Success Rate today", value: "94.2%", icon: MapPin, color: "text-blue-500 bg-blue-50" },
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-gray-100 p-6 flex items-center justify-between shadow-sm">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">{kpi.label}</span>
              <p className="text-2xl font-black text-gray-950">{kpi.value}</p>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${kpi.color}`}>
              <kpi.icon className="w-5 h-5" />
            </div>
          </div>
        ))}
      </div>

      {/* Map + Dispatcher Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Interactive Map Visualisation */}
        <div className="lg:col-span-3 bg-[#0A0D10] text-white rounded-[28px] p-6 flex flex-col justify-between h-[450px] relative overflow-hidden shadow-xl border border-zinc-900">
          <div className="flex items-center justify-between z-10">
            <div>
              <h4 className="text-sm font-black flex items-center gap-2 uppercase tracking-wider text-zinc-300">
                <Map className="w-4 h-4 text-brand-500" /> National Delivery Network
              </h4>
              <p className="text-[10px] text-zinc-500 font-semibold mt-0.5">Active courier routes across Moroccan shipping centers.</p>
            </div>
            <span className="bg-white/10 text-white border border-white/5 px-3 py-1 rounded-lg text-[9px] font-extrabold uppercase tracking-widest shadow-sm">
              Live Map
            </span>
          </div>

          {/* SVG Map Container */}
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <svg viewBox="0 0 500 300" className="w-full h-full opacity-70">
              {/* Active Route Links */}
              <line x1="200" y1="60" x2="250" y2="110" stroke="#DB0087" strokeWidth="1.5" strokeDasharray="4 4" className="animate-[dash_10s_linear_infinite]" />
              <line x1="250" y1="110" x2="210" y2="170" stroke="#DB0087" strokeWidth="1.5" />
              <line x1="210" y1="170" x2="310" y2="220" stroke="#DB0087" strokeWidth="1.5" strokeDasharray="4 4" />
              <line x1="310" y1="220" x2="340" y2="90" stroke="#DB0087" strokeWidth="1.5" />
              <line x1="340" y1="90" x2="200" y2="60" stroke="#DB0087" strokeWidth="1.5" />

              {mapNodes.map((node, i) => (
                <g key={i}>
                  {node.activeCount > 0 && (
                    <circle 
                      cx={node.cx} 
                      cy={node.cy} 
                      r={12 + node.activeCount * 3} 
                      fill="none" 
                      stroke="#DB0087" 
                      strokeWidth="1" 
                      className="animate-ping" 
                      style={{ transformOrigin: `${node.cx}px ${node.cy}px` }} 
                    />
                  )}
                  <circle cx={node.cx} cy={node.cy} r="5" fill={node.activeCount > 0 ? "#DB0087" : "#52525b"} />
                  <text x={node.cx + 10} y={node.cy + 4} fill="#FFF" fontSize="9" fontWeight="bold">{node.name}</text>
                  {node.activeCount > 0 && (
                    <rect x={node.cx - 10} y={node.cy - 18} width="20" height="10" rx="3" fill="#DB0087" />
                  )}
                  {node.activeCount > 0 && (
                    <text x={node.cx} y={node.cy - 10} fill="#FFF" fontSize="8" fontWeight="extrabold" textAnchor="middle">{node.activeCount}</text>
                  )}
                </g>
              ))}
            </svg>
          </div>

          <div className="flex items-center gap-4 z-10 text-[9px] text-zinc-500 font-bold">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-brand-500" /> Pulse Indicates Active Dispatch
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-zinc-600" /> Inactive Hub
            </div>
          </div>
        </div>

        {/* Live Pending Allocation Queue */}
        <div className="lg:col-span-2 bg-white rounded-[28px] border border-gray-100 p-6 flex flex-col h-[450px]">
          <div className="flex items-center justify-between pb-4 border-b border-gray-50">
            <div>
              <h4 className="text-sm font-black text-gray-900 tracking-tight uppercase">Manual Allocation Queue</h4>
              <p className="text-[10px] text-gray-400 font-bold mt-0.5">Allocate pending shipments to active drivers.</p>
            </div>
            <span className="bg-amber-50 text-amber-600 font-black text-xs px-2.5 py-1 rounded-xl">
              {pendingOrders.length} Left
            </span>
          </div>

          {/* List of unassigned orders */}
          <div className="flex-1 overflow-y-auto pr-1 py-4 space-y-3 scrollbar-thin">
            {pendingOrders.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-2 py-10">
                <CheckCircle className="w-8 h-8 text-emerald-500" />
                <p className="text-xs font-bold text-gray-700">All caught up!</p>
                <p className="text-[10px] text-gray-400 font-semibold max-w-[180px]">All shipments are fully allocated to couriers.</p>
              </div>
            ) : (
              pendingOrders.map((order) => (
                <div 
                  key={order.id}
                  className="bg-gray-50/50 hover:bg-gray-50 border border-gray-100 rounded-2xl p-4 flex flex-col justify-between gap-3 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-black text-brand-500 uppercase tracking-widest">{order.tracking_number}</span>
                      <p className="text-xs font-bold text-gray-900 mt-0.5">{order.customer_name}</p>
                      <p className="text-[10px] text-gray-400 font-semibold mt-0.5 max-w-[200px] truncate">{order.customer_address}</p>
                    </div>
                    <span className="text-xs font-extrabold text-gray-900">{order.amount_cod.toLocaleString()} MAD</span>
                  </div>

                  <button
                    onClick={() => setSelectedOrderForAssign(order)}
                    className="w-full bg-brand-500 hover:bg-brand-600 text-white rounded-xl py-2 text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
                  >
                    Allocate Courier <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* In Transit Active List */}
      <div className="bg-white rounded-[28px] border border-gray-100 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-50">
          <div>
            <h4 className="text-base font-black text-gray-900 tracking-tight">Active Dispatches In Transit</h4>
            <p className="text-xs text-gray-400 font-semibold">Real-time status updates of couriers on the road.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search dispatch..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#F3F4F6]/50 pl-9 pr-4 py-2 rounded-xl text-xs border-none focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-800 font-medium placeholder-gray-400 w-48"
              />
            </div>

            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-[#F3F4F6]/50 px-3 py-2 rounded-xl text-xs font-bold text-gray-800 border-none focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="All">All Cities</option>
              <option value="Casablanca">Casablanca</option>
              <option value="Rabat">Rabat</option>
              <option value="Marrakech">Marrakech</option>
              <option value="Fez">Fez</option>
              <option value="Tangier">Tangier</option>
            </select>
          </div>
        </div>

        {/* Deliveries Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <th className="pb-3 font-black">Shipment</th>
                <th className="pb-3 font-black">Recipient</th>
                <th className="pb-3 font-black">City / Hub</th>
                <th className="pb-3 font-black">Courier Details</th>
                <th className="pb-3 font-black">Status</th>
                <th className="pb-3 font-black">Dispatched At</th>
                <th className="pb-3 font-black text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs font-semibold text-gray-700">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400 font-bold">
                    Streaming control center data...
                  </td>
                </tr>
              ) : filteredTransit.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400 font-bold">
                    No active dispatches found matching filters.
                  </td>
                </tr>
              ) : (
                filteredTransit.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/40 transition-all">
                    <td className="py-4">
                      <span className="text-[10px] font-black text-brand-500 uppercase tracking-widest">{order.tracking_number}</span>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">{order.amount_cod.toLocaleString()} MAD</p>
                    </td>
                    <td className="py-4">
                      <p className="text-gray-900 font-extrabold">{order.customer_name}</p>
                      <p className="text-[10px] text-gray-400 font-semibold mt-0.5">{order.customer_phone}</p>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span className="truncate max-w-[150px]">{order.customer_address}</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-pink-50 text-brand-500 flex items-center justify-center font-extrabold text-[10px]">
                          {order.livreur?.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-gray-900 font-extrabold">{order.livreur?.name}</p>
                          <p className="text-[10px] text-gray-400 font-bold">{order.livreur?.phone || "No phone"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="inline-flex items-center gap-1.5 bg-pink-50 text-brand-500 px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider border border-pink-100/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-ping" /> In Transit
                      </span>
                    </td>
                    <td className="py-4 text-gray-400 text-[10px] font-bold">
                      {new Date(order.updated_at).toLocaleString()}
                    </td>
                    <td className="py-4 text-right">
                      <button 
                        onClick={() => setSelectedOrderForAssign(order)}
                        className="text-[10px] font-black uppercase tracking-wider text-brand-500 hover:text-brand-600 border border-brand-500/20 hover:bg-brand-50/50 px-3 py-1.5 rounded-xl transition-all"
                      >
                        Reallocate
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Courier Assignment Dialog */}
      {selectedOrderForAssign && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-[28px] border border-gray-100 shadow-2xl p-8 max-w-md w-full relative space-y-6">
            <button 
              onClick={() => setSelectedOrderForAssign(null)}
              className="absolute right-6 top-6 text-gray-400 hover:text-gray-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-black text-brand-500 uppercase tracking-widest">Courier Dispatch Assignment</span>
              <h3 className="text-xl font-black text-gray-900 tracking-tight">{selectedOrderForAssign.tracking_number}</h3>
              <p className="text-xs font-semibold text-gray-500">Allocate this shipment to an active courier partner.</p>
            </div>

            <div className="bg-gray-50/50 border border-gray-100 rounded-2xl p-4 text-xs font-semibold text-gray-700 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Recipient Name</span>
                <span className="text-gray-900 font-bold">{selectedOrderForAssign.customer_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">COD Value</span>
                <span className="text-brand-500 font-black">{selectedOrderForAssign.amount_cod.toLocaleString()} MAD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Shipping Address</span>
                <span className="text-gray-900 font-bold text-right max-w-[200px] truncate">{selectedOrderForAssign.customer_address}</span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Select Courier Partner</label>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {drivers.map((driver) => (
                  <button
                    key={driver.id}
                    disabled={isAssigning}
                    onClick={() => handleAllocateDriver(selectedOrderForAssign.id, driver.id)}
                    className="w-full bg-white hover:bg-gray-50 border border-gray-100 rounded-2xl p-3 flex items-center justify-between text-left transition-all disabled:opacity-50"
                  >
                    <div>
                      <p className="text-xs font-bold text-gray-900">{driver.name}</p>
                      <p className="text-[10px] text-gray-400 font-semibold mt-0.5">{driver.email}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

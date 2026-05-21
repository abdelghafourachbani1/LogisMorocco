"use client";

import { useState } from "react";
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
  CloudLightning
} from "lucide-react";

interface OrderRow {
  id: string;
  orderId: string;
  date: string;
  customerName: string;
  destination: string;
  merchant: string;
  status: "Failed Attempt" | "In Transit" | "Delivered" | "Dispatched";
  value: number;
  hasAlert?: boolean;
}

const initialOrders: OrderRow[] = [
  { id: "1", orderId: "#LM-98231", date: "Oct 24, 14:20", customerName: "Yassine Mansouri", destination: "Casablanca, Maârif", merchant: "ElectroMaghreb", status: "Failed Attempt", value: 1450, hasAlert: true },
  { id: "2", orderId: "#LM-98229", date: "Oct 24, 13:45", customerName: "Sara Benjelloun", destination: "Rabat, Agdal", merchant: "Vogue Morocco", status: "In Transit", value: 320 },
  { id: "3", orderId: "#LM-98225", date: "Oct 24, 12:10", customerName: "Karim Idris", destination: "Tangier, City Center", merchant: "Decathlon MA", status: "Delivered", value: 890 },
  { id: "4", orderId: "#LM-98224", date: "Oct 24, 11:55", customerName: "Imane Tazi", destination: "Marrakech, Gueliz", merchant: "Kitea Morocco", status: "Dispatched", value: 2100 }
];

export default function Orders() {
  const [orders, setOrders] = useState<OrderRow[]>(initialOrders);
  const [activeTab, setActiveTab] = useState<"All" | "Pending Dispatch" | "Out for Delivery" | "Returns (RTO)">("All");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("Newest First");

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderId.toLowerCase().includes(search.toLowerCase()) || 
                          order.customerName.toLowerCase().includes(search.toLowerCase()) ||
                          order.destination.toLowerCase().includes(search.toLowerCase());
    
    if (activeTab === "Pending Dispatch") {
      return matchesSearch && order.status === "Dispatched";
    }
    if (activeTab === "Out for Delivery") {
      return matchesSearch && order.status === "In Transit";
    }
    if (activeTab === "Returns (RTO)") {
      return matchesSearch && order.status === "Failed Attempt";
    }
    return matchesSearch;
  });

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
            Advanced Filters
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Active Orders */}
        <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-brand-500">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black text-brand-500 bg-pink-50/50 px-2 py-0.5 rounded-md">
              +12% vs LW
            </span>
          </div>
          <div className="mt-4">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Active Orders</span>
            <h3 className="text-3xl font-black text-gray-900 mt-1">1,284</h3>
          </div>
        </div>

        {/* Card 2: In Transit */}
        <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500">
              <Truck className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
              On Schedule
            </span>
          </div>
          <div className="mt-4">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">In Transit</span>
            <h3 className="text-3xl font-black text-gray-900 mt-1">856</h3>
          </div>
        </div>

        {/* Card 3: Delayed/Issues */}
        <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-500">
              <AlertCircle className="w-5 h-5 animate-pulse" />
            </div>
            <span className="text-[10px] font-black text-red-600 bg-red-50 px-2 py-0.5 rounded-md">
              Action Required
            </span>
          </div>
          <div className="mt-4">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Delayed/Issues</span>
            <h3 className="text-3xl font-black text-gray-900 mt-1">42</h3>
          </div>
        </div>

        {/* Card 4: COD To Collect (Dark Card) */}
        <div className="bg-[#0A0D10] text-white p-6 rounded-[24px] shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <RotateCw className="w-5 h-5 text-zinc-300" />
            </div>
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-zinc-400">
              Live Flow
            </span>
          </div>
          <div className="mt-4">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">COD to Collect</span>
            <h3 className="text-3xl font-black text-white mt-1">128.4k <span className="text-sm font-bold text-zinc-400">MAD</span></h3>
          </div>
        </div>
      </div>

      {/* Main Grid View */}
      <div className="bg-white rounded-[28px] border border-gray-100 shadow-sm overflow-hidden relative">
        
        {/* Table Header Filter & Sorting */}
        <div className="p-6 border-b border-gray-50 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex border-b border-gray-100 w-full sm:w-auto">
            {["All Orders", "Pending Dispatch", "Out for Delivery", "Returns (RTO)"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-4 py-3 text-xs font-bold transition-all relative border-b-2 -mb-[2px] ${
                  (activeTab === "All" && tab === "All Orders") || activeTab === tab
                    ? "border-brand-500 text-brand-500"
                    : "border-transparent text-gray-400 hover:text-gray-900"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <span className="text-xs text-gray-400 font-bold">Sort by:</span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-gray-50 hover:bg-gray-100/80 border border-gray-100 rounded-xl pl-4 pr-10 py-2 text-xs font-extrabold text-gray-800 focus:outline-none cursor-pointer"
              >
                <option value="Newest First">Newest First</option>
                <option value="Value: High to Low">Value: High to Low</option>
                <option value="Value: Low to High">Value: Low to High</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
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
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/30 transition-colors">
                  
                  {/* Order & Date */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-brand-500 text-sm hover:underline cursor-pointer">
                        {order.orderId}
                      </span>
                      {order.hasAlert && (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                    <span className="text-[10px] text-gray-400 font-bold block mt-0.5">{order.date}</span>
                  </td>

                  {/* Customer / Destination */}
                  <td className="py-4 px-6">
                    <p className="font-extrabold text-gray-900">{order.customerName}</p>
                    <span className="text-[10px] text-gray-400 font-bold block mt-0.5">{order.destination}</span>
                  </td>

                  {/* Merchant */}
                  <td className="py-4 px-6 text-gray-500 font-semibold">
                    {order.merchant}
                  </td>

                  {/* Courier Status */}
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-extrabold ${
                      order.status === "Delivered" ? "bg-emerald-50 text-emerald-700" :
                      order.status === "In Transit" ? "bg-pink-50 text-brand-500" :
                      order.status === "Failed Attempt" ? "bg-red-50 text-red-700" :
                      "bg-gray-100 text-gray-700"
                    }`}>
                      {order.status === "Failed Attempt" ? "• Failed Attempt" : 
                       order.status === "In Transit" ? "• In Transit" : 
                       order.status === "Delivered" ? "• Delivered" : 
                       "• Dispatched"}
                    </span>
                  </td>

                  {/* Value */}
                  <td className="py-4 px-6 font-extrabold text-gray-900 text-sm">
                    {order.value.toLocaleString()} MAD
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6 text-right">
                    <button className="p-1 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-gray-900 transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination & Floating Button footer */}
        <div className="p-6 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4 relative">
          <span className="text-xs font-semibold text-gray-400">Showing 1-10 of 1,284 orders</span>
          
          <div className="flex items-center gap-1.5 mr-12 sm:mr-0">
            <button className="p-2 border border-gray-100 rounded-xl hover:bg-gray-50 text-gray-400 hover:text-gray-900 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 rounded-xl bg-brand-500 text-white font-extrabold text-xs shadow-sm flex items-center justify-center">
              1
            </button>
            <button className="w-8 h-8 rounded-xl hover:bg-gray-50 text-gray-500 font-bold text-xs flex items-center justify-center transition-colors">
              2
            </button>
            <button className="w-8 h-8 rounded-xl hover:bg-gray-50 text-gray-500 font-bold text-xs flex items-center justify-center transition-colors">
              3
            </button>
            <span className="text-gray-400 font-bold px-1 text-xs">...</span>
            <button className="w-8 h-8 rounded-xl hover:bg-gray-50 text-gray-500 font-bold text-xs flex items-center justify-center transition-colors">
              128
            </button>
            <button className="p-2 border border-gray-100 rounded-xl hover:bg-gray-50 text-gray-400 hover:text-gray-900 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Floating plus button */}
          <button className="absolute -top-5 right-6 w-11 h-11 rounded-full bg-brand-500 hover:bg-brand-600 text-white shadow-md shadow-brand-500/20 flex items-center justify-center transition-all hover:scale-105">
            <Plus className="w-5 h-5 stroke-[3]" />
          </button>
        </div>

      </div>

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
                  <span className="font-bold text-gray-900">#LM-98225</span> was successfully delivered in Tangier.
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

            {/* Event 3 */}
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0 mt-0.5">
                <AlertTriangle className="w-4.5 h-4.5" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-gray-700 leading-normal">
                  <span className="font-bold text-gray-900">#LM-98231</span> delivery failed. Customer unavailable.
                </p>
                <span className="text-[10px] text-gray-400 font-bold block">24 mins ago</span>
              </div>
            </div>

            {/* Event 4 */}
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0 mt-0.5">
                <CloudLightning className="w-4.5 h-4.5" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-gray-700 leading-normal">
                  System sync: 45 new orders imported from Shopify API.
                </p>
                <span className="text-[10px] text-gray-400 font-bold block">42 mins ago</span>
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

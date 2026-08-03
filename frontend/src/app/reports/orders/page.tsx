"use client";

import { useState, useEffect } from "react";
import { 
  FileText, 
  Calendar, 
  Filter, 
  Download, 
  Search, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  AlertCircle 
} from "lucide-react";

interface Order {
  id: number;
  tracking_number: string;
  customer_name: string;
  amount_cod: number;
  status: string;
  created_at: string;
  livreur?: { name: string } | null;
  merchant?: { name: string } | null;
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

export default function OrdersReport() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(getApiUrl("/api/orders"), {
        headers: { "Accept": "application/json" },
        credentials: "include"
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.tracking_number.toLowerCase().includes(search.toLowerCase()) ||
                          o.customer_name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || o.status === statusFilter.toLowerCase();
    
    let matchesDate = true;
    if (dateFrom) {
      matchesDate = matchesDate && new Date(o.created_at) >= new Date(dateFrom);
    }
    if (dateTo) {
      // Add one day to include the whole dateTo day
      const toDate = new Date(dateTo);
      toDate.setDate(toDate.getDate() + 1);
      matchesDate = matchesDate && new Date(o.created_at) <= toDate;
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleExport = () => {
    // Generate a simple CSV export mock trigger
    const headers = "Tracking Number,Customer Name,Amount (MAD),Status,Driver,Merchant,Created At\n";
    const rows = filteredOrders.map(o => 
      `"${o.tracking_number}","${o.customer_name}",${o.amount_cod},"${o.status}","${o.livreur?.name || 'N/A'}","${o.merchant?.name || 'N/A'}","${new Date(o.created_at).toLocaleDateString()}"`
    ).join("\n");
    
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="bg-pink-50 text-brand-500 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full">
            Platform Reports
          </span>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight mt-1">Orders Report</h2>
          <p className="text-xs font-semibold text-gray-500">Query and generate custom order dispatches metrics.</p>
        </div>

        <button
          onClick={handleExport}
          className="bg-[#1A1D20] hover:bg-zinc-800 text-white rounded-xl px-4 py-2.5 text-xs font-bold transition-all flex items-center gap-2"
        >
          <Download className="w-4 h-4" /> Export Report (CSV)
        </button>
      </div>

      {/* Filters Card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 grid grid-cols-1 sm:grid-cols-4 gap-4 shadow-sm">
        <div className="space-y-1.5 col-span-1">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Search</label>
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tracking or recipient..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-gray-50/50 pl-9 pr-4 py-2.5 rounded-xl text-xs border border-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-800 font-medium w-full"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-50/50 border border-gray-100 px-3 py-2.5 rounded-xl text-xs font-bold text-gray-850 focus:outline-none focus:ring-2 focus:ring-brand-500 w-full"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In_Transit">In Transit</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Date From</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="bg-gray-50/50 border border-gray-100 px-3 py-2 rounded-xl text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-500 w-full"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Date To</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="bg-gray-50/50 border border-gray-100 px-3 py-2 rounded-xl text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-500 w-full"
          />
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-[28px] border border-gray-100 p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <th className="pb-3 font-black">Tracking Number</th>
                <th className="pb-3 font-black">Recipient</th>
                <th className="pb-3 font-black">Merchant Partner</th>
                <th className="pb-3 font-black">Courier Assigned</th>
                <th className="pb-3 font-black">Amount</th>
                <th className="pb-3 font-black">Status</th>
                <th className="pb-3 font-black">Created Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs font-semibold text-gray-700">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400 font-bold">
                    Compiling dispatches...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-400 font-bold">
                    No matching order dispatches found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50/40 transition-all">
                    <td className="py-4">
                      <span className="text-[10px] font-black text-brand-500 uppercase tracking-widest">{o.tracking_number}</span>
                    </td>
                    <td className="py-4 text-gray-900 font-extrabold">{o.customer_name}</td>
                    <td className="py-4 text-gray-500">{o.merchant?.name || "N/A"}</td>
                    <td className="py-4 text-gray-500">{o.livreur?.name || "N/A"}</td>
                    <td className="py-4 text-gray-900 font-extrabold">{o.amount_cod.toLocaleString()} MAD</td>
                    <td className="py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider border ${
                        o.status === "delivered" 
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                          : o.status === "cancelled"
                          ? "bg-red-50 text-red-600 border-red-100"
                          : "bg-amber-50 text-amber-600 border-amber-100"
                      }`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="py-4 text-gray-400 text-[10px] font-bold">
                      {new Date(o.created_at).toLocaleDateString()}
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

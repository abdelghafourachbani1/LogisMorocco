"use client";

import { useState, useEffect } from "react";
import { 
  Package, 
  MapPin, 
  Search, 
  Calendar, 
  Filter, 
  CheckCircle2, 
  XCircle,
  Truck,
  RotateCw
} from "lucide-react";

function getApiUrl(path: string): string {
  const host = typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:8000"
    : "http://127.0.0.1:8000";
  return `${host}${path}`;
}

export default function DeliveryHistory() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterDate, setFilterDate] = useState<string>("");
  const [filterCity, setFilterCity] = useState<string>("");

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterStatus) params.append("status", filterStatus);
      if (filterDate) params.append("date", filterDate);
      if (filterCity) params.append("city", filterCity);

      const res = await fetch(getApiUrl(`/api/driver/history?${params.toString()}`), {
        headers: { "Accept": "application/json" },
        credentials: "include"
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error("Failed to load delivery history:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [filterStatus, filterDate, filterCity]);

  const clearFilters = () => {
    setFilterStatus("");
    setFilterDate("");
    setFilterCity("");
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">Delivery History Ledger</h2>
        <p className="text-gray-400 text-xs font-semibold mt-1">Audit completed, refused, or failed deliveries. Trace collected amounts and earnings.</p>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-4 items-center w-full md:w-auto">
          {/* Status Filter */}
          <div className="flex flex-col gap-1 w-full sm:w-40">
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Status</span>
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-orange-500 bg-white"
            >
              <option value="">All Statuses</option>
              <option value="delivered">Delivered</option>
              <option value="failed">Failed</option>
              <option value="refused">Refused</option>
              <option value="canceled">Canceled</option>
            </select>
          </div>

          {/* Date Filter */}
          <div className="flex flex-col gap-1 w-full sm:w-44">
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Date</span>
            <input 
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-orange-500 bg-white"
            />
          </div>

          {/* City Filter */}
          <div className="flex flex-col gap-1 w-full sm:w-48">
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">City</span>
            <div className="relative">
              <input 
                type="text"
                value={filterCity}
                onChange={(e) => setFilterCity(e.target.value)}
                placeholder="e.g. Casablanca"
                className="border border-gray-200 rounded-xl pl-8 pr-3 py-2 text-xs font-bold focus:outline-none focus:border-orange-500 w-full bg-white"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-3" />
            </div>
          </div>
        </div>

        {(filterStatus || filterDate || filterCity) && (
          <button 
            onClick={clearFilters}
            className="text-xs font-bold text-red-500 hover:text-red-600 self-end md:self-center transition-colors"
          >
            Clear Filters
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="min-h-[40vh] flex items-center justify-center text-sm font-bold text-gray-400">
          Loading history logs...
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white border border-gray-100 p-12 text-center rounded-2xl shadow-sm space-y-4">
          <Package className="w-12 h-12 text-gray-300 mx-auto" />
          <div className="space-y-1">
            <h4 className="font-extrabold text-sm text-gray-900">No History Found</h4>
            <p className="text-gray-400 text-xs font-semibold">There are no records matching your current filter settings.</p>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="py-4 px-6">Tracking Number</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6">Customer & Destination</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6">COD Collected</th>
                  <th className="py-4 px-6">Commission Earned</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs text-gray-600 font-semibold">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4.5 px-6 font-extrabold text-gray-900">{order.tracking_number}</td>
                    <td className="py-4.5 px-6 text-gray-400">
                      {new Date(order.updated_at).toLocaleDateString()}
                    </td>
                    <td className="py-4.5 px-6 space-y-0.5">
                      <span className="text-gray-900 block font-bold">{order.customer_name}</span>
                      <span className="text-gray-400 text-[11px] block">{order.customer_address}</span>
                    </td>
                    <td className="py-4.5 px-6">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                        order.status === 'delivered' ? 'bg-green-50 text-green-600' :
                        order.status === 'canceled' ? 'bg-red-50 text-red-600' :
                        'bg-amber-50 text-amber-600'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4.5 px-6 font-bold text-gray-900">
                      {order.status === 'delivered' ? `${order.amount_cod} MAD` : '0.00 MAD'}
                    </td>
                    <td className="py-4.5 px-6 font-black text-orange-500">
                      {order.status === 'delivered' ? `${order.delivery_fee || 35.00} MAD` : '0.00 MAD'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

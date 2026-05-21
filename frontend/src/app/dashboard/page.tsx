"use client";

import { useState, useEffect } from "react";
import { BarChart, Bar, Cell, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  Ban, 
  Truck, 
  Calendar, 
  RotateCw, 
  ArrowUpRight, 
  DollarSign, 
  UserCheck, 
  Package 
} from "lucide-react";

// Mock revenue data for charts
const chartData = [
  { name: 'JAN', value: 150 },
  { name: 'FEB', value: 180 },
  { name: 'MAR', value: 340 },
  { name: 'APR', value: 140 },
  { name: 'MAY', value: 200 },
  { name: 'JUN', value: 180 },
  { name: 'JUL', value: 150 },
  { name: 'AUG', value: 190 },
  { name: 'SEP', value: 360 },
  { name: 'OCT', value: 220 },
  { name: 'NOV', value: 180 },
  { name: 'DEC', value: 200 },
];

function getApiUrl(path: string): string {
  const host = typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:8000"
    : "http://127.0.0.1:8000";
  return `${host}${path}`;
}

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const [role, setRole] = useState<string>("admin");
  const [stats, setStats] = useState<any>({});
  const [recentItems, setRecentItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(getApiUrl("/api/dashboard"), {
        headers: { "Accept": "application/json" },
        credentials: "include"
      });
      if (res.ok) {
        const data = await res.json();
        setRole(data.role || "admin");
        setStats(data.stats || {});
        setRecentItems(data.recent_orders || data.recent_deliveries || []);
      }
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center font-bold text-gray-400 text-sm">
        Loading dashboard performance metrics...
      </div>
    );
  }

  // --- 1. ADMIN DASHBOARD VIEW ---
  if (role === "admin") {
    return (
      <div className="p-8 space-y-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Administrative Console</h2>
            <p className="text-gray-500 text-sm font-medium mt-1">
              Real-time monitoring across Morocco.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-gray-100 shadow-sm text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
              <Calendar className="w-4 h-4 text-gray-400" />
              Last 24 Hours
            </button>
          </div>
        </div>

        {/* Admin KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-brand-500">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Total Partners</p>
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">{stats.total_partners}</h3>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-500">
                <UserCheck className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Active Partners</p>
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">{stats.active_partners}</h3>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center text-yellow-600">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Verification Queue</p>
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">{stats.pending_partners}</h3>
          </div>

          <div className="bg-[#0A0D10] text-white rounded-3xl p-6 shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <RotateCw className="w-5 h-5 text-zinc-300" />
              </div>
            </div>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">COD to Collect</p>
            <h3 className="text-2xl font-black text-white tracking-tight">{stats.cod_to_collect?.toLocaleString()} MAD</h3>
          </div>
        </div>

        {/* Middle Grid (Revenue Chart + User Distribution) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-base font-bold text-gray-900">Revenue Performance</h3>
              <div className="flex items-center gap-2 text-xs font-bold text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-brand-500"></span>
                COD Flow
              </div>
            </div>
            
            <div className="h-64">
              {mounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} barSize={32}>
                    <XAxis 
                      dataKey="name" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#9CA3AF', fontSize: 11, fontWeight: 700 }}
                    />
                    <Tooltip 
                      cursor={{fill: '#f9fafb'}}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="#F3F4F6">
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={(entry.name === 'MAR' || entry.name === 'SEP') ? '#DB0087' : '#F3F4F6'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
            <h3 className="text-base font-bold text-gray-900 mb-6">Delivery Supervision</h3>
            <div className="space-y-4 flex-1">
              <div>
                <div className="flex justify-between items-center mb-1 text-xs">
                  <span className="font-bold text-gray-500">Total Shipments</span>
                  <span className="font-black text-gray-950">{stats.total_orders}</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1 text-xs">
                  <span className="font-bold text-gray-500">In Transit</span>
                  <span className="font-black text-brand-500">{stats.in_transit_orders}</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1 text-xs">
                  <span className="font-bold text-gray-500">Delivered Successfully</span>
                  <span className="font-black text-emerald-600">{stats.delivered_orders}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-50 text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Fleet Efficiency</p>
              <p className="text-2xl font-black text-brand-500">98.4%</p>
            </div>
          </div>
        </div>

        {/* Recent Dispatch Feed */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-gray-900">Recent Dispatch Supervision</h3>
            <span className="text-xs font-bold text-gray-400">Live Updates</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="pb-3">Tracking ID</th>
                  <th className="pb-3">Merchant</th>
                  <th className="pb-3">Courier</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs font-semibold text-gray-800">
                {recentItems.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 font-bold text-brand-500">{o.tracking_number}</td>
                    <td className="py-4 text-gray-900">{o.merchant_name}</td>
                    <td className="py-4 text-gray-500">{o.driver_name}</td>
                    <td className="py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider ${
                        o.status === "delivered" ? "bg-green-50 text-green-700" :
                        o.status === "in_transit" ? "bg-pink-50 text-brand-500" : "bg-blue-50 text-blue-700"
                      }`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="py-4 font-bold text-gray-900 text-right">{o.amount_cod} MAD</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // --- 2. MERCHANT DASHBOARD VIEW ---
  if (role === "merchant") {
    return (
      <div className="p-8 space-y-8 max-w-7xl mx-auto">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Merchant Central</h2>
          <p className="text-gray-500 text-sm font-medium mt-1">
            Grow your eCommerce dispatch operations securely.
          </p>
        </div>

        {/* Merchant KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-brand-500">
                <Package className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Total Shipments</p>
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">{stats.total_orders}</h3>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-500">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Delivered</p>
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">{stats.delivered_count}</h3>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-brand-500">
                <Truck className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Out For Delivery</p>
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">{stats.in_transit_count}</h3>
          </div>

          <div className="bg-[#0A0D10] text-white rounded-3xl p-6 shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-zinc-300" />
              </div>
            </div>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Total Earned (COD)</p>
            <h3 className="text-2xl font-black text-white tracking-tight">{stats.total_cod?.toLocaleString()} MAD</h3>
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-gray-900">Recent Sales Shipments</h3>
            <span className="text-xs font-bold text-gray-400">Order Updates</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="pb-3">Tracking ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs font-semibold text-gray-800">
                {recentItems.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 font-bold text-brand-500">{o.tracking_number}</td>
                    <td className="py-4 text-gray-900">{o.customer_name}</td>
                    <td className="py-4 text-gray-400">{o.date}</td>
                    <td className="py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider ${
                        o.status === "delivered" ? "bg-green-50 text-green-700" :
                        o.status === "in_transit" ? "bg-pink-50 text-brand-500" : "bg-blue-50 text-blue-700"
                      }`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="py-4 font-bold text-gray-900 text-right">{o.amount_cod} MAD</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // --- 3. LIVREUR/COURIER DASHBOARD VIEW ---
  if (role === "livreur") {
    return (
      <div className="p-8 space-y-8 max-w-7xl mx-auto">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Courier Dashboard</h2>
          <p className="text-gray-500 text-sm font-medium mt-1">
            Claim parcels, deliver safely, and monitor your cash flow.
          </p>
        </div>

        {/* Courier KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#0A0D10] text-white rounded-3xl p-6 shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <RotateCw className="w-5 h-5 text-zinc-300" />
              </div>
            </div>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">COD Balance Held</p>
            <h3 className="text-2xl font-black text-white tracking-tight">{stats.balance?.toLocaleString()} MAD</h3>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-brand-500">
                <Truck className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Active Deliveries</p>
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">{stats.active_deliveries}</h3>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-500">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Delivered Parcels</p>
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">{stats.delivered_count}</h3>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
                <Package className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Available to Claim</p>
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">{stats.available_orders}</h3>
          </div>
        </div>

        {/* Recent Deliveries Table */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-gray-900">Recent Completed Dispatches</h3>
            <span className="text-xs font-bold text-gray-400">History Log</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="pb-3">Tracking ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Completion Date</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs font-semibold text-gray-800">
                {recentItems.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 font-bold text-brand-500">{o.tracking_number}</td>
                    <td className="py-4 text-gray-900">{o.customer_name}</td>
                    <td className="py-4 text-gray-400">{o.date}</td>
                    <td className="py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider ${
                        o.status === "delivered" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                      }`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="py-4 font-bold text-gray-900 text-right">{o.amount_cod} MAD</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

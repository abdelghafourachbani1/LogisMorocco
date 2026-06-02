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
  Package,
  Download,
  TrendingUp,
  TrendingDown,
  Wallet,
  AlertTriangle,
  Archive,
  MoreVertical,
  Plus,
  PenTool,
  ShieldCheck,
  X,
  FileText
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
    const weeklyRevenueData = [
      { day: 'Mon', current: 500, previous: 300 },
      { day: 'Tue', current: 400, previous: 420 },
      { day: 'Wed', current: 800, previous: 250 },
      { day: 'Thu', current: 300, previous: 500 },
      { day: 'Fri', current: 600, previous: 200 },
      { day: 'Sat', current: 200, previous: 180 },
      { day: 'Sun', current: 450, previous: 300 },
    ];

    const recentActivities = [
      {
        id: 1,
        title: 'Package Delivered',
        desc: 'Order #LM-99023 was successfully delivered to Marrakesh.',
        time: '2 mins ago',
        icon: Truck,
        iconColor: 'text-brand-500 bg-pink-50 border border-pink-100/50',
      },
      {
        id: 2,
        title: 'Payment Processed',
        desc: 'COD balance of 12,400 MAD has been cleared for withdrawal.',
        time: '45 mins ago',
        icon: DollarSign,
        iconColor: 'text-emerald-600 bg-emerald-50 border border-emerald-100/50',
      },
      {
        id: 3,
        title: 'Delivery Delay',
        desc: 'Driver reported traffic issues for Route #B24 (Tangier).',
        time: '3 hours ago',
        icon: AlertTriangle,
        iconColor: 'text-red-500 bg-red-50 border border-red-100/50',
      },
      {
        id: 4,
        title: 'Stock Warning',
        desc: 'Item "Eco-Courier Box Large" is low on inventory.',
        time: '4 hours ago',
        icon: Archive,
        iconColor: 'text-purple-500 bg-purple-50 border border-purple-100/50',
      },
    ];

    return (
      <div className="p-8 space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Analytics Overview</h2>
            <p className="text-gray-500 text-sm font-medium mt-1">
              Real-time performance tracking for your logistics operations.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-[#3E3E3E] hover:bg-[#2C2C2C] px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-sm transition-all hover:-translate-y-0.5">
              <Download className="w-4 h-4" />
              Export Data
            </button>
            <div className="flex bg-[#F3F4F6] p-1 rounded-xl">
              <button className="bg-white text-gray-800 text-xs font-bold px-4 py-2 rounded-lg shadow-sm">
                Weekly
              </button>
              <button className="text-gray-400 hover:text-gray-600 text-xs font-bold px-4 py-2 rounded-lg transition-colors">
                Monthly
              </button>
            </div>
          </div>
        </div>

        {/* Merchant Hero KPIs (Financial and Performance Highlights) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Revenue */}
          <div className="bg-[#0A0D10] text-white rounded-3xl p-6 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[150px]">
            <div>
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Total Revenue</span>
              <h3 className="text-3xl font-black text-white mt-2">
                {(stats.total_cod ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })} MAD
              </h3>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 mt-4">
              <TrendingUp className="w-4 h-4" />
              <span>+14.8% this month</span>
            </div>
            <div className="absolute right-4 bottom-4 w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>

          {/* COD Balance */}
          <div className="bg-brand-500 text-white rounded-3xl p-6 shadow-md relative overflow-hidden flex flex-col justify-between min-h-[150px] shadow-brand-500/20">
            <div>
              <span className="text-[10px] font-black text-white/80 uppercase tracking-widest">COD Balance (Available)</span>
              <h3 className="text-3xl font-black text-white mt-2">
                {(stats.total_cod ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })} MAD
              </h3>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-white/95 mt-4">
              <span>Ready for Payout</span>
            </div>
            <div className="absolute right-4 bottom-4 w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white">
              <Wallet className="w-5 h-5" />
            </div>
          </div>

          {/* Pending COD */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[150px]">
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pending COD (In-Transit)</span>
              <h3 className="text-3xl font-black text-gray-900 mt-2">
                {(stats.pending_cod ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2 })} MAD
              </h3>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-brand-500 mt-4">
              <span>In delivery loop</span>
            </div>
            <div className="absolute right-4 bottom-4 w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-brand-500 border border-pink-100/50">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          {/* Delivery Success Rate */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[150px]">
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Delivery Success Rate</span>
              <h3 className="text-3xl font-black text-gray-900 mt-2">
                {stats.delivery_success_rate ?? 100.0}%
              </h3>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 mt-4">
              <TrendingUp className="w-4 h-4" />
              <span>Above region avg</span>
            </div>
            <div className="absolute right-4 bottom-4 w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500 border border-emerald-100/50">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Secondary KPI Grid (Operations Indicators) */}
        <div>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Operations Indicators</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {/* Total Orders */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col justify-between min-h-[90px]">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Total Orders</span>
              <span className="text-lg font-black text-gray-900 mt-1 block">{(stats.total_orders ?? 0).toLocaleString()}</span>
            </div>

            {/* Pending Orders */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col justify-between min-h-[90px]">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Pending</span>
              <span className="text-lg font-black text-gray-900 mt-1 block">{(stats.pending_count ?? 0).toLocaleString()}</span>
            </div>

            {/* Confirmed Orders */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col justify-between min-h-[90px]">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Confirmed</span>
              <span className="text-lg font-black text-gray-900 mt-1 block">{((stats.total_orders ?? 0) - (stats.pending_count ?? 0)).toLocaleString()}</span>
            </div>

            {/* Assigned Orders */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col justify-between min-h-[90px]">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Assigned</span>
              <span className="text-lg font-black text-gray-900 mt-1 block">{(stats.in_transit_count ?? 0).toLocaleString()}</span>
            </div>

            {/* Orders In Delivery */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col justify-between min-h-[90px]">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">In Delivery</span>
              <span className="text-lg font-black text-gray-900 mt-1 block">{(stats.in_transit_count ?? 0).toLocaleString()}</span>
            </div>

            {/* Delivered Orders */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col justify-between min-h-[90px]">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Delivered</span>
              <span className="text-lg font-black text-emerald-600 mt-1 block">{(stats.delivered_count ?? 0).toLocaleString()}</span>
            </div>

            {/* Cancelled Orders */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col justify-between min-h-[90px]">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Cancelled</span>
              <span className="text-lg font-black text-red-500 mt-1 block">{(stats.cancelled_count ?? 0).toLocaleString()}</span>
            </div>

            {/* Return Rate */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col justify-between min-h-[90px]">
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Return Rate</span>
              <span className="text-lg font-black text-gray-900 mt-1 block">{stats.return_rate ?? 0.0}%</span>
            </div>
          </div>
        </div>

        {/* Mid Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Growth Card */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-extrabold text-gray-900">Revenue Growth</h3>
                <p className="text-xs text-gray-400 font-semibold mt-0.5">Weekly performance vs. previous period</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-bold">
                <div className="flex items-center gap-1.5 text-gray-500">
                  <span className="w-2.5 h-2.5 rounded-full bg-brand-500"></span>
                  Current
                </div>
                <div className="flex items-center gap-1.5 text-gray-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-gray-200"></span>
                  Previous
                </div>
              </div>
            </div>
            
            <div className="h-72">
              {mounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyRevenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barGap={4}>
                    <XAxis 
                      dataKey="day" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#9CA3AF', fontSize: 11, fontWeight: 700 }}
                    />
                    <Tooltip 
                      cursor={{ fill: '#F9FAFB', opacity: 0.5 }}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="previous" fill="#E5E7EB" radius={[4, 4, 0, 0]} maxBarSize={8} />
                    <Bar dataKey="current" fill="#DB0087" radius={[4, 4, 0, 0]} maxBarSize={8} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Recent Activity Card */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between relative overflow-visible">
            <div>
              <h3 className="text-lg font-extrabold text-gray-900 mb-6">Recent Activity</h3>
              
              <div className="relative pl-10 space-y-6">
                {/* Timeline Line */}
                <div className="absolute left-5 top-2 bottom-2 w-0.5 bg-gray-100"></div>

                {recentActivities.map((act) => {
                  const ActIcon = act.icon;
                  return (
                    <div key={act.id} className="relative flex gap-4 items-start">
                      <div className={`absolute -left-10 w-10 h-10 rounded-full flex items-center justify-center ${act.iconColor}`}>
                        <ActIcon className="w-4 h-4" />
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between items-center gap-4">
                          <h4 className="text-xs font-extrabold text-gray-900">{act.title}</h4>
                          <span className="text-[10px] text-gray-400 font-semibold flex-shrink-0">{act.time}</span>
                        </div>
                        <p className="text-xs text-gray-500 font-medium leading-relaxed">
                          {act.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button className="text-brand-500 hover:text-brand-600 text-xs font-bold tracking-tight">
                View Full Audit Log
              </button>
            </div>

            {/* Overlapping Pink FAB */}
            <button className="absolute bottom-6 right-0 translate-x-1/2 translate-y-1/2 w-12 h-12 rounded-full bg-brand-500 hover:bg-brand-600 text-white flex items-center justify-center shadow-lg shadow-brand-500/30 transition-all hover:scale-105 cursor-pointer">
              <PenTool className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Recent Orders Status Table */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-extrabold text-gray-900">Recent Orders Status</h3>
            <div className="relative">
              <select className="appearance-none bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs font-bold text-gray-600 pr-10 focus:outline-none focus:ring-2 focus:ring-brand-500">
                <option>All Regions</option>
                <option>Rabat-Salé-Kénitra</option>
                <option>Casablanca-Settat</option>
                <option>Tanger-Tétouan-Al Hoceïma</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-gray-400">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50/50">
                  <th className="py-4 px-6 rounded-l-xl">Tracking ID</th>
                  <th className="py-4 px-6">Customer</th>
                  <th className="py-4 px-6">Destination</th>
                  <th className="py-4 px-6">Amount</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right rounded-r-xl">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs font-semibold text-gray-800">
                {recentItems.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-gray-400 font-bold">
                      No recent orders found.
                    </td>
                  </tr>
                ) : (
                  recentItems.map((o) => {
                    let badgeClass = "bg-gray-50 text-gray-700";
                    if (o.status === "delivered") {
                      badgeClass = "bg-green-50 text-green-700 border border-green-100";
                    } else if (o.status === "in_transit") {
                      badgeClass = "bg-pink-50 text-brand-500 border border-pink-100";
                    } else if (o.status === "pending") {
                      badgeClass = "bg-gray-100 text-gray-700 border border-gray-200";
                    } else if (o.status === "canceled" || o.status === "refused") {
                      badgeClass = "bg-red-50 text-red-700 border border-red-100";
                    }

                    return (
                      <tr key={o.id} className="hover:bg-gray-50/30 transition-colors">
                        <td className="py-4 px-6 font-extrabold text-gray-900">{o.tracking_number}</td>
                        <td className="py-4 px-6 text-gray-900 font-bold">{o.customer_name}</td>
                        <td className="py-4 px-6 text-gray-500 font-medium">{o.customer_address || "Casablanca, Maarif"}</td>
                        <td className="py-4 px-6 font-extrabold text-gray-900">{o.amount_cod?.toLocaleString()} MAD</td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${badgeClass}`}>
                            {o.status === "in_transit" ? "IN TRANSIT" : o.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                            <MoreVertical className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-8 text-center pt-4 border-t border-gray-50">
            <button className="text-brand-500 hover:text-brand-600 text-xs font-bold tracking-tight cursor-pointer">
              View All Active Shipments
            </button>
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

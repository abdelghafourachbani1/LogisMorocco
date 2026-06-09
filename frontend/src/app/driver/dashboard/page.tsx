"use client";

import { useState, useEffect } from "react";
import { 
  Truck, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  DollarSign, 
  Star, 
  Calendar,
  ChevronRight,
  TrendingUp,
  MapPin,
  Phone,
  User
} from "lucide-react";
import Link from "next/link";

function getApiUrl(path: string): string {
  const host = typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:8000"
    : "http://127.0.0.1:8000";
  return `${host}${path}`;
}

export default function DriverDashboard() {
  const [stats, setStats] = useState<any>({
    today_deliveries: 0,
    active_deliveries: 0,
    completed_deliveries: 0,
    failed_deliveries: 0,
    monthly_earnings: 0,
    pending_earnings: 0,
    rating: 5.0,
    available_balance: 0,
    pending_balance: 0
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(getApiUrl("/api/driver/dashboard"), {
        headers: { "Accept": "application/json" },
        credentials: "include"
      });
      if (res.ok) {
        const data = await res.json();
        if (data.stats) setStats(data.stats);
        if (data.recent_orders) setRecentOrders(data.recent_orders);
      }
    } catch (err) {
      console.error("Failed to load driver dashboard data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center text-sm font-bold text-gray-400">
        Loading Driver performance metrics...
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-orange-500 to-amber-600 p-6 rounded-2xl text-white shadow-lg shadow-orange-500/10">
        <div className="space-y-1">
          <h2 className="text-2xl font-black tracking-tight">Driver Control Center</h2>
          <p className="text-orange-100 text-xs font-semibold">Monitor assignments, status changes, and payout stats in real time.</p>
        </div>
        <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md">
          <Calendar className="w-4 h-4 text-orange-200" />
          <span className="text-xs font-bold">{new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Deliveries */}
        <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm flex items-center gap-4 hover:shadow-md transition-all duration-300">
          <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 flex-shrink-0">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Completed Today</span>
            <span className="text-xl font-extrabold text-gray-900 block mt-0.5">{stats.today_deliveries}</span>
          </div>
        </div>

        {/* Active Deliveries */}
        <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm flex items-center gap-4 hover:shadow-md transition-all duration-300">
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 flex-shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Active Queue</span>
            <span className="text-xl font-extrabold text-gray-900 block mt-0.5">{stats.active_deliveries}</span>
          </div>
        </div>

        {/* Monthly Earnings */}
        <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm flex items-center gap-4 hover:shadow-md transition-all duration-300">
          <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-500 flex-shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Monthly Earnings</span>
            <span className="text-xl font-extrabold text-gray-900 block mt-0.5">{stats.monthly_earnings.toFixed(2)} MAD</span>
          </div>
        </div>

        {/* Rating Score */}
        <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm flex items-center gap-4 hover:shadow-md transition-all duration-300">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 flex-shrink-0">
            <Star className="w-6 h-6 fill-current" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Driver Score</span>
            <span className="text-xl font-extrabold text-gray-900 block mt-0.5">{stats.rating.toFixed(1)} / 5.0</span>
          </div>
        </div>
      </div>

      {/* Wallet Summary */}
      <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h3 className="font-extrabold text-gray-900 text-base">Earning Balance</h3>
          <p className="text-gray-400 text-xs font-semibold">Available for transfer: Commission payout details.</p>
        </div>
        <div className="flex gap-6 items-center">
          <div className="text-right">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Available Balance</span>
            <span className="text-2xl font-black text-green-600 block">{stats.available_balance.toFixed(2)} MAD</span>
          </div>
          <div className="h-8 w-[1px] bg-gray-100"></div>
          <div className="text-right">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Pending Balance</span>
            <span className="text-xl font-extrabold text-amber-500 block">{stats.pending_balance.toFixed(2)} MAD</span>
          </div>
        </div>
      </div>

      {/* Grid Layout for Active List & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Assignments */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-gray-900">Current Assigned Deliveries</h3>
            <Link href="/driver/orders/active" className="text-xs font-bold text-orange-500 hover:text-orange-600 flex items-center gap-0.5">
              Manage Active Queue <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
            {recentOrders.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-xs font-semibold">
                No orders currently assigned to you.
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {recentOrders.map((order) => (
                  <div key={order.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50/50 transition-all duration-200">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-xs text-gray-900">{order.tracking_number}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                          order.status === 'delivered' ? 'bg-green-50 text-green-600' :
                          order.status === 'assigned' ? 'bg-blue-50 text-blue-600' :
                          order.status === 'picked_up' ? 'bg-indigo-50 text-indigo-600' :
                          'bg-amber-50 text-amber-600'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 font-semibold">
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-gray-400" />
                          {order.customer_name}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-gray-400" />
                          {order.customer_address}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 justify-between md:justify-end">
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-gray-400 block">COD AMOUNT</span>
                        <span className="text-xs font-black text-gray-900">{order.amount_cod} MAD</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-gray-400 block">FEE</span>
                        <span className="text-xs font-black text-orange-500">{order.delivery_fee || 35.00} MAD</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Marketplace Banner & Quick Links */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl text-white shadow-sm flex flex-col justify-between h-48">
            <div className="space-y-2">
              <span className="bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider w-fit block">Marketplace</span>
              <h4 className="font-extrabold text-sm tracking-tight">Available Delivery Pool</h4>
              <p className="text-gray-400 text-xs leading-relaxed font-semibold">Claim nearby unassigned shipments directly into your queue and earn commissions instantly.</p>
            </div>
            <Link href="/driver/orders/available" className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs py-2 px-4 rounded-xl text-center transition-all duration-200 block shadow-md shadow-orange-500/10 mt-4">
              Browse Available Orders
            </Link>
          </div>

          <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm space-y-4">
            <h4 className="font-extrabold text-xs text-gray-900 uppercase tracking-wider">Quick Actions</h4>
            <div className="grid grid-cols-1 gap-2">
              <Link href="/driver/wallet" className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100 text-xs font-bold text-gray-700 transition-all">
                <span>View Transaction Logs</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </Link>
              <Link href="/driver/settings" className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100 text-xs font-bold text-gray-700 transition-all">
                <span>Update Vehicle Details</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </Link>
              <Link href="/driver/support" className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100 text-xs font-bold text-gray-700 transition-all">
                <span>Report Delivery Issues</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

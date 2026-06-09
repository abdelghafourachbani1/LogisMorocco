"use client";

import React, { useState, useEffect } from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  MapPin, 
  Download, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Coins, 
  Map, 
  MoreVertical,
  AlertCircle,
  BarChart2
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from "recharts";

const datasets = {
  "7days": {
    label: "Last 7 Days",
    deliverySuccessRate: "95.6%",
    successRateTrend: "+1.8%",
    successRateTrendUp: true,
    avgDeliveryTime: "18 hours",
    deliveryTimeTrend: "-12%",
    deliveryTimeTrendUp: false,
    cancellationRate: "2.8%",
    cancellationTrend: "-0.5%",
    cancellationTrendUp: false,
    merchantCod: "15,200 MAD",
    adminCod: "280K MAD",
    codTrend: "+15%",
    codTrendUp: true,
    chartData: [
      { period: "Mon", "Incoming Orders": 12, "Deliveries": 10 },
      { period: "Tue", "Incoming Orders": 15, "Deliveries": 13 },
      { period: "Wed", "Incoming Orders": 18, "Deliveries": 15 },
      { period: "Thu", "Incoming Orders": 16, "Deliveries": 14 },
      { period: "Fri", "Incoming Orders": 20, "Deliveries": 18 },
      { period: "Sat", "Incoming Orders": 11, "Deliveries": 10 },
      { period: "Sun", "Incoming Orders": 14, "Deliveries": 12 },
    ]
  },
  "30days": {
    label: "Last 30 Days",
    deliverySuccessRate: "94.2%",
    successRateTrend: "+1.5%",
    successRateTrendUp: true,
    avgDeliveryTime: "24 hours",
    deliveryTimeTrend: "-5%",
    deliveryTimeTrendUp: false,
    cancellationRate: "3.8%",
    cancellationTrend: "-0.2%",
    cancellationTrendUp: false,
    merchantCod: "45,200 MAD",
    adminCod: "1.2M MAD",
    codTrend: "+12%",
    codTrendUp: true,
    chartData: [
      { period: "Week 1", "Incoming Orders": 65, "Deliveries": 52 },
      { period: "Week 2", "Incoming Orders": 72, "Deliveries": 58 },
      { period: "Week 3", "Incoming Orders": 80, "Deliveries": 64 },
      { period: "Week 4", "Incoming Orders": 75, "Deliveries": 61 },
    ]
  },
  "90days": {
    label: "Last 90 Days",
    deliverySuccessRate: "93.1%",
    successRateTrend: "+2.1%",
    successRateTrendUp: true,
    avgDeliveryTime: "28 hours",
    deliveryTimeTrend: "-3%",
    deliveryTimeTrendUp: false,
    cancellationRate: "4.1%",
    cancellationTrend: "+0.1%",
    cancellationTrendUp: true,
    merchantCod: "148,000 MAD",
    adminCod: "3.8M MAD",
    codTrend: "+18%",
    codTrendUp: true,
    chartData: [
      { period: "Month 1", "Incoming Orders": 210, "Deliveries": 178 },
      { period: "Month 2", "Incoming Orders": 235, "Deliveries": 192 },
      { period: "Month 3", "Incoming Orders": 260, "Deliveries": 215 },
    ]
  }
};

function getApiUrl(path: string): string {
  const host = typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:8000"
    : "http://127.0.0.1:8000";
  return `${host}${path}`;
}

export default function AnalyticsPage() {
  const [mounted, setMounted] = useState(false);
  const [userRole, setUserRole] = useState<string>("admin");
  const [timeframe, setTimeframe] = useState<"7days" | "30days" | "90days">("30days");
  const [dropdownOpen, setDropdownOpen] = useState(false);

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

  useEffect(() => {
    setMounted(true);
    fetchUserRole();
  }, []);

  const getTrendNode = (trend: string, isPositiveGood: boolean, isUp: boolean) => {
    const isGood = isPositiveGood ? isUp : !isUp;
    const colorClass = isGood ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50";
    const Icon = isUp ? TrendingUp : TrendingDown;
    return (
      <div className={`flex items-center gap-1 text-[11px] font-extrabold ${colorClass} px-2 py-0.5 rounded-full`}>
        <Icon className="w-3 h-3" />
        {trend}
      </div>
    );
  };

  const exportData = () => {
    const current = datasets[timeframe];
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Metric,Value,Trend\n";
    csvContent += `Delivery Success Rate,${current.deliverySuccessRate},${current.successRateTrend}\n`;
    csvContent += `Avg. Delivery Time,${current.avgDeliveryTime},${current.deliveryTimeTrend}\n`;
    csvContent += `Cancellation/Return Rate,${current.cancellationRate},${current.cancellationTrend}\n`;
    csvContent += `Total COD Reconciled,${userRole === "merchant" ? current.merchantCod : current.adminCod},${current.codTrend}\n\n`;
    
    csvContent += "Period,Incoming Orders,Deliveries\n";
    current.chartData.forEach(row => {
      csvContent += `"${row.period}",${row["Incoming Orders"]},${row["Deliveries"]}\n`;
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `logismorocco_analytics_${timeframe}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Top Filter & Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Reports & Analytics</h2>
          <p className="text-gray-500 text-sm font-medium mt-1">
            {userRole === "merchant" 
              ? "Monitor your store's dispatch ratios, cancellation reasons, and regional statistics."
              : "Comprehensive platform performance and logistics insights."}
          </p>
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-gray-100 shadow-sm text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Calendar className="w-4 h-4 text-gray-400" />
              {datasets[timeframe].label}
              <svg className={`w-4 h-4 text-gray-400 ml-1 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"></path></svg>
            </button>
            
            {dropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)}></div>
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  {(Object.keys(datasets) as Array<keyof typeof datasets>).map((key) => (
                    <button
                      key={key}
                      onClick={() => {
                        setTimeframe(key);
                        setDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm font-semibold transition-colors hover:bg-gray-50 ${timeframe === key ? 'text-brand-500 bg-pink-50/30' : 'text-gray-700'}`}
                    >
                      {datasets[key].label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <button 
            onClick={exportData}
            className="flex items-center gap-2 bg-[#1A1D20] hover:bg-zinc-800 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all active:scale-[0.98] cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Export Data
          </button>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1 */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 bg-pink-50 rounded-xl flex items-center justify-center text-brand-500 border border-pink-100">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            {getTrendNode(
              datasets[timeframe].successRateTrend,
              true,
              datasets[timeframe].successRateTrendUp
            )}
          </div>
          <div className="mt-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Delivery Success Rate</p>
            <p className="text-3xl font-black text-gray-900 mt-1.5">{datasets[timeframe].deliverySuccessRate}</p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 bg-pink-50 rounded-xl flex items-center justify-center text-brand-500 border border-pink-100">
              <Clock className="w-5 h-5" />
            </div>
            {getTrendNode(
              datasets[timeframe].deliveryTimeTrend,
              false,
              datasets[timeframe].deliveryTimeTrendUp
            )}
          </div>
          <div className="mt-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Avg. Delivery Time</p>
            <p className="text-3xl font-black text-gray-900 mt-1.5">{datasets[timeframe].avgDeliveryTime}</p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 bg-pink-50 rounded-xl flex items-center justify-center text-brand-500 border border-pink-100">
              <XCircle className="w-5 h-5" />
            </div>
            {getTrendNode(
              datasets[timeframe].cancellationTrend,
              false,
              datasets[timeframe].cancellationTrendUp
            )}
          </div>
          <div className="mt-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Return/Refusal Rate</p>
            <p className="text-3xl font-black text-gray-900 mt-1.5">{datasets[timeframe].cancellationRate}</p>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 bg-pink-50 rounded-xl flex items-center justify-center text-brand-500 border border-pink-100">
              <Coins className="w-5 h-5" />
            </div>
            {getTrendNode(
              datasets[timeframe].codTrend,
              true,
              datasets[timeframe].codTrendUp
            )}
          </div>
          <div className="mt-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              {userRole === "merchant" ? "Delivered COD Value" : "Total COD Reconciled"}
            </p>
            <p className="text-3xl font-black text-gray-900 mt-1.5">
              {userRole === "merchant" ? datasets[timeframe].merchantCod : datasets[timeframe].adminCod}
            </p>
          </div>
        </div>

      </div>

      {/* Main Chart Card */}
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Shipments & Deliveries volume</h3>
            <p className="text-gray-500 text-xs font-semibold mt-1">Breakdown of total incoming orders vs. successful deliveries.</p>
          </div>
          
          {/* Legend */}
          <div className="flex items-center gap-6 text-xs font-bold text-gray-600">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-brand-100"></span>
              Incoming Orders
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-brand-500"></span>
              Deliveries
            </div>
          </div>
        </div>

        {/* Chart Render */}
        <div className="h-80 w-full">
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={datasets[timeframe].chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 600 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 600 }} />
                <Tooltip 
                  cursor={{ fill: '#F9FAFB' }}
                  contentStyle={{ background: '#FFFFFF', border: '1px solid #F3F4F6', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }} 
                />
                <Bar dataKey="Incoming Orders" fill="#FFE3EE" radius={[8, 8, 0, 0]} maxBarSize={45} />
                <Bar dataKey="Deliveries" fill="#DB0087" radius={[8, 8, 0, 0]} maxBarSize={45} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full bg-gray-50 animate-pulse rounded-2xl flex items-center justify-center text-gray-400 text-sm font-semibold">
              Loading Performance Chart...
            </div>
          )}
        </div>
      </div>

      {/* Grid: Regional & Drivers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Regional Performance */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Regional Destination Breakdown</h3>
              <span className="flex items-center gap-1.5 text-xs font-bold text-brand-500">
                <Map className="w-4 h-4" />
                Active Zones
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    <th className="pb-3 font-bold">City</th>
                    <th className="pb-3 font-bold">Success Rate</th>
                    <th className="pb-3 font-bold text-right">Volume</th>
                    <th className="pb-3 font-bold text-right">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-sm font-semibold text-gray-800">
                  <tr className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 font-bold text-gray-900">Casablanca</td>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-gray-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-brand-500 h-full rounded-full" style={{ width: "96%" }}></div>
                        </div>
                        <span className="text-xs font-bold text-gray-600">96%</span>
                      </div>
                    </td>
                    <td className="py-4 text-right font-medium text-gray-500">142</td>
                    <td className="py-4 text-right font-bold text-gray-900">28,400 MAD</td>
                  </tr>
                  <tr className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 font-bold text-gray-900">Tangier</td>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-gray-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-brand-500 h-full rounded-full" style={{ width: "92%" }}></div>
                        </div>
                        <span className="text-xs font-bold text-gray-600">92%</span>
                      </div>
                    </td>
                    <td className="py-4 text-right font-medium text-gray-500">35</td>
                    <td className="py-4 text-right font-bold text-gray-900">7,000 MAD</td>
                  </tr>
                  <tr className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 font-bold text-gray-900">Marrakech</td>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-gray-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-brand-500 h-full rounded-full" style={{ width: "88%" }}></div>
                        </div>
                        <span className="text-xs font-bold text-gray-600">88%</span>
                      </div>
                    </td>
                    <td className="py-4 text-right font-medium text-gray-500">22</td>
                    <td className="py-4 text-right font-bold text-gray-900">4,400 MAD</td>
                  </tr>
                  <tr className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 font-bold text-gray-900">Rabat</td>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-gray-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-brand-500 h-full rounded-full" style={{ width: "94%" }}></div>
                        </div>
                        <span className="text-xs font-bold text-gray-600">94%</span>
                      </div>
                    </td>
                    <td className="py-4 text-right font-medium text-gray-500">27</td>
                    <td className="py-4 text-right font-bold text-gray-900">5,400 MAD</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right: Driver/Cancellation Reasons Analysis */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Cancellation Reasons</h3>
              <span className="text-gray-400">
                <BarChart2 className="w-5 h-5" />
              </span>
            </div>

            <div className="space-y-6">
              {/* Reason 1 */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-gray-700">
                  <span>Customer Unreachable / Phone Off</span>
                  <span>54% of refusals</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden mt-2">
                  <div className="bg-brand-500 h-full rounded-full" style={{ width: "54%" }}></div>
                </div>
              </div>

              {/* Reason 2 */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-gray-700">
                  <span>Customer Changed Mind / Cancelled</span>
                  <span>28% of refusals</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden mt-2">
                  <div className="bg-brand-500/80 h-full rounded-full" style={{ width: "28%" }}></div>
                </div>
              </div>

              {/* Reason 3 */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-gray-700">
                  <span>Delayed Delivery / Client Cancelled</span>
                  <span>12% of refusals</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden mt-2">
                  <div className="bg-brand-500/50 h-full rounded-full" style={{ width: "12%" }}></div>
                </div>
              </div>

              {/* Reason 4 */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-gray-700">
                  <span>Incorrect Address</span>
                  <span>6% of refusals</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden mt-2">
                  <div className="bg-brand-500/30 h-full rounded-full" style={{ width: "6%" }}></div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

      {/* Merchant list - only displayed for Admin role */}
      {userRole === "admin" && (
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Revenue by Merchant</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="pb-3 font-bold">Merchant Name</th>
                  <th className="pb-3 font-bold">Total Orders</th>
                  <th className="pb-3 font-bold">Successful Deliveries</th>
                  <th className="pb-3 font-bold">Revenue (MAD)</th>
                  <th className="pb-3 font-bold text-right">Growth %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm font-semibold text-gray-800">
                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-brand-500 font-bold text-xs">
                        BM
                      </div>
                      <span className="font-bold text-gray-900">Boulangerie Moderne</span>
                    </div>
                  </td>
                  <td className="py-4 text-gray-600 font-medium">1,240</td>
                  <td className="py-4 text-gray-600 font-medium">1,180</td>
                  <td className="py-4 font-bold text-gray-900">45,200 MAD</td>
                  <td className="py-4 text-right">
                    <div className="flex items-center justify-end gap-1 text-[11px] font-extrabold text-green-600">
                      +8.4%
                      <TrendingUp className="w-3 h-3" />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Bottom: Recent Problem Reports */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Recent Problem Reports</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                <th className="pb-3 font-bold">Tracking ID</th>
                <th className="pb-3 font-bold">Date/Time</th>
                <th className="pb-3 font-bold">Reason Code</th>
                <th className="pb-3 font-bold">Courier Agent</th>
                <th className="pb-3 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm font-semibold text-gray-800">
              <tr className="hover:bg-gray-50/50 transition-colors">
                <td className="py-4 font-bold text-gray-900">#LM-881232</td>
                <td className="py-4 text-gray-500 font-medium">Oct 28, 14:22</td>
                <td className="py-4">
                  <span className="text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-lg">
                    Client Unreachable
                  </span>
                </td>
                <td className="py-4 text-gray-900">M. Alaoui</td>
                <td className="py-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                    <span className="text-xs font-bold text-amber-500">Retrying Tomorrow</span>
                  </div>
                </td>
              </tr>
              <tr className="hover:bg-gray-50/50 transition-colors">
                <td className="py-4 font-bold text-gray-900">#LM-982312</td>
                <td className="py-4 text-gray-500 font-medium">Oct 27, 11:45</td>
                <td className="py-4">
                  <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg">
                    Incorrect Phone Number
                  </span>
                </td>
                <td className="py-4 text-gray-900">H. Moussa</td>
                <td className="py-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                    <span className="text-xs font-bold text-red-500">Returned to Hub</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

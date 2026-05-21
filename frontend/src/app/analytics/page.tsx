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
  AlertCircle
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

const chartData = [
  { day: "Mon", "Incoming Orders": 180, "Deliveries": 120 },
  { day: "Tue", "Incoming Orders": 210, "Deliveries": 140 },
  { day: "Wed", "Incoming Orders": 240, "Deliveries": 160 },
  { day: "Thu", "Incoming Orders": 220, "Deliveries": 150 },
  { day: "Fri", "Incoming Orders": 250, "Deliveries": 170 },
  { day: "Sat", "Incoming Orders": 190, "Deliveries": 130 },
  { day: "Sun", "Incoming Orders": 230, "Deliveries": 180 },
];

export default function AnalyticsPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Top Filter & Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Reports & Analytics</h2>
          <p className="text-gray-500 text-sm font-medium mt-1">
            Comprehensive platform performance and logistics insights.
          </p>
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <button className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-gray-100 shadow-sm text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
            <Calendar className="w-4 h-4 text-gray-400" />
            Last 30 Days
            <svg className="w-4 h-4 text-gray-400 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"></path></svg>
          </button>
          
          <button className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-gray-100 shadow-sm text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
            <MapPin className="w-4 h-4 text-gray-400" />
            Casablanca, Rabat, +2
            <svg className="w-4 h-4 text-gray-400 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"></path></svg>
          </button>

          <button className="flex items-center gap-2 bg-black hover:bg-zinc-800 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-colors">
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
            <div className="w-10 h-10 bg-pink-50 rounded-xl flex items-center justify-center text-brand-500">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-1 text-[11px] font-extrabold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
              <TrendingUp className="w-3 h-3" />
              +1.5%
            </div>
          </div>
          <div className="mt-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Delivery Success Rate</p>
            <p className="text-3xl font-bold text-gray-900 mt-1.5">94.2%</p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 bg-pink-50 rounded-xl flex items-center justify-center text-brand-500">
              <Clock className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-1 text-[11px] font-extrabold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
              <TrendingDown className="w-3 h-3" />
              -5%
            </div>
          </div>
          <div className="mt-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Avg. Delivery Time</p>
            <p className="text-3xl font-bold text-gray-900 mt-1.5">42 mins</p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 bg-pink-50 rounded-xl flex items-center justify-center text-brand-500">
              <XCircle className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-1 text-[11px] font-extrabold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
              <TrendingDown className="w-3 h-3" />
              -0.2%
            </div>
          </div>
          <div className="mt-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Cancellation Rate</p>
            <p className="text-3xl font-bold text-gray-900 mt-1.5">3.8%</p>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 bg-pink-50 rounded-xl flex items-center justify-center text-brand-500">
              <Coins className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-1 text-[11px] font-extrabold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
              <TrendingUp className="w-3 h-3" />
              +12%
            </div>
          </div>
          <div className="mt-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total COD Reconciled</p>
            <p className="text-3xl font-bold text-gray-900 mt-1.5">1.2M MAD</p>
          </div>
        </div>

      </div>

      {/* Main Chart Card */}
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Platform Volume & Growth</h3>
            <p className="text-gray-500 text-xs font-semibold mt-1">Daily breakdown of total incoming orders vs. successful deliveries.</p>
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
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12, fontWeight: 600 }} />
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
              <h3 className="text-lg font-bold text-gray-900">Regional Performance</h3>
              <a href="#" className="flex items-center gap-1.5 text-xs font-bold text-brand-500 hover:text-brand-600">
                <Map className="w-4 h-4" />
                View Map
              </a>
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
                    <td className="py-4 text-right font-medium text-gray-500">12,402</td>
                    <td className="py-4 text-right font-bold text-gray-900">540K MAD</td>
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
                    <td className="py-4 text-right font-medium text-gray-500">8,910</td>
                    <td className="py-4 text-right font-bold text-gray-900">312K MAD</td>
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
                    <td className="py-4 text-right font-medium text-gray-500">6,204</td>
                    <td className="py-4 text-right font-bold text-gray-900">204K MAD</td>
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
                    <td className="py-4 text-right font-medium text-gray-500">7,880</td>
                    <td className="py-4 text-right font-bold text-gray-900">288K MAD</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right: Driver Efficiency */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Driver Efficiency</h3>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Driver 1 */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-pink-100 flex-shrink-0 flex items-center justify-center text-brand-500 font-bold text-sm">
                  AK
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-gray-900 truncate">Amine Khadir (Casablanca)</p>
                    <span className="text-[10px] font-extrabold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Top 1%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500 font-semibold mt-1">
                    <span>240 deliveries</span>
                    <span>4.9/5 Rating</span>
                  </div>
                  <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden mt-2">
                    <div className="bg-brand-500 h-full rounded-full" style={{ width: "98%" }}></div>
                  </div>
                </div>
              </div>

              {/* Driver 2 */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-pink-100 flex-shrink-0 flex items-center justify-center text-brand-500 font-bold text-sm">
                  YB
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-gray-900 truncate">Younes Belhaj (Rabat)</p>
                    <span className="text-[10px] font-extrabold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Top 5%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500 font-semibold mt-1">
                    <span>218 deliveries</span>
                    <span>4.8/5 Rating</span>
                  </div>
                  <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden mt-2">
                    <div className="bg-brand-500 h-full rounded-full" style={{ width: "95%" }}></div>
                  </div>
                </div>
              </div>

              {/* Driver 3 */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-pink-100 flex-shrink-0 flex items-center justify-center text-brand-500 font-bold text-sm">
                  KT
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-gray-900 truncate">Karim Tazi (Tangier)</p>
                    <span className="text-[10px] font-extrabold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Top 5%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500 font-semibold mt-1">
                    <span>195 deliveries</span>
                    <span>4.7/5 Rating</span>
                  </div>
                  <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden mt-2">
                    <div className="bg-brand-500 h-full rounded-full" style={{ width: "92%" }}></div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

      {/* Revenue by Merchant */}
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">Revenue by Merchant</h3>
          <a href="#" className="flex items-center gap-1.5 text-xs font-bold text-brand-500 hover:text-brand-600">
            View Full Merchant Report
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </a>
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

              <tr className="hover:bg-gray-50/50 transition-colors">
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-brand-500 font-bold text-xs">
                      TE
                    </div>
                    <span className="font-bold text-gray-900">Tech Express</span>
                  </div>
                </td>
                <td className="py-4 text-gray-600 font-medium">850</td>
                <td className="py-4 text-gray-600 font-medium">792</td>
                <td className="py-4 font-bold text-gray-900">128,450 MAD</td>
                <td className="py-4 text-right">
                  <div className="flex items-center justify-end gap-1 text-[11px] font-extrabold text-green-600">
                    +12.1%
                    <TrendingUp className="w-3 h-3" />
                  </div>
                </td>
              </tr>

              <tr className="hover:bg-gray-50/50 transition-colors">
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-brand-500 font-bold text-xs">
                      MF
                    </div>
                    <span className="font-bold text-gray-900">Marjane Fashion</span>
                  </div>
                </td>
                <td className="py-4 text-gray-600 font-medium">2,100</td>
                <td className="py-4 text-gray-600 font-medium">1,940</td>
                <td className="py-4 font-bold text-gray-900">312,000 MAD</td>
                <td className="py-4 text-right">
                  <div className="flex items-center justify-end gap-1 text-[11px] font-extrabold text-red-500">
                    -2.5%
                    <TrendingDown className="w-3 h-3" />
                  </div>
                </td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>

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
                <th className="pb-3 font-bold">Driver</th>
                <th className="pb-3 font-bold">Status</th>
                <th className="pb-3 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm font-semibold text-gray-800">
              
              <tr className="hover:bg-gray-50/50 transition-colors">
                <td className="py-4 font-bold text-gray-900">#TRK-99021</td>
                <td className="py-4 text-gray-500 font-medium">Oct 24, 14:22</td>
                <td className="py-4">
                  <span className="text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-lg">
                    Client Unreachable
                  </span>
                </td>
                <td className="py-4 text-gray-900">M. Alaoui</td>
                <td className="py-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-gray-400"></span>
                    <span className="text-xs font-bold text-gray-600">Retrying Tomorrow</span>
                  </div>
                </td>
                <td className="py-4 text-right">
                  <a href="#" className="text-xs font-bold text-brand-500 hover:underline">Support</a>
                </td>
              </tr>

              <tr className="hover:bg-gray-50/50 transition-colors">
                <td className="py-4 font-bold text-gray-900">#TRK-98544</td>
                <td className="py-4 text-gray-500 font-medium">Oct 24, 13:10</td>
                <td className="py-4">
                  <span className="text-xs font-bold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-lg">
                    Refused Delivery
                  </span>
                </td>
                <td className="py-4 text-gray-900">S. Benali</td>
                <td className="py-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                    <span className="text-xs font-bold text-red-600">Returning to Hub</span>
                  </div>
                </td>
                <td className="py-4 text-right">
                  <a href="#" className="text-xs font-bold text-brand-500 hover:underline">Details</a>
                </td>
              </tr>

              <tr className="hover:bg-gray-50/50 transition-colors">
                <td className="py-4 font-bold text-gray-900">#TRK-98402</td>
                <td className="py-4 text-gray-500 font-medium">Oct 24, 11:45</td>
                <td className="py-4">
                  <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg">
                    Heavy Traffic
                  </span>
                </td>
                <td className="py-4 text-gray-900">H. Moussa</td>
                <td className="py-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-brand-500"></span>
                    <span className="text-xs font-bold text-brand-500">In Transit</span>
                  </div>
                </td>
                <td className="py-4 text-right">
                  <a href="#" className="text-xs font-bold text-brand-500 hover:underline">Track</a>
                </td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

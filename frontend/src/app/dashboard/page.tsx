"use client";

import { useState, useEffect } from "react";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: 'JAN', value: 150 },
  { name: 'FEB', value: 180 },
  { name: 'MAR', value: 340 }, // highlight
  { name: 'APR', value: 140 },
  { name: 'MAY', value: 200 },
  { name: 'JUN', value: 180 },
  { name: 'JUL', value: 150 },
  { name: 'AUG', value: 190 },
  { name: 'SEP', value: 360 }, // highlight
  { name: 'OCT', value: 220 },
  { name: 'NOV', value: 180 },
  { name: 'DEC', value: 200 },
];

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Top Filter & Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Platform Pulse</h2>
          <p className="text-gray-500 text-sm font-medium mt-1">
            Real-time logistics monitoring across Morocco.
          </p>
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <button className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-gray-100 shadow-sm text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            Last 24 Hours
          </button>
          
          <button className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            Export Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1 */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-brand-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-extrabold text-green-600">
              +12.5%
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
            </div>
          </div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Total Revenue</p>
          <h3 className="text-2xl font-black text-gray-900 tracking-tight">452,890 MAD</h3>
        </div>

        {/* KPI 2 */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-extrabold text-green-600">
              +8.2%
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
            </div>
          </div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Active Shipments</p>
          <h3 className="text-2xl font-black text-gray-900 tracking-tight">12,402</h3>
        </div>

        {/* KPI 3 */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-extrabold text-red-500">
              -2.1%
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6"></path></svg>
            </div>
          </div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Active Drivers</p>
          <h3 className="text-2xl font-black text-gray-900 tracking-tight">1,840</h3>
        </div>

        {/* KPI 4 */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-brand-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-extrabold text-green-600">
              +0.5%
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
            </div>
          </div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Avg. Delivery Time</p>
          <h3 className="text-2xl font-black text-gray-900 tracking-tight">42.5 min</h3>
        </div>

      </div>

      {/* Middle Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Revenue Performance Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-gray-900">Revenue Performance</h3>
            <div className="flex items-center gap-4 text-xs font-bold text-gray-500">
              <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full text-gray-700">
                <span className="w-2 h-2 rounded-full bg-brand-500"></span>
                Revenue
              </div>
              <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full text-gray-700">
                <span className="w-2 h-2 rounded-full bg-gray-800"></span>
                Projections
              </div>
            </div>
          </div>
          
          <div className="h-64">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} barSize={32} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#9CA3AF', fontSize: 11, fontWeight: 700 }}
                    dy={10}
                  />
                  <Tooltip 
                    cursor={{fill: '#f9fafb'}}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar 
                    dataKey="value" 
                    radius={[6, 6, 0, 0]}
                    fill="#F3F4F6"
                    activeBar={{ fill: '#DB0087' }}
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={(entry.name === 'MAR' || entry.name === 'SEP') ? '#DB0087' : '#F3F4F6'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* User Distribution */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-gray-900 mb-8">User Distribution</h3>
          
          <div className="space-y-6 flex-1">
            {/* Merchants */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-extrabold text-white bg-brand-500 px-2 py-1 rounded-full uppercase tracking-wider">Merchants</span>
                <span className="text-xs font-bold text-brand-500">6,420 (64%)</span>
              </div>
              <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-brand-500 h-full rounded-full" style={{ width: "64%" }}></div>
              </div>
            </div>

            {/* Drivers */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-extrabold text-white bg-black px-2 py-1 rounded-full uppercase tracking-wider">Drivers</span>
                <span className="text-xs font-bold text-gray-900">3,600 (36%)</span>
              </div>
              <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                <div className="bg-black h-full rounded-full" style={{ width: "36%" }}></div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-[11px] font-bold text-gray-500 mb-1">New Today</p>
              <p className="text-xl font-black text-brand-500">+124</p>
            </div>
            <div className="text-center border-l border-gray-100">
              <p className="text-[11px] font-bold text-gray-500 mb-1">Pending Auth</p>
              <p className="text-xl font-black text-gray-900">48</p>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Map / Regional Activity */}
        <div className="bg-[#111] rounded-3xl p-6 text-white relative overflow-hidden min-h-[360px] flex flex-col justify-end shadow-sm">
          {/* Decorative map dots to simulate the design */}
          <div className="absolute inset-0 opacity-40" style={{
            backgroundImage: 'radial-gradient(circle at 50% 50%, #ffffff 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}></div>
          
          <div className="absolute top-6 left-6 z-10">
            <span className="bg-brand-500 text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md">
              Live Feed
            </span>
          </div>

          <div className="absolute top-6 right-6 z-10">
            <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path></svg>
            </button>
          </div>

          <div className="relative z-10">
            <h3 className="text-lg font-bold text-white mb-1">Regional Activity</h3>
            <p className="text-gray-400 text-sm font-medium mb-6">Casablanca (Main Hub)</p>
            
            <div className="flex gap-4">
              <div className="bg-white/10 backdrop-blur-sm px-4 py-3 rounded-xl border border-white/10 flex-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Outbound</p>
                <p className="text-xl font-bold text-white">4,120</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-4 py-3 rounded-xl border border-white/10 flex-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Inbound</p>
                <p className="text-xl font-bold text-white">2,890</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Order Dispatch */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative">
          
          {/* Floating Action Button (FAB) */}
          <button className="absolute -right-3 top-1/2 -translate-y-1/2 w-14 h-14 bg-brand-500 hover:bg-brand-600 rounded-full text-white shadow-lg shadow-brand-500/20 flex items-center justify-center transition-transform hover:scale-105 z-10">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
          </button>

          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Recent Order Dispatch</h3>
            <a href="#" className="text-xs font-bold text-brand-500 hover:text-brand-600">
              View All Shipments
            </a>
          </div>

          <div className="overflow-x-auto pr-6">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="pb-3">Tracking ID</th>
                  <th className="pb-3">Merchant</th>
                  <th className="pb-3">Destination</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs font-semibold text-gray-800">
                
                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 font-bold text-gray-900">#LM-9283-CAS</td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-600">MJ</div>
                      <span className="truncate max-w-[100px]">Marrakech Jewelry</span>
                    </div>
                  </td>
                  <td className="py-4 text-gray-600">Casablanca, Maarif</td>
                  <td className="py-4">
                    <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full uppercase tracking-wider">In Transit</span>
                  </td>
                  <td className="py-4 font-bold text-gray-900 text-right">2,450 MAD</td>
                </tr>

                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 font-bold text-gray-900">#LM-8120-RAB</td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-600">TS</div>
                      <span className="truncate max-w-[100px]">Tech Store Rabat</span>
                    </div>
                  </td>
                  <td className="py-4 text-gray-600">Rabat, Agdal</td>
                  <td className="py-4">
                    <span className="text-[10px] font-bold text-brand-500 bg-pink-50 px-2 py-0.5 rounded-full uppercase tracking-wider">Pending</span>
                  </td>
                  <td className="py-4 font-bold text-gray-900 text-right">12,800 MAD</td>
                </tr>

                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 font-bold text-gray-900">#LM-7741-TNG</td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-600">AF</div>
                      <span className="truncate max-w-[100px]">Atlas Fashion</span>
                    </div>
                  </td>
                  <td className="py-4 text-gray-600">Tangier, Marina</td>
                  <td className="py-4">
                    <span className="text-[10px] font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full uppercase tracking-wider">Delivered</span>
                  </td>
                  <td className="py-4 font-bold text-gray-900 text-right">850 MAD</td>
                </tr>

                <tr className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 font-bold text-gray-900">#LM-6632-FES</td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-600">SC</div>
                      <span className="truncate max-w-[100px]">Sahara Coffee Co.</span>
                    </div>
                  </td>
                  <td className="py-4 text-gray-600">Fes, Medina</td>
                  <td className="py-4">
                    <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full uppercase tracking-wider">Delayed</span>
                  </td>
                  <td className="py-4 font-bold text-gray-900 text-right">420 MAD</td>
                </tr>

              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}

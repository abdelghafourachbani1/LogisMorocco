"use client";

import { useState } from "react";
import { UserCheck, UserX, Star, Shield, Search, Filter, AlertCircle, CheckCircle, MapPin, Truck } from "lucide-react";

interface Driver {
  id: number;
  name: string;
  phone: string;
  avatar: string;
  vehicle: string;
  vehicleType: "Motorcycle" | "Van" | "Truck";
  region: string;
  rating: number;
  cashOnHand: number;
  status: "Online" | "Offline" | "Pending" | "Suspended";
  joinedDate: string;
}

const initialDrivers: Driver[] = [
  { id: 1, name: "Youssef Alaoui", phone: "+212 661-234567", avatar: "YA", vehicle: "Dacia Dokker (45612-A-7)", vehicleType: "Van", region: "Casablanca", rating: 4.9, cashOnHand: 2450, status: "Online", joinedDate: "Jan 12, 2025" },
  { id: 2, name: "Amine El Amrani", phone: "+212 662-345678", avatar: "AE", vehicle: "Yamaha T-Max (1289-B-15)", vehicleType: "Motorcycle", region: "Rabat", rating: 4.8, cashOnHand: 920, status: "Online", joinedDate: "Feb 05, 2025" },
  { id: 3, name: "Tariq Bensouda", phone: "+212 663-456789", avatar: "TB", vehicle: "Renault Kangoo (98765-D-6)", vehicleType: "Van", region: "Tangier", rating: 4.7, cashOnHand: 0, status: "Pending", joinedDate: "May 18, 2026" },
  { id: 4, name: "Khadija Mansouri", phone: "+212 664-567890", avatar: "KM", vehicle: "Peugeot Partner (34125-F-8)", vehicleType: "Van", region: "Marrakech", rating: 4.5, cashOnHand: 1540, status: "Offline", joinedDate: "Nov 20, 2024" },
  { id: 5, name: "Reda Chraibi", phone: "+212 665-678901", avatar: "RC", vehicle: "Mercedes Sprinter (5566-E-3)", vehicleType: "Truck", region: "Casablanca", rating: 4.2, cashOnHand: 5800, status: "Suspended", joinedDate: "Sep 15, 2024" },
  { id: 6, name: "Mehdi Tazi", phone: "+212 666-789012", avatar: "MT", vehicle: "Yamaha Breeze (8812-G-40)", vehicleType: "Motorcycle", region: "Fes", rating: 5.0, cashOnHand: 110, status: "Online", joinedDate: "Apr 29, 2026" },
];

export default function Drivers() {
  const [drivers, setDrivers] = useState<Driver[]>(initialDrivers);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const handleApprove = (id: number) => {
    setDrivers(drivers.map(d => d.id === id ? { ...d, status: "Offline" } : d));
  };

  const handleSuspend = (id: number) => {
    setDrivers(drivers.map(d => {
      if (d.id === id) {
        return { ...d, status: d.status === "Suspended" ? "Offline" : "Suspended" };
      }
      return d;
    }));
  };

  const filteredDrivers = drivers.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.phone.includes(search);
    const matchesStatus = statusFilter === "All" || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Driver Management</h2>
          <p className="text-gray-500 text-sm font-medium mt-1">
            Monitor courier status, verifications, cash collections, and performance ratings.
          </p>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Drivers</span>
            <h3 className="text-2xl font-black text-gray-900 mt-1">{drivers.length}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
            <Truck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active & Online</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <h3 className="text-2xl font-black text-gray-900">{drivers.filter(d => d.status === "Online").length}</h3>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pending Verification</span>
            <h3 className="text-2xl font-black text-gray-900 mt-1">{drivers.filter(d => d.status === "Pending").length}</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">COD Cash Collected</span>
            <h3 className="text-2xl font-black text-brand-500 mt-1">
              {drivers.reduce((acc, curr) => acc + curr.cashOnHand, 0).toLocaleString()} MAD
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-pink-50 text-brand-500 flex items-center justify-center">
            <span className="font-extrabold text-sm">MAD</span>
          </div>
        </div>
      </div>

      {/* Filters and List */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        
        {/* Filter Bar */}
        <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search driver by name or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
            />
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            {["All", "Online", "Offline", "Pending", "Suspended"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                  statusFilter === status
                    ? "bg-brand-500 border-brand-500 text-white shadow-sm"
                    : "bg-white border-gray-100 text-gray-500 hover:bg-gray-50"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Driver List Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50/50">
                <th className="py-4 px-6">Driver Info</th>
                <th className="py-4 px-6">Region & Vehicle</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Rating</th>
                <th className="py-4 px-6">COD Balance</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs font-semibold text-gray-800">
              {filteredDrivers.map((driver) => (
                <tr key={driver.id} className="hover:bg-gray-50/30 transition-colors">
                  
                  {/* Name and Contact */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-pink-50 text-brand-500 font-black flex items-center justify-center text-sm border border-pink-100">
                        {driver.avatar}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{driver.name}</p>
                        <span className="text-[10px] text-gray-400 font-bold block">{driver.phone}</span>
                      </div>
                    </div>
                  </td>

                  {/* Region & Vehicle info */}
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-gray-700">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        <span>{driver.region}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-400 text-[10px] font-bold">
                        <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded text-[8px] uppercase">
                          {driver.vehicleType}
                        </span>
                        <span>{driver.vehicle}</span>
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                      driver.status === "Online" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                      driver.status === "Offline" ? "bg-gray-50 text-gray-500 border-gray-100" :
                      driver.status === "Pending" ? "bg-amber-50 text-amber-700 border-amber-100 animate-pulse" :
                      "bg-red-50 text-red-700 border-red-100"
                    }`}>
                      {driver.status === "Online" && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
                      {driver.status}
                    </span>
                  </td>

                  {/* Rating */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-bold text-gray-900">{driver.rating.toFixed(1)}</span>
                    </div>
                  </td>

                  {/* COD Cash Balance */}
                  <td className="py-4 px-6">
                    <p className={`font-bold ${driver.cashOnHand > 2000 ? "text-brand-500" : "text-gray-900"}`}>
                      {driver.cashOnHand.toLocaleString()} MAD
                    </p>
                    {driver.cashOnHand > 2000 && (
                      <span className="text-[9px] text-brand-400 font-extrabold uppercase tracking-wide block">Limit Reached</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {driver.status === "Pending" ? (
                        <button 
                          onClick={() => handleApprove(driver.id)}
                          className="flex items-center gap-1 bg-zinc-950 hover:bg-zinc-800 text-white px-3 py-1.5 rounded-xl text-[10px] font-bold shadow-sm transition-all"
                        >
                          <CheckCircle className="w-3 h-3" />
                          Approve
                        </button>
                      ) : (
                        <>
                          <button 
                            onClick={() => handleSuspend(driver.id)}
                            className={`p-2 rounded-xl border transition-colors ${
                              driver.status === "Suspended" 
                                ? "bg-emerald-50 border-emerald-100 text-emerald-600 hover:bg-emerald-100" 
                                : "bg-red-50 border-red-100 text-red-600 hover:bg-red-100"
                            }`}
                            title={driver.status === "Suspended" ? "Activate User" : "Suspend User"}
                          >
                            {driver.status === "Suspended" ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
                          </button>
                          <button className="px-3 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-100 text-gray-600 rounded-xl font-bold text-[10px] transition-colors">
                            Manage
                          </button>
                        </>
                      )}
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}

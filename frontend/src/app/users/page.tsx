"use client";

import { useState } from "react";
import { 
  Users, 
  CheckCircle, 
  Clock, 
  Ban, 
  Search, 
  ChevronDown, 
  Download, 
  ShieldCheck, 
  MoreVertical, 
  UserPlus, 
  FileCheck, 
  ChevronLeft, 
  ChevronRight,
  Store,
  Truck
} from "lucide-react";

interface UserItem {
  id: number;
  name: string;
  subText: string;
  avatar: string;
  avatarBg: string;
  avatarColor: string;
  isImage?: boolean;
  role: "Merchant" | "Driver";
  status: "Active" | "Verification Pending" | "Suspended";
  region: string;
  joinedDate: string;
  verified: boolean;
}

const initialUsers: UserItem[] = [
  {
    id: 1,
    name: "Atlas Market",
    subText: "contact@atlasmarket.ma",
    avatar: "AM",
    avatarBg: "bg-purple-50",
    avatarColor: "text-purple-600",
    role: "Merchant",
    status: "Active",
    region: "Casablanca, MA",
    joinedDate: "Oct 12, 2023",
    verified: true
  },
  {
    id: 2,
    name: "Youssef El Alami",
    subText: "+212 6XX-XXXXXX",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
    avatarBg: "",
    avatarColor: "",
    isImage: true,
    role: "Driver",
    status: "Verification Pending",
    region: "Marrakech, MA",
    joinedDate: "Jan 05, 2024",
    verified: false
  },
  {
    id: 3,
    name: "Desert Spices Co.",
    subText: "orders@desertspices.com",
    avatar: "DS",
    avatarBg: "bg-purple-50",
    avatarColor: "text-purple-600",
    role: "Merchant",
    status: "Active",
    region: "Agadir, MA",
    joinedDate: "Dec 20, 2023",
    verified: true
  },
  {
    id: 4,
    name: "Mehdi Benmoussa",
    subText: "+212 7XX-XXXXXX",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
    avatarBg: "",
    avatarColor: "",
    isImage: true,
    role: "Driver",
    status: "Active",
    region: "Tangier, MA",
    joinedDate: "Nov 18, 2023",
    verified: true
  }
];

export default function UserManagement() {
  const [users, setUsers] = useState<UserItem[]>(initialUsers);
  const [activeTab, setActiveTab] = useState<"All" | "Merchant" | "Driver">("All");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [regionFilter, setRegionFilter] = useState("All");

  const handleApprove = (id: number) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: "Active", verified: true } : u));
  };

  const filteredUsers = users.filter(user => {
    const matchesTab = activeTab === "All" || user.role === activeTab;
    const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase()) || 
                          user.subText.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "All" || user.status === statusFilter;
    const matchesRegion = regionFilter === "All" || user.region.includes(regionFilter);
    return matchesTab && matchesSearch && matchesStatus && matchesRegion;
  });

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      
      {/* Top Title and Tab Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-[28px] font-black text-gray-900 tracking-tight">User Management</h2>
          <p className="text-gray-500 text-sm font-semibold mt-0.5">
            Review and manage platform partners across Morocco.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="bg-white border border-gray-100 p-1 rounded-2xl flex gap-1 shadow-sm w-fit self-start md:self-auto">
          <button
            onClick={() => setActiveTab("All")}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "All" 
                ? "bg-brand-500 text-white shadow-md shadow-brand-500/10" 
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            All Users
          </button>
          <button
            onClick={() => setActiveTab("Merchant")}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "Merchant" 
                ? "bg-brand-500 text-white shadow-md shadow-brand-500/10" 
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Merchants
          </button>
          <button
            onClick={() => setActiveTab("Driver")}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "Driver" 
                ? "bg-brand-500 text-white shadow-md shadow-brand-500/10" 
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            Drivers
          </button>
        </div>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Partners */}
        <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-pink-50 flex items-center justify-center text-brand-500">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Total Partners</span>
            <h3 className="text-2xl font-black text-gray-900 leading-none mt-1">1,284</h3>
          </div>
        </div>

        {/* Active */}
        <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Active</span>
            <h3 className="text-2xl font-black text-gray-900 leading-none mt-1">1,102</h3>
          </div>
        </div>

        {/* Pending */}
        <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
            <Clock className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Pending</span>
            <h3 className="text-2xl font-black text-gray-900 leading-none mt-1">42</h3>
          </div>
        </div>

        {/* Suspended */}
        <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
            <Ban className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Suspended</span>
            <h3 className="text-2xl font-black text-gray-900 leading-none mt-1">14</h3>
          </div>
        </div>
      </div>

      {/* Main Filter & Table Area */}
      <div className="bg-white rounded-[28px] border border-gray-100 shadow-sm overflow-hidden">
        
        {/* Table Filters */}
        <div className="p-6 border-b border-gray-50 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <span className="text-xs font-bold text-gray-500">Filter by:</span>
            
            {/* Status Dropdown */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none bg-gray-50 hover:bg-gray-100/80 border border-gray-100 rounded-xl pl-4 pr-10 py-2 text-xs font-bold text-gray-700 focus:outline-none cursor-pointer"
              >
                <option value="All">Status: All</option>
                <option value="Active">Active</option>
                <option value="Verification Pending">Pending</option>
                <option value="Suspended">Suspended</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Region Dropdown */}
            <div className="relative">
              <select
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
                className="appearance-none bg-gray-50 hover:bg-gray-100/80 border border-gray-100 rounded-xl pl-4 pr-10 py-2 text-xs font-bold text-gray-700 focus:outline-none cursor-pointer"
              >
                <option value="All">Region: All</option>
                <option value="Casablanca">Casablanca</option>
                <option value="Marrakech">Marrakech</option>
                <option value="Agadir">Agadir</option>
                <option value="Tangier">Tangier</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Export Action */}
          <button className="flex items-center gap-2 hover:bg-gray-50 px-4 py-2 rounded-xl text-xs font-bold text-gray-600 border border-gray-100 self-end sm:self-auto transition-colors">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        {/* User Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50/40">
                <th className="py-4 px-6">User / Organization</th>
                <th className="py-4 px-6">Role</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Region</th>
                <th className="py-4 px-6">Joined</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs font-bold text-gray-700">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/30 transition-colors">
                  
                  {/* User Details */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      {user.isImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img 
                          src={user.avatar} 
                          alt={user.name} 
                          className="w-10 h-10 rounded-full object-cover border border-gray-100" 
                        />
                      ) : (
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm border border-purple-100/50 ${user.avatarBg} ${user.avatarColor}`}>
                          {user.avatar}
                        </div>
                      )}
                      <div>
                        <p className="font-extrabold text-gray-900 text-sm">{user.name}</p>
                        <span className="text-[10px] text-gray-400 font-bold block mt-0.5">{user.subText}</span>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-1.5 text-gray-500 font-semibold">
                      {user.role === "Merchant" ? (
                        <Store className="w-4 h-4 text-gray-400" />
                      ) : (
                        <Truck className="w-4 h-4 text-gray-400" />
                      )}
                      <span>{user.role}</span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-4 px-6">
                    {user.status === "Verification Pending" ? (
                      <div className="inline-flex flex-col">
                        <span className="bg-pink-50 text-brand-500 px-2 py-0.5 rounded text-[9px] font-extrabold uppercase text-center leading-tight">
                          Verification
                        </span>
                        <span className="bg-pink-50 text-brand-500 px-2 py-0.5 rounded text-[9px] font-extrabold uppercase text-center leading-tight mt-0.5">
                          Pending
                        </span>
                      </div>
                    ) : (
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${
                        user.status === "Active" 
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                          : "bg-red-50 text-red-700 border-red-100"
                      }`}>
                        {user.status}
                      </span>
                    )}
                  </td>

                  {/* Region */}
                  <td className="py-4 px-6 text-gray-500 font-medium">
                    {user.region}
                  </td>

                  {/* Joined Date */}
                  <td className="py-4 px-6 text-gray-400 font-bold">
                    {user.joinedDate}
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-3.5">
                      {user.status === "Verification Pending" ? (
                        <button 
                          onClick={() => handleApprove(user.id)}
                          className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-1.5 rounded-xl text-[10px] font-bold shadow-sm transition-all"
                        >
                          Approve
                        </button>
                      ) : (
                        user.verified && (
                          <ShieldCheck className="w-5 h-5 text-brand-500" />
                        )
                      )}
                      <button className="p-1 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-gray-900 transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination footer */}
        <div className="p-6 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs font-semibold text-gray-400">Showing 1 to 4 of 1,284 entries</span>
          
          <div className="flex items-center gap-1.5">
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
              32
            </button>
            <button className="p-2 border border-gray-100 rounded-xl hover:bg-gray-50 text-gray-400 hover:text-gray-900 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Footer Dual Cards Block */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Left block - Partner Onboarding */}
        <div className="lg:col-span-3 bg-pink-50/30 border border-dashed border-pink-200 rounded-[28px] p-6 flex flex-col justify-between min-h-[180px] relative overflow-hidden">
          <div className="space-y-2 max-w-[70%]">
            <h4 className="text-[18px] font-black text-brand-500">New Partner Onboarding</h4>
            <p className="text-gray-500 text-xs font-semibold leading-relaxed">
              Generate a unique registration link for high-volume corporate merchants or fleet owners.
            </p>
          </div>
          <button className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-5 py-3 rounded-xl text-xs font-bold shadow-md shadow-brand-500/10 w-fit transition-all hover:-translate-y-0.5 mt-4">
            <UserPlus className="w-4 h-4" />
            Generate Secure Link
          </button>
          <div className="absolute right-6 bottom-4 text-brand-500/10 pointer-events-none">
            <UserPlus className="w-24 h-24 stroke-[1]" />
          </div>
        </div>

        {/* Right block - Verification Queue */}
        <div className="lg:col-span-2 bg-[#1A1D20] rounded-[28px] p-6 flex flex-col justify-between min-h-[180px] text-white relative overflow-hidden">
          <div className="space-y-2 max-w-[80%]">
            <h4 className="text-[18px] font-black">Verification Queue</h4>
            <p className="text-zinc-400 text-xs font-semibold leading-relaxed">
              There are currently 42 documents awaiting manual review from the operations team.
            </p>
          </div>
          <button className="flex items-center gap-2 bg-white hover:bg-zinc-100 text-zinc-900 px-5 py-3 rounded-xl text-xs font-bold shadow-md w-fit transition-all hover:-translate-y-0.5 mt-4">
            <FileCheck className="w-4 h-4" />
            Review Documents
          </button>
          <div className="absolute right-6 bottom-4 text-zinc-800 pointer-events-none">
            <FileCheck className="w-24 h-24 stroke-[1]" />
          </div>
        </div>

      </div>

    </div>
  );
}

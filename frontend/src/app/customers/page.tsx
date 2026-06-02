"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  User, 
  TrendingUp, 
  Percent, 
  DollarSign, 
  MapPin, 
  Phone, 
  Calendar,
  X,
  ChevronRight,
  ShoppingBag
} from "lucide-react";

interface CustomerOrder {
  id: number;
  tracking_number: string;
  amount_cod: number;
  status: string;
  date: string;
}

interface Customer {
  name: string;
  phone: string;
  address: string;
  total_orders: number;
  delivered_orders: number;
  success_rate: number;
  total_spent: number;
  orders: CustomerOrder[];
}

function getApiUrl(path: string): string {
  const host = typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:8000"
    : "http://127.0.0.1:8000";
  return `${host}${path}`;
}

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"spent" | "orders" | "success">("spent");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetch(getApiUrl("/api/customers"), {
          headers: { "Accept": "application/json" },
          credentials: "include"
        });
        if (res.ok) {
          const data = await res.json();
          setCustomers(data.customers || []);
        }
      } catch (err) {
        console.error("Failed to load customer directory:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  // Filtered & Sorted Customers
  const filteredCustomers = customers
    .filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search))
    .sort((a, b) => {
      if (sortBy === "spent") return b.total_spent - a.total_spent;
      if (sortBy === "orders") return b.total_orders - a.total_orders;
      if (sortBy === "success") return b.success_rate - a.success_rate;
      return 0;
    });

  // KPI Calculations
  const totalCustomersCount = customers.length;
  const vipCount = customers.filter(c => c.total_spent >= 1000).length;
  const avgSuccessRate = customers.length > 0 
    ? Math.round(customers.reduce((acc, curr) => acc + curr.success_rate, 0) / customers.length) 
    : 100;

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Customer Profiles & CRM</h2>
        <p className="text-gray-500 text-sm font-medium mt-1">
          Monitor your customer list, view successful delivery rates, and analyze VIP customer purchase history.
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Customers */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-pink-50 text-brand-500 flex items-center justify-center border border-pink-100">
            <User className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Buyers</span>
            <h3 className="text-2xl font-black text-gray-900 mt-1">{totalCustomersCount} Profiles</h3>
          </div>
        </div>

        {/* Avg Success Rate */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center border border-emerald-100">
            <Percent className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Delivery Success Rate</span>
            <h3 className="text-2xl font-black text-gray-900 mt-1">{avgSuccessRate}%</h3>
          </div>
        </div>

        {/* High-Value VIPs */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-500 flex items-center justify-center border border-violet-100">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">VIP Customers (≥1K MAD)</span>
            <h3 className="text-2xl font-black text-gray-900 mt-1">{vipCount} VIPs</h3>
          </div>
        </div>
      </div>

      {/* Main CRM Workspace */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div className="flex gap-2">
            {[
              { id: "spent", label: "Sort by Total Spent" },
              { id: "orders", label: "Sort by Total Orders" },
              { id: "success", label: "Sort by Success Rate" }
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setSortBy(opt.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  sortBy === opt.id 
                    ? "bg-brand-500 text-white shadow-sm" 
                    : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name or phone..."
              className="bg-gray-50 border border-gray-100 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold text-gray-700 focus:outline-none focus:ring-1 focus:ring-brand-500 w-64"
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Directory Table */}
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="py-12 text-center text-gray-400 font-bold text-sm">
              Loading customer profiles database...
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="py-12 text-center text-gray-400 font-bold text-sm">
              No customer records found.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50/50">
                  <th className="py-4 px-6 rounded-l-xl">Customer Contact</th>
                  <th className="py-4 px-6">Main Destination</th>
                  <th className="py-4 px-6">Delivery Success</th>
                  <th className="py-4 px-6">Value Contributed</th>
                  <th className="py-4 px-6 text-right rounded-r-xl">Profile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs font-bold text-gray-800">
                {filteredCustomers.map((c) => (
                  <tr 
                    key={c.phone} 
                    onClick={() => setSelectedCustomer(c)}
                    className="hover:bg-gray-50/40 cursor-pointer transition-all"
                  >
                    <td className="py-4 px-6">
                      <p className="font-extrabold text-gray-900 hover:underline">{c.name}</p>
                      <span className="text-[10px] text-gray-400 font-bold block mt-0.5">{c.phone}</span>
                    </td>
                    <td className="py-4 px-6 text-gray-500 font-semibold max-w-[200px] truncate">
                      {c.address}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                          c.success_rate >= 80 ? "bg-green-50 text-green-700" :
                          c.success_rate >= 50 ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-700"
                        }`}>
                          {c.success_rate}%
                        </span>
                        <span className="text-[10px] text-gray-400 font-semibold">({c.total_orders} Orders)</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-900 font-black">
                      {c.total_spent.toLocaleString()} MAD
                    </td>
                    <td className="py-4 px-6 text-right">
                      <ChevronRight className="w-4 h-4 text-gray-300 ml-auto" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Customer Profile Side Drawer / Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-end z-50 animate-in fade-in duration-200">
          <div className="bg-white h-full w-full max-w-md shadow-2xl p-8 flex flex-col justify-between relative space-y-6 animate-in slide-in-from-right duration-300">
            <button 
              onClick={() => setSelectedCustomer(null)}
              className="absolute right-6 top-6 text-gray-400 hover:text-gray-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-6 overflow-y-auto pr-2 flex-1">
              {/* Header profile cards */}
              <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
                <div className="w-14 h-14 rounded-2xl bg-pink-50 text-brand-500 flex items-center justify-center border border-pink-100">
                  <User className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900 tracking-tight">{selectedCustomer.name}</h3>
                  <span className="text-xs font-bold text-gray-400">{selectedCustomer.phone}</span>
                </div>
              </div>

              {/* Delivery Stats Box */}
              <div className="grid grid-cols-2 gap-4 bg-gray-50/50 p-4 rounded-2xl border border-gray-100/50">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Success Ratio</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-black text-gray-900">{selectedCustomer.success_rate}%</span>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Delivered Orders</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-black text-brand-500">{selectedCustomer.delivered_orders}</span>
                    <span className="text-[10px] text-gray-400 font-bold">/ {selectedCustomer.total_orders} total</span>
                  </div>
                </div>
              </div>

              {/* Detail fields */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Contact & Address Info</h4>
                <div className="space-y-3 text-xs font-semibold text-gray-700">
                  <div className="flex gap-2">
                    <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Primary Destination</span>
                      <p className="text-gray-900 font-bold mt-0.5">{selectedCustomer.address}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Phone</span>
                      <p className="text-gray-900 font-bold mt-0.5">{selectedCustomer.phone}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order history timeline list */}
              <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Shipment History</h4>
                  <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                    {selectedCustomer.orders.length} Shipments
                  </span>
                </div>
                
                <div className="space-y-3">
                  {selectedCustomer.orders.map((o) => {
                    let badge = "bg-green-50 text-green-700 border border-green-100";
                    if (o.status === "pending") badge = "bg-blue-50 text-blue-700 border border-blue-100";
                    else if (o.status === "in_transit") badge = "bg-amber-50 text-amber-700 border border-amber-100";
                    else if (o.status === "canceled" || o.status === "refused") badge = "bg-red-50 text-red-700 border border-red-100";

                    return (
                      <div key={o.id} className="flex justify-between items-center bg-white p-3.5 rounded-xl border border-gray-100 shadow-sm">
                        <div>
                          <p className="text-xs font-extrabold text-gray-900">{o.tracking_number}</p>
                          <span className="text-[10px] text-gray-400 font-semibold block mt-0.5">{o.date}</span>
                        </div>
                        <div className="text-right space-y-1">
                          <span className="text-xs font-black text-gray-900 block">{o.amount_cod.toLocaleString()} MAD</span>
                          <span className={`inline-flex px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${badge}`}>
                            {o.status}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Contribution value bottom banner */}
            <div className="bg-[#0A0D10] text-white p-5 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[9px] text-zinc-400 font-bold block uppercase tracking-wider">Customer Value Contribution</span>
                <h4 className="text-xl font-black mt-1">{selectedCustomer.total_spent.toLocaleString()} MAD</h4>
              </div>
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

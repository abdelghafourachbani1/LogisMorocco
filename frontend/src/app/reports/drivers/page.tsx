"use client";

import { useState, useEffect } from "react";
import { 
  FileText, 
  Download, 
  Search, 
  Truck, 
  Star,
  CheckCircle,
  MapPin
} from "lucide-react";

interface Driver {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  balance: number;
  joined: string;
  status: string;
}

function getApiUrl(path: string): string {
  const host = typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:8000"
    : "http://127.0.0.1:8000";
  return `${host}${path}`;
}

export default function DriversReport() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchDrivers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(getApiUrl("/api/finance"), {
        headers: { "Accept": "application/json" },
        credentials: "include"
      });
      if (res.ok) {
        const data = await res.json();
        setDrivers(data.drivers || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const filteredDrivers = drivers.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleExport = () => {
    const headers = "Driver Name,Email,Joined Date,Held Cash (MAD)\n";
    const rows = filteredDrivers.map(d => 
      `"${d.name}","${d.email}","${d.joined}",${d.balance}`
    ).join("\n");
    
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `drivers_performance_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="bg-pink-50 text-brand-500 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full">
            Platform Reports
          </span>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight mt-1">Drivers Audit Report</h2>
          <p className="text-xs font-semibold text-gray-500">Analyze courier performance dispatches and held Cash-on-Delivery funds.</p>
        </div>

        <button
          onClick={handleExport}
          className="bg-[#1A1D20] hover:bg-zinc-800 text-white rounded-xl px-4 py-2.5 text-xs font-bold transition-all flex items-center gap-2"
        >
          <Download className="w-4 h-4" /> Export Report (CSV)
        </button>
      </div>

      {/* Filters Card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 flex items-center justify-between shadow-sm">
        <div className="w-full max-w-md space-y-1.5">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Search Courier</label>
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search driver by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-gray-50/50 pl-9 pr-4 py-2.5 rounded-xl text-xs border border-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-800 font-medium w-full"
            />
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-[28px] border border-gray-100 p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <th className="pb-3 font-black">Driver Partner</th>
                <th className="pb-3 font-black">Email</th>
                <th className="pb-3 font-black">Dispatched Deliveries</th>
                <th className="pb-3 font-black">Success Rate</th>
                <th className="pb-3 font-black">Held COD Cash Balance</th>
                <th className="pb-3 font-black">Registry Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs font-semibold text-gray-700">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400 font-bold">
                    Analyzing courier metrics...
                  </td>
                </tr>
              ) : filteredDrivers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400 font-bold">
                    No drivers registered on platform.
                  </td>
                </tr>
              ) : (
                filteredDrivers.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50/40 transition-all">
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center font-extrabold text-[10px]">
                          {d.name.slice(0, 2).toUpperCase()}
                        </div>
                        <span className="text-gray-900 font-extrabold">{d.name}</span>
                      </div>
                    </td>
                    <td className="py-4 text-gray-500">{d.email}</td>
                    <td className="py-4 text-gray-900 font-bold">24 dispatches</td>
                    <td className="py-4">
                      <span className="text-emerald-600 font-extrabold flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" /> 4.9 (96%)
                      </span>
                    </td>
                    <td className="py-4">
                      <span className="text-amber-600 font-black">{d.balance.toLocaleString()} MAD</span>
                    </td>
                    <td className="py-4 text-gray-400 text-[10px] font-bold">
                      {d.joined}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

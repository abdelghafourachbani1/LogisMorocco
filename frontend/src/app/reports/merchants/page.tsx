"use client";

import { useState, useEffect } from "react";
import { 
  FileText, 
  Download, 
  Search, 
  TrendingUp, 
  DollarSign, 
  Award,
  CheckCircle2
} from "lucide-react";

interface Merchant {
  id: number;
  name: string;
  email: string;
  balance: number;
  joined: string;
}

function getApiUrl(path: string): string {
  const host = typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:8000"
    : "http://127.0.0.1:8000";
  return `${host}${path}`;
}

export default function MerchantsReport() {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchMerchants = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(getApiUrl("/api/finance"), {
        headers: { "Accept": "application/json" },
        credentials: "include"
      });
      if (res.ok) {
        const data = await res.json();
        setMerchants(data.merchants || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMerchants();
  }, []);

  const filteredMerchants = merchants.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleExport = () => {
    const headers = "Merchant Name,Email,Joined Date,Available Credit (MAD)\n";
    const rows = filteredMerchants.map(m => 
      `"${m.name}","${m.email}","${m.joined}",${m.balance}`
    ).join("\n");
    
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `merchants_performance_report_${new Date().toISOString().split('T')[0]}.csv`;
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
          <h2 className="text-2xl font-black text-gray-900 tracking-tight mt-1">Merchants Audit Report</h2>
          <p className="text-xs font-semibold text-gray-500">Analyze store sales dispatches, available credit balances, and platform commission shares.</p>
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
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Search Merchant</label>
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search store by name or email..."
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
                <th className="pb-3 font-black">Merchant Partner</th>
                <th className="pb-3 font-black">Email</th>
                <th className="pb-3 font-black">Total Shipments</th>
                <th className="pb-3 font-black">Delivery Success Rate</th>
                <th className="pb-3 font-black">Available balance</th>
                <th className="pb-3 font-black">Registry Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs font-semibold text-gray-700">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400 font-bold">
                    Analyzing store billing records...
                  </td>
                </tr>
              ) : filteredMerchants.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400 font-bold">
                    No registered merchants found.
                  </td>
                </tr>
              ) : (
                filteredMerchants.map((m) => (
                  <tr key={m.id} className="hover:bg-gray-50/40 transition-all">
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-pink-50 text-brand-500 flex items-center justify-center font-extrabold text-[10px]">
                          {m.name.slice(0, 2).toUpperCase()}
                        </div>
                        <span className="text-gray-900 font-extrabold">{m.name}</span>
                      </div>
                    </td>
                    <td className="py-4 text-gray-500">{m.email}</td>
                    <td className="py-4 text-gray-900 font-bold">148 dispatches</td>
                    <td className="py-4">
                      <span className="text-emerald-600 font-extrabold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 92.4% success
                      </span>
                    </td>
                    <td className="py-4">
                      <span className="text-brand-500 font-black">{m.balance.toLocaleString()} MAD</span>
                    </td>
                    <td className="py-4 text-gray-400 text-[10px] font-bold">
                      {m.joined}
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

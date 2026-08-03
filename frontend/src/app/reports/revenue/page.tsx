"use client";

import { useState, useEffect } from "react";
import { 
  FileText, 
  Calendar, 
  Filter, 
  Download, 
  Search, 
  TrendingUp, 
  DollarSign,
  ArrowUpRight,
  ArrowDownLeft
} from "lucide-react";

interface Transaction {
  id: number;
  user_name: string;
  user_role: string;
  type: string;
  amount: number;
  description: string;
  date: string;
}

function getApiUrl(path: string): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return `${process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")}${path}`;
  }
  const host = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
    ? "http://localhost:8000"
    : "";
  return `${host}${path}`;
}

export default function RevenueReport() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [typeFilter, setTypeFilter] = useState("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchRevenue = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(getApiUrl("/api/finance"), {
        headers: { "Accept": "application/json" },
        credentials: "include"
      });
      if (res.ok) {
        const data = await res.json();
        setTransactions(data.transactions || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenue();
  }, []);

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.user_name.toLowerCase().includes(search.toLowerCase()) ||
                          t.description.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "All" || t.type.toLowerCase() === typeFilter.toLowerCase();
    
    let matchesDate = true;
    if (dateFrom) {
      matchesDate = matchesDate && new Date(t.date) >= new Date(dateFrom);
    }
    if (dateTo) {
      const toDate = new Date(dateTo);
      toDate.setDate(toDate.getDate() + 1);
      matchesDate = matchesDate && new Date(t.date) <= toDate;
    }
    
    return matchesSearch && matchesType && matchesDate;
  });

  const handleExport = () => {
    const headers = "Transaction ID,User,Role,Type,Description,Amount (MAD),Date\n";
    const rows = filteredTransactions.map(t => 
      `"TX-${t.id}","${t.user_name}","${t.user_role}","${t.type}","${t.description.replace(/"/g, '""')}",${t.amount},"${t.date}"`
    ).join("\n");
    
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `revenue_report_${new Date().toISOString().split('T')[0]}.csv`;
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
          <h2 className="text-2xl font-black text-gray-900 tracking-tight mt-1">Revenue Report</h2>
          <p className="text-xs font-semibold text-gray-500">Generate statements for all platform collections and payouts.</p>
        </div>

        <button
          onClick={handleExport}
          className="bg-[#1A1D20] hover:bg-zinc-800 text-white rounded-xl px-4 py-2.5 text-xs font-bold transition-all flex items-center gap-2"
        >
          <Download className="w-4 h-4" /> Export Report (CSV)
        </button>
      </div>

      {/* Filters Card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 grid grid-cols-1 sm:grid-cols-4 gap-4 shadow-sm">
        <div className="space-y-1.5 col-span-1">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Search Description</label>
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-gray-50/50 pl-9 pr-4 py-2.5 rounded-xl text-xs border border-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-800 font-medium w-full"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Transaction Type</label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-gray-50/50 border border-gray-100 px-3 py-2.5 rounded-xl text-xs font-bold text-gray-850 focus:outline-none focus:ring-2 focus:ring-brand-500 w-full"
          >
            <option value="All">All Types</option>
            <option value="Payout">Payout Settlements</option>
            <option value="Admin_Collection">Driver Collections</option>
            <option value="Commission">Platform Commissions</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Date From</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="bg-gray-50/50 border border-gray-100 px-3 py-2 rounded-xl text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-500 w-full"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Date To</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="bg-gray-50/50 border border-gray-100 px-3 py-2 rounded-xl text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-500 w-full"
          />
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-[28px] border border-gray-100 p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <th className="pb-3 font-black">Transaction ID</th>
                <th className="pb-3 font-black">User / Role</th>
                <th className="pb-3 font-black">Type</th>
                <th className="pb-3 font-black">Description</th>
                <th className="pb-3 font-black">Amount</th>
                <th className="pb-3 font-black">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs font-semibold text-gray-700">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400 font-bold">
                    Running financial calculations...
                  </td>
                </tr>
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400 font-bold">
                    No transactions matched search criteria.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50/40 transition-all">
                    <td className="py-4">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">#TX-{t.id}</span>
                    </td>
                    <td className="py-4">
                      <p className="text-gray-900 font-extrabold">{t.user_name}</p>
                      <span className="text-[9px] font-black uppercase tracking-wider bg-gray-100 text-gray-400 px-2 py-0.5 rounded-md mt-0.5 inline-block">
                        {t.user_role}
                      </span>
                    </td>
                    <td className="py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-xl text-[9px] font-black uppercase tracking-wider ${
                        t.amount > 0 
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
                          : "bg-red-50 text-red-600 border border-red-100"
                      }`}>
                        {t.amount > 0 ? <ArrowUpRight className="w-2.5 h-2.5" /> : <ArrowDownLeft className="w-2.5 h-2.5" />}
                        {t.type}
                      </span>
                    </td>
                    <td className="py-4 text-gray-500 max-w-[250px] truncate">{t.description}</td>
                    <td className="py-4">
                      <span className={`font-black ${t.amount > 0 ? "text-emerald-600" : "text-red-500"}`}>
                        {t.amount > 0 ? "+" : ""}{t.amount.toLocaleString()} MAD
                      </span>
                    </td>
                    <td className="py-4 text-gray-400 text-[10px] font-bold">
                      {t.date}
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

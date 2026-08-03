"use client";

import { useState, useEffect } from "react";
import { 
  BarChart3, 
  ArrowUpRight, 
  ArrowDownLeft, 
  DollarSign, 
  FileText,
  Calendar,
  Layers,
  Sparkles
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

export default function PlatformRevenue() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [kpis, setKpis] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);

  const fetchRevenueData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(getApiUrl("/api/finance"), {
        headers: { "Accept": "application/json" },
        credentials: "include"
      });
      if (res.ok) {
        const data = await res.json();
        setTransactions(data.transactions || []);
        setKpis(data.kpis || {});
      }
    } catch (err) {
      console.error("Failed to load finance data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenueData();
  }, []);

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="bg-pink-50 text-brand-500 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1 w-max">
            <Sparkles className="w-3 h-3" /> System Health
          </span>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight mt-1">Platform Revenue</h2>
          <p className="text-xs font-semibold text-gray-500">Overview of platform commissions, delivery earnings, and overall finances.</p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: "Commission Balance Held", value: `${kpis.total_merchant_balance?.toLocaleString() || 0} MAD`, icon: DollarSign, color: "text-brand-500 bg-pink-50" },
          { label: "Cash Held by Fleet", value: `${kpis.total_held_by_drivers?.toLocaleString() || 0} MAD`, icon: BarChart3, color: "text-amber-500 bg-amber-50" },
          { label: "Total Settled Payouts", value: `${kpis.total_payouts_made?.toLocaleString() || 0} MAD`, icon: Layers, color: "text-emerald-500 bg-emerald-50" },
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-gray-100 p-6 flex items-center justify-between shadow-sm">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">{kpi.label}</span>
              <p className="text-xl font-black text-gray-950">{kpi.value}</p>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${kpi.color}`}>
              <kpi.icon className="w-5 h-5" />
            </div>
          </div>
        ))}
      </div>

      {/* Platform Transactions Ledger */}
      <div className="bg-white rounded-[28px] border border-gray-100 p-6 space-y-6">
        <div>
          <h4 className="text-base font-black text-gray-900 tracking-tight">System Transaction Audit Ledger</h4>
          <p className="text-xs text-gray-400 font-semibold">Real-time log of the latest 30 transactions executed across the system.</p>
        </div>

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
                    Loading ledger entries...
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400 font-bold">
                    No transactions registered in system ledger.
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50/40 transition-all">
                    <td className="py-4">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">#TX-{tx.id}</span>
                    </td>
                    <td className="py-4">
                      <p className="text-gray-900 font-extrabold">{tx.user_name}</p>
                      <span className="text-[9px] font-black uppercase tracking-wider bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md mt-0.5 inline-block">
                        {tx.user_role}
                      </span>
                    </td>
                    <td className="py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-xl text-[9px] font-black uppercase tracking-wider ${
                        tx.amount > 0 
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
                          : "bg-red-50 text-red-600 border border-red-100"
                      }`}>
                        {tx.amount > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownLeft className="w-3 h-3" />}
                        {tx.type}
                      </span>
                    </td>
                    <td className="py-4 text-gray-500 max-w-[250px] truncate font-medium">{tx.description}</td>
                    <td className="py-4">
                      <span className={`font-black ${tx.amount > 0 ? "text-emerald-600" : "text-red-500"}`}>
                        {tx.amount > 0 ? "+" : ""}{tx.amount.toLocaleString()} MAD
                      </span>
                    </td>
                    <td className="py-4 text-gray-400 text-[10px] font-bold">
                      {tx.date}
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

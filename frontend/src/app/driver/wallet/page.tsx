"use client";

import { useState, useEffect } from "react";
import { 
  CreditCard, 
  DollarSign, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Activity,
  Calendar,
  CheckCircle2
} from "lucide-react";

function getApiUrl(path: string): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return `${process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")}${path}`;
  }
  const host = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
    ? "http://localhost:8000"
    : "";
  return `${host}${path}`;
}

export default function DriverWallet() {
  const [wallet, setWallet] = useState<any>({
    available_balance: 0,
    pending_balance: 0,
    transactions: []
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchWallet = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(getApiUrl("/api/driver/wallet"), {
        headers: { "Accept": "application/json" },
        credentials: "include"
      });
      if (res.ok) {
        const data = await res.json();
        setWallet(data);
      }
    } catch (err) {
      console.error("Failed to load driver wallet data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-sm font-bold text-gray-400">
        Loading Wallet & Ledger details...
      </div>
    );
  }

  // Calculate earnings summaries
  const transactions = wallet.transactions || [];
  const earningsSum = transactions
    .filter((t: any) => t.type === 'earning')
    .reduce((sum: number, t: any) => sum + parseFloat(t.amount), 0);

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">Earnings & Wallet</h2>
        <p className="text-gray-400 text-xs font-semibold mt-1">Audit active balances, pending settlement periods, and transaction logs.</p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Available Balance */}
        <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm space-y-4 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Available Balance</span>
            <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-black text-green-600">{wallet.available_balance.toFixed(2)} MAD</h3>
            <p className="text-gray-400 text-[10px] font-semibold mt-1">Cleared and eligible for direct bank transfer request.</p>
          </div>
        </div>

        {/* Pending Balance */}
        <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm space-y-4 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pending Settlement</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-500">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-black text-amber-500">{wallet.pending_balance.toFixed(2)} MAD</h3>
            <p className="text-gray-400 text-[10px] font-semibold mt-1">Held securely during confirmation or active transit phases.</p>
          </div>
        </div>

        {/* Total Earnings */}
        <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm space-y-4 hover:shadow-md transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Earnings Logged</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-black text-gray-900">{earningsSum.toFixed(2)} MAD</h3>
            <p className="text-gray-400 text-[10px] font-semibold mt-1">Cumulative sum of all delivery commissions accrued.</p>
          </div>
        </div>
      </div>

      {/* Transaction Logs */}
      <div className="space-y-4">
        <h3 className="text-base font-extrabold text-gray-900">Transaction History</h3>

        <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
          {transactions.length === 0 ? (
            <div className="p-12 text-center text-gray-400 text-xs font-semibold">
              No transactions logged for this account.
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {transactions.map((tx: any) => {
                const isEarning = tx.type === "earning";
                return (
                  <div key={tx.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        isEarning ? "bg-green-50 text-green-600" : "bg-gray-50 text-gray-500"
                      }`}>
                        {isEarning ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-xs text-gray-900 capitalize">{tx.type}</span>
                          <span className="text-[10px] font-bold text-gray-400 uppercase">Ref: TX-{tx.id * 739}</span>
                        </div>
                        <p className="text-xs text-gray-500 font-semibold">{tx.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-6">
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-gray-400 block">TRANSACTION DATE</span>
                        <span className="text-[11px] text-gray-500 font-bold block mt-0.5">{new Date(tx.created_at).toLocaleString()}</span>
                      </div>
                      <div className="text-right min-w-24">
                        <span className={`text-sm font-black ${isEarning ? "text-green-600" : "text-gray-900"}`}>
                          {isEarning ? "+" : ""}{parseFloat(tx.amount).toFixed(2)} MAD
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { 
  Calendar, 
  Download, 
  Wallet, 
  Percent, 
  AlertCircle, 
  ArrowUpRight, 
  Search, 
  SlidersHorizontal,
  CheckCircle2,
  Clock,
  ChevronRight,
  User,
  ArrowDownRight
} from "lucide-react";

interface MerchantItem {
  id: number;
  name: string;
  email: string;
  balance: number;
  joined: string;
}

interface DriverItem {
  id: number;
  name: string;
  email: string;
  balance: number;
  joined: string;
}

interface TransactionItem {
  id: number;
  user_name: string;
  user_role: string;
  type: string;
  amount: number;
  description: string;
  date: string;
}

interface FinanceKpis {
  total_held_by_drivers: number;
  total_merchant_balance: number;
  total_payouts_made: number;
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(";").shift();
    return cookieValue ? decodeURIComponent(cookieValue) : null;
  }
  return null;
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

export default function Financials() {
  const [role, setRole] = useState<string>("admin");
  const [isLoading, setIsLoading] = useState(true);

  // Admin Data
  const [merchants, setMerchants] = useState<MerchantItem[]>([]);
  const [drivers, setDrivers] = useState<DriverItem[]>([]);
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [kpis, setKpis] = useState<FinanceKpis>({
    total_held_by_drivers: 0,
    total_merchant_balance: 0,
    total_payouts_made: 0
  });

  // Merchant/Driver Data
  const [merchantStats, setMerchantStats] = useState({
    totalCollected: 0,
    totalPending: 0,
    availableBalance: 0
  });
  const [driverStats, setDriverStats] = useState({
    balance: 0,
    totalCollected: 0
  });

  // Operation forms
  const [payoutAmount, setPayoutAmount] = useState<{ [key: number]: string }>({});
  const [collectionAmount, setCollectionAmount] = useState<{ [key: number]: string }>({});
  const [actionError, setActionError] = useState("");

  const fetchFinancialData = async () => {
    setIsLoading(true);
    setActionError("");
    try {
      const res = await fetch(getApiUrl("/api/finance"), {
        headers: { "Accept": "application/json" },
        credentials: "include"
      });

      if (res.ok) {
        const data = await res.json();
        // Check structure of response to determine role
        if (data.merchants !== undefined) {
          setRole("admin");
          setMerchants(data.merchants || []);
          setDrivers(data.drivers || []);
          setTransactions(data.transactions || []);
          setKpis(data.kpis || {
            total_held_by_drivers: 0,
            total_merchant_balance: 0,
            total_payouts_made: 0
          });
        } else if (data.availableBalance !== undefined) {
          setRole("merchant");
          setMerchantStats({
            totalCollected: data.totalCollected,
            totalPending: data.totalPending,
            availableBalance: data.availableBalance
          });
          setTransactions(data.transactions || []);
        } else {
          setRole("livreur");
          setDriverStats({
            balance: data.balance,
            totalCollected: data.totalCollected
          });
          setTransactions(data.transactions || []);
        }
      }
    } catch (err) {
      console.error("Failed to load financials:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFinancialData();
  }, []);

  const handlePayout = async (merchantId: number) => {
    setActionError("");
    const amount = payoutAmount[merchantId];
    if (!amount || parseFloat(amount) <= 0) return;

    try {
      const xsrfToken = getCookie("XSRF-TOKEN");
      const res = await fetch(getApiUrl("/api/finance/payout"), {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          ...(xsrfToken ? { "X-XSRF-TOKEN": xsrfToken } : {})
        },
        body: JSON.stringify({
          merchantId,
          payoutAmount: parseFloat(amount)
        }),
        credentials: "include"
      });

      if (res.ok) {
        setPayoutAmount({ ...payoutAmount, [merchantId]: "" });
        fetchFinancialData();
      } else {
        const err = await res.json();
        setActionError(err.message || "Failed to process payout.");
      }
    } catch (err) {
      console.error(err);
      setActionError("Network error.");
    }
  };

  const handleCollection = async (livreurId: number) => {
    setActionError("");
    const amount = collectionAmount[livreurId];
    if (!amount || parseFloat(amount) <= 0) return;

    try {
      const xsrfToken = getCookie("XSRF-TOKEN");
      const res = await fetch(getApiUrl("/api/finance/collect"), {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          ...(xsrfToken ? { "X-XSRF-TOKEN": xsrfToken } : {})
        },
        body: JSON.stringify({
          livreurId,
          collectionAmount: parseFloat(amount)
        }),
        credentials: "include"
      });

      if (res.ok) {
        setCollectionAmount({ ...collectionAmount, [livreurId]: "" });
        fetchFinancialData();
      } else {
        const err = await res.json();
        setActionError(err.message || "Failed to collect cash.");
      }
    } catch (err) {
      console.error(err);
      setActionError("Network error.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center font-bold text-gray-400 text-sm">
        Loading financial logs and ledger records...
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto min-h-screen flex flex-col justify-between">
      <div className="space-y-6">
        
        {/* Top Header Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-[28px] font-black text-gray-900 tracking-tight">Financial Overview</h2>
            <p className="text-gray-500 text-sm font-semibold mt-0.5">
              Manage settlements, COD reconciliation, and platform revenue.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-[#1A1D20] hover:bg-zinc-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm">
              <Download className="w-4 h-4" />
              Export Statement
            </button>
          </div>
        </div>

        {actionError && (
          <div className="bg-red-50 text-red-600 text-xs font-bold px-4 py-3 rounded-xl border border-red-100">
            {actionError}
          </div>
        )}

        {/* --- KPI SECTION --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {role === "admin" && (
            <>
              <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex flex-col justify-between relative overflow-hidden">
                <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-brand-500">
                  <Wallet className="w-5 h-5" />
                </div>
                <div className="mt-4">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Total COD Pending</span>
                  <h3 className="text-2xl font-black text-gray-900 mt-1">{kpis.total_held_by_drivers.toLocaleString()} MAD</h3>
                </div>
              </div>

              <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex flex-col justify-between relative overflow-hidden">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500">
                  <Percent className="w-5 h-5" />
                </div>
                <div className="mt-4">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Merchant Balances</span>
                  <h3 className="text-2xl font-black text-gray-900 mt-1">{kpis.total_merchant_balance.toLocaleString()} MAD</h3>
                </div>
              </div>

              <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex flex-col justify-between relative overflow-hidden">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
                  <Wallet className="w-5 h-5" />
                </div>
                <div className="mt-4">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Payouts Settled</span>
                  <h3 className="text-2xl font-black text-gray-900 mt-1">{kpis.total_payouts_made.toLocaleString()} MAD</h3>
                </div>
              </div>

              <div className="bg-brand-500 text-white p-6 rounded-[24px] shadow-md shadow-brand-500/10 flex flex-col justify-between relative overflow-hidden">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div className="mt-4">
                  <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest block">Settlement Status</span>
                  <h3 className="text-2xl font-black mt-1">Operational</h3>
                </div>
              </div>
            </>
          )}

          {role === "merchant" && (
            <>
              <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex flex-col justify-between relative overflow-hidden">
                <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-brand-500">
                  <Wallet className="w-5 h-5" />
                </div>
                <div className="mt-4">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Available Balance</span>
                  <h3 className="text-2xl font-black text-gray-900 mt-1">{merchantStats.availableBalance.toLocaleString()} MAD</h3>
                </div>
              </div>

              <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex flex-col justify-between relative overflow-hidden">
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-500">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="mt-4">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">COD Delivered</span>
                  <h3 className="text-2xl font-black text-gray-900 mt-1">{merchantStats.totalCollected.toLocaleString()} MAD</h3>
                </div>
              </div>

              <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex flex-col justify-between relative overflow-hidden">
                <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center text-yellow-600">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="mt-4">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">COD In Transit</span>
                  <h3 className="text-2xl font-black text-gray-900 mt-1">{merchantStats.totalPending.toLocaleString()} MAD</h3>
                </div>
              </div>
            </>
          )}

          {role === "livreur" && (
            <>
              <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex flex-col justify-between relative overflow-hidden">
                <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-brand-500">
                  <Wallet className="w-5 h-5" />
                </div>
                <div className="mt-4">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Cash Held Balance</span>
                  <h3 className="text-2xl font-black text-gray-900 mt-1">{driverStats.balance.toLocaleString()} MAD</h3>
                </div>
              </div>

              <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex flex-col justify-between relative overflow-hidden">
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-500">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="mt-4">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Total COD Delivered</span>
                  <h3 className="text-2xl font-black text-gray-900 mt-1">{driverStats.totalCollected.toLocaleString()} MAD</h3>
                </div>
              </div>
            </>
          )}
        </div>

        {/* --- MAIN COLUMNS --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {role === "admin" && (
            <>
              {/* Driver Cash reconciliation list */}
              <div className="lg:col-span-2 bg-white rounded-[24px] border border-gray-100 shadow-sm p-6 space-y-4">
                <h4 className="text-base font-extrabold text-gray-900">Driver Cash Reconciliation</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        <th className="pb-3 pr-4">Driver</th>
                        <th className="pb-3 px-4">Held Balance</th>
                        <th className="pb-3 px-4 text-right">Collect Cash Operation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-xs font-bold text-gray-800">
                      {drivers.map((drv) => (
                        <tr key={drv.id} className="hover:bg-gray-50/20 transition-colors">
                          <td className="py-4 pr-4">
                            <p className="font-extrabold text-gray-900">{drv.name}</p>
                            <span className="text-[10px] text-gray-400 block mt-0.5">{drv.email}</span>
                          </td>
                          <td className="py-4 px-4 font-black text-gray-950">
                            {drv.balance.toLocaleString()} MAD
                          </td>
                          <td className="py-4 pl-4 text-right">
                            <div className="inline-flex items-center gap-2">
                              <input
                                type="number"
                                step="0.01"
                                placeholder="Amount"
                                value={collectionAmount[drv.id] || ""}
                                onChange={(e) => setCollectionAmount({ ...collectionAmount, [drv.id]: e.target.value })}
                                className="bg-gray-50 border border-gray-100 rounded-xl px-3 py-1.5 text-xs focus:outline-none w-24 text-right"
                              />
                              <button
                                onClick={() => handleCollection(drv.id)}
                                className="bg-brand-500 hover:bg-brand-600 text-white px-3 py-1.5 rounded-xl text-[10px] font-black tracking-wide"
                              >
                                Collect
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Merchant Balance Payout List */}
              <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6 space-y-4">
                <h4 className="text-base font-extrabold text-gray-900">Merchant Balances & Payouts</h4>
                <div className="space-y-4">
                  {merchants.map((mch) => (
                    <div key={mch.id} className="border border-gray-100 rounded-2xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-extrabold text-gray-900 text-xs">{mch.name}</p>
                          <span className="text-[10px] text-gray-400 block mt-0.5">{mch.email}</span>
                        </div>
                        <p className="font-black text-brand-500 text-sm">{mch.balance.toLocaleString()} MAD</p>
                      </div>
                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="number"
                          step="0.01"
                          placeholder="Amount"
                          value={payoutAmount[mch.id] || ""}
                          onChange={(e) => setPayoutAmount({ ...payoutAmount, [mch.id]: e.target.value })}
                          className="bg-gray-50 border border-gray-100 rounded-xl px-3 py-1.5 text-xs focus:outline-none w-full text-right"
                        />
                        <button
                          onClick={() => handlePayout(mch.id)}
                          className="bg-zinc-900 hover:bg-zinc-800 text-white px-4 py-1.5 rounded-xl text-[10px] font-black shrink-0"
                        >
                          Payout
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {role !== "admin" && (
            <div className="lg:col-span-3 bg-white rounded-[24px] border border-gray-100 shadow-sm p-6 space-y-5">
              <h4 className="text-base font-extrabold text-gray-900">Personal Transaction Ledger</h4>
              <div className="divide-y divide-gray-50">
                {transactions.map((log) => (
                  <div key={log.id} className="py-4 flex items-center justify-between first:pt-0 last:pb-0">
                    <div className="flex items-center gap-4">
                      {log.amount > 0 ? (
                        <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
                          <ArrowUpRight className="w-5 h-5" />
                        </div>
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-pink-50 flex items-center justify-center text-brand-500">
                          <ArrowDownRight className="w-5 h-5" />
                        </div>
                      )}
                      <div>
                        <p className="font-extrabold text-gray-900 text-sm">{log.description}</p>
                        <span className="text-[10px] text-gray-400 font-semibold block mt-0.5">
                          {log.date}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-black text-gray-900 text-sm">
                        {log.amount > 0 ? "+" : ""}{log.amount.toLocaleString()} MAD
                      </p>
                      <span className="text-[9px] font-extrabold uppercase tracking-wider text-gray-400 block mt-0.5">
                        {log.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Global audit log for admin */}
        {role === "admin" && (
          <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6 space-y-5">
            <h4 className="text-base font-extrabold text-gray-900 font-black">Global Transaction Audit Trail</h4>
            <div className="divide-y divide-gray-50">
              {transactions.map((log) => (
                <div key={log.id} className="py-4 flex items-center justify-between first:pt-0 last:pb-0">
                  <div className="flex items-center gap-4">
                    {log.amount > 0 ? (
                      <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
                        <ArrowUpRight className="w-5 h-5" />
                      </div>
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-pink-50 flex items-center justify-center text-brand-500">
                        <ArrowDownRight className="w-5 h-5" />
                      </div>
                    )}
                    <div>
                      <p className="font-extrabold text-gray-900 text-sm">{log.description}</p>
                      <span className="text-[10px] text-gray-400 font-semibold block mt-0.5">
                        {log.user_name} ({log.user_role}) • {log.date}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-black text-gray-900 text-sm">
                      {log.amount > 0 ? "+" : ""}{log.amount.toLocaleString()} MAD
                    </p>
                    <span className="text-[9px] font-extrabold uppercase tracking-wider text-gray-400 block mt-0.5">
                      {log.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 pt-6 mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-semibold text-gray-400">
        <span>© 2024 LogiMorocco Enterprise. All rights reserved.</span>
        <div className="flex items-center gap-4">
          <button className="hover:text-gray-900 transition-colors">Financial Audit Logs</button>
          <button className="hover:text-gray-900 transition-colors">Tax Compliance</button>
        </div>
      </div>

    </div>
  );
}

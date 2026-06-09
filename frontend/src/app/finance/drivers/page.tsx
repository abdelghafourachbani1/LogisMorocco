"use client";

import { useState, useEffect } from "react";
import { 
  CreditCard, 
  Search, 
  TrendingUp, 
  DollarSign, 
  User, 
  Send,
  X,
  CheckCircle,
  Truck,
  ArrowDownLeft,
  Navigation
} from "lucide-react";

interface Driver {
  id: number;
  name: string;
  email: string;
  balance: number; // held COD cash
  joined: string;
}

interface Transaction {
  id: number;
  user_name: string;
  user_role: string;
  type: string;
  amount: number;
  description: string;
  date: string;
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
  const host = typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:8000"
    : "http://127.0.0.1:8000";
  return `${host}${path}`;
}

export default function DriverWallets() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [kpis, setKpis] = useState<any>({});
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Modal / drawer state
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [collectionAmount, setCollectionAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const fetchFinanceData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(getApiUrl("/api/finance"), {
        headers: { "Accept": "application/json" },
        credentials: "include"
      });
      if (res.ok) {
        const data = await res.json();
        setDrivers(data.drivers || []);
        setAllTransactions(data.transactions || []);
        setKpis(data.kpis || {});
      }
    } catch (err) {
      console.error("Failed to load finance stats:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFinanceData();
  }, []);

  const handleRecordCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDriver) return;
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

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
          livreurId: selectedDriver.id,
          collectionAmount: Number(collectionAmount)
        }),
        credentials: "include"
      });

      const data = await res.json();

      if (res.ok) {
        setSuccessMessage("Cash collection successfully logged!");
        setCollectionAmount("");
        setSelectedDriver(prev => prev ? { ...prev, balance: data.balance } : null);
        fetchFinanceData();
      } else {
        setErrorMessage(data.message || data.error || "An error occurred while logging cash collection.");
      }
    } catch (err) {
      setErrorMessage("Network error, please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredDrivers = drivers.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="bg-pink-50 text-brand-500 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full">
            Finance Management
          </span>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight mt-1">Driver Wallets</h2>
          <p className="text-xs font-semibold text-gray-500">Audit held cash and record handovers from courier partners.</p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: "Total Held Cash (In Courier Hands)", value: `${kpis.total_held_by_drivers?.toLocaleString() || 0} MAD`, icon: DollarSign, color: "text-amber-500 bg-amber-50" },
          { label: "Online Drivers Count", value: drivers.length, icon: Truck, color: "text-emerald-500 bg-emerald-50" },
          { label: "System Payouts settled", value: `${kpis.total_payouts_made?.toLocaleString() || 0} MAD`, icon: CreditCard, color: "text-brand-500 bg-pink-50" }
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

      {/* Drivers list table */}
      <div className="bg-white rounded-[28px] border border-gray-100 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-50">
          <div>
            <h4 className="text-base font-black text-gray-900 tracking-tight">Active Courier Handover Registry</h4>
            <p className="text-xs text-gray-400 font-semibold">Review physical cash held by drivers from delivered COD shipments.</p>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search drivers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-[#F3F4F6]/50 pl-9 pr-4 py-2 rounded-xl text-xs border-none focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-800 font-medium placeholder-gray-400 w-64"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <th className="pb-3 font-black">Driver Name</th>
                <th className="pb-3 font-black">Email Address</th>
                <th className="pb-3 font-black">Held COD Cash Balance</th>
                <th className="pb-3 font-black">Joined Date</th>
                <th className="pb-3 font-black text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs font-semibold text-gray-700">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-400 font-bold">
                    Loading courier list...
                  </td>
                </tr>
              ) : filteredDrivers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-400 font-bold">
                    No drivers found matching your query.
                  </td>
                </tr>
              ) : (
                filteredDrivers.map((driver) => (
                  <tr key={driver.id} className="hover:bg-gray-50/40 transition-all">
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center font-extrabold text-[10px]">
                          {driver.name.slice(0, 2).toUpperCase()}
                        </div>
                        <span className="text-gray-900 font-extrabold">{driver.name}</span>
                      </div>
                    </td>
                    <td className="py-4 text-gray-500 font-bold">{driver.email}</td>
                    <td className="py-4">
                      <span className="text-amber-600 font-black">{driver.balance.toLocaleString()} MAD</span>
                    </td>
                    <td className="py-4 text-gray-400 font-bold">{driver.joined}</td>
                    <td className="py-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedDriver(driver);
                          setErrorMessage("");
                          setSuccessMessage("");
                        }}
                        className="text-[10px] font-black uppercase tracking-wider text-brand-500 hover:text-brand-600 border border-brand-500/20 hover:bg-brand-50/50 px-3 py-1.5 rounded-xl transition-all"
                      >
                        Record Handover
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Handover Dialog */}
      {selectedDriver && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-[28px] border border-gray-100 shadow-2xl p-8 max-w-md w-full relative space-y-6">
            <button 
              onClick={() => setSelectedDriver(null)}
              className="absolute right-6 top-6 text-gray-400 hover:text-gray-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Courier Handover</span>
              <h3 className="text-xl font-black text-gray-900 tracking-tight">{selectedDriver.name}</h3>
              <p className="text-xs font-semibold text-gray-500">Email: {selectedDriver.email}</p>
            </div>

            {/* Balances detail */}
            <div className="bg-gray-50/50 border border-gray-100 rounded-2xl p-4 flex justify-between items-center">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Physical Cash Held</span>
                <p className="text-xl font-black text-amber-600 mt-1">{selectedDriver.balance.toLocaleString()} MAD</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <ArrowDownLeft className="w-4 h-4" />
              </div>
            </div>

            {/* Record collection form */}
            <form onSubmit={handleRecordCollection} className="space-y-4 pt-3 border-t border-gray-100">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider font-extrabold text-gray-900">Record cash Collection Handover</h4>

              {errorMessage && (
                <div className="bg-red-50 text-red-600 text-[11px] font-bold px-3 py-2.5 rounded-xl border border-red-100">
                  {errorMessage}
                </div>
              )}

              {successMessage && (
                <div className="bg-emerald-50 text-emerald-600 text-[11px] font-bold px-3 py-2.5 rounded-xl border border-emerald-100/50 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4" />
                  <span>{successMessage}</span>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Collection Amount (MAD)</label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    min="1"
                    step="0.01"
                    max={selectedDriver.balance}
                    value={collectionAmount}
                    onChange={(e) => setCollectionAmount(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs focus:outline-none font-bold text-gray-900 focus:border-brand-500"
                    placeholder="e.g. 1000.00"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400">MAD</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || selectedDriver.balance <= 0}
                className="w-full bg-[#1A1D20] hover:bg-zinc-800 text-white rounded-xl py-2.5 text-xs font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                {isSubmitting ? "Confirming Collection..." : "Record Collection"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

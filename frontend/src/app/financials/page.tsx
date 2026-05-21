"use client";

import { useState } from "react";
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
  ChevronRight
} from "lucide-react";

interface DriverCodRow {
  id: string;
  driverName: string;
  driverId: string;
  avatar: string;
  collected: number;
  expected: number;
  status: "Verified" | "Discrepancy" | "Settling";
}

interface MerchantBalanceItem {
  id: string;
  name: string;
  avatar: string;
  balance: number;
  lastPayout: string;
  status: "READY" | "PENDING APPROVAL";
}

interface PaymentLogItem {
  id: string;
  title: string;
  recipient: string;
  date: string;
  amount: number;
  category: string;
  status: "Completed" | "Processing";
}

const initialDriversCod: DriverCodRow[] = [
  { id: "1", driverName: "Ahmed Yassine", driverId: "DRV-9021", avatar: "AY", collected: 4200, expected: 4200, status: "Verified" },
  { id: "2", driverName: "Karim Mansour", driverId: "DRV-4420", avatar: "KM", collected: 1850, expected: 1900, status: "Discrepancy" },
  { id: "3", driverName: "Samira Habibi", driverId: "DRV-3319", avatar: "SH", collected: 9410, expected: 9410, status: "Settling" },
];

const initialMerchantsBalances: MerchantBalanceItem[] = [
  { id: "1", name: "Moda Zen", avatar: "MZ", balance: 12400, lastPayout: "2h ago", status: "READY" },
  { id: "2", name: "TechKingdom", avatar: "TK", balance: 85200, lastPayout: "3d ago", status: "PENDING APPROVAL" },
  { id: "3", name: "HomeLife SA", avatar: "HL", balance: 4110, lastPayout: "1h ago", status: "READY" },
];

const initialPaymentLogs: PaymentLogItem[] = [
  { id: "1", title: "Gas Reimbursement - Order #LM-293", recipient: "Brahim T.", date: "Oct 24, 2023", amount: -145.00, category: "Fuel Card Adjustment", status: "Completed" },
  { id: "2", title: "Weekly Performance Bonus", recipient: "Fatima Z.", date: "Oct 24, 2023", amount: 500.00, category: "Processing", status: "Processing" },
  { id: "3", title: "Standard Delivery Commission", recipient: "Omar E.", date: "Oct 23, 2023", amount: -1200.00, category: "Direct Deposit", status: "Completed" },
];

export default function Financials() {
  const [driversCod, setDriversCod] = useState<DriverCodRow[]>(initialDriversCod);
  const [merchants, setMerchants] = useState<MerchantBalanceItem[]>(initialMerchantsBalances);
  const [logs, setLogs] = useState<PaymentLogItem[]>(initialPaymentLogs);

  const handleApproveBatch = () => {
    setMerchants(merchants.map(m => ({ ...m, status: "READY" })));
  };

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
            <button className="flex items-center gap-2 bg-white hover:bg-gray-50 border border-gray-100 px-4 py-2.5 rounded-xl text-xs font-bold text-gray-600 transition-colors shadow-sm">
              <Calendar className="w-4 h-4 text-gray-400" />
              Last 30 Days
            </button>
            <button className="flex items-center gap-2 bg-[#1A1D20] hover:bg-zinc-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm">
              <Download className="w-4 h-4" />
              Export Statement
            </button>
          </div>
        </div>

        {/* KPI Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Total COD Pending */}
          <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-brand-500">
                <Wallet className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                +12.5%
              </span>
            </div>
            <div className="mt-4">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Total COD Pending</span>
              <h3 className="text-2xl font-black text-gray-900 mt-1">428,500.00 MAD</h3>
            </div>
          </div>

          {/* Card 2: Platform Commissions */}
          <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400">
                <Percent className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                +4.2%
              </span>
            </div>
            <div className="mt-4">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Platform Commissions</span>
              <h3 className="text-2xl font-black text-gray-900 mt-1">52,140.00 MAD</h3>
            </div>
          </div>

          {/* Card 3: Merchant Balances */}
          <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500">
                <Wallet className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">
                Stable
              </span>
            </div>
            <div className="mt-4">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Merchant Balances</span>
              <h3 className="text-2xl font-black text-gray-900 mt-1">1,204,900 MAD</h3>
            </div>
          </div>

          {/* Card 4: Urgent Payouts (Pink Background Highlight) */}
          <div className="bg-brand-500 text-white p-6 rounded-[24px] shadow-md shadow-brand-500/10 flex flex-col justify-between relative overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div className="mt-4">
              <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest block">Urgent Payouts</span>
              <h3 className="text-2xl font-black mt-1">12 Requests</h3>
            </div>
          </div>
        </div>

        {/* Middle Columns (COD Reconciliation + Merchant Balances) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* COD Reconciliation Table */}
          <div className="lg:col-span-2 bg-white rounded-[24px] border border-gray-100 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-extrabold text-gray-900">COD Reconciliation</h4>
              <button className="text-xs font-bold text-brand-500 hover:text-brand-600 transition-colors">
                View All Logs
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    <th className="pb-3 pr-4">Driver / ID</th>
                    <th className="pb-3 px-4">Collected</th>
                    <th className="pb-3 px-4">Expected</th>
                    <th className="pb-3 px-4">Difference</th>
                    <th className="pb-3 pl-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-xs font-bold text-gray-800">
                  {driversCod.map((row) => (
                    <tr key={row.id} className="hover:bg-gray-50/20 transition-colors">
                      {/* Driver Info */}
                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center font-black text-xs text-gray-500">
                            {row.avatar}
                          </div>
                          <div>
                            <p className="font-extrabold text-gray-900">{row.driverName}</p>
                            <span className="text-[10px] text-gray-400 block mt-0.5">{row.driverId}</span>
                          </div>
                        </div>
                      </td>

                      {/* Collected */}
                      <td className="py-4 px-4 font-bold">
                        {row.collected.toLocaleString()} MAD
                      </td>

                      {/* Expected */}
                      <td className="py-4 px-4 font-bold">
                        {row.expected.toLocaleString()} MAD
                      </td>

                      {/* Difference */}
                      <td className="py-4 px-4">
                        <span className={row.collected - row.expected === 0 ? "text-emerald-500" : "text-red-500"}>
                          {(row.collected - row.expected).toFixed(2)}
                        </span>
                      </td>

                      {/* Status badge */}
                      <td className="py-4 pl-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-extrabold uppercase border ${
                          row.status === "Verified" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                          row.status === "Discrepancy" ? "bg-red-50 text-red-700 border-red-100" :
                          "bg-purple-50 text-brand-500 border-purple-100"
                        }`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Merchant Balances List */}
          <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6 flex flex-col justify-between gap-5">
            <div className="space-y-4">
              <h4 className="text-base font-extrabold text-gray-900">Merchant Balances</h4>

              <div className="space-y-3">
                {merchants.map((merchant) => (
                  <div key={merchant.id} className="border border-gray-100 rounded-2xl p-4 hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-zinc-950 flex items-center justify-center font-black text-xs text-white">
                          {merchant.avatar}
                        </div>
                        <div>
                          <p className="font-extrabold text-gray-900 text-xs">{merchant.name}</p>
                          <span className="text-[10px] text-gray-400 block mt-0.5">Last Payout: {merchant.lastPayout}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-gray-900 text-xs">{merchant.balance.toLocaleString()} MAD</p>
                        <span className={`text-[9px] font-extrabold block mt-0.5 ${
                          merchant.status === "READY" ? "text-emerald-500" : "text-brand-500"
                        }`}>
                          {merchant.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button 
              onClick={handleApproveBatch}
              className="w-full border border-brand-500 text-brand-500 hover:bg-pink-50/30 py-3 rounded-xl text-xs font-black transition-colors"
            >
              BATCH APPROVE PAYOUTS
            </button>
          </div>

        </div>

        {/* Commission Growth Banner */}
        <div className="bg-[#1A1D20] text-white rounded-[28px] p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-5 gap-6 items-center relative overflow-hidden">
          <div className="lg:col-span-3 space-y-4">
            <span className="bg-brand-500 text-white px-2.5 py-1 rounded-md text-[9px] font-extrabold uppercase tracking-widest w-fit block">
              Revenue Stream
            </span>
            <h3 className="text-2xl lg:text-3xl font-black tracking-tight">Commission Growth</h3>
            <p className="text-zinc-400 text-xs font-semibold leading-relaxed max-w-[90%]">
              Platform intake from successful deliveries and premium insurance fees across all active Moroccan regions.
            </p>
            
            <div className="flex items-center gap-8 pt-2">
              <div>
                <span className="text-[9px] font-extrabold text-zinc-500 uppercase tracking-widest block">Current Rate</span>
                <p className="text-xl font-black mt-1">5.5%</p>
              </div>
              <div>
                <span className="text-[9px] font-extrabold text-zinc-500 uppercase tracking-widest block">Monthly Net</span>
                <p className="text-xl font-black text-brand-500 mt-1">152K MAD</p>
              </div>
            </div>
          </div>

          {/* Chart Graphic Simulation */}
          <div className="lg:col-span-2 flex items-end justify-between h-32 gap-3 pb-2 pt-4 px-2">
            {[40, 60, 50, 80, 45, 90, 65, 110].map((height, index) => (
              <div 
                key={index} 
                className={`w-full rounded-lg transition-all duration-500 ${
                  index === 7 || index === 5 || index === 3
                    ? "bg-brand-500 shadow-md shadow-brand-500/20" 
                    : "bg-zinc-800"
                }`}
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
        </div>

        {/* Recent Driver Payment Logs */}
        <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-extrabold text-gray-900">Recent Driver Payment Logs</h4>
            <div className="flex items-center gap-3 text-gray-400">
              <button className="p-1 hover:text-gray-900 transition-colors">
                <SlidersHorizontal className="w-4.5 h-4.5" />
              </button>
              <button className="p-1 hover:text-gray-900 transition-colors">
                <Search className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>

          <div className="divide-y divide-gray-50">
            {logs.map((log) => (
              <div key={log.id} className="py-4 flex items-center justify-between first:pt-0 last:pb-0">
                <div className="flex items-center gap-4">
                  {log.status === "Completed" ? (
                    <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-pink-50 flex items-center justify-center text-brand-500">
                      <Clock className="w-5 h-5 animate-pulse" />
                    </div>
                  )}
                  <div>
                    <p className="font-extrabold text-gray-900 text-sm">{log.title}</p>
                    <span className="text-[10px] text-gray-400 font-semibold block mt-0.5">
                      To: {log.recipient} • {log.date}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-black text-gray-900 text-sm">
                    {log.amount > 0 ? "+" : ""}{log.amount.toFixed(2)} MAD
                  </p>
                  <span className={`text-[9px] font-extrabold block mt-0.5 ${
                    log.status === "Completed" ? "text-gray-400" : "text-brand-500"
                  }`}>
                    {log.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

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

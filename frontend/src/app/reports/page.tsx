"use client";

import { useState } from "react";
import { Download, FileText, Calendar, Filter, Plus, RefreshCw, Trash2, ShieldAlert } from "lucide-react";

const initialReports = [
  { id: 1, name: "Weekly Financial Settlement", type: "Financial", date: "May 18, 2026, 14:32", format: "PDF", size: "2.4 MB", author: "Admin. Driss", status: "Ready" },
  { id: 2, name: "Driver Performance Audit - Casablanca", type: "Logistics", date: "May 17, 2026, 09:15", format: "XLSX", size: "14.2 MB", author: "System Scheduler", status: "Ready" },
  { id: 3, name: "Casablanca Inbound Shipments Log", type: "Shipments", date: "May 16, 2026, 18:45", format: "CSV", size: "840 KB", author: "Admin. Driss", status: "Ready" },
  { id: 4, name: "Monthly Merchant Settlement Report", type: "Billing", date: "May 01, 2026, 00:05", format: "PDF", size: "18.1 MB", author: "System Scheduler", status: "Ready" },
  { id: 5, name: "Daily Outbound Shipments Log", type: "Shipments", date: "May 19, 2026, 11:30", format: "CSV", size: "1.1 MB", author: "Admin. Driss", status: "Generating" },
];

const schedules = [
  { id: 1, name: "Daily Operations Digest", type: "Logistics", frequency: "Daily at 23:59", recipient: "admin@logimorocco.com", format: "PDF", active: true },
  { id: 2, name: "Monthly Financial Reconciliation", type: "Financial", frequency: "1st of Month at 01:00", recipient: "finance@logimorocco.com", format: "XLSX", active: true },
];

export default function Reports() {
  const [reports, setReports] = useState(initialReports);
  const [reportType, setReportType] = useState("Financial");
  const [dateRange, setDateRange] = useState("Last 7 Days");
  const [format, setFormat] = useState("PDF");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const newReport = {
        id: Date.now(),
        name: `${reportType} Summary (${dateRange})`,
        type: reportType,
        date: new Date().toLocaleString("en-US", { month: "short", day: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: false }),
        format: format,
        size: "1.8 MB",
        author: "Admin. Driss",
        status: "Ready"
      };
      setReports([newReport, ...reports]);
      setIsGenerating(false);
    }, 1500);
  };

  const handleDelete = (id: number) => {
    setReports(reports.filter(r => r.id !== id));
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Reports & Export Actions</h2>
        <p className="text-gray-500 text-sm font-medium mt-1">
          Generate on-demand statements, configure schedules, and download logistics archives.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Report Generator Control Panel */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6 h-fit">
          <div className="flex items-center gap-2 border-b border-gray-50 pb-4">
            <Filter className="w-5 h-5 text-brand-500" />
            <h3 className="font-bold text-gray-900 text-lg">On-Demand Generator</h3>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div>
              <label className="text-xs font-extrabold text-gray-400 uppercase tracking-wider block mb-2">Report Type</label>
              <select 
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
              >
                <option value="Financial">Financial & Settlements</option>
                <option value="Logistics">Driver & Delivery Audits</option>
                <option value="Shipments">Shipment & Routing Logs</option>
                <option value="Billing">Merchant Invoices & Billing</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-extrabold text-gray-400 uppercase tracking-wider block mb-2">Date Range</label>
              <select 
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
              >
                <option value="Today">Today (Live)</option>
                <option value="Yesterday">Yesterday</option>
                <option value="Last 7 Days">Last 7 Days</option>
                <option value="Last 30 Days">Last 30 Days</option>
                <option value="Custom Range">Custom Billing Cycle</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-extrabold text-gray-400 uppercase tracking-wider block mb-2">Export Format</label>
              <div className="grid grid-cols-3 gap-2">
                {["PDF", "XLSX", "CSV"].map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setFormat(fmt)}
                    className={`py-3 rounded-xl text-xs font-bold border transition-all ${
                      format === fmt 
                        ? "bg-brand-500 border-brand-500 text-white shadow-md shadow-brand-500/10" 
                        : "bg-white border-gray-100 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full bg-black hover:bg-zinc-800 text-white rounded-xl py-3.5 text-xs font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-4"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Generate Archive
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Side: Generated Archives List & Schedules */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Archives Table */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Generated Archives</h3>
              <span className="text-xs font-bold text-gray-400">Total: {reports.length} files</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    <th className="pb-3">File Name</th>
                    <th className="pb-3">Type</th>
                    <th className="pb-3">Format</th>
                    <th className="pb-3">Generated</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-xs font-semibold text-gray-800">
                  {reports.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            report.format === "PDF" ? "bg-red-50 text-red-500" :
                            report.format === "XLSX" ? "bg-green-50 text-green-600" :
                            "bg-blue-50 text-blue-500"
                          }`}>
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{report.name}</p>
                            <span className="text-[10px] text-gray-400 font-bold">{report.size} • by {report.author}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-gray-500 font-medium">{report.type}</td>
                      <td className="py-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          report.format === "PDF" ? "bg-red-50 text-red-600 border border-red-100" :
                          report.format === "XLSX" ? "bg-green-50 text-green-700 border border-green-100" :
                          "bg-blue-50 text-blue-600 border border-blue-100"
                        }`}>
                          {report.format}
                        </span>
                      </td>
                      <td className="py-4 text-gray-500 font-medium">{report.date}</td>
                      <td className="py-4 text-right">
                        {report.status === "Generating" ? (
                          <div className="flex items-center justify-end gap-1.5 text-brand-500 font-bold">
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Building...</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-2">
                            <button className="p-2 text-gray-400 hover:text-brand-500 hover:bg-pink-50/50 rounded-lg transition-colors">
                              <Download className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDelete(report.id)}
                              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50/50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Schedule Configuration Card */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Automated Dispatch Schedules</h3>
                <p className="text-gray-400 text-xs font-semibold mt-0.5">Recurring reports delivered directly to stakeholders.</p>
              </div>
              <button className="flex items-center gap-1.5 text-xs font-bold text-brand-500 hover:text-brand-600 bg-pink-50/50 px-3 py-2 rounded-xl transition-all">
                <Plus className="w-3.5 h-3.5" />
                Add Schedule
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {schedules.map((schedule) => (
                <div key={schedule.id} className="border border-gray-50 rounded-2xl p-4 bg-gray-50/30 flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-2 h-2 rounded-full bg-brand-500"></span>
                      <h4 className="font-bold text-gray-900 text-sm">{schedule.name}</h4>
                    </div>
                    <p className="text-xs text-gray-500 font-semibold mb-1">Frequency: {schedule.frequency}</p>
                    <p className="text-xs text-gray-400 font-medium">To: {schedule.recipient}</p>
                  </div>
                  <div className="flex flex-col items-end justify-between h-full min-h-[64px]">
                    <span className="text-[9px] font-extrabold text-brand-500 bg-pink-50 px-2 py-0.5 rounded border border-pink-100">
                      {schedule.format}
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer mt-2">
                      <input type="checkbox" defaultChecked={schedule.active} className="sr-only peer" />
                      <div className="w-8 h-4 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-brand-500"></div>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

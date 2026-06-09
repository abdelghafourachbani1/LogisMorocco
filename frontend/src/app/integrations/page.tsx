"use client";

import { useState, useEffect } from "react";
import { 
  Key, 
  Search, 
  Globe, 
  CheckCircle, 
  XCircle, 
  Database, 
  Clock, 
  Layers,
  Sparkles
} from "lucide-react";

interface Integration {
  id: number;
  name: string;
  email: string;
  webhook_url: string;
  webhook_secret: string;
  status: string; // active, inactive
  sync_count: number;
  last_sync: string;
}

function getApiUrl(path: string): string {
  const host = typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:8000"
    : "http://127.0.0.1:8000";
  return `${host}${path}`;
}

export default function IntegrationsMonitoring() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  const fetchIntegrations = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(getApiUrl("/api/admin/integrations"), {
        headers: { "Accept": "application/json" },
        credentials: "include"
      });
      if (res.ok) {
        const data = await res.json();
        setIntegrations(data.integrations || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const filtered = integrations.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.webhook_url.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || item.status === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <span className="bg-pink-50 text-brand-500 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1.5 w-max">
          <Layers className="w-3.5 h-3.5" /> API Webhooks
        </span>
        <h2 className="text-2xl font-black text-gray-900 tracking-tight mt-1">Merchant Integrations</h2>
        <p className="text-xs font-semibold text-gray-500">Monitor active webhook URL endpoints, sync counts, and credentials for merchant integrations.</p>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-[28px] border border-gray-100 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-50">
          <div>
            <h4 className="text-base font-black text-gray-900 tracking-tight">Active Integrations Logs</h4>
            <p className="text-xs text-gray-400 font-semibold">Triage merchant sync counts and connection endpoints.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search webhooks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#F3F4F6]/50 pl-9 pr-4 py-2 rounded-xl text-xs border-none focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-800 font-medium placeholder-gray-400 w-64"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#F3F4F6]/50 px-3 py-2 rounded-xl text-xs font-bold text-gray-805 border-none focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Integrations Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <th className="pb-3 font-black">Merchant Store</th>
                <th className="pb-3 font-black">Webhook Endpoint URL</th>
                <th className="pb-3 font-black">Secret signature</th>
                <th className="pb-3 font-black">Status</th>
                <th className="pb-3 font-black">Sync dispatches</th>
                <th className="pb-3 font-black">Last Event Sent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs font-semibold text-gray-700">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400 font-bold">
                    Triaging active webhooks connection status...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400 font-bold">
                    No webhooks registered by store partners.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/40 transition-all">
                    <td className="py-4">
                      <p className="text-gray-900 font-extrabold">{item.name}</p>
                      <p className="text-[10px] text-gray-400 font-semibold">{item.email}</p>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-1.5 text-gray-500">
                        <Globe className="w-4 h-4 text-zinc-400 shrink-0" />
                        <span className="truncate max-w-[240px] font-mono text-[11px] font-bold text-zinc-800">{item.webhook_url}</span>
                      </div>
                    </td>
                    <td className="py-4 font-mono text-[11px] text-gray-400 font-bold">
                      {item.webhook_secret}
                    </td>
                    <td className="py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider ${
                        item.status === "active" 
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-100" 
                          : "bg-gray-50 text-gray-400 border border-gray-100"
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 text-gray-900 font-black">
                      {item.sync_count} events
                    </td>
                    <td className="py-4 text-gray-400 text-[10px] font-bold">
                      {item.last_sync}
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

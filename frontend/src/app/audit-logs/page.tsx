"use client";

import { useState, useEffect } from "react";
import { 
  ShieldAlert, 
  Search, 
  Terminal, 
  User, 
  Clock, 
  Globe, 
  Database,
  ArrowRight,
  Filter
} from "lucide-react";

interface AuditLog {
  id: number;
  user_name: string;
  user_email: string;
  event: string;
  description: string;
  ip_address: string;
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

export default function AuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [eventFilter, setEventFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(getApiUrl("/api/admin/audit-logs"), {
        headers: { "Accept": "application/json" },
        credentials: "include"
      });
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(l => {
    const matchesSearch = l.user_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          l.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          l.event.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesEvent = eventFilter === "All" || l.event.toLowerCase() === eventFilter.toLowerCase();
    return matchesSearch && matchesEvent;
  });

  // Unique list of events for filter dropdown
  const uniqueEvents = Array.from(new Set(logs.map(l => l.event)));

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <span className="bg-zinc-100 text-zinc-800 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1.5 w-max border border-zinc-200">
          <Terminal className="w-3.5 h-3.5" /> Security & Auditing
        </span>
        <h2 className="text-2xl font-black text-gray-900 tracking-tight mt-1">Audit Trail</h2>
        <p className="text-xs font-semibold text-gray-500">Chronological history of platform activities, administrative overrides, and system changes.</p>
      </div>

      {/* Main timeline listing */}
      <div className="bg-white rounded-[28px] border border-gray-100 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-50">
          <div>
            <h4 className="text-base font-black text-gray-900 tracking-tight">System Events Ledger</h4>
            <p className="text-xs text-gray-400 font-semibold">Triage administrative modifications and security logs.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search event trail..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#F3F4F6]/50 pl-9 pr-4 py-2 rounded-xl text-xs border-none focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-800 font-medium placeholder-gray-400 w-64"
              />
            </div>

            <select
              value={eventFilter}
              onChange={(e) => setEventFilter(e.target.value)}
              className="bg-[#F3F4F6]/50 px-3 py-2 rounded-xl text-xs font-bold text-gray-805 border-none focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="All">All Events</option>
              {uniqueEvents.map((evt, idx) => (
                <option key={idx} value={evt}>{evt}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Timeline items list */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="text-center py-12 text-gray-400 font-bold">
              Retransmitting secure log entries...
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="text-center py-12 text-gray-400 font-bold">
              No audit records matching query parameters.
            </div>
          ) : (
            <div className="relative border-l border-zinc-100 pl-6 ml-3 space-y-8">
              {filteredLogs.map((log) => (
                <div key={log.id} className="relative group">
                  {/* Timeline point indicator */}
                  <span className="absolute -left-[31px] top-1.5 w-2.5 h-2.5 rounded-full bg-zinc-300 group-hover:bg-zinc-800 transition-colors border-4 border-white" />

                  <div className="bg-zinc-50/40 hover:bg-zinc-50 border border-zinc-100/50 rounded-2xl p-5 space-y-3 transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black uppercase tracking-wider bg-zinc-900 text-white px-2.5 py-0.5 rounded-md">
                          {log.event}
                        </span>
                        <span className="text-[10px] text-zinc-400 font-bold">Log #{log.id}</span>
                      </div>
                      
                      <div className="flex items-center gap-3 text-[10px] text-zinc-400 font-bold">
                        <span className="flex items-center gap-1">
                          <Globe className="w-3.5 h-3.5" /> {log.ip_address}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {log.date}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs font-bold text-zinc-800 leading-relaxed">{log.description}</p>

                    <div className="flex items-center gap-1.5 border-t border-zinc-100/50 pt-2.5 text-[10px] text-zinc-500 font-bold">
                      <User className="w-3.5 h-3.5" />
                      <span>Triggered by:</span>
                      <span className="text-zinc-800 font-black">{log.user_name}</span>
                      <span className="text-zinc-400">({log.user_email})</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

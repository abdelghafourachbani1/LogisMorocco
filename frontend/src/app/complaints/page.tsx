"use client";

import { useState, useEffect } from "react";
import { 
  MessageSquare, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  AlertTriangle, 
  UserCheck, 
  ChevronRight,
  X,
  UserPlus
} from "lucide-react";

interface Complaint {
  id: number;
  user_id: number;
  user_name: string | null;
  user_email: string | null;
  user_role: string | null;
  order_id: number | null;
  tracking_number: string;
  title: string;
  description: string;
  status: string; // open, pending, resolved, closed
  priority: string; // low, medium, high
  assigned_to: string | null;
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
  if (process.env.NEXT_PUBLIC_API_URL) {
    return `${process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")}${path}`;
  }
  const host = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
    ? "http://localhost:8000"
    : "";
  return `${host}${path}`;
}

export default function SupportTickets() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  // Selected Ticket Drawer
  const [selectedTicket, setSelectedTicket] = useState<Complaint | null>(null);
  const [assignee, setAssignee] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const fetchTickets = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(getApiUrl("/api/admin/complaints"), {
        headers: { "Accept": "application/json" },
        credentials: "include"
      });
      if (res.ok) {
        const data = await res.json();
        setComplaints(data.complaints || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket) return;
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const xsrfToken = getCookie("XSRF-TOKEN");
      const res = await fetch(getApiUrl(`/api/admin/complaints/${selectedTicket.id}/assign`), {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          ...(xsrfToken ? { "X-XSRF-TOKEN": xsrfToken } : {})
        },
        body: JSON.stringify({ assigned_to: assignee }),
        credentials: "include"
      });

      if (res.ok) {
        setSuccessMessage("Ticket assigned successfully!");
        setAssignee("");
        fetchTickets();
        setSelectedTicket(prev => prev ? { ...prev, assigned_to: assignee, status: "pending" } : null);
      } else {
        const data = await res.json();
        setErrorMessage(data.message || "Failed to assign ticket.");
      }
    } catch (err) {
      setErrorMessage("Network error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResolve = async (id: number) => {
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const xsrfToken = getCookie("XSRF-TOKEN");
      const res = await fetch(getApiUrl(`/api/admin/complaints/${id}/resolve`), {
        method: "POST",
        headers: {
          "Accept": "application/json",
          ...(xsrfToken ? { "X-XSRF-TOKEN": xsrfToken } : {})
        },
        credentials: "include"
      });

      if (res.ok) {
        setSuccessMessage("Ticket resolved!");
        fetchTickets();
        setSelectedTicket(prev => prev ? { ...prev, status: "resolved" } : null);
      } else {
        const data = await res.json();
        setErrorMessage(data.message || "Failed to resolve ticket.");
      }
    } catch (err) {
      setErrorMessage("Network error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = async (id: number) => {
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const xsrfToken = getCookie("XSRF-TOKEN");
      const res = await fetch(getApiUrl(`/api/admin/complaints/${id}/close`), {
        method: "POST",
        headers: {
          "Accept": "application/json",
          ...(xsrfToken ? { "X-XSRF-TOKEN": xsrfToken } : {})
        },
        credentials: "include"
      });

      if (res.ok) {
        setSuccessMessage("Ticket closed!");
        fetchTickets();
        setSelectedTicket(prev => prev ? { ...prev, status: "closed" } : null);
      } else {
        const data = await res.json();
        setErrorMessage(data.message || "Failed to close ticket.");
      }
    } catch (err) {
      setErrorMessage("Network error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredTickets = complaints.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (c.user_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.tracking_number.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || c.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesPriority = priorityFilter === "All" || c.priority.toLowerCase() === priorityFilter.toLowerCase();
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <span className="bg-pink-50 text-brand-500 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full">
          Customer Support
        </span>
        <h2 className="text-2xl font-black text-gray-900 tracking-tight mt-1">Complaints & Disputes</h2>
        <p className="text-xs font-semibold text-gray-500">Manage, assign, and resolve customer and courier complaints.</p>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-[28px] border border-gray-100 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-50">
          <div>
            <h4 className="text-base font-black text-gray-900 tracking-tight">Active Complaint Tickets</h4>
            <p className="text-xs text-gray-400 font-semibold">Triage and address platform conflicts dynamically.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search complaints..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#F3F4F6]/50 pl-9 pr-4 py-2 rounded-xl text-xs border-none focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-800 font-medium placeholder-gray-400 w-48"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#F3F4F6]/50 px-3 py-2 rounded-xl text-xs font-bold text-gray-800 border-none focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="All">All Statuses</option>
              <option value="Open">Open</option>
              <option value="Pending">Pending</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-[#F3F4F6]/50 px-3 py-2 rounded-xl text-xs font-bold text-gray-800 border-none focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="All">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>

        {/* Complaints Grid/List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {isLoading ? (
            <div className="col-span-2 text-center py-12 text-gray-400 font-bold">
              Connecting to support desk...
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="col-span-2 text-center py-12 text-gray-400 font-bold">
              No tickets found matching filters.
            </div>
          ) : (
            filteredTickets.map((ticket) => (
              <div 
                key={ticket.id}
                onClick={() => {
                  setSelectedTicket(ticket);
                  setAssignee("");
                  setErrorMessage("");
                  setSuccessMessage("");
                }}
                className="bg-gray-50/40 hover:bg-gray-50 border border-gray-100 rounded-[22px] p-6 flex flex-col justify-between gap-4 cursor-pointer transition-all hover:shadow-sm"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-brand-500 uppercase tracking-widest">{ticket.tracking_number}</span>
                    <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider ${
                      ticket.priority === "high" 
                        ? "bg-red-50 text-red-600 border border-red-100/50" 
                        : ticket.priority === "medium"
                        ? "bg-amber-50 text-amber-600 border border-amber-100/50"
                        : "bg-gray-100 text-gray-500"
                    }`}>
                      {ticket.priority} priority
                    </span>
                  </div>

                  <h4 className="text-sm font-extrabold text-gray-900 line-clamp-1">{ticket.title}</h4>
                  <p className="text-xs font-medium text-gray-500 line-clamp-2">{ticket.description}</p>
                </div>

                <div className="flex items-center justify-between border-t border-gray-100/50 pt-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center font-bold text-[8px] text-gray-600">
                      {ticket.user_name?.slice(0, 2).toUpperCase() || "SY"}
                    </div>
                    <span className="text-[10px] text-gray-400 font-bold">{ticket.user_name || "Anonymous"}</span>
                  </div>

                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-xl text-[9px] font-black uppercase tracking-wider ${
                    ticket.status === "resolved" 
                      ? "bg-emerald-50 text-emerald-600" 
                      : ticket.status === "closed"
                      ? "bg-gray-100 text-gray-500"
                      : ticket.status === "pending"
                      ? "bg-amber-50 text-amber-600"
                      : "bg-red-50 text-red-600 animate-pulse"
                  }`}>
                    {ticket.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Ticket Details Drawer */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-[28px] border border-gray-100 shadow-2xl p-8 max-w-lg w-full relative space-y-6">
            <button 
              onClick={() => setSelectedTicket(null)}
              className="absolute right-6 top-6 text-gray-400 hover:text-gray-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-brand-500 uppercase tracking-widest">{selectedTicket.tracking_number}</span>
                <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider ${
                  selectedTicket.priority === "high" ? "bg-red-50 text-red-600" : "bg-zinc-100 text-zinc-500"
                }`}>
                  {selectedTicket.priority}
                </span>
              </div>
              <h3 className="text-lg font-black text-gray-900 tracking-tight mt-1">{selectedTicket.title}</h3>
              <p className="text-[10px] text-gray-400 font-bold">Opened on {selectedTicket.date} by {selectedTicket.user_name} ({selectedTicket.user_role})</p>
            </div>

            <div className="bg-gray-50/50 border border-gray-100 rounded-2xl p-5 text-xs font-semibold text-gray-600 leading-relaxed whitespace-pre-wrap">
              {selectedTicket.description}
            </div>

            {/* Error and Success alerts */}
            {errorMessage && (
              <div className="bg-red-50 text-red-600 text-xs font-bold px-3 py-2.5 rounded-xl border border-red-100">
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="bg-emerald-50 text-emerald-600 text-xs font-bold px-3 py-2.5 rounded-xl border border-emerald-100/50">
                {successMessage}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              {/* Assign form */}
              <form onSubmit={handleAssign} className="col-span-2 flex gap-2 border-t border-gray-100 pt-4">
                <div className="flex-1">
                  <input
                    type="text"
                    required
                    placeholder="Assign to staff member name..."
                    value={assignee}
                    onChange={(e) => setAssignee(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-xs focus:outline-none font-bold text-gray-900 focus:border-brand-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#1A1D20] hover:bg-zinc-800 text-white rounded-xl px-4 py-2 text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5" /> Assign
                </button>
              </form>

              {/* Action buttons */}
              {selectedTicket.status !== "resolved" && selectedTicket.status !== "closed" && (
                <button
                  disabled={isSubmitting}
                  onClick={() => handleResolve(selectedTicket.id)}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl py-2.5 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <CheckCircle className="w-4 h-4" /> Mark Resolved
                </button>
              )}

              {selectedTicket.status !== "closed" && (
                <button
                  disabled={isSubmitting}
                  onClick={() => handleClose(selectedTicket.id)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl py-2.5 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <XCircle className="w-4 h-4" /> Close Ticket
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { 
  Bell, 
  Send, 
  CheckCircle, 
  AlertCircle, 
  Users, 
  Megaphone, 
  MessageSquare,
  Sparkles
} from "lucide-react";

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

export default function NotificationsBroadcast() {
  const [target, setTarget] = useState("all");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const xsrfToken = getCookie("XSRF-TOKEN");
      const res = await fetch(getApiUrl("/api/admin/announcements"), {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          ...(xsrfToken ? { "X-XSRF-TOKEN": xsrfToken } : {})
        },
        body: JSON.stringify({ target, title, message }),
        credentials: "include"
      });

      const data = await res.json();

      if (res.ok) {
        setSuccessMessage(data.message || "Announcement successfully broadcasted!");
        setTitle("");
        setMessage("");
      } else {
        setErrorMessage(data.message || "Failed to dispatch system announcement.");
      }
    } catch (err) {
      setErrorMessage("Network error, please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <span className="bg-pink-50 text-brand-500 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1.5 w-max">
          <Megaphone className="w-3.5 h-3.5" /> Broadcast Center
        </span>
        <h2 className="text-2xl font-black text-gray-900 tracking-tight mt-1">Platform Announcements</h2>
        <p className="text-xs font-semibold text-gray-500">Dispatch push notifications and alerts to all registered merchants and drivers.</p>
      </div>

      {/* Main Container */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Form panel */}
        <div className="md:col-span-2 bg-white rounded-[28px] border border-gray-100 p-8 space-y-6 shadow-sm">
          <div className="border-b border-gray-55 pb-4">
            <h4 className="text-sm font-black text-gray-900 tracking-tight uppercase">Compose Announcement</h4>
            <p className="text-[10px] text-gray-400 font-bold mt-0.5">Define target audience and details of the alert broadcast.</p>
          </div>

          {errorMessage && (
            <div className="bg-red-50 text-red-600 text-xs font-bold px-4 py-3 rounded-2xl border border-red-100 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="bg-emerald-50 text-emerald-600 text-xs font-bold px-4 py-3 rounded-2xl border border-emerald-100/50 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleBroadcast} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Target Audience</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: "all", label: "Everyone", desc: "All users" },
                  { value: "merchants", label: "Merchants", desc: "Sellers only" },
                  { value: "drivers", label: "Drivers", desc: "Couriers only" }
                ].map((aud) => (
                  <button
                    key={aud.value}
                    type="button"
                    onClick={() => setTarget(aud.value)}
                    className={`border p-3 rounded-2xl text-left transition-all ${
                      target === aud.value 
                        ? "border-brand-500 bg-pink-50/20 text-gray-900" 
                        : "border-gray-100 hover:bg-gray-50 text-gray-500"
                    }`}
                  >
                    <p className="text-xs font-extrabold">{aud.label}</p>
                    <span className="text-[9px] font-medium text-gray-400 mt-0.5 block">{aud.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Alert Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Scheduled System Maintenance"
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs focus:outline-none font-bold text-gray-900 focus:border-brand-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Message Details</label>
              <textarea
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write message content here..."
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs focus:outline-none font-medium text-gray-950 focus:border-brand-500 resize-none"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#1A1D20] hover:bg-zinc-800 text-white rounded-xl px-6 py-2.5 text-xs font-bold transition-all flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5" /> {isSubmitting ? "Dispatching alert..." : "Dispatch Broadcast"}
              </button>
            </div>
          </form>
        </div>

        {/* Sidebar help / tips */}
        <div className="bg-gray-50/40 border border-gray-100 rounded-[28px] p-6 space-y-6">
          <div>
            <h4 className="text-xs font-black text-gray-900 tracking-tight uppercase">Broadcast Guidelines</h4>
            <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Important notices for dispatchers.</p>
          </div>

          <div className="space-y-4 text-xs font-medium text-gray-600 leading-relaxed">
            <div className="flex gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0 mt-1.5" />
              <p>Announcements are delivered immediately to user dashboard notification feeds.</p>
            </div>
            <div className="flex gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0 mt-1.5" />
              <p>Please double-check titles and messaging details before pressing dispatch.</p>
            </div>
            <div className="flex gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0 mt-1.5" />
              <p>Avoid excessive broadcasting to prevent user notification fatigue.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { 
  Bell, 
  CheckCheck, 
  Clock, 
  MailOpen, 
  Trash,
  ShoppingBag,
  CheckCircle2,
  XCircle,
  Truck
} from "lucide-react";
import Link from "next/link";

interface NotificationItem {
  id: string;
  type: string;
  data: {
    order_id?: number;
    tracking_number?: string;
    status?: string;
    message?: string;
  };
  read_at: string | null;
  created_at: string;
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

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchNotifications = async () => {
    try {
      const res = await fetch(getApiUrl("/api/notifications"), {
        headers: { "Accept": "application/json" },
        credentials: "include"
      });

      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unread_count || 0);
      } else {
        setErrorMsg("Failed to retrieve notifications.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Network error connecting to notification service.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAllAsRead = async () => {
    try {
      const xsrfToken = getCookie("XSRF-TOKEN");
      const res = await fetch(getApiUrl("/api/notifications/read"), {
        method: "POST",
        headers: {
          "Accept": "application/json",
          ...(xsrfToken ? { "X-XSRF-TOKEN": xsrfToken } : {})
        },
        credentials: "include"
      });

      if (res.ok) {
        fetchNotifications();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      const xsrfToken = getCookie("XSRF-TOKEN");
      const res = await fetch(getApiUrl(`/api/notifications/${id}/read`), {
        method: "POST",
        headers: {
          "Accept": "application/json",
          ...(xsrfToken ? { "X-XSRF-TOKEN": xsrfToken } : {})
        },
        credentials: "include"
      });

      if (res.ok) {
        fetchNotifications();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "cancelled":
      case "refused":
      case "returned":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "in_transit":
        return <Truck className="w-5 h-5 text-brand-500" />;
      default:
        return <ShoppingBag className="w-5 h-5 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center font-bold text-gray-400 text-sm">
        Loading real-time status notifications...
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 max-w-4xl mx-auto min-h-screen">
      
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            Notifications Center
            {unreadCount > 0 && (
              <span className="text-xs font-black text-white bg-brand-500 px-2.5 py-1 rounded-full animate-bounce">
                {unreadCount} new
              </span>
            )}
          </h2>
          <p className="text-gray-500 text-sm font-semibold">
            Track immediate updates regarding order dispatching, driver pick ups, and successful payouts.
          </p>
        </div>

        {unreadCount > 0 && (
          <button 
            onClick={handleMarkAllAsRead}
            className="flex items-center gap-2 bg-[#1A1D20] hover:bg-zinc-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer whitespace-nowrap"
          >
            <CheckCheck className="w-4 h-4" />
            Mark all as read
          </button>
        )}
      </div>

      {errorMsg && (
        <div className="bg-red-50 text-red-600 text-xs font-bold px-4 py-3 rounded-xl border border-red-100">
          {errorMsg}
        </div>
      )}

      {/* Notifications List */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
        {notifications.length === 0 ? (
          <div className="text-center py-16 text-gray-400 space-y-3">
            <Bell className="w-10 h-10 mx-auto text-gray-200" />
            <p className="text-xs font-bold">No updates or alerts found.</p>
          </div>
        ) : (
          notifications.map(item => (
            <div 
              key={item.id} 
              className={`p-5 flex items-start gap-4 transition-colors ${
                item.read_at ? "bg-white" : "bg-brand-50/10 hover:bg-brand-50/20"
              }`}
            >
              {/* Status / Activity Indicator Icon */}
              <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0 border border-gray-100">
                {getStatusIcon(item.data.status)}
              </div>

              {/* Message Details */}
              <div className="flex-1 space-y-1.5 min-w-0">
                <p className={`text-xs ${item.read_at ? "text-gray-600 font-semibold" : "text-gray-900 font-black"}`}>
                  {item.data.message || "Order status notification."}
                </p>
                
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-gray-400 font-bold">
                  {item.data.tracking_number && (
                    <span className="text-brand-500">Tracking: {item.data.tracking_number}</span>
                  )}
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(item.created_at).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Action Button: Mark Single as Read */}
              {!item.read_at && (
                <button 
                  onClick={() => handleMarkAsRead(item.id)}
                  title="Mark as read"
                  className="text-gray-400 hover:text-brand-500 transition-colors p-1.5 rounded-lg hover:bg-gray-50"
                >
                  <MailOpen className="w-4 h-4" />
                </button>
              )}
            </div>
          ))
        )}
      </div>

    </div>
  );
}

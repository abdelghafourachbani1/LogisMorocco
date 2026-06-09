"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, LogOut, ChevronDown, Shield, Settings } from "lucide-react";

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

export default function HeaderProfile() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Fetch active user details
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(getApiUrl("/api/user"), {
          method: "GET",
          headers: {
            "Accept": "application/json",
          },
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch (err) {
        console.error("Failed to fetch user context:", err);
      }
    }
    fetchUser();
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAction = async (action: "profile" | "logout" | "settings") => {
    if (action === "profile") {
      router.push("/profile");
    } else if (action === "settings") {
      router.push("/settings");
    } else if (action === "logout") {
      try {
        const xsrfToken = getCookie("XSRF-TOKEN");
        await fetch(getApiUrl("/api/logout"), {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            ...(xsrfToken ? { "X-XSRF-TOKEN": xsrfToken } : {}),
          },
          credentials: "include",
        });
      } catch (err) {
        console.error("Logout request failed:", err);
      }
      router.push("/login");
    }
    setIsOpen(false);
  };

  const roleLabels: Record<string, string> = {
    admin: "Super Admin",
    merchant: "Merchant Partner",
    livreur: "Delivery Courier",
  };

  const getRoleLabel = (role?: string) => {
    if (!role) return "Super Admin";
    return roleLabels[role.toLowerCase()] || role;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-1.5 px-3 rounded-2xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50/50 transition-all duration-200 focus:outline-none cursor-pointer group shadow-xs active:scale-[0.98]"
      >
        {/* Avatar with Status Dot */}
        <div className="relative flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-pink-500 flex items-center justify-center text-white font-extrabold text-sm shadow-sm transform transition-transform group-hover:scale-105 duration-200">
            {user ? user.name.charAt(0).toUpperCase() : "A"}
          </div>
          {/* Active status indicator */}
          <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
        </div>

        {/* Text */}
        <div className="text-left hidden sm:block">
          <p className="text-xs font-bold text-gray-900 leading-tight group-hover:text-brand-600 transition-colors">
            {user ? user.name : "Admin User"}
          </p>
          <span className="inline-flex items-center gap-1 mt-0.5 px-1.5 py-0.5 rounded-md bg-brand-50 text-brand-600 text-[8px] font-black uppercase tracking-wider">
            <Shield className="w-2.5 h-2.5" />
            {getRoleLabel(user?.role)}
          </span>
        </div>

        {/* Arrow */}
        <ChevronDown
          className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-300 group-hover:text-gray-650 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* User Profile Header in Dropdown */}
          <div className="px-4 py-2.5 border-b border-gray-50 mb-1">
            <p className="text-xs font-bold text-gray-900 truncate">{user ? user.name : "Admin User"}</p>
            <p className="text-[10px] text-gray-400 font-medium truncate mt-0.5">{user ? user.email : "admin@logismaghreb.com"}</p>
          </div>

          <button
            onClick={() => handleAction("profile")}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-brand-50 hover:text-brand-700 transition-colors text-left cursor-pointer"
          >
            <User className="w-4 h-4 text-gray-400" />
            Profile Settings
          </button>
          
          <button
            onClick={() => handleAction("settings")}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-brand-50 hover:text-brand-700 transition-colors text-left cursor-pointer"
          >
            <Settings className="w-4 h-4 text-gray-400" />
            System Settings
          </button>

          <button
            onClick={() => handleAction("logout")}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-red-650 hover:bg-red-50 hover:text-red-700 transition-colors text-left border-t border-gray-50 mt-1 pt-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Log Out
          </button>
        </div>
      )}
    </div>
  );
}

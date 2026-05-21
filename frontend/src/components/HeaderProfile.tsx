"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

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
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
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

  const handleAction = async (action: "profile" | "logout") => {
    if (action === "profile") {
      router.push("/profile");
    } else if (action === "logout") {
      try {
        const xsrfToken = getCookie("XSRF-TOKEN");
        // Call Laravel's logout endpoint
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
      // Redirect to Next.js login page
      router.push("/login");
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-1 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition focus:outline-none"
      >
        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-brand-500 to-brand-300 flex items-center justify-center text-white font-bold text-sm shadow-sm">
          {user ? user.name.charAt(0).toUpperCase() : "A"}
        </div>
        <div className="text-left hidden sm:block">
          <p className="text-sm font-semibold text-gray-900 leading-tight">{user ? user.name : "Loading..."}</p>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
            {user ? (user.role === "admin" ? "Super Administrator" : user.role) : "Super Administrator"}
          </p>
        </div>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu (Positioned to the bottom of the button) */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
          <button
            onClick={() => handleAction("profile")}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            Profile Settings
          </button>
          <button
            onClick={() => handleAction("logout")}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors border-t border-gray-50 mt-1 pt-2"
          >
            Log Out
          </button>
        </div>
      )}
    </div>
  );
}

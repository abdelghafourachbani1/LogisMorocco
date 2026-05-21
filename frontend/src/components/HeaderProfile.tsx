"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HeaderProfile() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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
        // Call Laravel's logout endpoint
        await fetch("http://localhost:8000/logout", {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
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
          A
        </div>
        <div className="text-left hidden sm:block">
          <p className="text-sm font-semibold text-gray-900 leading-tight">Admin</p>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Super Administrator</p>
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

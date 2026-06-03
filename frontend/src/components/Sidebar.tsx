"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Layout,
  ShoppingBag,
  Users,
  Truck,
  CreditCard,
  BarChart3,
  Settings,
  HelpCircle,
  Activity,
  Bell,
  FileText,
  Terminal,
  LogOut,
  User,
  Shield,
  Layers
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

export default function Sidebar() {
  const pathname = usePathname();
  const [role, setRole] = useState<string>("admin");

  useEffect(() => {
    async function fetchUser() {
      try {
        const host = typeof window !== "undefined" && window.location.hostname === "localhost"
          ? "http://localhost:8000"
          : "http://127.0.0.1:8000";
        const res = await fetch(`${host}/api/user`, {
          method: "GET",
          headers: {
            "Accept": "application/json",
          },
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setRole(data.role || "admin");
        }
      } catch (err) {
        console.error("Failed to fetch user role in sidebar:", err);
      }
    }
    fetchUser();
  }, []);

  const getLinkClass = (path: string) => {
    const isActive = pathname === path;
    return `flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
      isActive
        ? "bg-pink-50/70 text-brand-500 border-r-4 border-brand-500 shadow-sm"
        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-semibold"
    }`;
  };

  if (role === "livreur") {
    return (
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col justify-between h-screen flex-shrink-0 z-30 shadow-[4px_0_24px_rgba(0,0,0,0.01)]">
        <div className="overflow-y-auto flex-1 scrollbar-thin">
          {/* Logo */}
          <div className="h-[72px] flex items-center px-6 border-b border-gray-100 gap-3 bg-white sticky top-0 z-10">
            <div className="w-8 h-8 rounded-xl bg-orange-500 flex items-center justify-center text-white font-black text-base shadow-md shadow-orange-500/20">
              D
            </div>
            <div>
              <h1 className="font-extrabold text-gray-900 tracking-tight leading-none text-sm">LogiMorocco</h1>
              <span className="text-[9px] font-bold text-orange-500 uppercase tracking-widest leading-none mt-1 block">Driver Portal</span>
            </div>
          </div>

          {/* Navigation Menu for Driver */}
          <div className="p-4 space-y-5">
            {/* Group 1: Overview */}
            <div className="space-y-1">
              <span className="px-4 text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Overview</span>
              <Link href="/driver/dashboard" className={getLinkClass("/driver/dashboard")}>
                <Layout className="w-4 h-4" />
                Dashboard
              </Link>
            </div>

            {/* Group 2: Deliveries */}
            <div className="space-y-1">
              <span className="px-4 text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Deliveries</span>
              <Link href="/driver/orders/available" className={getLinkClass("/driver/orders/available")}>
                <Layers className="w-4 h-4" />
                Available Orders
              </Link>
              <Link href="/driver/orders/active" className={getLinkClass("/driver/orders/active")}>
                <ShoppingBag className="w-4 h-4" />
                Active Deliveries
              </Link>
              <Link href="/driver/orders/history" className={getLinkClass("/driver/orders/history")}>
                <FileText className="w-4 h-4" />
                Delivery History
              </Link>
            </div>

            {/* Group 3: Finance & Performance */}
            <div className="space-y-1">
              <span className="px-4 text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Finance & Stats</span>
              <Link href="/driver/wallet" className={getLinkClass("/driver/wallet")}>
                <CreditCard className="w-4 h-4" />
                Wallet & Earnings
              </Link>
              <Link href="/driver/performance" className={getLinkClass("/driver/performance")}>
                <BarChart3 className="w-4 h-4" />
                Performance Metrics
              </Link>
            </div>

            {/* Group 4: Support */}
            <div className="space-y-1">
              <span className="px-4 text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Support</span>
              <Link href="/driver/support" className={getLinkClass("/driver/support")}>
                <HelpCircle className="w-4 h-4" />
                Help & Support
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Sidebar: Settings */}
        <div className="p-4 border-t border-gray-50 bg-gray-50/30">
          <Link href="/driver/settings" className={getLinkClass("/driver/settings")}>
            <Settings className="w-4 h-4" />
            Driver Settings
          </Link>
        </div>
      </aside>
    );
  }

  if (role === "merchant") {
    return (
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col justify-between h-screen flex-shrink-0 z-30 shadow-[4px_0_24px_rgba(0,0,0,0.01)]">
        <div className="overflow-y-auto flex-1 scrollbar-thin">
          {/* Logo */}
          <div className="h-[72px] flex items-center px-6 border-b border-gray-100 gap-3 bg-white sticky top-0 z-10">
            <div className="w-8 h-8 rounded-xl bg-brand-500 flex items-center justify-center text-white font-black text-base shadow-md shadow-brand-500/20">
              M
            </div>
            <div>
              <h1 className="font-extrabold text-gray-900 tracking-tight leading-none text-sm">LogiMorocco</h1>
              <span className="text-[9px] font-bold text-brand-500 uppercase tracking-widest leading-none mt-1 block">Merchant Portal</span>
            </div>
          </div>

          {/* Navigation Menu for Merchant */}
          <div className="p-4 space-y-5">
            {/* Group 1: Overview */}
            <div className="space-y-1">
              <span className="px-4 text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Overview</span>
              <Link href="/dashboard" className={getLinkClass("/dashboard")}>
                <Layout className="w-4 h-4" />
                Dashboard
              </Link>
              <Link href="/notifications" className={getLinkClass("/notifications")}>
                <Bell className="w-4 h-4" />
                Notifications
              </Link>
            </div>

            {/* Group 2: Operations */}
            <div className="space-y-1">
              <span className="px-4 text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Operations</span>
              <Link href="/orders" className={getLinkClass("/orders")}>
                <ShoppingBag className="w-4 h-4" />
                Orders List
              </Link>
              <Link href="/products" className={getLinkClass("/products")}>
                <Layers className="w-4 h-4" />
                Products & Inventory
              </Link>
              <Link href="/customers" className={getLinkClass("/customers")}>
                <Users className="w-4 h-4" />
                Customer Profiles
              </Link>
              <Link href="/drivers" className={getLinkClass("/drivers")}>
                <Truck className="w-4 h-4" />
                Drivers Registry
              </Link>
            </div>

            {/* Group 3: Financial & Intelligence */}
            <div className="space-y-1">
              <span className="px-4 text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Finance</span>
              <Link href="/financials" className={getLinkClass("/financials")}>
                <CreditCard className="w-4 h-4" />
                Wallet & Payouts
              </Link>
              <Link href="/analytics" className={getLinkClass("/analytics")}>
                <BarChart3 className="w-4 h-4" />
                Reports & Analytics
              </Link>
            </div>

            {/* Group 4: Systems */}
            <div className="space-y-1">
              <span className="px-4 text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Systems</span>
              <Link href="/integrations" className={getLinkClass("/integrations")}>
                <Terminal className="w-4 h-4" />
                Developer APIs
              </Link>
              <Link href="/team" className={getLinkClass("/team")}>
                <Shield className="w-4 h-4" />
                Team Settings
              </Link>
              <Link href="/support" className={getLinkClass("/support")}>
                <HelpCircle className="w-4 h-4" />
                Support Center
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Sidebar: Settings */}
        <div className="p-4 border-t border-gray-50 bg-gray-50/30">
          <Link href="/profile" className={getLinkClass("/profile")}>
            <Settings className="w-4 h-4" />
            Store Settings
          </Link>
        </div>
      </aside>
    );
  }

  // Fallback: Admin Sidebar View
  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col justify-between h-screen flex-shrink-0 z-30 shadow-[4px_0_24px_rgba(0,0,0,0.01)]">
      <div>
        {/* Logo */}
        <div className="h-[72px] flex items-center px-6 border-b border-gray-100 gap-3">
          <div className="w-8 h-8 rounded-xl bg-brand-500 flex items-center justify-center text-white font-black text-base">
            L
          </div>
          <div>
            <h1 className="font-extrabold text-gray-900 tracking-tight leading-none text-sm">LogiMorocco</h1>
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-1 block">Admin Console</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-1.5">
          <Link href="/dashboard" className={getLinkClass("/dashboard")}>
            <Layout className="w-4 h-4" />
            Dashboard
          </Link>
          <Link href="/orders" className={getLinkClass("/orders")}>
            <ShoppingBag className="w-4 h-4" />
            Orders
          </Link>
          <Link href="/products" className={getLinkClass("/products")}>
            <Layers className="w-4 h-4" />
            Inventory
          </Link>
          <Link href="/drivers" className={getLinkClass("/drivers")}>
            <Truck className="w-4 h-4" />
            Drivers
          </Link>
          <Link href="/merchants" className={getLinkClass("/merchants")}>
            <Users className="w-4 h-4" />
            Merchants
          </Link>
          <Link href="/analytics" className={getLinkClass("/analytics")}>
            <BarChart3 className="w-4 h-4" />
            Analytics
          </Link>
        </nav>
      </div>

      {/* Bottom Sidebar */}
      <div className="p-4 space-y-4">
        <div className="space-y-1.5 pt-2 border-t border-gray-100">
          <Link href="/profile" className={getLinkClass("/profile")}>
            <Settings className="w-4 h-4" />
            Settings
          </Link>
        </div>
      </div>
    </aside>
  );
}

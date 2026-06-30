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

  const getSubLinkClass = (path: string) => {
    const isActive = pathname === path;
    return `flex items-center gap-2 pl-3 py-1.5 rounded-lg text-[11px] font-bold transition-all duration-200 ${
      isActive
        ? "text-brand-500 font-extrabold border-l-2 border-brand-500 pl-2 bg-pink-50/30"
        : "text-gray-500 hover:text-gray-955 font-semibold"
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
          <div className="p-4 space-y-4">
            
            <Link href="/driver/dashboard" className={getLinkClass("/driver/dashboard")}>
              <Layout className="w-4 h-4" />
              Dashboard
            </Link>

            <div className="space-y-1">
              <div className="flex items-center gap-2 px-4 py-1">
                <ShoppingBag className="w-4 h-4 text-gray-400" />
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Orders</span>
              </div>
              <div className="pl-3 space-y-0.5 border-l border-gray-150 ml-6">
                <Link href="/driver/orders/available" className={getSubLinkClass("/driver/orders/available")}>
                  Available Orders
                </Link>
                <Link href="/driver/orders/active" className={getSubLinkClass("/driver/orders/active")}>
                  Active Deliveries
                </Link>
                <Link href="/driver/orders/details" className={getSubLinkClass("/driver/orders/details")}>
                  Delivery Details
                </Link>
                <Link href="/driver/orders/history" className={getSubLinkClass("/driver/orders/history")}>
                  Delivery History
                </Link>
              </div>
            </div>

            <Link href="/driver/tracking" className={getLinkClass("/driver/tracking")}>
              <Truck className="w-4 h-4" />
              Tracking
            </Link>

            <div className="space-y-1">
              <div className="flex items-center gap-2 px-4 py-1">
                <CreditCard className="w-4 h-4 text-gray-400" />
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Earnings</span>
              </div>
              <div className="pl-3 space-y-0.5 border-l border-gray-150 ml-6">
                <Link href="/driver/wallet" className={getSubLinkClass("/driver/wallet")}>
                  Wallet
                </Link>
                <Link href="/driver/transactions" className={getSubLinkClass("/driver/transactions")}>
                  Transactions
                </Link>
                <Link href="/driver/withdrawals" className={getSubLinkClass("/driver/withdrawals")}>
                  Withdrawals
                </Link>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 px-4 py-1">
                <BarChart3 className="w-4 h-4 text-gray-400" />
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Performance</span>
              </div>
              <div className="pl-3 space-y-0.5 border-l border-gray-150 ml-6">
                <Link href="/driver/performance/statistics" className={getSubLinkClass("/driver/performance/statistics")}>
                  Statistics
                </Link>
                <Link href="/driver/performance/ratings" className={getSubLinkClass("/driver/performance/ratings")}>
                  Ratings
                </Link>
              </div>
            </div>

            <Link href="/driver/notifications" className={getLinkClass("/driver/notifications")}>
              <Bell className="w-4 h-4" />
              Notifications
            </Link>

            <Link href="/driver/support" className={getLinkClass("/driver/support")}>
              <HelpCircle className="w-4 h-4" />
              Support
            </Link>

            <div className="space-y-1">
              <div className="flex items-center gap-2 px-4 py-1">
                <Settings className="w-4 h-4 text-gray-400" />
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Settings</span>
              </div>
              <div className="pl-3 space-y-0.5 border-l border-gray-150 ml-6">
                <Link href="/driver/settings/profile" className={getSubLinkClass("/driver/settings/profile")}>
                  Profile
                </Link>
                <Link href="/driver/settings/vehicle" className={getSubLinkClass("/driver/settings/vehicle")}>
                  Vehicle Information
                </Link>
                <Link href="/driver/settings/availability" className={getSubLinkClass("/driver/settings/availability")}>
                  Availability
                </Link>
                <Link href="/driver/settings/security" className={getSubLinkClass("/driver/settings/security")}>
                  Security
                </Link>
              </div>
            </div>
          </div>
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
      <div className="overflow-y-auto flex-1 scrollbar-thin">
        {/* Logo */}
        <div className="h-[72px] flex items-center px-6 border-b border-gray-100 gap-3 bg-white sticky top-0 z-10">
          <div className="w-8 h-8 rounded-xl bg-brand-500 flex items-center justify-center text-white font-black text-base">
            L
          </div>
          <div>
            <h1 className="font-extrabold text-gray-900 tracking-tight leading-none text-sm">LogiMorocco</h1>
            <span className="text-[9px] font-bold text-brand-500 uppercase tracking-widest leading-none mt-1 block">Admin Console</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="p-4 space-y-4">
          {/* Dashboard */}
          <Link href="/dashboard" className={getLinkClass("/dashboard")}>
            <Layout className="w-4 h-4" />
            Dashboard
          </Link>

          {/* Users */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 px-4 py-1">
              <Users className="w-4 h-4 text-gray-400" />
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Users</span>
            </div>
            <div className="pl-3 space-y-0.5 border-l border-gray-150 ml-6">
              <Link href="/merchants" className={getSubLinkClass("/merchants")}>
                Merchants
              </Link>
              <Link href="/drivers" className={getSubLinkClass("/drivers")}>
                Drivers
              </Link>
            </div>
          </div>

          {/* Orders */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 px-4 py-1">
              <ShoppingBag className="w-4 h-4 text-gray-400" />
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Orders</span>
            </div>
            <div className="pl-3 space-y-0.5 border-l border-gray-150 ml-6">
              <Link href="/orders" className={getSubLinkClass("/orders")}>
                All Orders
              </Link>
              <Link href="/delivery-monitoring" className={getSubLinkClass("/delivery-monitoring")}>
                Delivery Monitoring
              </Link>
            </div>
          </div>

          {/* Finance */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 px-4 py-1">
              <CreditCard className="w-4 h-4 text-gray-400" />
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Finance</span>
            </div>
            <div className="pl-3 space-y-0.5 border-l border-gray-150 ml-6">
              <Link href="/finance/merchants" className={getSubLinkClass("/finance/merchants")}>
                Merchant Wallets
              </Link>
              <Link href="/finance/drivers" className={getSubLinkClass("/finance/drivers")}>
                Driver Wallets
              </Link>
              <Link href="/finance/revenue" className={getSubLinkClass("/finance/revenue")}>
                Platform Revenue
              </Link>
              <Link href="/finance/withdrawals" className={getSubLinkClass("/finance/withdrawals")}>
                Withdrawals
              </Link>
            </div>
          </div>

          {/* Reports */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 px-4 py-1">
              <FileText className="w-4 h-4 text-gray-400" />
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Reports</span>
            </div>
            <div className="pl-3 space-y-0.5 border-l border-gray-150 ml-6">
              <Link href="/reports/orders" className={getSubLinkClass("/reports/orders")}>
                Orders Reports
              </Link>
              <Link href="/reports/revenue" className={getSubLinkClass("/reports/revenue")}>
                Revenue Reports
              </Link>
              <Link href="/reports/drivers" className={getSubLinkClass("/reports/drivers")}>
                Drivers Reports
              </Link>
              <Link href="/reports/merchants" className={getSubLinkClass("/reports/merchants")}>
                Merchants Reports
              </Link>
            </div>
          </div>

          {/* Complaints */}
          <Link href="/complaints" className={getLinkClass("/complaints")}>
            <HelpCircle className="w-4 h-4" />
            Complaints
          </Link>

          {/* Notifications */}
          <Link href="/notifications" className={getLinkClass("/notifications")}>
            <Bell className="w-4 h-4" />
            Notifications
          </Link>

          {/* Integrations */}
          <Link href="/integrations" className={getLinkClass("/integrations")}>
            <Terminal className="w-4 h-4" />
            Integrations
          </Link>

          {/* Audit Logs */}
          <Link href="/audit-logs" className={getLinkClass("/audit-logs")}>
            <Activity className="w-4 h-4" />
            Audit Logs
          </Link>

          {/* Settings */}
          <Link href="/settings" className={getLinkClass("/settings")}>
            <Settings className="w-4 h-4" />
            Settings
          </Link>
        </div>
      </div>
    </aside>
  );
}

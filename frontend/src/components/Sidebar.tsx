"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const isAnalytics = pathname === "/analytics";
  const isDashboard = pathname === "/dashboard";

  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col justify-between h-screen flex-shrink-0">
      <div>
        {/* Logo */}
        <div className="h-[72px] flex items-center px-6 border-b border-gray-100 gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-white font-bold text-lg">
            L
          </div>
          <div>
            <h1 className="font-extrabold text-gray-900 tracking-tight leading-none text-base">LogiMorocco</h1>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-0.5 block">Admin Console</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-1.5">
          <Link href="/dashboard" className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${isDashboard ? 'bg-pink-50/50 text-brand-500 border-r-4 border-brand-500' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-semibold'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z"></path></svg>
            Dashboard
          </Link>
          <Link href="/orders" className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${pathname === "/orders" ? 'bg-pink-50/50 text-brand-500 border-r-4 border-brand-500' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-semibold'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
            Orders
          </Link>
          <Link href="/financials" className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${pathname === "/financials" ? 'bg-pink-50/50 text-brand-500 border-r-4 border-brand-500' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-semibold'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            Financials
          </Link>
          <Link href="/drivers" className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${pathname === "/drivers" ? 'bg-pink-50/50 text-brand-500 border-r-4 border-brand-500' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-semibold'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12a4 4 0 100-8 4 4 0 000 8zM2 20a6 6 0 0112 0v1H2v-1zM22 18a2 2 0 11-4 0 2 2 0 014 0zM11 14a3 3 0 016-3h3.586a1 1 0 01.707.293l2.414 2.414a1 1 0 01.293.707V18H11v-4z"></path></svg>
            Drivers
          </Link>
          <Link href="/users" className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${pathname === "/users" ? 'bg-pink-50/50 text-brand-500 border-r-4 border-brand-500' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-semibold'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            Merchants
          </Link>
          <Link href="/analytics" className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${isAnalytics ? 'bg-pink-50/50 text-brand-500 border-r-4 border-brand-500' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-semibold'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 00-2 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
            Analytics
          </Link>
          <Link href="/reports" className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${pathname === "/reports" ? 'bg-pink-50/50 text-brand-500 border-r-4 border-brand-500' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-semibold'}`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            Reports
          </Link>
        </nav>
      </div>

      {/* Bottom Sidebar */}
      <div className="p-4 space-y-4">
        <button className="w-full bg-brand-500 hover:bg-brand-600 text-white rounded-xl py-3 text-xs font-bold shadow-md shadow-brand-500/10 flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"></path></svg>
          NEW DISPATCH
        </button>

        <div className="space-y-1.5 pt-2 border-t border-gray-100">
          <a href="#" className="flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            Settings
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            Support
          </a>
        </div>
      </div>
    </aside>
  );
}

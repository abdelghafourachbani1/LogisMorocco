"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import Sidebar from "./Sidebar";
import HeaderProfile from "./HeaderProfile";

export default function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Monitor scroll for premium glassmorphism navbar effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isAuthPage = pathname === "/login" || pathname === "/register" || pathname === "/forgot-password" || pathname === "/reset-password";
  const isPublicPage = pathname === "/" || pathname === "/about" || pathname === "/contact";

  // Auth pages layout: completely raw
  if (isAuthPage) {
    return <>{children}</>;
  }

  // Public pages layout (Landing, About, Contact): Public Header + Content + Public Footer
  if (isPublicPage) {
    return (
      <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-brand-500 selection:text-white flex flex-col">
        {/* Public Header */}
        <nav
          className={`fixed w-full z-50 transition-all duration-300 ${
            scrolled
              ? "bg-white/70 backdrop-blur-xl shadow-sm border-b border-gray-100/80 py-3"
              : "bg-transparent py-5"
          }`}
        >
          <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <div className="flex justify-between items-center">
              {/* Logo & Left Links */}
              <div className="flex items-center gap-10">
                <Link href="/" className="flex items-center gap-2 group">
                  <span className="text-xl font-black text-gray-900 tracking-tight group-hover:text-brand-500 transition-colors">
                    Logi<span className="text-brand-500">Morocco</span>
                  </span>
                </Link>

                {/* Center Links */}
                <div className="hidden md:flex items-center space-x-8">
                  <Link href="/#features" className="text-sm font-semibold text-gray-500 hover:text-brand-500 transition-colors">
                    Product
                  </Link>
                  <Link href="/#network" className="text-sm font-semibold text-gray-500 hover:text-brand-500 transition-colors">
                    Network
                  </Link>
                  <Link href="/#pricing" className="text-sm font-semibold text-gray-500 hover:text-brand-500 transition-colors">
                    Pricing
                  </Link>
                  <Link href="/about" className="text-sm font-semibold text-gray-500 hover:text-brand-500 transition-colors">
                    About
                  </Link>
                  <Link href="/contact" className="text-sm font-semibold text-gray-500 hover:text-brand-500 transition-colors">
                    Contact
                  </Link>
                </div>
              </div>

              {/* Right Buttons */}
              <div className="hidden md:flex items-center space-x-6">
                <button className="text-gray-400 hover:text-gray-900 transition-colors" aria-label="Search">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>

                <div className="h-4 w-px bg-gray-200" />

                <Link
                  href="/login"
                  className="text-sm font-semibold text-gray-900 hover:text-brand-500 transition-colors border border-gray-200 rounded-lg px-4 py-2 hover:border-gray-900"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-2.5 text-sm font-bold text-white bg-brand-500 hover:bg-brand-600 rounded-lg shadow-sm shadow-brand-500/20 transition-all hover:shadow-brand-500/40 hover:-translate-y-0.5"
                >
                  Start Shipping
                </Link>
              </div>

              {/* Mobile menu button */}
              <div className="flex md:hidden items-center">
                <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-900 focus:outline-none">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {mobileMenuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-white border-b border-gray-100 absolute w-full left-0 top-full shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-6 py-6 space-y-2 flex flex-col">
                <Link href="/#features" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-3 text-base font-semibold text-gray-900 rounded-lg hover:bg-gray-50">
                  Product
                </Link>
                <Link href="/#network" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-3 text-base font-semibold text-gray-900 rounded-lg hover:bg-gray-50">
                  Network
                </Link>
                <Link href="/#pricing" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-3 text-base font-semibold text-gray-900 rounded-lg hover:bg-gray-50">
                  Pricing
                </Link>
                <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-3 text-base font-semibold text-gray-900 rounded-lg hover:bg-gray-50">
                  About
                </Link>
                <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-3 text-base font-semibold text-gray-900 rounded-lg hover:bg-gray-50">
                  Contact
                </Link>
                <div className="border-t border-gray-100 pt-6 mt-4 flex flex-col gap-3">
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block w-full text-center px-4 py-3 rounded-lg font-bold text-gray-900 border border-gray-200 hover:bg-gray-50">
                    Log In
                  </Link>
                  <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="block w-full text-center px-4 py-3 rounded-lg font-bold text-white bg-brand-500 hover:bg-brand-600">
                    Start Shipping
                  </Link>
                </div>
              </div>
            </div>
          )}
        </nav>

        {/* Content Body */}
        <main className="flex-1">{children}</main>

        {/* Public Footer */}
        <footer className="bg-white border-t border-gray-100 pt-20 pb-12 mt-auto">
          <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
              {/* Brand Column */}
              <div className="col-span-1">
                <Link href="/" className="flex items-center gap-2 mb-6">
                  <span className="text-xl font-black text-gray-900 tracking-tight">
                    Logi<span className="text-brand-500">Morocco</span>
                  </span>
                </Link>
                <p className="text-sm text-gray-500 leading-relaxed pr-4">
                  The Kingdom's leading delivery management engine. Precision, velocity, and local expertise.
                </p>
                <div className="flex gap-4 mt-6">
                  <a href="#" className="text-gray-400 hover:text-brand-500 transition-colors" aria-label="Twitter">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-brand-500 transition-colors" aria-label="LinkedIn">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Links Columns */}
              <div>
                <h4 className="font-bold text-gray-900 mb-6 text-sm uppercase tracking-wider">Product</h4>
                <ul className="space-y-4 text-sm text-gray-500 font-medium">
                  <li>
                    <a href="#features" className="hover:text-brand-500 transition-colors">
                      Features
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-brand-500 transition-colors">
                      Integrations
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-brand-500 transition-colors">
                      Merchant Portal
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-brand-500 transition-colors">
                      Driver App
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-6 text-sm uppercase tracking-wider">Company</h4>
                <ul className="space-y-4 text-sm text-gray-500 font-medium">
                  <li>
                    <Link href="/about" className="hover:text-brand-500 transition-colors">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <a href="#" className="hover:text-brand-500 transition-colors">
                      Careers
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-brand-500 transition-colors">
                      Network Map
                    </a>
                  </li>
                  <li>
                    <Link href="/contact" className="hover:text-brand-500 transition-colors">
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Newsletter */}
              <div>
                <h4 className="font-bold text-gray-900 mb-6 text-sm uppercase tracking-wider">Updates</h4>
                <p className="text-sm text-gray-500 mb-4 font-medium">Subscribe to our logistics newsletter</p>
                <form className="flex w-full gap-2" onSubmit={(e) => e.preventDefault()}>
                  <input
                    type="email"
                    placeholder="Email address"
                    className="w-full bg-gray-50 border border-gray-200 text-sm rounded-lg focus:ring-brand-500 focus:border-brand-500 px-4 py-2"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
                  >
                    Send
                  </button>
                </form>
              </div>
            </div>

            <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-500 font-medium">
                &copy; {new Date().getFullYear()} LogiMorocco Logistics. All rights reserved.
              </div>
              <div className="flex gap-6 text-sm font-medium text-gray-500">
                <a href="#" className="hover:text-gray-900 transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="hover:text-gray-900 transition-colors">
                  Terms of Service
                </a>
                <a href="#" className="hover:text-gray-900 transition-colors">
                  Cookie Settings
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // Dashboard pages layout: Sidebar + Header + Page Content
  return (
    <div className="h-screen w-screen flex overflow-hidden">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Right Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="h-[72px] bg-white border-b border-gray-100 flex items-center justify-between px-8 flex-shrink-0">
          {/* Search */}
          <div className="relative w-full max-w-md focus-within:text-brand-500">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search orders, tracking IDs..."
              className="w-full bg-[#F3F4F6]/50 pl-11 pr-4 py-2.5 rounded-xl text-sm border-none focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-800 placeholder-gray-400 font-medium"
            />
          </div>

          {/* Profile & Notifications */}
          <div className="flex items-center gap-6">
            {/* Alert Icon */}
            <button className="relative text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-brand-500 rounded-full" />
            </button>

            {/* Chat Icon */}
            <button className="text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </button>

            <div className="h-6 w-[1px] bg-gray-100" />

            <HeaderProfile />
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 overflow-y-auto bg-[#FAFAFA]">{children}</main>
      </div>
    </div>
  );
}

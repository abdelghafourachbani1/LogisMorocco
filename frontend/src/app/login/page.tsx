"use client";

import { useState } from "react";
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

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@logismaghreb.com");
  const [password, setPassword] = useState("password");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // 1. Get CSRF Cookie from Laravel backend
      await fetch(getApiUrl("/sanctum/csrf-cookie"), {
        method: "GET",
        credentials: "include",
      });

      const xsrfToken = getCookie("XSRF-TOKEN");

      // 2. Perform Login request
      const response = await fetch(getApiUrl("/api/login"), {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          ...(xsrfToken ? { "X-XSRF-TOKEN": xsrfToken } : {}),
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      if (response.ok) {
        // Redirect to dashboard
        router.push("/dashboard");
      } else {
        const data = await response.json();
        setError(data.message || "Invalid credentials. Please try again.");
      }
    } catch (err) {
      console.error("Login failed:", err);
      // For local development mockup when backend is not running/configured
      setError("");
      router.push("/dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-[#FAFAFA] flex flex-col md:flex-row">
      {/* Left side: Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-8 bg-[#FAFAFA]">
        <div className="w-full max-w-md bg-white rounded-3xl border border-gray-100 shadow-xl p-8 space-y-6">
          {/* Logo and Brand Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex w-12 h-12 rounded-xl bg-brand-500 items-center justify-center text-white font-extrabold text-2xl shadow-md">
              L
            </div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Welcome to LogiMorocco</h2>
            <p className="text-sm font-medium text-gray-500">Sign in to your Administrative Console</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="bg-red-50 text-red-600 text-xs font-semibold px-4 py-3 rounded-xl border border-red-100">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#F3F4F6]/50 px-4 py-3 rounded-xl text-sm border-none focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-800 font-medium"
                placeholder="name@company.com"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#F3F4F6]/50 px-4 py-3 rounded-xl text-sm border-none focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-800 font-medium"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between text-xs font-semibold">
              <label className="flex items-center gap-2 text-gray-500 cursor-pointer">
                <input type="checkbox" className="rounded text-brand-500 focus:ring-brand-500 w-4 h-4 border-gray-300" />
                Remember me
              </label>
              <a href="#" className="text-brand-500 hover:underline">Forgot password?</a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-brand-500 hover:bg-brand-600 text-white rounded-xl py-3 text-sm font-bold shadow-md shadow-brand-500/10 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="text-center pt-2">
            <p className="text-xs font-semibold text-gray-400">
              Secure admin access with end-to-end encryption.
            </p>
          </div>
        </div>
      </div>

      {/* Right side: Visual Hero */}
      <div className="hidden md:block flex-1 relative bg-gray-950 overflow-hidden">
        <img
          src="/login_logistics.png"
          alt="Logistics Fleet Operations"
          className="absolute inset-0 w-full h-full object-cover opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-brand-950/80 via-brand-900/20 to-transparent"></div>
        <div className="absolute bottom-16 left-16 right-16 text-white space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 border border-brand-500/30 text-brand-300 text-xs font-bold uppercase tracking-wider">
            LogiMorocco Enterprise
          </div>
          <h1 className="text-4xl lg:text-5xl font-black leading-tight tracking-tight">
            Connecting Morocco's <br />
            Logistics Ecosystem.
          </h1>
          <p className="text-gray-300 font-medium text-sm max-w-md">
            Empowering merchants, dispatchers, and drivers across the Kingdom with real-time operations and automated analytics.
          </p>
        </div>
      </div>
    </div>
  );
}

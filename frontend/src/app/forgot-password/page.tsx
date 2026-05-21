"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setStatus("");

    try {
      // 1. Get CSRF Cookie
      await fetch("http://localhost:8000/sanctum/csrf-cookie", {
        method: "GET",
        credentials: "include",
      });

      // 2. Perform Request
      const response = await fetch("http://localhost:8000/forgot-password", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setStatus(data.status || "We have emailed your password reset link.");
      } else {
        const data = await response.json();
        setError(data.message || "Something went wrong. Please check your email.");
      }
    } catch (err) {
      console.error("Forgot password request failed:", err);
      setError("Unable to connect to the backend server. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-[#FAFAFA] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl border border-gray-100 shadow-xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-xl bg-brand-500 items-center justify-center text-white font-extrabold text-2xl shadow-md">
            L
          </div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Forgot Password</h2>
          <p className="text-sm font-medium text-gray-500">
            Enter your email and we'll send you a password reset link.
          </p>
        </div>

        {status && (
          <div className="bg-green-50 text-green-700 text-xs font-semibold px-4 py-3 rounded-xl border border-green-100">
            {status}
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-600 text-xs font-semibold px-4 py-3 rounded-xl border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-brand-500 hover:bg-brand-600 text-white rounded-xl py-3 text-sm font-bold shadow-md shadow-brand-500/10 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {isLoading ? "Sending Link..." : "Email Reset Link"}
          </button>
        </form>

        <div className="text-center pt-2">
          <Link href="/login" className="text-xs font-bold text-brand-500 hover:underline">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}

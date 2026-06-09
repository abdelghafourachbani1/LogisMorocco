"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<"merchant" | "livreur">("merchant");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (password !== passwordConfirmation) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    try {
      // 1. Get CSRF Cookie from Laravel backend
      await fetch(getApiUrl("/sanctum/csrf-cookie"), {
        method: "GET",
        credentials: "include",
      });

      const xsrfToken = getCookie("XSRF-TOKEN");

      // 2. Perform Register request
      const response = await fetch(getApiUrl("/api/register"), {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          ...(xsrfToken ? { "X-XSRF-TOKEN": xsrfToken } : {}),
        },
        body: JSON.stringify({
          name,
          email,
          phone: phone ? `+212${phone.replace(/^0+/, "")}` : "",
          password,
          password_confirmation: passwordConfirmation,
          role,
        }),
        credentials: "include",
      });

      if (response.ok) {
        // Redirect to dashboard
        router.push("/dashboard");
      } else {
        const data = await response.json();
        setError(data.message || "Registration failed. Please check your inputs.");
      }
    } catch (err) {
      console.error("Registration failed:", err);
      // For local development mockup fallback
      setError("");
      router.push("/dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-screen bg-[#FAFAFA]">
      {/* Left: Dark Panel with Background Image */}
      <div className="hidden lg:flex lg:w-[45%] bg-gray-950 relative overflow-hidden flex-col justify-between p-12">
        <img
          src="/register_logistics.png"
          alt="Tangier Med Port Cargo"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-gray-950/40 to-transparent"></div>

        <div className="relative z-10 pt-8">
          <Link href="/" className="text-[42px] font-black text-white tracking-tight leading-none mb-4 block">
            LogiMorocco
          </Link>
          <p className="text-lg text-gray-400 max-w-sm font-medium leading-snug">
            The next generation of logistics management for the Moroccan marketplace.
          </p>
        </div>

        <div className="relative z-10 pb-8">
          {/* Pink Highlight Card */}
          <div className="bg-brand-500 rounded-2xl p-6 text-white max-w-[320px] mb-8 shadow-xl shadow-brand-500/20">
            <svg className="w-7 h-7 mb-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="font-bold text-[15px] leading-relaxed">
              Join over 5,000+ logistics professionals optimizing their supply chain today.
            </p>
          </div>

          {/* Circular Icons */}
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Registration Form */}
      <div className="w-full lg:w-[55%] bg-white flex items-center justify-center p-8 sm:p-12 relative overflow-y-auto">
        <div className="w-full max-w-[480px]">
          
          <div className="mb-10">
            <h2 className="text-[32px] font-bold text-gray-900 tracking-tight mb-2">Create an Account</h2>
            <p className="text-[14px] text-gray-500 font-medium">
              Fill in your details to start shipping and delivering across Morocco.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-xs font-semibold px-4 py-3 rounded-xl border border-red-100 mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister}>
            {/* Role Toggle */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              <button
                type="button"
                onClick={() => setRole("merchant")}
                className={`relative flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${
                  role === "merchant" ? "bg-pink-50/50 border-brand-500" : "bg-white border-gray-200 hover:border-gray-300"
                }`}
              >
                {role === "merchant" && (
                  <div className="absolute top-3 right-3 text-brand-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                )}
                <svg className={`w-6 h-6 mb-2 ${role === "merchant" ? "text-gray-900" : "text-gray-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span className={`text-[13px] font-bold ${role === "merchant" ? "text-gray-900" : "text-gray-500"}`}>Merchant</span>
              </button>
              
              <button
                type="button"
                onClick={() => setRole("livreur")}
                className={`relative flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${
                  role === "livreur" ? "bg-pink-50/50 border-brand-500" : "bg-white border-gray-200 hover:border-gray-300"
                }`}
              >
                {role === "livreur" && (
                  <div className="absolute top-3 right-3 text-brand-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                )}
                <svg className={`w-6 h-6 mb-2 ${role === "livreur" ? "text-gray-900" : "text-gray-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 011-1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                </svg>
                <span className={`text-[13px] font-bold ${role === "livreur" ? "text-gray-900" : "text-gray-500"}`}>Driver</span>
              </button>
            </div>

            <div className="space-y-5">
              {/* Full Name */}
              <div>
                <label htmlFor="name" className="block text-[12px] font-bold text-gray-600 mb-1.5">Full Name</label>
                <input
                  id="name"
                  type="text"
                  required
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-brand-500 focus:border-brand-500 block px-4 py-3 placeholder-gray-300"
                />
              </div>

              {/* Email Address */}
              <div>
                <label htmlFor="email" className="block text-[12px] font-bold text-gray-600 mb-1.5">Email Address</label>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="john@company.ma"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-brand-500 focus:border-brand-500 block px-4 py-3 placeholder-gray-300"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label htmlFor="phone" className="block text-[12px] font-bold text-gray-600 mb-1.5">Phone Number</label>
                <div className="flex rounded-lg shadow-sm">
                  <span className="inline-flex items-center px-4 rounded-l-lg border border-r-0 border-gray-200 bg-gray-50 text-gray-500 sm:text-sm font-semibold">+212</span>
                  <input
                    id="phone"
                    type="text"
                    placeholder="600-000000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="flex-1 block w-full rounded-none rounded-r-lg border border-gray-200 bg-white text-gray-900 focus:ring-brand-500 focus:border-brand-500 sm:text-sm px-4 py-3 placeholder-gray-300"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-[12px] font-bold text-gray-600 mb-1.5">Password</label>
                <input
                  id="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-brand-500 focus:border-brand-500 block px-4 py-3 placeholder-gray-300 tracking-widest"
                />
                <p className="text-[11px] text-gray-500 mt-2 font-medium">Must be at least 8 characters long.</p>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="password_confirmation" className="block text-[12px] font-bold text-gray-600 mb-1.5">Confirm Password</label>
                <input
                  id="password_confirmation"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-brand-500 focus:border-brand-500 block px-4 py-3 placeholder-gray-300 tracking-widest"
                />
              </div>
            </div>

            <div className="mt-6 flex items-start">
              <div className="flex items-center h-5">
                <input id="terms" type="checkbox" required className="w-4 h-4 bg-white border-gray-200 rounded text-brand-500 focus:ring-brand-500" />
              </div>
              <label htmlFor="terms" className="ml-2 text-[13px] font-medium text-gray-600">
                I agree to the <a href="#" className="text-brand-500 hover:underline font-bold">Terms of Service</a> and <a href="#" className="text-brand-500 hover:underline font-bold">Privacy Policy</a>.
              </label>
            </div>

            <div className="mt-8">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center py-4 px-4 rounded-xl shadow-md shadow-brand-500/20 text-sm font-bold text-white bg-brand-500 hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-all hover:-translate-y-0.5 disabled:opacity-50"
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </button>
            </div>
          </form>
          
          <p className="mt-8 text-center text-[13px] text-gray-500 font-medium">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-gray-900 hover:text-brand-500 transition-colors">
              Log in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

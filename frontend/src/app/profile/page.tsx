"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

function getApiUrl(path: string): string {
  const host = typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:8000"
    : "http://127.0.0.1:8000";
  return `${host}${path}`;
}

export default function ProfilePage() {
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    role: "",
    phone: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(getApiUrl("/api/user"), {
        headers: { "Accept": "application/json" },
        credentials: "include"
      });
      if (res.ok) {
        const data = await res.json();
        setProfileData({
          name: data.name || "",
          email: data.email || "",
          role: data.role || "user",
          phone: data.phone || "",
        });
      }
    } catch (err) {
      console.error("Failed to load profile:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Profile settings saved (mock). In production, this updates via Laravel API.");
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Password updated successfully (mock). In production, this updates via Laravel API.");
  };

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center font-bold text-gray-400 text-sm">
        Loading profile credentials...
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Profile Settings</h2>
          <p className="text-gray-500 text-sm font-medium mt-1">
            Manage your personal profile and account credentials.
          </p>
        </div>
        <Link
          href="/dashboard"
          className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-gray-100 shadow-sm text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Card: Summary */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm text-center flex flex-col items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-brand-500 to-brand-300 flex items-center justify-center text-white font-extrabold text-3xl shadow-md mb-4">
            {profileData.name ? profileData.name.charAt(0).toUpperCase() : "U"}
          </div>
          <h3 className="text-xl font-bold text-gray-900">{profileData.name}</h3>
          <p className="text-xs font-bold text-brand-500 uppercase tracking-widest mt-1">
            {profileData.role === "livreur" ? "Driver/Courier" : profileData.role}
          </p>
          <p className="text-sm text-gray-400 font-medium mt-2">{profileData.email}</p>
        </div>

        {/* Right Forms */}
        <div className="md:col-span-2 space-y-8">
          {/* Profile Details Form */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Personal Details</h3>
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full bg-[#F3F4F6]/50 px-4 py-2.5 rounded-xl text-sm border-none focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-800 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="w-full bg-[#F3F4F6]/50 px-4 py-2.5 rounded-xl text-sm border-none focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-800 font-medium"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    className="w-full bg-[#F3F4F6]/50 px-4 py-2.5 rounded-xl text-sm border-none focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-800 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Role
                  </label>
                  <input
                    type="text"
                    value={profileData.role}
                    disabled
                    className="w-full bg-gray-50 border border-gray-100 px-4 py-2.5 rounded-xl text-sm text-gray-400 font-semibold cursor-not-allowed capitalize"
                  />
                </div>
              </div>
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="bg-brand-500 hover:bg-brand-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-colors"
                >
                  Save Personal Details
                </button>
              </div>
            </form>
          </div>

          {/* Update Password Form */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Security Credentials</h3>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwords.currentPassword}
                  onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                  className="w-full bg-[#F3F4F6]/50 px-4 py-2.5 rounded-xl text-sm border-none focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-800 font-medium"
                  placeholder="••••••••"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={passwords.newPassword}
                    onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                    className="w-full bg-[#F3F4F6]/50 px-4 py-2.5 rounded-xl text-sm border-none focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-800 font-medium"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={passwords.confirmPassword}
                    onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                    className="w-full bg-[#F3F4F6]/50 px-4 py-2.5 rounded-xl text-sm border-none focus:outline-none focus:ring-2 focus:ring-brand-500 text-gray-800 font-medium"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="bg-brand-500 hover:bg-brand-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-colors"
                >
                  Update Credentials
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

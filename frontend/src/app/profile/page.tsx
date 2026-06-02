"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  ShieldCheck, 
  Building,
  CheckCircle2,
  XCircle,
  ArrowLeft
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
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [profileFeedback, setProfileFeedback] = useState("");
  const [profileError, setProfileError] = useState("");
  
  const [passwordFeedback, setPasswordFeedback] = useState("");
  const [passwordError, setPasswordError] = useState("");

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

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileFeedback("");
    setProfileError("");

    try {
      const xsrfToken = getCookie("XSRF-TOKEN");
      const res = await fetch(getApiUrl("/api/user"), {
        method: "PUT",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          ...(xsrfToken ? { "X-XSRF-TOKEN": xsrfToken } : {})
        },
        body: JSON.stringify({
          name: profileData.name,
          email: profileData.email,
          phone: profileData.phone || null,
        }),
        credentials: "include"
      });

      if (res.ok) {
        setProfileFeedback("Store profile details updated successfully.");
        fetchProfile();
      } else {
        const data = await res.json();
        setProfileError(data.message || "Failed to update profile details.");
      }
    } catch (err) {
      setProfileError("Network error saving profile settings.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    setIsSavingPassword(true);
    setPasswordFeedback("");
    setPasswordError("");

    try {
      const xsrfToken = getCookie("XSRF-TOKEN");
      const res = await fetch(getApiUrl("/api/user"), {
        method: "PUT",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          ...(xsrfToken ? { "X-XSRF-TOKEN": xsrfToken } : {})
        },
        body: JSON.stringify({
          name: profileData.name,
          email: profileData.email,
          phone: profileData.phone || null,
          current_password: passwords.currentPassword,
          new_password: passwords.newPassword,
          new_password_confirmation: passwords.confirmPassword
        }),
        credentials: "include"
      });

      if (res.ok) {
        setPasswordFeedback("Account credentials updated successfully.");
        setPasswords({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        const data = await res.json();
        setPasswordError(data.message || "Failed to update credentials. Check your current password.");
      }
    } catch (err) {
      setPasswordError("Network error changing credentials.");
    } finally {
      setIsSavingPassword(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center font-bold text-gray-400 text-sm">
        Loading store settings...
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 max-w-5xl mx-auto min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Store & Profile Settings</h2>
          <p className="text-gray-500 text-sm font-semibold mt-1">
            Update your business identity, manager profile contact numbers, and security credentials.
          </p>
        </div>
        <Link
          href="/dashboard"
          className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-gray-100 shadow-sm text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Summary Info */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm text-center flex flex-col items-center justify-center space-y-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-brand-500 to-brand-300 flex items-center justify-center text-white font-extrabold text-2xl shadow-md">
              {profileData.name ? profileData.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">{profileData.name}</h3>
              <p className="text-[10px] font-black text-brand-500 uppercase tracking-widest mt-1">
                {profileData.role}
              </p>
            </div>
            <div className="w-full pt-4 border-t border-gray-50 text-left space-y-2.5 text-xs text-gray-500 font-semibold">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-gray-400" />
                <span>LogiMorocco Merchant</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="truncate">{profileData.email}</span>
              </div>
              {profileData.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>{profileData.phone}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Update Forms */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Profile Details Form */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Personal & Store Details</h3>
              <p className="text-xs text-gray-400 font-medium">Manage details displayed on outgoing customer delivery receipts.</p>
            </div>

            {profileFeedback && (
              <div className="bg-emerald-50 text-emerald-700 text-xs font-bold p-3 rounded-xl border border-emerald-100 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{profileFeedback}</span>
              </div>
            )}

            {profileError && (
              <div className="bg-red-50 text-red-600 text-xs font-bold p-3 rounded-xl border border-red-100 flex items-center gap-2">
                <XCircle className="w-4 h-4" />
                <span>{profileError}</span>
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Store / Owner Name</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs focus:outline-none w-full font-bold text-gray-950 focus:border-brand-500"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Email Address</label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs focus:outline-none w-full font-bold text-gray-950 focus:border-brand-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Phone Number</label>
                  <input
                    type="text"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs focus:outline-none w-full font-bold text-gray-950 focus:border-brand-500"
                    placeholder="e.g. +212600000000"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Account Type</label>
                  <input
                    type="text"
                    value={profileData.role}
                    disabled
                    className="bg-gray-100 border border-gray-100 rounded-xl px-4 py-2.5 text-xs w-full font-bold text-gray-400 cursor-not-allowed uppercase tracking-wider"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="bg-[#1A1D20] hover:bg-zinc-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {isSavingProfile ? "Saving Details..." : "Save Profile Details"}
                </button>
              </div>
            </form>
          </div>

          {/* Update Password Form */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Security Credentials</h3>
              <p className="text-xs text-gray-400 font-medium">Protect your balance and API integration secrets.</p>
            </div>

            {passwordFeedback && (
              <div className="bg-emerald-50 text-emerald-700 text-xs font-bold p-3 rounded-xl border border-emerald-100 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{passwordFeedback}</span>
              </div>
            )}

            {passwordError && (
              <div className="bg-red-50 text-red-600 text-xs font-bold p-3 rounded-xl border border-red-100 flex items-center gap-2">
                <XCircle className="w-4 h-4" />
                <span>{passwordError}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Current Password</label>
                <input
                  type="password"
                  value={passwords.currentPassword}
                  onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                  className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs focus:outline-none w-full font-bold text-gray-950 focus:border-brand-500"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">New Password</label>
                  <input
                    type="password"
                    value={passwords.newPassword}
                    onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                    className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs focus:outline-none w-full font-bold text-gray-950 focus:border-brand-500"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Confirm New Password</label>
                  <input
                    type="password"
                    value={passwords.confirmPassword}
                    onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                    className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs focus:outline-none w-full font-bold text-gray-950 focus:border-brand-500"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isSavingPassword}
                  className="bg-[#1A1D20] hover:bg-zinc-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {isSavingPassword ? "Updating Password..." : "Update Password Credentials"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

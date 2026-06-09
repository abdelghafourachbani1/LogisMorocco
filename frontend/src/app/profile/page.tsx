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
    store_description: "",
    store_address: "",
    store_website: "",
    store_logo_url: "",
    bank_name: "",
    bank_rib: "",
    bank_holder_name: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [activeTab, setActiveTab] = useState<"profile" | "store" | "bank">("profile");

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
          store_description: data.store_description || "",
          store_address: data.store_address || "",
          store_website: data.store_website || "",
          store_logo_url: data.store_logo_url || "",
          bank_name: data.bank_name || "",
          bank_rib: data.bank_rib || "",
          bank_holder_name: data.bank_holder_name || "",
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
          store_description: profileData.store_description || null,
          store_address: profileData.store_address || null,
          store_website: profileData.store_website || null,
          store_logo_url: profileData.store_logo_url || null,
          bank_name: profileData.bank_name || null,
          bank_rib: profileData.bank_rib || null,
          bank_holder_name: profileData.bank_holder_name || null,
        }),
        credentials: "include"
      });

      if (res.ok) {
        setProfileFeedback("Settings saved successfully.");
        fetchProfile();
      } else {
        const data = await res.json();
        setProfileError(data.message || "Failed to save settings.");
      }
    } catch (err) {
      setProfileError("Network error saving settings.");
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
          
          {/* Tabs Navigation */}
          {profileData.role === 'merchant' && (
            <div className="flex gap-2 border-b border-gray-100 pb-1">
              <button 
                type="button"
                onClick={() => setActiveTab("profile")}
                className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${activeTab === 'profile' ? 'bg-[#1A1D20] text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                Profile Details
              </button>
              <button 
                type="button"
                onClick={() => setActiveTab("store")}
                className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${activeTab === 'store' ? 'bg-[#1A1D20] text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                Store Customization
              </button>
              <button 
                type="button"
                onClick={() => setActiveTab("bank")}
                className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${activeTab === 'bank' ? 'bg-[#1A1D20] text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                Payout Bank Details
              </button>
            </div>
          )}

          {/* Form Card */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6">
            {activeTab === "profile" && (
              <>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Personal & Profile Details</h3>
                  <p className="text-xs text-gray-400 font-medium">Update your account email and contact telephone number.</p>
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
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Full Name</label>
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
              </>
            )}

            {activeTab === "store" && (
              <>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Store Customization Settings</h3>
                  <p className="text-xs text-gray-400 font-medium">Update your public shop name, logo cover, and pickup warehouse address.</p>
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
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Store Logo URL</label>
                      <input
                        type="text"
                        value={profileData.store_logo_url}
                        onChange={(e) => setProfileData({ ...profileData, store_logo_url: e.target.value })}
                        className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs focus:outline-none w-full font-bold text-gray-950 focus:border-brand-500"
                        placeholder="https://example.com/logo.png"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Website URL</label>
                      <input
                        type="text"
                        value={profileData.store_website}
                        onChange={(e) => setProfileData({ ...profileData, store_website: e.target.value })}
                        className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs focus:outline-none w-full font-bold text-gray-950 focus:border-brand-500"
                        placeholder="https://my-store.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Store Description</label>
                    <textarea
                      value={profileData.store_description}
                      onChange={(e) => setProfileData({ ...profileData, store_description: e.target.value })}
                      rows={3}
                      className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs focus:outline-none w-full font-bold text-gray-950 focus:border-brand-500"
                      placeholder="Describe your store and products..."
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Business / Pickup Warehouse Address</label>
                    <textarea
                      value={profileData.store_address}
                      onChange={(e) => setProfileData({ ...profileData, store_address: e.target.value })}
                      rows={2}
                      className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs focus:outline-none w-full font-bold text-gray-950 focus:border-brand-500"
                      placeholder="Full street address for courier pickups"
                    />
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={isSavingProfile}
                      className="bg-[#1A1D20] hover:bg-zinc-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50"
                    >
                      {isSavingProfile ? "Saving Customization..." : "Save Store Customization"}
                    </button>
                  </div>
                </form>
              </>
            )}

            {activeTab === "bank" && (
              <>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Payout Bank Details</h3>
                  <p className="text-xs text-gray-400 font-medium">Provide your bank credentials to receive weekly COD balance settlements automatically.</p>
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
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Bank Name</label>
                      <input
                        type="text"
                        value={profileData.bank_name}
                        onChange={(e) => setProfileData({ ...profileData, bank_name: e.target.value })}
                        className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs focus:outline-none w-full font-bold text-gray-950 focus:border-brand-500"
                        placeholder="e.g. CIH Bank, Attijariwafa Bank"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Account Holder Name</label>
                      <input
                        type="text"
                        value={profileData.bank_holder_name}
                        onChange={(e) => setProfileData({ ...profileData, bank_holder_name: e.target.value })}
                        className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs focus:outline-none w-full font-bold text-gray-950 focus:border-brand-500"
                        placeholder="Full Legal Name"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">RIB (24 Digits Account Number)</label>
                    <input
                      type="text"
                      maxLength={24}
                      value={profileData.bank_rib}
                      onChange={(e) => setProfileData({ ...profileData, bank_rib: e.target.value.replace(/\D/g, '') })}
                      className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs focus:outline-none w-full font-bold text-gray-950 focus:border-brand-500 tracking-wider"
                      placeholder="012345678901234567890123"
                    />
                    <p className="text-[10px] text-gray-400 font-medium">Verify your 24 digit RIB carefully to avoid payment failure.</p>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={isSavingProfile}
                      className="bg-[#1A1D20] hover:bg-zinc-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50"
                    >
                      {isSavingProfile ? "Saving Payout Details..." : "Save Payout Details"}
                    </button>
                  </div>
                </form>
              </>
            )}
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

"use client";

import { useState, useEffect } from "react";
import { 
  Settings, 
  Save, 
  CheckCircle, 
  AlertCircle, 
  Sliders, 
  ShieldAlert, 
  DollarSign, 
  Map, 
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

function getApiUrl(path: string): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return `${process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")}${path}`;
  }
  const host = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
    ? "http://localhost:8000"
    : "";
  return `${host}${path}`;
}

export default function PlatformSettings() {
  const [commissionRate, setCommissionRate] = useState("10");
  const [baseDeliveryFee, setBaseDeliveryFee] = useState("35");
  const [driverHoldingLimit, setDriverHoldingLimit] = useState("5000");
  const [allowedZones, setAllowedZones] = useState("Casablanca, Rabat, Marrakech, Fez, Tangier");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(getApiUrl("/api/admin/settings"), {
        headers: { "Accept": "application/json" },
        credentials: "include"
      });
      if (res.ok) {
        const data = await res.json();
        const s = data.settings || {};
        if (s.commission_rate) setCommissionRate(s.commission_rate);
        if (s.base_delivery_fee) setBaseDeliveryFee(s.base_delivery_fee);
        if (s.driver_holding_limit) setDriverHoldingLimit(s.driver_holding_limit);
        if (s.allowed_zones) setAllowedZones(s.allowed_zones);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const xsrfToken = getCookie("XSRF-TOKEN");
      const res = await fetch(getApiUrl("/api/admin/settings"), {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          ...(xsrfToken ? { "X-XSRF-TOKEN": xsrfToken } : {})
        },
        body: JSON.stringify({
          settings: {
            commission_rate: commissionRate,
            base_delivery_fee: baseDeliveryFee,
            driver_holding_limit: driverHoldingLimit,
            allowed_zones: allowedZones
          }
        }),
        credentials: "include"
      });

      if (res.ok) {
        setSuccessMessage("Platform settings updated successfully!");
        fetchSettings();
      } else {
        const data = await res.json();
        setErrorMessage(data.message || "Failed to update configurations.");
      }
    } catch (err) {
      setErrorMessage("Network error, please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <span className="bg-pink-50 text-brand-500 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1.5 w-max">
          <Settings className="w-3.5 h-3.5" /> Configurations
        </span>
        <h2 className="text-2xl font-black text-gray-900 tracking-tight mt-1">Platform Settings</h2>
        <p className="text-xs font-semibold text-gray-500">Configure global commissions, baseline delivery rates, and courier dispatch thresholds.</p>
      </div>

      {errorMessage && (
        <div className="bg-red-50 text-red-600 text-xs font-bold px-4 py-3 rounded-2xl border border-red-100 flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="bg-emerald-50 text-emerald-600 text-xs font-bold px-4 py-3 rounded-2xl border border-emerald-100/50 flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>{successMessage}</span>
        </div>
      )}

      {isLoading ? (
        <div className="bg-white rounded-[28px] border border-gray-100 p-8 text-center text-gray-400 font-bold">
          Retrieving active configurations...
        </div>
      ) : (
        <form onSubmit={handleSave} className="bg-white rounded-[28px] border border-gray-100 p-8 space-y-6 shadow-sm">
          {/* Section 1: Commissions */}
          <div className="space-y-4 pb-6 border-b border-gray-50">
            <h3 className="text-sm font-black text-gray-950 uppercase tracking-wider flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-brand-500" /> Financial Commissions
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Global Platform Commission (%)</label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    min="0"
                    max="100"
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs focus:outline-none font-bold text-gray-900 focus:border-brand-500"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400">%</span>
                </div>
                <span className="text-[9px] text-gray-400 font-semibold block">Deducted from merchant payouts on successful deliveries.</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Base Delivery Fee (MAD)</label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    min="0"
                    value={baseDeliveryFee}
                    onChange={(e) => setBaseDeliveryFee(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs focus:outline-none font-bold text-gray-900 focus:border-brand-500"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400">MAD</span>
                </div>
                <span className="text-[9px] text-gray-400 font-semibold block">Standard shipping fee charged to merchants per package.</span>
              </div>
            </div>
          </div>

          {/* Section 2: Fleet Management */}
          <div className="space-y-4 pb-6 border-b border-gray-50">
            <h3 className="text-sm font-black text-gray-950 uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-brand-500" /> Fleet thresholds
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Courier Held COD Limit (MAD)</label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    min="1"
                    value={driverHoldingLimit}
                    onChange={(e) => setDriverHoldingLimit(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs focus:outline-none font-bold text-gray-900 focus:border-brand-500"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400">MAD</span>
                </div>
                <span className="text-[9px] text-gray-400 font-semibold block">Max collected COD cash a driver can hold before suspension.</span>
              </div>

              <div className="space-y-1.5 col-span-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Active shipping Zones</label>
                <input
                  type="text"
                  required
                  value={allowedZones}
                  onChange={(e) => setAllowedZones(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs focus:outline-none font-bold text-gray-900 focus:border-brand-500"
                />
                <span className="text-[9px] text-gray-400 font-semibold block">Comma-separated regions where platform dispatches are available.</span>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="bg-[#1A1D20] hover:bg-zinc-800 text-white rounded-xl px-6 py-3 text-xs font-bold transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> {isSaving ? "Saving Configuration..." : "Save Settings"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

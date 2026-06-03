"use client";

import { useState, useEffect } from "react";
import { 
  User, 
  Truck, 
  Lock, 
  Bell, 
  CheckCircle2, 
  Save, 
  Mail, 
  Phone,
  CreditCard
} from "lucide-react";

function getApiUrl(path: string): string {
  const host = typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:8000"
    : "http://127.0.0.1:8000";
  return `${host}${path}`;
}

export default function DriverSettings() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [cin, setCin] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingSecurity, setIsSavingSecurity] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(getApiUrl("/api/user"), {
        headers: { "Accept": "application/json" },
        credentials: "include"
      });
      if (res.ok) {
        const data = await res.json();
        setName(data.name || "");
        setEmail(data.email || "");
        setPhone(data.phone || "");
        setVehicleType(data.vehicle_type || "motorcycle");
        setVehiclePlate(data.vehicle_plate || "");
        setCin(data.cin || "");
      }
    } catch (err) {
      console.error("Failed to load user profile:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      const res = await fetch(getApiUrl("/api/driver/profile"), {
        method: "PUT",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          vehicle_type: vehicleType,
          vehicle_plate: vehiclePlate,
          cin
        }),
        credentials: "include"
      });
      if (res.ok) {
        setToastMessage("Driver profile & vehicle details updated successfully.");
        setTimeout(() => setToastMessage(null), 4000);
      } else {
        const errData = await res.json();
        alert(errData.message || "Failed to update profile details.");
      }
    } catch (err) {
      console.error("Error saving profile:", err);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleSaveSecurity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== newPasswordConfirmation) {
      alert("New passwords do not match.");
      return;
    }
    setIsSavingSecurity(true);
    try {
      const res = await fetch(getApiUrl("/api/driver/profile"), {
        method: "PUT",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name,
          email,
          current_password: currentPassword,
          new_password: newPassword,
          new_password_confirmation: newPasswordConfirmation
        }),
        credentials: "include"
      });
      if (res.ok) {
        setToastMessage("Credentials updated successfully.");
        setCurrentPassword("");
        setNewPassword("");
        setNewPasswordConfirmation("");
        setTimeout(() => setToastMessage(null), 4000);
      } else {
        const errData = await res.json();
        alert(errData.message || "Security verification failed.");
      }
    } catch (err) {
      console.error("Error saving password:", err);
    } finally {
      setIsSavingSecurity(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-sm font-bold text-gray-400">
        Loading settings schema...
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 max-w-4xl mx-auto">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white text-xs font-bold px-5 py-3.5 rounded-2xl shadow-xl z-50 flex items-center gap-2.5 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-green-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">Account & Vehicle Settings</h2>
        <p className="text-gray-400 text-xs font-semibold mt-1">Configure profile details, identity records, vehicle classification, and login credentials.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Navigation / Intro */}
        <div className="md:col-span-1 space-y-4">
          <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xl font-black mx-auto">
              {name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-gray-800">{name}</h4>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mt-0.5">Active Logistics Agent</span>
            </div>
          </div>
        </div>

        {/* Setting Modules */}
        <div className="md:col-span-2 space-y-8">
          
          {/* Profile Form */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-gray-50">
              <User className="w-5 h-5 text-gray-900" />
              <h3 className="font-extrabold text-gray-900 text-sm">Personal Information</h3>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Full Name</label>
                  <input 
                    type="text" 
                    required 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email Address</label>
                  <input 
                    type="email" 
                    required 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Phone Number</label>
                  <input 
                    type="text" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">National CIN ID</label>
                  <input 
                    type="text" 
                    value={cin} 
                    onChange={(e) => setCin(e.target.value)}
                    placeholder="e.g. AB123456"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-4 pb-2 border-b border-gray-50">
                <Truck className="w-5 h-5 text-gray-900" />
                <h3 className="font-extrabold text-gray-900 text-sm">Vehicle Configuration</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Vehicle Type</label>
                  <select 
                    value={vehicleType} 
                    onChange={(e) => setVehicleType(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 bg-white"
                  >
                    <option value="motorcycle">Motorcycle / Scooter</option>
                    <option value="car">Light Cargo Car</option>
                    <option value="van">Delivery Van</option>
                    <option value="truck">Heavy Truck</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">License Plate Number</label>
                  <input 
                    type="text" 
                    value={vehiclePlate} 
                    onChange={(e) => setVehiclePlate(e.target.value)}
                    placeholder="e.g. 12345-A-1"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isSavingProfile}
                className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold text-xs py-3 px-6 rounded-xl transition-all duration-200 shadow-md shadow-orange-500/10 flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                {isSavingProfile ? "Saving..." : "Save Profile Details"}
              </button>
            </form>
          </div>

          {/* Security Form */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-gray-50">
              <Lock className="w-5 h-5 text-gray-900" />
              <h3 className="font-extrabold text-gray-900 text-sm">Security & Password</h3>
            </div>

            <form onSubmit={handleSaveSecurity} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Current Password</label>
                <input 
                  type="password" 
                  value={currentPassword} 
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">New Password</label>
                  <input 
                    type="password" 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Confirm New Password</label>
                  <input 
                    type="password" 
                    value={newPasswordConfirmation} 
                    onChange={(e) => setNewPasswordConfirmation(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isSavingSecurity}
                className="bg-gray-900 hover:bg-gray-800 disabled:bg-gray-600 text-white font-bold text-xs py-3 px-6 rounded-xl transition-all duration-200 flex items-center gap-1.5"
              >
                <Lock className="w-4 h-4" />
                {isSavingSecurity ? "Updating..." : "Change Credentials"}
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}

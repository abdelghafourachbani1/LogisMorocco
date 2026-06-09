"use client";

import React, { useState, useEffect } from "react";
import { 
  Users, 
  UserPlus, 
  Trash2, 
  Edit3, 
  ShieldAlert, 
  Lock, 
  X,
  Mail,
  Phone,
  Briefcase
} from "lucide-react";

interface TeamMember {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  sub_role: "support" | "warehouse" | "finance";
  created_at: string;
}

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

export default function TeamPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [subRole, setSubRole] = useState<"support" | "warehouse" | "finance">("support");

  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const fetchTeam = async () => {
    setIsLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch(getApiUrl("/api/team"), {
        headers: { "Accept": "application/json" },
        credentials: "include"
      });

      if (res.ok) {
        const data = await res.json();
        setTeam(data.staff || []);
      } else {
        setErrorMsg("Failed to retrieve team members. Make sure you are logged in as a Merchant.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Network error connecting to API.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const openAddModal = () => {
    setEditingMember(null);
    setName("");
    setEmail("");
    setPhone("");
    setPassword("");
    setSubRole("support");
    setFeedbackMsg("");
    setErrorMsg("");
    setShowModal(true);
  };

  const openEditModal = (member: TeamMember) => {
    setEditingMember(member);
    setName(member.name);
    setEmail(member.email);
    setPhone(member.phone || "");
    setPassword("");
    setSubRole(member.sub_role);
    setFeedbackMsg("");
    setErrorMsg("");
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsActionLoading(true);
    setErrorMsg("");
    setFeedbackMsg("");

    const isEdit = !!editingMember;
    const url = isEdit ? `/api/team/${editingMember!.id}` : "/api/team";
    const method = isEdit ? "PUT" : "POST";

    const payload: any = {
      name,
      email,
      phone: phone || null,
      sub_role: subRole
    };

    if (password) {
      payload.password = password;
    }

    try {
      const xsrfToken = getCookie("XSRF-TOKEN");
      const res = await fetch(getApiUrl(url), {
        method,
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          ...(xsrfToken ? { "X-XSRF-TOKEN": xsrfToken } : {})
        },
        body: JSON.stringify(payload),
        credentials: "include"
      });

      if (res.ok) {
        setFeedbackMsg(isEdit ? "Team member updated successfully." : "Team member added successfully.");
        setShowModal(false);
        fetchTeam();
      } else {
        const data = await res.json();
        setErrorMsg(data.message || "Failed to save team member details.");
      }
    } catch (err) {
      setErrorMsg("Network error saving team member.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to remove this team member? they will instantly lose access to your store backend.")) return;

    setIsActionLoading(true);
    setErrorMsg("");
    setFeedbackMsg("");

    try {
      const xsrfToken = getCookie("XSRF-TOKEN");
      const res = await fetch(getApiUrl(`/api/team/${id}`), {
        method: "DELETE",
        headers: {
          "Accept": "application/json",
          ...(xsrfToken ? { "X-XSRF-TOKEN": xsrfToken } : {})
        },
        credentials: "include"
      });

      if (res.ok) {
        setFeedbackMsg("Team member removed successfully.");
        fetchTeam();
      } else {
        setErrorMsg("Failed to delete team member.");
      }
    } catch (err) {
      setErrorMsg("Error deleting team member.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const getSubRoleBadge = (role: string) => {
    switch (role) {
      case "support":
        return <span className="bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full">Customer Support</span>;
      case "warehouse":
        return <span className="bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full">Warehouse Agent</span>;
      case "finance":
        return <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full">Finance Agent</span>;
      default:
        return <span className="bg-gray-50 text-gray-600 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full">{role}</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center font-bold text-gray-400 text-sm">
        Loading merchant team members...
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto min-h-screen">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            Team & Staff Accounts
          </h2>
          <p className="text-gray-500 text-sm font-semibold mt-1">
            Grant granular dashboard privileges to support operators, warehouse packers, and finance officers.
          </p>
        </div>

        <button 
          onClick={openAddModal}
          className="flex items-center gap-2 bg-[#1A1D20] hover:bg-zinc-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          Add Staff Member
        </button>
      </div>

      {feedbackMsg && (
        <div className="bg-emerald-50 text-emerald-700 text-xs font-bold px-4 py-3 rounded-xl border border-emerald-100">
          {feedbackMsg}
        </div>
      )}

      {errorMsg && (
        <div className="bg-red-50 text-red-600 text-xs font-bold px-4 py-3 rounded-xl border border-red-100">
          {errorMsg}
        </div>
      )}

      {/* Staff Grid / List */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {team.length === 0 ? (
          <div className="text-center py-20 text-gray-400 space-y-4">
            <Users className="w-12 h-12 mx-auto text-gray-200" />
            <p className="text-xs font-bold">No sub-staff accounts registered yet.</p>
            <button 
              onClick={openAddModal}
              className="text-xs font-bold text-brand-500 hover:underline"
            >
              Add your first team member
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50/20">
                  <th className="p-4 pl-6 font-bold">Name & Identity</th>
                  <th className="p-4 font-bold">Privilege Tier</th>
                  <th className="p-4 font-bold">Contact Info</th>
                  <th className="p-4 font-bold">Date Registered</th>
                  <th className="p-4 pr-6 font-bold text-right">Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm font-semibold text-gray-800">
                {team.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50/20 transition-colors">
                    {/* Name */}
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-brand-500 font-bold text-xs border border-pink-100">
                          {member.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-extrabold text-gray-900">{member.name}</p>
                        </div>
                      </div>
                    </td>

                    {/* Privilege Tier */}
                    <td className="p-4">
                      {getSubRoleBadge(member.sub_role)}
                    </td>

                    {/* Contact Details */}
                    <td className="p-4">
                      <div className="space-y-1 text-xs">
                        <p className="flex items-center gap-1.5 text-gray-500 font-semibold">
                          <Mail className="w-3.5 h-3.5 text-gray-400" />
                          {member.email}
                        </p>
                        {member.phone && (
                          <p className="flex items-center gap-1.5 text-gray-500 font-semibold">
                            <Phone className="w-3.5 h-3.5 text-gray-400" />
                            {member.phone}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Registration Date */}
                    <td className="p-4 text-xs text-gray-500 font-semibold">
                      {new Date(member.created_at).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="p-4 pr-6 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button 
                          onClick={() => openEditModal(member)}
                          className="p-2 rounded-xl text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(member.id)}
                          className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Invite / Edit Staff Member Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-gray-100 space-y-6 p-6 animate-in fade-in-50 zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {editingMember ? "Edit Staff Account" : "Add Staff Account"}
                </h3>
                <p className="text-xs text-gray-400 font-medium">Define role limits and security logs.</p>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-700 p-1.5 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Full Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Samir Alami"
                  className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs focus:outline-none w-full font-bold text-gray-950 focus:border-brand-500"
                  required
                />
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Email Address</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs focus:outline-none w-full font-bold text-gray-950 focus:border-brand-500"
                  required
                />
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Phone (Optional)</label>
                <input 
                  type="tel" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 0600000000"
                  className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs focus:outline-none w-full font-bold text-gray-950 focus:border-brand-500"
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                  {editingMember ? "Update Password (Leave blank to keep same)" : "Password"}
                </label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs focus:outline-none w-full font-bold text-gray-950 focus:border-brand-500"
                  required={!editingMember}
                />
              </div>

              {/* Privilege Role Selection */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Privilege Tier</label>
                <select 
                  value={subRole} 
                  onChange={(e: any) => setSubRole(e.target.value)}
                  className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs focus:outline-none w-full font-bold text-gray-950 focus:border-brand-500"
                >
                  <option value="support">Customer Support Agent</option>
                  <option value="warehouse">Warehouse Packer</option>
                  <option value="finance">Finance Accountant</option>
                </select>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-3 border-t border-gray-50">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="bg-white border border-gray-100 text-gray-700 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm w-1/2 cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isActionLoading}
                  className="bg-[#1A1D20] hover:bg-zinc-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm w-1/2 cursor-pointer disabled:opacity-50"
                >
                  {isActionLoading ? "Saving..." : "Save Details"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

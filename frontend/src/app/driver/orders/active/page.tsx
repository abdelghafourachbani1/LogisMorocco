"use client";

import { useState, useEffect } from "react";
import { 
  Package, 
  MapPin, 
  Phone, 
  User, 
  Store, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  Play,
  RotateCw,
  X,
  FileText
} from "lucide-react";

function getApiUrl(path: string): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return `${process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")}${path}`;
  }
  const host = typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
    ? "http://localhost:8000"
    : "";
  return `${host}${path}`;
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

export default function ActiveDeliveries() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [actionStatus, setActionStatus] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [failureReason, setFailureReason] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchActive = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(getApiUrl("/api/driver/orders/active"), {
        headers: { "Accept": "application/json" },
        credentials: "include"
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error("Failed to load active deliveries:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActive();
  }, []);

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setIsUpdating(true);
    try {
      const res = await fetch(getApiUrl(`/api/driver/orders/${selectedOrder.id}/status`), {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": getCookie("XSRF-TOKEN") || ""
        },
        body: JSON.stringify({
          status: actionStatus,
          notes,
          failure_reason: actionStatus.includes("fail") || actionStatus === "refused" || actionStatus === "unreachable" ? failureReason : null
        }),
        credentials: "include"
      });
      if (res.ok) {
        setToastMessage(`Status successfully updated to: ${actionStatus}`);
        setSelectedOrder(null);
        setNotes("");
        setFailureReason("");
        fetchActive();
        setTimeout(() => setToastMessage(null), 4000);
      } else {
        const errData = await res.json();
        alert(errData.message || "Failed to update delivery status.");
      }
    } catch (err) {
      console.error("Error updating order status:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  const quickTransitUpdate = async (orderId: number, targetStatus: string) => {
    try {
      const res = await fetch(getApiUrl(`/api/driver/orders/${orderId}/status`), {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": getCookie("XSRF-TOKEN") || ""
        },
        body: JSON.stringify({ status: targetStatus }),
        credentials: "include"
      });
      if (res.ok) {
        setToastMessage(`Delivery stage advanced: ${targetStatus}`);
        fetchActive();
        setTimeout(() => setToastMessage(null), 4000);
      }
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "assigned": return "bg-blue-50 text-blue-600";
      case "picked_up": return "bg-indigo-50 text-indigo-600";
      case "in_transit": return "bg-orange-50 text-orange-500";
      default: return "bg-gray-50 text-gray-500";
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white text-xs font-bold px-5 py-3.5 rounded-2xl shadow-xl z-50 flex items-center gap-2.5 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-green-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">Active Deliveries Queue</h2>
        <p className="text-gray-400 text-xs font-semibold mt-1">Manage delivery stages, logistics steps, and execute updates to final statuses.</p>
      </div>

      {isLoading ? (
        <div className="min-h-[50vh] flex items-center justify-center text-sm font-bold text-gray-400">
          Loading active delivery queue...
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white border border-gray-100 p-12 text-center rounded-2xl shadow-sm space-y-4">
          <Package className="w-12 h-12 text-gray-300 mx-auto" />
          <div className="space-y-1">
            <h4 className="font-extrabold text-sm text-gray-900">Your Queue is Empty</h4>
            <p className="text-gray-400 text-xs font-semibold">You don't have any assigned shipments currently in transit.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300 grid grid-cols-1 lg:grid-cols-4 gap-6">
              
              {/* Column 1: Order Meta */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-xs text-gray-900">{order.tracking_number}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${getStatusBadgeClass(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Merchant Store</span>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
                      <Store className="w-4 h-4 text-gray-400" />
                      <span>{order.merchant?.name || "Merchant"}</span>
                    </div>
                    {order.merchant?.phone && (
                      <a href={`tel:${order.merchant.phone}`} className="text-[10px] font-bold text-orange-500 flex items-center gap-1 bg-orange-50 px-2 py-1 rounded-lg hover:bg-orange-100 transition-colors">
                        <Phone className="w-3 h-3" /> Call
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Column 2: Customer Address */}
              <div className="space-y-3">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Customer Info & Destination</span>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800">
                      <User className="w-4 h-4 text-gray-400" />
                      <span>{order.customer_name}</span>
                    </div>
                    {order.customer_phone && (
                      <a href={`tel:${order.customer_phone}`} className="text-[10px] font-bold text-orange-500 flex items-center gap-1 bg-orange-50 px-2 py-1 rounded-lg hover:bg-orange-100 transition-colors">
                        <Phone className="w-3 h-3" /> Call
                      </a>
                    )}
                  </div>
                  <div className="flex items-start justify-between gap-1.5">
                    <div className="flex items-start gap-1.5 text-xs text-gray-500 font-semibold leading-relaxed">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <span>{order.customer_address}</span>
                    </div>
                    <a href={`https://maps.google.com/?q=${encodeURIComponent(order.customer_address)}`} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold text-blue-500 flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-lg flex-shrink-0 hover:bg-blue-100 transition-colors">
                      <MapPin className="w-3 h-3" /> Maps
                    </a>
                  </div>
                </div>
              </div>

              {/* Column 3: COD Amount */}
              <div className="flex flex-row lg:flex-col justify-between lg:justify-center lg:items-center gap-4 bg-gray-50/50 p-4 rounded-2xl">
                <div className="lg:text-center">
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Cash to Collect</span>
                  <span className="text-sm font-black text-gray-900">{order.amount_cod} MAD</span>
                </div>
                <div className="lg:text-center">
                  <span className="text-[9px] font-bold text-orange-500 uppercase tracking-wider block">Commission</span>
                  <span className="text-sm font-black text-orange-500">{order.delivery_fee || 35.00} MAD</span>
                </div>
              </div>

              {/* Column 4: Workflow Actions */}
              <div className="flex flex-col justify-center gap-2">
                {order.status === "assigned" && (
                  <button 
                    onClick={() => quickTransitUpdate(order.id, "picked_up")}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 rounded-xl transition-all duration-200 shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5" />
                    Start Pickup (Mark Picked Up)
                  </button>
                )}

                {order.status === "picked_up" && (
                  <button 
                    onClick={() => quickTransitUpdate(order.id, "in_transit")}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs py-2.5 rounded-xl transition-all duration-200 shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5" />
                    Start Transit (In Delivery)
                  </button>
                )}

                <button 
                  onClick={() => {
                    setSelectedOrder(order);
                    setActionStatus("delivered");
                  }}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs py-2.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  Update Status / Complete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Update Status Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-gray-900 text-base">Update Order Status</h3>
                <span className="text-xs font-bold text-gray-400">{selectedOrder.tracking_number}</span>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleUpdateStatus} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Select Target Status</label>
                <select 
                  value={actionStatus} 
                  onChange={(e) => setActionStatus(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 bg-white"
                >
                  <option value="delivered">Delivered Successfully</option>
                  <option value="postponed">Postponed (Reporté)</option>
                  <option value="failed">Delivery Failed</option>
                  <option value="unreachable">Customer Unreachable</option>
                  <option value="refused">Customer Refused Package</option>
                </select>
              </div>

              {(actionStatus === "failed" || actionStatus === "refused" || actionStatus === "unreachable") && (
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Failure Reason</label>
                  <select 
                    value={failureReason} 
                    onChange={(e) => setFailureReason(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 bg-white"
                  >
                    <option value="">-- Choose Reason --</option>
                    <option value="no_answer">No Answer to Phone calls</option>
                    <option value="incorrect_address">Incorrect delivery address details</option>
                    <option value="no_cash">Customer did not have cash ready</option>
                    <option value="cancelled_by_customer">Customer cancelled order at door</option>
                    <option value="damaged_package">Package damaged during transit</option>
                  </select>
                </div>
              )}

              {actionStatus === "postponed" && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Reason for Postponement</label>
                    <input type="text" placeholder="e.g. Customer asked to deliver tomorrow" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 bg-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">New Date</label>
                    <input type="date" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 bg-white" />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Delivery Notes</label>
                <textarea 
                  value={notes} 
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Left package with customer's brother."
                  className="w-full border border-gray-200 rounded-xl p-4 text-xs font-semibold focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 h-24 resize-none"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setSelectedOrder(null)}
                  className="flex-1 bg-white border border-gray-200 text-gray-700 font-bold text-xs py-3 rounded-xl hover:bg-gray-50 transition-all duration-200"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isUpdating}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold text-xs py-3 rounded-xl transition-all duration-200 shadow-md shadow-orange-500/10"
                >
                  {isUpdating ? "Saving..." : "Apply Status"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

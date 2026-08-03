"use client";

import { useState, useEffect } from "react";
import { 
  Package, 
  MapPin, 
  Phone, 
  User, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  Eye, 
  X,
  Store
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

export default function AvailableOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [claimProgress, setClaimProgress] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchAvailable = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(getApiUrl("/api/driver/orders/available"), {
        headers: { "Accept": "application/json" },
        credentials: "include"
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error("Failed to load available orders:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailable();
  }, []);

  const handleClaim = async (orderId: number) => {
    setClaimProgress(orderId.toString());
    try {
      const res = await fetch(getApiUrl(`/api/driver/orders/${orderId}/claim`), {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": getCookie("XSRF-TOKEN") || ""
        },
        credentials: "include"
      });
      if (res.ok) {
        setToastMessage("Order claimed successfully! Added to your active delivery queue.");
        setSelectedOrder(null);
        fetchAvailable();
        setTimeout(() => setToastMessage(null), 4000);
      } else {
        const errData = await res.json();
        alert(errData.message || "Failed to claim order.");
      }
    } catch (err) {
      console.error("Error claiming order:", err);
    } finally {
      setClaimProgress(null);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white text-xs font-bold px-5 py-3.5 rounded-2xl shadow-xl z-50 flex items-center gap-2.5 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-green-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">Available Orders Marketplace</h2>
        <p className="text-gray-400 text-xs font-semibold mt-1">Browse unassigned packages. Claim them into your queue to initiate delivery.</p>
      </div>

      {isLoading ? (
        <div className="min-h-[50vh] flex items-center justify-center text-sm font-bold text-gray-400">
          Loading available orders...
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white border border-gray-100 p-12 text-center rounded-2xl shadow-sm space-y-4">
          <Package className="w-12 h-12 text-gray-300 mx-auto" />
          <div className="space-y-1">
            <h4 className="font-extrabold text-sm text-gray-900">Marketplace is Empty</h4>
            <p className="text-gray-400 text-xs font-semibold">There are no pending packages available for pickup right now.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-300 flex flex-col justify-between space-y-6">
              {/* Order Card Head */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-gray-900">{order.tracking_number}</span>
                  <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(order.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-gray-700 bg-gray-50 p-2 rounded-xl">
                  <Store className="w-4 h-4 text-gray-400" />
                  <span>{order.merchant?.name || "Merchant"}</span>
                </div>
              </div>

              {/* Order Info */}
              <div className="space-y-3">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Delivery Destination</span>
                    <p className="text-xs font-semibold text-gray-900 leading-snug">{order.customer_address}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="bg-gray-50/50 p-3 rounded-xl">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">COD Amount</span>
                    <span className="text-xs font-black text-gray-900">{order.amount_cod} MAD</span>
                  </div>
                  <div className="bg-orange-50/30 p-3 rounded-xl">
                    <span className="text-[9px] font-bold text-orange-500 uppercase tracking-wider block">Earning Commission</span>
                    <span className="text-xs font-black text-orange-500">{order.delivery_fee || 35.00} MAD</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2.5 pt-2">
                <button 
                  onClick={() => setSelectedOrder(order)}
                  className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold text-xs py-2.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5"
                >
                  <Eye className="w-4 h-4" />
                  <span>Details</span>
                </button>
                <button 
                  onClick={() => handleClaim(order.id)}
                  disabled={claimProgress !== null}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold text-xs py-2.5 rounded-xl transition-all duration-200 shadow-sm"
                >
                  {claimProgress === order.id.toString() ? "Claiming..." : "Accept Order"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Head */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-gray-900 text-base">Delivery Details</h3>
                <span className="text-xs font-bold text-gray-400">{selectedOrder.tracking_number}</span>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Merchant Details */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Merchant (Sender)</h4>
                <div className="bg-gray-50 p-4 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2">
                    <Store className="w-4 h-4 text-gray-400" />
                    <span className="text-xs font-bold text-gray-800">{selectedOrder.merchant?.name || "Merchant Store"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{selectedOrder.merchant?.phone || "N/A"}</span>
                  </div>
                </div>
              </div>

              {/* Customer Details */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Customer (Receiver)</h4>
                <div className="bg-gray-50 p-4 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-xs font-bold text-gray-800">{selectedOrder.customer_name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{selectedOrder.customer_phone}</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs font-semibold text-gray-500">
                    <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span>{selectedOrder.customer_address}</span>
                  </div>
                </div>
              </div>

              {/* Financials Summary */}
              <div className="grid grid-cols-2 gap-4">
                <div className="border border-gray-100 p-4 rounded-2xl">
                  <span className="text-[9px] font-bold text-gray-400 block uppercase tracking-wider">Cash to Collect</span>
                  <span className="text-base font-black text-gray-900 block mt-1">{selectedOrder.amount_cod} MAD</span>
                </div>
                <div className="border border-gray-100 p-4 rounded-2xl">
                  <span className="text-[9px] font-bold text-orange-500 block uppercase tracking-wider">Your Earning</span>
                  <span className="text-base font-black text-orange-500 block mt-1">{selectedOrder.delivery_fee || 35.00} MAD</span>
                </div>
              </div>
            </div>

            {/* Modal Action */}
            <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex gap-3">
              <button 
                onClick={() => setSelectedOrder(null)}
                className="flex-1 bg-white border border-gray-200 text-gray-700 font-bold text-xs py-3 rounded-xl hover:bg-gray-50 transition-all duration-200"
              >
                Close
              </button>
              <button 
                onClick={() => handleClaim(selectedOrder.id)}
                disabled={claimProgress !== null}
                className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold text-xs py-3 rounded-xl transition-all duration-200 shadow-md shadow-orange-500/10"
              >
                {claimProgress === selectedOrder.id.toString() ? "Accepting..." : "Accept Assignment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

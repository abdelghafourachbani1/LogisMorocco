"use client";

import { useState } from "react";
import { 
  HelpCircle, 
  MessageSquare, 
  CheckCircle2, 
  AlertTriangle, 
  Phone,
  BookOpen,
  ArrowRight
} from "lucide-react";

export default function DriverSupport() {
  const [issueType, setIssueType] = useState<string>("delivery");
  const [trackingNumber, setTrackingNumber] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSubmitIssue = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setToastMessage("Issue report submitted successfully. Admin support has been alerted.");
      setTrackingNumber("");
      setDescription("");
      setTimeout(() => setToastMessage(null), 4000);
    }, 1000);
  };

  const faqs = [
    {
      q: "What should I do if the customer refuses the package?",
      a: "Set the status of the order to 'Customer Refused' in your active queue, select the specific reason (e.g., package damaged or customer cancelled), and include details in the notes. Return the package to the merchant during your next pickup window."
    },
    {
      q: "How long does it take for my earnings to settle in my available wallet?",
      a: "Commissions are added to your pending wallet instantly upon delivery confirmation. Settled balances are automatically transferred to your available wallet twice a week (Tuesdays and Fridays) after administrative review."
    },
    {
      q: "The customer is unreachable. How many times should I call?",
      a: "You are required to make at least 3 separate attempts to contact the customer over a 24-hour period. If they remain unreachable, update the status to 'Customer Unreachable' so the merchant is notified."
    },
    {
      q: "Can I transfer an active delivery to another driver?",
      a: "No, once you claim an order, it is locked to your account. If you cannot complete the delivery due to an emergency, use the 'Reject/Return to Marketplace' button on the active page to return it to the available pool."
    }
  ];

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
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">Driver Help Center</h2>
        <p className="text-gray-400 text-xs font-semibold mt-1">Browse standard logistics FAQs or submit direct tickets regarding payment disputes or delivery issues.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* FAQs */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-gray-900" />
            <h3 className="font-extrabold text-gray-900 text-sm">Frequently Asked Questions</h3>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm space-y-2">
                <h4 className="font-extrabold text-xs text-gray-900 flex items-start gap-2">
                  <span className="text-orange-500">Q:</span>
                  <span>{faq.q}</span>
                </h4>
                <p className="text-xs text-gray-500 font-semibold leading-relaxed pl-5">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Report Issue Form */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-gray-900" />
            <h3 className="font-extrabold text-gray-900 text-sm">Report an Active Issue</h3>
          </div>

          <div className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
            <form onSubmit={handleSubmitIssue} className="space-y-4">
              
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Issue Type</label>
                <select 
                  value={issueType}
                  onChange={(e) => setIssueType(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 bg-white"
                >
                  <option value="delivery">Delivery Location/Customer Issue</option>
                  <option value="payment">Wallet / Commission Discrepancy</option>
                  <option value="app">Mobile Portal Technical Bug</option>
                  <option value="merchant">Merchant Pickup Delay</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tracking Number (Optional)</label>
                <input 
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="e.g. TRK1293817293"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Detailed Description</label>
                <textarea 
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Include as many details as possible (phone attempts, incorrect addresses, etc.)."
                  className="w-full border border-gray-200 rounded-xl p-4 text-xs font-semibold focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 h-32 resize-none"
                />
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold text-xs py-3 rounded-xl transition-all duration-200 shadow-md shadow-orange-500/10 flex items-center justify-center gap-1.5"
              >
                {isSubmitting ? "Submitting..." : "Submit Report"}
                <ArrowRight className="w-4 h-4" />
              </button>

            </form>
          </div>

          {/* Quick Contact */}
          <div className="bg-gray-900 p-6 rounded-2xl text-white space-y-4">
            <div>
              <h4 className="font-extrabold text-xs uppercase tracking-wider text-orange-400">Emergency Dispatch Hotline</h4>
              <p className="text-[11px] text-gray-400 mt-1">If you are facing immediate pickup or delivery issues on the road, contact dispatch directly.</p>
            </div>
            <div className="flex items-center gap-2 bg-white/10 p-3 rounded-xl">
              <Phone className="w-4 h-4 text-orange-400" />
              <span className="text-xs font-bold">+212 522 99 88 77</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

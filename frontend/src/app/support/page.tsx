"use client";

import React, { useState } from "react";
import { 
  HelpCircle, 
  MessageSquare, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Plus, 
  Send,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

interface Ticket {
  id: string;
  subject: string;
  category: string;
  status: "open" | "in_progress" | "resolved";
  created_at: string;
}

const initialTickets: Ticket[] = [
  {
    id: "TKT-2901",
    subject: "Payout delays for Casablanca deliveries from Wednesday",
    category: "Financials",
    status: "resolved",
    created_at: "2026-05-28"
  },
  {
    id: "TKT-3129",
    subject: "Package #TRK-881232 not updated by driver Younes",
    category: "Delivery Issues",
    status: "in_progress",
    created_at: "2026-05-30"
  }
];

const faqs = [
  {
    question: "When are Cash on Delivery (COD) funds paid out?",
    answer: "We process payments three times a week: Mondays, Wednesdays, and Fridays. Payouts cover all orders successfully delivered up to 24 hours prior to the processing day. Funds are directly transferred to your bank account or available for cash pick up.",
    category: "Financials"
  },
  {
    question: "What happens if a customer refuses a package?",
    answer: "If a package is refused, the driver updates the status to 'Refused' and notes the reason. The shipment is returned to our central hub and queued for returning to you. Return delivery rates apply depending on your contracted pricing plan.",
    category: "Shipping"
  },
  {
    question: "How do I connect my Shopify store to LogiMorocco?",
    answer: "Navigate to the Developer APIs section in your sidebar. Generate an API Access Token, then copy the key. Use this key in our official Shopify App connection page, or add it to your custom webhook callbacks.",
    category: "Integrations"
  },
  {
    question: "What cities does LogiMorocco cover?",
    answer: "We offer next-day delivery covering all major metropolitan hubs including Casablanca, Rabat, Tangier, Marrakech, Fez, Agadir, and Meknes, and twice-weekly deliveries to secondary cities.",
    category: "Shipping"
  }
];

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  
  // Ticket forms state
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("Delivery Issues");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;

    setIsSubmitting(true);
    setSuccessMsg("");

    setTimeout(() => {
      const newTicket: Ticket = {
        id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
        subject,
        category,
        status: "open",
        created_at: new Date().toISOString().split("T")[0]
      };

      setTickets([newTicket, ...tickets]);
      setSubject("");
      setDescription("");
      setIsSubmitting(false);
      setSuccessMsg("Support ticket opened successfully. Our agents will respond within 2 hours.");
    }, 800);
  };

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "All" || faq.category === activeTab;
    return matchesSearch && matchesTab;
  });

  const getStatusBadge = (status: Ticket["status"]) => {
    switch (status) {
      case "resolved":
        return <span className="bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">Resolved</span>;
      case "in_progress":
        return <span className="bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">In Progress</span>;
      case "open":
      default:
        return <span className="bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">Open</span>;
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto min-h-screen">
      
      {/* Header */}
      <div>
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Support & Assistance</h2>
        <p className="text-gray-500 text-sm font-semibold mt-1">
          Find instant answers to shipping policies or open a direct ticket with our dedicated customer happiness department.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: FAQ Search and Listing */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-brand-500" />
              Frequently Asked Questions
            </h3>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-4 top-3.5" />
              <input 
                type="text" 
                placeholder="Search shipping, API integration, or payout schedules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-50 border border-gray-100 rounded-2xl pl-11 pr-4 py-3 text-xs focus:outline-none w-full font-bold text-gray-950 focus:border-brand-500"
              />
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2">
              {["All", "Financials", "Shipping", "Integrations"].map(tab => (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(tab); setOpenFaqIndex(null); }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === tab 
                      ? "bg-brand-500 text-white shadow-sm shadow-brand-500/10" 
                      : "bg-gray-50 hover:bg-gray-100 text-gray-600"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* FAQ Accordion List */}
            <div className="divide-y divide-gray-100">
              {filteredFaqs.length === 0 ? (
                <div className="py-8 text-center text-xs font-bold text-gray-400">
                  No matches found for your search query. Try another keyword.
                </div>
              ) : (
                filteredFaqs.map((faq, index) => {
                  const isOpen = openFaqIndex === index;
                  return (
                    <div key={index} className="py-4 first:pt-0 last:pb-0">
                      <button
                        onClick={() => toggleFaq(index)}
                        className="w-full flex items-center justify-between text-left font-extrabold text-xs text-gray-900 py-1.5 focus:outline-none hover:text-brand-500 transition-colors cursor-pointer"
                      >
                        <span>{faq.question}</span>
                        {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                      </button>
                      
                      {isOpen && (
                        <p className="mt-3 text-xs text-gray-500 font-semibold leading-relaxed pl-1">
                          {faq.answer}
                        </p>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Submit Ticket & History */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Form: Open Ticket */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-brand-500" />
              Open Support Ticket
            </h3>

            {successMsg && (
              <div className="bg-emerald-50 text-emerald-700 text-xs font-bold p-3 rounded-xl border border-emerald-100 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Subject / Issue Title</label>
                <input 
                  type="text" 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Delayed package delivery update request"
                  className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs focus:outline-none w-full font-bold text-gray-950 focus:border-brand-500"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Issue Category</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs focus:outline-none w-full font-bold text-gray-950 focus:border-brand-500"
                >
                  <option value="Delivery Issues">Delivery Issues</option>
                  <option value="Financials">Financials & Settlements</option>
                  <option value="Integrations">Shopify / WooCommerce Api</option>
                  <option value="General Info">General Information</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Detailed Description</label>
                <textarea 
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide tracking numbers, dates, or relevant transaction IDs for faster resolution."
                  className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs focus:outline-none w-full font-bold text-gray-950 focus:border-brand-500 resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#1A1D20] hover:bg-zinc-800 text-white w-full py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                {isSubmitting ? "Submitting..." : "Submit Ticket"}
              </button>
            </form>
          </div>

          {/* List: Ticket History */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-gray-900">Your Recent Tickets</h3>
            
            <div className="divide-y divide-gray-50">
              {tickets.map(ticket => (
                <div key={ticket.id} className="py-3 flex items-center justify-between first:pt-0 last:pb-0">
                  <div className="min-w-0 pr-3">
                    <p className="text-xs font-extrabold text-gray-900 truncate">{ticket.subject}</p>
                    <span className="text-[10px] text-gray-400 font-bold block mt-0.5">
                      {ticket.id} • {ticket.category} • {ticket.created_at}
                    </span>
                  </div>
                  <div className="shrink-0">
                    {getStatusBadge(ticket.status)}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { Copy, Check, Eye, EyeOff, RefreshCw, Plug, Link as LinkIcon, Power, ShieldCheck, Activity } from "lucide-react";

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

function getApiUrl(path: string) {
  const host = typeof window !== "undefined" && window.location.hostname === "localhost" ? "http://localhost:8000" : "http://127.0.0.1:8000";
  return `${host}${path}`;
}

interface ApiToken { id: number; name: string; last_used_at: string | null; created_at: string; }

export default function IntegrationsPage() {
  const [tokens, setTokens] = useState<ApiToken[]>([]);
  const [generatedKey, setGeneratedKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [webhookActive, setWebhookActive] = useState(false);
  const [savingWebhook, setSavingWebhook] = useState(false);

  const fetchSettings = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(getApiUrl("/api/merchant/tokens"), {
        headers: { "Accept": "application/json" },
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setTokens(data.tokens || []);
        setWebhookUrl(data.webhook_url || "");
        setWebhookActive(data.webhook_active || false);
      }
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  }, []);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  const generateKey = async () => {
    setIsGenerating(true);
    try {
      const xsrfToken = getCookie("XSRF-TOKEN");
      const res = await fetch(getApiUrl("/api/merchant/tokens"), {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          ...(xsrfToken ? { "X-XSRF-TOKEN": xsrfToken } : {})
        },
        body: JSON.stringify({ name: "Primary Integration Key" }),
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setGeneratedKey(data.token);
        setShowKey(true);
        fetchSettings();
      }
    } finally { setIsGenerating(false); }
  };

  const regenerateKey = async () => {
    if (!confirm("Are you sure you want to regenerate your API key? This will immediately revoke your old key and your existing integrations will stop working until updated.")) return;
    setIsGenerating(true);
    try {
      const xsrfToken = getCookie("XSRF-TOKEN");
      for (const token of tokens) {
         await fetch(getApiUrl(`/api/merchant/tokens/${token.id}`), {
          method: "DELETE",
          headers: {
            "Accept": "application/json",
            ...(xsrfToken ? { "X-XSRF-TOKEN": xsrfToken } : {})
          },
          credentials: "include",
        });
      }
      
      const res = await fetch(getApiUrl("/api/merchant/tokens"), {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          ...(xsrfToken ? { "X-XSRF-TOKEN": xsrfToken } : {})
        },
        body: JSON.stringify({ name: "Primary Integration Key" }),
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setGeneratedKey(data.token);
        setShowKey(true);
        fetchSettings();
      }
    } finally { setIsGenerating(false); }
  };

  const toggleIntegration = async () => {
    setSavingWebhook(true);
    const newStatus = !webhookActive;
    try {
      const xsrfToken = getCookie("XSRF-TOKEN");
      await fetch(getApiUrl("/api/merchant/webhook"), {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          ...(xsrfToken ? { "X-XSRF-TOKEN": xsrfToken } : {})
        },
        body: JSON.stringify({ webhook_url: webhookUrl, webhook_active: newStatus }),
        credentials: "include",
      });
      setWebhookActive(newStatus);
    } finally { setSavingWebhook(false); }
  };

  const updateWebhookUrl = async (val: string) => {
    setWebhookUrl(val);
    const xsrfToken = getCookie("XSRF-TOKEN");
    await fetch(getApiUrl("/api/merchant/webhook"), {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          ...(xsrfToken ? { "X-XSRF-TOKEN": xsrfToken } : {})
        },
        body: JSON.stringify({ webhook_url: val, webhook_active: webhookActive }),
        credentials: "include",
    });
  }

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hasKey = tokens.length > 0;
  const isConnected = hasKey && webhookActive && webhookUrl;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-10 animate-in fade-in duration-500">
      {/* Header */}
      <div className="space-y-2 relative">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
          🔌 Integrations
        </h1>
        <p className="text-sm font-semibold text-gray-500">
          API Management
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Information Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-black text-gray-900 flex items-center gap-2 tracking-tight">
             <ShieldCheck className="w-5 h-5 text-gray-400" /> Information
          </h2>
          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm space-y-8 relative overflow-hidden h-full">
             {/* Decorative blob */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
             
             {/* API Key */}
             <div className="space-y-3 relative">
               <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">API key</label>
               {generatedKey ? (
                 <div className="flex items-center gap-2 bg-emerald-50/50 border border-emerald-100 rounded-xl px-4 py-3">
                   <code className={`flex-1 text-sm font-mono text-emerald-800 ${showKey ? "" : "blur-md select-none"}`}>
                     {generatedKey}
                   </code>
                   <button onClick={() => setShowKey(!showKey)} className="text-emerald-600 hover:text-emerald-700 transition-colors">
                     {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                   </button>
                   <button onClick={() => copy(generatedKey)}
                     className="px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-xs font-bold hover:bg-emerald-600 flex items-center gap-1 transition-colors">
                     {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                     {copied ? "Copied" : "Copy"}
                   </button>
                 </div>
               ) : hasKey ? (
                  <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
                   <code className="flex-1 text-sm font-mono text-gray-400 blur-sm select-none">
                     logis_live_xxxxxxxxxxxxxxxxxxxx
                   </code>
                   <span className="text-xs font-semibold text-gray-400 absolute right-4">Hidden for security</span>
                 </div>
               ) : (
                 <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
                   <span className="text-sm font-medium text-gray-400">No API key generated yet.</span>
                 </div>
               )}
             </div>

             {/* Webhook URL */}
             <div className="space-y-3 relative">
               <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Webhook URL</label>
               <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 focus-within:bg-white focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-500/10 rounded-xl px-4 py-3 transition-all">
                 <LinkIcon className="w-4 h-4 text-gray-400 shrink-0" />
                 <input type="url" value={webhookUrl} onChange={(e) => updateWebhookUrl(e.target.value)}
                   placeholder="https://your-store.com/webhooks/logimaghreb"
                   className="bg-transparent flex-1 text-sm font-medium text-gray-900 focus:outline-none placeholder-gray-400" />
               </div>
             </div>

             {/* Connection Status */}
             <div className="space-y-3 relative pt-4 border-t border-gray-100">
               <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Connection status</label>
               <div className="flex items-center gap-3 pt-1">
                 <div className="relative flex items-center justify-center">
                    <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>
                    {isConnected && <div className="absolute w-3 h-3 rounded-full bg-emerald-500 animate-ping opacity-75"></div>}
                 </div>
                 <span className={`text-sm font-black ${isConnected ? 'text-emerald-600' : 'text-gray-500'}`}>
                   {isConnected ? 'Active & Connected' : webhookActive ? 'Awaiting Webhook URL' : 'Disconnected'}
                 </span>
               </div>
             </div>
          </div>
        </div>

        {/* Actions Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-black text-gray-900 flex items-center gap-2 tracking-tight">
             <Activity className="w-5 h-5 text-gray-400" /> Actions
          </h2>
          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm space-y-4 h-full">
            
            {/* Generate API Key */}
            <button onClick={generateKey} disabled={isGenerating || hasKey}
              className="w-full group relative flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:border-brand-200 hover:bg-brand-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-xl bg-gray-50 group-hover:bg-white group-hover:shadow-sm border border-transparent group-hover:border-brand-100 flex items-center justify-center transition-all">
                    <Plug className="w-5 h-5 text-gray-600 group-hover:text-brand-600" />
                 </div>
                 <div className="text-left">
                    <p className="text-sm font-black text-gray-900">Generate API key</p>
                    <p className="text-xs font-semibold text-gray-500 mt-0.5">Create your integration key</p>
                 </div>
              </div>
              {(isGenerating && !hasKey) && <RefreshCw className="w-5 h-5 text-brand-500 animate-spin" />}
            </button>

            {/* Regenerate API Key */}
            <button onClick={regenerateKey} disabled={isGenerating || !hasKey}
              className="w-full group relative flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:border-amber-200 hover:bg-amber-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-xl bg-gray-50 group-hover:bg-white group-hover:shadow-sm border border-transparent group-hover:border-amber-100 flex items-center justify-center transition-all">
                    <RefreshCw className="w-5 h-5 text-gray-600 group-hover:text-amber-600" />
                 </div>
                 <div className="text-left">
                    <p className="text-sm font-black text-gray-900">Regenerate API key</p>
                    <p className="text-xs font-semibold text-gray-500 mt-0.5">Invalidate old key & create new</p>
                 </div>
              </div>
              {(isGenerating && hasKey) && <RefreshCw className="w-5 h-5 text-amber-500 animate-spin" />}
            </button>

            {/* Enable/Disable Integration */}
            <button onClick={toggleIntegration} disabled={savingWebhook}
              className={`w-full group relative flex items-center justify-between p-4 rounded-2xl border transition-all ${webhookActive ? 'border-red-100 hover:border-red-200 hover:bg-red-50' : 'border-emerald-100 hover:border-emerald-200 hover:bg-emerald-50'}`}>
              <div className="flex items-center gap-4">
                 <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all border border-transparent shadow-sm ${webhookActive ? 'bg-white text-red-500 group-hover:border-red-100' : 'bg-white text-emerald-500 group-hover:border-emerald-100'}`}>
                    <Power className="w-5 h-5" />
                 </div>
                 <div className="text-left">
                    <p className="text-sm font-black text-gray-900">{webhookActive ? 'Disable integration' : 'Enable integration'}</p>
                    <p className="text-xs font-semibold text-gray-500 mt-0.5">{webhookActive ? 'Pause all incoming webhooks' : 'Start receiving webhooks'}</p>
                 </div>
              </div>
              {savingWebhook && <RefreshCw className="w-5 h-5 text-gray-400 animate-spin" />}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}

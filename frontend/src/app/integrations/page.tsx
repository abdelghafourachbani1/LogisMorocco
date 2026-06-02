"use client";

import React, { useState, useEffect } from "react";
import { 
  Key, 
  Webhook, 
  Trash2, 
  Copy, 
  Check, 
  Play, 
  Settings2, 
  ShieldAlert, 
  Activity, 
  RefreshCw,
  Plus,
  Eye,
  EyeOff
} from "lucide-react";

interface TokenItem {
  id: number;
  name: string;
  last_used_at: string | null;
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

export default function IntegrationsPage() {
  const [tokens, setTokens] = useState<TokenItem[]>([]);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [webhookSecret, setWebhookSecret] = useState("");
  const [webhookActive, setWebhookActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);

  // New Token Form
  const [newTokenName, setNewTokenName] = useState("");
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);

  // Webhook test results
  const [testResult, setTestResult] = useState<{
    success: boolean;
    status_code?: number;
    response_body?: string;
    error?: string;
  } | null>(null);

  // Notification feedback
  const [copiedToken, setCopiedToken] = useState(false);
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const fetchData = async () => {
    setIsLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch(getApiUrl("/api/merchant/tokens"), {
        headers: { "Accept": "application/json" },
        credentials: "include"
      });

      if (res.ok) {
        const data = await res.json();
        setTokens(data.tokens || []);
        setWebhookUrl(data.webhook_url || "");
        setWebhookSecret(data.webhook_secret || "");
        setWebhookActive(!!data.webhook_active);
      } else {
        setErrorMsg("Failed to load integrations settings. Are you logged in as a Merchant?");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Network error connecting to API.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateToken = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTokenName.trim()) return;

    setIsActionLoading(true);
    setErrorMsg("");
    setFeedbackMsg("");
    setGeneratedToken(null);

    try {
      const xsrfToken = getCookie("XSRF-TOKEN");
      const res = await fetch(getApiUrl("/api/merchant/tokens"), {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          ...(xsrfToken ? { "X-XSRF-TOKEN": xsrfToken } : {})
        },
        body: JSON.stringify({ name: newTokenName }),
        credentials: "include"
      });

      if (res.ok) {
        const data = await res.json();
        setGeneratedToken(data.token);
        setNewTokenName("");
        setFeedbackMsg("API Key created successfully! Copy it now as it won't be displayed again.");
        fetchData();
      } else {
        setErrorMsg("Failed to create token.");
      }
    } catch (err) {
      setErrorMsg("Error generating API token.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDeleteToken = async (id: number) => {
    if (!confirm("Are you sure you want to revoke this API Key? Any application using it will lose access immediately.")) return;

    setIsActionLoading(true);
    setErrorMsg("");
    setFeedbackMsg("");

    try {
      const xsrfToken = getCookie("XSRF-TOKEN");
      const res = await fetch(getApiUrl(`/api/merchant/tokens/${id}`), {
        method: "DELETE",
        headers: {
          "Accept": "application/json",
          ...(xsrfToken ? { "X-XSRF-TOKEN": xsrfToken } : {})
        },
        credentials: "include"
      });

      if (res.ok) {
        setFeedbackMsg("API Key revoked successfully.");
        fetchData();
      } else {
        setErrorMsg("Failed to delete token.");
      }
    } catch (err) {
      setErrorMsg("Error deleting API token.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleSaveWebhook = async () => {
    setIsActionLoading(true);
    setErrorMsg("");
    setFeedbackMsg("");

    try {
      const xsrfToken = getCookie("XSRF-TOKEN");
      const res = await fetch(getApiUrl("/api/merchant/webhook"), {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          ...(xsrfToken ? { "X-XSRF-TOKEN": xsrfToken } : {})
        },
        body: JSON.stringify({
          webhook_url: webhookUrl,
          webhook_active: webhookActive
        }),
        credentials: "include"
      });

      if (res.ok) {
        const data = await res.json();
        setWebhookSecret(data.webhook_secret || "");
        setFeedbackMsg("Webhook configuration updated successfully.");
        fetchData();
      } else {
        setErrorMsg("Failed to update webhook settings. Make sure URL is valid.");
      }
    } catch (err) {
      setErrorMsg("Error saving webhooks settings.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleTestWebhook = async () => {
    setIsActionLoading(true);
    setTestResult(null);
    setErrorMsg("");

    try {
      const xsrfToken = getCookie("XSRF-TOKEN");
      const res = await fetch(getApiUrl("/api/merchant/webhook/test"), {
        method: "POST",
        headers: {
          "Accept": "application/json",
          ...(xsrfToken ? { "X-XSRF-TOKEN": xsrfToken } : {})
        },
        credentials: "include"
      });

      const data = await res.json();
      setTestResult(data);
    } catch (err: any) {
      setTestResult({
        success: false,
        error: err.message || "Failed to reach configured webhook server."
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  const copyToClipboard = (text: string, isSecret = false) => {
    navigator.clipboard.writeText(text);
    if (isSecret) {
      setCopiedSecret(true);
      setTimeout(() => setCopiedSecret(false), 2000);
    } else {
      setCopiedToken(true);
      setTimeout(() => setCopiedToken(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center font-bold text-gray-400 text-sm">
        Loading API integration endpoints and secrets...
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      
      {/* Top Header */}
      <div>
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Developer Integrations</h2>
        <p className="text-gray-500 text-sm font-semibold mt-1">
          Generate API keys and configure webhooks to automatically sync orders from your Shopify, WooCommerce, or custom ERP.
        </p>
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

      {/* Generated Token Showcase */}
      {generatedToken && (
        <div className="bg-zinc-950 text-white p-6 rounded-[24px] shadow-lg border border-zinc-800 space-y-3 relative overflow-hidden">
          <div className="flex items-center gap-2 text-brand-400 font-bold text-xs">
            <Key className="w-4 h-4" />
            <span>NEWLY GENERATED SECRET KEY</span>
          </div>
          <p className="text-xs text-zinc-400 font-medium max-w-2xl">
            Please copy this API Key now. For security purposes, we cannot show this token again after you navigate away.
          </p>
          <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm font-mono mt-3 select-all">
            <span className="flex-1 break-all text-white font-bold">{generatedToken}</span>
            <button 
              onClick={() => copyToClipboard(generatedToken)}
              className="text-zinc-400 hover:text-white transition-colors"
            >
              {copiedToken ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* API TOKENS SECTION */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-pink-50 rounded-xl flex items-center justify-center text-brand-500 border border-pink-100">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">API Access Tokens</h3>
              <p className="text-gray-400 text-xs font-semibold">Generate keys to auth requests to the LogiMorocco API.</p>
            </div>
          </div>

          {/* Create Token Form */}
          <form onSubmit={handleCreateToken} className="flex gap-2">
            <input 
              type="text" 
              placeholder="e.g. Shopify Store App"
              value={newTokenName}
              onChange={(e) => setNewTokenName(e.target.value)}
              className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs focus:outline-none flex-1 font-bold text-gray-950 focus:border-brand-500"
              required
            />
            <button 
              type="submit" 
              disabled={isActionLoading}
              className="bg-[#1A1D20] hover:bg-zinc-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              Generate
            </button>
          </form>

          {/* Tokens List */}
          <div className="space-y-3 pt-3">
            {tokens.length === 0 ? (
              <div className="text-center py-8 text-xs font-bold text-gray-400 border border-dashed border-gray-100 rounded-2xl">
                No API keys generated yet.
              </div>
            ) : (
              tokens.map(token => (
                <div key={token.id} className="flex items-center justify-between p-4 border border-gray-50 rounded-2xl bg-gray-50/20 hover:bg-gray-50/50 transition-colors">
                  <div className="space-y-1">
                    <p className="text-xs font-black text-gray-900">{token.name}</p>
                    <div className="flex items-center gap-2 text-[10px] text-gray-400 font-semibold">
                      <span>Created: {new Date(token.created_at).toLocaleDateString()}</span>
                      {token.last_used_at && (
                        <>
                          <span>•</span>
                          <span>Last Used: {new Date(token.last_used_at).toLocaleDateString()}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDeleteToken(token.id)}
                    className="text-gray-400 hover:text-red-600 transition-colors p-1.5 rounded-lg hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* WEBHOOKS CONFIG SECTION */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-pink-50 rounded-xl flex items-center justify-center text-brand-500 border border-pink-100">
                <Webhook className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Webhooks Callback</h3>
                <p className="text-gray-400 text-xs font-semibold">Get instant push updates when orders status changes.</p>
              </div>
            </div>
            
            {/* Active Toggle */}
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={webhookActive} 
                onChange={(e) => setWebhookActive(e.target.checked)}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-500"></div>
            </label>
          </div>

          <div className="space-y-4">
            {/* Webhook Endpoint URL */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Payload URL</label>
              <input 
                type="url" 
                placeholder="https://yourdomain.com/webhooks/logimorocco"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs focus:outline-none w-full font-bold text-gray-950 focus:border-brand-500"
              />
            </div>

            {/* Secret key signature */}
            {webhookSecret && (
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Webhook Signature Secret</label>
                <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-xs font-mono select-all">
                  <span className="flex-1 break-all text-gray-600 font-bold">
                    {showSecret ? webhookSecret : "••••••••••••••••••••••••••••••••••••••••"}
                  </span>
                  <button 
                    onClick={() => setShowSecret(!showSecret)}
                    className="text-gray-400 hover:text-gray-700 transition-colors"
                  >
                    {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button 
                    onClick={() => copyToClipboard(webhookSecret, true)}
                    className="text-gray-400 hover:text-gray-700 transition-colors"
                  >
                    {copiedSecret ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Actions: Save Settings & Test Endpoint */}
            <div className="flex gap-3 pt-2">
              <button 
                onClick={handleSaveWebhook}
                disabled={isActionLoading}
                className="bg-[#1A1D20] hover:bg-zinc-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50"
              >
                Save Configurations
              </button>

              {webhookUrl && (
                <button 
                  onClick={handleTestWebhook}
                  disabled={isActionLoading}
                  className="bg-white border border-gray-100 hover:bg-gray-50 text-gray-800 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5" />
                  Test Send Payload
                </button>
              )}
            </div>

            {/* Webhook Test Diagnostic Result */}
            {testResult && (
              <div className="border border-gray-100 rounded-2xl p-4 bg-gray-50/30 space-y-3 mt-4">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-gray-400" />
                    <span className="font-extrabold text-gray-700">Diagnostic Request Status</span>
                  </div>
                  <span className={`font-black uppercase tracking-wider text-[10px] px-2 py-0.5 rounded-full ${
                    testResult.success ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"
                  }`}>
                    {testResult.success ? "Connection Success" : "Connection Failed"}
                  </span>
                </div>

                <div className="text-xs space-y-1">
                  {testResult.status_code !== undefined && (
                    <p className="font-semibold text-gray-600">
                      HTTP Response Status Code: <span className="font-black text-gray-900">{testResult.status_code}</span>
                    </p>
                  )}
                  {testResult.response_body !== undefined && (
                    <div className="space-y-1">
                      <p className="font-semibold text-gray-600">Response Body:</p>
                      <pre className="bg-zinc-950 text-white text-[10px] font-mono p-3 rounded-xl overflow-x-auto max-h-32">
                        {testResult.response_body || "(Empty Response)"}
                      </pre>
                    </div>
                  )}
                  {testResult.error && (
                    <p className="font-semibold text-red-600 bg-red-50/50 p-2.5 rounded-xl border border-red-100">
                      Error Reason: {testResult.error}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}

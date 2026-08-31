import React, { useState, useEffect } from "react";
import {
  Bell,
  Send,
  Users,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ExternalLink,
  RefreshCw,
  Eye,
  ShieldCheck,
  X,
  Loader2,
  Trash2,
} from "lucide-react";
import { supabase } from "../../utils/supabaseClient";
import { toast } from "../../utils/toast";

export default function AdminNotificationManager({ lang = "en", themeMode = "dark" }) {
  const isLight = themeMode === "light";

  // Form State
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [url, setUrl] = useState("https://thetirumalaverse.in/");
  
  // App & Subscriber State
  const [subscriberCount, setSubscriberCount] = useState(null);
  const [loadingSubscribers, setLoadingSubscribers] = useState(false);

  // History & Sending State
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Validation
  const maxTitleLen = 100;
  const maxBodyLen = 250;

  const isUrlValid =
    !url.trim() ||
    url.trim().startsWith("https://") ||
    url.trim().startsWith("/");

  const isFormValid =
    title.trim().length > 0 &&
    title.length <= maxTitleLen &&
    body.trim().length > 0 &&
    body.length <= maxBodyLen &&
    isUrlValid &&
    !isSending;

  // 1. Fetch Subscriber Count
  const fetchSubscriberCount = async () => {
    setLoadingSubscribers(true);
    try {
      const { data, error } = await supabase.rpc("get_active_push_subscriptions_count");
      if (error) {
        // Fallback count query if RPC is not deployed yet
        const { count, error: countErr } = await supabase
          .from("push_subscriptions")
          .select("*", { count: "exact", head: true })
          .eq("is_active", true);

        if (!countErr && count !== null) {
          setSubscriberCount(count);
        } else {
          console.warn("Could not fetch subscriber count:", error);
          setSubscriberCount(0);
        }
      } else {
        setSubscriberCount(data !== null ? data : 0);
      }
    } catch (err) {
      console.warn("Error fetching active subscribers:", err);
      setSubscriberCount(0);
    } finally {
      setLoadingSubscribers(false);
    }
  };

  // 2. Fetch Notification History
  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const { data, error } = await supabase
        .from("admin_custom_notifications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) {
        console.warn("Could not load custom notification history:", error);
      } else {
        setHistory(data || []);
      }
    } catch (err) {
      console.warn("History fetch exception:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchSubscriberCount();
    fetchHistory();

    // Auto-poll history every 5 seconds to update pending -> completed statuses
    const interval = setInterval(() => {
      fetchHistory();
      fetchSubscriberCount();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Handle Dispatch Submit
  const handleInitiateSend = (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    setShowConfirmModal(true);
  };

  const handleConfirmSend = async () => {
    setShowConfirmModal(false);
    if (isSending) return;

    setIsSending(true);

    try {
      const finalUrl = url.trim() || "https://thetirumalaverse.in/";

      const { data, error } = await supabase
        .from("admin_custom_notifications")
        .insert({
          title: title.trim(),
          body: body.trim(),
          url: finalUrl,
          status: "pending",
        })
        .select()
        .single();

      if (error) {
        console.error("Insert notification error:", error);
        toast.error("Failed to queue custom notification. Check admin permissions.");
      } else {
        toast.success("Custom notification queued for background push!");
        setTitle("");
        setBody("");
        setUrl("https://thetirumalaverse.in/");
        fetchHistory();
      }
    } catch (err) {
      console.error("Error creating notification:", err);
      toast.error("An unexpected error occurred while queuing notification.");
    } finally {
      setIsSending(false);
    }
  };

  const formatTimestamp = (ts) => {
    if (!ts) return "—";
    try {
      return new Date(ts).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return ts;
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER CARD — SUBSCRIBER STATS */}
      <div className="p-4 rounded-2xl bg-[#141923] border border-[#D4AF37]/40 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#FFD700]/10 border border-[#FFD700]/30 text-[#FFD700]">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Active Push Subscribers
              <button
                type="button"
                onClick={() => {
                  fetchSubscriberCount();
                  fetchHistory();
                }}
                className="text-[#94A3B8] hover:text-[#FFD700] transition-colors p-1"
                title="Refresh subscriber count"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingSubscribers ? "animate-spin text-[#FFD700]" : ""}`} />
              </button>
            </h3>
            <p className="text-xs text-[#94A3B8]">
              {subscriberCount === null
                ? "Counting active subscriptions..."
                : `${subscriberCount} registered browser recipient(s)`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#0B0E14] border border-[#D4AF37]/20 text-[#FFD700]">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>VAPID Server Dispatch Active</span>
        </div>
      </div>

      {/* FORM & PREVIEW GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* COMPOSE NOTIFICATION FORM */}
        <form onSubmit={handleInitiateSend} className="space-y-4 p-4 rounded-2xl bg-[#141923]/60 border border-[#D4AF37]/30">
          <div className="flex items-center gap-2 border-b border-[#D4AF37]/20 pb-2">
            <Bell className="w-4 h-4 text-[#FF5722]" />
            <h4 className="font-serif text-sm font-bold text-white">Compose Custom Notification</h4>
          </div>

          {/* TITLE INPUT */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-[#FFD700]">
                Title <span className="text-[#FF5722]">*</span>
              </label>
              <span className={`text-[10px] ${title.length > maxTitleLen ? "text-red-400 font-bold" : "text-[#94A3B8]"}`}>
                {title.length}/{maxTitleLen}
              </span>
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Important Tirumala Token Update"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0E14] border border-[#D4AF37]/40 text-white text-xs focus:outline-none focus:border-[#FFD700]"
              maxLength={maxTitleLen}
              required
            />
          </div>

          {/* MESSAGE BODY INPUT */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-[#FFD700]">
                Message Body <span className="text-[#FF5722]">*</span>
              </label>
              <span className={`text-[10px] ${body.length > maxBodyLen ? "text-red-400 font-bold" : "text-[#94A3B8]"}`}>
                {body.length}/{maxBodyLen}
              </span>
            </div>
            <textarea
              rows={3}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="e.g. SSD token issuance timing has been revised for tomorrow morning."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B0E14] border border-[#D4AF37]/40 text-white text-xs focus:outline-none focus:border-[#FFD700]"
              maxLength={maxBodyLen}
              required
            />
          </div>

          {/* DESTINATION URL */}
          <div>
            <label className="text-xs font-bold text-[#FFD700] block mb-1">
              Destination URL <span className="text-[10px] font-normal text-[#94A3B8]">(Optional HTTPS)</span>
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://thetirumalaverse.in/"
              className={`w-full px-3.5 py-2.5 rounded-xl bg-[#0B0E14] border text-white text-xs focus:outline-none ${
                !isUrlValid ? "border-red-500 text-red-300" : "border-[#D4AF37]/40 focus:border-[#FFD700]"
              }`}
            />
            {!isUrlValid && (
              <p className="text-[10px] text-red-400 mt-1">
                Destination URL must start with https://
              </p>
            )}
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={!isFormValid || isSending}
            className={`w-full py-3 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg transition-all ${
              !isFormValid || isSending
                ? "bg-gray-700 text-gray-400 cursor-not-allowed border border-gray-600"
                : "bg-gradient-to-r from-[#FF5722] to-[#FFD700] text-black hover:brightness-110"
            }`}
          >
            {isSending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-black" />
                <span>Queuing Dispatch...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Send Notification to All Subscribers</span>
              </>
            )}
          </button>
        </form>

        {/* REALISTIC NATIVE PUSH PREVIEW CARD */}
        <div className="space-y-3 p-4 rounded-2xl bg-[#141923]/60 border border-[#D4AF37]/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-2 mb-4">
              <div className="flex items-center gap-2 text-white text-xs font-bold">
                <Eye className="w-4 h-4 text-[#FFD700]" />
                <span>Native Notification Preview</span>
              </div>
              <span className="text-[10px] text-[#94A3B8] font-mono">Browser / OS Mockup</span>
            </div>

            {/* MOCK OS NOTIFICATION BOX */}
            <div className="p-4 rounded-xl bg-[#0B0E14] border-2 border-[#D4AF37] shadow-2xl relative space-y-2">
              <div className="flex items-start gap-3">
                <img
                  src="/logo-64.png"
                  alt="Tirumala Verse"
                  className="w-10 h-10 rounded-lg object-contain bg-[#141923] p-1 border border-[#D4AF37]/40 shrink-0"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/64?text=TTD";
                  }}
                />
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#FFD700] tracking-wide uppercase">
                      The Tirumala Verse
                    </span>
                    <span className="text-[9px] text-[#94A3B8]">Just Now</span>
                  </div>
                  <h5 className="text-xs font-bold text-white leading-snug break-words">
                    {title.trim() || "Notification Title Preview"}
                  </h5>
                  <p className="text-[11px] text-[#CBD5E1] leading-relaxed break-words">
                    {body.trim() || "Notification message content will appear here..."}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-[#94A3B8]">
                <span className="truncate max-w-[200px]">
                  🔗 {url.trim() || "https://thetirumalaverse.in/"}
                </span>
                <span className="text-[#FFD700] font-semibold">Click to Open</span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#0B0E14]/80 border border-[#D4AF37]/20 text-[11px] text-[#94A3B8] space-y-1">
            <p className="font-semibold text-white">ℹ️ Outbox Architecture Guarantee:</p>
            <p>
              Notifications are safely queued in Supabase and picked up by the server worker. VAPID private key remains strictly on the server.
            </p>
          </div>
        </div>
      </div>

      {/* NOTIFICATION HISTORY TABLE */}
      <div className="space-y-3 p-4 rounded-2xl bg-[#141923]/60 border border-[#D4AF37]/30">
        <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-2">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#FFD700]" />
            <h4 className="font-serif text-sm font-bold text-white">Custom Notification History</h4>
          </div>
          <button
            type="button"
            onClick={fetchHistory}
            className="text-xs font-semibold text-[#FFD700] hover:underline flex items-center gap-1"
          >
            <RefreshCw className={`w-3 h-3 ${loadingHistory ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
        </div>

        {history.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#94A3B8]">
            No custom notifications sent yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#D4AF37]/20 text-[#FFD700] font-bold">
                  <th className="py-2.5 px-3">Date/Time</th>
                  <th className="py-2.5 px-3">Title & Message</th>
                  <th className="py-2.5 px-3 text-center">Recipients</th>
                  <th className="py-2.5 px-3 text-center text-emerald-400">Sent</th>
                  <th className="py-2.5 px-3 text-center text-red-400">Failed</th>
                  <th className="py-2.5 px-3 text-center text-amber-400">Cleaned</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {history.map((item) => (
                  <tr key={item.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-2.5 px-3 text-[#94A3B8] whitespace-nowrap">
                      {formatTimestamp(item.created_at)}
                    </td>
                    <td className="py-2.5 px-3 max-w-xs">
                      <div className="font-bold text-white truncate">{item.title}</div>
                      <div className="text-[11px] text-[#94A3B8] truncate">{item.body}</div>
                    </td>
                    <td className="py-2.5 px-3 text-center text-white font-mono">
                      {item.recipient_count || 0}
                    </td>
                    <td className="py-2.5 px-3 text-center text-emerald-400 font-mono font-bold">
                      {item.success_count || 0}
                    </td>
                    <td className="py-2.5 px-3 text-center text-red-400 font-mono">
                      {item.failure_count || 0}
                    </td>
                    <td className="py-2.5 px-3 text-center text-amber-400 font-mono">
                      {item.deactivated_count || 0}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      {item.status === "completed" && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          Completed
                        </span>
                      )}
                      {item.status === "pending" && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1 justify-end inline-flex">
                          <Loader2 className="w-3 h-3 animate-spin" /> Pending
                        </span>
                      )}
                      {item.status === "dispatching" && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40 flex items-center gap-1 justify-end inline-flex">
                          <Loader2 className="w-3 h-3 animate-spin" /> Dispatching
                        </span>
                      )}
                      {item.status === "failed" && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-500/20 text-red-300 border border-red-500/40">
                          Failed
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CONFIRMATION DIALOG MODAL */}
      {showConfirmModal && (
        <div className="modal-overlay z-50" onClick={() => setShowConfirmModal(false)}>
          <div
            className="glass-card p-6 border-2 border-[#FFD700] max-w-md w-full bg-[#0B0E14] space-y-4 rounded-2xl shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#D4AF37]/30 pb-3">
              <div className="flex items-center gap-2 text-[#FFD700]">
                <AlertTriangle className="w-5 h-5 text-[#FF5722]" />
                <h3 className="font-serif text-base font-bold text-white">Confirm Broadcast Dispatch</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="text-[#94A3B8] hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#CBD5E1]">
              Are you sure you want to send this custom notification to all <strong className="text-[#FFD700]">{subscriberCount !== null ? subscriberCount : "active"}</strong> subscribed browser users?
            </p>

            <div className="p-3 rounded-xl bg-[#141923] border border-[#D4AF37]/40 space-y-1 text-xs">
              <div className="font-bold text-white">{title}</div>
              <div className="text-[#94A3B8] text-[11px]">{body}</div>
              <div className="text-[10px] text-[#FFD700] truncate pt-1">🔗 {url}</div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 rounded-xl bg-[#141923] text-[#94A3B8] hover:text-white border border-white/10 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSend}
                disabled={isSending}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#FF5722] to-[#FFD700] text-black text-xs font-extrabold shadow-lg hover:brightness-110 flex items-center gap-1.5"
              >
                {isSending ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-black" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Confirm & Send Now</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

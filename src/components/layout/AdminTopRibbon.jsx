import React from 'react';
import { ShieldCheck, Plus, MessageSquare, Cloud, LogOut } from 'lucide-react';

export default function AdminTopRibbon({
  onOpenAddEventModal,
  onOpenAdminModalMode,
  feedbackCount,
  newFeedbackCount,
  onLogout
}) {
  return (
    <div className="bg-gradient-to-r from-[#FF5722] via-[#E65100] to-[#FF5722] text-white py-1.5 px-4 text-xs font-bold flex flex-wrap items-center justify-between gap-2 shadow-lg sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-[#FFD700] animate-bounce shrink-0" />
        <span className="font-extrabold text-[#FFD700]">ADMIN MODE ACTIVE:</span>
        <span className="hidden sm:inline">You are viewing the live website. Click "Edit" or "Delete" on any card!</span>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Live ➕ Add Event Button */}
        <button
          onClick={onOpenAddEventModal}
          className="px-2.5 py-1 rounded bg-black/40 text-[#FFD700] hover:bg-black/60 font-extrabold flex items-center gap-1 border border-[#FFD700]/40"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Event</span>
        </button>

        {/* 💬 Devotee Feedback Inbox Button */}
        <button
          onClick={() => onOpenAdminModalMode('feedback-inbox')}
          className="px-2.5 py-1 rounded bg-black/40 text-white hover:bg-black/60 font-bold flex items-center gap-1 relative border border-white/20"
        >
          <MessageSquare className="w-3.5 h-3.5 text-[#FFD700]" />
          <span>Feedback Inbox ({feedbackCount})</span>
          {newFeedbackCount > 0 && (
            <span className="px-1.5 py-0.2 bg-[#FFD700] text-black text-[10px] font-extrabold rounded-full animate-pulse">
              {newFeedbackCount} New
            </span>
          )}
        </button>

        {/* ⚡ Cloud Database Sync Button */}
        <button
          onClick={() => onOpenAdminModalMode('cloud-sync')}
          className="px-2.5 py-1 rounded bg-black/40 text-[#FFD700] hover:bg-black/60 font-bold flex items-center gap-1 border border-[#D4AF37]/40"
        >
          <Cloud className="w-3.5 h-3.5 text-[#FFD700]" />
          <span>Cloud Sync</span>
        </button>

        {/* 🔴 TTD YouTube Live Stream Embed Settings Button */}
        <button
          onClick={() => onOpenAdminModalMode('youtube-live')}
          className="px-2.5 py-1 rounded bg-black/40 text-red-300 hover:text-white hover:bg-black/60 font-extrabold flex items-center gap-1 border border-red-500/50"
          title="Configure TTD Daily YouTube Live Stream URL"
        >
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
          <span>🔴 YouTube Live</span>
        </button>

        {/* Logout Admin */}
        <button
          onClick={onLogout}
          className="px-2.5 py-1 rounded bg-black/50 text-white hover:bg-black/70 font-bold flex items-center gap-1"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

import React from 'react';
import {
  Calendar,
  Share2,
  Edit,
  Trash2,
  ChevronRight
} from 'lucide-react';

export default function ScheduleEventActions({
  evt,
  lang,
  isAdminLoggedIn,
  openShareMenuId,
  setOpenShareMenuId,
  openCalendarMenuId,
  setOpenCalendarMenuId,
  handleShare,
  handleCalendar,
  onEditEvent,
  onDeleteEvent
}) {
  return (
    <div className="flex items-center gap-1.5 ml-auto sm:ml-0">
      {/* SHARE MENU */}
      <div className="relative">
        <button
          type="button"
          onClick={e => {
            e.stopPropagation();
            setOpenCalendarMenuId(null);
            setOpenShareMenuId(prev => (prev === evt.id ? null : evt.id));
          }}
          className="p-1.5 rounded-lg bg-[#FF5722] hover:bg-[#E64A19] text-white font-extrabold text-xs shadow"
          title="Share Event"
          aria-label="Share Event"
        >
          <Share2 className="w-3.5 h-3.5 text-white" />
        </button>

        {openShareMenuId === evt.id && (
          <div
            className="absolute right-0 top-full mt-2 z-50 w-48 rounded-xl border border-[#D4AF37]/50 bg-[#0B0E14] shadow-2xl p-2"
            onClick={e => e.stopPropagation()}
          >
            <div className="px-2 py-1.5 text-[10px] font-black uppercase tracking-wider text-[#FFD700] border-b border-white/10 mb-1">
              {lang === 'en' ? 'Share Event' : 'ఉత్సవాన్ని షేర్ చేయండి'}
            </div>

            <div className="grid grid-cols-2 gap-1">
              {[
                ['whatsapp', 'WhatsApp', 'bg-[#25D366] text-black'],
                ['x', 'X', 'bg-black text-white border border-white/20'],
                [
                  'instagram',
                  'Instagram',
                  'bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white'
                ],
                ['facebook', 'Facebook', 'bg-[#1877F2] text-white'],
                ['threads', 'Threads', 'bg-black text-white border border-white/20'],
                ['telegram', 'Telegram', 'bg-[#229ED9] text-white'],
                ['reddit', 'Reddit', 'bg-[#FF4500] text-white'],
                [
                  'copy',
                  'Copy Link',
                  'bg-[#141923] text-[#FFD700] border border-[#D4AF37]/40'
                ]
              ].map(([platform, label, classes]) => (
                <button
                  key={platform}
                  type="button"
                  onClick={e => handleShare(platform, evt, e)}
                  className={`px-2 py-2 rounded-lg text-[10px] font-extrabold shadow-sm hover:brightness-110 transition ${classes}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* CALENDAR MENU */}
      <div className="relative">
        <button
          type="button"
          onClick={e => {
            e.stopPropagation();
            setOpenShareMenuId(null);
            setOpenCalendarMenuId(prev => (prev === evt.id ? null : evt.id));
          }}
          className="p-1.5 rounded-lg bg-[#4285F4] hover:bg-[#3367D6] text-white font-extrabold text-xs shadow"
          title="Add to Calendar"
          aria-label="Add to Calendar"
        >
          <Calendar className="w-3.5 h-3.5 text-white" />
        </button>

        {openCalendarMenuId === evt.id && (
          <div
            className="absolute right-0 top-full mt-2 z-50 w-44 rounded-xl border border-[#D4AF37]/50 bg-[#0B0E14] shadow-2xl p-2"
            onClick={e => e.stopPropagation()}
          >
            <div className="px-2 py-1.5 text-[10px] font-black uppercase tracking-wider text-[#FFD700] border-b border-white/10 mb-1">
              {lang === 'en' ? 'Add to Calendar' : 'క్యాలెండర్‌కు జోడించండి'}
            </div>

            <button
              type="button"
              onClick={e => handleCalendar('google', evt, e)}
              className="w-full px-3 py-2 rounded-lg bg-[#4285F4] hover:bg-[#3367D6] text-white text-xs font-extrabold text-left"
            >
              Google Calendar
            </button>

            <button
              type="button"
              onClick={e => handleCalendar('apple', evt, e)}
              className="w-full mt-1 px-3 py-2 rounded-lg bg-black hover:bg-slate-900 border border-[#FFD700]/60 text-[#FFD700] text-xs font-extrabold text-left"
            >
              Apple Calendar / iCal
            </button>
          </div>
        )}
      </div>

      {/* DETAILS */}
      <span className="p-1.5 rounded-lg bg-[#141923] text-[#FFD700] group-hover:bg-[#FFD700] group-hover:text-black transition-colors">
        <ChevronRight className="w-4 h-4" />
      </span>

      {/* ADMIN */}
      {isAdminLoggedIn && (
        <>
          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              onEditEvent(evt);
            }}
            className="p-1.5 rounded bg-[#FF5722] text-white text-xs shadow hover:brightness-110"
            title="Edit Event"
          >
            <Edit className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={e => {
              e.stopPropagation();

              if (window.confirm(`Delete event "${evt.title}"?`)) {
                onDeleteEvent(evt.id);
              }
            }}
            className="p-1.5 rounded bg-red-900 text-white text-xs shadow hover:bg-red-700"
            title="Delete Event"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </>
      )}
    </div>
  );
}

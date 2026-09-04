import React from 'react';
import { Calendar, Clock, Image as ImageIcon } from 'lucide-react';
import { TEMPLES } from '../../data/templeEvents';
import { getEventStatus, normalizeImageUrl } from '../../utils/eventStatus';
import { formatScheduleDate } from '../../utils/calendarScheduleUtils';
import { formatEventTiming } from '../../utils/indiaTime';
import ScheduleEventActions from './ScheduleEventActions';

export default function ScheduleEventCard({
  evt,
  lang,
  todayStr,
  currentIST,
  onSelectEvent,
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
  const dateInfo = formatScheduleDate(evt.startDate, lang);

  const isToday = evt.startDate <= todayStr && evt.endDate >= todayStr;
  const isFuture = evt.startDate > todayStr;

  const temple = TEMPLES.find(t => t.id === evt.templeId);

  const statusObj = getEventStatus(evt, currentIST);

  const evtImages = [];

  if (Array.isArray(evt.images) && evt.images.length > 0) {
    evt.images.forEach(img => {
      if (typeof img === 'string' && img.trim()) {
        evtImages.push(normalizeImageUrl(img.trim()));
      } else if (img && img.url && img.url.trim()) {
        evtImages.push(normalizeImageUrl(img.url.trim()));
      }
    });
  }

  if (evtImages.length === 0 && evt.imageUrl) {
    evtImages.push(normalizeImageUrl(evt.imageUrl.trim()));
  }

  return (
    <div
      className="flex items-start gap-2.5 sm:gap-4 group cursor-pointer"
      onClick={() => onSelectEvent(evt)}
    >
      {/* DATE COLUMN */}
      <div className="w-14 sm:w-16 shrink-0 flex flex-col items-center pt-1">
        <span className="text-[11px] font-extrabold uppercase text-[#94A3B8]">
          {dateInfo.dayOfWeek}
        </span>

        <div
          className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-sm sm:text-base font-extrabold transition-transform group-hover:scale-110 shadow-md mt-0.5 ${
            isToday
              ? 'bg-gradient-to-tr from-[#FF5722] to-[#FFD700] text-black ring-4 ring-[#FF5722]/30 animate-pulse'
              : 'bg-[#141923] text-white border border-[#D4AF37]/50'
          }`}
        >
          {dateInfo.dayNum}
        </div>

        {/* TODAY LABEL */}
        {isToday && (
          <span className="mt-1 text-[8px] font-black uppercase text-[#FF5722] tracking-wide">
            {lang === 'en' ? 'Today' : 'ఈ రోజు'}
          </span>
        )}
      </div>

      {/* EVENT CARD */}
      <div
        className={`flex-grow glass-card p-3.5 sm:p-4 rounded-2xl border border-white/10 group-hover:border-[#FFD700] group-hover:scale-[1.01] transition-all duration-300 shadow-lg group-hover:shadow-2xl relative overflow-visible flex flex-col sm:flex-row justify-between gap-3 cursor-pointer ${
          isToday ? 'ring-1 ring-[#FF5722]/40' : ''
        }`}
        style={{
          borderLeft: `5px solid ${temple?.color || '#FFD700'}`
        }}
      >
        {/* EVENT DETAILS */}
        <div className="space-y-1.5 flex-grow">
          <div className="flex flex-wrap items-center gap-1.5">
            <span
              className="px-2 py-0.5 rounded text-[10px] font-extrabold text-black shadow"
              style={{
                backgroundColor: temple?.color || '#FFD700'
              }}
            >
              {lang === 'en'
                ? temple?.name || 'Tirumala'
                : temple?.nameTe || temple?.name || 'తిరుమల'}
            </span>

            {/* DYNAMIC EVENT STATUS (Rule H: Never hardcode TODAY as status) */}
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase shadow ${statusObj.colorClass}`}
            >
              {lang === 'en' ? statusObj.status : statusObj.statusTe}
            </span>

            {evtImages.length > 0 && (
              <span className="px-1.5 py-0.5 rounded bg-black/60 text-[#FFD700] text-[10px] font-bold flex items-center gap-1 border border-[#FFD700]/30">
                <ImageIcon className="w-3 h-3" />
                <span>{evtImages.length}</span>
              </span>
            )}
          </div>

          {/* TITLE */}
          <h4 className="event-card-title font-serif text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-[#FFD700] transition-colors leading-snug">
            {lang === 'en' ? evt.title : evt.titleTe || evt.title}
          </h4>

          {/* DATE RANGE / TIMING / VAHANAM */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#CBD5E1]">
            <span className="font-mono text-[#FFD700] font-bold flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 dark:text-[#FF5722] text-[#D84315]" />
              {evt.startDate === evt.endDate
                ? evt.startDate
                : `${evt.startDate} to ${evt.endDate}`}
            </span>

            <span className="font-mono text-amber-500 dark:text-[#FFD700] font-bold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#FF5722]" />
              {formatEventTiming(evt)}
            </span>

            {evt.vahanam && (
              <span className="vahanam-value font-bold">
                🛕 {evt.vahanam}
              </span>
            )}
          </div>

          {/* DESCRIPTION */}
          {(evt.description || evt.descriptionTe) && (
            <p className="text-xs text-[#CBD5E1] line-clamp-2 leading-relaxed">
              {lang === 'en'
                ? evt.description
                : evt.descriptionTe || evt.description}
            </p>
          )}
        </div>

        {/* RIGHT ACTION / IMAGE */}
        <div className="flex sm:flex-col items-center justify-between sm:justify-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 sm:border-l border-white/10 sm:pl-3">
          {evtImages.length > 0 && (
            <div className="w-20 h-16 sm:w-24 sm:h-20 rounded-xl overflow-hidden border border-white/20 relative shadow shrink-0">
              <img
                src={evtImages[0]}
                alt={evt.title || 'Temple event'}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                onError={e => {
                  e.currentTarget.parentElement.style.display = 'none';
                }}
              />

              {evtImages.length > 1 && (
                <span className="absolute bottom-1 right-1 px-1 py-0.2 rounded bg-black/80 text-[#FFD700] text-[8px] font-mono font-bold">
                  +{evtImages.length - 1}
                </span>
              )}
            </div>
          )}

          <ScheduleEventActions
            evt={evt}
            lang={lang}
            isAdminLoggedIn={isAdminLoggedIn}
            openShareMenuId={openShareMenuId}
            setOpenShareMenuId={setOpenShareMenuId}
            openCalendarMenuId={openCalendarMenuId}
            setOpenCalendarMenuId={setOpenCalendarMenuId}
            handleShare={handleShare}
            handleCalendar={handleCalendar}
            onEditEvent={onEditEvent}
            onDeleteEvent={onDeleteEvent}
          />
        </div>
      </div>
    </div>
  );
}

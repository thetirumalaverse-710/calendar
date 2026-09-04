import React, { useState } from 'react';

import {
  openGoogleCalendar,
  openAppleCalendar,
  shareToPlatform
} from '../utils/eventStatus';

import {
  getTodayStr,
  getCurrentMonthKey,
  formatScheduleDate
} from '../utils/calendarScheduleUtils';

import useCurrentIST from '../hooks/useCurrentIST';

import ScheduleViewHeader from './schedule/ScheduleViewHeader';
import ScheduleEmptyState from './schedule/ScheduleEmptyState';
import ScheduleEventCard from './schedule/ScheduleEventCard';

export default function CalendarScheduleView({
  events,
  lang,
  onSelectEvent,
  selectedTemple,
  isAdminLoggedIn,
  onEditEvent,
  onDeleteEvent
}) {
  const currentIST = useCurrentIST();
  const todayStr = currentIST.dateStr;

  const [activeMonthFilter, setActiveMonthFilter] = useState(() =>
    getCurrentMonthKey(todayStr, lang)
  );

  // Per-event action menus
  const [openShareMenuId, setOpenShareMenuId] = useState(null);
  const [openCalendarMenuId, setOpenCalendarMenuId] = useState(null);

  const handleShare = (platform, evt, e) => {
    e.stopPropagation();
    shareToPlatform(platform, evt, lang);
    setOpenShareMenuId(null);
  };

  const handleCalendar = (type, evt, e) => {
    e.stopPropagation();

    if (type === 'google') {
      openGoogleCalendar(evt);
    } else if (type === 'apple') {
      openAppleCalendar(evt);
    }

    setOpenCalendarMenuId(null);
  };

  /*
   * -------------------------------------------------------------
   * IMPORTANT:
   * REMOVE COMPLETED EVENTS
   *
   * Event is visible if:
   *  endDate >= todayStr
   * -------------------------------------------------------------
   */
  const upcomingEvents = (Array.isArray(events) ? events : [])
    .filter(evt => {
      if (!evt?.startDate || !evt?.endDate) {
        return false;
      }

      return evt.endDate >= todayStr;
    })
    .sort((a, b) => {
      const dateCompare = a.startDate.localeCompare(b.startDate);

      if (dateCompare !== 0) {
        return dateCompare;
      }

      return String(a.title || '').localeCompare(String(b.title || ''));
    });

  /*
   * -------------------------------------------------------------
   * GROUP EVENTS BY MONTH
   * -------------------------------------------------------------
   */
  const eventsByMonth = upcomingEvents.reduce((acc, evt) => {
    const { monthFull } = formatScheduleDate(evt.startDate, lang);

    const key = monthFull || evt.startDate.substring(0, 7);

    if (!acc[key]) {
      acc[key] = [];
    }

    acc[key].push(evt);

    return acc;
  }, {});

  const monthKeys = Object.keys(eventsByMonth);

  /*
   * -------------------------------------------------------------
   * FALLBACK MONTH FILTER
   * -------------------------------------------------------------
   */
  const effectiveMonthFilter =
    activeMonthFilter !== 'all' && !monthKeys.includes(activeMonthFilter)
      ? monthKeys.length > 0
        ? monthKeys[0]
        : 'all'
      : activeMonthFilter;

  /*
   * -------------------------------------------------------------
   * FORMAT TODAY LABEL
   * -------------------------------------------------------------
   */
  const todayLabel = (() => {
    try {
      const [y, m, d] = todayStr.split('-').map(Number);

      const date = new Date(y, m - 1, d);

      return date.toLocaleDateString(lang === 'en' ? 'en-IN' : 'te-IN', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return todayStr;
    }
  })();

  return (
    <div className="space-y-6">
      {/* SCHEDULE HEADER */}
      <ScheduleViewHeader
        lang={lang}
        todayLabel={todayLabel}
        monthKeys={monthKeys}
        effectiveMonthFilter={effectiveMonthFilter}
        setActiveMonthFilter={setActiveMonthFilter}
      />

      {/* NO UPCOMING EVENTS */}
      {upcomingEvents.length === 0 && <ScheduleEmptyState lang={lang} />}

      {/* UPCOMING EVENTS */}
      {monthKeys.map(monthName => {
        if (
          effectiveMonthFilter !== 'all' &&
          effectiveMonthFilter !== monthName
        ) {
          return null;
        }

        const monthEvents = eventsByMonth[monthName];

        return (
          <div key={monthName} className="space-y-3">
            {/* Month Header */}
            <div className="sticky top-16 z-20 bg-[#0B0E14]/95 backdrop-blur-md py-2 px-3 rounded-xl border-b border-[#D4AF37]/30 flex items-center justify-between shadow-md">
              <span className="font-serif font-extrabold text-sm sm:text-base text-[#FFD700] tracking-wide flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FF5722]" />
                {monthName}
              </span>

              <span className="text-[11px] font-mono font-bold text-[#94A3B8] bg-[#141923] px-2.5 py-0.5 rounded-full border border-white/10">
                {monthEvents.length}{' '}
                {lang === 'en'
                  ? monthEvents.length === 1
                    ? 'upcoming event'
                    : 'upcoming events'
                  : 'రాబోయే ఉత్సవాలు'}
              </span>
            </div>

            {/* EVENT LIST */}
            <div className="space-y-3 pl-1 sm:pl-2">
              {monthEvents.map(evt => (
                <ScheduleEventCard
                  key={evt.id}
                  evt={evt}
                  lang={lang}
                  todayStr={todayStr}
                  currentIST={currentIST}
                  onSelectEvent={onSelectEvent}
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
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
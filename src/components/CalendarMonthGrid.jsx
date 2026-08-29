import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import CalendarMonthHeader from './calendar/CalendarMonthHeader';
import MobileMonthCalendar from './calendar/MobileMonthCalendar';
import MobileSelectedDayEvents from './calendar/MobileSelectedDayEvents';
import DesktopMonthGrid from './calendar/DesktopMonthGrid';
import {
  MONTHS_LIST,
  getTodayIST,
  getDateString,
  getInitialMonthIndex,
  getEventsForDate,
  getMonthPrefix
} from '../utils/calendarMonthUtils';

export default function CalendarMonthGrid({
  events,
  lang,
  onSelectEvent,
  selectedTemple
}) {
  const [activeMonthIndex, setActiveMonthIndex] = useState(
    getInitialMonthIndex
  );

  const [selectedDate, setSelectedDate] = useState(getTodayIST());

  const gridContainerRef = useRef(null);
  const activeIndexRef = useRef(activeMonthIndex);

  useEffect(() => {
    activeIndexRef.current = activeMonthIndex;
  }, [activeMonthIndex]);

  const activeMonth = MONTHS_LIST[activeMonthIndex];

  const firstDayIndex = new Date(
    activeMonth.year,
    activeMonth.month,
    1
  ).getDay();

  const totalDays = new Date(
    activeMonth.year,
    activeMonth.month + 1,
    0
  ).getDate();

  const getEventsForDay = dayNum => {
    return getEventsForDate(
      events,
      getDateString(
        activeMonth.year,
        activeMonth.month,
        dayNum
      )
    );
  };

  const handlePrevMonth = () => {
    if (activeMonthIndex > 0) {
      setActiveMonthIndex(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (activeMonthIndex < MONTHS_LIST.length - 1) {
      setActiveMonthIndex(prev => prev + 1);
    }
  };

  const handleMonthChange = e => {
    const nextIndex = Number(e.target.value);
    setActiveMonthIndex(nextIndex);

    const nextMonth = MONTHS_LIST[nextIndex];

    const today = getTodayIST();

    const isCurrentMonth =
      today.startsWith(
        getMonthPrefix(nextMonth.year, nextMonth.month)
      );

    if (isCurrentMonth) {
      setSelectedDate(today);
      return;
    }

    const firstEvent = (events || [])
      .filter(evt => {
        if (!evt?.startDate) return false;

        const prefix =
          getMonthPrefix(nextMonth.year, nextMonth.month);

        return evt.startDate.startsWith(prefix);
      })
      .sort((a, b) =>
        a.startDate.localeCompare(b.startDate)
      )[0];

    if (firstEvent) {
      setSelectedDate(firstEvent.startDate);
    } else {
      setSelectedDate(
        getDateString(nextMonth.year, nextMonth.month, 1)
      );
    }
  };

  /*
   * Keep selected date aligned with the active month.
   */
  useEffect(() => {
    const monthPrefix =
      getMonthPrefix(activeMonth.year, activeMonth.month);

    if (!selectedDate.startsWith(monthPrefix)) {
      const today = getTodayIST();

      if (today.startsWith(monthPrefix)) {
        setSelectedDate(today);
        return;
      }

      const firstEvent = (events || [])
        .filter(evt =>
          evt?.startDate?.startsWith(monthPrefix)
        )
        .sort((a, b) =>
          a.startDate.localeCompare(b.startDate)
        )[0];

      if (firstEvent) {
        setSelectedDate(firstEvent.startDate);
      } else {
        setSelectedDate(
          getDateString(
            activeMonth.year,
            activeMonth.month,
            1
          )
        );
      }
    }
  }, [
    activeMonth.year,
    activeMonth.month,
    selectedDate,
    events
  ]);

  /*
   * Swipe / drag support.
   */
  useEffect(() => {
    const el = gridContainerRef.current;
    if (!el) return;

    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let currentY = 0;
    let isDragging = false;

    const start = (x, y) => {
      startX = x;
      startY = y;
      currentX = x;
      currentY = y;
      isDragging = true;
    };

    const move = (x, y) => {
      if (!isDragging) return;

      currentX = x;
      currentY = y;
    };

    const end = () => {
      if (!isDragging) return;

      isDragging = false;

      const diffX = startX - currentX;
      const diffY = startY - currentY;

      if (
        Math.abs(diffX) > 35 &&
        Math.abs(diffX) > Math.abs(diffY)
      ) {
        if (
          diffX > 0 &&
          activeIndexRef.current <
            MONTHS_LIST.length - 1
        ) {
          setActiveMonthIndex(prev => prev + 1);
        }

        if (
          diffX < 0 &&
          activeIndexRef.current > 0
        ) {
          setActiveMonthIndex(prev => prev - 1);
        }
      }
    };

    const onTouchStart = e => {
      if (
        e.target.closest('button') ||
        e.target.closest('select') ||
        e.target.closest('a') ||
        e.target.closest('input')
      ) {
        return;
      }

      if (e.touches?.length === 1) {
        start(
          e.touches[0].clientX,
          e.touches[0].clientY
        );
      }
    };

    const onTouchMove = e => {
      if (e.touches?.length === 1) {
        move(
          e.touches[0].clientX,
          e.touches[0].clientY
        );
      }
    };

    const onTouchEnd = () => {
      end();
    };

    const onMouseDown = e => {
      if (
        e.target.closest('button') ||
        e.target.closest('select') ||
        e.target.closest('a') ||
        e.target.closest('input')
      ) {
        return;
      }

      if (e.button === 0) {
        e.preventDefault();

        start(e.clientX, e.clientY);
      }
    };

    const onMouseMove = e => {
      if (isDragging) {
        move(e.clientX, e.clientY);
      }
    };

    const onMouseUp = () => {
      end();
    };

    const onKeyDown = e => {
      if (
        e.target.tagName === 'INPUT' ||
        e.target.tagName === 'TEXTAREA' ||
        e.target.tagName === 'SELECT'
      ) {
        return;
      }

      if (e.key === 'ArrowLeft') {
        handlePrevMonth();
      }

      if (e.key === 'ArrowRight') {
        handleNextMonth();
      }
    };

    el.addEventListener(
      'touchstart',
      onTouchStart,
      { passive: true }
    );

    el.addEventListener(
      'touchmove',
      onTouchMove,
      { passive: true }
    );

    el.addEventListener(
      'touchend',
      onTouchEnd,
      { passive: true }
    );

    el.addEventListener(
      'mousedown',
      onMouseDown
    );

    window.addEventListener(
      'mousemove',
      onMouseMove
    );

    window.addEventListener(
      'mouseup',
      onMouseUp
    );

    window.addEventListener(
      'keydown',
      onKeyDown
    );

    return () => {
      el.removeEventListener(
        'touchstart',
        onTouchStart
      );

      el.removeEventListener(
        'touchmove',
        onTouchMove
      );

      el.removeEventListener(
        'touchend',
        onTouchEnd
      );

      el.removeEventListener(
        'mousedown',
        onMouseDown
      );

      window.removeEventListener(
        'mousemove',
        onMouseMove
      );

      window.removeEventListener(
        'mouseup',
        onMouseUp
      );

      window.removeEventListener(
        'keydown',
        onKeyDown
      );
    };
  }, [activeMonthIndex]);

  const selectedDayEvents =
    getEventsForDate(events, selectedDate);

  const selectedDateObject = new Date(
    `${selectedDate}T00:00:00`
  );

  const selectedDateLabel =
    selectedDateObject.toLocaleDateString(
      lang === 'en' ? 'en-IN' : 'te-IN',
      {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }
    );

  return (
    <div
      ref={gridContainerRef}
      className="space-y-4"
    >
      {/* =========================================================
          MONTH NAVIGATION
      ========================================================== */}

      <CalendarMonthHeader
        lang={lang}
        activeMonth={activeMonth}
        activeMonthIndex={activeMonthIndex}
        onMonthChange={handleMonthChange}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
      />

      {/* =========================================================
          MOBILE CALENDAR
      ========================================================== */}

      <div className="block sm:hidden">

        <MobileMonthCalendar
          lang={lang}
          activeMonth={activeMonth}
          firstDayIndex={firstDayIndex}
          totalDays={totalDays}
          selectedDate={selectedDate}
          selectedDateLabel={selectedDateLabel}
          selectedDayEvents={selectedDayEvents}
          getEventsForDay={getEventsForDay}
          onSelectDate={setSelectedDate}
        />

        {/* =======================================================
            MOBILE SELECTED-DAY EVENTS
        ======================================================== */}

        <MobileSelectedDayEvents
          lang={lang}
          selectedDayEvents={selectedDayEvents}
          onSelectEvent={onSelectEvent}
        />
      </div>

      {/* =========================================================
          DESKTOP CALENDAR
          Existing desktop experience preserved.
      ========================================================== */}

      <div className="hidden sm:block">

        <div className="rounded-2xl border-2 border-[#D4AF37]/40 bg-[#0B0E14] shadow-2xl p-6 relative">

          {activeMonthIndex > 0 && (
            <button
              type="button"
              onClick={handlePrevMonth}
              className="absolute left-1 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-black/80 text-[#FFD700] border border-[#FFD700]/50 flex items-center justify-center shadow-lg active:scale-90"
              title="Previous Month"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {activeMonthIndex <
            MONTHS_LIST.length - 1 && (
            <button
              type="button"
              onClick={handleNextMonth}
              className="absolute right-1 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-black/80 text-[#FFD700] border border-[#FFD700]/50 flex items-center justify-center shadow-lg active:scale-90"
              title="Next Month"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}

          <DesktopMonthGrid
            monthObj={activeMonth}
            events={events}
            lang={lang}
            onSelectEvent={onSelectEvent}
          />
        </div>
      </div>
    </div>
  );
}

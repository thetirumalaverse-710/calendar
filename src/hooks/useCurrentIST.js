import { useState, useEffect } from 'react';
import { getISTNowComponents } from '../utils/indiaTime';

/**
 * Lightweight React hook that keeps current IST components in state.
 * Triggers status recalculations exactly across minute boundaries and on safety intervals.
 * Zero database writes, zero network requests.
 */
export default function useCurrentIST(safetyIntervalMs = 15000) {
  const [currentIST, setCurrentIST] = useState(() => getISTNowComponents());

  useEffect(() => {
    let timeoutId = null;
    let intervalId = null;
    let isMounted = true;

    const tick = () => {
      if (!isMounted) return;
      const now = getISTNowComponents();
      setCurrentIST(prev => {
        if (
          prev.dateStr !== now.dateStr ||
          prev.totalMinutes !== now.totalMinutes
        ) {
          return now;
        }
        return prev;
      });
      scheduleNextMinute();
    };

    const scheduleNextMinute = () => {
      if (!isMounted) return;
      const now = new Date();
      // Milliseconds until the start of the next minute + 50ms buffer
      const msUntilNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds() + 50;
      timeoutId = setTimeout(tick, Math.max(msUntilNextMinute, 1000));
    };

    scheduleNextMinute();

    // 15-second safety interval to guard against device sleep / background throttling
    if (safetyIntervalMs > 0) {
      intervalId = setInterval(() => {
        if (!isMounted) return;
        const now = getISTNowComponents();
        setCurrentIST(prev => {
          if (
            prev.dateStr !== now.dateStr ||
            prev.totalMinutes !== now.totalMinutes
          ) {
            return now;
          }
          return prev;
        });
      }, safetyIntervalMs);
    }

    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [safetyIntervalMs]);

  return currentIST;
}

export function getIndiaDateString(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function getIndiaDateTimeLocalValue(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  const values = Object.fromEntries(
    parts.map(({ type, value }) => [type, value])
  );

  return `${values.year}-${values.month}-${values.day}T${values.hour}:${values.minute}`;
}

export function isIndiaWednesday(date = new Date()) {
  const dateStr = getIndiaDateString(date);
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day, 12, 0, 0).getDay() === 3;
}

/**
 * Get current date & time breakdown in Asia/Kolkata (IST) timezone.
 * Returns canonical dateStr ("YYYY-MM-DD"), hour, minute, totalMinutes past midnight.
 */
export function getISTNowComponents(overrideDate = null) {
  const dateObj = overrideDate ? new Date(overrideDate) : new Date();

  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });

  const parts = formatter.formatToParts(dateObj);
  const map = {};
  for (const p of parts) {
    if (p.type !== "literal") map[p.type] = p.value;
  }

  let hour = parseInt(map.hour, 10);
  if (hour === 24) hour = 0;
  const minute = parseInt(map.minute, 10);
  const second = parseInt(map.second || "0", 10);
  const totalMinutes = hour * 60 + minute;

  return {
    dateObj,
    dateStr: `${map.year}-${map.month}-${map.day}`,
    timeStr: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`,
    hour,
    minute,
    second,
    totalMinutes,
  };
}

/**
 * Parse time string ("08:30", "08:30:00", or 12h "08:30 AM") into total minutes past midnight.
 */
export function parseTimeToMinutes(timeStr) {
  if (!timeStr || typeof timeStr !== 'string') return null;
  const str = timeStr.trim().toUpperCase();
  if (!str) return null;

  // 12-hour AM/PM format (e.g., "08:30 AM", "8:30 PM", "12:00 AM", "12 PM")
  const match12 = str.match(/^(\d{1,2})(?::(\d{2}))?(?::\d{2})?\s*(AM|PM)$/i);
  if (match12) {
    let h = parseInt(match12[1], 10);
    const m = match12[2] ? parseInt(match12[2], 10) : 0;
    const ampm = match12[3].toUpperCase();
    if (ampm === 'PM' && h < 12) h += 12;
    if (ampm === 'AM' && h === 12) h = 0;
    return h * 60 + m;
  }

  // 24-hour "HH:MM" or "HH:MM:SS"
  const match24 = str.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
  if (match24) {
    const h = parseInt(match24[1], 10);
    const m = parseInt(match24[2], 10);
    if (h >= 0 && h < 24 && m >= 0 && m < 60) {
      return h * 60 + m;
    }
  }

  return null;
}

/**
 * Format 24-hour "HH:mm" or "HH:mm:ss" to 12-hour "h:mm AM/PM" string.
 */
export function formatTime12Hr(timeStr) {
  if (!timeStr || typeof timeStr !== 'string') return '';
  const clean = timeStr.trim();
  if (!clean) return '';

  // Check if already in 12-hour format
  if (/AM|PM/i.test(clean)) return clean;

  const parts = clean.split(':');
  let h = parseInt(parts[0], 10);
  if (isNaN(h)) return clean;
  const m = parts[1] ? parts[1].padStart(2, '0') : '00';
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${m} ${ampm}`;
}

/**
 * Format human-readable event timing:
 * - If startTime & endTime: "8:30 AM – 10:30 AM"
 * - If only startTime: "8:30 AM"
 * - If legacy time string exists: return it
 * - Fallback: "7:00 AM"
 */
export function formatEventTiming(event) {
  if (!event) return '7:00 AM';

  const startTime = event.startTime;
  const endTime = event.endTime;

  if (startTime) {
    const formattedStart = formatTime12Hr(startTime);
    if (endTime) {
      const formattedEnd = formatTime12Hr(endTime);
      return `${formattedStart} – ${formattedEnd}`;
    }
    return formattedStart;
  }

  if (event.time && typeof event.time === 'string' && event.time.trim()) {
    return event.time.trim();
  }

  return '7:00 AM';
}
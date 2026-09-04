/**
 * DETERMINISTIC TEST SUITE FOR EVENT TIMING & AUTOMATIC EVENT CARD STATUS
 * Tests Rules A through M, including all edge cases from the specification.
 */

import { getEventStatus } from '../src/utils/eventStatus.js';
import {
  getISTNowComponents,
  parseTimeToMinutes,
  formatTime12Hr,
  formatEventTiming,
  getIndiaDateString
} from '../src/utils/indiaTime.js';
import { getEventsForDate } from '../src/utils/calendarMonthUtils.js';

console.log('\n============================================================');
console.log('RUNNING EVENT TIMING & CARD STATUS DETERMINISTIC TEST SUITE');
console.log('============================================================\n');

let passed = 0;
let failed = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`[PASS] ${testName}`);
    passed++;
  } else {
    console.error(`[FAIL] ${testName}`);
    failed++;
  }
}

// -------------------------------------------------------------
// 1. DATE HANDLING & TOMORROW EVENT ISOLATION (Rule A & I)
// -------------------------------------------------------------
const todayDateStr = '2026-09-04';
const tomorrowDateStr = '2026-09-05';

const tomorrowEvent = {
  id: 'evt-tomorrow',
  title: 'Tomorrow Special Seva',
  startDate: tomorrowDateStr,
  endDate: tomorrowDateStr,
  startTime: '08:30',
  endTime: '10:30'
};

const todayEvents = getEventsForDate([tomorrowEvent], todayDateStr);
assert(
  todayEvents.length === 0,
  '1A: Tomorrow event (Sep 5) MUST NOT appear in today\'s events list (Sep 4)'
);

const tomorrowEvents = getEventsForDate([tomorrowEvent], tomorrowDateStr);
assert(
  tomorrowEvents.length === 1 && tomorrowEvents[0].id === 'evt-tomorrow',
  '1B: Tomorrow event MUST appear in tomorrow\'s events list (Sep 5)'
);

const statusTomorrowOnToday = getEventStatus(tomorrowEvent, {
  dateStr: todayDateStr,
  totalMinutes: 12 * 60 // 12:00 PM today
});
assert(
  statusTomorrowOnToday.status === 'UPCOMING',
  '1C: Event tomorrow evaluated on today must have status UPCOMING'
);

// -------------------------------------------------------------
// 2. SINGLE-DAY EVENT TIMING RULES (Rule C)
// -------------------------------------------------------------
const timedEvent = {
  id: 'evt-timed',
  title: 'SSD Seva',
  startDate: todayDateStr,
  endDate: todayDateStr,
  startTime: '08:30',
  endTime: '10:30'
};

// 08:29 AM -> UPCOMING
assert(
  getEventStatus(timedEvent, { dateStr: todayDateStr, totalMinutes: 8 * 60 + 29 }).status === 'UPCOMING',
  '2A: 08:29 AM IST -> UPCOMING (before 08:30 start)'
);

// 08:30 AM -> LIVE
assert(
  getEventStatus(timedEvent, { dateStr: todayDateStr, totalMinutes: 8 * 60 + 30 }).status === 'LIVE',
  '2B: 08:30 AM IST -> LIVE (exact start time)'
);

// 09:15 AM -> LIVE
assert(
  getEventStatus(timedEvent, { dateStr: todayDateStr, totalMinutes: 9 * 60 + 15 }).status === 'LIVE',
  '2C: 09:15 AM IST -> LIVE (during event window)'
);

// 10:30 AM -> LIVE
assert(
  getEventStatus(timedEvent, { dateStr: todayDateStr, totalMinutes: 10 * 60 + 30 }).status === 'LIVE',
  '2D: 10:30 AM IST -> LIVE (exact end time)'
);

// 10:31 AM -> COMPLETED
assert(
  getEventStatus(timedEvent, { dateStr: todayDateStr, totalMinutes: 10 * 60 + 31 }).status === 'COMPLETED',
  '2E: 10:31 AM IST -> COMPLETED (after end time)'
);

// 11:00 AM -> COMPLETED
assert(
  getEventStatus(timedEvent, { dateStr: todayDateStr, totalMinutes: 11 * 60 }).status === 'COMPLETED',
  '2F: 11:00 AM IST -> COMPLETED'
);

// -------------------------------------------------------------
// 3. SINGLE-DAY EVENT WITH NO END TIME (Rule C & Section 4)
// -------------------------------------------------------------
const noEndEvent = {
  id: 'evt-no-end',
  title: 'Procession With No End Time',
  startDate: todayDateStr,
  endDate: todayDateStr,
  startTime: '08:30',
  endTime: null
};

// 08:00 AM -> UPCOMING
assert(
  getEventStatus(noEndEvent, { dateStr: todayDateStr, totalMinutes: 8 * 60 }).status === 'UPCOMING',
  '3A: No end time: 08:00 AM IST -> UPCOMING'
);

// 08:30 AM -> LIVE
assert(
  getEventStatus(noEndEvent, { dateStr: todayDateStr, totalMinutes: 8 * 60 + 30 }).status === 'LIVE',
  '3B: No end time: 08:30 AM IST -> LIVE'
);

// 11:00 AM -> LIVE (must NOT be marked completed)
assert(
  getEventStatus(noEndEvent, { dateStr: todayDateStr, totalMinutes: 11 * 60 }).status === 'LIVE',
  '3C: No end time: 11:00 AM IST -> LIVE (remains active through the day)'
);

// 11:59 PM -> LIVE
assert(
  getEventStatus(noEndEvent, { dateStr: todayDateStr, totalMinutes: 23 * 60 + 59 }).status === 'LIVE',
  '3D: No end time: 11:59 PM IST -> LIVE (remains active until end of day)'
);

// Next day -> COMPLETED
assert(
  getEventStatus(noEndEvent, { dateStr: tomorrowDateStr, totalMinutes: 1 }).status === 'COMPLETED',
  '3E: No end time: Next day (Sep 5) -> COMPLETED'
);

// -------------------------------------------------------------
// 4. DEFAULT TIMING FOR UNKNOWN/LEGACY EVENTS (Rule E & Section 2)
// -------------------------------------------------------------
const legacyEvent = {
  id: 'evt-legacy',
  title: 'Legacy Event Without Timing',
  startDate: todayDateStr,
  endDate: todayDateStr,
  startTime: null,
  endTime: null
};

// 06:59 AM -> UPCOMING (defaults to 07:00 AM start)
assert(
  getEventStatus(legacyEvent, { dateStr: todayDateStr, totalMinutes: 6 * 60 + 59 }).status === 'UPCOMING',
  '4A: Default timing: 06:59 AM IST -> UPCOMING (before default 07:00 AM)'
);

// 07:00 AM -> LIVE
assert(
  getEventStatus(legacyEvent, { dateStr: todayDateStr, totalMinutes: 7 * 60 }).status === 'LIVE',
  '4B: Default timing: 07:00 AM IST -> LIVE (at default 07:00 AM)'
);

// 03:00 PM -> LIVE (no invented end time, remains active throughout date)
assert(
  getEventStatus(legacyEvent, { dateStr: todayDateStr, totalMinutes: 15 * 60 }).status === 'LIVE',
  '4C: Default timing: 03:00 PM IST -> LIVE (remains active through the day)'
);

// Next day -> COMPLETED
assert(
  getEventStatus(legacyEvent, { dateStr: tomorrowDateStr, totalMinutes: 10 }).status === 'COMPLETED',
  '4D: Default timing: Next day -> COMPLETED'
);

// -------------------------------------------------------------
// 5. MULTI-DAY EVENT BOUNDARIES (Rule D)
// -------------------------------------------------------------
const multiDayEvent = {
  id: 'evt-multiday',
  title: 'Three-Day Utsavam',
  startDate: '2026-09-03',
  endDate: '2026-09-05',
  startTime: '08:30',
  endTime: '10:30'
};

// Before start date -> UPCOMING
assert(
  getEventStatus(multiDayEvent, { dateStr: '2026-09-02', totalMinutes: 12 * 60 }).status === 'UPCOMING',
  '5A: Multi-day: Before start date (Sep 2) -> UPCOMING'
);

// Start date before start time -> UPCOMING
assert(
  getEventStatus(multiDayEvent, { dateStr: '2026-09-03', totalMinutes: 8 * 60 }).status === 'UPCOMING',
  '5B: Multi-day: Start date 08:00 AM -> UPCOMING'
);

// Start date after start time -> LIVE
assert(
  getEventStatus(multiDayEvent, { dateStr: '2026-09-03', totalMinutes: 9 * 60 }).status === 'LIVE',
  '5C: Multi-day: Start date 09:00 AM -> LIVE'
);

// Start date afternoon (after 10:30) -> LIVE (end time does NOT apply to start day)
assert(
  getEventStatus(multiDayEvent, { dateStr: '2026-09-03', totalMinutes: 15 * 60 }).status === 'LIVE',
  '5D: Multi-day: Start date afternoon -> LIVE'
);

// Intermediate day (Sep 4) all day -> LIVE
assert(
  getEventStatus(multiDayEvent, { dateStr: '2026-09-04', totalMinutes: 2 * 60 }).status === 'LIVE' &&
  getEventStatus(multiDayEvent, { dateStr: '2026-09-04', totalMinutes: 14 * 60 }).status === 'LIVE' &&
  getEventStatus(multiDayEvent, { dateStr: '2026-09-04', totalMinutes: 23 * 60 }).status === 'LIVE',
  '5E: Multi-day: Intermediate day (Sep 4) -> ALWAYS LIVE'
);

// Final day before end time -> LIVE
assert(
  getEventStatus(multiDayEvent, { dateStr: '2026-09-05', totalMinutes: 10 * 60 }).status === 'LIVE',
  '5F: Multi-day: Final day 10:00 AM -> LIVE'
);

// Final day at end time -> LIVE
assert(
  getEventStatus(multiDayEvent, { dateStr: '2026-09-05', totalMinutes: 10 * 60 + 30 }).status === 'LIVE',
  '5G: Multi-day: Final day 10:30 AM -> LIVE'
);

// Final day after end time -> COMPLETED
assert(
  getEventStatus(multiDayEvent, { dateStr: '2026-09-05', totalMinutes: 10 * 60 + 31 }).status === 'COMPLETED',
  '5H: Multi-day: Final day 10:31 AM -> COMPLETED'
);

// After final day -> COMPLETED
assert(
  getEventStatus(multiDayEvent, { dateStr: '2026-09-06', totalMinutes: 9 * 60 }).status === 'COMPLETED',
  '5I: Multi-day: After final day (Sep 6) -> COMPLETED'
);

// -------------------------------------------------------------
// 6. TIME FORMATTING AND PARSING
// -------------------------------------------------------------
assert(parseTimeToMinutes('08:30') === 510, '6A: parseTimeToMinutes("08:30") === 510');
assert(parseTimeToMinutes('08:30:00') === 510, '6B: parseTimeToMinutes("08:30:00") === 510');
assert(parseTimeToMinutes('08:30 AM') === 510, '6C: parseTimeToMinutes("08:30 AM") === 510');
assert(parseTimeToMinutes('10:30 PM') === 22 * 60 + 30, '6D: parseTimeToMinutes("10:30 PM") === 1350');
assert(parseTimeToMinutes('12:00 AM') === 0, '6E: parseTimeToMinutes("12:00 AM") === 0');
assert(parseTimeToMinutes('12:00 PM') === 720, '6F: parseTimeToMinutes("12:00 PM") === 720');

assert(formatTime12Hr('08:30') === '8:30 AM', '6G: formatTime12Hr("08:30") === "8:30 AM"');
assert(formatTime12Hr('20:30') === '8:30 PM', '6H: formatTime12Hr("20:30") === "8:30 PM"');
assert(formatTime12Hr('00:00') === '12:00 AM', '6I: formatTime12Hr("00:00") === "12:00 AM"');
assert(formatTime12Hr('12:00') === '12:00 PM', '6J: formatTime12Hr("12:00") === "12:00 PM"');

assert(
  formatEventTiming({ startTime: '08:30', endTime: '10:30' }) === '8:30 AM – 10:30 AM',
  '6K: formatEventTiming with start & end -> "8:30 AM – 10:30 AM"'
);

assert(
  formatEventTiming({ startTime: '08:30' }) === '8:30 AM',
  '6L: formatEventTiming with only start -> "8:30 AM"'
);

assert(
  formatEventTiming({}) === '7:00 AM',
  '6M: formatEventTiming fallback -> "7:00 AM"'
);

console.log('\n============================================================');
console.log(`TEST SUITE RESULTS: ${passed} PASSED, ${failed} FAILED`);
console.log('============================================================\n');

if (failed > 0) {
  process.exit(1);
}

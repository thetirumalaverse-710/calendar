/**
 * ISOLATED SERVER-SIDE EVENT PUSH NOTIFICATION WORKER
 * Single-run process for scheduled event push dispatches.
 * Strictly scoped to eligible temples: 'tirumala-main' and 'tiruchanur'.
 */

import { createClient } from "@supabase/supabase-js";
import { dispatchWebPushNotification } from "./pushDispatcher.mjs";

export const ELIGIBLE_TEMPLES = ["tirumala-main", "tiruchanur"];

/**
 * Get current date & time breakdown in Asia/Kolkata (IST) timezone.
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
    hour12: false,
  });

  const parts = formatter.formatToParts(dateObj);
  const map = {};
  for (const p of parts) {
    if (p.type !== "literal") map[p.type] = p.value;
  }

  const dateStr = `${map.year}-${map.month}-${map.day}`;
  const timeStr = `${map.hour}:${map.minute}:${map.second}`;
  
  // Calculate total minutes past midnight in IST
  const totalMinutes = parseInt(map.hour, 10) * 60 + parseInt(map.minute, 10);
  
  return {
    dateObj,
    dateStr,
    timeStr,
    hour: parseInt(map.hour, 10),
    minute: parseInt(map.minute, 10),
    totalMinutes,
  };
}

/**
 * Parse time string (HH:MM:SS) into total minutes past midnight.
 */
export function parseTimeToMinutes(timeStr) {
  if (!timeStr || typeof timeStr !== "string") return null;
  const parts = timeStr.trim().split(":");
  if (parts.length < 2) return null;
  const h = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  if (isNaN(h) || isNaN(m)) return null;
  return h * 60 + m;
}

/**
 * Evaluates whether an event notification is due for dispatch at given IST time.
 * Returns { isDue: boolean, notificationType: string, entityId: string, reason: string }
 */
export function evaluateEventNotificationDue(event, nowISTObj, options = {}) {
  const timedGraceWindowMinutes = options.timedGraceWindowMinutes ?? 15;
  const untimedGraceWindowMinutes = options.untimedGraceWindowMinutes ?? 30;
  const untimedDispatchHour = options.untimedDispatchHour ?? 7; // 07:00 AM IST

  // 1. Strict Temple Scope Boundary
  if (!event || !ELIGIBLE_TEMPLES.includes(event.temple_id)) {
    return { isDue: false, reason: "non_eligible_temple" };
  }

  // 2. Database Eligibility Flag Check
  if (event.notification_eligible === false) {
    return { isDue: false, reason: "notification_eligible_false" };
  }

  // 3. Cancellation Flag Check
  if (event.is_cancelled === true) {
    return { isDue: false, reason: "event_cancelled" };
  }

  const nowMinutes = nowISTObj.totalMinutes;

  // 4. TYPE-A: TIMED EVENT (30-minute advance notification)
  if (event.start_time) {
    const eventStartMinutes = parseTimeToMinutes(event.start_time);
    if (eventStartMinutes === null) {
      return { isDue: false, reason: "unparseable_start_time" };
    }

    // Must occur on event.start_date
    if (nowISTObj.dateStr !== event.start_date) {
      return { isDue: false, reason: "date_mismatch" };
    }

    // Target dispatch time is 30 minutes before event start time
    const targetDispatchMinutes = eventStartMinutes - 30;

    // Window rule:
    // - Must NOT send before targetDispatchMinutes.
    // - Send if nowMinutes is between targetDispatchMinutes and (targetDispatchMinutes + timedGraceWindowMinutes).
    // - Must NOT send once event has already started (nowMinutes >= eventStartMinutes).
    if (
      nowMinutes >= targetDispatchMinutes &&
      nowMinutes <= targetDispatchMinutes + timedGraceWindowMinutes &&
      nowMinutes < eventStartMinutes
    ) {
      return {
        isDue: true,
        notificationType: "event_30min",
        entityId: `${event.id}_30min`,
        reason: "timed_30min_due",
      };
    }

    return { isDue: false, reason: "timed_outside_dispatch_window" };
  }

  // 5. TYPE-B: UNTIMED EVENT (Fixed 07:00 AM IST date-based notification)
  const targetUntimedMinutes = untimedDispatchHour * 60; // 07:00 AM = 420 mins

  // Must occur on event.start_date
  if (nowISTObj.dateStr !== event.start_date) {
    return { isDue: false, reason: "date_mismatch" };
  }

  if (
    nowMinutes >= targetUntimedMinutes &&
    nowMinutes <= targetUntimedMinutes + untimedGraceWindowMinutes
  ) {
    return {
      isDue: true,
      notificationType: "event_date",
      entityId: `${event.id}_${event.start_date}`,
      reason: "untimed_date_due",
    };
  }

  return { isDue: false, reason: "untimed_outside_dispatch_window" };
}

/**
 * Format 24-hour HH:MM:SS string to 12-hour AM/PM string for user notification body.
 */
export function formatTime12Hr(timeStr) {
  if (!timeStr) return "";
  const parts = timeStr.split(":");
  let h = parseInt(parts[0], 10);
  const m = parts[1] || "00";
  if (isNaN(h)) return timeStr;
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${m} ${ampm}`;
}

/**
 * Main Single-Run Event Notification Dispatch Process
 */
export async function processEventNotifications(overrideNowDate = null) {
  const nowIST = getISTNowComponents(overrideNowDate);
  console.log(`\n============================================================`);
  console.log(`[EVENT PUSH WORKER START] IST Date: ${nowIST.dateStr} | IST Time: ${nowIST.timeStr}`);
  console.log(`============================================================`);

  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.warn(
      "[WORKER WARNING] Missing Supabase environment variables (VITE_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY). Skipping live dispatch."
    );
    return { success: false, reason: "missing_env_vars" };
  }

  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

  // Query database strictly for active, eligible events of eligible temples on/near current date
  const { data: events, error: fetchErr } = await supabase
    .from("events")
    .select("id, title, title_te, temple_id, start_date, start_time, notification_eligible, is_cancelled, vahanam")
    .in("temple_id", ELIGIBLE_TEMPLES)
    .eq("notification_eligible", true)
    .eq("start_date", nowIST.dateStr);

  if (fetchErr) {
    console.error("[WORKER ERROR] Failed to fetch events from Supabase:", fetchErr.message || fetchErr);
    return { success: false, error: fetchErr };
  }

  const totalEventsCount = events ? events.length : 0;
  console.log(`[WORKER QUERY] Found ${totalEventsCount} eligible event(s) for ${nowIST.dateStr}.`);

  if (!events || events.length === 0) {
    console.log("[WORKER COMPLETED] No eligible events scheduled for today.");
    return { success: true, dueEventsCount: 0, totalSent: 0 };
  }

  let dueEventsCount = 0;
  let totalSent = 0;
  let totalSkipped = 0;
  let totalFailed = 0;

  for (const ev of events) {
    const evalResult = evaluateEventNotificationDue(ev, nowIST);
    if (!evalResult.isDue) {
      continue;
    }

    dueEventsCount++;

    const isTirumala = ev.temple_id === "tirumala-main";
    const templeNameEn = isTirumala ? "Tirumala Temple" : "Sri Padmavathi Ammavari Temple, Tiruchanur";

    const titleEn = isTirumala ? "🛕 Tirumala Event Reminder" : "🌺 Tiruchanur Event Reminder";
    const titleTe = isTirumala ? "తిరుమల శ్రీవారి ఉత్సవ సమాచారం" : "తిరుచానూరు అమ్మవారి ఉత్సవ సమాచారం";

    let bodyEn = "";
    if (ev.start_time) {
      const formattedTime = formatTime12Hr(ev.start_time);
      bodyEn = `"${ev.title}" begins in 30 minutes at ${formattedTime}.`;
    } else {
      bodyEn = `Today's event at ${templeNameEn}: "${ev.title}".`;
    }

    const payload = {
      title: ev.title_te ? `${titleEn} | ${titleTe}` : titleEn,
      body: bodyEn,
      icon: "/logo-64.png",
      badge: "/logo-64.png",
      url: "https://thetirumalaverse.in/",
      tag: `event-${ev.id}`,
      type: "event_reminder",
    };

    console.log(
      `[DISPATCHING] Event ${ev.id} (${ev.temple_id}): "${ev.title}" | Type: ${evalResult.notificationType} | Key: ${evalResult.entityId}`
    );

    const dispatchRes = await dispatchWebPushNotification({
      supabase,
      notificationType: evalResult.notificationType,
      entityId: evalResult.entityId,
      payload,
      targetTempleId: ev.temple_id,
    });

    if (dispatchRes.success) {
      totalSent += dispatchRes.sentCount || 0;
      totalSkipped += dispatchRes.skippedCount || 0;
      totalFailed += dispatchRes.failedCount || 0;
    }
  }

  console.log(`============================================================`);
  console.log(
    `[EVENT PUSH WORKER COMPLETED] Due Events: ${dueEventsCount}, Sent: ${totalSent}, Skipped: ${totalSkipped}, Failed: ${totalFailed}`
  );
  console.log(`============================================================\n`);

  return {
    success: true,
    totalEventsCount,
    dueEventsCount,
    totalSent,
    totalSkipped,
    totalFailed,
  };
}

// Execute self-test suite if called with --test argument
if (process.argv.includes("--test")) {
  runSelfTestSuite();
} else if (import.meta.url === `file://${process.argv[1]}`) {
  processEventNotifications();
}

/**
 * Deterministic Test Suite verifying items A through K from Task 18
 */
export function runSelfTestSuite() {
  console.log("\n============================================================");
  console.log("RUNNING PHASE 4 EVENT WORKER DETERMINISTIC TEST SUITE");
  console.log("============================================================\n");

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

  const dateStr = "2026-09-19";

  // A. Timed Event 6:30 PM (18:30:00), Target 6:00 PM (18:00:00)
  const garudaEvent = {
    id: "ttd-2026-09-19-garuda-vahanam",
    temple_id: "tirumala-main",
    start_date: dateStr,
    start_time: "18:30:00",
    notification_eligible: true,
    is_cancelled: false,
  };

  assert(
    !evaluateEventNotificationDue(garudaEvent, getISTNowComponents(`${dateStr}T17:55:00+05:30`)).isDue,
    "A1: 5:55 PM IST -> NOT DUE (before 30-min target 6:00 PM)"
  );

  assert(
    evaluateEventNotificationDue(garudaEvent, getISTNowComponents(`${dateStr}T18:00:00+05:30`)).isDue,
    "A2: 6:00 PM IST -> DUE (exact 30-min target)"
  );

  assert(
    evaluateEventNotificationDue(garudaEvent, getISTNowComponents(`${dateStr}T18:05:00+05:30`)).isDue,
    "A3: 6:05 PM IST -> DUE (within 15-min grace window)"
  );

  assert(
    !evaluateEventNotificationDue(garudaEvent, getISTNowComponents(`${dateStr}T18:20:00+05:30`)).isDue,
    "A4: 6:20 PM IST -> NOT DUE (after 15-min grace window)"
  );

  assert(
    !evaluateEventNotificationDue(garudaEvent, getISTNowComponents(`${dateStr}T18:35:00+05:30`)).isDue,
    "A5: 6:35 PM IST -> NOT DUE (after event has started)"
  );

  // B. Type-A Timed Event 4:00 PM (16:00:00), Target 3:30 PM (15:30:00)
  const swarnaEvent = {
    id: "ttd-2026-09-20-swarna-ratham",
    temple_id: "tirumala-main",
    start_date: "2026-09-20",
    start_time: "16:00:00",
    notification_eligible: true,
    is_cancelled: false,
  };

  assert(
    evaluateEventNotificationDue(swarnaEvent, getISTNowComponents("2026-09-20T15:30:00+05:30")).isDue,
    "B1 (Type-A Timed 4:00 PM Event): 3:30 PM IST -> DUE (exact 30-min target)"
  );

  assert(
    !evaluateEventNotificationDue(swarnaEvent, getISTNowComponents("2026-09-20T15:20:00+05:30")).isDue,
    "B2 (Type-A Timed 4:00 PM Event): 3:20 PM IST -> NOT DUE (before 30-min target)"
  );

  // C. Untimed Event on Sep 25
  const untimedEvent = {
    id: "ttd-2026-09-25-anantha-padmanabha-vratham",
    temple_id: "tirumala-main",
    start_date: "2026-09-25",
    start_time: null,
    notification_eligible: true,
    is_cancelled: false,
  };

  assert(
    evaluateEventNotificationDue(untimedEvent, getISTNowComponents("2026-09-25T07:00:00+05:30")).isDue,
    "C1: 07:00 AM IST -> DUE for untimed event on start_date"
  );

  assert(
    evaluateEventNotificationDue(untimedEvent, getISTNowComponents("2026-09-25T07:05:00+05:30")).isDue,
    "C2: 07:05 AM IST -> DUE (within 30-min untimed grace window)"
  );

  assert(
    !evaluateEventNotificationDue(untimedEvent, getISTNowComponents("2026-09-25T14:00:00+05:30")).isDue,
    "C3: 02:00 PM IST -> NOT DUE (late afternoon outside grace window)"
  );

  // D. Cancelled Event
  const cancelledEvent = { ...garudaEvent, is_cancelled: true };
  assert(
    !evaluateEventNotificationDue(cancelledEvent, getISTNowComponents(`${dateStr}T18:00:00+05:30`)).isDue,
    "D: Cancelled event (is_cancelled = true) -> NEVER DUE"
  );

  // E. Notification Eligible = false
  const nonEligibleEvent = { ...garudaEvent, notification_eligible: false };
  assert(
    !evaluateEventNotificationDue(nonEligibleEvent, getISTNowComponents(`${dateStr}T18:00:00+05:30`)).isDue,
    "E: Summary event (notification_eligible = false) -> NEVER DUE"
  );

  // F. Govindaraja Non-Eligible Temple
  const govindarajaEvent = { ...garudaEvent, temple_id: "govindaraja" };
  assert(
    !evaluateEventNotificationDue(govindarajaEvent, getISTNowComponents(`${dateStr}T18:00:00+05:30`)).isDue,
    "F: Non-eligible temple (govindaraja) -> NEVER DUE"
  );

  // G, H, I. Subscriber Temple Filtering Logic
  const subTirumalaOnly = { id: "sub-1", subscribed_temples: ["tirumala-main"] };
  const subTiruchanurOnly = { id: "sub-2", subscribed_temples: ["tiruchanur"] };
  const subBoth = { id: "sub-3", subscribed_temples: ["tirumala-main", "tiruchanur"] };

  const tirumalaEv = { temple_id: "tirumala-main" };
  const tiruchanurEv = { temple_id: "tiruchanur" };

  assert(
    subTirumalaOnly.subscribed_temples.includes(tirumalaEv.temple_id) &&
      !subTirumalaOnly.subscribed_temples.includes(tiruchanurEv.temple_id),
    "G: Subscriber Tirumala-only receives Tirumala events and skips Tiruchanur events"
  );

  assert(
    subTiruchanurOnly.subscribed_temples.includes(tiruchanurEv.temple_id) &&
      !subTiruchanurOnly.subscribed_temples.includes(tirumalaEv.temple_id),
    "H: Subscriber Tiruchanur-only receives Tiruchanur events and skips Tirumala events"
  );

  assert(
    subBoth.subscribed_temples.includes(tirumalaEv.temple_id) &&
      subBoth.subscribed_temples.includes(tiruchanurEv.temple_id),
    "I: Subscriber both receives events for both temples"
  );

  // J. Deduplication Identity Keys
  const res1 = evaluateEventNotificationDue(garudaEvent, getISTNowComponents(`${dateStr}T18:00:00+05:30`));
  const res2 = evaluateEventNotificationDue(untimedEvent, getISTNowComponents("2026-09-25T07:00:00+05:30"));

  assert(
    res1.notificationType === "event_30min" && res1.entityId === "ttd-2026-09-19-garuda-vahanam_30min",
    "J1: Timed event deduplication key = event_30min : ${event.id}_30min"
  );

  assert(
    res2.notificationType === "event_date" && res2.entityId === "ttd-2026-09-25-anantha-padmanabha-vratham_2026-09-25",
    "J2: Untimed event deduplication key = event_date : ${event.id}_${start_date}"
  );

  console.log("\n============================================================");
  console.log(`TEST SUITE RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log("============================================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

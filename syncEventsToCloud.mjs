/**
 * STANDALONE CANONICAL EVENT SYNCHRONIZATION COMMAND
 * Synchronizes the canonical INITIAL_EVENTS dataset directly to Supabase.
 * Bypasses browser localStorage cache to guarantee 100% data integrity.
 */

import { createClient } from "@supabase/supabase-js";
import { INITIAL_EVENTS } from "./src/data/initialEvents.js";

export const ELIGIBLE_TEMPLES = ["tirumala-main", "tiruchanur"];

/**
 * Deterministically validates the canonical events dataset against Phase 3 specifications.
 * Throws an Error if any constraint is violated.
 */
export function validateCanonicalEvents(events) {
  if (!Array.isArray(events) || events.length === 0) {
    throw new Error("Validation Error: Event dataset is empty or not an array.");
  }

  // 1. Duplicate ID Check
  const idSet = new Set();
  const duplicateIds = [];
  for (const ev of events) {
    if (!ev.id) throw new Error("Validation Error: Found event with missing ID.");
    if (idSet.has(ev.id)) {
      duplicateIds.push(ev.id);
    }
    idSet.add(ev.id);
  }
  if (duplicateIds.length > 0) {
    throw new Error(`Validation Error: Duplicate event IDs found: ${duplicateIds.join(", ")}`);
  }

  // 2. Filter Eligible Temples
  const eligibleEvents = events.filter((e) => ELIGIBLE_TEMPLES.includes(e.templeId));
  const tirumalaEvents = eligibleEvents.filter((e) => e.templeId === "tirumala-main");
  const tiruchanurEvents = eligibleEvents.filter((e) => e.templeId === "tiruchanur");

  if (eligibleEvents.length !== 68) {
    throw new Error(
      `Validation Error: Expected exactly 68 eligible events, but found ${eligibleEvents.length} (Tirumala: ${tirumalaEvents.length}, Tiruchanur: ${tiruchanurEvents.length}).`
    );
  }

  if (tirumalaEvents.length !== 57) {
    throw new Error(`Validation Error: Expected 57 Tirumala events, found ${tirumalaEvents.length}.`);
  }

  if (tiruchanurEvents.length !== 11) {
    throw new Error(`Validation Error: Expected 11 Tiruchanur events, found ${tiruchanurEvents.length}.`);
  }

  // 3. Category & Timing Breakdowns
  const timeRegex = /^\d{2}:\d{2}:\d{2}$/;

  const timedEvents = eligibleEvents.filter((e) => e.startTime && e.notificationEligible !== false);
  const untimedEligible = eligibleEvents.filter((e) => !e.startTime && e.notificationEligible !== false);
  const summaryEvents = eligibleEvents.filter((e) => e.notificationEligible === false);

  if (timedEvents.length !== 54) {
    throw new Error(`Validation Error: Expected 54 timed Type-A events, found ${timedEvents.length}.`);
  }

  if (untimedEligible.length !== 5) {
    throw new Error(`Validation Error: Expected 5 untimed Type-B events, found ${untimedEligible.length}.`);
  }

  if (summaryEvents.length !== 9) {
    throw new Error(`Validation Error: Expected 9 notification-ineligible summary events, found ${summaryEvents.length}.`);
  }

  // 4. Validate all timed events have valid HH:MM:SS format
  for (const te of timedEvents) {
    if (!timeRegex.test(te.startTime)) {
      throw new Error(
        `Validation Error: Event ${te.id} has invalid startTime format: "${te.startTime}". Expected HH:MM:SS.`
      );
    }
  }

  return {
    totalCatalogCount: events.length,
    eligibleCount: eligibleEvents.length,
    tirumalaCount: tirumalaEvents.length,
    tiruchanurCount: tiruchanurEvents.length,
    timedCount: timedEvents.length,
    untimedCount: untimedEligible.length,
    summaryCount: summaryEvents.length,
  };
}

/**
 * Transforms frontend event objects to database schema rows.
 */
export function transformEventsForDatabase(events) {
  return events.map((e) => ({
    id: String(e.id),
    title: e.title,
    title_te: e.titleTe || e.title,
    temple_id: e.templeId,
    start_date: e.startDate,
    end_date: e.endDate,
    start_time: e.startTime || null,
    is_cancelled: e.isCancelled || false,
    notification_eligible: e.notificationEligible !== false,
    category: e.category,
    vahanam: e.vahanam || "",
    description: e.description || "",
    description_te: e.descriptionTe || "",
    image_url: e.imageUrl || "",
    images: e.images || [],
  }));
}

/**
 * Main Sync Runner
 */
export async function runCanonicalSync() {
  const isDryRun = process.argv.includes("--dry-run") || process.argv.includes("--validate");

  console.log("\n============================================================");
  console.log(`CANONICAL EVENT SYNC TO SUPABASE ${isDryRun ? "[DRY-RUN / VALIDATION ONLY]" : "[LIVE SYNC]"}`);
  console.log("============================================================\n");

  console.log(`Analyzing canonical dataset from src/data/initialEvents.js (${INITIAL_EVENTS.length} total events)...`);

  let stats;
  try {
    stats = validateCanonicalEvents(INITIAL_EVENTS);
    console.log("✅ Canonical Dataset Validation PASSED:");
    console.log(`   - Total Catalog Events (All Temples): ${stats.totalCatalogCount}`);
    console.log(`   - Eligible Notification Temples: ${stats.eligibleCount} total`);
    console.log(`     * Tirumala Temple (tirumala-main): ${stats.tirumalaCount}`);
    console.log(`     * Tiruchanur Temple (tiruchanur): ${stats.tiruchanurCount}`);
    console.log(`   - Type-A Timed Events: ${stats.timedCount} (All validated HH:MM:SS)`);
    console.log(`   - Type-B Untimed Events: ${stats.untimedCount}`);
    console.log(`   - Brahmotsavam Ineligible Summaries: ${stats.summaryCount} (notification_eligible = false)`);
  } catch (validationErr) {
    console.error("\n❌ VALIDATION FAILED — ABORTING SYNC WITHOUT WRITING:");
    console.error(validationErr.message);
    process.exit(1);
  }

  if (isDryRun) {
    console.log("\n[DRY-RUN COMPLETE] Dataset is 100% compliant. No database calls or writes were performed.\n");
    return;
  }

  // Live Sync Path
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error("\n❌ Missing required Supabase environment variables:");
    console.error("   - VITE_SUPABASE_URL / SUPABASE_URL");
    console.error("   - SUPABASE_SERVICE_ROLE_KEY");
    console.error("Aborting live sync.");
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
  const payload = transformEventsForDatabase(INITIAL_EVENTS);

  console.log(`\nInitiating atomic upsert of ${payload.length} canonical events to Supabase 'public.events'...`);

  const { data, error } = await supabase
    .from("events")
    .upsert(payload, { onConflict: "id" })
    .select("id");

  if (error) {
    console.error("\n❌ Supabase upsert error:", error.message || error);
    process.exit(1);
  }

  console.log(`✅ Successfully upserted ${data?.length || payload.length} canonical events into Supabase!`);
  console.log("============================================================\n");
}

import { fileURLToPath } from "url";

if (
  process.argv[1] &&
  (fileURLToPath(import.meta.url) === process.argv[1] ||
    process.argv[1].endsWith("syncEventsToCloud.mjs"))
) {
  runCanonicalSync();
}

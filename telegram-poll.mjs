import { TelegramClient } from "teleproto";
import { StringSession } from "teleproto/sessions/index.js";
import { createClient } from "@supabase/supabase-js";
import { parseTelegramTokenMessage } from "./src/utils/telegramTokenParser.js";

const CHANNEL_USERNAME = "LaxmiTeluguTechChannel";

const apiId = Number(process.env.TELEGRAM_API_ID);
const apiHash = process.env.TELEGRAM_API_HASH;

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!apiId || !apiHash) {
  throw new Error("Missing Telegram API credentials.");
}

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error(
    "Missing Supabase server environment variables."
  );
}

const sessionString = process.env.TELEGRAM_SESSION?.trim();

if (!sessionString) {
  throw new Error(
    "Missing TELEGRAM_SESSION environment variable."
  );
}

const telegramClient = new TelegramClient(
  new StringSession(sessionString),
  apiId,
  apiHash,
  {
    connectionRetries: 5,
  }
);

const supabase = createClient(
  supabaseUrl,
  supabaseServiceRoleKey
);

function getIndiaDate(date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function parseIssueStartToIso(indiaDate, issueStartText) {
  if (!indiaDate || !issueStartText) {
    return null;
  }

  const match = issueStartText
    .trim()
    .match(
      /^(\d{1,2})(?:[:.](\d{2}))?\s*(AM|PM)?$/i
    );

  if (!match) {
    return null;
  }

  let hour = Number(match[1]);
  const minute = Number(match[2] || 0);
  const meridiem = match[3]?.toUpperCase();

  if (meridiem === "PM" && hour !== 12) {
    hour += 12;
  }

  if (meridiem === "AM" && hour === 12) {
    hour = 0;
  }

  if (
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59
  ) {
    return null;
  }

  const [year, month, day] =
    indiaDate.split("-").map(Number);

  // India Standard Time = UTC + 05:30.
  const utcMillis =
    Date.UTC(
      year,
      month - 1,
      day,
      hour,
      minute,
      0
    ) -
    (5 * 60 + 30) * 60 * 1000;

  return new Date(utcMillis).toISOString();
}

function parseEventTimeToIso(indiaDate, timeText) {
  if (!indiaDate || !timeText) {
    return null;
  }

  const match = timeText
    .trim()
    .match(/^(\d{1,2})(?:[:.](\d{2}))?\s*(AM|PM)?$/i);

  if (!match) {
    return null;
  }

  let hour = Number(match[1]);
  const minute = Number(match[2] || 0);
  const meridiem = match[3]?.toUpperCase();

  if (meridiem === "PM" && hour !== 12) {
    hour += 12;
  }

  if (meridiem === "AM" && hour === 12) {
    hour = 0;
  }

  if (
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59
  ) {
    return null;
  }

  const [year, month, day] =
    indiaDate.split("-").map(Number);

  // India Standard Time = UTC + 05:30.
  const utcMillis =
    Date.UTC(
      year,
      month - 1,
      day,
      hour,
      minute,
      0
    ) -
    (5 * 60 + 30) * 60 * 1000;

  return new Date(utcMillis).toISOString();
}

/**
 * Find the highest Telegram message ID that has already
 * been imported into token_observations.
 *
 * This remains useful for logging and future incremental
 * processing, although today's backfill reads recent history.
 */
async function getLastImportedTelegramMessageId() {
  const { data, error } = await supabase
    .from("token_observations")
    .select("source_reference")
    .eq("source_type", "telegram")
    .not("source_reference", "is", null);

  if (error) {
    throw error;
  }

  let highestMessageId = 0;

  for (const row of data || []) {
    const match = String(
      row.source_reference
    ).match(/^telegram:(\d+)$/);

    if (!match) {
      continue;
    }

    const messageId = Number(match[1]);

    if (
      Number.isInteger(messageId) &&
      messageId > highestMessageId
    ) {
      highestMessageId = messageId;
    }
  }

  return highestMessageId;
}

async function processMessage(message) {
  const text = message.message || "";

  if (!text.trim()) {
    return "ignored";
  }

  const parsed = parseTelegramTokenMessage(text);

  if (!parsed) {
    return "ignored";
  }

  const sourceReference =
    `telegram:${message.id}`;

  console.log(
    `\nRecognized token message ${message.id}`
  );

  const telegramDate = message.date
    ? new Date(message.date * 1000)
    : new Date();

  const messageIndiaDate =
    getIndiaDate(telegramDate);

  console.log(
    `Telegram India date: ${messageIndiaDate}`
  );

  let {
    data: tokenDay,
    error: tokenDayError,
  } = await supabase
    .from("token_days")
    .select("*")
    .eq("issuance_date", messageIndiaDate)
    .maybeSingle();

  if (tokenDayError) {
    throw tokenDayError;
  }

  const issuanceStartedAt =
    parseIssueStartToIso(
      messageIndiaDate,
      parsed.issue_start_text
    );

  const ssdCompletedAt =
   parseEventTimeToIso(
    messageIndiaDate,
    parsed.ssd_completed_at_text
   );

  const ddCompletedAt =
   parseEventTimeToIso(
    messageIndiaDate,
    parsed.dd_completed_at_text
   );

  /*
   * STEP 1 / 2:
   *
   * If today's token day does not exist, create it.
   *
   * The issuance start time is saved when the Telegram
   * start message contains one.
   */
  if (!tokenDay) {
    console.log(
      `No token day found for ${messageIndiaDate}. Creating it automatically...`
    );

    const nextDay = new Date(
      `${messageIndiaDate}T12:00:00`
    );

    nextDay.setDate(
      nextDay.getDate() + 1
    );

    const darshanDate = [
      nextDay.getFullYear(),
      String(
        nextDay.getMonth() + 1
      ).padStart(2, "0"),
      String(
        nextDay.getDate()
      ).padStart(2, "0"),
    ].join("-");

    const {
      data: createdTokenDay,
      error: createError,
    } = await supabase
      .from("token_days")
      .insert({
        issuance_date: messageIndiaDate,
        darshan_date: darshanDate,

        issuance_status: "active",

        issuance_started_at:
          issuanceStartedAt,

        source_type: "telegram",
        source_reference:
          sourceReference,

        notes:
          "Automatically created from Telegram token issuance message.",
      })
      .select("*")
      .single();

    if (createError) {
      throw createError;
    }

    tokenDay = createdTokenDay;

    console.log(
      `Created token day ${tokenDay.id} for ${messageIndiaDate}.`
    );
  }

  /*
   * Save issuance start time if we have discovered it
   * and today's token day does not already have one.
   */
  if (
  tokenDay &&
  (
    (issuanceStartedAt && !tokenDay.issuance_started_at) ||
    (ssdCompletedAt && !tokenDay.ssd_completed_at) ||
    (ddCompletedAt && !tokenDay.dd_completed_at)
  )
) {
  const timingUpdate = {};

  if (
    issuanceStartedAt &&
    !tokenDay.issuance_started_at
  ) {
    timingUpdate.issuance_started_at =
      issuanceStartedAt;
  }

  if (
    ssdCompletedAt &&
    !tokenDay.ssd_completed_at
  ) {
    timingUpdate.ssd_completed_at =
      ssdCompletedAt;
  }

  if (
    ddCompletedAt &&
    !tokenDay.dd_completed_at
  ) {
    timingUpdate.dd_completed_at =
      ddCompletedAt;
  }

  timingUpdate.source_type = "telegram";
  timingUpdate.source_reference = sourceReference;

  const {
    data: updatedTokenDay,
    error: timingUpdateError,
  } = await supabase
    .from("token_days")
    .update(timingUpdate)
    .eq("id", tokenDay.id)
    .select("*")
    .single();

  if (timingUpdateError) {
    throw timingUpdateError;
  }

  tokenDay = updatedTokenDay;

  console.log(
    "Token timing information saved:",
    timingUpdate
  );
}

  /*
   * STEP 4:
   *
   * A Telegram message containing only the issuance
   * start time is NOT an observation.
   *
   * Save the start time in token_days and stop here.
   */
  if (
    parsed.issue_start_text &&
    parsed.ssd_remaining === null &&
    parsed.dd_remaining === null &&
    parsed.ssd_status === "unknown" &&
    parsed.dd_status === "unknown"
  ) {
    console.log(
      `Issue-start message processed: ${sourceReference}`
    );

    return "inserted";
  }

  /*
   * Normal SSD/DD observation.
   */
  const observation = {
    token_day_id: tokenDay.id,

    observed_at: message.date
      ? new Date(
          message.date * 1000
        ).toISOString()
      : new Date().toISOString(),

    ssd_remaining:
      parsed.ssd_remaining,

    dd_remaining:
      parsed.dd_remaining,

    ssd_status:
      parsed.ssd_status,

    dd_status:
      parsed.dd_status,

    source_type: "telegram",

    source_reference:
      sourceReference,

    raw_text:
      parsed.raw_text,
  };

  console.log(
    "Attempting insert:",
    {
      source_reference:
        sourceReference,

      observed_at:
        observation.observed_at,

      ssd_remaining:
        observation.ssd_remaining,

      dd_remaining:
        observation.dd_remaining,

      ssd_status:
        observation.ssd_status,

      dd_status:
        observation.dd_status,
    }
  );

  const {
    error: insertError,
  } = await supabase
    .from("token_observations")
    .insert(observation);

  if (insertError) {
    if (insertError.code === "23505") {
      console.log(
        `Duplicate prevented by database: ${sourceReference}`
      );

      return "duplicate";
    }

    throw insertError;
  }

  console.log(
    `SUCCESS — inserted ${sourceReference}`
  );

  /*
   * Update SSD/DD status for the token day.
   */
  const dayStatusUpdate = {};

  if (
    parsed.ssd_status ===
    "completed"
  ) {
    dayStatusUpdate.ssd_status =
      "completed";
  }

  if (
    parsed.dd_status ===
    "completed"
  ) {
    dayStatusUpdate.dd_status =
      "completed";
  }

  if (
    Object.keys(dayStatusUpdate)
      .length > 0
  ) {
    const {
      error: statusUpdateError,
    } = await supabase
      .from("token_days")
      .update(dayStatusUpdate)
      .eq("id", tokenDay.id);

    if (statusUpdateError) {
      throw statusUpdateError;
    }

    console.log(
      "Token day status updated:",
      dayStatusUpdate
    );
  }

  return "inserted";
}

async function runPoll(channel) {
  console.log(
    `\n[${new Date().toISOString()}] Starting Telegram poll...`
  );

  const lastImportedMessageId =
    await getLastImportedTelegramMessageId();

  console.log(
    `Last imported Telegram message ID: ${lastImportedMessageId}`
  );

  /*
   * STEP 3:
   *
   * Read a larger recent Telegram history instead of
   * starting after the latest imported message.
   *
   * This allows us to recover today's messages that were
   * posted before the current database checkpoint.
   *
   * Existing observations are protected by the database
   * unique source_reference constraint.
   */
  const messages =
    await telegramClient.getMessages(
      channel,
      {
        limit: 500,
      }
    );

  console.log(
    `Recent Telegram history fetched: ${messages.length}`
  );

  /*
   * Only process messages belonging to today's
   * India date.
   */
  const todayIndiaDate =
    getIndiaDate(new Date());

  const todayMessages =
    messages.filter((message) => {
      if (!message.date) {
        return false;
      }

      const messageIndiaDate =
        getIndiaDate(
          new Date(
            message.date * 1000
          )
        );

      return (
        messageIndiaDate ===
        todayIndiaDate
      );
    });

console.log(
    `Today's Telegram messages: ${todayMessages.length}`
  );

console.log("\n========================================");
console.log("TODAY'S TELEGRAM MESSAGE DIAGNOSTIC");
console.log("========================================");

for (const message of todayMessages) {
  console.log("\n----------------------------------------");
  console.log("Message ID:", message.id);

  if (message.date) {
    console.log(
      "India time:",
      new Intl.DateTimeFormat("en-IN", {
        timeZone: "Asia/Kolkata",
        dateStyle: "medium",
        timeStyle: "medium",
      }).format(new Date(message.date * 1000))
    );
  }

  console.log("Text:");
  console.log(message.message || "[NO TEXT]");
}

console.log("\n========================================");

const recognizedMessages = [];

  for (
    const message of todayMessages
  ) {
    const text =
      message.message || "";

    if (!text.trim()) {
      continue;
    }

    const parsed =
      parseTelegramTokenMessage(
        text
      );

    if (!parsed) {
      continue;
    }

    recognizedMessages.push(
      message
    );
  }

  recognizedMessages.sort(
    (a, b) =>
      a.id - b.id
  );

  console.log(
    `Recognized token messages: ${recognizedMessages.length}`
  );

  let inserted = 0;
  let duplicates = 0;
  let other = 0;

  for (
    const message of recognizedMessages
  ) {
    const result =
      await processMessage(
        message
      );

    if (
      result === "inserted"
    ) {
      inserted++;
    } else if (
      result === "duplicate"
    ) {
      duplicates++;
    } else {
      other++;
    }
  }

  console.log(
    "\n========================================"
  );

  console.log(
    "Telegram poll complete."
  );

  console.log(
    "Inserted:",
    inserted
  );

  console.log(
    "Duplicates:",
    duplicates
  );

  console.log(
    "Other:",
    other
  );

  console.log(
    "========================================"
  );
}

console.log(
  "========================================"
);

console.log(
  "Telegram SSD/DD Token Cron Poll"
);

console.log(
  "========================================"
);

try {
  console.log(
    "Connecting to Telegram..."
  );

  await telegramClient.connect();

  console.log(
    "Telegram connected."
  );

  const channel =
    await telegramClient.getEntity(
      CHANNEL_USERNAME
    );

  console.log(
    "Channel:",
    {
      id: String(channel.id),

      title:
        channel.title,

      username:
        channel.username,
    }
  );

  await runPoll(channel);
} catch (error) {
  console.error(
    "Telegram cron poll failed:",
    error
  );

  process.exitCode = 1;
} finally {
  try {
    await telegramClient.disconnect();
  } catch (
    disconnectError
  ) {
    console.error(
      "Failed to disconnect Telegram cleanly:",
      disconnectError
    );
  }
}

console.log(
  "Telegram cron poll finished."
);
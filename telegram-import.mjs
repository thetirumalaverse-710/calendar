import fs from "node:fs";
import { TelegramClient } from "teleproto";
import { StringSession } from "teleproto/sessions/index.js";
import { createClient } from "@supabase/supabase-js";
import { parseTelegramTokenMessage } from "./src/utils/telegramTokenParser.js";

const apiId = Number(process.env.TELEGRAM_API_ID);
const apiHash = process.env.TELEGRAM_API_HASH;

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!apiId || !apiHash) {
  throw new Error("Missing Telegram API credentials.");
}

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error("Missing Supabase server environment variables.");
}

const sessionFile = ".telegram-session";

if (!fs.existsSync(sessionFile)) {
  throw new Error("Telegram session file is missing.");
}

const sessionString = fs.readFileSync(sessionFile, "utf8").trim();

if (!sessionString) {
  throw new Error("Telegram session file is empty.");
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

console.log("Connecting to Telegram...");

await telegramClient.connect();

console.log("Telegram connected.");

const channel = await telegramClient.getEntity(
  "LaxmiTeluguTechChannel"
);

console.log("Reading latest Telegram messages...");

const messages = await telegramClient.getMessages(channel, {
  limit: 20,
});

const parsedMessages = [];

for (const message of messages) {
  const text = message.message || "";

  if (!text.trim()) {
    continue;
  }

  const parsed = parseTelegramTokenMessage(text);

  if (!parsed) {
    continue;
  }

  parsedMessages.push({
    message,
    parsed,
  });
}

if (parsedMessages.length === 0) {
  await telegramClient.disconnect();
  throw new Error("No recognizable SSD/DD token messages found.");
}

// Telegram returns newest first.
// Process oldest → newest so the database history is chronological.
parsedMessages.sort(
  (a, b) => a.message.id - b.message.id
);

console.log(
  `\nFound ${parsedMessages.length} recognizable token messages.`
);

let insertedCount = 0;
let skippedCount = 0;

for (const { message, parsed } of parsedMessages) {
  const sourceReference = `telegram:${message.id}`;

  console.log(
    `\nProcessing Telegram message ${message.id}...`
  );

  const telegramDate = message.date
    ? new Date(message.date * 1000)
    : new Date();

    const messageIndiaDate = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Kolkata",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(telegramDate);

console.log(
  `Telegram India date: ${messageIndiaDate}`
);

const { data: tokenDay, error: tokenDayError } = await supabase
  .from("token_days")
  .select("id, issuance_date")
  .eq("issuance_date", messageIndiaDate)
  .maybeSingle();

if (tokenDayError) {
  await telegramClient.disconnect();
  throw tokenDayError;
}

if (!tokenDay) {
  console.log(
    `No token day found for ${messageIndiaDate}. Skipping message ${message.id}.`
  );

  skippedCount++;
  continue;
}

  const { data: existingObservation, error: existingError } =
    await supabase
      .from("token_observations")
      .select("id")
      .eq("source_reference", sourceReference)
      .maybeSingle();

  if (existingError) {
    await telegramClient.disconnect();
    throw existingError;
  }

  if (existingObservation) {
    console.log(
      `Already imported ${sourceReference}. Skipping.`
    );

    skippedCount++;
    continue;
  }

  const telegramObservedAt = message.date
    ? new Date(message.date * 1000).toISOString()
    : new Date().toISOString();

  const observation = {
    token_day_id: tokenDay.id,
    observed_at: telegramObservedAt,

    ssd_remaining: parsed.ssd_remaining,
    dd_remaining: parsed.dd_remaining,

    ssd_status: parsed.ssd_status,
    dd_status: parsed.dd_status,

    source_type: "telegram",
    source_reference: sourceReference,

    raw_text: parsed.raw_text,
  };

  console.log("Inserting:", {
    source_reference: sourceReference,
    observed_at: telegramObservedAt,
    ssd_remaining: parsed.ssd_remaining,
    dd_remaining: parsed.dd_remaining,
    ssd_status: parsed.ssd_status,
    dd_status: parsed.dd_status,
  });

  const { error: insertError } = await supabase
    .from("token_observations")
    .insert(observation);

  if (insertError) {
    await telegramClient.disconnect();

    throw insertError;
  }

  console.log(`Inserted ${sourceReference}.`);

  insertedCount++;
}

await telegramClient.disconnect();

console.log("\n========================================");
console.log("Telegram import complete.");
console.log("Inserted:", insertedCount);
console.log("Skipped:", skippedCount);
console.log("========================================");
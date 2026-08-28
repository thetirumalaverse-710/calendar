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

/**
 * Find the highest Telegram message ID that has already
 * been imported into token_observations.
 *
 * This replaces the local checkpoint file.
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
    const match = String(row.source_reference).match(
      /^telegram:(\d+)$/
    );

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

  const sourceReference = `telegram:${message.id}`;

  console.log(
    `\nRecognized token message ${message.id}`
  );

  const telegramDate = message.date
    ? new Date(message.date * 1000)
    : new Date();

  const messageIndiaDate = getIndiaDate(telegramDate);

  console.log(
    `Telegram India date: ${messageIndiaDate}`
  );

  const { data: tokenDay, error: tokenDayError } =
    await supabase
      .from("token_days")
      .select("id, issuance_date")
      .eq("issuance_date", messageIndiaDate)
      .maybeSingle();

  if (tokenDayError) {
    throw tokenDayError;
  }

  if (!tokenDay) {
    console.log(
      `No token day found for ${messageIndiaDate}.`
    );

    return "no_token_day";
  }

  const observation = {
    token_day_id: tokenDay.id,

    observed_at: message.date
      ? new Date(message.date * 1000).toISOString()
      : new Date().toISOString(),

    ssd_remaining: parsed.ssd_remaining,
    dd_remaining: parsed.dd_remaining,

    ssd_status: parsed.ssd_status,
    dd_status: parsed.dd_status,

    source_type: "telegram",
    source_reference: sourceReference,

    raw_text: parsed.raw_text,
  };

  console.log("Attempting insert:", {
    source_reference: sourceReference,
    observed_at: observation.observed_at,
    ssd_remaining: observation.ssd_remaining,
    dd_remaining: observation.dd_remaining,
    ssd_status: observation.ssd_status,
    dd_status: observation.dd_status,
  });

  const { error: insertError } = await supabase
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

  let messages;

  if (lastImportedMessageId === 0) {
    console.log(
      "No previous Telegram observations found. Reading recent history..."
    );

    messages = await telegramClient.getMessages(channel, {
      limit: 20,
    });
  } else {
    messages = await telegramClient.getMessages(channel, {
      limit: 100,
      minId: lastImportedMessageId,
    });
  }

  const newMessages = messages.filter(
    (message) => message.id > lastImportedMessageId
  );

  console.log(
    `New Telegram messages fetched: ${newMessages.length}`
  );

  const recognizedMessages = [];

  for (const message of newMessages) {
    const text = message.message || "";

    if (!text.trim()) {
      continue;
    }

    const parsed = parseTelegramTokenMessage(text);

    if (!parsed) {
      continue;
    }

    recognizedMessages.push(message);
  }

  recognizedMessages.sort(
    (a, b) => a.id - b.id
  );

  console.log(
    `Recognized token messages: ${recognizedMessages.length}`
  );

  let inserted = 0;
  let duplicates = 0;
  let other = 0;

  for (const message of recognizedMessages) {
    const result = await processMessage(message);

    if (result === "inserted") {
      inserted++;
    } else if (result === "duplicate") {
      duplicates++;
    } else {
      other++;
    }
  }

  console.log("\n========================================");
  console.log("Telegram poll complete.");
  console.log("Inserted:", inserted);
  console.log("Duplicates:", duplicates);
  console.log("Other:", other);
  console.log("========================================");
}

console.log("========================================");
console.log("Telegram SSD/DD Token Cron Poll");
console.log("========================================");

try {
  console.log("Connecting to Telegram...");

  await telegramClient.connect();

  console.log("Telegram connected.");

  const channel = await telegramClient.getEntity(
    CHANNEL_USERNAME
  );

  console.log("Channel:", {
    id: String(channel.id),
    title: channel.title,
    username: channel.username,
  });

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
  } catch (disconnectError) {
    console.error(
      "Failed to disconnect Telegram cleanly:",
      disconnectError
    );
  }
}

console.log("Telegram cron poll finished.");
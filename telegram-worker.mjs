import fs from "node:fs";
import { TelegramClient } from "teleproto";
import { StringSession } from "teleproto/sessions/index.js";
import { createClient } from "@supabase/supabase-js";
import { parseTelegramTokenMessage } from "./src/utils/telegramTokenParser.js";

const POLL_INTERVAL_MS = 5 * 60 * 1000;
const CHANNEL_USERNAME = "LaxmiTeluguTechChannel";
const SESSION_FILE = ".telegram-session";
const CHECKPOINT_FILE = ".telegram-checkpoint.json";

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

if (!fs.existsSync(SESSION_FILE)) {
  throw new Error("Telegram session file is missing.");
}

const sessionString = fs.readFileSync(
  SESSION_FILE,
  "utf8"
).trim();

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

function getIndiaDate(date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function loadCheckpoint() {
  if (!fs.existsSync(CHECKPOINT_FILE)) {
    return 0;
  }

  try {
    const data = JSON.parse(
      fs.readFileSync(CHECKPOINT_FILE, "utf8")
    );

    return Number(data.lastProcessedMessageId) || 0;
  } catch (error) {
    console.warn(
      "Could not read Telegram checkpoint. Starting from 0."
    );

    return 0;
  }
}

function saveCheckpoint(messageId) {
  fs.writeFileSync(
    CHECKPOINT_FILE,
    JSON.stringify(
      {
        lastProcessedMessageId: messageId,
        updatedAt: new Date().toISOString(),
      },
      null,
      2
    ),
    "utf8"
  );
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

  const { data: existingObservation, error: existingError } =
    await supabase
      .from("token_observations")
      .select("id")
      .eq("source_reference", sourceReference)
      .maybeSingle();

  if (existingError) {
    throw existingError;
  }

  if (existingObservation) {
    console.log(
      `Already imported ${sourceReference}.`
    );

    return "duplicate";
  }

  const observedAt = message.date
    ? new Date(message.date * 1000).toISOString()
    : new Date().toISOString();

  const observation = {
    token_day_id: tokenDay.id,
    observed_at: observedAt,

    ssd_remaining: parsed.ssd_remaining,
    dd_remaining: parsed.dd_remaining,

    ssd_status: parsed.ssd_status,
    dd_status: parsed.dd_status,

    source_type: "telegram",
    source_reference: sourceReference,

    raw_text: parsed.raw_text,
  };

  console.log("New observation:", {
    source_reference: sourceReference,
    observed_at: observedAt,
    ssd_remaining: parsed.ssd_remaining,
    dd_remaining: parsed.dd_remaining,
    ssd_status: parsed.ssd_status,
    dd_status: parsed.dd_status,
  });

  const { error: insertError } = await supabase
    .from("token_observations")
    .insert(observation);

  if (insertError) {
    // Another worker/process may have inserted it
    // between our duplicate check and this insert.
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

async function pollTelegram(channel) {
  console.log(
    `\n[${new Date().toISOString()}] Checking Telegram...`
  );

 const lastProcessedMessageId = loadCheckpoint();

console.log(
  `Last processed Telegram message ID: ${lastProcessedMessageId}`
);

let messages;

if (lastProcessedMessageId === 0) {
  // First run: establish a baseline using recent history.
  messages = await telegramClient.getMessages(channel, {
    limit: 20,
  });
} else {
  // Subsequent runs: request messages newer than our checkpoint.
  messages = await telegramClient.getMessages(channel, {
    limit: 100,
    minId: lastProcessedMessageId,
  });
}

const newMessages = messages.filter(
  (message) => message.id > lastProcessedMessageId
);

console.log(
  `New Telegram messages in fetched window: ${newMessages.length}`
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
  let ignored = 0;

  for (const message of recognizedMessages) {
    const result = await processMessage(message);

    if (result === "inserted") {
      inserted++;
    } else if (result === "duplicate") {
      duplicates++;
    } else {
      ignored++;
    }
  }

  if (messages.length > 0) {
  const highestMessageId = Math.max(
    ...messages.map((message) => message.id)
  );

  if (highestMessageId > lastProcessedMessageId) {
    saveCheckpoint(highestMessageId);

    console.log(
      `Checkpoint saved: ${highestMessageId}`
    );
  }
}

  console.log(
    `Poll complete — inserted: ${inserted}, duplicates: ${duplicates}, other: ${ignored}`
  );
}

console.log("========================================");
console.log("Telegram SSD/DD Token Worker");
console.log("========================================");

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

console.log(
  `Polling every ${POLL_INTERVAL_MS / 1000} seconds.`
);

await pollTelegram(channel);

setInterval(async () => {
  try {
    await pollTelegram(channel);
  } catch (error) {
    console.error(
      "Telegram polling error:",
      error
    );
  }
}, POLL_INTERVAL_MS);

process.on("SIGINT", async () => {
  console.log("\nStopping Telegram worker...");

  await telegramClient.disconnect();

  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\nStopping Telegram worker...");

  await telegramClient.disconnect();

  process.exit(0);
});
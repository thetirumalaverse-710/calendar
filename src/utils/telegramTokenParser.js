/**
 * Parse SSD/DD token information from a Telegram channel message.
 *
 * Expected message structure:
 *
 * SSD & DD Tokens Issue Started @ 1.30Am
 *
 * SSD Tokens – Current Status:
 *
 * • Available Tokens: 7966
 *
 * Srivari Mettu Divya Darshan Tokens:
 *
 * • Available Tokens: 1707
 */

export function parseTelegramTokenMessage(rawText) {
  if (!rawText || typeof rawText !== "string") {
    return null;
  }

  const text = rawText
    .replace(/\r/g, "")
    .replace(/[–—−]/g, "-")
    .trim();

  // Make sure this actually looks like an SSD/DD token message.
  const isTokenMessage =
    /SSD\s*&\s*DD\s+Tokens/i.test(text) ||
    /SSD\s+Tokens\s*-\s*Current\s*Status/i.test(text);

  if (!isTokenMessage) {
    return null;
  }

  // SSD
  const ssdMatch = text.match(
    /SSD\s+Tokens[\s\S]*?Available\s+Tokens\s*:\s*([\d,]+)/i
  );

  // DD / Srivari Mettu Divya Darshan
  const ddMatch = text.match(
    /Srivari\s+Mettu\s+Divya\s+Darshan\s+Tokens[\s\S]*?Available\s+Tokens\s*:\s*([\d,]+)/i
  );

  const ssd = ssdMatch
    ? Number(ssdMatch[1].replace(/,/g, ""))
    : null;

  const dd = ddMatch
    ? Number(ddMatch[1].replace(/,/g, ""))
    : null;

  // We require at least one valid token value.
  if (ssd === null && dd === null) {
    return null;
  }

  // Extract the advertised issue-start time if present.
  const issueStartMatch = text.match(
    /Issue\s+Started\s*@\s*([0-9]{1,2}(?:[:.][0-9]{2})?\s*(?:AM|PM)?)/i
  );

  return {
    ssd_remaining: ssd,
    dd_remaining: dd,

    ssd_status: ssd !== null ? "active" : "unknown",
    dd_status: dd !== null ? "active" : "unknown",

    issue_start_text: issueStartMatch
      ? issueStartMatch[1].trim()
      : null,

    source_type: "telegram",

    raw_text: rawText.trim(),
  };
}
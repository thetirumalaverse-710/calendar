/**
 * Parse SSD/DD token information from a Telegram channel message.
 *
 * Handles real-world formats such as:
 *
 * SSD & DD Tokens Issue Started @ 1.30Am
 *
 * SSD Tokens – Current Status:
 * • Available Tokens: 7966
 *
 * Srivari Mettu Divya Darshan Tokens:
 * • Available Tokens: 1707
 *
 * Also handles:
 *
 * SSD Tokens – Current Status:
 * • Quota Completed @ 4:45 AM
 *
 * Srivari Mettu Divya Darshan Tokens:
 * • Quota Completed @ 6:20 AM
 */

export function parseTelegramTokenMessage(rawText) {
  if (!rawText || typeof rawText !== "string") {
    return null;
  }

  const text = rawText
  .replace(/\r/g, "")
  .replace(/[–—−]/g, "-")
  .replace(/[â€“â€”âˆ’]/g, "-")
  .trim();

  // Make sure this looks like an SSD/DD token message.
  const isTokenMessage =
    /SSD\s*&\s*DD\s+Tokens/i.test(text) ||
    /SSD\s+Tokens\s*-\s*Current\s*Status/i.test(text) ||
    /Srivari\s+Mettu\s+Divya\s+Darshan\s+Tokens/i.test(text);

  if (!isTokenMessage) {
    return null;
  }

  /*
   * Extract the SSD section only.
   *
   * The section ends when the DD / Srivari Mettu section begins.
   * This prevents a DD number from accidentally becoming the SSD number.
   */
  const ssdSectionMatch = text.match(
    /SSD\s+Tokens\s*-\s*Current\s*Status\s*:?\s*([\s\S]*?)(?=Srivari\s+Mettu\s+Divya\s+Darshan\s+Tokens|$)/i
  );

  /*
   * Extract the DD section only.
   */
  const ddSectionMatch = text.match(
    /Srivari\s+Mettu\s+Divya\s+Darshan\s+Tokens\s*:?\s*([\s\S]*)$/i
  );

  const ssdSection = ssdSectionMatch
    ? ssdSectionMatch[1]
    : "";

  const ddSection = ddSectionMatch
    ? ddSectionMatch[1]
    : "";

  /*
   * Numeric availability.
   *
   * IMPORTANT:
   * Numbers such as "10K" and "2K" in the opening sentence
   * are quotas, not current remaining-token counts.
   */
  const ssdAvailableMatch = ssdSection.match(
    /Available\s+Tokens\s*:\s*([\d,]+)/i
  );

  const ddAvailableMatch = ddSection.match(
    /Available\s+Tokens\s*:\s*([\d,]+)/i
  );

  const ssd = ssdAvailableMatch
    ? Number(ssdAvailableMatch[1].replace(/,/g, ""))
    : null;

  const dd = ddAvailableMatch
    ? Number(ddAvailableMatch[1].replace(/,/g, ""))
    : null;

  /*
   * Detect quota completion independently for SSD and DD.
   */
  const ssdCompleted = /Quota\s+Completed/i.test(ssdSection);
  const ddCompleted = /Quota\s+Completed/i.test(ddSection);

  /*
   * Determine status.
   */
  const ssdStatus = ssdCompleted
    ? "completed"
    : ssd !== null
    ? "active"
    : "unknown";

  const ddStatus = ddCompleted
    ? "completed"
    : dd !== null
    ? "active"
    : "unknown";

  /*
   * Require at least one meaningful SSD/DD state.
   */
  if (
    ssd === null &&
    dd === null &&
    !ssdCompleted &&
    !ddCompleted
  ) {
    return null;
  }

  /*
   * Extract advertised issue-start time if present.
   *
   * Examples:
   * 1.30Am
   * 1.30 AM
   * 1:30 AM
   */
  const issueStartMatch = text.match(
    /Issue\s+Started\s*@\s*([0-9]{1,2}(?:[:.][0-9]{2})?\s*(?:AM|PM)?)/i
  );

  return {
    ssd_remaining: ssd,
    dd_remaining: dd,

    ssd_status: ssdStatus,
    dd_status: ddStatus,

    issue_start_text: issueStartMatch
      ? issueStartMatch[1].trim()
      : null,

    source_type: "telegram",

    raw_text: rawText.trim(),
  };
}
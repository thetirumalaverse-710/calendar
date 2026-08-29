/**
 * Parse SSD/DD token information from a Telegram channel message.
 *
 * Handles messages such as:
 *
 * SSD & DD Tokens Issue Started @ 12:30Am
 *
 * SSD Tokens – Current Status
 *     Quota Completed @ 2:10Am
 *
 * Srivari Mettu Divya Darshan Tokens
 *     Quota Completed @ 2:50Am
 *
 * Also handles availability updates such as:
 *
 * SSD Tokens – Current Status:
 *     Available Tokens: 7966
 *
 * Srivari Mettu Divya Darshan Tokens:
 *     Available Tokens: 1707
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

  /*
   * Make sure this looks like an SSD/DD token message.
   */
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
   * Extract current SSD availability.
   */
  const ssdAvailableMatch = ssdSection.match(
    /Available\s+Tokens\s*:\s*([\d,]+)/i
  );

  /*
   * Extract current DD availability.
   */
  const ddAvailableMatch = ddSection.match(
    /Available\s+Tokens\s*:\s*([\d,]+)/i
  );

  const ssd = ssdAvailableMatch
    ? Number(
        ssdAvailableMatch[1].replace(/,/g, "")
      )
    : null;

  const dd = ddAvailableMatch
    ? Number(
        ddAvailableMatch[1].replace(/,/g, "")
      )
    : null;

  /*
   * Detect quota completion independently.
   */
  const ssdCompleted =
    /Quota\s+Completed/i.test(ssdSection);

  const ddCompleted =
    /Quota\s+Completed/i.test(ddSection);

  /*
   * Extract SSD completion time.
   *
   * Example:
   * Quota Completed @ 2:10Am
   */
  const ssdCompletedMatch =
    ssdSection.match(
      /Quota\s+Completed\s*@\s*([0-9]{1,2}(?:[:.][0-9]{2})?\s*(?:AM|PM)?)/i
    );

  /*
   * Extract DD completion time.
   *
   * Example:
   * Quota Completed @ 2:50Am
   */
  const ddCompletedMatch =
    ddSection.match(
      /Quota\s+Completed\s*@\s*([0-9]{1,2}(?:[:.][0-9]{2})?\s*(?:AM|PM)?)/i
    );

  const ssdCompletedAtText =
    ssdCompletedMatch
      ? ssdCompletedMatch[1].trim()
      : null;

  const ddCompletedAtText =
    ddCompletedMatch
      ? ddCompletedMatch[1].trim()
      : null;

  /*
   * Determine SSD/DD status.
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
   * Extract advertised issuance start time.
   *
   * Examples:
   * 12:30Am
   * 12.30 AM
   * 1:30 AM
   */
  const issueStartMatch = text.match(
    /Issue\s+Started\s*@\s*([0-9]{1,2}(?:[:.][0-9]{2})?\s*(?:AM|PM)?)/i
  );

  const issueStartText =
    issueStartMatch
      ? issueStartMatch[1].trim()
      : null;

  /*
   * A message is meaningful if it contains:
   *
   * - SSD availability
   * - DD availability
   * - SSD completion
   * - DD completion
   * - issuance start time
   */
  if (
    ssd === null &&
    dd === null &&
    !ssdCompleted &&
    !ddCompleted &&
    !issueStartText
  ) {
    return null;
  }

  return {
    ssd_remaining: ssd,
    dd_remaining: dd,

    ssd_status: ssdStatus,
    dd_status: ddStatus,

    issue_start_text: issueStartText,

    ssd_completed_at_text:
      ssdCompletedAtText,

    dd_completed_at_text:
      ddCompletedAtText,

    source_type: "telegram",

    raw_text: rawText.trim(),
  };
}
/**
 * Navigation utility helpers for accessible, crawlable History API SPA routing.
 */

/**
 * Determines whether a mouse or keyboard click event should be treated as a
 * modified click (e.g. Cmd-click, Ctrl-click, Shift-click, or middle-click).
 * When true, the event must NOT be prevented, allowing the browser to perform
 * its native behavior (opening in a new tab, new window, etc.).
 *
 * @param {MouseEvent|KeyboardEvent} event
 * @returns {boolean}
 */
export function isModifiedClick(event) {
  return (
    event.metaKey ||
    event.altKey ||
    event.ctrlKey ||
    event.shiftKey ||
    (event.button !== undefined && event.button !== 0)
  );
}

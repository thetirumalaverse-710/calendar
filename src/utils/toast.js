/**
 * Global Toast Event Emitter for Tirumala Verse
 * Allows any utility, component, or hook to trigger custom in-app notifications.
 */

const listeners = new Set();

export function subscribeToast(listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function showToast(message, type = 'info', duration = 4000) {
  const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
  listeners.forEach(listener => listener({ id, message, type, duration }));
}

export const toast = {
  success: (msg, duration) => showToast(msg, 'success', duration),
  warning: (msg, duration) => showToast(msg, 'warning', duration),
  error: (msg, duration) => showToast(msg, 'error', duration),
  info: (msg, duration) => showToast(msg, 'info', duration),
};

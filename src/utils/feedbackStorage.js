const STORAGE_KEY = 'tirumala_feedback_submissions';

export function loadStoredFeedback() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
    return [
      {
        id: 'fb-demo-1',
        refNumber: 'TU-2026-000101',
        feedbackType: 'Feature Request',
        title: 'Add Google Calendar Reminders for Abhishekam',
        description: 'It would be great to have direct notification reminders before early morning Abhishekam on Fridays.',
        name: 'Srinivas R.',
        email: 'srinivas@example.com',
        pageUrl: 'http://localhost:3000/',
        browser: 'Google Chrome',
        operatingSystem: 'Windows OS',
        deviceType: 'Desktop',
        screenshotUrl: null,
        status: 'Planned',
        adminNotes: 'Integrated .ics calendar download buttons across all event cards.',
        createdAt: '2026-07-26T10:00:00Z',
        updatedAt: '2026-07-27T12:00:00Z'
      }
    ];
  } catch (e) {
    console.error('Error loading feedback from storage:', e);
    return [];
  }
}

export function saveStoredFeedback(feedbackList) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(feedbackList));
  } catch (e) {
    console.error(e);
  }
}

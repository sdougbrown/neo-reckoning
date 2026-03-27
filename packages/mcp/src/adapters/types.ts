import type { DateRange } from '@neo-reckoning/core';

/** Google Calendar event as returned by gcal_list_events (condensed format). */
export interface GCalEvent {
  id: string;
  summary?: string;
  description?: string;
  location?: string;
  start: { date?: string; dateTime?: string; timeZone?: string };
  end: { date?: string; dateTime?: string; timeZone?: string };
  allDay: boolean;
  status: string;
  eventType?: string;
  transparency?: string;
  myResponseStatus?: string;
  numAttendees?: number;
  recurringEventId?: string;
  htmlLink?: string;
  visibility?: string;
  creator?: { email?: string; displayName?: string; self?: boolean };
  organizer?: { email?: string; displayName?: string; self?: boolean };
  recurrence?: string[];
  hasAttachments?: boolean;
}

export interface GCalAdapterOptions {
  /** Include tentative events as blocking (default: true) */
  includeTentative?: boolean;
  /** Include transparent/FYI events (default: false) */
  includeTransparent?: boolean;
  /** Fallback label for events with no summary (default: "(busy)") */
  fallbackLabel?: string;
}

export type { DateRange };

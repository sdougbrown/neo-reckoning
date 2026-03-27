import { formatDate, parseDate } from '@neo-reckoning/core';

import type { DateRange } from '@neo-reckoning/core';

import type { GCalAdapterOptions, GCalEvent } from './types.js';

export function isBlockingEvent(event: GCalEvent, options: GCalAdapterOptions = {}): boolean {
  if (event.status === 'cancelled') return false;
  if (event.eventType === 'workingLocation' || event.eventType === 'birthday') return false;
  if (event.transparency === 'transparent' && options.includeTransparent !== true) return false;
  if (event.myResponseStatus === 'declined') return false;
  if (event.myResponseStatus === 'tentative' && options.includeTentative === false) return false;
  return true;
}

export function subtractOneDay(dateStr: string): string {
  const { year, month, day } = parseDate(dateStr);
  const date = new Date(year, month, day);
  date.setDate(date.getDate() - 1);
  return formatDate(date);
}

export function gcalEventToDateRange(event: GCalEvent, options: GCalAdapterOptions = {}): DateRange {
  const metadata: Record<string, unknown> = {
    gcalId: event.id,
  };

  if (event.eventType) metadata.eventType = event.eventType;
  if (event.myResponseStatus) metadata.responseStatus = event.myResponseStatus;
  if (event.transparency) metadata.transparency = event.transparency;
  if (event.numAttendees) metadata.numAttendees = event.numAttendees;
  if (event.recurringEventId) metadata.recurringEventId = event.recurringEventId;
  if (event.htmlLink) metadata.htmlLink = event.htmlLink;

  if (event.allDay) {
    return {
      id: event.id,
      label: event.summary ?? options.fallbackLabel ?? '(busy)',
      fromDate: event.start.date,
      toDate: subtractOneDay(event.end.date!),
      metadata,
    };
  }

  const startDateTime = event.start.dateTime!;
  const endDateTime = event.end.dateTime!;

  return {
    id: event.id,
    label: event.summary ?? options.fallbackLabel ?? '(busy)',
    fromDate: startDateTime.slice(0, 10),
    toDate: endDateTime.slice(0, 10),
    startTime: startDateTime.slice(11, 16),
    endTime: endDateTime.slice(11, 16),
    timezone: event.start.timeZone,
    metadata,
  };
}

export function gcalEventsToDateRanges(events: GCalEvent[], options: GCalAdapterOptions = {}): DateRange[] {
  return events.filter(event => isBlockingEvent(event, options)).map(event => gcalEventToDateRange(event, options));
}

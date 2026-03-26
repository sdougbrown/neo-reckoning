import { RangeEvaluator, expandToEvents } from '@neo-reckoning/core';
import type { DateRange, CalendarEvent } from '@neo-reckoning/core';

export interface CalendarEventsModelConfig {
  /** Native DateRanges from the API */
  ranges: DateRange[];
  /** Imported events from @neo-reckoning/ical, already CalendarEvent[] */
  importedEvents: CalendarEvent[];
  /** View window start */
  from: Date;
  /** View window end */
  to: Date;
  /** User's timezone */
  userTimezone?: string;
}

export function buildCalendarEvents(config: CalendarEventsModelConfig): CalendarEvent[] {
  const { ranges, importedEvents, from, to, userTimezone } = config;
  const evaluator = new RangeEvaluator(userTimezone);

  const nativeEvents = ranges.flatMap(range => {
    const occurrences = evaluator.expand(range, from, to);
    return expandToEvents(range, occurrences);
  });

  const allEvents = [...nativeEvents, ...importedEvents];
  allEvents.sort((a, b) => a.start.getTime() - b.start.getTime());

  return allEvents;
}

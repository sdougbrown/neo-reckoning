import { useMemo } from 'react';
import { RangeEvaluator, expandToEvents } from '@neo-reckoning/core';
import type { DateRange, CalendarEvent } from '@neo-reckoning/core';

export interface UseCalendarEventsConfig {
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

/**
 * Event normalization hook — merges native ranges and imported events
 * into a single CalendarEvent[] for the rendering pipeline.
 */
export function useCalendarEvents(config: UseCalendarEventsConfig): CalendarEvent[] {
  const { ranges, importedEvents, from, to, userTimezone } = config;

  return useMemo(() => {
    const evaluator = new RangeEvaluator(userTimezone);

    // Expand native ranges into CalendarEvents
    const nativeEvents = ranges.flatMap(range => {
      const occurrences = evaluator.expand(range, from, to);
      return expandToEvents(range, occurrences);
    });

    // Merge with imported events
    const allEvents = [...nativeEvents, ...importedEvents];

    // Sort by start time
    allEvents.sort((a, b) => a.start.getTime() - b.start.getTime());

    return allEvents;
  }, [ranges, importedEvents, from, to, userTimezone]);
}

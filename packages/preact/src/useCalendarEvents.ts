import { useMemo } from 'preact/hooks';
import { buildCalendarEvents } from '@neo-reckoning/models';
import type { CalendarEventsModelConfig } from '@neo-reckoning/models';
import type { CalendarEvent } from '@neo-reckoning/core';

export interface UseCalendarEventsConfig extends CalendarEventsModelConfig {}

export function useCalendarEvents(config: UseCalendarEventsConfig): CalendarEvent[] {
  const { ranges, importedEvents, from, to, userTimezone } = config;

  return useMemo(() => {
    return buildCalendarEvents({
      ranges,
      importedEvents,
      from,
      to,
      userTimezone,
    });
  }, [ranges, importedEvents, from, to, userTimezone]);
}

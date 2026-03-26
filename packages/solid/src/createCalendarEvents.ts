import { createMemo, type Accessor } from 'solid-js';
import { buildCalendarEvents } from '@neo-reckoning/models';
import type { CalendarEventsModelConfig } from '@neo-reckoning/models';
import type { CalendarEvent } from '@neo-reckoning/core';
import { toAccessor, type MaybeAccessor } from './utils.js';

export function createCalendarEvents(
  config: MaybeAccessor<CalendarEventsModelConfig>,
): Accessor<CalendarEvent[]> {
  const resolvedConfig = toAccessor(config);
  return createMemo(() => buildCalendarEvents(resolvedConfig()));
}

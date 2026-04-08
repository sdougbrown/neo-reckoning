import { createMemo, type Accessor } from 'solid-js';
import { buildCalendarEvents } from '@daywatch/cal-models';
import type { CalendarEventsModelConfig } from '@daywatch/cal-models';
import type { CalendarEvent } from '@daywatch/cal';
import { toAccessor, type MaybeAccessor } from './utils.js';

export function createCalendarEvents(
  config: MaybeAccessor<CalendarEventsModelConfig>,
): Accessor<CalendarEvent[]> {
  const resolvedConfig = toAccessor(config);
  return createMemo(() => buildCalendarEvents(resolvedConfig()));
}

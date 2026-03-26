import { TimelineGrid } from '@neo-reckoning/core';
import type { CalendarEvent, TimelineSlot } from '@neo-reckoning/core';

export interface TimelineModelConfig {
  /** Which day (YYYY-MM-DD) */
  date: string;
  /** Normalized events for this day */
  events: CalendarEvent[];
  /** Start hour (0-23). Default: 0 */
  startHour?: number;
  /** End hour (1-24). Default: 24 */
  endHour?: number;
  /** Slot granularity in minutes: 15, 30, or 60. Default: 60 */
  intervalMinutes?: number;
}

export interface TimelineModel {
  /** Timeline slots with positioned events */
  slots: TimelineSlot[];
}

export function buildTimelineModel(config: TimelineModelConfig): TimelineModel {
  const { date, events, startHour, endHour, intervalMinutes } = config;

  const grid = new TimelineGrid({
    date,
    events,
    startHour,
    endHour,
    intervalMinutes,
  });

  return { slots: grid.slots };
}

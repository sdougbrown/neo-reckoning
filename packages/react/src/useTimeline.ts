import { useMemo } from 'react';
import { TimelineGrid } from '@neo-reckoning/core';
import type { CalendarEvent, TimelineSlot } from '@neo-reckoning/core';

export interface UseTimelineConfig {
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

export interface UseTimelineResult {
  /** Timeline slots with positioned events */
  slots: TimelineSlot[];
}

/**
 * Timeline hook — produces positioned timeline data for day views.
 */
export function useTimeline(config: UseTimelineConfig): UseTimelineResult {
  const { date, events, startHour, endHour, intervalMinutes } = config;

  const slots = useMemo(() => {
    const grid = new TimelineGrid({
      date,
      events,
      startHour,
      endHour,
      intervalMinutes,
    });
    return grid.slots;
  }, [date, events, startHour, endHour, intervalMinutes]);

  return { slots };
}

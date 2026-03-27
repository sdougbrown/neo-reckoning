import type { DateRange } from '@neo-reckoning/core';
import { RangeEvaluator } from '@neo-reckoning/core';

export interface LoadedCalendar {
  ranges: DateRange[];
  source: 'ics' | 'ranges';
}

export class CalendarSession {
  calendars: Map<string, LoadedCalendar>;
  timezone: string;
  evaluator: RangeEvaluator;
  private nextCalendarNumber: number;

  constructor(timezone?: string) {
    this.timezone = timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone;
    this.evaluator = new RangeEvaluator(this.timezone);
    this.calendars = new Map();
    this.nextCalendarNumber = 1;
  }

  createCalendarId(id?: string): string {
    if (id && id.trim()) {
      return id;
    }

    let nextId = `calendar-${this.nextCalendarNumber}`;
    while (this.calendars.has(nextId)) {
      this.nextCalendarNumber += 1;
      nextId = `calendar-${this.nextCalendarNumber}`;
    }

    this.nextCalendarNumber += 1;
    return nextId;
  }

  loadCalendar(id: string, ranges: DateRange[], source: 'ics' | 'ranges'): void {
    const calendarId = this.createCalendarId(id);
    this.calendars.set(calendarId, {
      ranges: [...ranges],
      source,
    });
  }

  getAllRanges(calendarIds?: string[]): DateRange[] {
    if (!calendarIds || calendarIds.length === 0) {
      return [...this.calendars.values()].flatMap(calendar => calendar.ranges);
    }

    const selectedIds = new Set(calendarIds);
    const ranges: DateRange[] = [];

    for (const [calendarId, calendar] of this.calendars.entries()) {
      if (selectedIds.has(calendarId)) {
        ranges.push(...calendar.ranges);
      }
    }

    return ranges;
  }

  getCalendarSummary(): Array<{ id: string; rangeCount: number; labels: string[] }> {
    return [...this.calendars.entries()].map(([id, calendar]) => ({
      id,
      rangeCount: calendar.ranges.length,
      labels: [...new Set(calendar.ranges.map(range => range.label))],
    }));
  }
}

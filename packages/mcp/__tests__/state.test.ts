import type { DateRange } from '@neo-reckoning/core';

import { CalendarSession } from '../src/state.js';

function makeRange(id: string, label: string, overrides: Partial<DateRange> = {}): DateRange {
  return {
    id,
    label,
    dates: ['2026-03-26'],
    ...overrides,
  };
}

describe('CalendarSession', () => {
  it('loadCalendar accumulates calendars and flattens their ranges', () => {
    const session = new CalendarSession('UTC');

    session.loadCalendar('work', [makeRange('meeting', 'Meeting')], 'ranges');
    session.loadCalendar('personal', [makeRange('gym', 'Gym')], 'ics');

    expect(session.calendars.size).toBe(2);
    expect(session.getAllRanges().map(range => range.id)).toEqual(['meeting', 'gym']);
  });

  it('getAllRanges filters by calendar id', () => {
    const session = new CalendarSession('UTC');

    session.loadCalendar('work', [makeRange('meeting', 'Meeting')], 'ranges');
    session.loadCalendar('personal', [makeRange('gym', 'Gym')], 'ics');

    expect(session.getAllRanges(['personal'])).toEqual([makeRange('gym', 'Gym')]);
    expect(session.getAllRanges(['missing'])).toEqual([]);
  });

  it('getCalendarSummary returns the expected shape', () => {
    const session = new CalendarSession('UTC');

    session.loadCalendar(
      'work',
      [
        makeRange('planning', 'Planning'),
        makeRange('retro', 'Planning', { dates: ['2026-03-27'] }),
        makeRange('focus', 'Focus'),
      ],
      'ranges',
    );

    expect(session.getCalendarSummary()).toEqual([
      {
        id: 'work',
        rangeCount: 3,
        labels: ['Planning', 'Focus'],
      },
    ]);
  });

  it('createCalendarId generates sequential default ids', () => {
    const session = new CalendarSession('UTC');

    const first = session.createCalendarId();
    session.loadCalendar(first, [makeRange('meeting', 'Meeting')], 'ranges');
    const second = session.createCalendarId();

    expect(first).toBe('calendar-1');
    expect(second).toBe('calendar-2');
  });
});

import { TimelineGrid } from '@daywatch/cal';
import type { CalendarEvent } from '@daywatch/cal';
import { buildTimelineModel } from '../src/timeline.js';

describe('buildTimelineModel', () => {
  it('matches TimelineGrid slot generation', () => {
    const events: CalendarEvent[] = [
      {
        id: 'event-1',
        title: 'Meeting',
        start: new Date(2026, 2, 23, 9, 0),
        end: new Date(2026, 2, 23, 10, 30),
        allDay: false,
        source: 'native',
        sourceId: 'range-1',
        editable: true,
      },
    ];

    const model = buildTimelineModel({
      date: '2026-03-23',
      events,
      startHour: 8,
      endHour: 12,
      intervalMinutes: 60,
    });

    const grid = new TimelineGrid({
      date: '2026-03-23',
      events,
      startHour: 8,
      endHour: 12,
      intervalMinutes: 60,
    });

    expect(model.slots).toEqual(grid.slots);
  });
});

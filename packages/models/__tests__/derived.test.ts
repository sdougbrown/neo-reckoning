import { buildCalendarEvents } from '../src/calendarEvents.js';
import { buildTimelineModel } from '../src/timeline.js';
import { createRangeCheck } from '../src/rangeCheck.js';
import { buildConflictsModel } from '../src/conflicts.js';
import { buildFreeSlotsModel } from '../src/freeSlots.js';
import { buildYearGridModel } from '../src/yearGrid.js';
import type { DateRange } from '@neo-reckoning/core';

describe('derived model helpers', () => {
  const timedRange: DateRange = {
    id: 'range-1',
    label: 'Morning focus',
    dates: ['2026-03-23'],
    startTime: '09:00',
    endTime: '10:00',
  };

  it('builds merged calendar events', () => {
    const importedStart = new Date('2026-03-23T12:00:00.000Z');
    const events = buildCalendarEvents({
      ranges: [timedRange],
      importedEvents: [
        {
          id: 'imported-1',
          title: 'Imported',
          start: importedStart,
          end: new Date('2026-03-23T13:00:00.000Z'),
          allDay: false,
          source: 'imported',
          sourceId: 'sub-1',
          editable: false,
        },
      ],
      from: new Date('2026-03-23T00:00:00.000Z'),
      to: new Date('2026-03-24T00:00:00.000Z'),
    });

    expect(events).toHaveLength(2);
    expect(events.map(event => event.id)).toContain('range-1:2026-03-23:09:00');
    expect(events.map(event => event.id)).toContain('imported-1');
  });

  it('creates range check helpers', () => {
    const rangeCheck = createRangeCheck([timedRange]);

    expect(rangeCheck.isInRange(new Date(2026, 2, 23, 9, 30))).toHaveLength(1);
    expect(
      rangeCheck.getOccurrences(
        new Date('2026-03-23T00:00:00.000Z'),
        new Date('2026-03-24T00:00:00.000Z'),
      ),
    ).toHaveLength(1);
  });

  it('builds timeline slots from events', () => {
    const model = buildTimelineModel({
      date: '2026-03-23',
      events: [
        {
          id: 'event-1',
          title: 'Meeting',
          start: new Date(2026, 2, 23, 9, 0),
          end: new Date(2026, 2, 23, 10, 0),
          allDay: false,
          source: 'native',
          sourceId: 'range-1',
          editable: true,
        },
      ],
      startHour: 9,
      endHour: 11,
      intervalMinutes: 60,
    });

    expect(model.slots).toHaveLength(2);
    expect(model.slots.some(slot => slot.events.length === 1)).toBe(true);
  });

  it('builds conflicts and free slots from ranges', () => {
    const overlappingRange: DateRange = {
      id: 'range-2',
      label: 'Standup',
      dates: ['2026-03-23'],
      startTime: '09:30',
      endTime: '10:30',
    };

    const conflicts = buildConflictsModel({
      ranges: [timedRange, overlappingRange],
      from: new Date('2026-03-23T00:00:00.000Z'),
      to: new Date('2026-03-24T00:00:00.000Z'),
    });

    const freeSlots = buildFreeSlotsModel({
      ranges: [timedRange],
      date: '2026-03-23',
      dayStart: '08:00',
      dayEnd: '11:00',
      minDuration: 30,
    });

    expect(conflicts).toHaveLength(1);
    expect(freeSlots).toEqual([
      { date: '2026-03-23', startTime: '08:00', endTime: '09:00', duration: 60 },
      { date: '2026-03-23', startTime: '10:00', endTime: '11:00', duration: 60 },
    ]);
  });

  it('builds year grid activity data', () => {
    const model = buildYearGridModel({
      year: 2026,
      ranges: [timedRange],
    });

    expect(model.months).toHaveLength(12);
    expect(model.months[2]?.activeDays).toBe(1);
  });
});

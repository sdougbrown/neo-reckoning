import { RangeEvaluator, YearGrid, scoreSchedule } from '@daywatch/cal';
import type { DateRange } from '@daywatch/cal';
import { buildConflictsModel } from '../src/conflicts.js';
import { buildFreeSlotsModel } from '../src/freeSlots.js';
import { buildScheduleScoreModel } from '../src/scheduleScore.js';
import { buildSpansModel } from '../src/spans.js';
import { buildYearGridModel } from '../src/yearGrid.js';

describe('scheduling model parity', () => {
  const ranges: DateRange[] = [
    {
      id: 'a',
      label: 'Focus',
      dates: ['2026-03-23'],
      startTime: '09:00',
      endTime: '10:30',
    },
    {
      id: 'b',
      label: 'Standup',
      dates: ['2026-03-23'],
      startTime: '10:00',
      endTime: '11:00',
    },
    {
      id: 'c',
      label: 'Trip',
      fromDate: '2026-03-22',
      toDate: '2026-03-24',
    },
  ];

  it('matches core conflict, free-slot, span, schedule-score, and year-grid outputs', () => {
    const evaluator = new RangeEvaluator();
    const from = new Date('2026-03-22T00:00:00.000Z');
    const to = new Date('2026-03-25T00:00:00.000Z');

    expect(
      buildConflictsModel({
        ranges,
        from,
        to,
      }),
    ).toEqual(evaluator.findConflictsInWindow(ranges, from, to));

    expect(
      buildFreeSlotsModel({
        ranges,
        date: '2026-03-23',
        dayStart: '08:00',
        dayEnd: '12:00',
        minDuration: 15,
      }),
    ).toEqual(
      evaluator.findFreeSlots(ranges, '2026-03-23', {
        dayStart: '08:00',
        dayEnd: '12:00',
        minDuration: 15,
      }),
    );

    expect(
      buildSpansModel({
        ranges,
        from,
        to,
      }),
    ).toEqual(evaluator.computeSpans(ranges, from, to));

    expect(
      buildScheduleScoreModel({
        ranges,
        from,
        to,
        focusBlockMinutes: 60,
        dayStart: '08:00',
        dayEnd: '18:00',
      }),
    ).toEqual(
      scoreSchedule(evaluator, ranges, from, to, {
        focusBlockMinutes: 60,
        dayStart: '08:00',
        dayEnd: '18:00',
      }),
    );

    expect(
      buildYearGridModel({
        year: 2026,
        ranges,
      }).months,
    ).toEqual(
      new YearGrid({
        year: 2026,
        ranges,
      }).months,
    );
  });
});

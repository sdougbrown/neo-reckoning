import type { DateRange } from '@neo-reckoning/core';
import { buildDayDetailModel } from '../src/dayDetail.js';

describe('buildDayDetailModel', () => {
  it('returns timed slots and all-day span flags for a date', () => {
    const timedRange: DateRange = {
      id: 'timed',
      label: 'Workout',
      dates: ['2026-03-23'],
      startTime: '09:00',
      endTime: '10:00',
    };
    const allDayRange: DateRange = {
      id: 'all-day',
      label: 'Conference',
      fromDate: '2026-03-22',
      toDate: '2026-03-24',
    };

    const detail = buildDayDetailModel('2026-03-23', [timedRange, allDayRange]);

    expect(detail.timeSlots).toEqual([
      {
        startTime: '09:00',
        endTime: '10:00',
        duration: 60,
        rangeId: 'timed',
        label: 'Workout',
      },
    ]);
    expect(detail.allDayRanges).toEqual([
      {
        rangeId: 'all-day',
        label: 'Conference',
        isStart: false,
        isEnd: false,
        isContinuation: true,
      },
    ]);
  });
});

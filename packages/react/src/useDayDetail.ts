import { useMemo } from 'react';
import { RangeEvaluator } from '@neo-reckoning/core';
import type { DateRange, TimeSlot, DayRangeInfo } from '@neo-reckoning/core';

export interface UseDayDetailResult {
  /** Sub-day time slots for the given day */
  timeSlots: TimeSlot[];
  /** All-day range memberships */
  allDayRanges: DayRangeInfo[];
}

/**
 * Day detail hook — provides time slots and all-day range info for a specific day.
 * Used for day-view and week-view rendering.
 */
export function useDayDetail(
  date: string,
  ranges: DateRange[],
  userTimezone?: string,
): UseDayDetailResult {
  return useMemo(() => {
    const evaluator = new RangeEvaluator(userTimezone);

    const timeSlots: TimeSlot[] = [];
    const allDayRanges: DayRangeInfo[] = [];

    for (const range of ranges) {
      if (!evaluator.isDateInRange(date, range)) continue;

      const slots = evaluator.expandDay(range, date);
      if (slots.length > 0) {
        timeSlots.push(...slots);
      } else {
        // All-day range — compute span info
        const prevDate = shiftDay(date, -1);
        const nextDate = shiftDay(date, 1);
        const prevInRange = evaluator.isDateInRange(prevDate, range);
        const nextInRange = evaluator.isDateInRange(nextDate, range);

        allDayRanges.push({
          rangeId: range.id,
          label: range.label,
          isStart: !prevInRange,
          isEnd: !nextInRange,
          isContinuation: prevInRange && nextInRange,
        });
      }
    }

    // Sort time slots by start time
    timeSlots.sort((a, b) => {
      const aMin = parseInt(a.startTime.split(':')[0]) * 60 + parseInt(a.startTime.split(':')[1]);
      const bMin = parseInt(b.startTime.split(':')[0]) * 60 + parseInt(b.startTime.split(':')[1]);
      return aMin - bMin;
    });

    return { timeSlots, allDayRanges };
  }, [date, ranges, userTimezone]);
}

function shiftDay(dateStr: string, delta: number): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d + delta);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

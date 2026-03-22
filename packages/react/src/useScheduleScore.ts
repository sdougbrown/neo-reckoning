import { useMemo } from 'react';
import { RangeEvaluator, scoreSchedule } from '@neo-reckoning/core';
import type { DateRange, ScheduleScore } from '@neo-reckoning/core';

export interface UseScheduleScoreConfig {
  ranges: DateRange[];
  from: Date;
  to: Date;
  focusBlockMinutes?: number;
  dayStart?: string;
  dayEnd?: string;
  userTimezone?: string;
}

/**
 * Compute a ScheduleScore for a set of ranges across a date window.
 * Re-computes when inputs change.
 */
export function useScheduleScore(config: UseScheduleScoreConfig): ScheduleScore {
  const {
    ranges,
    from,
    to,
    focusBlockMinutes,
    dayStart,
    dayEnd,
    userTimezone,
  } = config;

  const evaluator = useMemo(
    () => new RangeEvaluator(userTimezone),
    [userTimezone],
  );

  const score = useMemo(
    () =>
      scoreSchedule(evaluator, ranges, from, to, {
        focusBlockMinutes,
        dayStart,
        dayEnd,
      }),
    [evaluator, ranges, from, to, focusBlockMinutes, dayStart, dayEnd],
  );

  return score;
}

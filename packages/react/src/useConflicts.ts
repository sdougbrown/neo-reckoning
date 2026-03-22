import { useMemo } from 'react';
import { RangeEvaluator } from '@neo-reckoning/core';
import type { DateRange, Conflict } from '@neo-reckoning/core';

export interface UseConflictsConfig {
  /** DateRanges to check for conflicts */
  ranges: DateRange[];
  /** Start of the window */
  from: Date;
  /** End of the window */
  to: Date;
  /** User's timezone for range evaluation */
  userTimezone?: string;
}

/**
 * Conflict detection hook — returns Conflict[] for all time-level conflicts
 * between ranges within the given date window.
 */
export function useConflicts(config: UseConflictsConfig): Conflict[] {
  const { ranges, from, to, userTimezone } = config;

  const evaluator = useMemo(
    () => new RangeEvaluator(userTimezone),
    [userTimezone],
  );

  const conflicts = useMemo(
    () => evaluator.findConflictsInWindow(ranges, from, to),
    [evaluator, ranges, from, to],
  );

  return conflicts;
}

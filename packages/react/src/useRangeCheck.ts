import { useMemo } from 'react';
import { RangeEvaluator } from '@neo-reckoning/core';
import type { DateRange, Occurrence } from '@neo-reckoning/core';

export interface UseRangeCheckResult {
  /** Check which ranges a datetime falls within */
  isInRange: (datetime: Date) => DateRange[];
  /** Expand all ranges within a window */
  getOccurrences: (from: Date, to: Date) => Occurrence[];
}

/**
 * Range evaluation hook — provides isInRange checks and occurrence expansion.
 */
export function useRangeCheck(
  ranges: DateRange[],
  userTimezone?: string,
): UseRangeCheckResult {
  const evaluator = useMemo(
    () => new RangeEvaluator(userTimezone),
    [userTimezone],
  );

  const isInRange = useMemo(() => {
    return (datetime: Date): DateRange[] => {
      return ranges.filter(r => evaluator.isInRange(datetime, r));
    };
  }, [ranges, evaluator]);

  const getOccurrences = useMemo(() => {
    return (from: Date, to: Date): Occurrence[] => {
      return ranges.flatMap(r => evaluator.expand(r, from, to));
    };
  }, [ranges, evaluator]);

  return { isInRange, getOccurrences };
}

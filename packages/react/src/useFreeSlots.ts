import { useMemo } from 'react';
import { buildFreeSlotsModel } from '@daywatch/cal-models';
import type { FreeSlotsModelConfig } from '@daywatch/cal-models';
import type { FreeSlot } from '@daywatch/cal';

/**
 * React hook that computes free (unoccupied) time slots for a given date.
 * Wraps RangeEvaluator.findFreeSlots() with memoisation.
 */
export function useFreeSlots(config: FreeSlotsModelConfig): FreeSlot[] {
  const { ranges, date, minDuration, dayStart, dayEnd, userTimezone } = config;

  return useMemo(
    () =>
      buildFreeSlotsModel({
        ranges,
        date,
        minDuration,
        dayStart,
        dayEnd,
        userTimezone,
      }),
    [ranges, date, minDuration, dayStart, dayEnd, userTimezone],
  );
}

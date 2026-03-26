import { useMemo } from 'preact/hooks';
import { createRangeCheck } from '@neo-reckoning/models';
import type { RangeCheck } from '@neo-reckoning/models';
import type { DateRange } from '@neo-reckoning/core';

export function useRangeCheck(
  ranges: DateRange[],
  userTimezone?: string,
): RangeCheck {
  return useMemo(() => createRangeCheck(ranges, userTimezone), [ranges, userTimezone]);
}

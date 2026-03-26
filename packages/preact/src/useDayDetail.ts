import { useMemo } from 'preact/hooks';
import { buildDayDetailModel } from '@neo-reckoning/models';
import type { DayDetailModel } from '@neo-reckoning/models';
import type { DateRange } from '@neo-reckoning/core';

export function useDayDetail(
  date: string,
  ranges: DateRange[],
  userTimezone?: string,
): DayDetailModel {
  return useMemo(() => buildDayDetailModel(date, ranges, userTimezone), [date, ranges, userTimezone]);
}
